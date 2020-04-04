const { Router } = require('express');
const login = require('../middlewares/login');

const loginRouter = Router();
loginRouter.post('/', login);

module.exports = loginRouter;