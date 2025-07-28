#!/bin/bash

# This script automates version bumping, Git tagging, and prepares changes for remote pushing.
# It assumes the script and the 'NOTIFICATION' directory are both in the project's root.

# Usage: ./code.sh [patch|minor|major]
# Default bump type: patch

# Define ANSI color codes for consistent output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color - resets text to default

# --- Confirmation Prompt ---
# Warns the user and asks for confirmation before proceeding with sensitive operations.
echo -e "${YELLOW}WARNING: This script performs version updates, Git tagging, and prepares changes for remote pushing.${NC}"
read -p "Are you sure you want to proceed with deploying, redeploying, or staging your application? (y/N): " -n 1 -r
echo # Add a newline after the prompt for cleaner output
if [[ ! "$REPLY" =~ ^[yY]$ ]]; then
    echo -e "${RED}Operation cancelled by user.${NC}"
    exit 1
fi
# --- End Confirmation Prompt ---

# Determine the version bump type.
# Uses the first argument provided, or defaults to 'patch' if no argument is given.
VERSION_TYPE=${1:-patch}

# Validate the provided version type.
# Ensures the input is one of 'patch', 'minor', or 'major'.
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Invalid version type. Please use 'patch', 'minor', or 'major'.${NC}"
  exit 1
fi

# Get the script's directory, which is the project root.
SCRIPT_DIR=$(dirname "$0")
echo -e "${BLUE}DEBUG: Script is running from: $(pwd)${NC}" # Debug: Show current working directory
echo -e "${BLUE}DEBUG: SCRIPT_DIR (script location) is: $SCRIPT_DIR${NC}" # Debug: Show script's directory

# Define the path to the NOTIFICATION directory.
NOTIFICATION_DIR="$SCRIPT_DIR/NOTIFICATION"
echo -e "${BLUE}DEBUG: Target NOTIFICATION_DIR for cd is: $NOTIFICATION_DIR${NC}" # Debug: Show target directory for cd

# Navigate to the NOTIFICATION directory.
# This is crucial for `npm` commands to run in the correct context. Exits if navigation fails.
cd "$NOTIFICATION_DIR" || { echo -e "${RED}Error: Could not navigate to $NOTIFICATION_DIR. Ensure 'NOTIFICATION' exists within the root.${NC}"; exit 1; }
echo -e "${BLUE}DEBUG: Successfully changed directory to: $(pwd)${NC}" # Debug: Show current working directory after cd

# Check for 'package.json' in the current (NOTIFICATION) directory.
# A missing 'package.json' indicates an incorrect setup or directory.
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found in $(pwd)${NC}"
  exit 1
fi

# Bump the package version using npm.
# Increments the version (patch, minor, or major) in `package.json` and `package-lock.json`.
# `--no-git-tag-version` prevents `npm` from creating an automatic Git tag, as we'll create our own later.
echo -e "${YELLOW}Bumping version ($VERSION_TYPE)...${NC}"
npm version "$VERSION_TYPE" --no-git-tag-version

# Retrieve the newly updated version from 'package.json'.
# Uses `jq` to parse the JSON; ensure `jq` is installed on your system.
echo -e "${YELLOW}Retrieving updated version from package.json...${NC}"
VERSION=$(jq -r '.version' package.json)

# Display the updated version.
echo -e "${GREEN}New version from package.json: $VERSION${NC}"

# Stage 'package.json' and 'package-lock.json' for Git commit.
echo -e "${YELLOW}Staging package.json changes...${NC}"
git add package.json
if [ -f "package-lock.json" ]; then
  git add package.lock.json
fi

# Provide the user with the final Git commands for committing, tagging, and pushing.
# These commands are displayed for manual execution to prevent accidental pushes.
echo -e "${YELLOW}To commit, tag, and push your changes, run the following command:${NC}"
echo -e "${GREEN}git commit -m \"Version updated to v$VERSION\" && git tag -a \"v$VERSION\" -m \"Release version $VERSION\" && git push origin HEAD --tags${NC}"

#   ==========================================================
# The following commands are for manual execution after the script runs.
#   ==========================================================
<<COMMENT
# Commit the version bump.
echo -e "${YELLOW}Committing version bump...${NC}"
git commit -m "Version updated to v$VERSION"

# Create a Git tag for the new version.
# '-a' creates an annotated tag, which is recommended for releases.
# The tag name is prefixed with 'v' (e.g., v1.0.1).
# '-m' provides a message for the tag.
echo -e "${YELLOW}Creating Git tag v$VERSION...${NC}"
git tag -a "v$VERSION" -m "Release version $VERSION"

# Push the committed changes and the new tag to the remote repository.
# 'git push origin HEAD' pushes the current branch's commits to the 'origin' remote.
# '--tags' pushes all local tags to the remote.
echo -e "${YELLOW}Pushing changes and tags to remote repository...${NC}"
echo -e "${GREEN}Script finished successfully. Version v$VERSION released.${NC} "
echo -e "${BLUE}All that remains is to push the changes to the remote repository.${NC}"
echo -e "${YELLOW}Use 'git push origin HEAD --tags' to push the changes and tags.${NC}"

COMMENT
# ==========================================================
# Note: The actual push command is not executed in this script to avoid accidental pushes.
# Users should review the changes and run the push command manually.
# ==========================================================