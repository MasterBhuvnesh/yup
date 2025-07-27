#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Read the version from the package.json in the NOTIFICATION directory
  const packagePath = path.join(__dirname, '..', 'NOTIFICATION', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const version = packageJson.version;
  
  console.log(`Creating commit and tag for version v${version}`);
  
  // Change to repository root
  process.chdir(path.join(__dirname, '..'));
  
  // Add the package.json changes
  execSync('git add NOTIFICATION/package.json', { stdio: 'inherit' });
  
  // Create commit
  execSync(`git commit -m "chore: bump version to v${version}"`, { stdio: 'inherit' });
  
  // Create tag
  execSync(`git tag "v${version}"`, { stdio: 'inherit' });
  
  // Try to push with tags
  try {
    execSync('git push --follow-tags', { stdio: 'inherit' });
    console.log(`Successfully created version v${version} and pushed to repository`);
  } catch (pushError) {
    console.log(`Created version v${version} and tag locally. Push may have failed due to authentication.`);
    console.log('To push manually, run: git push --follow-tags');
  }
  
} catch (error) {
  console.error('Error during version commit process:', error.message);
  process.exit(1);
}