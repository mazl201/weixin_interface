var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * [开启跨域便于接口访问]
 */
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
//供微信 访问 验证
/**
 * [设置验证微信接口配置参数]
 */
const config = {
    token: 'test', //对应测试号接口配置信息里填的token
    appid: 'wx0d824e1ba72c5a7e', //对应测试号信息里的appID
    secret: '008ff7ba221a8723f886a30a482c53fd', //对应测试号信息里的appsecret
    grant_type: 'client_credential' //默认
};


/**
 * [验证微信接口配置信息，]
 */
app.get('/', function(req, res) {

    const token = config.token; //获取配置的token
    const signature = req.query.signature; //获取微信发送请求参数signature
    const nonce = req.query.nonce; //获取微信发送请求参数nonce
    const timestamp = req.query.timestamp; //获取微信发送请求参数timestamp

    const str = [token, timestamp, nonce].sort().join(''); //排序token、timestamp、nonce后转换为组合字符串
    const sha = sha1(str); //加密组合字符串

    //如果加密组合结果等于微信的请求参数signature，验证通过
    if (sha === signature) {
        const echostr = req.query.echostr; //获取微信请求参数echostr
        res.send(echostr + ''); //正常返回请求参数echostr
    } else {
        res.send('验证失败');
    }
});


app.listen("3001", '0.0.0.0', function() {
    console.log(`服务器运行在http://106.12.30.238`);
});

module.exports = app;
