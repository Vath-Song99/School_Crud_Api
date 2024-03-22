import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';
import connectToDatabase from '../connecToDb';
import { handleConnectToMongoServer } from '../mongoMemoryServer ';
import app from '../../app';

dotenv.config();

const URL = process.env.MONGODB_URI || '';
let server: any;


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
