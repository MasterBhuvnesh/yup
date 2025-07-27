#!/bin/bash
set -e

# Default to "patch" if no argument is provided
VERSION_TYPE=${1:-patch}

# Validate version type
if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Error: Invalid version type. Use one of: patch, minor, major."
  exit 1
fi

# Step into the notification folder and bump version
cd notification
npm version "$VERSION_TYPE"

# Go back to root and commit the changes
cd ..
git add notification/package.json notification/package-lock.json
git commit -m "chore(notification): bump $VERSION_TYPE version"
git push origin main

# Push version tag
git push origin --tags
