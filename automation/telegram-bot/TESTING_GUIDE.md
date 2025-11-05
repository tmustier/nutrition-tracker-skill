# Testing Guide for Telegram Bot

## Overview

This comprehensive testing suite ensures the reliability, security, and performance of the Telegram bot for nutrition tracking. The test suite covers:

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API interactions and external service integrations
- **Security Tests**: Authentication, authorization, and input validation
- **Error Handling Tests**: Network failures, API errors, and race conditions

## Test Structure

```
tests/
├── setup.js                    # Jest configuration and global utilities
├── unit/
│   ├── server.test.js          # HTTP endpoints and Express middleware
│   ├── webhook.test.js         # Telegram webhook handlers
│   └── config.test.js          # Configuration validation
└── integration/
    ├── claude-integration.test.js   # Claude AI API integration
    ├── github-integration.test.js   # GitHub repository operations
    ├── usda-api.test.js             # USDA nutrition database
    ├── security.test.js             # Security middleware
    └── error-handling.test.js       # Error scenarios and race conditions
```

## Running Tests

### Prerequisites

Install test dependencies:
```bash
npm install
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run legacy tests (compatibility)
npm run test:legacy
```

### Environment Variables for Testing

Create a `.env.test` file with test-specific configurations:

```env
# Test environment variables
TELEGRAM_BOT_TOKEN=mock_bot_token
ANTHROPIC_API_KEY=mock_claude_api_key
GITHUB_TOKEN=mock_github_token
GITHUB_OWNER=test_owner
GITHUB_REPO=test_repo
GITHUB_BRANCH=daily-logs
WEBHOOK_URL=https://test-webhook.example.com
USDA_API_KEY=mock_usda_key
ALLOWED_USERS=123456789,987654321
WEBHOOK_SECRET=test_webhook_secret
NODE_ENV=test
```

## Test Coverage Goals

The test suite aims for:
- **Lines**: ≥70%
- **Functions**: ≥70%
- **Branches**: ≥70%
- **Statements**: ≥70%

Current coverage can be viewed by running `npm run test:coverage`.

## Test Categories

### Unit Tests

#### Server Tests (`tests/unit/server.test.js`)
- HTTP endpoint responses (GET /, GET /setup, POST /webhook)
- Request validation and error handling
- Content-Type handling
- Malformed request processing

#### Webhook Tests (`tests/unit/webhook.test.js`)
- Text message processing
- Photo message handling
- Command execution (/start, /help, /today)
- Rate limiting middleware
- Authentication middleware
- Input sanitization
- Error propagation

#### Configuration Tests (`tests/unit/config.test.js`)
- Environment variable loading
- Default value handling
- Security configuration parsing
- Validation error handling

### Integration Tests

#### Claude Integration (`tests/integration/claude-integration.test.js`)
- Food log processing with Claude AI
- Image analysis with Claude Vision
- USDA fallback integration
- API error handling (rate limits, authentication)
- Response validation and energy calculations

#### GitHub Integration (`tests/integration/github-integration.test.js`)
- Repository file operations
- Daily log creation and updates
- Race condition handling with retries
- Atomic updates using file SHA
- Daily totals calculation
- Branch management

#### USDA API Integration (`tests/integration/usda-api.test.js`)
- Food search functionality
- Detailed nutrition data retrieval
- Nutrition data parsing and scaling
- Unit conversions
- Error handling for various API failures

#### Security Tests (`tests/integration/security.test.js`)
- User authentication and authorization
- Webhook secret verification
- Rate limiting implementation
- Input sanitization
- Security headers
- Attack vector prevention

#### Error Handling (`tests/integration/error-handling.test.js`)
- Network failures and timeouts
- API rate limiting and quotas
- Race conditions in file operations
- Memory and resource management
- Graceful degradation scenarios

## Mocking Strategy

The test suite uses comprehensive mocking to ensure:

1. **External API Isolation**: All HTTP requests are mocked using `nock`
2. **Deterministic Results**: Consistent test outcomes regardless of external service status
3. **Error Scenario Testing**: Ability to simulate various failure conditions
4. **Performance**: Fast test execution without network delays

### Key Mock Libraries

- **nock**: HTTP request mocking for external APIs
- **jest.mock()**: Module mocking for internal dependencies
- **supertest**: HTTP endpoint testing

## Security Testing

