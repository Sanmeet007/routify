const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));


app.get("*", (req, res) => {
    return res.sendFile("/index.html", {
        "root": "./public"
    });
});

app.listen(5500);