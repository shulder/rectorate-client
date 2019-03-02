const path = require('path');
const express = require('express');
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '/app')));

app.listen(port, () => console.log(`Client is serving on port ${port}`));
