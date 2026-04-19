#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');
const path = require('path');

const PORT = 8000;
const URL = `http://localhost:${PORT}`;

// Change to portfolio directory
process.chdir(path.join(__dirname, 'glint', 'glint', 'glint'));

console.log('\n🚀 Starting Glint Portfolio...\n');
console.log(`📍 Portfolio will be available at: ${URL}\n`);

// Determine open command based on platform
let openCmd;
if (os.platform() === 'win32') {
  openCmd = `start ${URL}`;
} else if (os.platform() === 'darwin') {
  openCmd = `open ${URL}`;
} else {
  openCmd = `xdg-open ${URL}`;
}

// Start HTTP server
const server = exec('npx http-server -c-1 -p 8000 --gzip --cors', (error) => {
  if (error && error.code !== 0) {
    console.error('Server error:', error);
  }
});

// Open browser after 2 seconds (give server time to start)
setTimeout(() => {
  console.log('🌐 Opening browser...\n');
  exec(openCmd, (error) => {
    if (error) {
      console.log(`❌ Could not auto-open browser. Please visit: ${URL}\n`);
    }
  });
}, 2000);

// Display messages from server
server.stdout?.pipe(process.stdout);
server.stderr?.pipe(process.stderr);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping server...\n');
  process.exit(0);
});
