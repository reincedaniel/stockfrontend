"use strict";

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _secureKeys = _interopRequireDefault(require("secure-keys"));

var _jwt = _interopRequireDefault(require("../utils/jwt.util"));

var _models = _interopRequireDefault(require("../models"));

var _verifyToken = _interopRequireDefault(require("../utils/verifyToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sec = new _secureKeys["default"]({
  secret: 'BEGIN RSA',
  // Text of key used for encrypting/decrypting
  format: JSON,
  // optional (defaults to JSON): An object with `stringify` and `parse` methods
  alg: 'aes-256-ctr' //optional (this is default) Algorithm to use for encrypt/decrypt

});

module.exports = function (app) {
  app.get('/api/token_life', function (req, res) {
    var headerAuth = req.headers['authorization'];

    var userId = _jwt["default"].getUserId(headerAuth);

    if (userId < 0) return res.json({
      'error': 'Wrong Token',
      'code': 200,
      'access': false
    });else return res.json({
      'code': 1,
      'access': true
    });
  }), // List USER V
  app.get('/api/users', _verifyToken["default"], function (req, res) {
    _models["default"].User.findAll({
      include: [_models["default"].Order]
    }).then(function (users) {
      res.json({
        users: users
      });
    });
  }), // REGISTER USER V
  app.post('/api/users', function (req, res) {
    // Params
    var User = req.body;
    User.password = '936785605';
    if (User.email == null || User.username == null || User.password == null) return res.json({
      'error': 'Missing parameters',
      'code': 10
    }); // Verify if exist into models.users

    _models["default"].User.findAll({
      attributes: ["username"],
      where: {
        username: User.username
      }
    }).then(function (userFound) {
      if (userFound.length == 0) {
        var newUser = _models["default"].User.create({
          email: User.email,
          username: User.username,
          status: User.status,
          password: User.password,
          level: User.level,
          name: User.name
        }).then(function (users) {
          console.log('llllçççççç');
          console.log(users.dataValues.id);
          users.update({
            internal_code: 'USR' + users.dataValues.id
          }).then(function (d) {
            return res.json({
              users: d,
              'code': 1
            });
          })["catch"](function (err) {
            return res.json({
              'Error': 'Problem Internal code',
              'code': 0
            });
          });
        })["catch"](function (err) {
          return res.json({
            'error': 'Cannot add user',
            'code': 0
          });
        });
        /*                     bcrypt.hash(User.password, 5, (err, bcryptedPassword) => {
                                var newUser = models.User.create({
                                    email: User.email,
                                    username: User.username,
                                    status: User.status,
                                    password: bcryptedPassword,
                                    level: User.level,
                                    name: User.name
                                })
                                    .then((users) => {
                                        users.update({internal_code:'USR'+users.id})
                                        .then(d=>{
                                            return res.json({ users, 'code': 1 })
                                        })
                                        .catch(err=>{
                                            return res.json({'Error': 'Problem Internal code', 'code':0})
                                        })
                                        
                                    })
                                    .catch((err) => {
                                        return res.json({ 'error': 'Cannot add user', 'code': 0 })
                                    })
                            }) */

      } else {
        return res.json({
          'error': 'User already exist',
          'code': 11
        });
      }
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user',
        err: err,
        'code': 0
      });
    });
  }), // Delete user
  app["delete"]('/api/users/:id', _verifyToken["default"], function (req, res) {
    // Params
    var user = {
      id: req.params.id
    }; // Verify if exist into models.user

    _models["default"].User.findAll({
      attributes: ["id"],
      where: {
        id: user.id
      }
    }).then(function (userFound2) {
      userFound2[0].destroy(user).then(function () {
        return res.json({
          'status': 'success',
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Delete user',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user',
        err: err,
        'code': 0
      });
    });
  }), // UPDATE USER V
  app.put('/api/users/:id', _verifyToken["default"], function (req, res) {
    // Params
    var User = req.body; // Verify if exist into models.users

    _models["default"].User.findAll({
      attributes: ["id"],
      where: {
        id: req.params.id
      }
    }).then(function (userFound2) {
      var newUser = userFound2[0].update(User).then(function (users) {
        return res.json({
          users: users,
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Update user',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user',
        err: err,
        'code': 0
      });
    });
  }), // LOGIN V
  app.post('/api/login', function (req, res) {
    var User = {
      username: req.body.username,
      password: req.body.password
    };

    if (User.username == null || User.password == null) {
      return res.json({
        'error': 'missing parameters',
        'code': 10
      });
    } // Verify


    _models["default"].User.findAll({
      where: {
        username: User.username
      }
    }).then(function (userFound) {
      if (userFound.length > 0) {
        /*   
                                bcrypt.compare(User.password, userFound[0].dataValues.password)
                                .then((resBycrypt)=>{
            
                                  if (resBycrypt)  */
        if (User.password == userFound[0].dataValues.password) {
          if (userFound[0].dataValues.status == true) {
            return res.json({
              'users': userFound[0].dataValues,
              'token': _jwt["default"].generateTokenForUser(userFound[0].dataValues),
              'code': 12
            });
          } else {
            return res.json({
              'error': 'User Inactive',
              'code': 1111
            });
          }
        } else {
          return res.json({
            'error': 'Invalid password',
            'code': 111
          });
        }
        /*                   }) */

      } else {
        return res.json({
          'error': 'User does not exist',
          'code': 110
        });
      }
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user',
        err: err,
        'code': 0
      });
    });
  }), // Get user profile V
  app.get('/api/users/profile/:id', _verifyToken["default"], function (req, res) {
    _models["default"].User.findAll({
      where: {
        id: req.params.id
      }
    }).then(function (users) {
      if (users.length > 0) {
        return res.json({
          users: users[0].dataValues,
          'code': 1
        });
      } else {
        return res.json({
          'error': 'User does not exist',
          'code': 110
        });
      }
    })["catch"](function (err) {
      return res.json({
        'error': 'Cannot fetch user',
        'code': 0
      });
    });
  }), // Update password User V
  app.put('/api/users/profile/:id', _verifyToken["default"], function (req, res) {
    var passwordOld = req.body.passwordOld;
    var passwordNew = req.body.passwordNew;

    _models["default"].User.findAll({
      where: {
        id: req.params.id
      }
    }).then(function (U) {
      /*                 bcrypt.compare(passwordOld, U.password, (errBycrypt, resBycrypt) => { 
                          if (resBycrypt) */
      console.log(U[0].dataValues.password);

      if (passwordOld == U[0].dataValues.password) {
        /*                         bcrypt.hash(passwordNew, 5, (err, bcryptedPassword) => { */
        var newUser = U[0].update({
          password: passwordNew
        }).then(function (users) {
          return res.json({
            users: users.dataValues,
            'code': 1
          });
        })["catch"](function (err) {
          return res.json({
            'error': 'Cannot add user',
            'code': 0
          });
        });
        /*                         }) */
      } else {
        return res.json({
          'error': 'Old password invalid',
          'code': 111
        });
      }
      /*                 }) */

    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user',
        err: err,
        'code': 0
      });
    });
  }); // Update password UserADMIN

  app.put('/api/users', _verifyToken["default"], function (req, res) {
    var userId = req.body.idUserAdmin;
    var idUserNormal = req.body.idUserNormal;
    var passwordNew = '936785605';

    _models["default"].User.findAll({
      where: {
        id: userId
      }
    }).then(function (UX) {
      _models["default"].User.findAll({
        where: {
          id: idUserNormal
        }
      }).then(function (U) {
        if (UX[0].dataValues.level == 1) {
          /*                             bcrypt.hash(passwordNew, 5, (err, bcryptedPassword) => { */
          U[0].update({
            password: passwordNew
          }).then(function (users) {
            return res.json({
              users: users,
              'code': 1
            });
          })["catch"](function (err) {
            return res.json({
              'error': 'Cannot Update password user',
              'code': 0
            });
          });
          /*                             }) */
        } else {
          return res.json({
            'error': 'Only admin',
            err: err,
            'code': 333
          });
        }
      })["catch"](function (err) {
        return res.json({
          'error': 'Unable to verify user Person',
          err: err,
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify user x!!',
        err: err,
        'code': 0
      });
    });
  });
};