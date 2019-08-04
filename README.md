## Questrade Stock Dashboard

A Questrade Stock Dashboard I made for fun. Has a stock search and the stock symbol prices update every few seconds as long as the market is open (9:30AM EST to 4:00PM EST). 

## Motivation

This was a project I focused on during a small sabatical during my transition between jobs back in February 2019. I was spending a lot of time looking at stocks and figured I could probably leverage my Questrade API key into something useful.

## Tech & Frameworks used

<b>Built with</b>

- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [SCSS](https://sass-lang.com/)
- [Bootstrap 4](https://getbootstrap.com/)
- [Gulp](https://webpack.js.org/)
- [jQuery](https://jquery.com/)
- [Questrade API](https://www.questrade.com/api)
- [Chart.js](https://www.chartjs.org/)
- [EventSource Web API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

## How to use?

Run `npm i` to get all required dependencies.

Then change the key used in `server.js` to your unique Questrade API key. Then run `node server`. Navigate to `localhost:5000` in your browser. 

