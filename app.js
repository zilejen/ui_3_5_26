const express = require('express');
const conn = require('./conn');

const app = express();

app.use(express.static('public'));

// Parse form bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set templating engine
app.set('view engine', 'ejs');

// Display index page
app.get('/', (req, res) => {
    res.render('index');
});

// Register student
app.post('/register', (req, res) => {
    const { ln, fn, age, add } = req.body;

    const insert = `
        INSERT INTO tbl_students (ln, fn, age, address)
        VALUES (?, ?, ?, ?)
    `;

    conn.query(insert, [ln, fn, age, add], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error inserting student data.');
        }

        res.send(`
            <script>
                alert('Data Inserted');
                location.href = '/';
            </script>
        `);
    });
});

// Display student data
app.get('/view', (req, res) => {
    const getData = 'SELECT * FROM tbl_students';

    conn.query(getData, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving student data.');
        }

        res.render('view', {
            student: data
        });
    });
});

// Delete student
app.get('/delete/:id', (req, res) => {
    const del_id = req.params.id;

    const toDelete = `
        DELETE FROM tbl_students
        WHERE idnum = ?
    `;

    conn.query(toDelete, [del_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting student data.');
        }

        res.send(`
            <script>
                alert('Data Deleted!');
                location.href = '/view';
            </script>
        `);
    });
});

// Start server
app.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});

app.listen(8000);
