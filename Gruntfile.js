/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

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
            src: 'index.html',
            dest: 'dist/'
          }
        ],
        options: {
          replacements: [
            {
              pattern: /META_TITLE/g,
              replacement: '<%= config.meta.title %>'
            },
            {
              pattern: /META_DESCRIPTION/g,
              replacement: '<%= config.meta.description %>'
            },
            {
              pattern: /HOSTING_BASE/g,
              replacement: '<%= config.hosting.base %>'
            },
            {
              pattern: /'FACEBOOK_ID'/g,
              replacement: '<%= config.facebook.appId %>'
            },
            {
              pattern: /PARSE_APPLICATION_ID/g,
              replacement: '<%= config.parse.applicationId %>'
            },
            {
              pattern: /PARSE_JAVA_SCRIPT_KEY/g,
              replacement: '<%= config.parse.javaScriptKey %>'
            },
            {
              pattern: /GOOGLE_APPLICATION_KEY/g,
              replacement: '<%= config.google.applicationKey %>'
            }
          ]
        }
      }
    },

    uglify: {
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
      dist: {
        src: [ 'app/templates/*.html' ],
        dest: 'tmp/templates.js'
      }
    },

    clean: {
      'dist' : {
        src: [ 'dist' ]
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
          'assets/css/app.css'
        ],
        dest: 'dist/assets/css/app.css',
        options: {
          separator: '\n'
        }
      },
      app: {
        src: ['tmp/app/*.js'],
        dest: 'tmp/app.js'
      },
      dist: {
        src: [
          'libs/jquery/dist/jquery.min.js',
          'libs/lodash/lodash.min.js',
          'libs/angular/angular.min.js','' +
          'libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'libs/parse/parse.min.js',
          'tmp/parse-angular.min.js',
          'libs/bootstrap/dist/js/bootstrap.min.js',
          'libs/moment/min/moment-with-locales.min.js',
          'tmp/app.js',
          'tmp/templates.js' ],
        dest: 'dist/assets/js/app.js'
      }
    },

    jshint: {
      all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ]
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 4040
        }
      }
    },

    watch: {
      dev: {
        files: [ 'config.json', 'Gruntfile.js', 'app/*.js', '*.html' ],
        tasks: [ 'jshint', 'uglify:parse-angular', 'string-replace:dist', 'html2js:dist', 'concat:css', 'concat:app', 'concat:dist', 'copy:dist', 'clean:temp' ],
        options: {
          atBegin: true
        }
      },
      min: {
        files: [ 'config.json', 'Gruntfile.js', 'app/*.js', '*.html' ],
        tasks: [ 'jshint', 'uglify:parse-angular', 'string-replace:dist', 'html2js:dist', 'concat:css', 'concat:app', 'uglify:dist', 'concat:dist', 'copy:dist', 'clean:temp' ],
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
    'bower',
    'connect:server',
    'watch:dev' ]);
  // Run the dev server with minified own JavaScript
  grunt.registerTask('minified', [
    'bower',
    'connect:server',
    'watch:min' ]);
  // Build the distribution
  grunt.registerTask('package', [
    //'bower', // We're not running bower at the moment as we patched the parse-angular library
    'jshint',
    'clean:dist',
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
    'package',
    'aws_s3' ]);
};