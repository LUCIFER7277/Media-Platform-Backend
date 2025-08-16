import request from 'supertest';
import { app } from '../src/app.js';
import { AdminUser } from '../src/models/adminUser.model.js';
import connectDB from '../src/db/index.js';
import mongoose from 'mongoose';

describe('Authentication Tests', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clean up before each test
        await AdminUser.deleteMany({});
    });

    describe('POST /api/v1/auth/signup', () => {
        it('should create a new admin user', async () => {
            const adminData = {
                email: 'test@example.com',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(adminData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(adminData.email);
            expect(response.body.data.password).toBeUndefined(); // Password should not be returned
        });

        it('should not create admin with invalid email', async () => {
            const adminData = {
                email: 'invalid-email',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(adminData);

            expect(response.status).toBe(400);
        });

        it('should not create admin with missing password', async () => {
            const adminData = {
                email: 'test@example.com'
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(adminData);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Email and password are required');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            // Create a test user before login tests
            const admin = new AdminUser({
                email: 'test@example.com',
                password: 'testpassword123'
            });
            await admin.save();
        });

        it('should login with correct credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.admin.email).toBe(loginData.email);
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
        });

        it('should not login with wrong password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('Invalid admin credentials');
        });

        it('should not login with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            expect(response.status).toBe(404);
            expect(response.body.message).toContain('Admin does not exist');
        });
    });
});
