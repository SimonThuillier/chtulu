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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/*! no static exports found */
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

var resourceGeometry = {
  getPointCoords: function getPointCoords() {
    if (typeof this.targetGeometry === 'undefined' || typeof this.targetGeometry.value === 'undefined' || typeof this.targetGeometry.value.type === 'undefined' || this.targetGeometry.value.type !== 'Point') return [0, 0];
    return this.targetGeometry.value.coordinates;
  },
  getPointLat: function getPointLat() {
    return this.getPointCoords()[0];
  },
  getPointLng: function getPointLng() {
    return this.getPointCoords()[1];
  }
};

var getIdGenerator = function getIdGenerator() {
  var begin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var id = begin;
  return function () {
    var toReturn = id;
    id = id + step;
    return toReturn;
  };
};

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
      loading: 0,
      idGenerator: getIdGenerator(0, -1)
    };
    return _this7;
  }

  _createClass(SimpleExample, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      /*hb.util.server.get('resourceGeometry',{minimal:true})
          .then(data =>{
              console.log("reception client");
              data.rows.forEach((item) => this.onPinReception(item));
              console.log(data);
              this.setState({
                  pins:data.rows
              });
          });*/
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
        console.log(formData);
        console.log(key);
        var pins = this.state.pins.slice(0, this.state.pins.length);
        var index = pins.findIndex(function (x) {
          return x.id === key;
        });
        var pin = pins[index];
        console.log(pin);
        /*hb.util.server.post('resourceGeometry',{minimal:true},pin,formData)
            .then(data =>{
                console.log("reception client");
                console.log(data);
                pins[index] = data;
                /*if(index !== data.id){
                    pins.splice(index,1);
                    pins[data.id] = data;
                }
                else{
                    pins[index] = data;
                }
                console.log(pins);
                this.setState({
                    pins:pins
                });
            });*/
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
      var latlng = event.latlng;
      var data = {
        id: this.state.idGenerator(),
        targetGeometry: {
          value: {
            type: "Point",
            coordinates: [latlng.lat, latlng.lng]
          }
        }
      };
      Object.setPrototypeOf(data, resourceGeometry);
      this.onPinReception(data);
      var pins = this.state.pins.slice(0, this.state.pins.length);
      console.log(data);
      this.setState({
        pins: pins.concat([data])
      });
      /*hb.util.server.getNew('resourceGeometry',targetGeometry = {},)
          .then(data =>{
              data.targetGeometry = {};
              data.targetGeometry.value = {type:"Point",coordinates:[latlng.lat,latlng.lng]};
           });*/
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
      var _this8 = this;

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
          onDragend: _this8.updatePosition(pin.id).bind(_this8),
          ref: pin.marker
        }, React.createElement(MyPopup, {
          autoClose: false,
          closeOnClick: false,
          msg: pin.comment,
          finished: pin.finished,
          onDelete: _this8.handleOnDeletePin(pin.id).bind(_this8),
          key: index,
          onSave: _this8.handleOnSavePin(pin.id).bind(_this8),
          onFinish: _this8.handleOnFinishPin(pin.id).bind(_this8)
        }));
      });
      return React.createElement(Map, {
        center: position,
        zoom: this.state.zoom,
        onClick: function onClick(event) {
          _this8.handleClickOnMap(event);
        }
      }, React.createElement(TileLayer, {
        attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        minZoom: 0,
        maxZoom: 32
      }), markers);
    }
  }]);

  return SimpleExample;
}(React.Component);

