/**
 * Created by christhaw on 7/6/16.
 */
'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var gruntConfig = {
        app: 'src/main',
        dist: 'target/dist',
        version: grunt.option('release') ? grunt.option('release') : 'release',
        initConfig: 'INITIALIZE_CONFIGURATION'
    };

    grunt.initConfig({
        gruntConfig: gruntConfig,
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
                    {expand: true, cwd: 'bower_components/', src: ['text/**', '!.bower.json'], dest: 'src/main/components'}
                ]
            }
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
            cache: ['.cache']
        }
    });

    grunt.registerTask('default', ['bower', 'compass', 'copy', 'clean:bower']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('cleanBuild', ['clean', 'build']);
};