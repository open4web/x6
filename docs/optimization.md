# x6 优化分析

收银机打开的是整包前端。下面按「先让首屏变小，再让点餐不卡，再补可靠性和工程债」排列。每一条都对应现在仓库里的代码。

测量日期：2026-11-06。

## 先做这几件

| 优先级 | 改动 | 收益 |
| --- | --- | --- |
| P0 | 交接班、当日销售、摄像头扫码改成进入时再加载 | 首包去掉 antd、recharts、html5-qrcode |
| P0 | 生产构建关掉 React profiling，别把整份 `process.env` 打进包，nginx 开 gzip 和静态资源长缓存 | 运行更快，传输更小，构建机环境变量不会进浏览器 |
| P0 | 商品卡不要订阅整份购物车 Context；顶栏时钟单独成组件 | 点一道菜、走一秒，不再重绘整墙菜品 |
| P1 | 分类在 2 分钟缓存内不要每次都回源；库存补丁不要整表 `JSON.stringify` | 弱网切分类更稳，主线程更轻 |
| P1 | 扫码付款改成超时拼包；请求带超时并每次读登录态 | 少丢付款码、少挂死请求 |
| P2 | 删掉未使用依赖，把现有 `*.test.ts` 放进 CI | 安装和回归成本下降 |

## 怎么量的

当前源码用 esbuild 从 `src/index.tsx` 打了一个未压缩包（2026-11-06）：产物 8.5MB，gzip 1.65MB。这是「从入口能走到的模块」上限，比 Vite 生产包大，因为还没做压缩和更彻底的摇树。输入字节：

| 块 | 约 |
| --- | --- |
| MUI / Emotion | 8.2MB |
| antd + rc-* | 6.1MB |
| react-admin（含 ra-core / ra-ui） | 1.6MB |
| html5-qrcode | 1.2MB |
| recharts | 1.0MB |
| date-fns | 588KB |
| lodash | 202KB |

date-fns 是 `ra-core` 的 `export * from './inference'` 带进来的，业务代码没有直接引用。

本地 `dist/` 是 2026-08-19 的产物，而且有两份互不引用的入口：

- `dist/index.html` 加载 `index.11ae804e.js`（965KB，gzip 306KB）。source map 仍指向已经不存在的 `src/pages/base/login`。
- `index.79e2d825.js`（2.8MB，gzip 867KB）才是当时的点餐包，HTML 没有引用它。里面同样包含 antd、recharts、html5-qrcode。

线上体积以 CI 的 `yarn build` 为准。`.gitignore` 已忽略 `dist/`。当前源码的静态 import 和那份 2.8MB 点餐包是同一条链：首页会把三套大库打进同一个入口。

## 首包和启动

### 点餐页把三套大库静态引进来

`src/pages/dashboard/MyHome.tsx` 直接 import 了购物车、订单、当日销售、充值、交接班。交接班 `src/pages/Shift/Handover.tsx` 使用 antd Table。当日销售 `src/pages/dashboard/MyData.tsx` 使用 recharts。付款 `src/common/PayChannel.tsx` import `src/common/ScanCode.tsx`，后者顶层 import `html5-qrcode`。

收银员打开点餐页就会下载这三块，即使用现金、不看报表、不交接班。`App.tsx` 里只有 react-admin 的语言包走了 `import()`。管理页 `StoreManagePage`、`DishManagePage` 也挂在 `Admin` 的路由上，随入口一起解析。

做法：用 `React.lazy` 包住交接班抽屉、销售抽屉、充值弹层、管理页，以及 `ScanCode`。`PayChannel` 在切到摄像头扫码时再加载扫描器。Vite `build.rollupOptions.output.manualChunks` 把 `antd`、`recharts`、`html5-qrcode`、`react-admin` 分成独立 chunk，避免以后又粘回主包。目标是点餐首屏不再携带这三套库。

已落地（交接班、当日销售、摄像头扫码）：

