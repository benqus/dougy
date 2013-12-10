module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');
  
  grunt.initConfig({
    "pkg": pkg,
    
    "concat": {
      "options": {
        "banner": "/** Dougy <%= pkg.version %> */\n"
      },
      "dist": {
        "src": [
          'js/**/*.js'
        ],
        "dest": 'dist/dougy.js'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  //grunt.registerTask('concat', ['concat']);
};  