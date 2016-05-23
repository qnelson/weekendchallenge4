var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/notes';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM notes', function (err, result) {
      if (err) {
            console.log(err);
        }
      done();

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var note = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO notes (note_title, note_text)' +
                  'VALUES ($1, $2)',
                [note.title, note.todo],
                 function (err, result) {
                   done();

                   if (err) {
                     console.log(err);
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(201);
                 });
               });
          });

          router.delete('/:id', function(req, res) {
              pg.connect(connectionString, function(err, client, done) {
                      if (err) {
                          res.sendStatus(500);
                      }
                      client.query('DELETE from notes ' + 'WHERE id = $1', [req.params.id],
                          function(err, result) {
                              done();
                              if (err) {
                                  console.log(err);
                                  res.sendStatus(500);
                                  return;
                              }
                              res.sendStatus(201);
                          });
              });
          });

        router.put('/:id', function(req, res) {
              pg.connect(connectionString, function(err, client, done) {
                      if (err) {
                          res.sendStatus(500);
                      }
                      client.query('UPDATE notes ' + 'SET note_status = true ' +
                      'WHERE id = $1',[req.body.id],
                          function(err, result) {
                              done();
                              if (err) {
                                console.log(err);
                                  res.sendStatus(500);
                                  return;
                              }
                              res.sendStatus(201);
                          });
              });
          });


module.exports = router;
