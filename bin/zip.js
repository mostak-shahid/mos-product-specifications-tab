const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function createZip() {
  try {
    // Read package.json for plugin name and version
    const packageJson = await fs.readJson(path.join(__dirname, '../package.json'));
    const pluginName = packageJson.name;
    const version = packageJson.version;
    
    const distPath = path.join(__dirname, '../dist');
    const releasePath = path.join(__dirname, '../release');
    
    // Ensure release directory exists
    await fs.ensureDir(releasePath);
    
    // Create zip filename
    const zipFileName = `${pluginName}-v${version}.zip`;
    const zipFilePath = path.join(releasePath, zipFileName);
    
    // Remove old zip if exists
    if (await fs.pathExists(zipFilePath)) {
      await fs.remove(zipFilePath);
      console.log(`Removed old zip: ${zipFileName}`);
    }
    
    console.log(`📦 Creating zip file: ${zipFileName}`);
    
    // Create write stream
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Listen for archive events
    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ Zip created successfully!`);
      console.log(`   File: ${zipFileName}`);
      console.log(`   Size: ${sizeInMB} MB`);
      console.log(`   Location: ${releasePath}`);
    });
    
    archive.on('error', (err) => {
      throw err;
    });
    
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('⚠ Warning:', err.message);
      } else {
        throw err;
      }
    });
    
    // Pipe archive data to the file
    archive.pipe(output);
    
    // Add dist folder contents to zip
    // This will add all files from dist/ directly to the root of the zip
    archive.directory(distPath, false);
    
    // Alternatively, to include the plugin folder name in the zip:
    // archive.directory(distPath, pluginName);
    
    // Finalize the archive
    await archive.finalize();
    
  } catch (error) {
    console.error('❌ Error creating zip:', error.message);
    process.exit(1);
  }
}

createZip();