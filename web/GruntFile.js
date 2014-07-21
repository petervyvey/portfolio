module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-obfuscator');

    grunt.initConfig({
        obfuscator: {
            files: [
                'public/app/dist/lib/**.js'
            ],
            entry: 'application.js',
            out: 'public/app/dist/lib/application.obfuscated.js',
            strings: false,
            root: __dirname
        },
        uglify: {
            release :{
                options: {
                    banner: '// -------------------------------------------------- \r\n\//\r\n// Generated on <%= grunt.template.today("yyyy-mm-dd") %> \r\n//\r\n// -------------------------------------------------- \r\n\r\n'
                },
                files :{
                    'public/app/dist/lib/application.part.min.js' : 'public/app/part/**/**.js',
                    'public/app/dist/lib/application.core.min.js' : 'public/app/core/**/**.js'
                },
                mangle: true,
                compress: true
            }
        },
        less: {
            branding: {
                options: {
                    cleancss: true
                },
                files: {
                    'public/app/dist/branding/<%= config.branding %>/style/application.min.css': 'public/app/branding/<%= config.branding %>/style/theme.less'
                }
            }
        },
        copy: {
            'branding': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['public/app/branding/<%= config.branding %>/image/*'],
                        dest: 'public/app/dist/branding/<%= config.branding %>/image/'}
                ]
            }
        }
    });

    grunt.registerTask('branding', '', function() {
        var brandings = [];
        grunt.file.recurse('public/app/branding', function callback(abspath, rootdir, subdir, filename) {
            if (filename==='theme.less') {
                var branding = subdir.split('/')[0];
                brandings.push(branding);
            }
        });

        grunt.config('config.brandings', brandings);
        grunt.task.run('branding:theme');
    });

    grunt.registerTask('branding:theme', function(){
        var brandings = grunt.config('config.brandings');
        var branding = grunt.config('config.branding');

        if (brandings.length > 0) {
            var branding = brandings.shift();

            grunt.config('config.brandings', brandings);
            grunt.config('config.branding', branding);

            grunt.task.run('less:branding');
            grunt.task.run('copy:branding');
            grunt.task.run('branding:theme');
        }
    });

    grunt.registerTask('release',[
        'uglify:release',
        'branding'
    ]);
}