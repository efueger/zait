//===================DEBUG===================
const casper = require('casper').Casper({
    verbose: true,
    logLevel: 'debug'
});

casper.on('error', function (err) {
    this.log(err, 'error');
    this.exit(1);
});
//===========================================

const config = require('modules/config.js').config(casper),
    commands = config.parsedCommands,
    timeReceiver = new require('./modules/TimeReceiver.js').TimeReceiver(casper);

let metrics = {};

casper.start().eachThen(commands, function (res) {
    const command = res.data;

    metrics[command.url] = {};

    timeReceiver.setPageLoadingTime(metrics[command.url], command.url);

    this.open(command.url, command.opts);
}).run();

casper.then(function () {
    console.log('METRICS', JSON.stringify(metrics));
});

//@TODO make eachThen instead of this
/*testedPagesUrl.forEach(function (urlEl, urlIndex) {
 (function (urlEl) {
 casper.then(function () {
 const url = urlEl.url || urlEl,
 urlRegex = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
 pageUri = url
 .match(urlRegex)[5]
 .substring(1),
 metricIndex = loadingMetrics.push({
 pageName: urlEl.alias || pageUri,
 timestamp: new Date().getTime(),
 metrics: {}
 }) - 1;

 LoadTest.setPageLoadingTime(loadingMetrics[metricIndex].metrics, url, this);
 });
 })(urlEl);
 });*/

