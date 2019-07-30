"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_mongoose["default"].Promise = global.Promise;
var uri = "mongodb://localhost:27017/libra";
var opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
_mongoose["default"].conn = _mongoose["default"].createConnection(uri, opts);

_mongoose["default"].conn.on('error', function () {
  console.log('mongodb connect failed');
});

_mongoose["default"].conn.on('open', function () {
  console.log('mongodb connect success');
});

var _default = _mongoose["default"];
exports["default"] = _default;