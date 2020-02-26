"use strict";

var _verifyToken = _interopRequireDefault(require("../utils/verifyToken"));

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = function (app) {
  // List Input/service
  app.get('/api/inputs', _verifyToken["default"], function (req, res) {
    _models["default"].Input.findAll({
      include: [{
        model: _models["default"].Article
      }, {
        model: _models["default"].Provider
      }, {
        model: _models["default"].Order
      }]
    }).then(function (inputs) {
      res.json({
        inputs: inputs
      });
    });
  }), // REGISTER USER V
  app.post('/api/inputs', _verifyToken["default"], function (req, res) {
    // Params
    var Input = req.body; // Verify if exist into models.inputs

    _models["default"].Input.create(Input).then(function (inputs) {
      inputs.update({
        internal_code: "IN" + inputs.id
      }).then(function (e) {
        _models["default"].Article.findOne({
          where: {
            id: Input.articleId
          }
        }).then(function (inputsx) {
          return res.json({
            inputsx: inputsx,
            'code': 1
          });
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Cannot add Input',
        'code': 0
      });
    });
  }); // UPDATE Input

  app.put('/api/inputs/:id', _verifyToken["default"], function (req, res) {
    // Params
    var Input = req.body; // Verify if exist into models.inputs

    _models["default"].Input.findOne({
      attributes: ["id"],
      where: {
        id: req.params.id
      }
    }).then(function (InputFound2) {
      InputFound2.update(Input).then(function (inputs) {
        return res.json({
          inputs: inputs,
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Update Input',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify Input',
        err: err,
        'code': 0
      });
    });
  }); // Delete Input

  app["delete"]('/api/inputs/:id', _verifyToken["default"], function (req, res) {
    // Params
    var Input = {
      id: req.params.id
    }; // Verify if exist into models.inputs

    _models["default"].Input.findAll({
      attributes: ["id"],
      where: {
        id: Input.id
      }
    }).then(function (InputFound2) {
      InputFound2[0].destroy(Input).then(function () {
        return res.json({
          'status': 'success',
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Delete Input',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify Input',
        err: err,
        'code': 0
      });
    });
  });
};