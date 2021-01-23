import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import BusinessType from '../../models/businessType';
import ServiceCategory from '../../models/serviceCategory';
let defaults = {};
/**
Api to getServiceCategoryList. 
  **/
const handler = async (request, reply) => {
    try {
        const payload = request.payload;
        var perPage = 10;
        var sort = {};
        var search_data = _.get(request, 'payload.text', '');
        if (search_data != "" || search_data != undefined) {
            var searchData = search_data
            var page = payload.page || 1;
            ServiceCategory.find({
                    "serviceCategoryName": {
                        "$regex": search_data,
                        "$options": "i"
                    }
                }).skip((perPage * page) - perPage)
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    ServiceCategory.countDocuments({
                        "serviceCategoryName": {
                            "$regex": search_data,
                            "$options": "i"
                        }
                    }).exec(function(err, count) {
                        if (err) return console.log(err)
                        return reply({
                            data: users,
                            currentPage: page,
                            pageCount: Math.ceil(count / perPage)
                        })
                    })
                })
        } else {
            var page = payload.page || 1;
            ServiceCategory.find({}).skip((perPage * page) - perPage)
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    //users = JSON.parse(JSON.stringify(users))
                    ServiceCategory.countDocuments({}).exec(function(err, count) {
                        if (err) return console.log(err)
                        return reply({
                            // link: req.app.locals.baseAdminURL + "users/list",
                            data: users,
                            currentPage: page,
                            pageCount: Math.ceil(count / perPage)
                        })
                    })
                })
        }
    } catch (error) {
        console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/admin/getAllCategoryAdminList',
    config: {
        tags: ['api', 'users'],
        description: 'Get all service categories list.',
        notes: ['On success'],
        validate: {
            payload: {
                page: Joi.number().optional(),
                text: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}