- `MyHome` 在 `shiftOpen` / `dataDrawerOpen` 第一次为真时才挂上对应抽屉，之后保持挂载。
- 摄像头走 `src/common/LazyQRScanner.tsx`，只在付款页的扫码页签真正渲染时拉取 `html5-qrcode`。
- 三套库跟着各自的动态 `import()` 走，没有再用 `manualChunks` 强行命名。强行把 antd / recharts 划进独立 chunk 时，lodash 这些入口也在用的依赖会被卷进去，首屏反而会 `modulepreload` 整包。充值、管理页和 react-admin 拆包还没做。

### 生产包开着 React profiling

`vite.config.ts` 的 `resolve.alias` 把 `react-dom` 换成 `react-dom/profiling`，把 `scheduler/tracing` 换成 profiling 版本。这条别名没有按 `command === 'serve'` 分开，`yarn build` 也会带上。profiling 构建会记录渲染时间，收银机上每点一次菜都更贵。

开发需要 profiling 时用环境变量打开。生产构建走普通 `react-dom`。

### 构建机环境变量会进浏览器

`vite.config.ts` 有 `define: { 'process.env': process.env }`。Vite 会把构建时的整个环境对象写进客户端包。CI 上的 token、webhook、仓库变量都可能出现在 JS 里。

只注入业务需要的 `import.meta.env.VITE_*`。

### 生产 source map 和 nginx 没压缩

`build.sourcemap: true`。Dockerfile 是 `COPY dist`，map 会进镜像。2026-08-19 那次构建里，两份 map 大约 16MB，并且浏览器能直接拿到源码。

生产用 `sourcemap: 'hidden'`，或者构建后删掉 `*.map` 再打镜像。

`deployment/docker/nginx/default.conf` 只做了 `try_files`。没有 `gzip` / `gzip_static`，也没有对带 hash 的 `/assets/` 设 `Cache-Control: public, max-age=31536000, immutable`。收银机弱网时（顶栏链路探针把 900ms 以上记为 weak），2MB 级未压缩 JS 会明显拉长白屏。`index.html` 保持短缓存，静态资源长缓存。

`esbuild.keepNames: true` 会保留函数名，生产包更大。生产构建可以关掉。

### 字体阻塞首屏

`index.html` 在 head 里串了五套 Google Fonts：Roboto、Onest、Gabarito、Pixelify Sans、Open Sans。这些样式表会挡住首次绘制。店内网络经常访问不到 `fonts.googleapis.com`，失败时还会白等。

收银界面留一套自托管字体，其余主题字体改成可选。`<html lang>` 现在是 `en`，默认语言是中文，改成 `zh-CN`。

### 依赖里有一整份用不到的库

`src/` 没有引用这些 `package.json` 依赖：`moment`、`@ant-design/plots`、`@nivo/bar`、`@apollo/client`、`graphql`、`graphql-tag`、`fakerest`、`fetch-mock`、`react-countup`、`react-draggable-list`、`react-image-lightbox`、`react-otp-input`、`react-chat-module`、`nprogress`、`query-string`、`zod`、`@hookform/resolvers`、`date-fns`（直接依赖）、`i-devices`、`ra-data-graphql-simple`、`ra-data-simple-rest`、`ra-input-rich-text`、`@material-ui/core`。

业务 UI 用的是 `@mui/material` 和少量 antd。`@material-ui/core` 是 v4，和 v5 叠在一起会让安装变慢。图表只需要 recharts 这一条，而且只给当日销售用。

`packages/` 里放着整份 react-admin 源码，`vite.config.ts` 里指向它的 alias 已注释。运行时走 `node_modules`。这份目录增加克隆和检索成本，不参与当前打包。

`src/widgets/` 是空的。`src/contexts/AuthContext.tsx` 和 `src/hooks/useAuth.tsx` 没有被页面引用，登录走的是 `src/common/MyAuthProvider.tsx`。

## 点餐热路径

### 一个 Context 拖着整面菜

`src/dataProvider/MyCartProvider.tsx` 把购物车、抽屉开关、挂单、值班、飞单动画、支付轮询、订单同步进度放在同一个 context。Provider 的 `value` 每次渲染都是新对象，没有按字段拆开。

