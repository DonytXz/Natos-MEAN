var express = require('express');
var router = express.Router();

/* GET home page / API status */
router.get('/', function(req, res, next) {
  res.json({
    status: 'online',
    service: 'Natos-MEAN API',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

module.exports = router;
