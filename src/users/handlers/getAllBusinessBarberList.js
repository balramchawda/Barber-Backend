import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

/** 
Api to Business barber
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        const userType = _.get(payload, 'userType', "");
        if (userType == "individual" || userType == "Individual") {
            const userData = await Users.find({
                userType: "business"
            }, {
                _id: 1,
                name: 1,
                aboutBusiness: 1
            })
            if (userData.length > 0) {
                var newData = {
                    _id: "0",
                    name: "None of associate with anyone",
                    aboutBusiness: ''
                }
                Array.prototype.insert = function(index, item) {
                    this.splice(index, 0, item);
                };
                // var nietos = [];
                // var obj = {};
                // obj["0"] = userData._id;
                // obj["None of associate with anyone"] = userData.value;
                // userData.push(obj);
                userData.insert(0, newData);
                // userData.forEach(function(item){item.index = "Yes";});

                // const newArr1 = userData.map(v => ({...v, index:"Yes"}))
                // userData.forEach(v => {v.index = "Yes";});
                // for(var i=0;i<userData.length;i++){
                //     console.log('enter');
                //         userData[i].index="Yes"
                // }
                return reply({
                    status: true,
                    message: "Get all business barbers.",
                    data: userData
                })
            } else {
                return reply({
                    status: false,
                    message: "No data found.",
                    data: []
                })
            }
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/admin/getAllBusinessBarbers',
    config: {
        tags: ['api', 'users'],
        description: 'Get all business barbers.',
        notes: ['On success'],
        validate: {
            payload: {
                userType: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}