`src/pages/home/MyCard.tsx` 通过 `useCartContext()` 读取 `cartItems`。每张菜卡都订阅整份 context。结果是：

- 加一道菜，当前分类里所有卡都重绘。
- 打开订单抽屉、交接班、飞单动画、同步进度从 0 跳到 100，同样重绘所有卡。
- `src/pages/dashboard/MyHome.tsx` 的 `handleClick` 每次加菜都 `toast.success`，连点时顶栏提示会叠起来。

做法：把「购物车行」和「界面开关 / 动画」分成两个 context。商品卡只订阅自己那一行的数量，或由父组件把 `quantity` 当 prop 传进去并用 `React.memo`。加菜反馈用卡片上已有的 +1 动画，提示改成短时、可合并的一条。

`src/pages/home/Components/MyProducts.tsx` 在渲染期间用 `reduce` 做 `groupedData` 和 `groupedDataSelectInfo`，没有放进 `useMemo`。分类商品一变就重算，可以跟着 `data` 和当前分类缓存。

商品图在 `src/pages/home/Components/ProductCardLayouts.tsx` 里用 CSS `backgroundImage` 和 `Avatar src`。当前分类的图会一起请求，没有 `loading="lazy"`，也没有缩略图尺寸。菜品多的时候，切到带图模式会抢网络。用 `<img loading="lazy" decoding="async">`，并优先要缩略图地址。

### 顶栏每秒重绘

`src/layout/MyAppBar.tsx` 用 `setInterval(tick, 1000)` 更新 `currentTime`，状态放在顶栏组件上。门店选择、值班开关、权限入口都在这棵子树里，每秒跟着渲染。把时钟抽成只含时间文本的子组件。

同一顶栏里还有链路探针（8 秒一次，见 `src/layout/LinkSignal.tsx`）。探针本身是轻的，保持独立组件即可。

### 菜谱缓存写得太勤，读的时候又总是回源

`src/utils/catalogCache.ts` 已经把菜单、商品、套餐放进内存和 `sessionStorage`，TTL 2 分钟，并且把「写入」和「手动刷新」分成 `catalogTick` / `refreshTick`。这避免了写缓存触发无限请求。

还可以收两处：

- `persist()` 在每次 `writeProducts`、`writeMenus`、`patchStock` 时 `JSON.stringify` 整份门店菜谱。库存以后若走 websocket 补丁，主线程会被大 JSON 堵住。库存层放内存，菜谱正文按菜单分 key 写，或合并到空闲时间再写。
- `MyProducts` 在进页、切分类、`refreshTick` 变化时都会 `POST /v1/hlj/product/pos/menu` 和 `/products`，即使 `readProducts().fresh === true`。2 分钟内来回切分类会重复打同一接口。缓存仍新鲜时先画缓存，把回源留给手动刷新和 TTL 过期。
- `lookupProductUnitPrice` 每次在全部已缓存分类里线性找价。写缓存时顺手建 `productId -> unitPrice` 索引，购物车计价就不用扫全表。

### 规格选择存在全局 localStorage

`MyCard` 把当前规格写进 `localStorage` 的 `propMap` 和 `selectedNames`。这两个 key 是全局的，所有菜卡共用。快速连点两道带规格的菜时，规格会串。规格状态放在打开的那张卡或弹层里，提交后丢掉。

## 网络和轮询

店里同时跑着这些周期请求：

| 位置 | 周期 | 行为 |
| --- | --- | --- |
| `src/layout/LinkSignal.tsx` | 8s | `GET /v1/system/auth/heartbeat?probe=1`，4s 超时。保持 GET，不要改成 POST |
| `src/layout/NoticeHost.tsx` | 60s | 弹窗和跑马灯各一次 |
| `src/common/SeatHoldWatch.tsx` | 15s 拉座位，1s 本地判断 | 超时桌会弹层 |
| `src/common/OrderPulling.tsx` | 支付 1.5s，最多 20 次；订单列表 1s，最多 20 次 | 付款后确认到账、列表出现 |
| `src/common/TablePicker.tsx` | 打开时 1s | 刷新占用显示 |
| `src/common/PayChannel.tsx` | 扫码缓冲 15s 清空 | 见下一节 |

