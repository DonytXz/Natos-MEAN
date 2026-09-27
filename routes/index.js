var express = require('express');
var router = express.Router();

/* GET home page / API status */
router.get('/', function(req, res, next) {
  res.json({
    status: 'online',
    service: 'Natos API',
    endpoints: [
      '/user',
      '/empleado',
      '/proveedor',
      '/cliente',
      '/tarima',
      '/articulo',
      '/solicitud_compra',
      '/solicitud_venta',
      '/carrito',
      '/health'
    ],
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

module.exports = router;
