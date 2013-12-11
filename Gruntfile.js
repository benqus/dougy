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
          'ext/intro',
          'js/**/*.js',
          'ext/expose.js',
          'ext/outro'
        ],
        "dest": 'dist/dougy.js'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  //grunt.registerTask('concat', ['concat']);
};  