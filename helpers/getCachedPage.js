const { visibleLog } = require('../dev_tools/visibleLog');

async function getCachedPage(redis, key) {
  const result = await redis
    .get(key)
    .then((response) => {
      return { status: true, data: response };
    })
    .catch((err) => {
      visibleLog(err);
      return { status: flase, data: JSON.stringify(err) };
    });

  return result;
}

exports.getCachedPage = getCachedPage;
