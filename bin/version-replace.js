const fs = require('fs-extra');
const path = require('path');

async function replaceVersion() {
  try {
    // Read package.json to get version
    const packageJson = await fs.readJson(path.join(__dirname, '../package.json'));
    const version = packageJson.version;
    
    console.log(`Replacing version placeholders with: ${version}`);
    
    // Define files where you want to replace version
    const filesToUpdate = [
      'dist/plugin.php',
      'dist/readme.txt',
      'dist/main.js',
      // Add more files as needed
    ];
    
    for (const file of filesToUpdate) {
      const filePath = path.join(__dirname, '..', file);
      
      if (await fs.pathExists(filePath)) {
        let content = await fs.readFile(filePath, 'utf8');
        
        // Replace various version placeholders
        content = content.replace(/\{\{VERSION\}\}/g, version);
        content = content.replace(/\[VERSION\]/g, version);
        content = content.replace(/Version:\s*\d+\.\d+\.\d+/g, `Version: ${version}`);
        
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✓ Updated version in: ${file}`);
      } else {
        console.log(`⚠ File not found: ${file}`);
      }
    }
    
    console.log('✅ Version replacement completed!');
  } catch (error) {
    console.error('❌ Error replacing version:', error.message);
    process.exit(1);
  }
}

replaceVersion();