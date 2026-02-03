const fs = require('fs-extra');
const path = require('path');

async function cleanUselessFiles() {
  try {
    console.log('🧹 Cleaning useless files and folders...');
    
    const distPath = path.join(__dirname, '../dist');
    
    // Define patterns to remove
    const filesToRemove = [
      // Development files
      '.git',
      '.gitignore',
      '.gitattributes',
      '.DS_Store',
      'Thumbs.db',
      
      // Node modules and dependencies
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      
      // Source files (if you don't need them in dist)
      'src',
      'tests',
      'test',
      '__tests__',
      
      // Build configuration
      'webpack.config.js',
      'rollup.config.js',
      'tsconfig.json',
      'babel.config.js',
      '.eslintrc',
      '.prettierrc',
      
      // Documentation (optional - remove if not needed)
      'docs',
      '.github',
      
      // Editor files
      '.vscode',
      '.idea',
      '*.sublime-project',
      '*.sublime-workspace',
      
      // Logs
      '*.log',
      'logs',
      
      // Environment files
      '.env',
      '.env.local',
      '.env.development',
      
      // Other development files
      'bin',
      'scripts',
      'README.md', // Remove if you don't want it in release
      'LICENSE', // Keep or remove based on your needs
    ];
    
    // File extensions to remove
    const extensionsToRemove = [
      '.map', // Source maps
      '.ts', // TypeScript source files (if you have compiled JS)
      '.scss', // SCSS source files (if you have compiled CSS)
      '.sass',
      '.less',
    ];
    
    let removedCount = 0;
    
    // Remove specific files and folders
    for (const item of filesToRemove) {
      const itemPath = path.join(distPath, item);
      
      if (await fs.pathExists(itemPath)) {
        await fs.remove(itemPath);
        console.log(`✓ Removed: ${item}`);
        removedCount++;
      }
    }
    
    // Remove files by extension
    async function removeByExtension(dir) {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          await removeByExtension(fullPath);
        } else {
          const ext = path.extname(item);
          if (extensionsToRemove.includes(ext)) {
            await fs.remove(fullPath);
            console.log(`✓ Removed: ${path.relative(distPath, fullPath)}`);
            removedCount++;
          }
        }
      }
    }
    
    if (await fs.pathExists(distPath)) {
      await removeByExtension(distPath);
    }
    
    console.log(`✅ Cleaning completed! Removed ${removedCount} items.`);
  } catch (error) {
    console.error('❌ Error cleaning files:', error.message);
    process.exit(1);
  }
}

cleanUselessFiles();