付款成功路径上，WebSocket、`finishPaid`，以及 `PaymentWatcher` 可能先后触发。`lastPaidRef` 挡住了重复 toast，列表同步仍会在 1 秒间隔上打 `GET /v1/hlj/order/pos?filter=...`，最多约 20 次。弱网时改成 1s、2s、4s 退避，列表里一旦出现订单就停。

`src/common/FetchData.tsx` 是绝大多数业务请求的入口，有几处会放大失败：

- `cookie` 在 hook 初始化时读一次。登录完成后如果组件没卸载，后续请求仍带着旧的 `Authorization`。每次请求时再读 `localStorage`。
- 成功响应 `console.log` 整份 body。订单和会员接口会把手机号、金额打进控制台。
- 没有超时，也没有把 `AbortController` 接进卸载清理。分类切得快时，慢响应会后到并覆盖新分类。`MyProducts` 有 `cancelled` 标志，但请求本身还在飞。
- `GET` 把 `filter` JSON 拼进 query string。筛选一长就容易踩 URL 长度限制。列表查询用 POST body，或限制 filter 字段。
- 401 只删 `cookie`。登录态同时还写在 `token`、`accessToken`（见 `src/utils/authToken.ts` 和 `src/common/login.tsx`）。过期后这几个 key 会不一致。

通知有两套：`useFetchData` 的 MUI Snackbar（默认成功也弹 6 秒），以及各处的 `react-toastify`。菜谱请求已经用 `quiet=true` 关掉成功条。其余成功操作可以统一走一种轻提示，失败再留在屏幕上。

`src/utils/axios.ts` 的 `authApi` 和 `FetchData` 的裸 `axios()` 互不相通。登录、心跳、业务请求的 header 规则分散在三处。收成一个实例：统一超时、401、以及 `src/utils/clientHeaders.ts` 已经加的客户端头。

## 金额、挂单和登录

### 金额用元的浮点

`src/utils/orderMoney.ts` 写明 `real_price` 是元的浮点，`pay_price` 是四舍五入后的元。`src/utils/comboMatch.ts` 分摊到订单行时用 `Number(unit.toFixed(4))`。套餐凑单、规格加价、优惠锁定叠在一起时，分位会和支付渠道差 1 分。

内部计算改成整数分，只在展示时转成元。下单 `buckets.Price` 和支付 `amount` 用同一套分。

### 挂单在本机，当前购物车刷新即丢

挂单写入 `localStorage` 的 `holdOrders`（`MyCart.tsx` 的 `holdOrder`）。正在点的 `cartItems` 只在内存里。收银机刷新、壳崩溃、或店员误关页面，未挂单的菜会没掉。挂单也到不了另一台收银机。

当前购物车连同桌号、人数、手机号一起按门店落到 `localStorage`，启动时恢复。多台机器共用挂单需要服务端草稿单，那是单独的接口，不在这次前端体积优化里。

### 扫码枪拼包不稳

`PayChannel` 里微信付款码的 `keydown` 监听依赖 `code`。每输入一个字符就拆掉监听再挂上，并用闭包里的 `code.length === 18` 决定提交。扫码枪通常一次吐出 18 位加回车，中间会丢字符或把回车拼进付款码。监听里还有 `console.log("event.key")`。

拉卡拉分支已经有 300ms 的 buffer flush。微信 / 自动识别走同一套：字符进 buffer，80–150ms 没有后续输入再提交，回车立刻提交，忽略 Shift 这类功能键。

### 记住登录保存了明文密码

`src/pages/login/rememberLogin.ts` 把手机号和密码以 JSON 放在 `localStorage` 的 `pos.login.remember7`，有效期 7 天。这是交接班少打字的设计。收银机浏览器存储对店内任何人可读。

更稳的做法是只记住手机号，密码留在内存；或者向 auth-api 要一个本机、短时、可吊销的设备令牌，不要存密码。

