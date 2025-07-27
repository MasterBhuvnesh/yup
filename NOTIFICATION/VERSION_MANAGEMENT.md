# Version Management

This document explains how to manage versions for the notification service.

## Version Bump Commands

To bump the version and automatically create git commits and tags, use one of the following commands from the `NOTIFICATION/` directory:

```bash
# Patch version (e.g., 1.0.0 -> 1.0.1)
npm run version:patch

# Minor version (e.g., 1.0.0 -> 1.1.0)  
npm run version:minor

# Major version (e.g., 1.0.0 -> 2.0.0)
npm run version:major
```

## What happens when you run these commands:

1. **Updates version** in `package.json`
2. **Creates a git commit** with message "chore: bump version to vX.X.X"
3. **Creates a git tag** in format "vX.X.X"
4. **Attempts to push** the commit and tag to the remote repository

## Automatic Deployment

When a version tag (e.g., `v3.0.4`) is pushed to the repository, it automatically triggers the GitHub Actions workflow that:

1. Builds the Docker image
2. Pushes it to Docker Hub with both `latest` and version-specific tags
3. Triggers the Render deployment

## Manual Push

If the automatic push fails (due to authentication or other issues), you can manually push the changes:

```bash
git push --follow-tags
```

## Troubleshooting

- Make sure you have proper git credentials configured
- Ensure you're in the `NOTIFICATION/` directory when running the version commands
- Check that the GitHub Actions workflow has the necessary secrets configured (DOCKER_USERNAME, DOCKER_PASSWORD, RENDER_DEPLOY_HOOK_URL)