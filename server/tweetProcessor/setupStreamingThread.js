var streamingThread = require('./streamingThread');
var LoggingFilter = require('./loggingFilter');
var AggregateFilter = require('./aggregateFilter');
var DevDummyFilter = require('./devDummyFilter');

module.exports = function() {
  streamingThread.registerFilter(LoggingFilter.KEY, new LoggingFilter());
  //streamingThread.registerFilter(AggregateFilter.KEY, new AggregateFilter());
  //streamingThread.registerFilter(DevDummyFilter.KEY, new DevDummyFilter());
  return 'Streaming thread set up!'
};
