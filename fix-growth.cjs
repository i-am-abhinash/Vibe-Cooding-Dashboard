const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/GrowthAnalytics.tsx', 'utf8');
content = content.replace(/const \[error, setError\] = useState\(''\);/g, '');
fs.writeFileSync('frontend/src/pages/GrowthAnalytics.tsx', content);
