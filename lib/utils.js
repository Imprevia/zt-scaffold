const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const config = require("../zt.config.js");
const utils = {
  /**
   * 拷贝目录
   * @param copiedPath 拷贝的目录
   * @param resultPath 拷贝到的路径
   * @param direct  是否绝对路径
   */
  copyFolder(copiedPath, resultPath, direct) {
    if (!direct) {
      copiedPath = path.join(__dirname, copiedPath);
      resultPath = path.join(__dirname, resultPath);
    }

    const createDir = function(dirPath) {
      fs.mkdirSync(dirPath);
    };

    if (fs.existsSync(copiedPath)) {
      createDir(resultPath);
      /**
       * @des 方式一：利用子进程操作命令行方式
       */
      // child_process.spawn('cp', ['-r', copiedPath, resultPath])

      /**
       * @des 方式二：
       */
      const files = fs.readdirSync(copiedPath, { withFileTypes: true });
      for (let i = 0; i < files.length; i++) {
        const cf = files[i];
        const ccp = path.join(copiedPath, cf.name);
        const crp = path.join(resultPath, cf.name);
        if (cf.isFile()) {
          /**
           * @des 创建文件,使用流的形式可以读写大文件
           */
          const readStream = fs.createReadStream(ccp);
          const writeStream = fs.createWriteStream(crp);
          readStream.pipe(writeStream);
        } else {
          try {
            /**
             * @des 判断读(R_OK | W_OK)写权限
             */
            fs.accessSync(path.join(crp, ".."), fs.constants.W_OK);
            utils.copyFolder(ccp, crp, true);
          } catch (error) {
            console.log(chalk.red("folder write error:", error));
          }
        }
      }
    } else {
      console.log(chalk.red("do not exist path: ", copiedPath));
    }
  },

  readConfig(baseDir) {
    const confPath = path.resolve(baseDir, "zt.config.js");
    const conf = config(baseDir);
    if (fs.existsSync(confPath)) {
      const data = fs.readFileSync(confPath).toString();
      if (data) {
        return Object.assign(conf, JSON.parse(data));
      }
    }
    return conf;
  }
};
module.exports = utils;
