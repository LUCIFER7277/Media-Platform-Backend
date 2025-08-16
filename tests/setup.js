// Test environment setup
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/videotube_test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.STREAM_SECRET = 'test-stream-secret';
process.env.BASE_URL = 'http://localhost:8000';

// Increase timeout for database operations
jest.setTimeout(30000);
