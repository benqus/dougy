if (typeof define === 'function') {
  define('dougy', [], function () {
    return dougy;
  });
} else if (typeof exports === 'object') {
  module.exports = dougy;
} else {
  //no conflict
  if (global.dougy) {
    dougy._dougy = global.dougy;
  }
  
  global.dougy = dougy;
}