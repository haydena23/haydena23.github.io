const request = require('request');

var client_id = '8d2bba2a92db40bd8b107fbe226957b9';
var client_secret = '53dcaf963d5348798fc5e3fce02117f6';
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};
var token = 'BQBo2XUAwJUMl_RYlBTueIzGuCod5tLOlw8Zi_VGAZQ-lzIcGV2WuhwNu3ZaRIaOmr9CIqO4akskmQiVryg';
request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    token = body.access_token;
  }
  // else{
  //     token='BQDTobEeNbUIAcLaxWCYv-dCxpZYsEzVu4JsYGoncAqHq7uOq4BAWI5NkevK-z76TRV08Fo2kPk5MB77zxE'
  // }
  console.log(token);
});
var getOptions = {
    url: 'https://api.spotify.com/v1/search?q=kygo&type=artist',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    json: true
};
request.get(getOptions, function(error,response,body){
    if(!error && response.statusCode === 200) {
        console.log(body);
    }
    else{
        console.log(response);
    }
});

    
