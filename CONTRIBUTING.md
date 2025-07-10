# Contributing to @everhour/mcp-server

Thank you for your interest in contributing to the Everhour MCP Server! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Everhour account with API access (for testing)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/everhour-mcp-server.git
   cd everhour-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Everhour API key
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start development mode**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: All code must be written in TypeScript
- **ESLint**: Follow the ESLint configuration
- **Formatting**: Use consistent formatting (run `npm run lint:fix`)
- **Types**: Provide comprehensive type definitions
- **Comments**: Document complex logic and API interfaces

### Project Structure

```
src/
├── api/
│   └── everhour-client.ts    # API client implementation
├── tools/
│   ├── clients.ts            # Client management tools
│   ├── projects.ts           # Project management tools
│   └── ...                   # Other tool categories
├── types/
│   └── everhour.ts           # TypeScript type definitions
└── index.ts                  # Main MCP server entry point
```

### Adding New Tools

When adding new MCP tools:

1. **Add types** to `src/types/everhour.ts`
2. **Implement API methods** in `src/api/everhour-client.ts`
3. **Create tool definitions** in appropriate files under `src/tools/`
4. **Add input validation** using Zod schemas
5. **Include error handling** with proper error messages
6. **Update documentation** in README.md and examples.md

### Tool Implementation Template

```typescript
import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';

const YourToolSchema = z.object({
  // Define input validation schema
});

export const yourTools = {
  everhour_your_tool: {
    name: 'everhour_your_tool',
    description: 'Clear description of what this tool does',
    inputSchema: {
      type: 'object',
      properties: {
        // Define JSON schema for MCP
      },
      required: ['requiredField'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = YourToolSchema.parse(args);
      
      try {
        const result = await client.yourApiMethod(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                // Format response appropriately
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};
```

## 🧪 Testing

### Manual Testing

1. **Set up test environment**
   ```bash
   npm run build
   npm start
   ```

2. **Test with MCP client** (like Claude Desktop)

3. **Verify API endpoints** work correctly

### Testing Guidelines

- Test all new functionality thoroughly
- Verify error handling works correctly
- Test with various input formats (especially time formats)
- Ensure TypeScript compilation works
- Verify ESLint passes

## 📝 Documentation

### Required Documentation Updates

When adding features:

1. **README.md**: Update tool lists and examples
2. **examples.md**: Add usage examples for new tools
3. **API_COVERAGE.md**: Document new API endpoints
4. **CHANGELOG.md**: Add entry for changes

### Documentation Standards

- Use clear, concise language
- Provide working examples
- Include error scenarios
- Update version numbers appropriately

## 🔄 Pull Request Process

### Before Submitting

1. **Code Quality**
   - [ ] Code follows TypeScript best practices
   - [ ] ESLint passes (`npm run lint`)
   - [ ] Project builds successfully (`npm run build`)
   - [ ] All new code is properly typed

2. **Testing**
   - [ ] Manual testing completed
   - [ ] Error handling tested
   - [ ] Edge cases considered

3. **Documentation**
   - [ ] README.md updated if needed
   - [ ] Examples added for new features
   - [ ] API coverage documented

### Submitting Pull Request

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Use descriptive title
   - Explain what changes were made
   - Reference any related issues
   - Include testing notes

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Error scenarios tested
- [ ] Documentation updated

## Additional Notes
Any additional information or context.
```

## 🐛 Bug Reports

### Creating Good Bug Reports

Include:

1. **Environment Information**
   - Node.js version
   - Package version
   - Operating system
   - MCP client used

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Error messages (if any)

3. **Additional Context**
   - Configuration used
   - API key permissions
   - Network environment

## 💡 Feature Requests

### Suggesting Features

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** clearly
3. **Explain the benefit** to users
4. **Consider implementation** complexity

## 📋 Code Review Guidelines

### For Reviewers

- Check for TypeScript type safety
- Verify error handling is comprehensive
- Ensure documentation is updated
- Test functionality manually if possible
- Provide constructive feedback

### For Contributors

- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear
- Keep discussions focused and professional

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Create git tag
5. Publish to npm
6. Create GitHub release

## 📞 Getting Help

- **Questions**: Create a GitHub issue with the "question" label
- **Discussions**: Use GitHub Discussions for broader topics
- **Real-time help**: Check if there's a community Discord/Slack

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the technical aspects
- Help newcomers learn

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Spam or off-topic discussions

## 🙏 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to the Everhour MCP Server community! 🎉