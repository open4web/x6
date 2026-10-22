# X6
>Merchant Service Order System

A simple and efficient order management system designed for merchants to manage customer orders seamlessly. The application provides an intuitive interface for creating, editing, and tracking orders while offering features like:

	•	Shopping Cart: Manage customer orders with a detailed item list, dynamic price calculation, and easy quantity adjustments.
	•	Dining Options: Support for Dine In or Take Away modes.
	•	Customer Details: Specify the number of diners or customize orders.
	•	Order Actions: Options to process payments, hold orders, or update details in real-time.
	•	Merchant-Focused Design: Simplified flow tailored for merchants to manage multiple customer orders efficiently.

Features:

	•	Responsive UI: Designed with Material-UI for smooth user interactions.
	•	Dynamic Order Updates: Modify quantities, prices, and dining preferences.
	•	Expandable Functionality: Ready for integration with payment APIs or backend services.

Feel free to expand this as needed based on additional features!

## releases

- update auth & multi merchant 
- changed: 
    - src/common/login.tsx 
    - src/dataProvider/MyCartProvider.tsx
    - src/pages/login/
    - topup
  
## deploy
## 客户端应用（Android Pad / Windows）

本项目另有浏览器外壳客户端「智点收银」，固定打开线上页面，避免店员切错网址。外壳源码与构建在
[open4web/release](https://github.com/open4web/release)（`apps/x6/app.json` 配置名称、网址、图标）。

- 下载（始终最新）：[Android](https://github.com/open4web/release/releases/download/x6-latest/zhidian-pos-android.apk) ·
  [Windows 安装版](https://github.com/open4web/release/releases/download/x6-latest/zhidian-pos-windows-setup.exe) ·
  [Windows 免安装版](https://github.com/open4web/release/releases/download/x6-latest/zhidian-pos-windows-portable.exe)
- 发新版本：在本仓库运行 Actions → **App shell release**（需配置 secret `RELEASE_TOKEN`），
  或直接到 open4web/release 运行 **Build x5 / x6 apps**。网页功能更新不需要重新发客户端。
