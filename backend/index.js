// Import required packages
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const prisma = require('./models/prisma');
const routes = require('./routes');

// Initialize clients
const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(express.json());

// --- API Routes ---
app.use('/', routes);

// --- Server Initialization ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Connected to Prisma and Supabase');
});

// Graceful shutdown for Prisma Client
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected.');
});
