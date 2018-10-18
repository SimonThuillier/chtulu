/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/test-react.jsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/test-react.jsx":
/*!**********************************!*\
  !*** ./assets/js/test-react.jsx ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MenuRestaurant =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MenuRestaurant, _React$Component);

  function MenuRestaurant() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MenuRestaurant);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MenuRestaurant)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      foods: [{
        id: 0,
        name: "Pizza 🍕",
        description: "Une belle margaritha !"
      }, {
        id: 1,
        name: "Blanquette de veau",
        description: "Les plats à base de viande sont-ils de qualité ?"
      }, {
        id: 2,
        name: "Maki 🍙",
        description: "Avocat et saumon"
      }, {
        id: 3,
        name: "Sandwish 🥪",
        description: "Végé pâté aux tomates"
      }],
      foodSelected: -1
    });

    return _this;
  }

  _createClass(MenuRestaurant, [{
    key: "onPlatClicked",
    value: function onPlatClicked(food) {
      //alert(food.description);
      this.setState({
        foodSelected: food.id
      });
    } //  Une fonction "render" qui retourne la structure à afficher à l'utilisateur

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // Dans le return, on peut écrire de l'HTML ou référencer un autre Composant
      return React.createElement("div", null, "Bienvenue, voici notre carte (cool ) :", this.state.foods.map(function (food) {
        return React.createElement(Plat, {
          showDescription: _this2.state.foodSelected == food.id,
          food: food,
          onClick: _this2.onPlatClicked.bind(_this2)
        });
      }));
    }
  }]);

  return MenuRestaurant;
}(React.Component);

var Plat =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Plat, _React$Component2);

  function Plat() {
    _classCallCheck(this, Plat);

    return _possibleConstructorReturn(this, _getPrototypeOf(Plat).apply(this, arguments));
  }

  _createClass(Plat, [{
    key: "onClickPlat",
    value: function onClickPlat() {
      // On peut facilement implémenter notre fonction
      // On reçoit une variable "onClick" dans notre "props"
      // Si on a une props "onClick", alors...
      if (this.props.onClick) {
        // On déclencher la fonction "onClick" en donnant en paramètre l'id du plat
        this.props.onClick(this.props.food);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        onClick: this.onClickPlat.bind(this),
        style: {
          padding: 5,
          marginLeft: "5%",
          backgroundColor: this.props.showDescription ? "rgb(225, 225, 225)" : "transparent"
        }
      }, this.props.food.name, this.props.showDescription ? React.createElement("div", null, React.createElement("b", null, this.props.food.description)) : null);
    }
  }]);

  return Plat;
}(React.Component); // tuto react


function Square(props) {
  return React.createElement("button", {
    className: "square",
    onClick: props.onClick
  }, props.value);
}

function RestartButton(props) {
  return React.createElement("button", {
    onClick: props.onClick
  }, "Replay ?");
}

var Board =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(Board, _React$Component3);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, _getPrototypeOf(Board).apply(this, arguments));
  }

  _createClass(Board, [{
    key: "renderSquare",
    value: function renderSquare(i) {
      var _this3 = this;

      return React.createElement(Square, {
        value: this.props.squares[i],
        onClick: function onClick() {
          return _this3.props.onClick(i);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)), React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(3), this.renderSquare(4), this.renderSquare(5)), React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(6), this.renderSquare(7), this.renderSquare(8)));
    }
  }]);

  return Board;
}(React.Component);

var Game =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(Game, _React$Component4);

  function Game(props) {
    var _this4;

    _classCallCheck(this, Game);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, props));
    _this4.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      player: 'X'
    };
    return _this4;
  }

  _createClass(Game, [{
    key: "handleClick",
    value: function handleClick(i) {
      var history = this.state.history.slice(0, this.state.stepNumber + 1);
      var current = history[history.length - 1];
      var squares = current.squares.slice();

      if (this.calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.player;
      var player = this.state.player === 'X' ? 'O' : 'X';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        player: player
      });
    }
  }, {
    key: "calculateWinner",
    value: function calculateWinner(squares) {
      var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

      for (var i = 0; i < lines.length; i++) {
        var _lines$i = _slicedToArray(lines[i], 3),
            a = _lines$i[0],
            b = _lines$i[1],
            c = _lines$i[2];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }

      return null;
    }
  }, {
    key: "jumpTo",
    value: function jumpTo(step) {
      this.setState({
        stepNumber: step,
        player: step % 2 === 0 ? 'X' : 'O'
      });
    }
  }, {
    key: "restartGame",
    value: function restartGame() {
      console.log("restart");
      this.setState({
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        player: 'X'
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var history = this.state.history;
      var current = history[this.state.stepNumber];
      var winner = this.calculateWinner(current.squares);
      var moves = history.map(function (step, move) {
        var desc = move ? 'Go to move #' + move : 'Go to game start';
        return React.createElement("li", {
          key: move
        }, React.createElement("button", {
          onClick: function onClick() {
            return _this5.jumpTo(move);
          }
        }, desc));
      });
      var status;

      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + this.state.player;
      }

      React.createElement("div", {
        className: "status"
      }, status);
      {
        winner ? React.createElement(RestartButton, {
          onClick: function onClick() {
            return _this5.restartGame();
          }
        }) : null;
      }
      return React.createElement("div", {
        className: "game"
      }, React.createElement("div", {
        className: "game-board"
      }, React.createElement(Board, {
        squares: current.squares,
        onClick: function onClick(i) {
          return _this5.handleClick(i);
        }
      })), React.createElement("div", {
        className: "game-info"
      }, React.createElement("div", null, status, " ", winner ? React.createElement(RestartButton, {
        onClick: function onClick() {
          return _this5.restartGame();
        }
      }) : null), React.createElement("ol", null, moves)));
    }
  }]);

  return Game;
}(React.Component);

ReactDOM.render(React.createElement(MenuRestaurant, null), document.getElementById('menu'));
ReactDOM.render(React.createElement(Game, null), document.getElementById('game'));
var position = [48.845, 2.29]; //import { Map, Marker, Popup, TileLayer } from 'RL';
// const map2 = (
//     <RL.Map center={position} zoom={13}>
//         <RL.TileLayer
//             url={"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
//             attribution={"&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"}
//         />
//         <RL.Marker position={position}>
//             <RL.Popup>A pretty CSS3 popup.<br />Easily customizable.</RL.Popup>
//         </RL.Marker>
//     </RL.Map>
// );

var Map = RL.Map;
var TileLayer = RL.TileLayer;
var Marker = RL.Marker;
var Popup = RL.Popup;
var iconSize = 35;
var napoIcon = L.icon({
  iconUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',
  shadowUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',
  iconSize: [iconSize, iconSize],
  // size of the icon
  shadowSize: [0, 0],
  // size of the shadow
  iconAnchor: [iconSize, iconSize],
  // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],
  // the same for the shadow
  popupAnchor: [-3, -30] // point from which the popup should open relative to the iconAnchor

});
var bismarckIcon = L.icon({
  iconUrl: 'http://localhost:8000/build/images/bismarck.badd1521.jpeg',
  shadowUrl: 'http://localhost:8000/build/images/bismarck.badd1521.jpeg',
  iconSize: [iconSize, iconSize],
  // size of the icon
  shadowSize: [0, 0],
  // size of the shadow
  iconAnchor: [iconSize, iconSize],
  // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],
  // the same for the shadow
  popupAnchor: [-3, -30] // point from which the popup should open relative to the iconAnchor

});
var hugoIcon = L.icon({
  iconUrl: 'http://localhost:8000/build/images/hugo.9465935c.jpeg',
  shadowUrl: 'http://localhost:8000/build/images/hugo.9465935c.jpeg',
  iconSize: [iconSize, iconSize],
  // size of the icon
  shadowSize: [0, 0],
  // size of the shadow
  iconAnchor: [iconSize, iconSize],
  // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],
  // the same for the shadow
  popupAnchor: [-3, -30] // point from which the popup should open relative to the iconAnchor

});
var icons = [bismarckIcon, hugoIcon, napoIcon, napoIcon, napoIcon, napoIcon, napoIcon, napoIcon];

var MyForm =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(MyForm, _React$Component5);

  function MyForm(props) {
    var _this6;

    _classCallCheck(this, MyForm);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(MyForm).call(this, props));
    _this6.handleSubmit = _this6.handleSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this6)));
    _this6.onSave = props.onSave;
    _this6.onDelete = props.onDelete;
    _this6.onFinish = props.onFinish;
    _this6.handleSubmit = _this6.handleSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this6)));
    _this6.input = React.createRef();
    _this6.data = {
      comment: null
    };
    return _this6;
  }

  _createClass(MyForm, [{
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      this.onSave({
        comment: this.input.current.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", {
        onSubmit: this.handleSubmit
      }, React.createElement("input", {
        type: "text",
        required: "required",
        ref: this.input,
        size: "60"
      }), React.createElement("button", {
        type: "submit",
        class: "btn btn-primary"
      }, "Enregistrer"), React.createElement("a", {
        name: "delete",
        class: "btn btn-warning",
        onClick: this.onDelete
      }, "Supprimer"), React.createElement("a", {
        name: "finish",
        class: "btn",
        onClick: this.onFinish
      }, "Finir"));
    }
  }]);

  return MyForm;
}(React.Component);

var MyPopup =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(MyPopup, _React$Component6);

  function MyPopup() {
    _classCallCheck(this, MyPopup);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyPopup).apply(this, arguments));
  }

  _createClass(MyPopup, [{
    key: "render",
    value: function render() {
      return React.createElement(Popup, this.props, this.props.msg, !this.props.finished ? React.createElement(MyForm, this.props) : null);
    }
  }]);

  return MyPopup;
}(React.Component);

var SimpleExample =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(SimpleExample, _React$Component7);

  function SimpleExample() {
    var _this7;

    _classCallCheck(this, SimpleExample);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(SimpleExample).call(this));
    _this7.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 6,
      pins: [],
      loading: 0
    };
    return _this7;
  }

  _createClass(SimpleExample, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this8 = this;

      hb.util.server.get('resourceGeometry', {
        minimal: true
      }).then(function (data) {
        console.log("reception client");
        data.rows.forEach(function (item) {
          return _this8.onPinReception(item);
        });
        console.log(data);

        _this8.setState({
          pins: data.rows
        });
      });
    }
  }, {
    key: "handleOnDeletePin",
    value: function handleOnDeletePin(key) {
      return function () {
        console.log(key);
        var pins = this.state.pins.slice(0, this.state.pins.length);
        var index = pins.findIndex(function (x) {
          return x.id === key;
        });
        pins.splice(index, 1);
        console.log(pins);
        this.setState({
          pins: pins
        });
      };
    }
  }, {
    key: "handleOnSavePin",
    value: function handleOnSavePin(key) {
      return function (formData) {
        var _this9 = this;

        console.log(formData);
        console.log(key);
        var pins = this.state.pins.slice(0, this.state.pins.length);
        var index = pins.findIndex(function (x) {
          return x.id === key;
        });
        var pin = pins[index];
        console.log(pin);
        hb.util.server.post('resourceGeometry', {
          minimal: true
        }, pin, formData).then(function (data) {
          console.log("reception client");
          console.log(data);
          pins[index] = data;
          /*if(index !== data.id){
              pins.splice(index,1);
              pins[data.id] = data;
          }
          else{
              pins[index] = data;
          }*/

          console.log(pins);

          _this9.setState({
            pins: pins
          });
        });
      };
    }
  }, {
    key: "handleOnFinishPin",
    value: function handleOnFinishPin(key) {
      return function () {
        var pins = this.state.pins.slice(0, this.state.pins.length);
        pins.find(function (x) {
          return x.id === key;
        }).finished = true;
        this.setState({
          pins: pins
        });
      };
    }
  }, {
    key: "handleClickOnMap",
    value: function handleClickOnMap(event) {
      var _this10 = this;

      var latlng = event.latlng;
      hb.util.server.getNew('resourceGeometry').then(function (data) {
        data.targetGeometry = {};
        data.targetGeometry.value = {
          type: "Point",
          coordinates: [latlng.lat, latlng.lng]
        };

        _this10.onPinReception(data);

        var pins = _this10.state.pins.slice(0, _this10.state.pins.length);

        console.log(data);

        _this10.setState({
          pins: pins.concat([data])
        });
      });
    }
  }, {
    key: "onPinReception",
    value: function onPinReception(data) {
      data.finished = false;
      data.marker = React.createRef();
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(key) {
      return function () {
        var pins = this.state.pins.slice(0, this.state.pins.length);
        var pin = pins.find(function (x) {
          return x.id === key;
        });
        console.log(pin);
        if (!pin.marker || !pin.marker.current || !pin.marker.current.leafletElement) return;

        var _pin$marker$current$l = pin.marker.current.leafletElement.getLatLng(),
            lat = _pin$marker$current$l.lat,
            lng = _pin$marker$current$l.lng;

        console.log(key);
        pin.targetGeometry.value.coordinates = [lat, lng];
        console.log(pins.map(function (pin) {
          return {
            id: pin.id,
            coords: pin.targetGeometry.value.coordinates
          };
        }));
        this.setState({
          pins: pins
        });
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      var position = [this.state.lat, this.state.lng];
      var pins = this.state.pins;
      var index = -1;
      var markers = pins.map(function (pin) {
        index++;
        return React.createElement(Marker, {
          key: pin.id,
          icon: icons[index],
          position: [pin.getPointLat(), pin.getPointLng()],
          draggable: true,
          onDragend: _this11.updatePosition(pin.id).bind(_this11),
          ref: pin.marker
        }, React.createElement(MyPopup, {
          autoClose: false,
          closeOnClick: false,
          msg: pin.comment,
          finished: pin.finished,
          onDelete: _this11.handleOnDeletePin(pin.id).bind(_this11),
          key: index,
          onSave: _this11.handleOnSavePin(pin.id).bind(_this11),
          onFinish: _this11.handleOnFinishPin(pin.id).bind(_this11)
        }));
      });
      return React.createElement(Map, {
        center: position,
        zoom: this.state.zoom,
        onClick: function onClick(event) {
          _this11.handleClickOnMap(event);
        }
      }, React.createElement(TileLayer, {
        attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        minZoom: 0,
        maxZoom: 32
      }), React.createElement(TileLayer, {
        attribution: "",
        url: "http://localhost:8000/tiles/{z}/{x}/{y}.png",
        opacity: 0.85,
        minZoom: 0,
        maxZoom: 8
      }), markers);
    }
  }]);

  return SimpleExample;
}(React.Component);

