'use strict';
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const utils = require('./utils');
const GulpFile = require('./gulpfile');
const Http = require('./http');

module.exports = class Action {
  constructor(command) {
    this.command = command;
    this.program = command.program;
    this.baseDir = command.baseDir;
  }

  init(options) {
    if (!options.args || options.args.length !== 1) {
      console.log(chalk.red('请输入要创建的专题目录名称'));
      return;
    }
    const proPath = path.resolve(this.baseDir, options.args[0]);
    if (fs.existsSync(proPath)) {
      console.log(chalk.red('专题目录已存在'));
      return;
    }
    const temp = path.resolve(__dirname, '../template');
    try {
      utils.copyFolder(temp, proPath, true);
      console.log(chalk.green('专题创建成功'));
    } catch (e) {
      console.log(chalk.red(e));
    }
  }
  start(options) {
    new Http(this.command);
    const gulpFile = new GulpFile(this.command, this.getPro(options));
    gulpFile.watch();
  }
  build(options) {
    const gulpFile = new GulpFile(this.command, this.getPro(options));
    let task = "build";
    if (!options.args || options.args.length === 1) {
      const pro = options.args[0];
      if (pro && pro !== "pc" && pro !== "touch") {
        task = options.args[0];
      }
    } else if (!options.args || options.args.length > 1) {
      if (options.args[1]) {
        task = options.args[1]
      }
    }
    if (gulpFile[task]) {
      gulpFile[task]();
    }
  }
  getPro(args) {
    if (!args || args.length > 0) {
      if (args[0] === 'touch') {
        return "touch";
      } else {
        return "pc"
      }
    }
  }
}
