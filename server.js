const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

var Questrade = require("questrade");
var qt = new Questrade(process.env.TOKEN);

var options = {
  test: true
};

qt.on("ready", function(err, res) {
  if (err) {
    console.log(err);
  }

  app.get("/watchlist", (req, res) => {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    });
    getWatchlist(res);
  });

  app.get("/chartinfo", (req, res) => {
    getChartInfo(res);
  });
});

function getChartInfo(res) {
  qt.getPositions(function(err, positions) {
    if (err) {
      console.log(err);
    }
    chartInfo = positions;
    res.send(chartInfo);
  });
}

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

  setInterval(function() {
    qt.getQuotes(watchlist, function(err, quotes) {
      if (err) {
        console.log(err);
      }
      watchlistResults = quotes;

      //console.log(JSON.stringify(watchlistResults));
      res.write("data: " + JSON.stringify({ watchlistResults }) + "\n\n");
    });
  }, 1000);
}

function searchQt(res) {
  qt.search(searchTerm, function(err, symbol) {
    if (err) {
      console.log(err);
    }
    result = symbol;
    //console.log(result);
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

const server = app.listen(process.env.PORT || 5000);
