import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import router from './routes/rootRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

async function main() {
  await connectDB();

  app.use(router);

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error('❌ Error during server startup:', err);
});
