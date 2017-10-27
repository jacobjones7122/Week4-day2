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


function getUsers() {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {reject(err);}
            else {
                connection.query("CALL getUsers();", (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else {fulfill(resultsets);};
                }) 
            }
        });
    });
};

function userInsert(user) {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) =>{
            if (err) {reject(err);} 
            else {
                connection.query("CALL userInsert(?);", [user], (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else ;{fulfill(resultsets);}
                })
            }
        })
    })
};

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
            if (err) {reject(err);} 
            else {
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

function getOneChirp(id) {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {reject(err);}
            else {
                connection.query("CALL selectOneChirps(?)", [id], (err, resultsets) => {
                    connection.release();
                    if (err) {reject(err);} 
                    else {fulfill(resultsets);};
                }) 
            }
        });
    });
};
function updateChirps(id, message) {
    return new Promise ((fulfill, reject) => {
        pool.getConnection((err, connection) => {
            if (err){reject(err);}
            else {
                connection.query("CALL updateChirps(?,?);", [id, message], (err, resultsets) => {
                    connection.release();
                    if (err){reject(err);}
                    else {
                        fulfill(resultsets);
                    };
                });
            };
        });
    });
};


app.route('/')
    .get((req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
    })

app.route('/api/chirps')
    .get((req, res) => {
        getChirps().then(function(chirps){
            res.send(chirps);
        }, function(err) {
            res.status(500).send(err);
        })
    })
    .post((req, res) => {
        let userId = req.body.userId;
        let message = req.body.message;
        insertChirps(userId, message).then(function(id) {
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    });

app.route('/api/chirps/:id')
    .delete((req, res) => {
        let deleteId = req.params.id;
        deleteChirps(deleteId).then(function(id){
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    });

app.route('/api/users/:id')
    .get((req, res) => {
        let userId = req.params.id;
        getOneChirp(userId).then(function(id){
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    })
    .delete((req, res) => {
        let deleteId = req.params.id;
        console.log(deleteId);
        deleteChirps(deleteId).then(function(id){
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        })
    });

app.route('/api/chirps/update')
    .post((req, res) => {
        let updateId = req.body.id;
        let message = req.body.message;
        updateChirps(updateId, message).then(function(id){
            res.status(201).send(id);
        }, function(err){
            res.status(500).send(err);
        })
    });

app.route("/api/users")
    .get((req, res) => {
        getUsers().then(function(users){
            res.send(users);
        }, function(err) {
            res.status(500).send(err);
        })
    })
    .post((req, res) => {
        let user = req.body.userName;
        console.log(user);
        userInsert(user).then(function(id) {
            res.status(201).send(id);
        }, function(err) {
            res.status(500).send(err);
        });
    });

app.use(express.static(clientPath));

app.listen(3000, function(){ 
    console.log('Running...')
});