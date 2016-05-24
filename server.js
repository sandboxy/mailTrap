var express = require('express');
var nodemailer = require('nodemailer');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/prices', function(req, res) {
  var prices = {};
  var promises = [];
  var tickers = [
    'http://finance.google.com/finance/info?client=ig&q=NSE:goog',
    'http://finance.google.com/finance/info?client=ig&q=NSE:aapl'
  ];

  tickers.forEach(function(ticker) {
    var promise = new Promise(function(resolve, reject) {
      request(ticker, function(err, res, body) {
        if (!err && res.statusCode === 200) {
          var ticker = JSON.parse(body.slice(3))[0].t;
          var price = JSON.parse(body.slice(3))[0].l_cur;

          prices[ticker] = price;
          resolve();
        } else {
          console.log('error with request!!!', body);
          reject();
        }
      });
    });

    promises.push(promise);
  });

  var sendMail = function() {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport("SMTP", {
      host: "mailtrap.io",
      port: 2525,
      auth: {
        user: "ce008a47da2fcb",
        pass: "f990d148a38378"
      }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'MailTester 👥 <test@tester.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Stock Prices ✔', // Subject line
      text: 'Here are your stock prices:' + JSON.stringify(prices), // plaintext body
      html: `<b>Here are your stock prices:` + JSON.stringify(prices) + `</b>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.status(404).send('Sorry, there was an error sending the email!')
        return console.log(error);
      }
      res.send(JSON.stringify('Successfully sent out email!'))
      console.log('Message sent: ' + info.response);
    });
  };

  Promise.all(promises)
    .then(function() {
      sendMail();
    });
});

app.listen(3000, function() {
  console.log("Express Started on Port 3000");
});
