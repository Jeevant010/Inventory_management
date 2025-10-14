const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

const connectDB = require('./config/db');
const routes = require('./routes');

const port = process.env.PORT || 4000;


const app = express();






(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();



app.use(helmet());
app.use(cors());
app.use(compression());
// app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));



app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.use('/api', routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);


app.get( "/" , (req, res ) => res.send("It's here! ") );

app.listen( port , () => console.log(`Listening on port ${port}`) );