const dataModels = require('../models/data')
const helper = require('../helpers')
const client = require('../config/redis')

module.exports = {
    getBooks: async function(request, response){
       try {
            let search_query = request.query.search || "all"
            const sort = request.query.sort || " "
            const asc = request.query.asc || "true"
            let limit = request.query.limit || "2"
            let requestPage = parseInt(request.query.requestPage) ||"1"
            const key = search_query+sort+asc+limit+requestPage

           //query where
           let query = 'WHERE books.id_author = author.id AND books.id_genre = genre.id';
           if(search_query != "all"){
             query += " AND books.title LIKE '%"+search_query+"%'";
           }

            //choose order methode
            let order = "ASC"
            if(asc == 'false'){
                order = "DESC" 
            }

           //sort with genre or author or created
           if(sort == 'genre'){
             query += " ORDER BY id_genre "+order;
           }else if(sort == 'author'){
             query += " ORDER BY id_author "+order;
           }else if(sort == 'created_at'){
             query += " ORDER BY created_at "+order;
           }else{
            query += " ORDER BY RAND() ";
          }
        
            let amountTable = 'books '
            if(search_query != "all"){
                amountTable += " WHERE books.title LIKE '%"+search_query+"%'";
            }
            const data = await dataModels.getDataAmount(amountTable)
            const pageAmount = Math.ceil(parseInt(data.amount)/parseInt(limit))
            let nextPage = requestPage + 1
            let prevPage = requestPage - 1

            if(pageAmount <= requestPage){
                requestPage = pageAmount
                nextPage = pageAmount
                prevPage = pageAmount - 1
            }

            if(requestPage == "1"){
                 prevPage = requestPage,
                 nextPage = 2
            }

            const select = 'books.*,genre.name as genre_name, author.name as author_name';
    
            // prepare limit
            const offset = (parseInt(requestPage) - 1) * parseInt(limit)
            query += " LIMIT "+limit+" OFFSET "+offset

            const pagination = {
                dataAmount : data.amount,
                pageAmount : pageAmount,
                limit : parseInt(limit),
                currentPage : requestPage,
                nextPage : nextPage,
                prevPage : prevPage
            }

            const resultJ = await dataModels.getAllDataJoin('books,author,genre',query,select)
            const valRedis = {
                resultJ,
                pagination
            }

            const newQuery = (key).replace(" ","");
            client.setex(`books:${newQuery}`, 3600, JSON.stringify(valRedis, null, 0), function(err,reply){
                if(err) throw err  
                console.log(reply)
            });
            return helper.response(response, 200, resultJ,pagination)


       } catch (error) {
           console.log(error)
           return helper.response(response, 500, error)
       }
    },
    getMyBooks: async function(request, response){
        try {
             let search_query = request.query.search || "all"
             const sort = request.query.sort || " "
             const asc = request.query.asc || "true"
             let limit = request.query.limit || "2"
             let requestPage = parseInt(request.query.requestPage) || "1"
             const key = search_query+sort+asc+limit+requestPage
 
            //query where
            let query = 'WHERE books.id_author = author.id AND books.id_genre = genre.id AND books.id = my_books.id_book AND users.id = my_books.id_user AND my_books.id_user = '+request.user.id;
            if(search_query != "all"){
              query += " AND books.title LIKE '%"+search_query+"%'";
            }
 
             //choose order methode
             let order = "ASC"
             if(asc == 'false'){
                 order = "DESC" 
             }
 
            //sort with genre or author or created
            if(sort == 'genre'){
              query += " ORDER BY id_genre "+order;
            }else if(sort == 'author'){
              query += " ORDER BY id_author "+order;
            }else{
              query += " ORDER BY created_at "+order;
            }
         
             let amountTable = 'books ,my_books, users'
             if(search_query != "all"){
                 amountTable += " WHERE books.title LIKE '%"+search_query+"%' AND ";
             }else{
                amountTable += " WHERE "
             }
             amountTable += ' books.id = my_books.id_book AND users.id = my_books.id_user AND my_books.id_user = '+request.user.id;
             const data = await dataModels.getDataAmount(amountTable)
             const pageAmount = Math.ceil(parseInt(data.amount)/parseInt(limit))
             let nextPage = requestPage + 1
             let prevPage = requestPage - 1
 
             if(pageAmount <= requestPage && pageAmount >= parseInt(limit)){
                 requestPage = pageAmount
                 nextPage = pageAmount
                 prevPage = pageAmount - 1
             }
 
             if(requestPage == "1"){
                  prevPage = requestPage,
                  nextPage = 2
             }
 
             const select = 'books.title,books.image,books.id,books.id_author,books.id_genre,books.status,books.description,genre.name as genre_name, author.name as author_name,my_books.created_at,my_books.updated_at,my_books.id as id_myBook';
     
             // prepare limit
             const offset = (parseInt(requestPage) - 1) * parseInt(limit)
             query += " LIMIT "+limit+" OFFSET "+ offset
 
             const pagination = {
                 dataAmount : data.amount,
                 pageAmount : pageAmount,
                 limit : parseInt(limit),
                 currentPage : requestPage,
                 nextPage : nextPage,
                 prevPage : prevPage
             }
             console.log(query)
             const resultJ = await dataModels.getAllDataJoin('books,author,genre,users,my_books',query,select)
             const valRedis = {
                 resultJ,
                 pagination
             }
 
             const newQuery = (key).replace(" ","");
             client.setex(`mybooks:${newQuery}`, 3600, JSON.stringify(valRedis, null, 0), function(err,reply){
                 if(err) throw err  
                 console.log(reply)
             });
             return helper.response(response, 200, resultJ,pagination)
 
 
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
    getHistory: async function(request, response){
        try {
             let requestPage = parseInt(request.query.requestPage) || "1"
             let limit = request.query.limit || "2"
             const offset = (parseInt(requestPage) - 1) * parseInt(limit)
             const query = "WHERE history.id_book = books.id AND history.id_user = users.id ORDER BY created_at DESC LIMIT "+limit+" OFFSET "+ offset
             const result = await dataModels.getAllDataJoin('history,books,users',query," history.*, books.title, users.name")
             const pagination = {
                 nextPage : parseInt(requestPage) + 1
             }
             return helper.response(response, 200, result, pagination)
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
    getBookById: async function(request, response){
        try {
             const id = request.params.id
             const query = 'WHERE books.id_author = author.id AND books.id_genre = genre.id AND books.id = '+id;
             const select = 'books.*,genre.name as genre_name, author.name as author_name';
             const result = await dataModels.getAllDataJoin('books,author,genre',query,select)
             const newResult = result[0]

             return helper.response(response, 200, newResult)
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    postBook: async function(request, response){
        try {
            request.body.status = 1
             const setData = {
                 image : request.file.filename,
                 ...request.body
             }
             
             const result = await dataModels.postData('books',setData)
             return helper.response(response, 200, result)
             
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
     putBook: async function(request, response){
        try {
            const id = request.params.id
            const books = await dataModels.getDataByIdCustom('image','books', ' id = '+id)

            if(typeof books == 'undefined' || books.length == 0) throw new Error('invalid books id...')
            
            if(request.file != undefined){
                 setData = {
                    image : request.file.filename,
                    ...request.body
                }

                helper.deleteFile(books) 

            }else{

                 setData = request.body

            }
            const result = await dataModels.putData('books',setData,id)
            return helper.response(response, 200, result)

        } catch (error) {
            if(request.file != undefined) helper.deleteFile([{image : request.file.filename}])
            return helper.response(response, 500, error)
        }
     },
     transactionBook: async function(request, response){
         try {
            const id = request.params.id
            const setData = {
                status : request.body.status
            }

            const data = {
                id_user : request.user.id,
                id_book : id,
            }
            const historyData = {
                id_user : request.user.id,
                id_book : id,
                status : request.body.status
            }

            if(request.body.status==0){
                await dataModels.postData('my_books', data)
            }else{
                await dataModels.deleteDataCustom('my_books', 'id_book = '+id)
            }
            const rs = await dataModels.postData('history', historyData)
            const result = await dataModels.putData('books',setData,id)
            return helper.response(response, 200, {...result,id_history:rs.id})

         } catch (error) {
             console.log(error)
         }
     },
     checkBook: 
     async function(request, response){
        try {
            const id_user = request.user.id
            const id_book = request.params.id

            const result = await dataModels.getDataByIdCustom('id','my_books',` id_book = ${id_book} AND id_user = ${id_user}`)
            if(result.length != 0) 
             {
                return helper.response(response, 200, {message:true})
             }

           return helper.response(response, 200,{message:false})

        } catch (error) {
            
        }
    },
     deleteBook: async function(request, response){
        try {
             const id = request.params.id
             const books = await dataModels.getDataByIdCustom('image','books', 'id = '+id)
             const result = await dataModels.deleteData('books',id)
             await dataModels.deleteDataCustom('history','id_book = '+id)
             helper.deleteFile(books) 
             return helper.response(response, 200, result)
             
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
     deleteHistory: async function(request, response){
        try {
             const id = request.params.id
             const result = await dataModels.deleteData('history',id)
             return helper.response(response, 200, result)
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     }
}