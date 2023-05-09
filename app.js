import Server from "./server.js";

let url = 'https://www.dmhy.org/topics/rss/rss.xml?keyword=%E4%B8%BA%E7%BE%8E%E5%A5%BD%E7%9A%84%E4%B8%96%E7%95%8C%E7%8C%AE%E4%B8%8A%E7%88%86%E7%84%B0'

let server = new Server()
let res = await server.getData(url)
console.log(res)