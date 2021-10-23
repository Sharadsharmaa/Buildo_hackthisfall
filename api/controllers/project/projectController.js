const httpStatus = require("http-status-codes");
const Project = require('../../models/project');
const global = require('../../resources/lang/en/global');
const responseManagement = require('../../lib/responseManagement');
const helper = require('../../helper/helper');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');


/****** Get Projects ****/
module.exports.getProjects = async (req, res) => {
    try {
        const { start, length, columns, order, search, draw } = req.body;
        const sortColumn = columns[order[0].column].data;
        const sortOrder = order[0].dir;
        const searchValue = search.value;
        var search_query = [];
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].searchable) {
                var key = columns[i]['name'];
                search_query.push({
                    [key]: { '$regex': searchValue, '$options': 'i' }
                });
            }
        }
        var sort_q = {
            [sortColumn]: sortOrder
        }
        var query1;
        if (searchValue) {
            query1 = { $or: search_query };
        } else {
            query1 = {};
        }
        const projects = await Project.find({ $and: [query1] }, {}, { sort: sort_q, skip: start, limit: length });
        const total = await Project.countDocuments({});
        const stotal = await Project.countDocuments({ $and: [query1] });
        res.send({ statusCode: httpStatus.OK, projects: projects, draw: draw, recordsTotal: total, recordsFiltered: stotal });
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Add Project ****/
module.exports.addProject = async (req, res) => {
    try {
        console.log(req.file)
        if (req.file) {
            const fileContent = fs.readFileSync(req.file.path);
            await helper.uploadFile(req.file.filename, fileContent);
            req.body.resourceUrl = config.bucketURL + req.file.filename;
        }
        const project = await Project.create(req.body);
        if (project) {
            responseManagement.sendResponse(res, httpStatus.OK, global.project_add_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};



/****** Delete Project ****/
module.exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.query.id });
        if (project) {
            const result = await Project.deleteOne({ _id: req.query.id });
            responseManagement.sendResponse(res, httpStatus.OK, global.deleted_project_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_project_id)
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};
/****** Edit Project ****/
module.exports.editProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.query.id });
        if (project) {
            responseManagement.sendResponse(res, httpStatus.OK, '', { project });
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_project_id)
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Update Project ****/
module.exports.updateProject = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Project.updateOne({ _id: id }, req.body);
        if (result) {
            responseManagement.sendResponse(res, httpStatus.OK, global.project_update_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};




/****** project list ******/
module.exports.projectList = async (req, res) => {
    try {
        let projects = await Project.find({ status: true });
        responseManagement.sendResponse(res, httpStatus.OK, '', projects);
    } catch (error) {
        console.log(error);
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};

/****** get project detail ******/
module.exports.projectDetail = async (req, res) => {
    try {
        let project = await Project.find({ _id: req.query._id });
        if (project) {
            responseManagement.sendResponse(res, httpStatus.OK, '', project);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error);
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
}
