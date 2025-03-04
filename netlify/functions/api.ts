import serverless from 'serverless-http';
import express from 'express';
import * as dotenv from 'dotenv';
import { registerRoutes } from '../../server/routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
registerRoutes(app);

// Export the serverless function
export const handler = serverless(app);
