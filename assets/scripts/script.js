$(document).ready(function() {
  var marketOpen;

  $.ajax({
    url: "/watchlist",
    type: "GET",
    success: function(watchlistData) {
      console.log(watchlistData);

      let watchlistSymbolName = "";
      let watchlistOpenPrice = "";
      let watchlistHighPrice = "";
      let watchlistLowPrice = "";
      let watchlistLastTradePrice = "";

      checkMarketStatus();

      $.each(watchlistData, function(index, value) {
        if (marketOpen == true) {
          watchlistOpenPrice += `<li>${value.openPrice}</li>`;
          watchlistHighPrice += `<li>${value.highPrice}</li>`;
          watchlistLowPrice += `<li>${value.lowPrice}</li>`;
        } else {
          watchlistOpenPrice += `<li>--</li>`;
          watchlistHighPrice += `<li>--</li>`;
          watchlistLowPrice += `<li>--</li>`;
        }

        watchlistChartData = [6770].lastTradePrice;

        watchlistSymbolName += `<li>${value.symbol}</li>`;
        watchlistLastTradePrice += `<li><span>${value.lastTradePrice}</span></li>`;

        $(".watchlistName").html(watchlistSymbolName);
        $(".watchlistLastTradePrice").html(watchlistLastTradePrice);
        $(".watchlistOpenPrice").html(watchlistOpenPrice);
        $(".watchlistHighPrice").html(watchlistHighPrice);
        $(".watchlistLowPrice").html(watchlistLowPrice);

        if (marketOpen == false) {
          $(".watchlistLastTradePrice li span").css("background", "#797979");
        } else if (watchlistOpenPrice > watchlistLastTradePrice) {
          $(".watchlistLastTradePrice li span").css("background", "red");
        } else if (watchlistOpenPrice < watchlistLastTradePrice) {
          $(".watchlistLastTradePrice li span").css("background", "#31c331");
        } else {
        }
      });

      chartDisplay(watchlistOpenPrice, watchlistLastTradePrice);
      console.log(myChart.data);

      addData(myChart, "one", watchlistChartData);
    },
    error: console.error
  });

  // Form submit
  $(".search__submit").on("click", function(e) {
    e.preventDefault();
    $.ajax({
      url: "/search",
      type: "GET",
      data: {
        symbol: $("#search").val()
      },
      success: function(responseData) {
        console.log(responseData);

        let symbolName = "";
        let symbolId = "";
        let symbolDesc = "";

        $.each(responseData, function(index, value) {
          console.log(index);
          if (index === 9) {
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

  chartDisplay = (watchlistOpenPrice, watchlistLastTradePrice) => {
    console.log(watchlistOpenPrice);
    let ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["one", "two"],
        datasets: [
          {
            label: "Current price",
            fill: false,
            borderColor: "#2fb5c6",
            data: [watchlistOpenPrice, watchlistLastTradePrice]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    //console.log(myChart.data);
  };

  //Chart update

  addData = (chart, label, data) => {
    setInterval(function() {
      console.log("updating");
      chart.data.labels.push(label);
      chart.data.datasets.forEach(dataset => {
        dataset.data.push([data]);
      });
      chart.update();
    }, 5000);
  };

  checkMarketStatus = () => {
    let now = moment().format("HH:mm:ss");
    let beforeTime = moment("09:30:00", "HH:mm:ss");
    let afterTime = moment("16:00:00", "HH:mm:ss");
    let marketHours = moment().isBetween(beforeTime, afterTime);
    console.log(marketHours);
    if (marketHours == true) {
      marketOpen = true;
      $(".marketStatus").html("Open").css("color", "#31c331");
    } else {
      marketOpen = false;
      $(".marketStatus").html("Closed").css("color", "red");
    }
  };
});
