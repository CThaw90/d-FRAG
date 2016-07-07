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
                    copy: true,
                    cleanBowerDir: true,
                    verbose: true,
                    targetDir: '<%= gruntConfig.app %>/components'
                }
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
        }
    });
};