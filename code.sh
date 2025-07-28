#!/bin/bash

# This script automates version bumping, Git tagging, and pushing to the remote repository.
# It assumes this script is located in the project's root directory,
# and the 'NOTIFICATION' directory is also directly within the root.

# Usage: ./code.sh [patch|minor|major]
# Default: patch

# Define ANSI color codes for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color - resets text to default


# Determine the version bump type.
# If an argument is provided, use it; otherwise, default to 'patch'.
VERSION_TYPE=${1:-patch}

# Validate the provided version type.
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Invalid version type specified. Please use 'patch', 'minor', or 'major'.${NC}"
  exit 1
fi

# Get the directory of the script. Since it's in the root, this will be the root directory.
SCRIPT_DIR=$(dirname "$0")
echo -e "${BLUE}DEBUG: Script is running from: $(pwd)${NC}" # Debug: show current working directory
echo -e "${BLUE}DEBUG: SCRIPT_DIR (where code.sh is located) is: $SCRIPT_DIR${NC}" # Debug: show script's directory

# Define the path to the NOTIFICATION directory relative to the script's location (the root).
NOTIFICATION_DIR="$SCRIPT_DIR/NOTIFICATION"
echo -e "${BLUE}DEBUG: Target NOTIFICATION_DIR for cd is: $NOTIFICATION_DIR${NC}" # Debug: show target directory for cd

# Change to the NOTIFICATION directory to ensure npm commands run in the correct context.
# Exit if navigation fails.
cd "$NOTIFICATION_DIR" || { echo -e "${RED}Error: Could not navigate to $NOTIFICATION_DIR. Please ensure 'NOTIFICATION' directory exists as a sibling to 'code.sh'.${NC}"; exit 1; }
echo -e "${BLUE}DEBUG: Successfully changed directory to: $(pwd)${NC}" # Debug: show current working directory after cd

# Check if package.json exists in the NOTIFICATION directory.
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found in $(pwd)${NC}"
  exit 1
fi

# Upgrade the version of the package using npm version command with the specified type.
# This command increments the specified version (patch, minor, or major)
# and automatically commits the change to package.json and package-lock.json.
# We use --no-git-tag-version to prevent npm from creating a git tag immediately,
# as we will create our own annotated tag later.
echo -e "${YELLOW}Version bumping ($VERSION_TYPE)...${NC}"
npm version "$VERSION_TYPE" --no-git-tag-version

# Get the updated version from package.json using 'jq'.
# 'jq' is a lightweight and flexible command-line JSON processor.
# If 'jq' is not installed, you might need to install it on your system (e.g., sudo apt-get install jq).
echo -e "${YELLOW}Retrieving updated version from package.json...${NC}"
VERSION=$(jq -r '.version' package.json)

# Print the updated version to the console.
echo -e "${GREEN}New version from package.json: $VERSION${NC}"

# Add the modified package.json and package-lock.json (if present) to the Git staging area.
echo -e "${YELLOW}Staging package.json changes...${NC}"
git add package.json
if [ -f "package-lock.json" ]; then
  git add package-lock.json
fi

# Commit, tag, and push instructions (do not run automatically)
echo -e "${YELLOW}To commit, tag, and push your changes, run the following command:${NC}"
echo -e "${GREEN}git commit -m \"Version updated to v$VERSION\" && git tag -a \"v$VERSION\" -m \"Release version $VERSION\" && git push origin HEAD --tags${NC}"

#  ==========================================================
# The following commands are for manual execution after the script runs.
#  ==========================================================
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