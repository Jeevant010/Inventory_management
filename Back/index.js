require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/error');
const routes = require('./routes');
const sanitizeEmptyStrings = require('./middleware/sanitize');

const PORT = process.env.PORT || 4000;
const app = express();

// ---- Database Connection ----
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    try {
      await db.collection('users').dropIndex('phone_1');
      console.log("Dropped existing index 'phone_1'");
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
app.use(sanitizeEmptyStrings); // sanitize before routes

// ---- Routes ----
app.use('/api', routes);

app.get('/', (req, res) => res.send("It's here!"));

// ---- Error handlers (after routes) ----
app.use(notFound);
app.use(errorHandler);

// ---- Start Server ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
