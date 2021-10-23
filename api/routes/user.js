const express = require('express');
const router = express.Router();
const user = require('../controllers/account/userController');
const project = require('../controllers/project/projectController');


router.post('/sawoLogin', user.sawoLogin);


router.post('/login', user.login);

router.get('/projectDetail', project.projectDetail);
router.get('/projectList', project.projectList);
module.exports = router;