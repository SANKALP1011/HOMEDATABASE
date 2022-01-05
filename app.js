const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const Connection = require("mysql/lib/Connection");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

var coonection = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "b9339d8e6ad7e8" ,
  password: "f5a0438b" ,
  database: "heroku_82e0818920d6a5b" ,
});
// var coonection = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "happybarca1011",
//   database:  "Grocerydb",
// });
coonection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected successfully");
  }
});

app.get("/", function (req, res) {
  res.render("Home");
});

app.post("/", function (req, res) {
  //Nothing for the post route.
});

app.get("/Login", function (req, res) {
  res.render("Login");
});

app.post("/Login", function (req, res) {
  var email = req.body.Email;
  console.log(email);
  var Login = "select* from Users where Email = ?";
  coonection.query(Login, [email], function (err, result) {
    if (result.length != 0) {
      console.log("Logged");
      res.render("Insert");
    } else {
      console.log("User not registered");
      res.redirect("/SignIn");
    }
  });
});
app.get("/SignIn", function (req, res) {
  res.render("SignIn");
});
app.post("/SignIn", function (req, res) {
  var email = req.body.Email;
  var FullName = req.body.FullName;
  var UserName = req.body.CompanyName;
  var Password = req.body.Password;
  var Register =
    "Insert into Users(FullName,UserName,Email,Password) VALUES ('" +
    FullName +
    "','" +
    UserName +
    "','" +
    email +
    "','" +
    Password +
    "')";
  coonection.query(Register, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully registered");
      res.render("Insert");
    }
  });
});
app.post("/SignIn", function (req, res) {
  res.redirect("/Insert");
});
app.get("/Insert", function (req, res) {
  res.render("Insert");
});
app.post("/Insert", function (req, res) {
  console.log(req.body.Name);
  var Id = req.body.ID;
  var name = req.body.Name;
  var Type = req.body.Type;
  var Qty = req.body.Qty;
  var Price = req.body.Price;
  var Add =
    "Insert into Items(Id,Name,Type,Qty,Price) VALUES ('" +
    Id +
    "','" +
    name +
    "','" +
    Type +
    "','" +
    Qty +
    "','" +
    Price +
    "')";
  coonection.query(Add, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Added successfully");
    }
  });
  res.redirect("/Database");
});
app.get("/Database", function (req, res) {
  var data = "select * from Items";
  coonection.query(data, function (err, result, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("Database", {
        DatabaseItem: result,
      });
    }
  });
});
app.get("/Delete/:ID", function (req, res) {
  var id = req.params.ID;
  console.log(id);
  var query = "Delete from Items where id = ?";
  coonection.query(query, [id], function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted from the database");
    }
    res.redirect("/Database");
  });
});
app.get("/Search", function (req, res) {
  res.render("Search");
});
app.post("/Search", function (req, res) {
  console.log(req.body.SearchedText);
  var SearchedName = req.body.SearchedText;
  var SearchResult = "Select * from Items where Name = ?";
  coonection.query(SearchResult, [SearchedName], function (err, result) {
    if (err) {
      console.log(err);
      console.log("Please search the corrcet item and check your spellings");
    } else {
      for (var i = 0; i < result.length; i++) {
        res.render("Result", {
          ID: result[i].ID,
          Name: result[i].Name,
          Type: result[i].Type,
          Qty: result[i].Qty,
          Price: result[i].Price,
        });
      }
    }
  });
});
app.listen("3000", function () {
  console.log("server and uo running");
});
