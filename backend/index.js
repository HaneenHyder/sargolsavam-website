const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Listening on Railway port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
