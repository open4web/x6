const ts = require('typescript');
const fs = require('fs'), path = require('path');
const repo = path.resolve(__dirname, '..');
const presetPath = process.argv[2];
if (!presetPath) throw new Error('Usage: node scripts/verify-role-preset.cjs <auth-api/internal/roleapply/x6-v1.json> [--write-evidence]');
const root = path.join(repo, 'src'), output = [];
function walkDir(dir) { for (const d of fs.readdirSync(dir, {withFileTypes: true})) { const f=path.join(dir,d.name); if(d.isDirectory())walkDir(f);else if(/\.tsx?$/.test(f)&&!f.includes('.test.'))scan(f); } }
function scan(file) {
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const vars=new Map();
 function collect(n){if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name)&&n.initializer)vars.set(n.name.text,n.initializer);ts.forEachChild(n,collect)}collect(source);
 function text(n,seen=new Set()) {
  if(!n)return '';
  if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))return n.text;
  if(ts.isTemplateExpression(n))return n.head.text+'${id}'+n.templateSpans.map(s=>s.literal.text).join('${id}');
  if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.PlusToken)return text(n.left,seen)+'${id}'+text(n.right,seen);
  if(ts.isIdentifier(n)&&vars.has(n.text)&&!seen.has(n.text)){seen.add(n.text);return text(vars.get(n.text),seen)}
  return '';
 }
 function add(n,expr,method){let raw=text(expr);if(!raw.startsWith('/v1/'))return; const pre=raw.split(/[?#]/)[0];const p=pre.replace(/\$\{id\}/g,'').replace(/\/+$/,'');const single=p==='/v1/hlj/order/pos'&&pre.endsWith('/${id}');output.push({path:p,method,single,evidence:path.relative(repo,file)+':'+(source.getLineAndCharacterOfPosition(n.getStart()).line+1)});}
 function visit(n) {
  if(ts.isCallExpression(n)){
   const name=n.expression.getText(source);
   if(name==='fetchData')add(n,n.arguments[0],text(n.arguments[2])||'GET');
   if(/^axios\.(get|post|put|patch|delete)$/.test(name))add(n,n.arguments[0],name.split('.')[1].toUpperCase());
  }
  if(ts.isObjectLiteralExpression(n)){
   const url=n.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(source)==='url');
   const method=n.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(source)==='method');
   if(url)add(n,url.initializer,method?text(method.initializer):'GET');
  }
  if(ts.isNewExpression(n)&&n.expression.getText(source)==='WebSocket'){
   const call=n.arguments?.[0];if(call&&ts.isCallExpression(call)&&call.expression.getText(source)==='orderWsUrl')add(n,call.arguments[0],'GET');
  }
  ts.forEachChild(n,visit);
 }visit(source);
}
walkDir(root);
const preset=JSON.parse(fs.readFileSync(presetPath));
const catalogSource = ts.createSourceFile('x6RequiredApis.ts', fs.readFileSync(path.join(root, 'auth/x6RequiredApis.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
let expectedPaths = [];
function findPaths(n) {
 if (ts.isVariableDeclaration(n) && n.name.getText(catalogSource) === 'X6_REQUIRED_APIS') {
  const arr = ts.isAsExpression(n.initializer) ? n.initializer.expression : n.initializer;
  expectedPaths = arr.elements.map(e => e.text).filter(p => p !== '/v1/system/auth/user/role-applications/x6').sort();
 }
 ts.forEachChild(n, findPaths);
}
findPaths(catalogSource);
const inventoryPaths = preset.resources.map(r => r.path).sort();
if (JSON.stringify(expectedPaths) !== JSON.stringify(inventoryPaths)) throw new Error('Preset inventory drifted from the x6 source-call catalog; review and version it explicitly');

for(const r of preset.resources.filter(r=>r.grant)){
 const found=output.filter(x=>x.path===r.path);
 const actual=[...new Set(found.map(c=>`${c.method}:${c.single}`))].sort();
 const expected=r.calls.map(c=>`${c.method}:${c.single}`).sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`${r.path}: expected ${expected}; found ${actual}`);
 r.evidence=[...new Set(found.map(c=>c.evidence))];
}
if (process.argv.includes('--write-evidence')) fs.writeFileSync(presetPath,JSON.stringify(preset,null,2)+'\n');
console.log('verified all 13 RBAC API method/single pairs against x6 call ASTs');
