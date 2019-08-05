const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

var Questrade = require("questrade");
var keyDir = './seedToken';
var qt = new Questrade(keyDir);

qt.on("error", console.error);

qt.on("ready", function(err, res) {
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
			next(err);
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
				next(err);
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
			next(err);
		}
    result = symbol;
    res.json(result);
  });
}

app.get("/search", function(req, res) {
  searchTerm = req.query.symbol;
  searchQt(res);
});

const server = app.listen(process.env.PORT || 5000);
