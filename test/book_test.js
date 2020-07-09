const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);

describe('Book.js', () => {
    describe('/book', () => {
        it('get book results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/book/')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                    chai.assert.typeOf(res.body.data, 'array');
                })
        })
        it('get book detail results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/book/3')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                })
        })
    })
})
