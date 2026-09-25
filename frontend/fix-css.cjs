const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  /  \.exact-container \{\n    width: 1536px;\n    height: 1024px;\n    position: relative;\n    background-color: transparent;\n  \}/,
  `  .exact-container {
    width: 1536px;
    height: 1024px;
    position: relative;
    background-image: url('/reference.png');
    background-size: 1536px 1024px;
    background-position: top center;
    background-repeat: no-repeat;
  }`
);

css = css.replace(
  /  \.glass-panel \{[\s\S]*?\}\n\n/g,
  `  .glass-panel {
    background: rgba(8, 15, 32, 0.25);
    backdrop-filter: blur(16px) url(#glass-refraction);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-left: 1px solid rgba(77, 163, 255, 0.25);
    border-right: 1px solid rgba(139, 92, 246, 0.15);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.05), inset 1px 1px 3px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.6);
  }\n\n`
);

css = css.replace(
  /  \.glass-panel-danger \{[\s\S]*?\}/g,
  `  .glass-panel-danger {
    background: rgba(30, 10, 15, 0.3);
    backdrop-filter: blur(16px) url(#glass-refraction);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(239, 68, 68, 0.4);
    border-left: 1px solid rgba(239, 68, 68, 0.2);
    border-right: 1px solid rgba(239, 68, 68, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.1), inset 1px 1px 3px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.6);
  }`
);

fs.writeFileSync('src/index.css', css);
