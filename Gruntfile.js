module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.initConfig({

    clean: ["dist/*"],

    typescript: {
      dist: {
          src: ['src/**/*.ts', "!src/**/*.d.ts"],
          dest: 'dist/',
          options: {
              references: ["angular"],
              module: 'system',
              target: 'es5',
              declaration: false,
              emitDecoratorMetadata: true,
              experimentalDecorators: true,
              sourceMap: true,
              noImplicitAny: false,
          }
      },
      specs: {
          src: ['specs/*.ts'],
          dest: 'specs/',
          options: {
              references: ["angular"],
              module: 'system',
              target: 'es5',
              declaration: false,
              emitDecoratorMetadata: true,
              experimentalDecorators: true,
              sourceMap: true,
              noImplicitAny: false,
          }
      }

    },

    copy: {
      sources: {
        cwd: 'src',
        expand: true,
        src: ['**/*.html'],
        dest: 'dist/'
      },
      staticContent: {
        expand: true,
        src: ['LICENSE', 'README.md', 'img/*', 'docs/*'],
        dest: 'dist/'
      },
      plugin: {
        src: [ 'plugin.json', 'README.md' ],
        dest: 'dist/'
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json'],
        tasks: ['default'],
        options: {spawn: false}
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['specs/*.js']
      }
    }
  });

  grunt.registerTask('default', [
      'clean',
      'copy:sources',
      'copy:plugin',
      'copy:staticContent',
      'typescript:dist',
      'typescript:specs',
      'mochaTest']);
};
