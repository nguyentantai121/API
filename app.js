var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require("./model/categori");
require("./model/sinhvienmd");
//asm
require("./model/Asm/categoriModel");
require("./model/Asm/detailsModel");
require("./model/Asm/orderModel");
require("./model/Asm/paymentModel");
require("./model/Asm/userModel");
require("./model/Asm/productsModel");
require("./model/Asm/reviewModel");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sinhvienRouter = require('./routes/sinhvien');
var categori = require('./routes/categori');
var sinhvienmd = require('./routes/sinhvienmd');
var asm = require('./routes/Asm/asm')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to database
// mongoose.connect('mongodb://127.0.0.1:27017/MOB402_t')
mongoose.connect('mongodb+srv://taint:C9TkgLJX7DktTviE@api.ix1ss83.mongodb.net/API')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sinhvien',sinhvienRouter);
app.use('/category',categori);
app.use('/sinhvienmd',sinhvienmd);
app.use('/asm',asm)

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

module.exports = app;
