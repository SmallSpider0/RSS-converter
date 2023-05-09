import http from "http";
import fetch from 'node-fetch'
import proxyServer from "./server.js";

let server = await new Promise((res, rej) => {
    let proxy = "http://127.0.0.1:7890"
    let server = proxyServer(proxy, 3000, () => res());
    return server;
})

let url = 'https://www.dmhy.org/topics/rss/rss.xml?keyword=为美好的世界献上爆焰'

let rr = await fetch(url);
fetch(url).then(res => {
    console.log("test:", res.body);
})

fetch(`http://127.0.0.1:3000/?url=${encodeURIComponent(url)}&sk=${"sksksk"}`).then(res => res.text()).then(text => {
    console.log("return:", text);
}).catch(e => {
    console.log("post err: ", e);
})

