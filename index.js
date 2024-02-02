const { urlencoded } = require('body-parser')
const conn = require('./connection')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.post('/', function (req, res) {

    const name = req.body.name
    const clas = req.body.class
    const number = req.body.number
    const age = req.body.age
    
    conn.connect((err) => {
        if (err) console.log('............23.........' + err)


        var sql = `INSERT INTO students(name,class,number,age) VALUES('` + name + `','` + clas + `','` + number + `','` + age + `')`;
     
        conn.query(sql, (err, result) => {
            if (err) console.log('............27.........' + err)

            // res.send('Student added to the form with roll number' + result.insertId);
            res.redirect('/studentlist')
            
        })

    })
});

app.get('/studentlist', (req, res) => {

    conn.connect((err) => {
        if (err) console.error('.........38.........' + err);

        var sql = 'SELECT * FROM students';

        conn.query(sql, (err, data) => {
            if (err) console.error('.........45.........' + err);
            res.render(__dirname + '/studentlist', { students: data });
            // console.log(data);
        })
    })

});

app.get('/delete-student', (req, res) => {

    const id = req.query.id
    var sql = `DELETE FROM students WHERE ID=${id}`;

    conn.query(sql, (err, data) => {
        if (err) console.error('.........58.........' + err);
        res.redirect('/studentlist')
        // console.log(data);
    })

})

app.get('/upgrate-student', (req, res) => {



    conn.connect((err) => {
        if (err) console.error('.........71.........' + err);

        const id = req.query.id
        var sql = "SELECT * FROM students where id=? ";

        conn.query(sql, [id], (err, data) => {
            if (err) console.error('.........76.........' + err);
            res.render(__dirname + '/upgrate-students', { students: data });
            // console.log(data);
        })
    })

})

app.post('/upgrate-student', (req, res) => {
    const name = req.body.name
    const clas = req.body.class
    const age = req.body.age
    const number = req.body.number

    const id = req.query.id
    var sql = `UPDATE students SET name=?,class=?,age=?,number=? where id=?`;
    conn.query(sql, [name, clas, age, number, id], (err, data) => {
        if (err) console.error('.........93.........' + err);

        res.redirect('/studentlist')


    })
})
app.get('/search-student', (req, res) => {

    const sql = "SELECT * FROM students"
    conn.query(sql, (err, data) => {
        if (err) console.error('.........104.........' + err);
        res.render(__dirname + '/search-student', { students: data });
    })
})

app.get('/search', (req, res) => {
    const name = req.query.name;
    const number = req.query.number;
    const clas = req.query.class;
    const age = req.query.age;
  
    conn.connect((err) => {
      if (err) console.error('........116....... Database connection error:', err);
  
      const query = `SELECT * FROM students WHERE name LIKE ? AND class LIKE ? AND age LIKE ? AND number LIKE ?`;
  
      conn.query(query, [`%${name}%`, `%${clas}%`, `%${age}%`, `%${number}%`], (err, data) => {
  
        if (err) console.error('.......122.........Database query error:', err);
  
        res.render(__dirname+ '/search-student', { students: data });
      });
    });
  });


app.listen(5500)