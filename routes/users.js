var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

//get Users
router.get('/list', (req, res) => {
  con.query("SELECT first_name,last_name,email,username,phone_number,company FROM `user` WHERE is_deleted=0", (err, result) => {
    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Geting Users",
      });
    }

    return res.status(200).json({
      sucess: "true",
      errro: "false",
      data: result,
      msg: "User Listed Sucessfully",
    });
  })
});

//update User(id)
router.put('/update/:id', (req, res) => {

  let id = req.params.id;
  const user = req.body;

  con.query("UPDATE user SET first_name = ?, last_name=? WHERE id=?", [user.first_name, user.last_name, id], (err, result) => {

    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Updating User",
      });
    }

    return res.status(200).json({
      sucess: "true",
      errro: "false",
      data: result,
      msg: "User Updated Sucessfully",
    });

  })
});

// add User
router.post('/add', (req, res) => {

  const user = req.body;
  console.log(user,con);
  con.query("INSERT INTO user (first_name, last_name, email,username, password, phone_number,company) VALUES (?,?,?,?,?,?,?)", [user.first_name, user.last_name, user.email, user.username, user.password, user.phone_number, user.company], (err, result) => {
    // console.log(this.sql);
    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Creating User",
      });
    }

    return res.status(200).json({
      sucess: "true",
      errro: "false",
      data: result,
      msg: "User Created Sucessfully",
    });


  });
});

//user soft delete
router.put('/soft/:id', (req, res) => {
  let id = req.params.id;

  con.query("UPDATE user SET is_deleted = ? WHERE id=?", [1, id], (err, result) => {

    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Deleting User",
      });
    }

    return res.status(200).json({
      sucess: "true",
      errro: "false",
      data: result,
      msg: "User Deleted Sucessfully",
    });

  });
});

//user hard delete
router.delete('/hard/:id', (req, res) => {
  let id = req.params.id;
  // console.log(id);
  con.query("DELETE FROM user WHERE id=?", [id], (err, result) => {

    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Deleting User",
      });
    }

    return res.status(200).json({
      sucess: "true",
      errro: "false",
      data: result,
      msg: "User Deleted Sucessfully",
    });

  });
});

//user Register
router.post('/register', (req, res) => {

  const user = req.body;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      con.query("INSERT INTO user (first_name, last_name, email,username, password, phone_number,company) VALUES (?,?,?,?,?,?,?)", [user.first_name, user.last_name, user.email, user.username, hash, user.phone_number, user.company], (err, result) => {
        if (err) {
          return res.status(500).json({
            sucess: "false",
            errro: "true",
            data: [],
            msg: "Error While Registering User",
          });
        }

        return res.status(200).json({
          sucess: "true",
          errro: "false",
          data: result,
          msg: "User Registerd Sucessfully",
        });


      });
    });
  });

});

//user login
router.post('/login', (req, response) => {
  const userDetails = req.body;

  con.query("SELECT first_name,last_name,email,password,username,phone_number,company FROM user WHERE username=? OR email=?", [userDetails.username, userDetails.email], (err, result) => {

    if (err) {
      return res.status(500).json({
        sucess: "false",
        errro: "true",
        data: [],
        msg: "Error While Loging User",
      });
    }
    else {

      bcrypt.compare(userDetails.password, result[0].password, (err, res) => {

        if (res) {

          delete result[0].password
          return response.status(200).json({
            sucess: "true",
            errro: "false",
            data: result,
            msg: "User Logged In Sucessfully",
          });
          
        }
        else {
          return response.status(401).json({
            sucess: "false",
            errro: "true",
            data: [],
            msg: "Please Check Credentials",
          });
        }
      });
    }
  })
});

module.exports = router;
