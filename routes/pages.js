const express = require('express');
const mysql = require('mysql');

const router = express.Router()


const pool = mysql.createPool({
    connectionLimit: 10000,
    host: "localhost",
    user: "root",
    password: "Ramo0404",
    database: "TO_DO"
})


router.get('/', function (req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected is ID' + connection.threadId);

        connection.query("SELECT * FROM task ", (error, rows) => {
            connection.release();
            if (!error) {
                res.render('home', { rows });
            }
            else {
                console.log(error);
            }
        })
    })
})




router.post('/', (req, res)=>{
    pool.getConnection((err, connection) => {
        if (err) throw err;
        let searchTerm = req.body.search;
        connection.query("SELECT * FROM task WHERE title LIKE ?",["%" + searchTerm + "%"], (error, rows, result) => {
            
            if (rows.length === 0) {
                res.render('home', { error: "no such data"});

            }
            else if (!error) {
                res.render('home', { rows});

            } else {
                console.log(error);
            }
        })
    })
})




router.get('/addnote', function (req, res) {
    res.render('addnote')
})



router.post('/note/save', function (req, res) {
    const noteData = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        if (noteData.note === '' || noteData.title === '') {
            res.render('addnote', {
                errorMessage: "title and note cannot be empty"
            })
        }
        else {
            connection.query("INSERT INTO task SET note=?, title=?, createdAt=?, updatedAt=?", [noteData.note, noteData.title, new Date(), new Date()], (error, results, fields) => {
                if (error) throw error;
                // res.redirect('/addnote')
                res.render('addnote', {
                    alert: "note added"
                })
            })
        }
    })

})



router.get('/editnote/:id', function (req, res) {
    const noteData = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT * FROM task WHERE id=?", [req.params.id], (error, rows) => {
            connection.release()
            if (!error){
                res.render('editnote', { rows})
            }else{
                console.log(error);
            }
        })

    })

});



router.post('/editnote/:id', (req, res)=>{
    const noteData = req.body;

    pool.getConnection((error, connection)=>{
        if (error) throw error;
        
        let sql = "UPDATE task SET note=?, title=?,  updatedAt=? WHERE id=?";
        // let values = [ noteData.note, noteData.title, new Date(), req.params.id];
        connection.query(sql, [ noteData.note, noteData.title, new Date(), req.params.id],(err, rows)=>{
            connection.release();
            if (!err) {   
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    connection.query("SELECT * FROM task WHERE id=?", [req.params.id], (error, rows) => {
                        connection.release()
                        if (!error){
                            res.render('editnote', { rows, alert: "note updated"})
                        }else{
                            console.log(error);
                        }
                    })
            
                })
            }
            else{
                console.log(err);
            }
        })
    })
});





router.get('/:id', function (req, res) {
    const noteData = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("DELETE FROM task WHERE id=?", [req.params.id], (error, rows) => {
            connection.release()
            if (!error){
                res.redirect('/')
            }else{
                console.log(error);
            }
        })

    })

});


module.exports = router;