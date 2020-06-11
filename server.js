const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());
app.use(express.static('./dist/'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/'});
});

app.listen(process.env.PORT || 8080);
