const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const url = "mongodb://localhost/db_pedidosapp"

var obj;
fs.readFile('base.json', 'utf8', function (err, data) {
  if (err) throw err
  obj = JSON.parse(data);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    var dbo = db.db('db_pedidosapp')
    dbo.collection('servicos').insertMany(obj, function(err, res) {
      if (err) throw err
      console.log(`${res.insertedCount} registros foram inseridos com sucesso`)
      db.close()
    })
  })
})
