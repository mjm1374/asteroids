module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

    // Tasks
    sass: { // Begin Sass Plugin
      dist: {
        options: {
          sourceMap : true
        },
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['**/*.scss'],
          dest: 'css',
          ext: '.css'
      }]
      }
    },
    postcss: { // Begin Post CSS Plugin
      options: {
        map: true,
        processors: [
      require('autoprefixer')({
            browsers: ['last 2 versions']
          })
    ]
      },
      dist: {
        src: 'css/styles.css'
      }
    },
    cssmin: { // Begin CSS Minify Plugin
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
    }]
      }
    },
    uglify: { // Begin JS Uglify Plugin - this order is necessary for uglify to work with bootstrap
      build: {
        src: ['javascript/*.js'],
        dest: 'js/script.min.js'
      }
      //,
      //vendor:{
      //  src: [ 'javascript/bootstrap/util.js', 'javascript/bootstrap/alert.js', 'javascript/bootstrap/button.js', 'javascript/bootstrap/carousel.js', 'javascript/bootstrap/collapse.js', 'javascript/bootstrap/dropdown.js', 'javascript/bootstrap/modal.js', 'javascript/bootstrap/scrollspy.js', 'javascript/bootstrap/tab.js', 'javascript/bootstrap/tooltip.js', 'javascript/bootstrap/popover.js'],
      //  dest: 'js/vendor.js'
      //
      //}
    },
    watch: { // Compile everything into one task with Watch Plugin
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'postcss', 'cssmin']
      },
      js: {
        files: '**/*.js',
        tasks: ['uglify']
      }
    }
	});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', [
    'watch',
    'browserify',
    'uglify'
  ]);

};
