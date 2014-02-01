module.exports = function(grunt) {
'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },


/*
 DartBot v1.1.0
 Copyright (c) 2011, 2013. All rights reserved.
 Website: http://www.dartbot.com/ .
*/


    uglify: {
      options: {
        banner: '/**\n * <%= pkg.name %> v<%= pkg.version %>\n * Date: <%= grunt.template.today("mm/dd/yyyy") %>\n * Website: http://www.dartbot.com\n */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/core/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};