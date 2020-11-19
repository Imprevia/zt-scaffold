'use strict';
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const Action = require('./action');

module.exports = class Command {
  constructor() {
    this.baseDir = process.cwd();
    this.program = program;
    this.commands = ['init', 'start', 'build'];
    this.action = new Action(this);
  }

  version() {
    const pkg = require(path.resolve(__dirname, '../package.json'));
    this.program.version(pkg.version, '-v, --version');
  }

  option() {
    this.program
      .option('init [dir]', '创建专题的目录名称')
      .option('start [pro]', '监听文件修改 pro: pc、touch')
      .option('build [pro] [task]', '打包项目 pro: pc、touch, task: 选填 scss、uglify、sprite')
  }

  init() {
    this.program
      .command('init')
      .option('[dir]', '创建专题的目录名称')
      .action( opt => {
        this.action.init(opt);
      })
  }

  start() {
    this.program
      .command('start')
      .action( opt => {
        this.action.start(opt);
      })
  }

  build() {
    this.program
      .command('build')
      .option('[task]', 'task: 选填 scss、uglify、sprite')
      .action( (opt) => {
        this.action.build(opt);
      })
  }

  command() {
    this.commands.forEach(cmd => {
      if (this[cmd]) {
        this[cmd].apply(this);
      } else {
        console.log(chalk.red(`The command [${cmd}] is not implemented!`));
      }
    });
  }

  parse() {
    this.program.parse(process.argv);
  }
  run() {
    this.version();
    this.option();
    this.command();
    this.parse();
  }
}
