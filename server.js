var express = require('express'),
    app = express(),
    middleware = require('./middleware')

app.get('/ping', middleware.ping)

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), function() {
  console.log('Application listening on port', app.get('port'))
})
