# Contributing to DevPostS Pro 🚀

Thank you for your interest in contributing to DevPostS Pro! We welcome contributions from the community and are excited to work with you.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Branch Naming Conventions](#-branch-naming-conventions)
- [Commit Message Format](#-commit-message-format)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Code Style](#-code-style)
- [Testing](#-testing)
- [Reporting Bugs](#-reporting-bugs)
- [Feature Requests](#-feature-requests)

---

## 📝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our code of conduct:

- **Be Respectful** - Treat everyone with kindness and respect
- **Be Inclusive** - Welcome diverse perspectives and backgrounds
- **Be Professional** - Keep discussions focused and constructive
- **No Harassment** - Harassment, discrimination, or hostile behavior is not tolerated

### Enforcement

Violations will be addressed by the maintainers. For serious violations, contributors may be banned from participation.

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Fork via GitHub UI
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/learn-next-app.git
cd learn-next-app
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/original-owner/learn-next-app.git
git fetch upstream
```

### 3. Create Your Branch

```bash
# Always branch from upstream/main
git checkout -b your-branch-name upstream/main
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Environment

```bash
cp .env.example .env.local
# Update .env.local with your test values
```

### 6. Run Tests & Linting

```bash
npm run lint
npm test  # if available
```

---

## 🌿 Branch Naming Conventions

Use clear, descriptive branch names following this format:

```
<type>/<scope>/<description>
```

### Types

- `feat/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation
- `style/` - Code style (formatting, missing commas, etc)
- `refactor/` - Code refactoring
- `perf/` - Performance improvements
- `test/` - Adding or updating tests
- `chore/` - Build process, dependencies, etc

### Examples

✅ Good:

```
feat/auth/add-two-factor-authentication
fix/dashboard/resolve-post-loading-issue
docs/api/update-endpoint-documentation
refactor/components/simplify-post-card
perf/images/optimize-cloudinary-transforms
```

❌ Bad:

```
my-branch
update-stuff
fixbug
new-feature-123
```

---

## 💬 Commit Message Format

We follow the **Conventional Commits** standard. This makes our commit history readable and enables automated changelog generation.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, missing semicolons, etc)
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `perf` - A code change that improves performance
- `test` - Adding or updating tests
- `chore` - Changes to build process, dependencies, or other non-code changes
- `ci` - CI/CD configuration changes

### Examples

✅ Good:

```
feat(auth): implement JWT token refresh mechanism

Add automatic token refresh endpoint that extends session time
by 7 days. Uses secure httpOnly cookies for token storage.

Closes #156
```

```
fix(posts): resolve N+1 query problem in feed

Optimized post fetching to use single batch query instead of
individual queries per post. Improves feed load time by 40%.

Performance: ~200ms → ~50ms for 50 posts
```

```
docs(readme): update installation instructions

Added PostgreSQL version requirement and troubleshooting section
```

```
perf(images): lazy load thumbnails on feed

Import images only when visible in viewport using Intersection
Observer API.
```

❌ Bad:

```
updated stuff
bug fix
new feature
fix bugs and update docs
```

### Commit Message Tips

- Use imperative mood ("add feature" not "added feature")
- Don't capitalize first letter of subject
- Don't end subject line with a period
- Limit subject to 50 characters
- Wrap body at 72 characters
- Reference issues in footer: `Closes #123`, `Fixes #456`

---

## 📤 Pull Request Guidelines

### Before Submitting

1. **Sync with upstream**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting**

   ```bash
   npm run lint
   npm run build
   ```

3. **Ensure your changes don't break existing functionality**
   ```bash
   npm run dev
   # Test manually in browser
   ```

### Creating a Pull Request

1. **Push to your fork**

   ```bash
   git push origin your-branch-name
   ```

2. **Create PR on GitHub**
   - Use the PR template if available
   - Fill out all required sections
   - Link related issues

3. **PR Title Format**
   ```
   feat(auth): implement JWT token refresh
   fix(posts): resolve feed loading issue
   docs(readme): update installation guide
   ```

### PR Description Template

````markdown
## 📝 Description

Brief description of what this PR does.

## 🎯 Related Issue

Closes #123

## 🔧 Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## 📋 Checklist

- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing locally
- [ ] No breaking changes

## 🧪 Testing

Describe how to test these changes:

```bash
npm run dev
# Step by step testing procedure
```
````

## 📸 Screenshots/Evidence

If applicable, add screenshots or test results here.

## 🎓 Notes

Any additional context or decisions made.

````

### Review Process

- **Automated Checks**
  - ESLint must pass
  - TypeScript must compile
  - Build must succeed

- **Code Review**
  - At least 2 approvals required
  - Maintainers may request changes
  - Be respectful during discussions

- **Merge**
  - PR author squashes commits before merge
  - Merge using "Squash and Merge"
  - Delete branch after merge

---

## 🎨 Code Style

### TypeScript & JavaScript

```typescript
// ✅ Use TypeScript for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Use meaningful variable names
const userEmail = "user@example.com";

// ❌ Avoid abbreviations
const ue = "user@example.com"; // Bad

// ✅ Use arrow functions
const handleClick = () => {
  // Logic here
};

// ✅ Use const by default
const PI = 3.14159;
let counter = 0;

// ✅ Format with proper spacing
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
````

### React Components

```typescript
// ✅ Use functional components
interface CardProps {
  title: string;
  description: string;
  onClose?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      {onClose && (
        <button onClick={onClose} className="text-blue-500">
          Close
        </button>
      )}
    </div>
  );
};
```

### Tailwind CSS

```tsx
// ✅ Use semantic and consistent classNames
className =
  "flex items-center justify-between rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600";

// ✅ Use responsive prefixes
className = "flex flex-col gap-4 md:flex-row md:gap-8";

// ✅ Extract long classes into constants
const buttonClasses =
  "rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors";
```

### Formatting

- **Indentation**: 2 spaces (ESLint configured)
- **Line length**: Max 100 characters
- **Semicolons**: Required
- **Quotes**: Double quotes preferred
- **Trailing commas**: Yes in multi-line objects

### Running Linter

```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Check issues
npm run lint
```

---

## 🧪 Testing

### Write Tests For

- New features
- Bug fixes
- Complex logic
- API endpoints
- Authentication flows

### Test Structure

```typescript
describe("Feature Name", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = processInput(input);

    // Assert
    expect(result).toBe("expected output");
  });

  it("should handle edge cases", () => {
    expect(processInput(null)).toThrow();
  });
});
```

### Running Tests

```bash
npm test
npm test -- --watch
npm test -- --coverage
```

---

## 🐛 Reporting Bugs

### Before Reporting

- Check if the issue already exists
- Test with the latest version
- Gather all error messages and logs

### Bug Report Template

```markdown
## 🐛 Bug Description

A clear description of what the bug is.

## 📍 Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error '...'

## ✅ Expected Behavior

What should happen instead?

## 🖼️ Screenshots/Logs

Add screenshots, error logs, or console output.

## 💻 Environment

- OS: [e.g. Windows 11, macOS]
- Node Version: [e.g. 20.10.0]
- Browser: [e.g. Chrome 120]
- Repository Version: [branch or commit hash]

## 📝 Additional Context

Any other information relevant to the issue.
```

---

## ✨ Feature Requests

### Before Requesting

- Check existing issues and discussions
- Ensure the feature aligns with project goals

### Feature Request Template

```markdown
## 📝 Feature Description

A clear description of the feature you'd like to see.

## 🎯 Problem It Solves

What problem does this feature address?

## 💡 Proposed Solution

How do you envision this feature working?

## 🔄 Alternative Approaches

Other ways this could be implemented (if any).

## 📚 References

Links to related issues, discussions, or external resources.
```

---

## 🚀 Development Workflow

```bash
# 1. Create and checkout branch
git checkout -b feat/my-feature upstream/main

# 2. Make your changes and commit
git add .
git commit -m "feat(scope): description"

# 3. Keep branch updated
git fetch upstream
git rebase upstream/main

# 4. Run tests
npm run lint
npm run build

# 5. Push to your fork
git push origin feat/my-feature

# 6. Create Pull Request on GitHub

# 7. After approval and merge
git checkout main
git pull upstream main
git branch -d feat/my-feature
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org)

---

## ❓ Questions?

- 📖 Check the [README.md](README.md)
- 💬 Open a [Discussion](https://github.com/yourusername/learn-next-app/discussions)
- 🐛 File an [Issue](https://github.com/yourusername/learn-next-app/issues)
- 📧 Email: support@devposts.com

---

## 🎉 Final Tips

- Start with small contributions to get familiar with the process
- Don't hesitate to ask questions - we're here to help
- Be patient - reviews may take time
- Celebrate when your PR is merged! 🎊

---

<div align="center">

**Thank you for contributing to DevPostS Pro!**

Every contribution, no matter how small, helps make this project better.

</div>
