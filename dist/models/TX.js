"use strict";

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("../mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TXSchema = new _mongoose["default"].Schema({
  version: {
    type: Number,
    unique: true,
    index: true,
    required: true
  },
  expiration: {
    type: Number,
    "default": null,
    required: true
  },
  sender: {
    type: String,
    "default": null,
    index: true,
    required: true
  },
  receiver: {
    type: String,
    "default": null,
    index: true,
    required: true
  },
  type: {
    type: String,
    index: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  gas_price: {
    type: Number,
    required: true
  },
  gas_used: {
    type: Number,
    required: true
  },
  maxGas: {
    type: Number,
    required: true
  },
  sequence: {
    type: Number,
    "default": 0,
    required: true
  },
  sender_signature: {
    type: String
  },
  sender_public_key: {
    type: String
  },
  signed_transaction_hash: {
    type: String
  },
  state_root_hash: {
    type: String
  },
  event_root_hash: {
    type: String
  }
});

var _default = _mongoose["default"].conn.model('TX', TXSchema, 'txs', true);

exports["default"] = _default;