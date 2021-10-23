const express = require('express');
const router = express.Router();
const admin = require('../controllers/account/adminController');
const project = require('../controllers/project/projectController');
const adminValidator = require('../validators/adminValidators');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require("path");


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/temp/'))
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype)
        var ext = file.mimetype.split('/')[1];
        var type = file.mimetype.split('/')[0];
        var d = new Date();
        var uniqueFilename = d.getTime();
        cb(null, uniqueFilename + "." + ext);
    }
});
var uploader = multer({ storage: storage }).single('resource');


router.post('/login', adminValidator.login, admin.login);
router.get('/logout', auth, admin.logout);
router.post('/forgotPassword', adminValidator.forgotPassword, admin.forgotPassword);
router.post('/resetPassword', adminValidator.resetPassword, admin.resetPassword);

router.post('/getRoles', auth, admin.getRoles);
router.post('/addRole', auth, adminValidator.addRole, admin.addRole);
router.delete('/deleteRole',adminValidator.deleteRole, auth, admin.deleteRole);
router.get('/editRole', auth,adminValidator.editRole, admin.editRole);
router.get('/roles', auth, admin.roles);
router.post('/updateRole', auth, adminValidator.updateRole, admin.updateRole);

router.post('/admins', auth, admin.admins);
router.get('/editAdmin', auth,adminValidator.editAdmin, admin.editAdmin);
router.post('/createAdmin', auth, adminValidator.createAdmin, admin.createAdmin);
router.post('/updateAdmin', auth, adminValidator.updateAdmin, admin.updateAdmin);
router.delete('/deleteAdmin', auth,adminValidator.deleteAdmin, admin.deleteAdmin);


router.post('/getProjects', auth, project.getProjects);
router.get('/editProject', auth,adminValidator.editProject, project.editProject);
router.post('/addProject', uploader,  project.addProject);
router.post('/updateProject', auth, adminValidator.updateProject, project.updateProject);
router.delete('/deleteProject', auth,adminValidator.deleteProject, project.deleteProject);


module.exports = router;