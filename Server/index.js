let express = require("express");
let fs = require("fs");
let path = require("path");
let bodyParser = require("body-parser")
let app = express();
let clientPath = path.join(__dirname, '../client');
let mySQL = require("mysql");
let pool = mySQL.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirpsUser',
    password: 'projectChirps',
    database: 'chirps'
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function getChirps() {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {reject(err);}
            else {
                connection.query("CALL getChirps();", (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else {fulfill(resultsets);};
                }) 
            }
        });
    });
};

function insertChirps(userText, messageText) {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) =>{
            if (err) {reject(err);} else {
                connection.query("CALL insertChirps(?,?);", [userText, messageText], (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else {fulfill(resultsets);}
                })
            }
        })
    })
};

function deleteChirps(id) {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) => {
            if (err){reject(err);} 
            else {
                connection.query("CALL deleteChirps(?)", [id], (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else {fulfill(resultsets);};
                });
            };
        });
    });
};

// function updateChirps(id, message) {
//     return new Promise ((fulfill, reject) => {
//         pool.getConnection((err, connection) => {
//             if (err){reject(err);}
//             else {
//                 connection.query("CALL updateChirps(?,?);", [id, message], (err, resultsets) => {
//                     connection.release();
//                     if (err){reject(err);}
//                     else {fulfill(resultsets);};
//                 });
//             };
//         });
//     });
// };



app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

app.route('/api/chirps')
    .get((req, res) => {
        getChirps().then(function(chirps){
            res.send(chirps);
        }, function(err) {
            res.status(500).send(err);
        })
    })
    .post((req, res) => {
        let user = req.body.user;
        let message = req.body.message;
        insertChirps(user, message).then(function(id) {
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    });


app.route('/api/chirps/:id')
    .post((req, res) => {
        let deleteId = req.body.ajaxId;
        deleteChirps(deleteId).then(function(id){
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    });

// app.route('/api/chirps/update')
//     .post((req, res) => {
//         let updateId = req.body.id;
//         console.log(updateId);
//         let message = req.body.message;
//         console.log(message);
//         updateChirps(updateId, message).then(function(id){
//             res.status(201).send(id);
//         }, function(err){
//             res.status(500).send(err);
//         })
//     });

app.use(express.static(clientPath));

app.listen(3000, function(){ 
    console.log('Running...')
});