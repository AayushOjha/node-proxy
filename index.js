var express = require('express');
var axios = require('axios');
var httpProxy = require('http-proxy');
const Redis = require('ioredis');
var Proxy = httpProxy.createProxyServer();
var { visibleLog } = require('./dev_tools/visibleLog');
const { cacheIt } = require('./helpers/cacheIt');
const { getCachedPage } = require('./helpers/getCachedPage');

const redis = new Redis({
  host: 'redis-17451.c212.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 17451,
  password: 'UU93sz2NNcZsZhCHUqnCsHJGxIQjw1gI',
});

var app = express();
app.get('/favicon.ico', function (req, res) {
  Proxy.web(req, res, { target: 'http://localhost:3006' });
});
app.get('/_next/*', function (req, res) {
  Proxy.web(req, res, { target: 'http://localhost:3006' });
});
app.get('*', async function (req, res) {
  const domain = req.path;
  const isCached = await getCachedPage(redis, domain);
  if (isCached.status) {
    res
      .setHeader('content-type', 'text/html; charset=utf-8')
      .send(isCached.data);
  } else {
    const urlString = `http://localhost:3006${domain}`;
    axios
      .get(urlString)
      .then(async (resp) => {
        cacheIt(redis, domain, resp.data);
        res
          .setHeader('content-type', 'text/html; charset=utf-8')
          .send(resp.data);
      })
      .catch((err) => {
        visibleLog(err.message);
      });
  }
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
