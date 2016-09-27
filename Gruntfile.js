/**
 * Created by christhaw on 7/6/16.
 */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        gruntConfig: {
            initConfig: String(),
            readJSON: String(),
            app: 'src/main'
        },
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    cleanBowerDir: false,
                    verbose: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'bower_components/', src: ['artificial-intelligence/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['conversations/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['images/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['objects/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['requirejs/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['scenes/**', '!./bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['text/**', '!.bower.json'], dest: 'src/main/components'},
                    {expand: true, cwd: 'bower_components/', src: ['Squire.js/**', '!.bower.json'], dest: 'src/main/components'}
                ]
            },
            json: {
                files: [
                    {expand: true, cwd: 'src/main/components', src: ['artificial-intelligence/**'], dest: 'dist/components'},
                    {expand: true, cwd: 'src/main/components', src: ['conversations/**'], dest: 'dist/components'},
                    {expand: true, cwd: 'src/main/components', src: ['objects/**'], dest: 'dist/components'},
                    {expand: true, cwd: 'src/main/components', src: ['scenes/**'], dest: 'dist/components'}
                ]
            },
            html: {files: [ {expand: true, cwd: 'src', src: 'index.html', dest: 'dist'} ] },
            css: {files: [ {expand: true, cwd: 'src/main/css/', src: ['defrag.css'], dest: 'dist/css'} ] },
            js: { files: [ {expand: true, cwd: 'src/main/components/requirejs', src: ['require.js'], dest: 'dist/js'} ] }
        },
        compass: {
            main: {
                options: {
                    sassDir: '<%= gruntConfig.app %>/sass',
                    cssDir: '<%= gruntConfig.app %>/css',
                    force: true
                }
            }
        },
        clean: {
            bower: ['bower_components'],
            build: ['src/main/components', 'src/main/css'],
            cache: ['.cache'],
            dist: ['dist', 'dist.zip'],
            reports: ['reports']
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: ['dots', 'coverage', 'progress'],
                coverageReporter: {
                    reporters: [
                        {
                            type: 'lcov',
                            dir: 'reports/karma-coverage/',
                            subdir: '.',
                            file: 'lcov.info'
                        }
                    ]
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src/main/js',
                    mainConfigFile: 'src/main/js/defrag.js',
                    removeCombined: false,
                    inlineText: true,
                    optimize: 'none',
                    out: 'dist/js/defrag.js',
                    name: 'defrag'
                }
            }
        },
        sed: {
            main: {
                path: './dist/index.html',
                pattern: 'main/',
                replacement: '',
                recursive: false
            },
            src: {
                path: './dist/index.html',
                pattern: 'components/requirejs',
                replacement: 'js',
                recursive: false
            }
        },
        zip_directories: {
            dist: {
                files: [{expand: true, src: ['dist'], dest: '.'}]
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-zip-directories');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-sed');

    grunt.registerTask('dist', ['requirejs', 'copy:html', 'copy:css', 'copy:js', 'copy:json']);
    grunt.registerTask('default', ['bower', 'compass', 'copy:main', 'clean:bower']);
    grunt.registerTask('deploy', ['build', 'dist', 'sed', 'zip']);
    grunt.registerTask('cleanBuild', ['clean', 'build']);
    grunt.registerTask('zip', ['zip_directories:dist']);
    grunt.registerTask('build', ['default', 'karma']);
};