ReactDOM.render(React.createElement(SimpleExample, null), document.getElementById('map2'));

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTgwYzAzYzRkZGM2NWJhNWYxNjAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4Il0sIm5hbWVzIjpbIk1lbnVSZXN0YXVyYW50IiwiZm9vZHMiLCJpZCIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsImZvb2RTZWxlY3RlZCIsImZvb2QiLCJzZXRTdGF0ZSIsInN0YXRlIiwibWFwIiwib25QbGF0Q2xpY2tlZCIsImJpbmQiLCJSZWFjdCIsIkNvbXBvbmVudCIsIlBsYXQiLCJwcm9wcyIsIm9uQ2xpY2siLCJvbkNsaWNrUGxhdCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwiYmFja2dyb3VuZENvbG9yIiwic2hvd0Rlc2NyaXB0aW9uIiwiU3F1YXJlIiwidmFsdWUiLCJSZXN0YXJ0QnV0dG9uIiwiQm9hcmQiLCJpIiwic3F1YXJlcyIsInJlbmRlclNxdWFyZSIsIkdhbWUiLCJoaXN0b3J5IiwiQXJyYXkiLCJmaWxsIiwic3RlcE51bWJlciIsInBsYXllciIsInNsaWNlIiwiY3VycmVudCIsImxlbmd0aCIsImNhbGN1bGF0ZVdpbm5lciIsImNvbmNhdCIsImxpbmVzIiwiYSIsImIiLCJjIiwic3RlcCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5uZXIiLCJtb3ZlcyIsIm1vdmUiLCJkZXNjIiwianVtcFRvIiwic3RhdHVzIiwicmVzdGFydEdhbWUiLCJoYW5kbGVDbGljayIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwb3NpdGlvbiIsIk1hcCIsIlJMIiwiVGlsZUxheWVyIiwiTWFya2VyIiwiUG9wdXAiLCJpY29uU2l6ZSIsIm5hcG9JY29uIiwiTCIsImljb24iLCJpY29uVXJsIiwic2hhZG93VXJsIiwic2hhZG93U2l6ZSIsImljb25BbmNob3IiLCJzaGFkb3dBbmNob3IiLCJwb3B1cEFuY2hvciIsImJpc21hcmNrSWNvbiIsImh1Z29JY29uIiwiaWNvbnMiLCJNeUZvcm0iLCJoYW5kbGVTdWJtaXQiLCJvblNhdmUiLCJvbkRlbGV0ZSIsIm9uRmluaXNoIiwiaW5wdXQiLCJjcmVhdGVSZWYiLCJkYXRhIiwiY29tbWVudCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJNeVBvcHVwIiwibXNnIiwiZmluaXNoZWQiLCJTaW1wbGVFeGFtcGxlIiwibGF0IiwibG5nIiwiem9vbSIsInBpbnMiLCJsb2FkaW5nIiwiaGIiLCJ1dGlsIiwic2VydmVyIiwiZ2V0IiwibWluaW1hbCIsInRoZW4iLCJyb3dzIiwiZm9yRWFjaCIsIml0ZW0iLCJvblBpblJlY2VwdGlvbiIsImtleSIsImluZGV4IiwiZmluZEluZGV4IiwieCIsInNwbGljZSIsImZvcm1EYXRhIiwicGluIiwicG9zdCIsImZpbmQiLCJsYXRsbmciLCJnZXROZXciLCJ0YXJnZXRHZW9tZXRyeSIsInR5cGUiLCJjb29yZGluYXRlcyIsIm1hcmtlciIsImxlYWZsZXRFbGVtZW50IiwiZ2V0TGF0TG5nIiwiY29vcmRzIiwibWFya2VycyIsImdldFBvaW50TGF0IiwiZ2V0UG9pbnRMbmciLCJ1cGRhdGVQb3NpdGlvbiIsImhhbmRsZU9uRGVsZXRlUGluIiwiaGFuZGxlT25TYXZlUGluIiwiaGFuZGxlT25GaW5pc2hQaW4iLCJoYW5kbGVDbGlja09uTWFwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FB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MEVBRGhCO0FBRUksV0FBRyxFQUFDLHlDQUZSO0FBR0ksZUFBTyxFQUFFLENBSGI7QUFJSSxlQUFPLEVBQUU7QUFKYixRQURKLEVBT0ksb0JBQUMsU0FBRDtBQUNJLG1CQUFXLEVBQUMsRUFEaEI7QUFFSSxXQUFHLEVBQUMsNkNBRlI7QUFHSSxlQUFPLEVBQUUsSUFIYjtBQUlJLGVBQU8sRUFBRSxDQUpiO0FBS0ksZUFBTyxFQUFFO0FBTGIsUUFQSixFQWNLd0MsT0FkTCxDQURKO0FBa0JIOzs7O0VBMUt1QnBILEtBQUssQ0FBQ0MsUzs7QUE0S2xDMEMsUUFBUSxDQUFDQyxNQUFULENBQWdCNUMsS0FBSyxDQUFDNkMsYUFBTixDQUFvQnFDLGFBQXBCLEVBQW1DLElBQW5DLENBQWhCLEVBQTBEcEMsUUFBUSxDQUFDQyxjQUFULENBQXdCLE1BQXhCLENBQTFELEUiLCJmaWxlIjoidGVzdC1yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9idWlsZC9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4XCIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE4MGMwM2M0ZGRjNjViYTVmMTYwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIE1lbnVSZXN0YXVyYW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHN0YXRlID0ge1xuICAgICAgICBmb29kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiUGl6emEg8J+NlVwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlVuZSBiZWxsZSBtYXJnYXJpdGhhICFcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkJsYW5xdWV0dGUgZGUgdmVhdVwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkxlcyBwbGF0cyDDoCBiYXNlIGRlIHZpYW5kZSBzb250LWlscyBkZSBxdWFsaXTDqSA/XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJNYWtpIPCfjZlcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBdm9jYXQgZXQgc2F1bW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJTYW5kd2lzaCDwn6WqXCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVsOpZ8OpIHDDonTDqSBhdXggdG9tYXRlc1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGZvb2RTZWxlY3RlZDotMVxuICAgIH1cblxuICAgIG9uUGxhdENsaWNrZWQoZm9vZCl7XG4gICAgICAgIC8vYWxlcnQoZm9vZC5kZXNjcmlwdGlvbik7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb29kU2VsZWN0ZWQ6IGZvb2QuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuXG4gICAgLy8gIFVuZSBmb25jdGlvbiBcInJlbmRlclwiIHF1aSByZXRvdXJuZSBsYSBzdHJ1Y3R1cmUgw6AgYWZmaWNoZXIgw6AgbCd1dGlsaXNhdGV1clxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgLy8gRGFucyBsZSByZXR1cm4sIG9uIHBldXQgw6ljcmlyZSBkZSBsJ0hUTUwgb3UgcsOpZsOpcmVuY2VyIHVuIGF1dHJlIENvbXBvc2FudFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBCaWVudmVudWUsIHZvaWNpIG5vdHJlIGNhcnRlIChjb29sICkgOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mb29kcy5tYXAoKGZvb2QpID0+IDxQbGF0XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93RGVzY3JpcHRpb249e3RoaXMuc3RhdGUuZm9vZFNlbGVjdGVkPT1mb29kLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9vZD17Zm9vZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25QbGF0Q2xpY2tlZC5iaW5kKHRoaXMpfS8+KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgUGxhdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBvbkNsaWNrUGxhdCgpIHtcbiAgICAgICAgLy8gT24gcGV1dCBmYWNpbGVtZW50IGltcGzDqW1lbnRlciBub3RyZSBmb25jdGlvblxuICAgICAgICAvLyBPbiByZcOnb2l0IHVuZSB2YXJpYWJsZSBcIm9uQ2xpY2tcIiBkYW5zIG5vdHJlIFwicHJvcHNcIlxuXG4gICAgICAgIC8vIFNpIG9uIGEgdW5lIHByb3BzIFwib25DbGlja1wiLCBhbG9ycy4uLlxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICAgICAgICAvLyBPbiBkw6ljbGVuY2hlciBsYSBmb25jdGlvbiBcIm9uQ2xpY2tcIiBlbiBkb25uYW50IGVuIHBhcmFtw6h0cmUgbCdpZCBkdSBwbGF0XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy5mb29kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja1BsYXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiBcIjUlXCIsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5zaG93RGVzY3JpcHRpb24gPyBcInJnYigyMjUsIDIyNSwgMjI1KVwiIDogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZm9vZC5uYW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zaG93RGVzY3JpcHRpb24gP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj48Yj57dGhpcy5wcm9wcy5mb29kLmRlc2NyaXB0aW9ufTwvYj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbi8vIHR1dG8gcmVhY3RcblxuZnVuY3Rpb24gU3F1YXJlKHByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzcXVhcmVcIiBvbkNsaWNrPXtwcm9wcy5vbkNsaWNrfT5cbiAgICAgICAgICAgIHtwcm9wcy52YWx1ZX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUmVzdGFydEJ1dHRvbihwcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17cHJvcHMub25DbGlja30+XG4gICAgICAgICAgICBSZXBsYXkgP1xuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5jbGFzcyBCb2FyZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXJTcXVhcmUoaSkge1xuICAgICAgICByZXR1cm4gPFNxdWFyZVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuc3F1YXJlc1tpXX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25DbGljayhpKX1cbiAgICAgICAgLz47XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvYXJkLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoMCl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgxKX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgzKX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDQpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2FyZC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDYpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNyl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg4KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgR2FtZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgIHNxdWFyZXM6IEFycmF5KDkpLmZpbGwobnVsbCksXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6MCxcbiAgICAgICAgICAgIHBsYXllcjogJ1gnLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKGkpIHtcbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuc3RhdGUuaGlzdG9yeS5zbGljZSgwLCB0aGlzLnN0YXRlLnN0ZXBOdW1iZXIgKyAxKTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXTtcblxuICAgICAgICBjb25zdCBzcXVhcmVzID0gY3VycmVudC5zcXVhcmVzLnNsaWNlKCk7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZVdpbm5lcihzcXVhcmVzKSB8fCBzcXVhcmVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3F1YXJlc1tpXSA9IHRoaXMuc3RhdGUucGxheWVyO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9ICh0aGlzLnN0YXRlLnBsYXllciA9PT0gJ1gnKT8nTyc6J1gnO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IGhpc3RvcnkuY29uY2F0KFt7XG4gICAgICAgICAgICAgICAgICAgIHNxdWFyZXM6IHNxdWFyZXMsXG4gICAgICAgICAgICAgICAgfV0pLFxuICAgICAgICAgICAgc3RlcE51bWJlcjpoaXN0b3J5Lmxlbmd0aCxcbiAgICAgICAgICAgIHBsYXllcjpwbGF5ZXJ9KTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVXaW5uZXIoc3F1YXJlcykge1xuICAgICAgICBjb25zdCBsaW5lcyA9IFtcbiAgICAgICAgICAgIFswLCAxLCAyXSxcbiAgICAgICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgICAgIFs2LCA3LCA4XSxcbiAgICAgICAgICAgIFswLCAzLCA2XSxcbiAgICAgICAgICAgIFsxLCA0LCA3XSxcbiAgICAgICAgICAgIFsyLCA1LCA4XSxcbiAgICAgICAgICAgIFswLCA0LCA4XSxcbiAgICAgICAgICAgIFsyLCA0LCA2XSxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgW2EsIGIsIGNdID0gbGluZXNbaV07XG4gICAgICAgICAgICBpZiAoc3F1YXJlc1thXSAmJiBzcXVhcmVzW2FdID09PSBzcXVhcmVzW2JdICYmIHNxdWFyZXNbYV0gPT09IHNxdWFyZXNbY10pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3F1YXJlc1thXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBqdW1wVG8oc3RlcCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6IHN0ZXAsXG4gICAgICAgICAgICBwbGF5ZXI6ICgoc3RlcCAlIDIpID09PSAwKT8nWCc6J08nLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXN0YXJ0R2FtZSgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc3RhcnRcIik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaGlzdG9yeTogW3tcbiAgICAgICAgICAgICAgICBzcXVhcmVzOiBBcnJheSg5KS5maWxsKG51bGwpLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBzdGVwTnVtYmVyOjAsXG4gICAgICAgICAgICBwbGF5ZXI6ICdYJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLnN0YXRlLmhpc3Rvcnk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBoaXN0b3J5W3RoaXMuc3RhdGUuc3RlcE51bWJlcl07XG4gICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuY2FsY3VsYXRlV2lubmVyKGN1cnJlbnQuc3F1YXJlcyk7XG5cbiAgICAgICAgY29uc3QgbW92ZXMgPSBoaXN0b3J5Lm1hcCgoc3RlcCwgbW92ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVzYyA9IG1vdmUgP1xuICAgICAgICAgICAgICAgICdHbyB0byBtb3ZlICMnICsgbW92ZSA6XG4gICAgICAgICAgICAgICAgJ0dvIHRvIGdhbWUgc3RhcnQnO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXttb3ZlfT5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLmp1bXBUbyhtb3ZlKX0+e2Rlc2N9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICBsZXQgc3RhdHVzO1xuICAgICAgICBpZiAod2lubmVyKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnV2lubmVyOiAnICsgd2lubmVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gJ05leHQgcGxheWVyOiAnICsgdGhpcy5zdGF0ZS5wbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0dXNcIj57c3RhdHVzfTwvZGl2PlxuICAgICAgICB7KHdpbm5lcik/PFJlc3RhcnRCdXR0b24gb25DbGljaz17KCk9PnRoaXMucmVzdGFydEdhbWUoKX0vPjpudWxsfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWUtYm9hcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgPEJvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzPXtjdXJyZW50LnNxdWFyZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoaSkgPT4gdGhpcy5oYW5kbGVDbGljayhpKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWUtaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2Pnsgc3RhdHVzIH0geyh3aW5uZXIpPzxSZXN0YXJ0QnV0dG9uIG9uQ2xpY2s9eygpPT50aGlzLnJlc3RhcnRHYW1lKCl9Lz46bnVsbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPG9sPnttb3Zlc308L29sPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51UmVzdGF1cmFudCwgbnVsbCksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKSk7XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWUsIG51bGwpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykpO1xuXG5jb25zdCBwb3NpdGlvbiA9IFs0OC44NDUsIDIuMjldO1xuLy9pbXBvcnQgeyBNYXAsIE1hcmtlciwgUG9wdXAsIFRpbGVMYXllciB9IGZyb20gJ1JMJztcbi8vIGNvbnN0IG1hcDIgPSAoXG4vLyAgICAgPFJMLk1hcCBjZW50ZXI9e3Bvc2l0aW9ufSB6b29tPXsxM30+XG4vLyAgICAgICAgIDxSTC5UaWxlTGF5ZXJcbi8vICAgICAgICAgICAgIHVybD17XCJodHRwOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nXCJ9XG4vLyAgICAgICAgICAgICBhdHRyaWJ1dGlvbj17XCImY29weTsgPGEgaHJlZj0mcXVvdDtodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHQmcXVvdDs+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzXCJ9XG4vLyAgICAgICAgIC8+XG4vLyAgICAgICAgIDxSTC5NYXJrZXIgcG9zaXRpb249e3Bvc2l0aW9ufT5cbi8vICAgICAgICAgICAgIDxSTC5Qb3B1cD5BIHByZXR0eSBDU1MzIHBvcHVwLjxiciAvPkVhc2lseSBjdXN0b21pemFibGUuPC9STC5Qb3B1cD5cbi8vICAgICAgICAgPC9STC5NYXJrZXI+XG4vLyAgICAgPC9STC5NYXA+XG4vLyApO1xudmFyIE1hcCA9IFJMLk1hcDtcbnZhciBUaWxlTGF5ZXIgPSBSTC5UaWxlTGF5ZXI7XG52YXIgTWFya2VyID0gUkwuTWFya2VyO1xudmFyIFBvcHVwID0gUkwuUG9wdXA7XG5cbmxldCBpY29uU2l6ZSA9IDM1O1xuXG52YXIgbmFwb0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL25hcG9sZW9uMy4xYzA3MmJmYy5qcGVnJyxcbiAgICBzaGFkb3dVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL25hcG9sZW9uMy4xYzA3MmJmYy5qcGVnJyxcblxuICAgIGljb25TaXplOiAgICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHNpemUgb2YgdGhlIGljb25cbiAgICBzaGFkb3dTaXplOiAgIFswLCAwXSwgLy8gc2l6ZSBvZiB0aGUgc2hhZG93XG4gICAgaWNvbkFuY2hvcjogICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gcG9pbnQgb2YgdGhlIGljb24gd2hpY2ggd2lsbCBjb3JyZXNwb25kIHRvIG1hcmtlcidzIGxvY2F0aW9uXG4gICAgc2hhZG93QW5jaG9yOiBbNCwgNjJdLCAgLy8gdGhlIHNhbWUgZm9yIHRoZSBzaGFkb3dcbiAgICBwb3B1cEFuY2hvcjogIFstMywgLTMwXSAvLyBwb2ludCBmcm9tIHdoaWNoIHRoZSBwb3B1cCBzaG91bGQgb3BlbiByZWxhdGl2ZSB0byB0aGUgaWNvbkFuY2hvclxufSk7XG5cbnZhciBiaXNtYXJja0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2Jpc21hcmNrLmJhZGQxNTIxLmpwZWcnLFxuICAgIHNoYWRvd1VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvYmlzbWFyY2suYmFkZDE1MjEuanBlZycsXG5cbiAgICBpY29uU2l6ZTogICAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBzaXplIG9mIHRoZSBpY29uXG4gICAgc2hhZG93U2l6ZTogICBbMCwgMF0sIC8vIHNpemUgb2YgdGhlIHNoYWRvd1xuICAgIGljb25BbmNob3I6ICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHBvaW50IG9mIHRoZSBpY29uIHdoaWNoIHdpbGwgY29ycmVzcG9uZCB0byBtYXJrZXIncyBsb2NhdGlvblxuICAgIHNoYWRvd0FuY2hvcjogWzQsIDYyXSwgIC8vIHRoZSBzYW1lIGZvciB0aGUgc2hhZG93XG4gICAgcG9wdXBBbmNob3I6ICBbLTMsIC0zMF0gLy8gcG9pbnQgZnJvbSB3aGljaCB0aGUgcG9wdXAgc2hvdWxkIG9wZW4gcmVsYXRpdmUgdG8gdGhlIGljb25BbmNob3Jcbn0pO1xuXG52YXIgaHVnb0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2h1Z28uOTQ2NTkzNWMuanBlZycsXG4gICAgc2hhZG93VXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9odWdvLjk0NjU5MzVjLmpwZWcnLFxuXG4gICAgaWNvblNpemU6ICAgICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gc2l6ZSBvZiB0aGUgaWNvblxuICAgIHNoYWRvd1NpemU6ICAgWzAsIDBdLCAvLyBzaXplIG9mIHRoZSBzaGFkb3dcbiAgICBpY29uQW5jaG9yOiAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBwb2ludCBvZiB0aGUgaWNvbiB3aGljaCB3aWxsIGNvcnJlc3BvbmQgdG8gbWFya2VyJ3MgbG9jYXRpb25cbiAgICBzaGFkb3dBbmNob3I6IFs0LCA2Ml0sICAvLyB0aGUgc2FtZSBmb3IgdGhlIHNoYWRvd1xuICAgIHBvcHVwQW5jaG9yOiAgWy0zLCAtMzBdIC8vIHBvaW50IGZyb20gd2hpY2ggdGhlIHBvcHVwIHNob3VsZCBvcGVuIHJlbGF0aXZlIHRvIHRoZSBpY29uQW5jaG9yXG59KTtcblxubGV0IGljb25zID0gW2Jpc21hcmNrSWNvbixodWdvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbl07XG5cblxuXG5jbGFzcyBNeUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblNhdmUgPSBwcm9wcy5vblNhdmU7XG4gICAgICAgIHRoaXMub25EZWxldGUgPSBwcm9wcy5vbkRlbGV0ZTtcbiAgICAgICAgdGhpcy5vbkZpbmlzaCA9IHByb3BzLm9uRmluaXNoO1xuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge2NvbW1lbnQ6bnVsbH07XG4gICAgfVxuXG4gICAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLm9uU2F2ZSh7Y29tbWVudDp0aGlzLmlucHV0LmN1cnJlbnQudmFsdWV9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKXtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fSA+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ9XCJyZXF1aXJlZFwiIHJlZj17dGhpcy5pbnB1dH0gc2l6ZT1cIjYwXCIgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPkVucmVnaXN0cmVyPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGEgbmFtZT1cImRlbGV0ZVwiIGNsYXNzPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5vbkRlbGV0ZX0+U3VwcHJpbWVyPC9hPlxuICAgICAgICAgICAgICAgIDxhIG5hbWU9XCJmaW5pc2hcIiBjbGFzcz1cImJ0blwiIG9uQ2xpY2s9e3RoaXMub25GaW5pc2h9PkZpbmlyPC9hPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgTXlQb3B1cCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCl7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxQb3B1cCB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubXNnfVxuICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5maW5pc2hlZCA/XG4gICAgICAgICAgICAgICAgICAgIDxNeUZvcm0gey4uLnRoaXMucHJvcHN9Lz5cbiAgICAgICAgICAgICAgICA6bnVsbH1cbiAgICAgICAgICAgIDwvUG9wdXA+XG4gICAgICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFNpbXBsZUV4YW1wbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbGF0OiA1MS41MDUsXG4gICAgICAgICAgICBsbmc6IC0wLjA5LFxuICAgICAgICAgICAgem9vbTogNixcbiAgICAgICAgICAgIHBpbnM6W10sXG4gICAgICAgICAgICBsb2FkaW5nOjBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICAgICAgaGIudXRpbC5zZXJ2ZXIuZ2V0KCdyZXNvdXJjZUdlb21ldHJ5Jyx7bWluaW1hbDp0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNlcHRpb24gY2xpZW50XCIpO1xuICAgICAgICAgICAgICAgIGRhdGEucm93cy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLm9uUGluUmVjZXB0aW9uKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcGluczpkYXRhLnJvd3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZU9uRGVsZXRlUGluKGtleSl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGlucy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSBrZXkpO1xuICAgICAgICAgICAgcGlucy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW5zKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHBpbnM6cGluc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVPblNhdmVQaW4oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihmb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1EYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHBpbnMuZmluZEluZGV4KHggPT4geC5pZCA9PT0ga2V5KTtcbiAgICAgICAgICAgICAgICBsZXQgcGluID0gcGluc1tpbmRleF07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGluKTtcblxuICAgICAgICAgICAgICAgIGhiLnV0aWwuc2VydmVyLnBvc3QoJ3Jlc291cmNlR2VvbWV0cnknLHttaW5pbWFsOnRydWV9LHBpbixmb3JtRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVjZXB0aW9uIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGluc1tpbmRleF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyppZihpbmRleCAhPT0gZGF0YS5pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlucy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGluc1tkYXRhLmlkXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpbnNbaW5kZXhdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGlucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaW5zOnBpbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVPbkZpbmlzaFBpbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIHBpbnMuZmluZCh4ID0+IHguaWQgPT09IGtleSkuZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGluczpwaW5zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrT25NYXAoZXZlbnQpe1xuICAgICAgICBsZXQgbGF0bG5nID0gZXZlbnQubGF0bG5nO1xuXG4gICAgICAgIGhiLnV0aWwuc2VydmVyLmdldE5ldygncmVzb3VyY2VHZW9tZXRyeScpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+e1xuICAgICAgICAgICAgICAgIGRhdGEudGFyZ2V0R2VvbWV0cnkgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhLnRhcmdldEdlb21ldHJ5LnZhbHVlID0ge3R5cGU6XCJQb2ludFwiLGNvb3JkaW5hdGVzOltsYXRsbmcubGF0LGxhdGxuZy5sbmddfTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGluUmVjZXB0aW9uKGRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpbnM6cGlucy5jb25jYXQoW2RhdGFdKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25QaW5SZWNlcHRpb24oZGF0YSl7XG4gICAgICAgIGRhdGEuZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgZGF0YS5tYXJrZXIgPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBwaW4gPSBwaW5zLmZpbmQoeCA9PiB4LmlkID09PSBrZXkpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW4pO1xuXG4gICAgICAgICAgICBpZighcGluLm1hcmtlciB8fCAhcGluLm1hcmtlci5jdXJyZW50IHx8ICFwaW4ubWFya2VyLmN1cnJlbnQubGVhZmxldEVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsbmcgfSA9IHBpbi5tYXJrZXIuY3VycmVudC5sZWFmbGV0RWxlbWVudC5nZXRMYXRMbmcoKTtcblxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgcGluLnRhcmdldEdlb21ldHJ5LnZhbHVlLmNvb3JkaW5hdGVzID0gW2xhdCxsbmddO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGlucy5tYXAocGluID0+IHtyZXR1cm4ge2lkOnBpbi5pZCxjb29yZHM6cGluLnRhcmdldEdlb21ldHJ5LnZhbHVlLmNvb3JkaW5hdGVzfTt9KSk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBwaW5zOiBwaW5zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gW3RoaXMuc3RhdGUubGF0LCB0aGlzLnN0YXRlLmxuZ107XG5cbiAgICAgICAgY29uc3QgcGlucyA9IHRoaXMuc3RhdGUucGlucztcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgICAgY29uc3QgbWFya2VycyA9IHBpbnMubWFwKHBpbiA9PiB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TWFya2VyIGtleT17cGluLmlkfSBpY29uPXtpY29uc1tpbmRleF19XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbj17W3Bpbi5nZXRQb2ludExhdCgpLHBpbi5nZXRQb2ludExuZygpXX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ2VuZD17dGhpcy51cGRhdGVQb3NpdGlvbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWY9e3Bpbi5tYXJrZXJ9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8TXlQb3B1cCBhdXRvQ2xvc2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU9uQ2xpY2s9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2c9e3Bpbi5jb21tZW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZD17cGluLmZpbmlzaGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRlbGV0ZT17dGhpcy5oYW5kbGVPbkRlbGV0ZVBpbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17dGhpcy5oYW5kbGVPblNhdmVQaW4ocGluLmlkKS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmlzaD17dGhpcy5oYW5kbGVPbkZpbmlzaFBpbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIHsvKjxQb3B1cCBhdXRvQ2xvc2U9e2ZhbHNlfSBjbG9zZU9uQ2xpY2s9e2ZhbHNlfT4qL31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKntwaW4ubXNnfSovfVxuICAgICAgICAgICAgICAgICAgICB7Lyo8L1BvcHVwPiovfVxuICAgICAgICAgICAgICAgIDwvTWFya2VyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TWFwIGNlbnRlcj17cG9zaXRpb259IHpvb209e3RoaXMuc3RhdGUuem9vbX0gb25DbGljaz17KGV2ZW50KT0+e3RoaXMuaGFuZGxlQ2xpY2tPbk1hcChldmVudCl9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUxheWVyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uPScmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICAgICAgICAgICAgICAgICAgdXJsPSdodHRwOi8ve3N9LnRpbGUub3NtLm9yZy97en0ve3h9L3t5fS5wbmcnXG4gICAgICAgICAgICAgICAgICAgIG1pblpvb209ezB9XG4gICAgICAgICAgICAgICAgICAgIG1heFpvb209ezMyfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFRpbGVMYXllclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbj0nJ1xuICAgICAgICAgICAgICAgICAgICB1cmw9J2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC90aWxlcy97en0ve3h9L3t5fS5wbmcnXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk9ezAuODV9XG4gICAgICAgICAgICAgICAgICAgIG1pblpvb209ezB9XG4gICAgICAgICAgICAgICAgICAgIG1heFpvb209ezh9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7bWFya2Vyc31cbiAgICAgICAgICAgIDwvTWFwPlxuICAgICAgICApO1xuICAgIH1cbn1cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFNpbXBsZUV4YW1wbGUsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwMicpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanMvdGVzdC1yZWFjdC5qc3giXSwic291cmNlUm9vdCI6IiJ9