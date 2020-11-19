const gulp = require("gulp");
const path = require("path");
const $ = require("gulp-load-plugins")();
const pump = require("pump");
const Utils = require("./utils");

module.exports = class GulpFile {
  constructor(command, pro = "pc") {
    this.command = command;
    this.program = command.program;
    this.baseDir = command.baseDir;
    this.pro = pro;
    this.isWatch = false;

    const conf = Utils.readConfig(this.baseDir).gulp;
    this.scssSrc = conf.scss.src;
    // this.scssSrc = this.baseDir + '/scss/*.scss';
    this.scssDest = conf.scss.dest;
    this.spriteSrc = conf.sprite.src;
    this.spriteDest = conf.sprite.dest;
    this.spriteConfig = conf.sprite.config;
    this.uglifySrc = conf.uglify.src;
    this.uglifyDest = conf.uglify.dest;
  }

  scss() {
    const pumpArr = [
      gulp.src(this.scssSrc),
      $.plumber(),
      $.debug({ title: "scss:" }),
      $.dartSass(),
      $.autoprefixer({
        browsers:
          this.pro === "pc"
            ? [
                "last 2 versions",
                "ff<15",
                "Opera >11.5",
                "ie 8-11",
                "Android >=4.2",
              ]
            : ["Android >=4.2"],
        cascade: false,
        remove: false,
      }),
      $.minifyCss(),
      gulp.dest(this.scssDest),
    ];
    if (this.isWatch) {
      pumpArr.splice(2, 0, $.changed(this.scssDest, { extension: ".css" }));
    }
    return pump(pumpArr);
  }

  sprite() {
    return pump([
      gulp.src(this.spriteSrc),
      $.debug({ title: "sprite:" }),
      $.plumber(),
      $.spritesmith(
        Object.assign(
          {
            imgPath: "../images/icon-sprites.png",
            imgName: "icon-sprites.png",
            cssName: "../scss/sprite.scss",
            padding: 8,
            algorithm: "binary-tree", //"binary-tree",//"left-right", //"alt-diagonal",//top-down
            cssTemplate: path.resolve(
              __dirname,
              this.pro === "pc"
                ? "./cssTemplatePC.scss"
                : "./cssTemplateTouch.scss"
            ),
          },
          this.spriteConfig
        )
      ),
      gulp.dest(this.spriteDest),
    ]);
  }

  uglify() {
    const pumpArr = [
      gulp.src(this.uglifySrc),
      $.plumber(),
      $.rename({ suffix: ".min" }),
      $.debug({ title: "uglify:" }),
      $.babel({
        cwd: __dirname,
        configFile: path.resolve(__dirname, "./.babelrc"),
      }),
      $.uglify(),
      gulp.dest(this.uglifyDest),
    ];
    if (this.isWatch) {
      pumpArr.splice(3, 0, $.changed(this.uglifyDest, { extension: ".js" }));
    }
    return pump(pumpArr);
  }

  format() {
    return pump([
      gulp.src(this.uglifySrc),
      $.plumber(),
      $.debug({ title: "format:" }),
      $.pretty({
        parser: "babylon",
      }),
      gulp.dest(this.uglifyDest),
    ]);
  }

  build() {
    this.sprite();
    this.scss();
    this.uglify();
  }

  watch() {
    this.isWatch = true;
    $.watch([...this.scssSrc, this.spriteSrc, ...this.uglifySrc], () => {
      console.log("\n");
      this.scss();
      this.uglify();
      this.sprite();
    });
  }
};
