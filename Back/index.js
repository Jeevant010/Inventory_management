const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
// const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/error');
// Import your routes folder instead of inline router
const routes = require('./routes');
const sanitizeEmptyStrings = require('./middleware/sanitize');

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

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: [ "http://localhost:5173", "http://localhost:5174" ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
}));
// app.use(compression());

app.use(helmet());
// ---- Routes ----
app.use('/api', routes); // Now mounts your real routers

app.get("/", (_req, res) => res.send("It's here!"));


app.use(notFound);
app.use(errorHandler);
app.use(sanitizeEmptyStrings);

// ---- Start Server ----
app.listen(port, "0.0.0.0", () => console.log(`Server listening on port http://localhost:${port}`));