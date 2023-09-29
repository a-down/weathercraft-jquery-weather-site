const express = require('express');
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../", 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, "../", 'client/build/index.html'))
  })
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => console.log(`Now listening on port ${PORT} 🚀 `));