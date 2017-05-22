const gulp = require('gulp');
const merge = require('merge2');
const ts = require('gulp-typescript');
const tsConfig = ts.createProject('src/app/ng2-mask/tsconfig.json');

gulp.task("gen:release", () => {

  /** compiling typescript files */
  const tsResult = gulp.src('src/app/ng2-mask/**/**.ts')
    .pipe(tsConfig());

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);

});
