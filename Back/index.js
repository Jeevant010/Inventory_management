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


mongoose.connect(
        `${process.env.MONGOURL}`

    ).then(async () => {
        console.log("Connected!");

        const db = mongoose.connection.db;
        try {
            await db.collection('users').dropIndex('phone_1');
            console.log(" Dropped existing index 'phone_1' ");
        } catch(err){
            console.log("ℹNo existing 'phone_1' to drop. " );
        }
            await db.collection('users').createIndex(
                { phone: 1 },
                { unique : true , partialFilterExpression: { phone : { $type : "string" } } }
            );
            console.log(" Partial unique index created on 'phone' ");
    }).catch( err => console.log("Error , Not connected!" , err));




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