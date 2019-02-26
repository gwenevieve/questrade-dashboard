const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

var Questrade = require("questrade");
var qt = new Questrade("");
qt.account = "123456";

qt.on("ready", function(err, res) {
  if (err) {
    console.log(err);
  }
  app.get("/test", (req, res) => {
    getWatchlist(res);
  });
  console.log("test");
});

function getWatchlist(res) {
  var watchlist = [
    8049,
    39828,
    26052,
    7422546,
    16829059,
    37125,
    27454,
    6770,
    29814
  ];

  qt.getQuotes(watchlist, function(err, quotes) {
    if (err) {
      console.log(err);
    }
    watchlistResults = quotes;
    console.log(watchlistResults);
    res.send(watchlistResults);
  });
}

function searchQt(res) {
  qt.search(searchTerm, function(err, symbol) {
    if (err) {
      console.log(err);
    }
    result = symbol;
    console.log(result);
    res.json(result);
    //result.map(item =>
    //console.log(item.symbol + item.description + item.symbolId)
    //);
  });
}

app.get("/search", function(req, res) {
  searchTerm = req.query.symbol;
  searchQt(res);
});

const server = app.listen(3000, function() {});
