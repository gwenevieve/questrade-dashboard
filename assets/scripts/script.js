$(document).ready(function() {
  var marketOpen;

  var update = new EventSource("/watchlist");
  update.onmessage = function(e) {
    let watchlistData = JSON.parse(e.data);

    $.each(watchlistData, function(index, result) {
      let watchlistSymbolName = "";
      let watchlistOpenPrice = "";
      let watchlistHighPrice = "";
      let watchlistLowPrice = "";
      let watchlistLastTradePrice = "";

      checkMarketStatus();

      $.each(result, function(index, value) {
        watchlistSymbolName += `<li>${value.symbol}</li>`;

        if (marketOpen == true) {
          watchlistOpenPrice += `<li>${value.openPrice}</li>`;
          watchlistHighPrice += `<li>${value.highPrice}</li>`;
          watchlistLowPrice += `<li>${value.lowPrice}</li>`;
        } else {
          watchlistOpenPrice += `<li>--</li>`;
          watchlistHighPrice += `<li>--</li>`;
          watchlistLowPrice += `<li>--</li>`;
        }

        if (
          marketOpen == true &&
          this.openPrice < this.lastTradePrice == true
        ) {
          watchlistLastTradePrice += `<li><span data-value="gain">${value.lastTradePrice}</span></li>`;
        } else if (
          marketOpen == true &&
          this.openPrice > this.lastTradePrice == true
        ) {
          watchlistLastTradePrice += `<li><span data-value="loss">${value.lastTradePrice}</span></li>`;
        } else {
          watchlistLastTradePrice += `<li><span data-value="closed">${value.lastTradePrice}</span></li>`;
        }

        $(".watchlistName").html(watchlistSymbolName);
        $(".watchlistLastTradePrice").html(watchlistLastTradePrice);
        $(".watchlistOpenPrice").html(watchlistOpenPrice);
        $(".watchlistHighPrice").html(watchlistHighPrice);
        $(".watchlistLowPrice").html(watchlistLowPrice);
      });
    });
  };

  fetch("/chartinfo", {})
    .then(response => response.json())
    .then(json => {
      let chartInfo = json;
      $.each(chartInfo, function(index, stock) {
        results = stock;
        $.each(chartInfo, function(i, results) {
          BABA = results[0].totalCost;
          CRON = results[1].totalCost;
        });
      });
      1;
      chartDisplay();
    })
    .catch(error => console.log(error));

  // Form submit

  $(".search__submit").on("click", function(e) {
    e.preventDefault();
    $(".search__submit").prop("disabled", true);

    setTimeout(function() {
      $(".search__submit").prop("disabled", false);
    }, 1000);

    $.ajax({
      url: "/search",
      type: "GET",
      data: {
        symbol: $("#search").val()
      },
      success: function(responseData) {
        let symbolName = "";
        let symbolId = "";
        let symbolDesc = "";

        $.each(responseData, function(index, value) {
          if (index === 7) {
            return false;
          }
          symbolName += `<li>${value.symbol}</li>`;
          symbolId += `<li>${value.symbolId}</li>`;
          symbolDesc += `<li>${value.description}</li>`;
          $(".name").html(symbolName);
          $(".symbolId").html(symbolId);
          $(".symbolDesc").html(symbolDesc);
        });
      },
      error: console.error
    });
  });

  // Chart

  chartDisplay = () => {
    let ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["BABA", "CRON"],
        datasets: [
          {
            fill: true,
            backgroundColor: ["#6825c3", "#8F42F4"],
            data: [BABA, CRON]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 50
          }
        }
      }
    });
  };

  // Check if market is open

  checkMarketStatus = () => {
    let beforeTime = moment("09:30:00", "HH:mm:ss");
    let afterTime = moment("16:00:00", "HH:mm:ss");
    let marketHours = moment().isBetween(beforeTime, afterTime);
    if (marketHours == true) {
      marketOpen = true;
      $(".marketStatus").html("Open").css("color", "#31c331");
    } else {
      marketOpen = false;
      $(".marketStatus").html("Closed").css("color", "red");
    }
  };
});
