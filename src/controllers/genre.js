const dataModels = require('../models/data')
const helper = require('../helpers')


module.exports = {
    getGenres: async function(request, response){
       try {
            const result = await dataModels.getAllData('genre')
            return helper.response(response, 200, result)
       } catch (error) {
           return helper.response(response, 500, error)
       }
    },
    getGenreById: async function(request, response){
        try {
             const id = request.params.id
             const result = await dataModels.getDataById('*','genre',id)
             return helper.response(response, 200, result)
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    postGenre: async function(request, response){
        try {
             const setData = request.body
    
             const result = await dataModels.postData('genre',setData)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     putGenre: async function(request, response){
        try {
             const setData = request.body
             const id = request.params.id
             const result = await dataModels.putData('genre',setData,id)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     deleteGenre: async function(request, response){
        try {
             const id = request.params.id
             const books =  await dataModels.getDataByIdCustom('image','books','id_genre = '+id)
             if(books.length != 0) 
             {
                return helper.response(response, 500, {message:"Cannot delete genre"})
             }
             const result = await dataModels.deleteData('genre',id)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     }
}