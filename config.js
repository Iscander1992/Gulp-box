module.exports = {

    build: {

        dev: {
            css: 'build/dev/css/',
            html: 'build/dev/',
            js: 'build/dev/js/',
            img: 'build/dev/img/',
            sptite: 'build/dev/img/sprite.png',
            copy: {
                'bower_components/normalize-scss/_normalize.scss' : 'src/scss/vendor',
                'bower_components/jquery/dist/jquery.js' : 'build/dev/js',

                'src/fonts/*' : 'build/dev/fonts'
            },

            localserver: {
                server: {
                    baseDir: "./build/dev"
                },
                host: 'localhost',
                port: 3000,
                logPrefix: "Frontend_Devil"
            }
        },

        prod: {
            css: 'build/prod/css/',
            joinCSS: 'build/dev/css/*.css',
            joinJs: 'build/dev/js/app.js',
            html: 'build/prod/',
            js: 'build/prod/js/',
            img: 'build/prod/img/',
            copy: {
                'bower_components/jquery/dist/jquery.min.js' : 'build/prod/js',
                'src/fonts/*' : 'build/dev/fonts'
            }
        }
    },

    src: {
        style: 'src/scss/build.scss',
        html: 'src/*.html',
        js: 'src/js/*.js',
        img: 'src/img/**/*.+(jpg|jpeg|gif|png|svg|ico)',
        sprite: 'src/icons/*.*',
        iconStyles: 'src/scss/base/'
    },

    watch: {
        style: 'src/scss/**/**/*.scss',
        html: 'src/**/**/**/*.html',
        js: 'src/js/*.js'
    }
};