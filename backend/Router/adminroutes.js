const express = require('express');
const srouter = express.Router();
const { registerAdmin, loginAdmin } = require('../controller/adminController');

srouter.post('/register',registerAdmin);
srouter.post('/login', loginAdmin);

module.exports = srouter;
