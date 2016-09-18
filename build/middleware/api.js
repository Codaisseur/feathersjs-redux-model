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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
  function API() {
    _classCallCheck(this, API);

    // Establish a Socket.io connection
    var socket = (0, _socket2.default)(process.env.FEATHERS_API_URL);
    // Initialize our Feathers client application through Socket.io
    // with hooks and authentication.
    this.app = (0, _feathersClient2.default)().configure(_feathersClient2.default.socketio(socket)).configure(_feathersClient2.default.hooks())
    // Use localStorage to store our login token
    .configure(_feathersClient2.default.authentication({
      type: 'local',
      storage: window.localStorage
    }));
  }

  _createClass(API, [{
    key: 'service',
    value: function service(serviceName) {
      return this.app.service(serviceName);
    }
  }, {
    key: 'authenticate',
    value: function authenticate(user) {
      var email = user.email;
      var password = user.password;

      return this.app.authenticate((0, _simpleAssign2.default)({}, { type: 'local' }, {
        email: email,
        password: password
      }));
    }
  }, {
    key: 'signOut',
    value: function signOut() {
      return this.app.logout();
    }
  }]);

  return API;
}();

var Api = new API();

exports.default = Api;