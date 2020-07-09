const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);

describe('Genre.js', () => {
    describe('/genre', () => {
        it('get genre results are correct', () => {
            chai.request('http://192.168.43.67:3001')
                .get('/genre')
                .end((err, res) => {
                    chai.assert.equal(res.status, 200);
                    chai.assert.typeOf(res.body.data, 'array');
                })
        })
    })
})
