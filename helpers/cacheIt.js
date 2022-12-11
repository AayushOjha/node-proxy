const { visibleLog } = require('../dev_tools/visibleLog');

async function cacheIt(redis, key, value) {
  const result = await redis.set(key, value);
  if (result != 'OK') {
    visibleLog('Broken application, please fix it');
    return false;
  }
  return true;
}

exports.cacheIt = cacheIt;
