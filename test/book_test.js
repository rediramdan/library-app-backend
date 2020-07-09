const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');

chai.use(chaiHttp);

describe('Book.js', () => {
    describe('/book', () => {
        it('get book results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/book')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                })
        })
        it('get book detail results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/book/31')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                })
        })
    })
})