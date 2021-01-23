import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/customerUser';
let defaults = {};
/**
Api to GetAllUsers. 
  **/
const handler = async (request, reply) => {
    try {
        const payload = request.payload;
        var perPage = 10;
        var sort = {};

        // console.log(payload);
        var search_data = _.get(request, 'payload.search_data', '');
        // console.log(search_data);
        if (search_data != "" || search_data != undefined) {
            var searchData = search_data
            var page = payload.page || 1;
            // console.log('enter1');
            // User.find(s_data).where(where).sort(sort).skip((perPage * page) - perPage)
            User.find({
                    "name": {
                        "$regex": search_data,
                        "$options": "i"
                    }
                }).skip((perPage * page) - perPage)
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    //users = JSON.parse(JSON.stringify(users))
                    User.countDocuments({
                        "name": {
                            "$regex": search_data,
                            "$options": "i"
                        }
                    }).exec(function(err, count) {
                        if (err) return console.log(err)
                        return reply({
                            // link: req.app.locals.baseAdminURL + "users/list",
                            success: true,
                            message: "Get all customers.",
                            users: users,
                            currentPage: page,
                            pageCount: Math.ceil(count / perPage)
                        })
                    })
                })
        } else {
            var page = payload.page || 1;
            // console.log('enter2')
            // User.find(s_data).where(where).sort(sort).skip((perPage * page) - perPage)
            User.find({}).skip((perPage * page) - perPage)
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    //users = JSON.parse(JSON.stringify(users))
                    User.countDocuments({}).exec(function(err, count) {
                        if (err) return console.log(err)
                        return reply({
                            // link: req.app.locals.baseAdminURL + "users/list",
                            users: users,
                            currentPage: page,
                            pageCount: Math.ceil(count / perPage)
                        })
                    })
                })
        }
    } catch (error) {
        // console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/admin/getAllUsers',
    config: {
        tags: ['api', 'users'],
        description: 'Get all admin data.',
        notes: ['On success'],
        validate: {
            payload: {
                search_data: Joi.string().optional(),
                page: Joi.number().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}