// prepublish.js
const fs = require('fs');
const path = require('path');

const packageDirs = ['spacelift', 'spacelift-backend'];

packageDirs.forEach((dir) => {
  const source = path.resolve(__dirname, 'README.md');
  const destination = path.resolve(__dirname, dir, 'README.md');

  // Read the contents of the top-level README.md
  const readmeContent = fs.readFileSync(source, 'utf8');

  // Replace the relative paths
  const updatedContent = readmeContent
    .replace(/!\[Stacks\]\(\.\/docs\/stacks\.png\)/g, `![Stacks](../docs/stacks.png)`)
    .replace(/!\[Runs\]\(\.\/docs\/runs\.png\)/g, `![Runs](../docs/runs.png)`);

  // Write the updated content to the subdirectory README.md
  fs.writeFileSync(destination, updatedContent);
});