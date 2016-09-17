import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

export = () => {
  let fontName = 'baiding-icon';

  return gulp.src([join(Config.APP_SRC, '/assets/icon/*.svg')])
    .pipe(plugins.iconfontCss({
      fontName: fontName,
      path: join(Config.CSS_SRC, '/_icons.template.css'),
      targetPath: '../../css/icons.css',
      fontPath: `../assets/fonts/`,
      cssClass: 'bi'
    }))
    .pipe(plugins.iconfont({
      fontName: fontName,
      normalize: true,
      centerHorizontally: true,
      // descent: 150,
      // fixedWidth: true,
      fontHeight: 3000,
      formats: [ 'ttf', 'eot', 'woff', 'woff2', 'svg' ],
    }))
    .pipe(gulp.dest(Config.FONT_DEST));
};
