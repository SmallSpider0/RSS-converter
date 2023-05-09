import express from 'express';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fs from 'fs';
import https from 'https';

// 获取密钥对
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

// 定义api的sk
const sk = fs.readFileSync('sslcert/sk', 'utf8');

export default function proxyServer(proxyUrl, port, onListening) {
  const app = express();

  // 创建一个http-proxy实例
  let param = {
    agent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined,
    timeout: 10000,
    method: 'get'
  }

  // 定义一个中间件函数，用于处理用户传入的rss订阅链接
  const handleRssFeed = (req, res) => {
    if (sk != req.query.sk) {
      res.status(500).send("sk not allowed");
    }
    // 获取用户传入的rss订阅链接
    const rssUrl = req.query.url;

    // console.log("handle rss: ", rssUrl);

    // 判断rss订阅链接是否存在
    if (!rssUrl) {
      // 如果不存在，返回错误信息
      res.status(400).send('Please provide a valid rss feed url.');
    } else {
      // 如果存在，使用http-proxy转发请求到rss订阅链接，并将响应返回给用户
      fetch(rssUrl, param).then(rssRes => rssRes.text()).then((rssText) => {
        res.status(200).send(rssText);
      }).catch(e => {
        console.log(e.toString())
        res.status(500).send(e.toString());
      })
    }
  };

  // 定义一个路由，用于处理用户的get请求
  app.get('/', handleRssFeed);

  var httpsServer = https.createServer(credentials,app);

  // 启动服务器，监听3000端口
  httpsServer.listen(port, () => {
    console.log('Server is running on port: ', port);
    onListening();
  });

}
