module.exports = baseDir => ({
  port: 5156,
  proxy: {
    "/api": {
      target: "http://www.job5156.com",
      changeOrigin: true
    }
  },
  gulp: {
    scss: {
      src: [baseDir + "/scss/*.scss", "!" + baseDir + "/scss/sprite.scss"],
      dest: baseDir + "/css"
    },
    sprite: {
      src: baseDir + "/images/icons/*.png",
      dest: baseDir + "/images",
      config: {}
    },
    uglify: {
      src: [baseDir + "/js/*.js", "!" + baseDir + "/js/*.min.js"],
      dest: baseDir + "/js"
    }
  }
});