ReactDOM.render(React.createElement(SimpleExample, null), document.getElementById('map2'));

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4Il0sIm5hbWVzIjpbIk1lbnVSZXN0YXVyYW50IiwiZm9vZHMiLCJpZCIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsImZvb2RTZWxlY3RlZCIsImZvb2QiLCJzZXRTdGF0ZSIsInN0YXRlIiwibWFwIiwib25QbGF0Q2xpY2tlZCIsImJpbmQiLCJSZWFjdCIsIkNvbXBvbmVudCIsIlBsYXQiLCJwcm9wcyIsIm9uQ2xpY2siLCJvbkNsaWNrUGxhdCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwiYmFja2dyb3VuZENvbG9yIiwic2hvd0Rlc2NyaXB0aW9uIiwiU3F1YXJlIiwidmFsdWUiLCJSZXN0YXJ0QnV0dG9uIiwiQm9hcmQiLCJpIiwic3F1YXJlcyIsInJlbmRlclNxdWFyZSIsIkdhbWUiLCJoaXN0b3J5IiwiQXJyYXkiLCJmaWxsIiwic3RlcE51bWJlciIsInBsYXllciIsInNsaWNlIiwiY3VycmVudCIsImxlbmd0aCIsImNhbGN1bGF0ZVdpbm5lciIsImNvbmNhdCIsImxpbmVzIiwiYSIsImIiLCJjIiwic3RlcCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5uZXIiLCJtb3ZlcyIsIm1vdmUiLCJkZXNjIiwianVtcFRvIiwic3RhdHVzIiwicmVzdGFydEdhbWUiLCJoYW5kbGVDbGljayIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwb3NpdGlvbiIsIk1hcCIsIlJMIiwiVGlsZUxheWVyIiwiTWFya2VyIiwiUG9wdXAiLCJpY29uU2l6ZSIsIm5hcG9JY29uIiwiTCIsImljb24iLCJpY29uVXJsIiwic2hhZG93VXJsIiwic2hhZG93U2l6ZSIsImljb25BbmNob3IiLCJzaGFkb3dBbmNob3IiLCJwb3B1cEFuY2hvciIsImJpc21hcmNrSWNvbiIsImh1Z29JY29uIiwiaWNvbnMiLCJNeUZvcm0iLCJoYW5kbGVTdWJtaXQiLCJvblNhdmUiLCJvbkRlbGV0ZSIsIm9uRmluaXNoIiwiaW5wdXQiLCJjcmVhdGVSZWYiLCJkYXRhIiwiY29tbWVudCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJNeVBvcHVwIiwibXNnIiwiZmluaXNoZWQiLCJyZXNvdXJjZUdlb21ldHJ5IiwiZ2V0UG9pbnRDb29yZHMiLCJ0YXJnZXRHZW9tZXRyeSIsInR5cGUiLCJjb29yZGluYXRlcyIsImdldFBvaW50TGF0IiwiZ2V0UG9pbnRMbmciLCJnZXRJZEdlbmVyYXRvciIsImJlZ2luIiwidG9SZXR1cm4iLCJTaW1wbGVFeGFtcGxlIiwibGF0IiwibG5nIiwiem9vbSIsInBpbnMiLCJsb2FkaW5nIiwiaWRHZW5lcmF0b3IiLCJrZXkiLCJpbmRleCIsImZpbmRJbmRleCIsIngiLCJzcGxpY2UiLCJmb3JtRGF0YSIsInBpbiIsImZpbmQiLCJsYXRsbmciLCJPYmplY3QiLCJzZXRQcm90b3R5cGVPZiIsIm9uUGluUmVjZXB0aW9uIiwibWFya2VyIiwibGVhZmxldEVsZW1lbnQiLCJnZXRMYXRMbmciLCJjb29yZHMiLCJtYXJrZXJzIiwidXBkYXRlUG9zaXRpb24iLCJoYW5kbGVPbkRlbGV0ZVBpbiIsImhhbmRsZU9uU2F2ZVBpbiIsImhhbmRsZU9uRmluaXNoUGluIiwiaGFuZGxlQ2xpY2tPbk1hcCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNB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O0FBQUssY0FBTSxFQUFFaUQsUUFBYjtBQUF1QixZQUFJLEVBQUUsS0FBS3BELEtBQUwsQ0FBV21HLElBQXhDO0FBQThDLGVBQU8sRUFBRSxpQkFBQ25CLEtBQUQsRUFBUztBQUFDLGdCQUFJLENBQUM0QyxnQkFBTCxDQUFzQjVDLEtBQXRCO0FBQTZCO0FBQTlGLFNBQ0ksb0JBQUMsU0FBRDtBQUNJLG1CQUFXLEVBQUMsMEVBRGhCO0FBRUksV0FBRyxFQUFDLHlDQUZSO0FBR0ksZUFBTyxFQUFFLENBSGI7QUFJSSxlQUFPLEVBQUU7QUFKYixRQURKLEVBY0t1QyxPQWRMLENBREo7QUFrQkg7Ozs7RUFqTHVCbkgsS0FBSyxDQUFDQyxTOztBQW1MbEMwQyxRQUFRLENBQUNDLE1BQVQsQ0FBZ0I1QyxLQUFLLENBQUM2QyxhQUFOLENBQW9CK0MsYUFBcEIsRUFBbUMsSUFBbkMsQ0FBaEIsRUFBMEQ5QyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBMUQsRSIsImZpbGUiOiJ0ZXN0LXJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVpbGQvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4XCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIE1lbnVSZXN0YXVyYW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHN0YXRlID0ge1xuICAgICAgICBmb29kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiUGl6emEg8J+NlVwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlVuZSBiZWxsZSBtYXJnYXJpdGhhICFcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkJsYW5xdWV0dGUgZGUgdmVhdVwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkxlcyBwbGF0cyDDoCBiYXNlIGRlIHZpYW5kZSBzb250LWlscyBkZSBxdWFsaXTDqSA/XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJNYWtpIPCfjZlcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBdm9jYXQgZXQgc2F1bW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJTYW5kd2lzaCDwn6WqXCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVsOpZ8OpIHDDonTDqSBhdXggdG9tYXRlc1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGZvb2RTZWxlY3RlZDotMVxuICAgIH1cblxuICAgIG9uUGxhdENsaWNrZWQoZm9vZCl7XG4gICAgICAgIC8vYWxlcnQoZm9vZC5kZXNjcmlwdGlvbik7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb29kU2VsZWN0ZWQ6IGZvb2QuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuXG4gICAgLy8gIFVuZSBmb25jdGlvbiBcInJlbmRlclwiIHF1aSByZXRvdXJuZSBsYSBzdHJ1Y3R1cmUgw6AgYWZmaWNoZXIgw6AgbCd1dGlsaXNhdGV1clxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgLy8gRGFucyBsZSByZXR1cm4sIG9uIHBldXQgw6ljcmlyZSBkZSBsJ0hUTUwgb3UgcsOpZsOpcmVuY2VyIHVuIGF1dHJlIENvbXBvc2FudFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBCaWVudmVudWUsIHZvaWNpIG5vdHJlIGNhcnRlIChjb29sICkgOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mb29kcy5tYXAoKGZvb2QpID0+IDxQbGF0XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93RGVzY3JpcHRpb249e3RoaXMuc3RhdGUuZm9vZFNlbGVjdGVkPT1mb29kLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9vZD17Zm9vZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25QbGF0Q2xpY2tlZC5iaW5kKHRoaXMpfS8+KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgUGxhdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBvbkNsaWNrUGxhdCgpIHtcbiAgICAgICAgLy8gT24gcGV1dCBmYWNpbGVtZW50IGltcGzDqW1lbnRlciBub3RyZSBmb25jdGlvblxuICAgICAgICAvLyBPbiByZcOnb2l0IHVuZSB2YXJpYWJsZSBcIm9uQ2xpY2tcIiBkYW5zIG5vdHJlIFwicHJvcHNcIlxuXG4gICAgICAgIC8vIFNpIG9uIGEgdW5lIHByb3BzIFwib25DbGlja1wiLCBhbG9ycy4uLlxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICAgICAgICAvLyBPbiBkw6ljbGVuY2hlciBsYSBmb25jdGlvbiBcIm9uQ2xpY2tcIiBlbiBkb25uYW50IGVuIHBhcmFtw6h0cmUgbCdpZCBkdSBwbGF0XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy5mb29kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja1BsYXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiBcIjUlXCIsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5zaG93RGVzY3JpcHRpb24gPyBcInJnYigyMjUsIDIyNSwgMjI1KVwiIDogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZm9vZC5uYW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zaG93RGVzY3JpcHRpb24gP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj48Yj57dGhpcy5wcm9wcy5mb29kLmRlc2NyaXB0aW9ufTwvYj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbi8vIHR1dG8gcmVhY3RcblxuZnVuY3Rpb24gU3F1YXJlKHByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzcXVhcmVcIiBvbkNsaWNrPXtwcm9wcy5vbkNsaWNrfT5cbiAgICAgICAgICAgIHtwcm9wcy52YWx1ZX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUmVzdGFydEJ1dHRvbihwcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17cHJvcHMub25DbGlja30+XG4gICAgICAgICAgICBSZXBsYXkgP1xuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5jbGFzcyBCb2FyZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXJTcXVhcmUoaSkge1xuICAgICAgICByZXR1cm4gPFNxdWFyZVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuc3F1YXJlc1tpXX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25DbGljayhpKX1cbiAgICAgICAgLz47XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvYXJkLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoMCl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgxKX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgzKX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDQpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2FyZC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDYpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNyl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg4KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgR2FtZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgIHNxdWFyZXM6IEFycmF5KDkpLmZpbGwobnVsbCksXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6MCxcbiAgICAgICAgICAgIHBsYXllcjogJ1gnLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKGkpIHtcbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuc3RhdGUuaGlzdG9yeS5zbGljZSgwLCB0aGlzLnN0YXRlLnN0ZXBOdW1iZXIgKyAxKTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXTtcblxuICAgICAgICBjb25zdCBzcXVhcmVzID0gY3VycmVudC5zcXVhcmVzLnNsaWNlKCk7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZVdpbm5lcihzcXVhcmVzKSB8fCBzcXVhcmVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3F1YXJlc1tpXSA9IHRoaXMuc3RhdGUucGxheWVyO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9ICh0aGlzLnN0YXRlLnBsYXllciA9PT0gJ1gnKT8nTyc6J1gnO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IGhpc3RvcnkuY29uY2F0KFt7XG4gICAgICAgICAgICAgICAgc3F1YXJlczogc3F1YXJlcyxcbiAgICAgICAgICAgIH1dKSxcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6aGlzdG9yeS5sZW5ndGgsXG4gICAgICAgICAgICBwbGF5ZXI6cGxheWVyfSk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlV2lubmVyKHNxdWFyZXMpIHtcbiAgICAgICAgY29uc3QgbGluZXMgPSBbXG4gICAgICAgICAgICBbMCwgMSwgMl0sXG4gICAgICAgICAgICBbMywgNCwgNV0sXG4gICAgICAgICAgICBbNiwgNywgOF0sXG4gICAgICAgICAgICBbMCwgMywgNl0sXG4gICAgICAgICAgICBbMSwgNCwgN10sXG4gICAgICAgICAgICBbMiwgNSwgOF0sXG4gICAgICAgICAgICBbMCwgNCwgOF0sXG4gICAgICAgICAgICBbMiwgNCwgNl0sXG4gICAgICAgIF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IFthLCBiLCBjXSA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKHNxdWFyZXNbYV0gJiYgc3F1YXJlc1thXSA9PT0gc3F1YXJlc1tiXSAmJiBzcXVhcmVzW2FdID09PSBzcXVhcmVzW2NdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNxdWFyZXNbYV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAganVtcFRvKHN0ZXApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGVwTnVtYmVyOiBzdGVwLFxuICAgICAgICAgICAgcGxheWVyOiAoKHN0ZXAgJSAyKSA9PT0gMCk/J1gnOidPJyxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzdGFydEdhbWUoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXN0YXJ0XCIpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IFt7XG4gICAgICAgICAgICAgICAgc3F1YXJlczogQXJyYXkoOSkuZmlsbChudWxsKSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgc3RlcE51bWJlcjowLFxuICAgICAgICAgICAgcGxheWVyOiAnWCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5zdGF0ZS5oaXN0b3J5O1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gaGlzdG9yeVt0aGlzLnN0YXRlLnN0ZXBOdW1iZXJdO1xuICAgICAgICBjb25zdCB3aW5uZXIgPSB0aGlzLmNhbGN1bGF0ZVdpbm5lcihjdXJyZW50LnNxdWFyZXMpO1xuXG4gICAgICAgIGNvbnN0IG1vdmVzID0gaGlzdG9yeS5tYXAoKHN0ZXAsIG1vdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2MgPSBtb3ZlID9cbiAgICAgICAgICAgICAgICAnR28gdG8gbW92ZSAjJyArIG1vdmUgOlxuICAgICAgICAgICAgICAgICdHbyB0byBnYW1lIHN0YXJ0JztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxpIGtleT17bW92ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdGhpcy5qdW1wVG8obW92ZSl9PntkZXNjfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgbGV0IHN0YXR1cztcbiAgICAgICAgaWYgKHdpbm5lcikge1xuICAgICAgICAgICAgc3RhdHVzID0gJ1dpbm5lcjogJyArIHdpbm5lcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdOZXh0IHBsYXllcjogJyArIHRoaXMuc3RhdGUucGxheWVyO1xuICAgICAgICB9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhdHVzXCI+e3N0YXR1c308L2Rpdj5cbiAgICAgICAgeyh3aW5uZXIpPzxSZXN0YXJ0QnV0dG9uIG9uQ2xpY2s9eygpPT50aGlzLnJlc3RhcnRHYW1lKCl9Lz46bnVsbH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnYW1lXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnYW1lLWJvYXJkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxCb2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlcz17Y3VycmVudC5zcXVhcmVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGkpID0+IHRoaXMuaGFuZGxlQ2xpY2soaSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnYW1lLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj57IHN0YXR1cyB9IHsod2lubmVyKT88UmVzdGFydEJ1dHRvbiBvbkNsaWNrPXsoKT0+dGhpcy5yZXN0YXJ0R2FtZSgpfS8+Om51bGx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxvbD57bW92ZXN9PC9vbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudVJlc3RhdXJhbnQsIG51bGwpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51JykpO1xuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHYW1lLCBudWxsKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpKTtcblxuY29uc3QgcG9zaXRpb24gPSBbNDguODQ1LCAyLjI5XTtcbi8vaW1wb3J0IHsgTWFwLCBNYXJrZXIsIFBvcHVwLCBUaWxlTGF5ZXIgfSBmcm9tICdSTCc7XG4vLyBjb25zdCBtYXAyID0gKFxuLy8gICAgIDxSTC5NYXAgY2VudGVyPXtwb3NpdGlvbn0gem9vbT17MTN9PlxuLy8gICAgICAgICA8UkwuVGlsZUxheWVyXG4vLyAgICAgICAgICAgICB1cmw9e1wiaHR0cDovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZ1wifVxuLy8gICAgICAgICAgICAgYXR0cmlidXRpb249e1wiJmNvcHk7IDxhIGhyZWY9JnF1b3Q7aHR0cDovL29zbS5vcmcvY29weXJpZ2h0JnF1b3Q7Pk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc1wifVxuLy8gICAgICAgICAvPlxuLy8gICAgICAgICA8UkwuTWFya2VyIHBvc2l0aW9uPXtwb3NpdGlvbn0+XG4vLyAgICAgICAgICAgICA8UkwuUG9wdXA+QSBwcmV0dHkgQ1NTMyBwb3B1cC48YnIgLz5FYXNpbHkgY3VzdG9taXphYmxlLjwvUkwuUG9wdXA+XG4vLyAgICAgICAgIDwvUkwuTWFya2VyPlxuLy8gICAgIDwvUkwuTWFwPlxuLy8gKTtcbnZhciBNYXAgPSBSTC5NYXA7XG52YXIgVGlsZUxheWVyID0gUkwuVGlsZUxheWVyO1xudmFyIE1hcmtlciA9IFJMLk1hcmtlcjtcbnZhciBQb3B1cCA9IFJMLlBvcHVwO1xuXG5sZXQgaWNvblNpemUgPSAzNTtcblxudmFyIG5hcG9JY29uID0gTC5pY29uKHtcbiAgICBpY29uVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9uYXBvbGVvbjMuMWMwNzJiZmMuanBlZycsXG4gICAgc2hhZG93VXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9uYXBvbGVvbjMuMWMwNzJiZmMuanBlZycsXG5cbiAgICBpY29uU2l6ZTogICAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBzaXplIG9mIHRoZSBpY29uXG4gICAgc2hhZG93U2l6ZTogICBbMCwgMF0sIC8vIHNpemUgb2YgdGhlIHNoYWRvd1xuICAgIGljb25BbmNob3I6ICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHBvaW50IG9mIHRoZSBpY29uIHdoaWNoIHdpbGwgY29ycmVzcG9uZCB0byBtYXJrZXIncyBsb2NhdGlvblxuICAgIHNoYWRvd0FuY2hvcjogWzQsIDYyXSwgIC8vIHRoZSBzYW1lIGZvciB0aGUgc2hhZG93XG4gICAgcG9wdXBBbmNob3I6ICBbLTMsIC0zMF0gLy8gcG9pbnQgZnJvbSB3aGljaCB0aGUgcG9wdXAgc2hvdWxkIG9wZW4gcmVsYXRpdmUgdG8gdGhlIGljb25BbmNob3Jcbn0pO1xuXG52YXIgYmlzbWFyY2tJY29uID0gTC5pY29uKHtcbiAgICBpY29uVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9iaXNtYXJjay5iYWRkMTUyMS5qcGVnJyxcbiAgICBzaGFkb3dVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2Jpc21hcmNrLmJhZGQxNTIxLmpwZWcnLFxuXG4gICAgaWNvblNpemU6ICAgICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gc2l6ZSBvZiB0aGUgaWNvblxuICAgIHNoYWRvd1NpemU6ICAgWzAsIDBdLCAvLyBzaXplIG9mIHRoZSBzaGFkb3dcbiAgICBpY29uQW5jaG9yOiAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBwb2ludCBvZiB0aGUgaWNvbiB3aGljaCB3aWxsIGNvcnJlc3BvbmQgdG8gbWFya2VyJ3MgbG9jYXRpb25cbiAgICBzaGFkb3dBbmNob3I6IFs0LCA2Ml0sICAvLyB0aGUgc2FtZSBmb3IgdGhlIHNoYWRvd1xuICAgIHBvcHVwQW5jaG9yOiAgWy0zLCAtMzBdIC8vIHBvaW50IGZyb20gd2hpY2ggdGhlIHBvcHVwIHNob3VsZCBvcGVuIHJlbGF0aXZlIHRvIHRoZSBpY29uQW5jaG9yXG59KTtcblxudmFyIGh1Z29JY29uID0gTC5pY29uKHtcbiAgICBpY29uVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9odWdvLjk0NjU5MzVjLmpwZWcnLFxuICAgIHNoYWRvd1VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvaHVnby45NDY1OTM1Yy5qcGVnJyxcblxuICAgIGljb25TaXplOiAgICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHNpemUgb2YgdGhlIGljb25cbiAgICBzaGFkb3dTaXplOiAgIFswLCAwXSwgLy8gc2l6ZSBvZiB0aGUgc2hhZG93XG4gICAgaWNvbkFuY2hvcjogICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gcG9pbnQgb2YgdGhlIGljb24gd2hpY2ggd2lsbCBjb3JyZXNwb25kIHRvIG1hcmtlcidzIGxvY2F0aW9uXG4gICAgc2hhZG93QW5jaG9yOiBbNCwgNjJdLCAgLy8gdGhlIHNhbWUgZm9yIHRoZSBzaGFkb3dcbiAgICBwb3B1cEFuY2hvcjogIFstMywgLTMwXSAvLyBwb2ludCBmcm9tIHdoaWNoIHRoZSBwb3B1cCBzaG91bGQgb3BlbiByZWxhdGl2ZSB0byB0aGUgaWNvbkFuY2hvclxufSk7XG5cbmxldCBpY29ucyA9IFtiaXNtYXJja0ljb24saHVnb0ljb24sbmFwb0ljb24sbmFwb0ljb24sbmFwb0ljb24sbmFwb0ljb24sbmFwb0ljb24sbmFwb0ljb25dO1xuXG5cblxuY2xhc3MgTXlGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25TYXZlID0gcHJvcHMub25TYXZlO1xuICAgICAgICB0aGlzLm9uRGVsZXRlID0gcHJvcHMub25EZWxldGU7XG4gICAgICAgIHRoaXMub25GaW5pc2ggPSBwcm9wcy5vbkZpbmlzaDtcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmlucHV0ID0gUmVhY3QuY3JlYXRlUmVmKCk7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtjb21tZW50Om51bGx9O1xuICAgIH1cblxuICAgIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5vblNhdmUoe2NvbW1lbnQ6dGhpcy5pbnB1dC5jdXJyZW50LnZhbHVlfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCl7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0gPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPVwicmVxdWlyZWRcIiByZWY9e3RoaXMuaW5wdXR9IHNpemU9XCI2MFwiIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj5FbnJlZ2lzdHJlcjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxhIG5hbWU9XCJkZWxldGVcIiBjbGFzcz1cImJ0biBidG4td2FybmluZ1wiIG9uQ2xpY2s9e3RoaXMub25EZWxldGV9PlN1cHByaW1lcjwvYT5cbiAgICAgICAgICAgICAgICA8YSBuYW1lPVwiZmluaXNoXCIgY2xhc3M9XCJidG5cIiBvbkNsaWNrPXt0aGlzLm9uRmluaXNofT5GaW5pcjwvYT5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNsYXNzIE15UG9wdXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpe1xuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8UG9wdXAgey4uLnRoaXMucHJvcHN9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm1zZ31cbiAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuZmluaXNoZWQgP1xuICAgICAgICAgICAgICAgICAgICA8TXlGb3JtIHsuLi50aGlzLnByb3BzfS8+XG4gICAgICAgICAgICAgICAgICAgIDpudWxsfVxuICAgICAgICAgICAgPC9Qb3B1cD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuY29uc3QgcmVzb3VyY2VHZW9tZXRyeSA9IHtcbiAgICBnZXRQb2ludENvb3Jkcygpe1xuICAgICAgICBpZih0eXBlb2YgdGhpcy50YXJnZXRHZW9tZXRyeSA9PT0ndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHRoaXMudGFyZ2V0R2VvbWV0cnkudmFsdWUgPT09J3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnRhcmdldEdlb21ldHJ5LnZhbHVlLnR5cGUgPT09J3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0R2VvbWV0cnkudmFsdWUudHlwZSAhPT0nUG9pbnQnKSByZXR1cm4gWzAsMF07XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldEdlb21ldHJ5LnZhbHVlLmNvb3JkaW5hdGVzO1xuICAgIH0sXG4gICAgZ2V0UG9pbnRMYXQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnRDb29yZHMoKVswXTtcbiAgICB9LFxuICAgIGdldFBvaW50TG5nKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50Q29vcmRzKClbMV07XG4gICAgfVxufTtcblxuY29uc3QgZ2V0SWRHZW5lcmF0b3IgPSAgZnVuY3Rpb24gKGJlZ2luPTAsc3RlcD0xKSB7XG4gICAgbGV0IGlkID0gYmVnaW47XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRvUmV0dXJuID0gaWQ7XG4gICAgICAgIGlkID0gaWQgKyBzdGVwO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfTtcbn07XG5cblxuXG5jbGFzcyBTaW1wbGVFeGFtcGxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGxhdDogNTEuNTA1LFxuICAgICAgICAgICAgbG5nOiAtMC4wOSxcbiAgICAgICAgICAgIHpvb206IDYsXG4gICAgICAgICAgICBwaW5zOltdLFxuICAgICAgICAgICAgbG9hZGluZzowLFxuICAgICAgICAgICAgaWRHZW5lcmF0b3IgOiBnZXRJZEdlbmVyYXRvcigwLC0xKVxuICAgICAgICB9O1xuICAgIH1cblxuXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgICAgICAvKmhiLnV0aWwuc2VydmVyLmdldCgncmVzb3VyY2VHZW9tZXRyeScse21pbmltYWw6dHJ1ZX0pXG4gICAgICAgICAgICAudGhlbihkYXRhID0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVjZXB0aW9uIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICBkYXRhLnJvd3MuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5vblBpblJlY2VwdGlvbihpdGVtKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpbnM6ZGF0YS5yb3dzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIGhhbmRsZU9uRGVsZXRlUGluKGtleSl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGlucy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSBrZXkpO1xuICAgICAgICAgICAgcGlucy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW5zKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHBpbnM6cGluc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVPblNhdmVQaW4oa2V5KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGZvcm1EYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgbGV0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwaW5zLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IGtleSk7XG4gICAgICAgICAgICBsZXQgcGluID0gcGluc1tpbmRleF07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW4pO1xuXG4gICAgICAgICAgICAvKmhiLnV0aWwuc2VydmVyLnBvc3QoJ3Jlc291cmNlR2VvbWV0cnknLHttaW5pbWFsOnRydWV9LHBpbixmb3JtRGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlY2VwdGlvbiBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwaW5zW2luZGV4XSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIC8qaWYoaW5kZXggIT09IGRhdGEuaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlucy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5zW2RhdGEuaWRdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgcGluc1tpbmRleF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbnM6cGluc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTsqL1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlT25GaW5pc2hQaW4oa2V5KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgICAgICBwaW5zLmZpbmQoeCA9PiB4LmlkID09PSBrZXkpLmZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHBpbnM6cGluc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGlja09uTWFwKGV2ZW50KXtcbiAgICAgICAgbGV0IGxhdGxuZyA9IGV2ZW50LmxhdGxuZztcblxuICAgICAgICBsZXQgZGF0YSA9IHtpZDp0aGlzLnN0YXRlLmlkR2VuZXJhdG9yKCksXG4gICAgICAgICAgICB0YXJnZXRHZW9tZXRyeTp7dmFsdWU6e3R5cGU6XCJQb2ludFwiLGNvb3JkaW5hdGVzOltsYXRsbmcubGF0LGxhdGxuZy5sbmddfX19O1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZGF0YSxyZXNvdXJjZUdlb21ldHJ5KTtcblxuICAgICAgICB0aGlzLm9uUGluUmVjZXB0aW9uKGRhdGEpO1xuICAgICAgICBjb25zdCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwaW5zOnBpbnMuY29uY2F0KFtkYXRhXSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLypoYi51dGlsLnNlcnZlci5nZXROZXcoJ3Jlc291cmNlR2VvbWV0cnknLHRhcmdldEdlb21ldHJ5ID0ge30sKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PntcbiAgICAgICAgICAgICAgICBkYXRhLnRhcmdldEdlb21ldHJ5ID0ge307XG4gICAgICAgICAgICAgICAgZGF0YS50YXJnZXRHZW9tZXRyeS52YWx1ZSA9IHt0eXBlOlwiUG9pbnRcIixjb29yZGluYXRlczpbbGF0bG5nLmxhdCxsYXRsbmcubG5nXX07XG5cbiAgICAgICAgICAgIH0pOyovXG4gICAgfVxuXG4gICAgb25QaW5SZWNlcHRpb24oZGF0YSl7XG4gICAgICAgIGRhdGEuZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgZGF0YS5tYXJrZXIgPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBwaW4gPSBwaW5zLmZpbmQoeCA9PiB4LmlkID09PSBrZXkpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW4pO1xuXG4gICAgICAgICAgICBpZighcGluLm1hcmtlciB8fCAhcGluLm1hcmtlci5jdXJyZW50IHx8ICFwaW4ubWFya2VyLmN1cnJlbnQubGVhZmxldEVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsbmcgfSA9IHBpbi5tYXJrZXIuY3VycmVudC5sZWFmbGV0RWxlbWVudC5nZXRMYXRMbmcoKTtcblxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgcGluLnRhcmdldEdlb21ldHJ5LnZhbHVlLmNvb3JkaW5hdGVzID0gW2xhdCxsbmddO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGlucy5tYXAocGluID0+IHtyZXR1cm4ge2lkOnBpbi5pZCxjb29yZHM6cGluLnRhcmdldEdlb21ldHJ5LnZhbHVlLmNvb3JkaW5hdGVzfTt9KSk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBwaW5zOiBwaW5zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gW3RoaXMuc3RhdGUubGF0LCB0aGlzLnN0YXRlLmxuZ107XG5cbiAgICAgICAgY29uc3QgcGlucyA9IHRoaXMuc3RhdGUucGlucztcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgICAgY29uc3QgbWFya2VycyA9IHBpbnMubWFwKHBpbiA9PiB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TWFya2VyIGtleT17cGluLmlkfSBpY29uPXtpY29uc1tpbmRleF19XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbj17W3Bpbi5nZXRQb2ludExhdCgpLHBpbi5nZXRQb2ludExuZygpXX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ2VuZD17dGhpcy51cGRhdGVQb3NpdGlvbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWY9e3Bpbi5tYXJrZXJ9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8TXlQb3B1cCBhdXRvQ2xvc2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU9uQ2xpY2s9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2c9e3Bpbi5jb21tZW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZD17cGluLmZpbmlzaGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRlbGV0ZT17dGhpcy5oYW5kbGVPbkRlbGV0ZVBpbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17dGhpcy5oYW5kbGVPblNhdmVQaW4ocGluLmlkKS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmlzaD17dGhpcy5oYW5kbGVPbkZpbmlzaFBpbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIHsvKjxQb3B1cCBhdXRvQ2xvc2U9e2ZhbHNlfSBjbG9zZU9uQ2xpY2s9e2ZhbHNlfT4qL31cbiAgICAgICAgICAgICAgICAgICAgey8qe3Bpbi5tc2d9Ki99XG4gICAgICAgICAgICAgICAgICAgIHsvKjwvUG9wdXA+Ki99XG4gICAgICAgICAgICAgICAgPC9NYXJrZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxNYXAgY2VudGVyPXtwb3NpdGlvbn0gem9vbT17dGhpcy5zdGF0ZS56b29tfSBvbkNsaWNrPXsoZXZlbnQpPT57dGhpcy5oYW5kbGVDbGlja09uTWFwKGV2ZW50KX19PlxuICAgICAgICAgICAgICAgIDxUaWxlTGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb249JyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29zbS5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJ1xuICAgICAgICAgICAgICAgICAgICB1cmw9J2h0dHA6Ly97c30udGlsZS5vc20ub3JnL3t6fS97eH0ve3l9LnBuZydcbiAgICAgICAgICAgICAgICAgICAgbWluWm9vbT17MH1cbiAgICAgICAgICAgICAgICAgICAgbWF4Wm9vbT17MzJ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7Lyo8VGlsZUxheWVyKi99XG4gICAgICAgICAgICAgICAgICAgIHsvKmF0dHJpYnV0aW9uPScnKi99XG4gICAgICAgICAgICAgICAgICAgIHsvKnVybD0naHR0cDovL2xvY2FsaG9zdDo4MDAwL3RpbGVzL3t6fS97eH0ve3l9LnBuZycqL31cbiAgICAgICAgICAgICAgICAgICAgey8qb3BhY2l0eT17MC44NX0qL31cbiAgICAgICAgICAgICAgICAgICAgey8qbWluWm9vbT17MH0qL31cbiAgICAgICAgICAgICAgICAgICAgey8qbWF4Wm9vbT17OH0qL31cbiAgICAgICAgICAgICAgICB7LyovPiovfVxuICAgICAgICAgICAgICAgIHttYXJrZXJzfVxuICAgICAgICAgICAgPC9NYXA+XG4gICAgICAgICk7XG4gICAgfVxufVxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2ltcGxlRXhhbXBsZSwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAyJykpOyJdLCJzb3VyY2VSb290IjoiIn0=