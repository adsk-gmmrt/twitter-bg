var streamingThread = require('./streamingThread');
var LoggingFilter = require('./loggingFilter');

module.exports = function() {
  streamingThread.registerFilter(LoggingFilter.KEY, new LoggingFilter());
  return 'Streaming thread set up!'
};