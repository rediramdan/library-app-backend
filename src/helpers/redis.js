const client = require('../config/redis')
const helper = require('../helpers')


const redis = function async (request, response, next){
    // let search = request.query.search || "all"
    // const sort = request.query.sort || " "
    // const asc = request.query.asc || "true"
    // let limit = request.query.limit || "2"
    // let requestPage = request.query.requestPage ||"1"
    // const key = search+sort+asc+limit+requestPage
    // const newQuery = (key).replace(" ","")

    // client.get(`books:${newQuery}`, async (err, result) => {
    //     if (result) {
    //         const resultJSON = JSON.parse(result);
    //         return helper.response(response, 200, resultJSON.resultJ , resultJSON.pagination)
    //     } else { 
    //         next()
    //     }
    // });
    next()
}

module.exports = redis