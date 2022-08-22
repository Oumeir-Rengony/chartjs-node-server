const express = require("express");

const cors = require("cors");

const app = express();

const chartRoutes = require('./routes/charts');

app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.use(express.urlencoded({
    extended:true
}));

app.use(chartRoutes);

const PORT = process.env.PORT  || 4000;

app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`)
});