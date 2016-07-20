var streamingThread = require('./streamingThread');
var LoggingFilter = require('./loggingFilter');
var AggregateFilter = require('./aggregateFilter');

module.exports = function() {
  streamingThread.registerFilter(LoggingFilter.KEY, new LoggingFilter());
  streamingThread.registerFilter(AggregateFilter.KEY, new AggregateFilter());
  return 'Streaming thread set up!'
};