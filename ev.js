var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: ""
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS booking", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    con.query("USE booking", function (err, result) {
        if (err) throw err;
        console.log("Using booking database");
    });

    var users = "CREATE TABLE IF NOT EXISTS hotel (room_no int(3),cust_id int(3),alloted varchar(30),price int(3))";
    con.query(users, function (err, result) {
        if (err) throw err;
        console.log("Table hotel created");
    });

    var posts = "CREATE TABLE IF NOT EXISTS customer (cust_id int(3), cust_name varchar(20), address varchar(50), age int(3))";
    con.query(posts, function (err, result) {
        if (err) throw err;
        console.log("Table customer created");
    });
});

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
            alert('Please fill in all fields.');
            return;
        }
    });
    return isValid;
}

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hotel Booking System</title>
        <style>
        /* Your CSS styles here */
        </style>
    </head>
    <body>
    <h1>Hotel Booking System</h1>
        <div class="forms">

        <form action="/rooms/insert" method="post" onsubmit="return validateForm(this)">
        <h2> ADD ROOM DETAILS</h2>
        <div>
            <label for="room_no">Room No:</label>
            <input type="number" name="room_no" value="" id="room_no">
        </div>
        <div>
            <label for="cust_id">CustomeID:</label>
            <input type="number" name="cust_id" value="" id="cust_id">
        </div>
        <div>
            <label for="alloted">Alloted(yes/no)</label>
            <input type="text" name="alloted" value="" id="alloted">
            <label for="price">Price</label>
            <input type="number" name="price" value="" id="price">
        </div>
        <div>
            <input type="submit" value="ADD ROOM">
        </div>
    </form>
    
            <hr>
            
            <form action="/customer/insert" method="post" onsubmit="return validateForm(this)">
                <h2>ADD CUSTOMER DETAILS</h2>
              <div>
                <label for="cust_id">Customer ID:</label>
                <input type="number" name="cust_id" value="" id="cust_id">
              </div>
              <div>
                <label for="cust_name">Customer Name:</label>
                <input type="text" name="cust_name" value="" id="cust_name">
              </div>
               <div>
                <label for="address">Address:</label>
                <input type="text" name="address" value="" id="address">
              </div>
              <div>
                <label for="age">Age</label>
                <input type="number" name="age" value="" id="age">
              </div>
              
              <div>
                <input type="submit" value="ADD CUSTOMER">
              </div>
            </form>
    
            <hr>
            <!-- Other forms -->
    
            </div>
        </body>
        </html>
      `);
});

app.post('/rooms/insert', (req, res) => {
    const { room_no, cust_id, alloted, price } = req.body;
    const query = "INSERT INTO hotel (room_no, cust_id, alloted, price) VALUES (?, ?, ?,?)";
    con.query(query, [room_no, cust_id, alloted, price], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding room.");
      } else {
        res.send("Room added successfully!");
      }
    });
  });
  app.post('/book/insert', (req, res) => {
      const { room_no, cust_id} = req.body;
      const query = `
      UPDATE hotel
      SET cust_id = ${cust_id}, alloted = "yes"
      WHERE room_no = ${room_no}
    `;
      con.query(query, [room_no, cust_id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error booking room.");
        } else {
          res.send("Room booked successfully!");
        }
      });
    });
  
    app.post('/customer/insert', (req, res) => {
      const { cust_id, cust_name, address, age } = req.body;
      const query = "INSERT INTO customer (cust_id, cust_name, address, age) VALUES (?, ?, ?, ?)";
      con.query(query, [cust_id, cust_name, address, age], (err, result) => {
        if (err) throw err;
        res.send("Customer added successfully!");
      });
    });
    
    app.post('/checkout/insert', (req, res) => {
      const {cust_id} = req.body;
      const query = ` UPDATE hotel
      SET cust_id = NULL, alloted = "no"
      WHERE cust_id = ? `;
    con.query(query, [cust_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error CheckingOut.");
      } else {
        res.send("Checkout  successful!");
      }
    });
    });

  //       app.post('/checkout/insert', (req, res) => {
  //     const {cust_id} = req.body;
  //     const query = ` UPDATE hotel
  //     SET cust_id = NULL, alloted = "no"
  //     WHERE cust_id = ? `;
  //   con.query(query, [cust_id], (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       res.status(500).send("Error CheckingOut.");
  //     } else {
  //       res.send("Checkout  successful!");
  //     }
  //   });
  //   });

    

    app.get('/unoccupied', (req, res) => {
      const query = 'SELECT * FROM hotel WHERE alloted = "no"';

      con.query(query, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving unoccupied rooms.");
        } else {
          res.json(result);
        }
      });
    });

  //   app.get('/OCCUPIED', (req, res) => {
      
  //     const query = `
      // SELECT h.room_no, h.cust_id, h.alloted, h.price, c.cust_name, c.address, c.age
      // FROM hotel h
      // JOIN customer c ON h.cust_id = c.cust_id
      // WHERE h.alloted = "yes"
  //   `;
  //     con.query(query, (err, result) => {
  //         if (err) {
  //             console.error(err);
  //             res.status(500).send("Error retrieving OCCUPIED ROOMS.");
  //         } else {
  //             res.json(result);
  //         }
  //     });
  // });

  //   app.get('/unoccupied', (req, res) => {
  //     const query = 'SELECT * FROM hotel WHERE alloted = "no"';

  //     con.query(query, (err, result) => {
  //       if (err) {
  //         console.error(err);
  //         res.status(500).send("Error retrieving unoccupied rooms.");
  //       } else {
  //         res.json(result);
  //       }
  //     });
  //   });

    app.get('/occupied', (req, res) => {
      
      const query = `
      SELECT h.room_no, h.cust_id, h.alloted, h.price, c.cust_name, c.address, c.age
      FROM hotel h
      JOIN customer c ON h.cust_id = c.cust_id
      WHERE h.alloted = "yes"
`;
      con.query(query, (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send("Error retrieving OCCUPIED ROOMS.");
          } else {
              res.json(result);
          }
      });
  });

// Your other routes and app.listen() here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
