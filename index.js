const path = require("path");
const express = require("express");
const app = express();
const sharp = require("sharp");
const cors = require("cors");

app.use(cors());

var dir = path.join(__dirname, "data");

app.get("*", function(req, res) {
  const start = new Date();

  var query = req.query;
  var file;
  var dirs = req.path.split("/");
  const size = parseInt(dirs[1]);

  if (isNaN(size)) {
    if (query.width) {
      query.width = parseInt(query.width);
    }
    if (query.height) {
      query.height = parseInt(query.height);
    }
    if (!query.fit) {
      query.fit = sharp.fit.inside;
    }
    file = path.join(dir, req.path);
  } else {
    query.width = size;
    query.height = size;
    query.fit = sharp.fit.inside;

    file = dir;
    for (var i = 2; i < dirs.length; i++){
      file = path.join(file, dirs[i]);
    }
  }

  if (req.path.includes("/favicon.ico")) {
    return;
  }

  if (file.indexOf(dir + path.sep) !== 0) {
    return res.status(403).end("Forbidden");
  }

  sharp(file)
    .resize(query)
    .jpeg({ quality: 75, progressive: true })
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
      sharp("assets/no-image-icon-23490.png")
        .resize(query)
        .jpeg({ quality: 100, progressive: true })
        .toBuffer()
        .then(data => {
          res.set("Content-Type", "image/jpeg");
          res.send(data);
          var end = new Date() - start;
          console.info("Execution time: %dms", end);
          return;
        });
    });
});

app.listen(3000, function() {
  console.log("Listening on http://localhost:3000/");
});
