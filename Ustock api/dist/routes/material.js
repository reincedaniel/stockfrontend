"use strict";

var _verifyToken = _interopRequireDefault(require("../utils/verifyToken"));

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = function (app) {
  // List Material/service
  app.get('/api/materials', _verifyToken["default"], function (req, res) {
    /*         {include:[{model: models.Category},{model: models.User}]} */
    _models["default"].Material.findAll({
      include: [{
        model: _models["default"].User
      }]
    }).then(function (materials) {
      res.json({
        materials: materials
      });
    });
  }), // REGISTER Material V
  app.post('/api/materials', function (req, res) {
    // Params
    var Material = req.body; // Verify if exist into models.materials

    /*         models.Material.findOne({
                attributes: ["internal_code"],
                where: { key: Material.internal_code }
            })
                .then((MaterialFound) => {
                    if (!MaterialFound) { */

    /* (materials) => {
            return res.json({ materials, 'code': 1 })
        } */

    _models["default"].Material.create(Material).then(function (materials) {
      return materials.update({
        internal_code: 'EQP' + materials.id
      }).then(function (d) {
        return res.json({
          materials: materials,
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot add Material, error internal code',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Cannot add Material',
        'code': 0
      });
    });
    /*                 } else {
                        return res.json({ 'error': 'Material already exist', 'code': 11 })
                    }
    
                })
                .catch((err) => {
                    return res.json({ 'error': 'Unable to verify Material', err, 'code': -1 })
                }) */

  }); // UPDATE Material

  app.put('/api/materials/:id', function (req, res) {
    // Params
    var Material = req.body; // Verify if exist into models.materials

    _models["default"].Material.findAll({
      attributes: ["id"],
      where: {
        id: req.params.id
      }
    }).then(function (MaterialFound2) {
      MaterialFound2[0].update(Material).then(function (materials) {
        return res.json({
          materials: materials,
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Update Material',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify Material',
        err: err,
        'code': 0
      });
    });
  }); // Delete Material

  app["delete"]('/api/materials/:id', function (req, res) {
    // Params
    var Material = {
      id: req.params.id
    }; // Verify if exist into models.materials

    _models["default"].Material.findAll({
      attributes: ["id"],
      where: {
        id: Material.id
      }
    }).then(function (MaterialFound2) {
      MaterialFound2[0].destroy(Material).then(function () {
        return res.json({
          'status': 'success',
          'code': 1
        });
      })["catch"](function (err) {
        return res.json({
          'error': 'Cannot Delete Material',
          'code': 0
        });
      });
    })["catch"](function (err) {
      return res.json({
        'error': 'Unable to verify Material',
        err: err,
        'code': 0
      });
    });
  });
};