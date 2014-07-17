module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        uglify: {
            dev :{
                files :{
                    'dist/lib/Application.min.js' : 'app/*.js'
                }
            }
        },

        watch: {
            scripts: {
                files: 'app/*.js',
                tasks: ['default'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            }
        }
    });

    grunt

    grunt.registerTask('default', function() {
        console.log('hello world !');
    });
}