import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('RiwiHub API');
});

let port = process.env.API_PORT || 3000;

app.listen(port, () =>
    console.log(`\nServer is running on http://localhost:${port}`));


