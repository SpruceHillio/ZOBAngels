/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  var configFile = 'config.' + (process.env.NODE_ENV || 'dev') + '.json';

  console.log('configFile: ',configFile);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON(configFile),

    bower: {
      install: {
        options: {
          install: true,
          copy: false,
          targetDir: './libs',
          cleanTargetDir: true
        }
      }
    },

    'string-replace' : {
      dist: {
        files: [
          {
            expand: true,
            src: 'app/*.js',
            dest: 'tmp/'
          },
          {
            expand: true,
            src: 'app/**/*.js',
            dest: 'tmp/'
          },
          {
            expand: true,
            src: 'shared/*.js',
            dest: 'tmp/'
          },
          {
            expand: true,
            src: 'cloud/*.js',
            dest: 'tmp/'
          },
          {
            expand: true,
            cwd: 'config',
            src: '.parse.*',
            dest: 'tmp/'
          },
          {
            expand: true,
            cwd: 'app',
            src: 'templates/**/*.html',
            dest: 'tmp/'
          },
          {
            expand: true,
            cwd: 'public',
            src: 'index.html',
            dest: 'tmp/'
          }
        ],
        options: {
          replacements: [
            {
              pattern: /'__FEATURES__'/g,
              replacement: '<%= config.features %>'
            },
            {
              pattern: /__TITLE__/g,
              replacement: '<%= config.title %>'
            },
            {
              pattern: /__ABOUT_TITLE__/g,
              replacement: '<%= config.about.title %>'
            },
            {
              pattern: /__ABOUT_TEXT__/g,
              replacement: '<%= config.about.text %>'
            },
            {
              pattern: /__ABOUT_LOCATION_LAT__/g,
              replacement: '<%= config.about.location.lat %>'
            },
            {
              pattern: /__ABOUT_LOCATION_LON__/g,
              replacement: '<%= config.about.location.lon %>'
            },
            {
              pattern: /__ABOUT_LOCATION_TITLE__/g,
              replacement: '<%= config.about.location.title %>'
            },
            {
              pattern: /__LOGIN_NOTICE_SHOW__/g,
              replacement: '<%= config.login.notice.show %>'
            },
            {
              pattern: /__LOGIN_NOTICE_TEXT__/g,
              replacement: '<%= config.login.notice.text %>'
            },
            {
              pattern: /__META_TITLE__/g,
              replacement: '<%= config.meta.title %>'
            },
            {
              pattern: /__META_DESCRIPTION__/g,
              replacement: '<%= config.meta.description %>'
            },
            {
              pattern: /__HOSTING_BASE__/g,
              replacement: '<%= config.hosting.base %>'
            },
            {
              pattern: /'__FACEBOOK_ID__'/g,
              replacement: '<%= config.facebook.app.id %>'
            },
            {
              pattern: /__FACEBOOK_APP_ACCESSTOKEN__/g,
              replacement: '<%= config.facebook.app.accessToken %>'
            },
            {
              pattern: /__FACEBOOK_PINNED_POST__/g,
              replacement: '<%= config.facebook.pinnedPost %>'
            },
            {
              pattern: /__TWITTER_HANDLE__/g,
              replacement: '<%= config.twitter.handle %>'
            },
            {
              pattern: /__PARSE_APPLICATION_ID__/g,
              replacement: '<%= config.parse.applicationId %>'
            },
            {
              pattern: /__PARSE_JAVA_SCRIPT_KEY__/g,
              replacement: '<%= config.parse.javaScriptKey %>'
            },
            {
              pattern: /__PARSE_LINK__/g,
              replacement: '<%= config.parse.link %>'
            },
            {
              pattern: /'__PARSE_ADMINS__'/g,
              replacement: '<%= config.parse.admins %>'
            },
            {
              pattern: /__GOOGLE_APPLICATION_KEY__/g,
              replacement: '<%= config.google.applicationKey %>'
            },
            {
              pattern: /"__SLACK_HOOKS_TAKERELEASE__"/g,
              replacement: '<%= config.slack.hooks.takeRelease %>'
            },
            {
              pattern: /"__SLACK_HOOKS_MISSINGANGELS__"/g,
              replacement: '<%= config.slack.hooks.missingAngel %>'
            },
            {
              pattern: /__SLACK_TEAM__/g,
              replacement: '<%= config.slack.team %>'
            },
            {
              pattern: /__SLACK_HOOK__/g,
              replacement: '<%= config.slack.hook %>'
            },
            {
              pattern: /__SLACK_KEY__/g,
              replacement: '<%= config.slack.key %>'
            },
            {
              pattern: /__SLACK_CHANNEL_TAKERELEASE__/g,
              replacement: '<%= config.slack.channel.takeRelease %>'
            },
            {
              pattern: /__SLACK_CHANNEL_ORDER__/g,
              replacement: '<%= config.slack.channel.order %>'
            },
            {
              pattern: /__SLACK_CHANNEL_MISSINGANGELS__/g,
              replacement: '<%= config.slack.channel.missingAngel %>'
            }
          ]
        }
      },
      parse: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/moment-timezone/builds/',
            src: 'moment-timezone-with-data.js',
            dest: 'tmp/cloud/'
          }
        ],
        options: {
          replacements: [
            {
              pattern: 'module.exports = factory(require(\'moment\')); // Node',
              replacement: 'module.exports = factory(require(\'cloud/moment\')); // Node'
            }
          ]
        }
      }
    },

    uglify: {
      'checklist-model': {
        files: {
          'tmp/checklist-model.min.js': [ 'libs/checklist-model/checklist-model.js' ]
        },
        options: {
          mangle: false
        }
      },
      'angular-permission': {
        files: {
          'tmp/angular-permission.min.js': [ 'libs/angular-permission/dist/angular-permission.js' ]
        },
        options: {
          mangle: false
        }
      },
      'parse-angular': {
        files: {
          'tmp/parse-angular.min.js': [ 'libs/parse-angular-patch/src/parse-angular.js' ]
        },
        options: {
          mangle: false
        }
      },
      dist: {
        files: {
          'tmp/app.js': [ 'tmp/app.js' ]
        },
        options: {
          mangle: false
        }
      }
    },

    html2js: {
      options: {
        base: 'tmp'
      },
      dist: {
        src: [ 'tmp/templates/**/*.html' ],
        dest: 'tmp/templates.js'
      }
    },

    clean: {
      'dist' : {
        src: [ 'dist' ]
      },
      'parse' : {
        src: [ 'dist_parse' ]
      },
      temp: {
        src: [ 'tmp' ]
      }
    },

    copy: {
      dist: {
        files : [
          {
            expand: true,
            cwd: "tmp/",
            src: ['index.html'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            src: ['assets/images/*'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: '<%= config.assetsDir %>',
            src: ['assets/images/*'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'libs/bootstrap',
            src: ['fonts/*'],
            dest: 'dist/assets',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'libs/fontawesome',
            src: ['fonts/*'],
            dest: 'dist/assets',
            filter: 'isFile'
          }
        ]
      },
      parse: {
        files : [
          {
            expand: true,
            cwd: 'tmp/',
            src: ['shared/*'],
            dest: 'dist_parse/cloud/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'tmp/cloud/',
            src: ['*'],
            dest: 'dist_parse/cloud/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/moment/',
            src: ['moment.js'],
            dest: 'dist_parse/cloud/',
            filter: 'isFile'
          },
          {
            expand: true,
            src: ['public/*'],
            dest: 'dist_parse/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: "tmp/",
            src: ['index.html'],
            dest: 'dist_parse/public/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'tmp',
            src: ['.parse.*'],
            dest: 'dist_parse/',
            filter: 'isFile'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: ';\n'
      },
      css: {
        src: [
          'libs/bootstrap/dist/css/bootstrap.min.css',
          'libs/angular-bootstrap/ui-bootstrap-csp.css',
          'libs/fontawesome/css/font-awesome.min.css',
          'libs/angular-chart.js/dist/angular-chart.min.css',
          'libs/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css',
          'libs/ng-tags-input/ng-tags-input.min.css',
          'libs/ng-tags-input/ng-tags-input.bootstrap.min.css',
          'assets/css/app.css'
        ],
        dest: 'dist/assets/css/app.css',
        options: {
          separator: '\n'
        }
      },
      app: {
        src: [
          'tmp/app/js/*.js',
          'tmp/app/js/**/*.js',
          'tmp/shared/*.js'
        ],
        dest: 'tmp/app.js'
      },
      dist: {
        src: [
          'libs/jquery/dist/jquery.min.js',
          'libs/lodash/lodash.min.js',
          'libs/angular/angular.min.js','' +
          'libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'libs/ngmap/build/scripts/ng-map.min.js',
          'libs/angular-ui-router/release/angular-ui-router.min.js',
          'tmp/angular-permission.min.js',
          'libs/Chart.js/Chart.min.js',
          'libs/angular-chart.js/dist/angular-chart.min.js',
          'libs/ng-tags-input/ng-tags-input.min.js',
          'tmp/checklist-model.min.js',
          'libs/parse/parse.min.js',
          'tmp/parse-angular.min.js',
          'libs/bootstrap/dist/js/bootstrap.min.js',
          'libs/moment/min/moment-with-locales.min.js',
          'tmp/templates.js',
          'tmp/app.js' ],
        dest: 'dist/assets/js/app.js'
      }
    },

    jshint: {
      all: [ 'Gruntfile.js', 'app/js/*.js', 'app/js/**/*.js', 'shared/*.js', 'shared/**/*.js', 'cloud/*.js', 'cloud/**/*.js' ]
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 4040
        }
      }
    },

    watch: {
      dev: {
        files: [ configFile, 'Gruntfile.js', 'app/js/*.js', 'app/js/**/*.js', 'public/*.html', 'public/**/*.html', 'app/templates/*.html', 'app/templates/**/*.html', 'assets/css/*.css', '<%= config.assetsDir %>**/*' ],
        tasks: [ 'jshint', 'uglify:checklist-model', 'uglify:angular-permission', 'uglify:parse-angular', 'string-replace:dist', 'html2js:dist', 'concat:css', 'concat:app', 'concat:dist', 'copy:dist', 'clean:temp' ],
        options: {
          atBegin: true
        }
      },
      parse: {
        files: [ configFile, 'Gruntfile.js', 'shared/*.js', 'cloud/*.js', 'config/.parse.*' ],
        tasks: [ 'jshint', 'string-replace:dist', 'concat:app', 'clean:parse', 'copy:parse', 'clean:temp' ],
        options: {
          atBegin: true
        }
      },
      min: {
        files: [ configFile, 'Gruntfile.js', 'app/js/*.js', 'app/js/**/*.js', '*.html', '<%= config.assetsDir %>**/*' ],
        tasks: [ 'jshint', 'uglify:checklist-model', 'uglify:angular-permission', 'uglify:parse-angular', 'string-replace:dist', 'html2js:dist', 'concat:css', 'concat:app', 'uglify:dist', 'concat:dist', 'copy:dist', 'clean:temp' ],
        options: {
          atBegin: true
        }
      }
    },

    aws: grunt.file.readJSON('deploy-keys.json'), // Load deploy variables

    aws_s3: {
      options: {
        debug: false,
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        region: '<%= aws.AWSRegion %>',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      production: {
        options: {
          bucket: '<%= config.aws.deploy.bucket %>'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**/*'],
            dest: '/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-aws-s3');

  // Run the dev server
  grunt.registerTask('dev', [
    //'bower', // We're not running bower at the moment as we patched the parse-angular library
    'connect:server',
    'watch:dev' ]);
  // Run the dev server with minified own JavaScript
  grunt.registerTask('minified', [
    //'bower', // We're not running bower at the moment as we patched the parse-angular library
    'connect:server',
    'watch:min' ]);
  // Build the distribution
  grunt.registerTask('package:dist', [
    //'bower', // We're not running bower at the moment as we patched the parse-angular library
    'jshint',
    'clean:dist',
    'uglify:checklist-model',
    'uglify:angular-permission',
    'uglify:parse-angular',
    'string-replace:dist',
    'html2js:dist',
    'concat:css',
    'concat:app',
    'uglify:dist',
    'concat:dist',
    'copy:dist',
    'clean:temp' ]);
  // Deploy to AWS S3
  grunt.registerTask('deploy:s3', [
    'package:dist',
    'aws_s3' ]);
  grunt.registerTask('package:parse', [
    'jshint',
    'string-replace:dist',
    'string-replace:parse',
    'concat:app',
    'clean:parse',
    'copy:parse',
    'clean:temp' ]);
};