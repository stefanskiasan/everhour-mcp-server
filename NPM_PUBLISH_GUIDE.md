# NPM Publishing Guide

This guide explains how to publish the `@everhour/mcp-server` package to npm.

## 📋 Pre-Publishing Checklist

### ✅ Repository Setup
- [x] Git repository initialized
- [x] All code committed to git
- [x] Version number updated in package.json
- [x] CHANGELOG.md updated with release notes

### ✅ Package Configuration
- [x] Package name: `@everhour/mcp-server`
- [x] Version: `2.0.0`
- [x] Executable bin configured
- [x] Files array specified
- [x] All metadata complete

### ✅ Code Quality
- [x] TypeScript compilation successful
- [x] ESLint passes without errors
- [x] All tools implemented and tested
- [x] Documentation complete

### ✅ Documentation
- [x] Professional README.md
- [x] API coverage documentation
- [x] Examples and usage guides
- [x] Contributing guidelines
- [x] LICENSE file included

## 🚀 Publishing Steps

### Step 1: Final Verification

```bash
# Ensure all tests pass
npm run validate

# Build the project
npm run build

# Test the dry run
npm run publish:dry-run
```

### Step 2: NPM Account Setup

```bash
# Login to npm (if not already logged in)
npm login

# Verify your account
npm whoami
```

### Step 3: Publish to NPM

```bash
# Publish the package
npm publish

# The prepublishOnly script will automatically:
# 1. Run validation (type-check + lint)
# 2. Run build
# 3. Prepare the package
```

### Step 4: Verification

```bash
# Test installation
npx @everhour/mcp-server --help

# Or install globally and test
npm install -g @everhour/mcp-server
everhour-mcp-server --help
```

## 📦 Package Contents

The published package includes:

```
@everhour/mcp-server@2.0.0
├── build/                    # Compiled JavaScript
│   ├── api/
│   ├── tools/
│   ├── types/
│   └── index.js              # Main executable
├── README.md                 # Primary documentation
├── LICENSE                   # MIT license
├── API_COVERAGE.md          # Complete API mapping
├── examples.md              # Usage examples
└── package.json             # Package metadata
```

## 🔧 NPX Usage

After publishing, users can run the server with:

```bash
# Direct execution
npx @everhour/mcp-server

# With environment variables
EVERHOUR_API_KEY=your_key npx @everhour/mcp-server

# Global installation
npm install -g @everhour/mcp-server
everhour-mcp-server
```

## 📝 MCP Client Configuration

### Claude Desktop

```json
{
  \"mcpServers\": {
    \"everhour\": {
      \"command\": \"npx\",
      \"args\": [\"@everhour/mcp-server\"],
      \"env\": {
        \"EVERHOUR_API_KEY\": \"your_api_key_here\"
      }
    }
  }
}
```

### Other MCP Clients

```bash
# Command to run
npx @everhour/mcp-server

# Required environment variable
EVERHOUR_API_KEY=your_api_key_here
```

## 🔄 Version Updates

### For Patch Releases (Bug Fixes)

```bash
npm version patch
npm publish
```

### For Minor Releases (New Features)

```bash
npm version minor
npm publish
```

### For Major Releases (Breaking Changes)

```bash
npm version major
npm publish
```

## 📊 Package Statistics

- **Size**: ~30.5 kB (compressed)
- **Unpacked**: ~293.2 kB
- **Files**: 49 total
- **Tools**: 37 MCP tools
- **API Coverage**: 100% Everhour endpoints

## 🔍 Post-Publishing Verification

### Check NPM Registry

1. Visit: https://www.npmjs.com/package/@everhour/mcp-server
2. Verify package information is correct
3. Test download and installation

### Test Installation

```bash
# Test npx execution
npx @everhour/mcp-server

# Test global installation
npm install -g @everhour/mcp-server
everhour-mcp-server

# Test with actual MCP client
# Configure in Claude Desktop and test tools
```

## 📈 Monitoring

### NPM Statistics

- Download counts: Available on npm package page
- Version adoption: Monitor which versions are being used
- Issues: Track GitHub issues for bug reports

### User Feedback

- GitHub Issues: Bug reports and feature requests
- NPM Reviews: User feedback and ratings
- Community Usage: Monitor integrations and usage patterns

## 🔧 Troubleshooting

### Common Publishing Issues

**Authentication Error**
```bash
npm login
npm whoami
```

**Version Conflict**
```bash
npm version patch  # or appropriate version bump
```

**Build Errors**
```bash
npm run clean
npm run build
```

**Permission Issues**
```bash
# Check npm account has permission for @everhour scope
npm access list packages @everhour
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/everhour-mcp-server/issues)
- **NPM Package**: [Package Page](https://www.npmjs.com/package/@everhour/mcp-server)
- **Documentation**: Available in repository

---

## ✅ Ready to Publish!

The package is fully prepared and ready for npm publishing. All checks have passed:

- ✅ Code quality validated
- ✅ Build successful
- ✅ Documentation complete
- ✅ Package configuration correct
- ✅ Dry run successful

**Run `npm publish` when ready to release to the world! 🚀**