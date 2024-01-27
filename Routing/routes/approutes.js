const express = require('express');
const appController = require('../controller/appcontroller');

const router = express.Router();

router.get('/', appController.home);
router.get('/login', appController.login);

module.exports = {router};
