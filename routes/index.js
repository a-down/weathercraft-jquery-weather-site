const router = require('express').Router();
require('dotenv').config()
const apiRoutes = require('./api')

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router