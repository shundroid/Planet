gulp   = require 'gulp'
coffee = require 'gulp-coffee'
less = require 'gulp-less'

gulp.task 'coffee', () ->
    gulp.src 'js/coffee/*.coffee'
        .pipe coffee()
        .pipe gulp.dest('js/')

gulp.task 'less', () ->
    gulp.src 'css/less/*.less'
        .pipe less()
        .pipe gulp.dest('css/')

gulp.task 'less-watch', () ->
  gulp.watch 'css/less/*.less', ['less'];