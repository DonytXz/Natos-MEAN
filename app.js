require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || process.env.URLDB || 'mongodb+srv://cbarbosa:mongo@clustermsrb-2d6nn.mongodb.net/Natos';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Base de datos conectada');
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});

//Aqui ponemos los require para nuestros Schemas
require('./models/users');
require('./models/empleados');
require('./models/clientes');
require('./models/proveedores');
require('./models/tarimas');
require('./models/articulos');
require('./models/solicitudes_compras');
require('./models/solicitudes_ventas');
require('./models/carritos');

//declaración de rutas
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const empleadoRouter = require ('./routes/empleado');
const proveedorRouter = require ('./routes/proveedor');
const clienteRouter = require ('./routes/cliente');
const tarimaRouter = require ('./routes/tarima');
const articuloRouter = require ('./routes/articulo');
const solicitud_compraRouter = require('./routes/solicitud_compra');
const solicitud_ventaRouter = require('./routes/solicitud_venta');
const carritoRouter = require ('./routes/carrito');

var app = express();

// CORS with dynamic origin reflection to support credentials safely
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If specific origins are defined in CORS_ORIGIN, check them
    if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
      const allowed = process.env.CORS_ORIGIN.split(',').map(o => o.trim().toLowerCase());
      if (allowed.includes(origin.toLowerCase()) || allowed.includes('*')) {
        return callback(null, origin);
      }
    }

    // Default: reflect the requesting origin so credentials work without wildcard conflicts
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Origin', 'Accept', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Preflight handler
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Natos-MEAN API',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

//declarando como usaremos las rutas
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/empleado', empleadoRouter);
app.use('/proveedor', proveedorRouter);
app.use('/cliente', clienteRouter);
app.use('/tarima', tarimaRouter);
app.use('/articulo', articuloRouter);
app.use('/solicitud_compra', solicitud_compraRouter);
app.use('/solicitud_venta', solicitud_ventaRouter);
app.use('/carrito', carritoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    status: status
  });
});

// Standalone execution support
if (require.main === module) {
  const PORT = process.env.PORT || 4200;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
