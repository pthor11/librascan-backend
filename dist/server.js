"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("regenerator-runtime/runtime");

var _fastify = _interopRequireDefault(require("fastify"));

var _fastifyCors = _interopRequireDefault(require("fastify-cors"));

var _TX = _interopRequireDefault(require("./models/TX"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _fastify["default"])({
  logger: false
});
app.register(_fastifyCors["default"], {
  origin: true
});
app.get('/', function (request, reply) {
  reply.send([{
    query: '/tx/:version',
    purpose: 'get single tx by version. Example: /tx/1001'
  }, {
    query: '/txs',
    purpose: 'get list of txs. Example: /txs?sort=DSC&limit=10&skip=100'
  }]);
});
app.get('/address/:id',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(request, reply) {
    var address, txs, sum_received_value, sum_sent_value, balance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (request.params.id) {
              _context.next = 4;
              break;
            }

            reply.send(null);
            _context.next = 18;
            break;

          case 4:
            address = request.params.id;
            _context.prev = 5;
            _context.next = 8;
            return _TX["default"].find({
              $or: [{
                sender: address
              }, {
                receiver: address
              }]
            }).sort({
              version: -1
            });

          case 8:
            txs = _context.sent;
            sum_received_value = txs.filter(function (tx) {
              return tx.receiver === address;
            }).reduce(function (sum, tx) {
              return sum + tx.amount;
            }, 0);
            sum_sent_value = txs.filter(function (tx) {
              return tx.sender === address;
            }).reduce(function (sum, tx) {
              return sum + tx.amount;
            }, 0);
            balance = sum_received_value - sum_sent_value;
            reply.send({
              balance: balance,
              txs: txs
            });
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](5);
            reply.send(_context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/tx/:version',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(request, reply) {
    var tx;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _TX["default"].findOne({
              version: request.params.version
            }).lean();

          case 3:
            tx = _context2.sent;
            reply.send(tx);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            reply.send(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/txs',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(request, reply) {
    var sort, limit, skip, txs;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sort = request.query.sort || 'DSC';
            limit = Number(request.query.limit) || 10;
            skip = Number(request.query.skip) || 0;
            _context3.prev = 3;
            _context3.next = 6;
            return _TX["default"].find({}, {
              _id: 0
            }).sort(sort === 'DSC' ? {
              version: -1
            } : {
              version: 1
            }).limit(limit).skip(skip).lean();

          case 6:
            txs = _context3.sent;
            reply.send(txs);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](3);
            reply.send(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 10]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

var start =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return app.listen(3001, '0.0.0.0');

          case 3:
            console.log("Server is running on http://localhost:3001");
            _context4.next = 10;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            app.log.error(_context4.t0);
            process.exit(1);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 6]]);
  }));

  return function start() {
    return _ref4.apply(this, arguments);
  };
}();

start();