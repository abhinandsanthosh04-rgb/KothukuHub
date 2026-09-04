const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging KothukuHub 2.0 into KothukuHub_2.0.zip...');

const outputPath = path.join(__dirname, 'KothukuHub_2.0.zip');

try {
  // Try using archiver module if installed
  const archiver = require('archiver');
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function() {
    console.log(`✅ KothukuHub_2.0.zip successfully created! Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);
  archive.file('server.js', { name: 'server.js' });
  archive.file('package.json', { name: 'package.json' });
  archive.file('bundle-zip.js', { name: 'bundle-zip.js' });
  archive.directory('data/', 'data');
  archive.directory('public/', 'public');
  archive.finalize();

} catch (err) {
  console.log('⚡ Archiver module not loaded yet, utilizing PowerShellCompress fallback...');
  try {
    const psCommand = `Powershell -Command "Compress-Archive -Path '${path.join(__dirname, 'server.js')}', '${path.join(__dirname, 'package.json')}', '${path.join(__dirname, 'data')}', '${path.join(__dirname, 'public')}' -DestinationPath '${outputPath}' -Force"`;
    execSync(psCommand);
    console.log('✅ KothukuHub_2.0.zip successfully created via PowerShell!');
  } catch (psErr) {
    console.error('❌ Zip error:', psErr.message);
  }
}
