module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
        
    jade: {
      compile: {
        options: {
          pretty:true,
          data: {
            debug: false
          }
        },
        files: [{
                 expand: true, 
                 cwd:'js/marker-client/', 
                 src: ['**/*.jade'], 
                 dest: 'js/marker-client/',
                 ext: '.html'
             }]
      }
    },
    
    
    watch: {
      scripts: {
        files: ['js/marker-client/**/*.jade'],
        tasks: ['jade:compile'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jade:compile']);

};