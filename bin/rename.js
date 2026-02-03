const replace = require('replace-in-file');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const renameAsync = promisify(fs.rename);

const filePath = path.join(process.cwd(), '**/*.{css,scss,js,php}');

const files = glob.sync(filePath, {
    ignore: ['**/node_modules/**'],
});

const options = {
    files: files,
    from: [
        /mos-product-specifications-tab/g,
        /mos_product_specifications_tab/g,
        /MOS_PRODUCT_SPECIFICATIONS_TAB/g,
        /MOS-PRODUCT-SPECIFICATIONS-TAB/g,
        /Mos-Product-Specifications-Tab/g,
        /Mos_Product_Specifications_Tab/g,
        /MosProductSpecificationsTab/g,
    ],
    to: [
        'your-renamed-plugin',
        'your_renamed_plugin',
        'YOUR_RENAMED_PLUGIN',
        'YOUR-RENAMED-PLUGIN',
        'Your-Renamed-Plugin',
        'Your_Renamed_Plugin',
        'YourRenamedPlugin',
    ],
    verbose: true,
    dry: false,
};

const renamedResults = [];
async function renamePHPFiles() {
    const renamePromises = files
        .filter((file) => file.endsWith('.php'))
        .filter((file) => /mos-product-specifications-tab/.test(file))
        .map(async (file) => {
            const dir = path.dirname(file);
            const baseName = path.basename(file);
            const newBaseName = baseName.replace(
                /mos-product-specifications-tab/gi,
                'your-renamed-plugin'
            );
            const newFileName = path.join(dir, newBaseName);

            try {
                const baseNameOriginalFile = path.basename(file);
                const baseNameNewFile = path.basename(newFileName);
                if (baseNameOriginalFile !== baseNameNewFile) {
                    await renameAsync(file, newFileName);
                    renamedResults.push({
                        from: file,
                        to: newFileName,
                    });
                }
            } catch (error) {
                console.error(`Error renaming ${file}:`, error);
            }
        });

    await Promise.all(renamePromises);
}

async function main() {
    try {
        const results = await replace(options);
        console.log('Replacement results:', results);
        await renamePHPFiles();
        console.log('');
        console.log('File renamed results:', renamedResults);

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

main();