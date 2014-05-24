require.config({
    baseUrl:'js',

    paths:{
        jquery: 'vendor/jquery/dist/jquery',
        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        react: 'vendor/react/react-with-addons',
        reactbackbone: 'vendor/react.backbone/react.backbone'
    },
});

require(['init'], function(Init){
    Init();
});