'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simpleAssign = require('simple-assign');

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _feathersClient = require('feathers-client');

var _feathersClient2 = _interopRequireDefault(_feathersClient);

var _api = require('../middleware/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function () {
  _createClass(BaseModel, [{
    key: 'defaults',
    value: function defaults() {
      return {};
    }
  }, {
    key: 'findParams',
    value: function findParams() {
      return {};
    }
  }]);

  function BaseModel(resourceName, dispatch, onError) {
    _classCallCheck(this, BaseModel);

    this.app = _api2.default.app;
    this.resourceName = resourceName;
    this.service = this.app.service(resourceName + 's');
    this.onChanges = [];
    this.resources = [];

    this.dispatch = dispatch;
    this.service.on('created', this.createResource.bind(this));
    this.service.on('updated', this.updateResource.bind(this));
    this.service.on('removed', this.removeResource.bind(this));
  }

  _createClass(BaseModel, [{
    key: 'find',
    value: function find() {
      var _this = this;

      var self = this;

      this.service.find(this.findParams(), function (error, resources) {
        if (error) {
          console.error(error);
        } else {
          _this.resources = resources.data;
          _this.resourcesFetched();
        }
      }).then(function (page) {
        self.resources = self.resources.concat(page.data);
        self.resourcesFetched();
      }).catch(function (error) {
        return console.log(error);
      });
    }
  }, {
    key: 'create',
    value: function create() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.service.create((0, _simpleAssign2.default)({}, this.defaults(), properties));
    }
  }, {
    key: 'destroy',
    value: function destroy(resource) {
      this.service.remove(resource._id);
    }
  }, {
    key: 'save',
    value: function save(resource, properties) {
      this.service.update(resource._id, (0, _simpleAssign2.default)({}, resource, properties));
    }
  }, {
    key: 'getResource',
    value: function getResource() {
      return this.service.get(arguments);
    }
  }, {
    key: 'resourcesFetched',
    value: function resourcesFetched() {
      this.dispatch({
        type: this.resourceName.toUpperCase() + 'S_FETCHED',
        payload: this.resources
      });
    }
  }, {
    key: 'createResource',
    value: function createResource(resource) {
      this.dispatch({
        type: this.resourceName.toUpperCase() + '_CREATED',
        payload: resource
      });
    }
  }, {
    key: 'updateResource',
    value: function updateResource(resource) {
      this.dispatch({
        type: this.resourceName.toUpperCase() + '_UPDATED',
        payload: resource
      });
    }
  }, {
    key: 'removeResource',
    value: function removeResource(resource) {
      this.dispatch({
        type: this.resourceName.toUpperCase() + '_REMOVED',
        payload: resource
      });
    }
  }]);

  return BaseModel;
}();

exports.default = BaseModel;