## 工程

- 运行时是 React 17：`src/index.tsx` 使用 `ReactDOM.render`。`await` 之后的多次 `setState` 不会自动批处理。升到 18 要用 `createRoot`，并回归登录、付款、抽屉。放在拆 Context 之后做。
- `tsconfig.json` 开了 `strict`，业务文件里仍有 `@ts-ignore` 和 `any`（`PayChannel` 的 props 是 `any`）。新代码补类型即可，不必一次改完。
- 测试是 `npx tsx src/**/*.test.ts` 这种脚本，`package.json` 没有 `test`，`.github/workflows/build.yml` 只做 `yarn build`。`src/auth/scanX6Apis.test.ts` 能抓住新增接口漏登记，值得放进 CI，比上 Jest 更便宜。
- `src/i18n/t.ts` 在入口同步合并 `posCatalog.ts` 和 `extraUi.ts` 的全部语言。react-admin 文案已按语言拆包，`tPos` 没有。默认中文店可以只同步加载 `zh`，其他语言跟着 `App.tsx` 的 `localeLoaders` 走。
- 主题文件在 `src/themes/`，收银默认暗色。主题可以保留，字体不要五套都阻塞加载。
- 没有 Error Boundary。菜谱或付款渲染抛错时，整台收银白屏。在 `MyHome` 外包一层，失败时给出「重新加载菜谱 / 返回点餐」而不是空白。

## 建议落地顺序

1. 生产构建：去掉 profiling 别名和全量 `process.env`，source map 不进镜像，nginx gzip + `/assets/` 长缓存，字体改自托管。
2. `React.lazy`：交接班、当日销售、充值、管理页、`ScanCode`。用一次生产构建对比主 chunk 的 gzip。
3. 拆购物车 Context，商品卡 `memo`，时钟独立。在一台有 50 道菜以上的分类上点选，确认只有被点的卡重绘。
4. 新鲜菜谱跳过回源；库存补丁不写整份 sessionStorage；商品图 lazy。
5. 扫码 buffer、请求超时、401 清全部登录 key。
6. 金额改分；当前购物车本地恢复。
7. 删未使用依赖，CI 跑 `scanX6Apis` 和现有 `tsx` 测试。

## 已经成立、改的时候别拆掉

- 菜谱写入不能增加 `refreshTick`。`useCatalogRefresh` 和 `useCatalogTick` 必须分开，否则菜单请求会循环。见 `src/utils/catalogCache.ts` 和 `src/utils/catalogCache.test.ts`。
- 套餐匹配在 `src/utils/comboMatch.ts` 本地完成，规则见 `docs/pos-combo.md`。优化计价时保持「套餐价 + 规格加价 + 剩余单品原价」。
- 链路探针只用 `GET /v1/system/auth/heartbeat?probe=1`。POST 会写 Redis 在线状态。
- 菜谱、商品、套餐请求传 `quiet=true`，成功不要弹 Snackbar。
- 购物车 Context 挂在 `globalThis.__x6PosCartContext` 上，避免 Vite 热更新后 `useCartContext` 抛错。
- 提示音用 `src/utils/touchSound.ts` 的 AudioContext 合成，没有额外音频文件。
- 镜像只拷 `dist`，不在容器里跑 yarn。优化构建产物即可，不必改这层。

## 落地记录（2026-11-06）

已实现（见 PR feat/x6-opt-p0-p1）：生产构建去 profiling / 全量 `process.env`、hidden sourcemap、nginx gzip+assets 长缓存、字体改系统栈、`React.lazy` 扩到充值/管理页、时钟独立、菜谱 TTL 内不回源、库存补丁延迟持久化、扫码拼包、请求超时与 401 清全量登录态、购物车本地恢复、Error Boundary、记住登录改为 auth-api 设备令牌（不再存明文密码）、CI 跑 `*.test.ts`。

未做 / 后续：金额改分、React 18、彻底拆购物车 Context、删 `packages/` 源码目录、商品图缩略图尺寸协商。