### Authentication Tests
- Authorized user access
- Unauthorized user rejection
- Missing user ID handling
- Configuration-based access control

### Rate Limiting Tests
- Request quota enforcement
- Per-user rate limiting
- Rate limit reset behavior
- Concurrent request handling

### Input Validation Tests
- Malicious input sanitization
- Control character removal
- Length limitation enforcement
- Special character handling

### Webhook Security Tests
- Secret token verification
- Header validation
- Replay attack prevention

## Error Handling Testing

### API Failure Scenarios
- **Claude API**: Timeouts, rate limits, authentication errors, malformed responses
- **GitHub API**: Repository access, branch protection, file conflicts, rate limits
- **USDA API**: Invalid keys, service outages, malformed data

### Race Condition Testing
- **Concurrent Log Updates**: Multiple users logging simultaneously
- **File Conflict Resolution**: GitHub SHA conflicts and retry logic
- **Rate Limit Boundaries**: Concurrent requests near limits

### Network Issues
- DNS resolution failures
- SSL/TLS certificate errors
- Connection timeouts
- Proxy authentication issues

## Performance Testing

### Resource Management
- Large payload handling
- Image processing memory limits
- Temporary resource cleanup
- Memory leak prevention

### Scalability Tests
- Concurrent user handling
- Rate limiting effectiveness
- API response time requirements
- Error recovery timing

## Test Data Management

### Global Test Utilities

The `tests/setup.js` file provides:

```javascript
// Mock Telegram update structure
global.mockTelegramUpdate(overrides)

// Standard nutrition data for testing
global.mockNutritionData

// Environment variable mocking
// Automatic cleanup after each test
```

### Fixtures and Mock Data

Tests use realistic but anonymized data:
- Sample Telegram messages and photos
- Complete nutrition data structures
- GitHub API response formats
- USDA database response formats

## Continuous Integration

The test suite is designed for CI/CD integration:

1. **Fast Execution**: Mocked dependencies ensure quick test runs
2. **Deterministic Results**: No external dependencies for consistent results
3. **Comprehensive Coverage**: All critical paths and error scenarios covered
4. **Clear Reporting**: Detailed output for debugging failures

### CI Configuration Example

```yaml
# Example GitHub Actions configuration
- name: Run Tests
  run: |
    npm ci
    npm run test:coverage
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## Debugging Tests

### Common Issues and Solutions

1. **Mock Cleanup**: Ensure `afterEach` blocks clear all mocks
2. **Async Issues**: Use proper `await` keywords for async operations
3. **Environment Isolation**: Tests should not affect each other
4. **Network Mocking**: Verify all external requests are intercepted

### Test Debugging Commands

```bash
# Run single test file
npx jest tests/unit/server.test.js

# Run tests with verbose output
npx jest --verbose

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test by name
npx jest --testNamePattern="should handle authentication"
```

## Contributing to Tests

### Writing New Tests

1. **Follow Naming Conventions**: Use descriptive test names
2. **Arrange-Act-Assert Pattern**: Clear test structure
3. **Mock External Dependencies**: Ensure test isolation
4. **Test Error Cases**: Include failure scenarios
5. **Update Documentation**: Document new test categories

### Test Review Checklist

- [ ] All external APIs properly mocked
- [ ] Error scenarios covered
- [ ] Security implications considered
- [ ] Performance impacts evaluated
- [ ] Documentation updated

### Example Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });

  afterEach(() => {
    // Cleanup mocks
  });

  describe('Happy Path', () => {
    it('should handle successful operation', async () => {
      // Arrange
      const testData = {};
      
      // Act
      const result = await functionUnderTest(testData);
      
      // Assert
      expect(result).toMatchObject({
        success: true
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API failures gracefully', async () => {
      // Test error scenario
    });
  });
});
```

## Test Maintenance

### Regular Updates
- Keep mock responses current with API changes
- Update test data for new features
- Review and update error scenarios
- Maintain documentation accuracy

### Performance Monitoring
- Monitor test execution time
- Optimize slow tests
- Balance thoroughness with speed
- Regular coverage analysis

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Realistic Mocking**: Mock data should match real API responses
3. **Error Coverage**: Test both success and failure paths
4. **Security Focus**: Always test security boundaries
5. **Documentation**: Keep tests self-documenting with clear names

This testing framework ensures the Telegram bot is reliable, secure, and maintainable while providing confidence in deployments and changes.