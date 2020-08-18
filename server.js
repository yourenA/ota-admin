/**
 * Created by Administrator on 2017/7/6.
 */
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var logger = require('morgan');
var app = express();
var config=require('./server-config')
if(process.env.NODE_ENV === 'production'){
    console.log('在生产环境')
}
// console.log(config)
app.use(express.static(path.join(__dirname, 'dist')));
// view engine setup for html
app.set('views', path.join(__dirname, 'dist'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// view engine setup for ejs
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.use(logger('dev'));

app.get('/*', function(req, res, next) {
    res.render('index');
});

var server = app.listen(config.port,'0.0.0.0', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(' APP listening at http://%s:%s', host, port);
});
