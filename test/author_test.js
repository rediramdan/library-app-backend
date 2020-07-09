const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);

describe('Author.js', () => {
    describe('/author', () => {
        it('get author results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/author')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                    chai.assert.typeOf(res.body.data, 'array');
                })
        })
    })
})
