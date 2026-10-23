const fs = require('fs');
const path = require('path');

const wranglerPath = path.join(__dirname, '..', 'wrangler.json');
if (fs.existsSync(wranglerPath)) {
  const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
  if (!config.vars) config.vars = {};

  if (process.env.GITHUB_TOKEN) {
    config.vars.GITHUB_TOKEN = process.env.GITHUB_TOKEN.trim();
    console.log('✓ GITHUB_TOKEN injected from build environment into wrangler.json');
  } else {
    console.log('ℹ GITHUB_TOKEN not found in process.env');
  }

  if (process.env.ADMIN_EMAIL) {
    config.vars.ADMIN_EMAIL = process.env.ADMIN_EMAIL.trim();
    console.log('✓ ADMIN_EMAIL injected from build environment into wrangler.json');
  }

  if (process.env.ADMIN_PASSWORD) {
    config.vars.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD.trim();
    console.log('✓ ADMIN_PASSWORD injected from build environment into wrangler.json');
  }

  if (process.env.GITHUB_REPO) {
    config.vars.GITHUB_REPO = process.env.GITHUB_REPO.trim();
  }

  if (process.env.GITHUB_BRANCH) {
    config.vars.GITHUB_BRANCH = process.env.GITHUB_BRANCH.trim();
  }

  fs.writeFileSync(wranglerPath, JSON.stringify(config, null, 2), 'utf8');
  console.log('✓ wrangler.json updated successfully for deployment');
}
