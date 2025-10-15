const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/error');
// Import your routes folder instead of inline router
const routes = require('./routes');

const port = process.env.PORT || 4000;
const app = express();

// ---- Database Connection ----
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    try {
      await db.collection('users').dropIndex('phone_1');
      console.log(" Dropped existing index 'phone_1'");
    } catch (err) {
      console.log("ℹ No existing 'phone_1' index to drop.");
    }

    await db.collection('users').createIndex(
      { phone: 1 },
      { unique: true, partialFilterExpression: { phone: { $type: "string" } } }
    );
    console.log("Partial unique index created on 'phone'");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// ---- Middleware ----
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.use('/api', routes); // Now mounts your real routers

app.get("/", (_req, res) => res.send("It's here!"));

// ---- Error Handling ----
function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}

function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
}

app.use(notFound);
app.use(errorHandler);

// ---- Start Server ----
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));