const express = require('express');

const ModuleController = require('./controllers/ModuleController');
const DetailController = require('./controllers/DetailController');
const SessionController = require('./controllers/SessionController.js');

const routes = express.Router();

// Mobile Login - Inicia conexion necesita el Id del nodemcu + nombre dado  
routes.post('/sessions', SessionController.create);

// Mobile Logon - Actualiza el nombre ingresado para el modulo, retorna el modulo para procesarlo en el front
routes.put('/modules', ModuleController.update);
// Inicializa la conexion server + nodemcu
routes.get('/modules', ModuleController.index);


// Retorna todos los detalles
routes.get('/details', DetailController.index);
// Crea un nuevo detalle
routes.post('/details',DetailController.create);

module.exports = routes;