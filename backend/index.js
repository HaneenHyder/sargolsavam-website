const express = require('express');

const app = express();

/* REQUIRED for Railway health check */
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

/* IMPORTANT */
const PORT = process.env.PORT;

/* DO NOT DEFAULT HERE */
if (!PORT) {
    console.error('❌ PORT not provided by Railway');
    process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Listening on Railway port ${PORT}`);
});
