const express = require('express');
const router = express.Router();

const Board = require('../models/board');
const Comment = require('../models/comment');

/* GET home page. */
router.get('/', (req, res, next) => {
  Board.find({}, (err, board) => {
      res.render('index', { title: 'Express', board: board });
  });
});

/* Write board page */
router.get('/write', (req, res, next) => {
    res.render('write', { title: '글쓰기' });
});

/* board insert mongo */
router.post('/board/write', (req, res) => {
  const board = new Board();
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = req.body.author;

  board.save(function (err) {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    res.redirect('/');
  });
});

/* board find by id */
router.get('/board/:id', (req, res) => {
    Board.findOne({_id: req.params.id}, (err, board) => {
        res.render('board', { title: 'Board', board: board });
    })
});

/* comment insert mongo*/
router.post('/comment/write', function (req, res){
    var comment = new Comment();
    comment.contents = req.body.contents;
    comment.author = req.body.author;

    Board.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, (err, board) => {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        res.redirect('/board/'+req.body.id);
    });
});

module.exports = router;
