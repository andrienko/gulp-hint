Gulp-hint
===
Just a script that parses gulpfile.js based on pretty stupid regexes.

Usage
---

You add a gulp task:

    var gulp_hint = require('gulp-hint');
    gulp.task('help', gulp_hint.getHelp);

And then add comments (single-line ones!) before gulp.task definitions:

This uses no AST parser and may be buggy, tho fits my needs perfectly

    // Parse HTML templates
    gulp.task('html', function () {
      gulp.src("./source/*.html")
        .pipe(mustache(require('./source/variables.js'), {
          extension: '.html'
        }))
        .pipe(gulp.dest("./result"));
    });

And then, when you run `gulp help`, you will get something like this in your console:

    html    Parse HTML templates

More
---
More description to come.