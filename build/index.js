'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = exports.BaseModel = undefined;

var _baseModel = require('./models/base-model');

var _baseModel2 = _interopRequireDefault(_baseModel);

var _api2 = require('./middleware/api');

var _api3 = _interopRequireDefault(_api2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BaseModel = _baseModel2.default;
exports.api = _api3.default;