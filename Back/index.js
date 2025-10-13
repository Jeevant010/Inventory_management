const express = require('express');

const port = 9080 ;


const app = express();

app.get( "/" , (req, res ) => res.send("It's here! ") );

app.listen( port , () => console.log(`Listening on port ${port}`) );