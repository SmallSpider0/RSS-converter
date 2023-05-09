import express from 'express';
import fetch from 'node-fetch'
import {HttpsProxyAgent} from 'https-proxy-agent'

const proxyAddress = 'http://127.0.0.1:7890'
const agent = new HttpsProxyAgent(proxyAddress)

export default class Server {

  async getData(url){
    let param = {
      agent: agent,
      timeout: 10000,
      method: 'get'
    }
    let response = {}
    try {
      response = await fetch(url, param)
    } catch (error) {
      logger.error(error.toString())
      return false
    }
    return response
  }

  start(){
    // 创建一个express应用
    const app = express();

    // 创建一个http-proxy实例
    const proxy = httpProxy.createProxyServer({});

    // 定义一个中间件函数，用于处理用户传入的rss订阅链接
    const handleRssFeed = (req, res) => {
      // 获取用户传入的rss订阅链接
      const rssUrl = req.query.rss;

      // 判断rss订阅链接是否存在
      if (!rssUrl) {
        // 如果不存在，返回错误信息
        res.status(400).send('Please provide a valid rss feed url.');
      } else {
        // 如果存在，使用http-proxy转发请求到rss订阅链接，并将响应返回给用户
        proxy.web(req, res, { target: rssUrl });
      }
    };

    // 定义一个路由，用于处理用户的get请求
    app.get('/', handleRssFeed);

    // 启动服务器，监听3000端口
    app.listen(3000, () => {
      console.log('Server is running on port 3000.');
    });
  }
}

