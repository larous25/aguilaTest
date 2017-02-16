
require('mocha');

const chai    = require('chai');
const expect  = chai.expect;
const Request = require('./index');

chai.use(require('chai-http'));

const url    = 'http://prueba.miaguila.com:3044/v1/miaguila';
const req    = chai.request(url);
const apikey = 'F13O13BOGKL8REGMPR6A';

// rotas
let alliances = '/alliances';
let users     = '/users';
let countries = '/countries';

/*
  pruebas a la api que se me asigno  
*/
describe('test api', () => {
  it('get all alliances with code country co' , done => {
    req
    .get(alliances)
    .set('apikey', apikey)
    .query({
      'codeCountry': 'CO'
    })
    .end((err, res) => { 
      if(err){ done(err); }
      let body = res.body;
      expect(body).to.be.a('object');
      expect(body).to.have.property('result')
      .to.be.a('array');
      done();
    });
  });

  it('should not exists any alliance of ru' , done => {
    req
    .get(alliances)
    .set('apikey', apikey)
    .query({
      'codeCountry': 'RU'
    })
    .end((err, res) => { 
      if(err){ done(err); }
      let body = res.body;
      expect(body).to.be.a('object');
      expect(body).to.have.property('result')
      .to.be.a('array')
      .to.be.lengthOf(0);

      done();
    });
  });

  // al parecer no se pueden hacer busquedas a un subdocumento
  // de la colecion
  it('get all alliances with nit 12345' , done => {
    req
    .get(alliances)
    .set('apikey', apikey)
    .query({
      'legal.nit' : '12345'
    })
    .end((err, res) => { 
      if(err){ done(err); }
      let body = res.body;

      expect(body).to.be.a('object');
      expect(body).to.have.property('result')
      .to.be.a('array')
      .to.be.lengthOf(1);
      done();
    });
  });

  it('GET paices' , done => {
    req
    .get(countries)
    .set('apikey', apikey)
    .end((err, res) => { 
      if(err){ done(err); }
      let body = res.body;
      expect(body).to.be.a('object');
      expect(body).to.have.property('result');
      done();
    });
  });

  it('GET users' , done => {
    req
    .get(users)
    .set('apikey', apikey)
    .end((err, res) => { 
      if(err){ done(err); }
      let body = res.body;
      expect(body).to.be.a('object');
      expect(body).to.have.property('result').to.be.a('array');    
      done();
    });
  });
});


/*
  pruebas a la clase hecha por mi, ose mia, creada de mi mismo
  de yo solito 
*/
describe('test class request', () => {
    it('get all alliances with code country co' , done => {
    req
    .get(alliances)
    .set('apikey', apikey)
    .query({
      'codeCountry': 'CO'
    })
    .then( res => { 
      let apiData = res.body;

      let r = new Request({
        path: alliances,
        query: {
          'codeCountry':'CO'
        }
      });

      return r
      .call()
      .then((res) => {
        let body = res.body;
     
        expect(body).to.have.property('pagination');
        expect(body).to.have.property('result')
        .to.be.a('array')
        .to.be.a.lengthOf(apiData.result.length);
        done();
      });
    })
    .catch(err => {
      done(err);
    });
  });
});

