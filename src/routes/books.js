const express = require('express')
const Route = express.Router()
const upload = require('../helpers/upload')
const redis = require('../helpers/redis')
const middlewareAuth = require('../middleware/auth')
const middlewareAdmin = require('../middleware/admin')
const middlewareMember = require('../middleware/member')
const bookController = require('../controllers/books')

Route
    .get('/',redis, bookController.getBooks) 
    .get('/mybooks',middlewareAuth,middlewareMember,redis, bookController.getMyBooks) 
    .get('/history',middlewareAuth,middlewareMember, bookController.getHistory) 
    .get('/check/:id',middlewareAuth, bookController.checkBook) 
    .get('/:id', bookController.getBookById)
    .post('/',middlewareAuth,middlewareAdmin, upload , bookController.postBook)
    .put('/:id',middlewareAuth,middlewareAdmin, upload, bookController.putBook)
    .put('/transaction/:id',middlewareAuth,middlewareMember, bookController.transactionBook)
    .delete('/:id',middlewareAuth,middlewareAdmin, bookController.deleteBook) 
    .delete('/history/:id',middlewareAuth,middlewareMember, bookController.deleteHistory) 

module.exports = Route