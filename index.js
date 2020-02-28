const path = require("path");
const express = require("express");
const app = express();
const sharp = require("sharp");
const cors = require("cors");

app.use(cors());

var dir = path.join(__dirname, "data");

app.get("*", function(req, res) {
  const start = new Date();
  const file = path.join(dir, req.path);
  if (file.indexOf(dir + path.sep) !== 0) {
    return res.status(403).end("Forbidden");
  }
  var query = req.query;
  if (query.width) {
    query.width = parseInt(query.width);
  }
  if (query.height) {
    query.height = parseInt(query.height);
  }

  sharp(file)
    .resize(req.query)
    .toBuffer()
    .then(data => {
      res.set("Content-Type", "image/jpeg");
      res.send(data);
      var end = new Date() - start;
      console.info("Execution time: %dms", end);
      return;
    })
    .catch(err => {
      console.log("Error: " + err.toString());
      return res.status(404).end(err.message);
    });
});

app.listen(3000, function() {
  console.log("Listening on http://localhost:3000/");
});
