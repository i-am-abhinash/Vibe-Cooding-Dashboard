const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([search, replace]) => {
    content = content.replace(search, replace);
  });
  fs.writeFileSync(file, content);
};

replaceInFile('frontend/src/pages/GroupProjectView.tsx', [
  [/import { useEffect/g, "import { useEffect"]
]);

replaceInFile('frontend/src/pages/GrowthAnalytics.tsx', [
  [/const \[error, setError\] = useState\(''\);/g, ""]
]);

replaceInFile('frontend/src/pages/MemberDetail.tsx', [
  [/dailyReports, /g, ""]
]);

replaceInFile('frontend/src/pages/MembersList.tsx', [
  [/Filter, /g, ""]
]);

replaceInFile('frontend/src/pages/ProjectsList.tsx', [
  [/import { useNavigate } from 'react-router-dom';\n/g, ""]
]);

replaceInFile('frontend/src/pages/ReviewsInbox.tsx', [
  [/X, MessageSquare, /g, ""]
]);

