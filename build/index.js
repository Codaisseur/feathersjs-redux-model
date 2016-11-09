'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseModel = require('./models/base-model');

var _baseModel2 = _interopRequireDefault(_baseModel);

var _api = require('./middleware/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BaseModel: _baseModel2.default,
  api: _api2.default
};