const express = require('express');
const PORT = 3000;

const app = express();

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
})


app.listen(PORT, () => {
    console.log("Server is alive")
})