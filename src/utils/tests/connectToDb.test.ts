import mongoose from 'mongoose';
import request from 'supertest';
import { handleConnectToMongoServer } from '../mongoMemoryServer ';
import app from '../../app';

handleConnectToMongoServer()

describe('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 indicates connected state
  });
});

describe('API Endpoints', () => {
  it('should respond with 200 for GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
  // Add more test cases for your API endpoints here
});
