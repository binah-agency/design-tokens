// Jest setup file for design tokens testing
// Global test setup
global.console = {
  ...console,
  // Add custom console methods for testing if needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Set up test environment
process.env.NODE_ENV = 'test';
