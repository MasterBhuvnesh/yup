#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing version bump workflow...\n');

try {
  // Save original version
  const packagePath = path.join(__dirname, '..', 'NOTIFICATION', 'package.json');
  const originalPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const originalVersion = originalPackageJson.version;
  
  console.log(`📦 Original version: ${originalVersion}`);
  
  // Test if npm scripts exist
  const requiredScripts = ['version:patch', 'version:minor', 'version:major', 'version:commit'];
  console.log('\n✅ Checking npm scripts...');
  requiredScripts.forEach(script => {
    if (originalPackageJson.scripts[script]) {
      console.log(`  ✅ ${script}: ${originalPackageJson.scripts[script]}`);
    } else {
      console.log(`  ❌ ${script}: MISSING`);
      process.exit(1);
    }
  });
  
  // Test if version-commit.js exists
  const versionCommitPath = path.join(__dirname, 'version-commit.js');
  if (fs.existsSync(versionCommitPath)) {
    console.log('  ✅ version-commit.js script exists');
  } else {
    console.log('  ❌ version-commit.js script missing');
    process.exit(1);
  }
  
  // Test GitHub workflow configuration
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'docker-publish.yml');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  if (workflowContent.includes("tags:\n      - 'v*'")) {
    console.log('  ✅ GitHub workflow triggers on version tags');
  } else {
    console.log('  ❌ GitHub workflow not configured correctly');
    process.exit(1);
  }
  
  // Check that paths filter was removed from tag triggers
  if (!workflowContent.includes('paths:\n      - \'NOTIFICATION/**\'')) {
    console.log('  ✅ GitHub workflow paths filter correctly removed from tag triggers');
  } else {
    console.log('  ❌ GitHub workflow still has paths filter on tag triggers');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed!');
  console.log('\n📋 Version bump workflow is ready to use:');
  console.log('   • npm run version:patch - for patch releases');
  console.log('   • npm run version:minor - for minor releases');
  console.log('   • npm run version:major - for major releases');
  console.log('\n🚀 Each command will:');
  console.log('   1. Update version in package.json');
  console.log('   2. Create git commit with version message');
  console.log('   3. Create git tag (vX.X.X format)');
  console.log('   4. Push changes and tags to trigger GitHub Actions');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}