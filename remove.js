const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      removeConsoleLogs(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Remove console.log / console.debug / console.warn / console.error lines
      content = content.replace(/^\s*console\.(log|debug|warn|error)\(.*?\);\s*$/gm, '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

// Replace __dirname with your project src folder path if needed
removeConsoleLogs(path.join(__dirname, ''));