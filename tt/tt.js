const MongoClient = require('mongodb').MongoClient
const fs = require('fs');
const url = "mongodb://localhost/db_pedidosapp"

var obj = 0;
fs.readFile('tt.json', 'utf8', function (err, data) {

    if (err) throw err;


    var aa = JSON.parse(data);
    aa.map(el => {

        MongoClient.connect(url, function (err_, db) {
            if (err_) throw err_;

            var dbo = db.db(`db_pedidosapp`)

            dbo.collection('servicos').updateOne({ peca: el.peca, descricao: el.descricao },
                { $set: { peca: el.peca, descricao: el.descricao, valor: Number(el.valor), grupo: el.grupo }}, {upsert: true});
        })
        obj++
    })

console.log(obj);
})





