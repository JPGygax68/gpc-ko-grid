"use strict";

module.exports = function(grunt) {
 
  // configure the tasks
  grunt.initConfig({
 
    copy: {
      build: {
        cwd: 'source',
        src: [ '**', '!**/*.jade', '!**/*.coffee', '!**/*.styl' ],
        dest: 'build',
        expand: true
      }
    },

    bowercopy: {
      options: {
        destPrefix: 'build/'
      },
      all: {
        files: {
          'backgrid.js': 'backgrid/lib/backgrid.js',
          'backgrid.css': 'backgrid/lib/backgrid.css',
          'backbone.js': 'backbone/backbone.js',
          'underscore.js': 'underscore/underscore.js',
          'jquery.js': 'jquery/jquery.js'
        }
      }
    },
    
    jade: {
      compile: {
        options: {
          data: {}
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: [ '**/*.jade' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },
 
    coffee: {
      build: {
        expand: true,
        cwd: 'source',
        src: [ '**/*.coffee' ],
        dest: 'build',
        ext: '.js'
      }
    },
    
    stylus: {
      build: {
        options: {
          linenos: true,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: [ '**/*.styl' ],
          dest: 'build',
          ext: '.css'
        }]
      }
    },
    
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },
    
    cssmin: {
      build: {
        files: {
          'build/application.css': [ 'build/**/*.css' ]
        }
      }
    },

    uglify: {
      release: {
        options: {
          mangle: false
        },
        files: {
          'build/application.js': [ 'build/**/*.js' ]
        }
      }
    },
    
    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css' ], // '!build/application.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js' ],  // '!build/application.js' ]
      },
    },

    watch: {
      stylesheets: {
        files: 'source/**/*.styl',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'source/**/*.coffee',
        tasks: [ 'scripts' ]
      },
      jade: {
        files: 'source/**/*.jade',
        tasks: [ 'jade' ]
      },
      copy: {
        files: [ 'source/**', '!source/**/*.styl', '!source/**/*.coffee', '!source/**/*.jade' ],
        tasks: [ 'copy' ]
      },
      gruntfile: {
        files: [ 'Gruntfile.js', 'bower.json' ],
        tasks: [ 'build' ]
      }
    },

    connect: {
      build: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      },
    }
    
  });
 
  // load the tasks
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
 
  // define the tasks
  grunt.registerTask(
    'scripts', 
    'Compiles the Javascript files.', 
    [ 'coffee' ]
  );
  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'stylus', 'autoprefixer' ]
  );
  grunt.registerTask(
    'optimize',
    'Concatenates or otherwise optimizes Javascript and CSS files',
    [ 'uglify', 'cssmin' ]
  );
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean', 'copy', 'bowercopy', 'jade', 'scripts', 'stylesheets' ]
  );
  grunt.registerTask(
    'release', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'optimize', 'connect', 'watch' ]
  );
  grunt.registerTask(
    'test', 
    'Builds the project without optimizations and runs a server', 
    [ 'build', 'connect', 'watch' ]
  );
  grunt.registerTask(
    'default', 
    'Serves up the source files directly.', 
    [ 'test', 'watch' ]
  );
  
};
