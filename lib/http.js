const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const chalk = require("chalk");
const opn = require("opn");
const Utils = require("./utils");

module.exports = class Proxy {
  constructor(command) {
    this.command = command;
    this.program = command.program;
    this.baseDir = command.baseDir;
    this.app = express();

    this.conf = Utils.readConfig(this.baseDir);
    this.start();
  }
  setProxy() {
    for (let key in this.conf.proxy) {
      this.app.use(key, createProxyMiddleware(this.conf.proxy[key]));
    }
  }

  start() {
    this.app.use(express.static(this.baseDir));
    this.setProxy();
    this.app.listen(this.conf.port, () => {
      const uri = "http://127.0.0.1:" + this.conf.port;
      console.log(chalk.green("本地服务："), chalk.blue(uri));
      opn(uri);
    });
  }
};
