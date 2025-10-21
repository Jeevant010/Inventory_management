require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/error');
const routes = require('./routes');
const sanitizeEmptyStrings = require('./middleware/sanitize');

const PORT = process.env.PORT || 4000;
const app = express();

console.log('Starting app — NODE_ENV=%s, PORT=%s', process.env.NODE_ENV || 'undefined', process.env.PORT || 'undefined');

// ---- Safety logging for envs (do NOT print secrets) ----
if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI is not set — DB connection will fail unless you set this in Render environment variables.');
}

// ---- Middleware ----

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeEmptyStrings); // sanitize before routes

app.use(cookieParser());

app.use(cors({
    origin: [ "http://localhost:5173", "http://localhost:5174" , "https://inventory-management-lovat-seven.vercel.app" ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
}));
// app.use(compression());

app.use(helmet());
// ---- Routes ----
app.use('/api', routes);
app.get('/', (req, res) => res.send("It's here!"));

// ---- Error handlers (after routes) ----
app.use(notFound);
app.use(errorHandler);

// ---- Graceful/unhandled error logging ----
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

// ---- Connect to Mongo and create index with try/catch. Start server in finally ----
async function init() {
  try {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
        // options - Mongoose 6+ usually works fine without these, but they're harmless
      });
      console.log('Connected to MongoDB');

      const db = mongoose.connection.db;

      // Drop index if exists (wrapped in its own try/catch)
      try {
        await db.collection('users').dropIndex('phone_1');
        console.log("Dropped existing index 'phone_1'");
      } catch (err) {
        console.log("ℹ No existing 'phone_1' index to drop or drop failed:", err.message);
      }

      // Create partial unique index
      try {
        await db.collection('users').createIndex(
          { phone: 1 },
          { unique: true, partialFilterExpression: { phone: { $type: "string" } } }
        );
        console.log("Partial unique index created on 'phone'");
      } catch (err) {
        console.error('Failed to create index on users.phone:', err);
      }
    } catch (err) {
      // Top-level DB connection/index error
      console.error('MongoDB connection/index error:', err);
      // Do not throw — we'll still start the server so Render sees a running process and you can inspect logs
    }
  } finally {
    // Start HTTP server regardless of DB success/failure so Render won't exit early
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}

init();
