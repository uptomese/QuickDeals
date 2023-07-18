const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shoppo",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

// Parse JSON requests
app.use(bodyParser.json());
app.use(cors());

app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.post("/api/products", (req, res) => {
  const { img, name, description, price, user_id } = req.body;
  const values = [[img, name, description, price, user_id]]; // Modify as per your table structure

  db.query(
    "INSERT INTO products (img, name, description, price, user_id) VALUES ?",
    [values],
    (err, results) => {
      if (err) {
        throw err;
      }
      const lastInsertedId = results.insertId;
      res.json({
        status: 1,
        message: "Data inserted successfully",
        data: { ...req.body, id: lastInsertedId },
      });
    }
  );
});

app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 1) {
      res.json({ status: 1, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ status: 0, message: "Product not found" });
    }
  });
});

app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const { img, name, description, price, user_id } = req.body;

  db.query(
    "UPDATE products SET img = ?, name = ?, description = ?, price = ?, user_id = ? WHERE id = ?",
    [img, name, description, price, user_id, productId],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 1) {
        res.json({
          status: 1,
          message: "Product updated successfully",
          data: { ...req.body, id: productId },
        });
      } else {
        res.status(404).json({ status: 0, message: "Product not found" });
      }
    }
  );
});

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  db.query(
    "SELECT * FROM products where id = ?",
    [productId],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
