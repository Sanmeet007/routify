const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
    return res.render("index.ejs");
});

app.get("/about-module", async (req, res) => {
    const result = await fetch("https://jsonplaceholder.typicode.com/todos/");
    const data = await result.json();
    return res.render("index.ejs", {
        data: JSON.stringify(data)
    });
});

app.use((req, res) => {
    res.status(404);
    return res.render("index");
});

app.listen(5500);