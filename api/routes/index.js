const express = require('express');
const router = express.Router();
const admin = require('./admin');
const user = require('./user');

router.get('/api/v1/admin', function (req, res, next) {
  res.send('Welcome to buildo Admin Apis');
});
router.get('/api/v1/user', function (req, res, next) {
  res.send('Welcome to buildo User Apis');
});
router.use('/api/v1/admin', admin);
router.use('/api/v1/user', user);


module.exports = router;
