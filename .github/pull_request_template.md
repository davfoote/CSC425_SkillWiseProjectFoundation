# 🔄 Pull Request Template

## 📝 Description
Brief description of changes made in this PR.

## 🎯 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🧪 Test update
- [ ] 🔧 Configuration change

## 🧪 Testing
- [ ] I have run the unit tests locally (`npm test`)
- [ ] I have run the E2E tests locally (`npm run test:e2e`)
- [ ] I have tested this change manually
- [ ] I have added new tests that prove my fix is effective or that my feature works

## ✅ CI Pipeline Status
The following checks must pass before merge:

### 🔍 **Code Quality & Linting**
- **ESLint Backend**: Ensures code follows JavaScript/Node.js best practices
- **ESLint Frontend**: Ensures React code follows best practices
- **Result**: Code quality standards maintained

### 🧪 **Unit Tests (Jest)**
- **Authentication Tests**: 16 comprehensive tests for login, signup, logout, token refresh
- **Goals API Tests**: CRUD operations and business logic validation
- **Challenges API Tests**: Challenge lifecycle and progress tracking
- **Result**: All business logic verified in isolation

### 🚀 **End-to-End Tests (Cypress)**
- **User Workflow**: Complete user journey from registration to goal completion
- **Browser Testing**: Real browser interaction simulation
- **Integration Testing**: Frontend + Backend + Database integration
- **Result**: Full user experience validated

## 📋 Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## 🔗 Related Issues
Closes #(issue number)

## 📸 Screenshots (if applicable)
Add screenshots here to help explain your changes.

## 🎊 Additional Notes
Any additional information that reviewers should know.

---

## 🤖 For Reviewers

### ✅ **What to Check:**
1. **Code Quality**: Is the code clean, readable, and maintainable?
2. **Test Coverage**: Are new features/changes covered by tests?
3. **Documentation**: Is documentation updated if needed?
4. **Breaking Changes**: Will this break existing functionality?

### 🚦 **CI Pipeline Results:**
- ✅ **Green Pipeline**: All checks passed - ready to merge!
- ❌ **Red Pipeline**: Issues found - please review logs and request fixes

### 🎯 **Quality Gates:**
All the following must pass:
- **Linting**: Code style consistency ✅
- **Unit Tests**: Business logic validation ✅  
- **E2E Tests**: User experience validation ✅

**Only merge when all checks are green! 🟢**