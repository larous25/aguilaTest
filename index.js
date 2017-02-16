const http = require('http');
const qs   = require('querystring');

class Request {
  constructor(options) {
    this.options = Request.createOptions(this.formatUri(options));
  }
  /**
   * create a request 
   * @return {Promise} with data, status and message of request
   */
  call() { 
    return new Promise((resolve, reject) => {
      http.request(this.options, (responseHttp) => {
        responseHttp.setEncoding('utf8');
        this.getData(responseHttp, (data) => {
          resolve(this.setObjectResponse(responseHttp, data));
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .end();
    });
  }

  getData(response, callback) {
    let data = '';
    response.on('data', (res) => {
      data += res;
    });
    response.on('end', (res) => {
      callback(JSON.parse(data));
    });
  }

  formatUri({path, query}) {
    let queryStyring = (!query) ? '':`?${ qs.stringify(query)}`;
    return `/v1/miaguila${path}${queryStyring}`;
  }

  setObjectResponse(res, data) {
    return {
      url    : res.url,
      status : res.statusCode,
      message: res.statusMessage,
      body   : data
    };
  }
  
  /**
   * create a object with options
   * @param  {string} path 
   * @return {Object} options 
   */
  static createOptions(path) {
    return {
      hostname: 'prueba.miaguila.com',
      port: 3044,  // 3043
      path, 
      method: 'GET',
      headers : {
        'apikey'      : 'F13O13BOGKL8REGMPR6A',
        'Content-Type': 'application/json'
      }
    };
  }
}

if(require.main === module){

  let users = '/users';
  let alliances = '/alliances';
  /*
    request to alliances  
  */
  let r = new Request({
    path: alliances,
    query: {
      'codeCountry':'CO'
    }
  });

  r.call().then((res) => {
    let body = res.body;
    
    // show alliances
    console.log('\t\t list of all objects alliances \n');
    body.result.forEach((a, i) => { 
      console.log(`${i+1}) \n ${JSON.stringify(a)} \n`);
    });

    let alliance = body.result.find(a => {
      if(a.hasOwnProperty('legal')) {
        if(a.legal.nit === '12345') return a;
      } 
    });

    // show alliance 12345
    console.log('\t\t alliance 12345 \n');
    console.log(JSON.stringify(alliance));

    let z = new Request({
      path: users,
      query:{ 
        'alliance_id': alliance._id 
      }
    });

    return z.call();
  })
  .then((res) => {
    let body = res.body;

    // show users
    console.log('\t\t users  \n');
    body.result.forEach((u, i) => { 
      console.log(`${i+1}) \n ${JSON.stringify(u)} \n`);
    });
  })
  .catch((e) => {
   console.log(`Error  ${e}`);
  });

}else{
  module.exports = Request;
}