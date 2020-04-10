var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const { 
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle
} = require('../data/works');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Works' });
});

router.get('/works', async function(req, res, next) {
  try {
    const data = await getArticles();
    res.render('works', { title: "Works", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Issue, check log');
  };
});

module.exports = router;
