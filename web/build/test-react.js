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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDExYTlhZjg4Y2FjYzk5MzE0NzEiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4Il0sIm5hbWVzIjpbIk1lbnVSZXN0YXVyYW50IiwiZm9vZHMiLCJpZCIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsImZvb2RTZWxlY3RlZCIsImZvb2QiLCJzZXRTdGF0ZSIsInN0YXRlIiwibWFwIiwib25QbGF0Q2xpY2tlZCIsImJpbmQiLCJSZWFjdCIsIkNvbXBvbmVudCIsIlBsYXQiLCJwcm9wcyIsIm9uQ2xpY2siLCJvbkNsaWNrUGxhdCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwiYmFja2dyb3VuZENvbG9yIiwic2hvd0Rlc2NyaXB0aW9uIiwiU3F1YXJlIiwidmFsdWUiLCJSZXN0YXJ0QnV0dG9uIiwiQm9hcmQiLCJpIiwic3F1YXJlcyIsInJlbmRlclNxdWFyZSIsIkdhbWUiLCJoaXN0b3J5IiwiQXJyYXkiLCJmaWxsIiwic3RlcE51bWJlciIsInBsYXllciIsInNsaWNlIiwiY3VycmVudCIsImxlbmd0aCIsImNhbGN1bGF0ZVdpbm5lciIsImNvbmNhdCIsImxpbmVzIiwiYSIsImIiLCJjIiwic3RlcCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5uZXIiLCJtb3ZlcyIsIm1vdmUiLCJkZXNjIiwianVtcFRvIiwic3RhdHVzIiwicmVzdGFydEdhbWUiLCJoYW5kbGVDbGljayIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwb3NpdGlvbiIsIk1hcCIsIlJMIiwiVGlsZUxheWVyIiwiTWFya2VyIiwiUG9wdXAiLCJpY29uU2l6ZSIsIm5hcG9JY29uIiwiTCIsImljb24iLCJpY29uVXJsIiwic2hhZG93VXJsIiwic2hhZG93U2l6ZSIsImljb25BbmNob3IiLCJzaGFkb3dBbmNob3IiLCJwb3B1cEFuY2hvciIsImJpc21hcmNrSWNvbiIsImh1Z29JY29uIiwiaWNvbnMiLCJNeUZvcm0iLCJoYW5kbGVTdWJtaXQiLCJvblNhdmUiLCJvbkRlbGV0ZSIsIm9uRmluaXNoIiwiaW5wdXQiLCJjcmVhdGVSZWYiLCJkYXRhIiwiY29tbWVudCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJNeVBvcHVwIiwibXNnIiwiZmluaXNoZWQiLCJyZXNvdXJjZUdlb21ldHJ5IiwiZ2V0UG9pbnRDb29yZHMiLCJ0YXJnZXRHZW9tZXRyeSIsInR5cGUiLCJjb29yZGluYXRlcyIsImdldFBvaW50TGF0IiwiZ2V0UG9pbnRMbmciLCJnZXRJZEdlbmVyYXRvciIsImJlZ2luIiwidG9SZXR1cm4iLCJTaW1wbGVFeGFtcGxlIiwibGF0IiwibG5nIiwiem9vbSIsInBpbnMiLCJsb2FkaW5nIiwiaWRHZW5lcmF0b3IiLCJrZXkiLCJpbmRleCIsImZpbmRJbmRleCIsIngiLCJzcGxpY2UiLCJmb3JtRGF0YSIsInBpbiIsImZpbmQiLCJsYXRsbmciLCJPYmplY3QiLCJzZXRQcm90b3R5cGVPZiIsIm9uUGluUmVjZXB0aW9uIiwibWFya2VyIiwibGVhZmxldEVsZW1lbnQiLCJnZXRMYXRMbmciLCJjb29yZHMiLCJtYXJrZXJzIiwidXBkYXRlUG9zaXRpb24iLCJoYW5kbGVPbkRlbGV0ZVBpbiIsImhhbmRsZU9uU2F2ZVBpbiIsImhhbmRsZU9uRmluaXNoUGluIiwiaGFuZGxlQ2xpY2tPbk1hcCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFD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QTlGLFNBQ0ksb0JBQUMsU0FBRDtBQUNJLG1CQUFXLEVBQUMsMEVBRGhCO0FBRUksV0FBRyxFQUFDLHlDQUZSO0FBR0ksZUFBTyxFQUFFLENBSGI7QUFJSSxlQUFPLEVBQUU7QUFKYixRQURKLEVBY0t1QyxPQWRMLENBREo7QUFrQkg7Ozs7RUFqTHVCbkgsS0FBSyxDQUFDQyxTOztBQW1MbEMwQyxRQUFRLENBQUNDLE1BQVQsQ0FBZ0I1QyxLQUFLLENBQUM2QyxhQUFOLENBQW9CK0MsYUFBcEIsRUFBbUMsSUFBbkMsQ0FBaEIsRUFBMEQ5QyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBMUQsRSIsImZpbGUiOiJ0ZXN0LXJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2J1aWxkL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hc3NldHMvanMvdGVzdC1yZWFjdC5qc3hcIik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDExYTlhZjg4Y2FjYzk5MzE0NzEiLCJcInVzZSBzdHJpY3RcIjtcblxuY2xhc3MgTWVudVJlc3RhdXJhbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgc3RhdGUgPSB7XG4gICAgICAgIGZvb2RzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJQaXp6YSDwn42VXCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVW5lIGJlbGxlIG1hcmdhcml0aGEgIVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiQmxhbnF1ZXR0ZSBkZSB2ZWF1XCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiTGVzIHBsYXRzIMOgIGJhc2UgZGUgdmlhbmRlIHNvbnQtaWxzIGRlIHF1YWxpdMOpID9cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICBuYW1lOiBcIk1ha2kg8J+NmVwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkF2b2NhdCBldCBzYXVtb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlNhbmR3aXNoIPCfpapcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJWw6lnw6kgcMOidMOpIGF1eCB0b21hdGVzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgZm9vZFNlbGVjdGVkOi0xXG4gICAgfVxuXG4gICAgb25QbGF0Q2xpY2tlZChmb29kKXtcbiAgICAgICAgLy9hbGVydChmb29kLmRlc2NyaXB0aW9uKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvb2RTZWxlY3RlZDogZm9vZC5pZFxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG5cbiAgICAvLyAgVW5lIGZvbmN0aW9uIFwicmVuZGVyXCIgcXVpIHJldG91cm5lIGxhIHN0cnVjdHVyZSDDoCBhZmZpY2hlciDDoCBsJ3V0aWxpc2F0ZXVyXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBEYW5zIGxlIHJldHVybiwgb24gcGV1dCDDqWNyaXJlIGRlIGwnSFRNTCBvdSByw6lmw6lyZW5jZXIgdW4gYXV0cmUgQ29tcG9zYW50XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIEJpZW52ZW51ZSwgdm9pY2kgbm90cmUgY2FydGUgKGNvb2wgKSA6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZvb2RzLm1hcCgoZm9vZCkgPT4gPFBsYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEZXNjcmlwdGlvbj17dGhpcy5zdGF0ZS5mb29kU2VsZWN0ZWQ9PWZvb2QuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb29kPXtmb29kfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vblBsYXRDbGlja2VkLmJpbmQodGhpcyl9Lz4pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBQbGF0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIG9uQ2xpY2tQbGF0KCkge1xuICAgICAgICAvLyBPbiBwZXV0IGZhY2lsZW1lbnQgaW1wbMOpbWVudGVyIG5vdHJlIGZvbmN0aW9uXG4gICAgICAgIC8vIE9uIHJlw6dvaXQgdW5lIHZhcmlhYmxlIFwib25DbGlja1wiIGRhbnMgbm90cmUgXCJwcm9wc1wiXG5cbiAgICAgICAgLy8gU2kgb24gYSB1bmUgcHJvcHMgXCJvbkNsaWNrXCIsIGFsb3JzLi4uXG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgICAgICAgIC8vIE9uIGTDqWNsZW5jaGVyIGxhIGZvbmN0aW9uIFwib25DbGlja1wiIGVuIGRvbm5hbnQgZW4gcGFyYW3DqHRyZSBsJ2lkIGR1IHBsYXRcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DbGljayh0aGlzLnByb3BzLmZvb2QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrUGxhdC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IFwiNSVcIixcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLnNob3dEZXNjcmlwdGlvbiA/IFwicmdiKDIyNSwgMjI1LCAyMjUpXCIgOiBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5mb29kLm5hbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNob3dEZXNjcmlwdGlvbiA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PjxiPnt0aGlzLnByb3BzLmZvb2QuZGVzY3JpcHRpb259PC9iPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuLy8gdHV0byByZWFjdFxuXG5mdW5jdGlvbiBTcXVhcmUocHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNxdWFyZVwiIG9uQ2xpY2s9e3Byb3BzLm9uQ2xpY2t9PlxuICAgICAgICAgICAge3Byb3BzLnZhbHVlfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBSZXN0YXJ0QnV0dG9uKHByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwcm9wcy5vbkNsaWNrfT5cbiAgICAgICAgICAgIFJlcGxheSA/XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmNsYXNzIEJvYXJkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlclNxdWFyZShpKSB7XG4gICAgICAgIHJldHVybiA8U3F1YXJlXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5zcXVhcmVzW2ldfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkNsaWNrKGkpfVxuICAgICAgICAvPjtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgwKX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDEpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoMil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2FyZC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDMpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNCl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg1KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvYXJkLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoNil9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg3KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IFt7XG4gICAgICAgICAgICAgICAgc3F1YXJlczogQXJyYXkoOSkuZmlsbChudWxsKSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgc3RlcE51bWJlcjowLFxuICAgICAgICAgICAgcGxheWVyOiAnWCcsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soaSkge1xuICAgICAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5zdGF0ZS5oaXN0b3J5LnNsaWNlKDAsIHRoaXMuc3RhdGUuc3RlcE51bWJlciArIDEpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGNvbnN0IHNxdWFyZXMgPSBjdXJyZW50LnNxdWFyZXMuc2xpY2UoKTtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlV2lubmVyKHNxdWFyZXMpIHx8IHNxdWFyZXNbaV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmVzW2ldID0gdGhpcy5zdGF0ZS5wbGF5ZXI7XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gKHRoaXMuc3RhdGUucGxheWVyID09PSAnWCcpPydPJzonWCc7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaGlzdG9yeTogaGlzdG9yeS5jb25jYXQoW3tcbiAgICAgICAgICAgICAgICBzcXVhcmVzOiBzcXVhcmVzLFxuICAgICAgICAgICAgfV0pLFxuICAgICAgICAgICAgc3RlcE51bWJlcjpoaXN0b3J5Lmxlbmd0aCxcbiAgICAgICAgICAgIHBsYXllcjpwbGF5ZXJ9KTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVXaW5uZXIoc3F1YXJlcykge1xuICAgICAgICBjb25zdCBsaW5lcyA9IFtcbiAgICAgICAgICAgIFswLCAxLCAyXSxcbiAgICAgICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgICAgIFs2LCA3LCA4XSxcbiAgICAgICAgICAgIFswLCAzLCA2XSxcbiAgICAgICAgICAgIFsxLCA0LCA3XSxcbiAgICAgICAgICAgIFsyLCA1LCA4XSxcbiAgICAgICAgICAgIFswLCA0LCA4XSxcbiAgICAgICAgICAgIFsyLCA0LCA2XSxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgW2EsIGIsIGNdID0gbGluZXNbaV07XG4gICAgICAgICAgICBpZiAoc3F1YXJlc1thXSAmJiBzcXVhcmVzW2FdID09PSBzcXVhcmVzW2JdICYmIHNxdWFyZXNbYV0gPT09IHNxdWFyZXNbY10pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3F1YXJlc1thXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBqdW1wVG8oc3RlcCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6IHN0ZXAsXG4gICAgICAgICAgICBwbGF5ZXI6ICgoc3RlcCAlIDIpID09PSAwKT8nWCc6J08nLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXN0YXJ0R2FtZSgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc3RhcnRcIik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaGlzdG9yeTogW3tcbiAgICAgICAgICAgICAgICBzcXVhcmVzOiBBcnJheSg5KS5maWxsKG51bGwpLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBzdGVwTnVtYmVyOjAsXG4gICAgICAgICAgICBwbGF5ZXI6ICdYJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLnN0YXRlLmhpc3Rvcnk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBoaXN0b3J5W3RoaXMuc3RhdGUuc3RlcE51bWJlcl07XG4gICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuY2FsY3VsYXRlV2lubmVyKGN1cnJlbnQuc3F1YXJlcyk7XG5cbiAgICAgICAgY29uc3QgbW92ZXMgPSBoaXN0b3J5Lm1hcCgoc3RlcCwgbW92ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVzYyA9IG1vdmUgP1xuICAgICAgICAgICAgICAgICdHbyB0byBtb3ZlICMnICsgbW92ZSA6XG4gICAgICAgICAgICAgICAgJ0dvIHRvIGdhbWUgc3RhcnQnO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXttb3ZlfT5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLmp1bXBUbyhtb3ZlKX0+e2Rlc2N9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICBsZXQgc3RhdHVzO1xuICAgICAgICBpZiAod2lubmVyKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnV2lubmVyOiAnICsgd2lubmVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gJ05leHQgcGxheWVyOiAnICsgdGhpcy5zdGF0ZS5wbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0dXNcIj57c3RhdHVzfTwvZGl2PlxuICAgICAgICB7KHdpbm5lcik/PFJlc3RhcnRCdXR0b24gb25DbGljaz17KCk9PnRoaXMucmVzdGFydEdhbWUoKX0vPjpudWxsfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWUtYm9hcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgPEJvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzPXtjdXJyZW50LnNxdWFyZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoaSkgPT4gdGhpcy5oYW5kbGVDbGljayhpKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbWUtaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2Pnsgc3RhdHVzIH0geyh3aW5uZXIpPzxSZXN0YXJ0QnV0dG9uIG9uQ2xpY2s9eygpPT50aGlzLnJlc3RhcnRHYW1lKCl9Lz46bnVsbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPG9sPnttb3Zlc308L29sPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51UmVzdGF1cmFudCwgbnVsbCksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKSk7XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWUsIG51bGwpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykpO1xuXG5jb25zdCBwb3NpdGlvbiA9IFs0OC44NDUsIDIuMjldO1xuLy9pbXBvcnQgeyBNYXAsIE1hcmtlciwgUG9wdXAsIFRpbGVMYXllciB9IGZyb20gJ1JMJztcbi8vIGNvbnN0IG1hcDIgPSAoXG4vLyAgICAgPFJMLk1hcCBjZW50ZXI9e3Bvc2l0aW9ufSB6b29tPXsxM30+XG4vLyAgICAgICAgIDxSTC5UaWxlTGF5ZXJcbi8vICAgICAgICAgICAgIHVybD17XCJodHRwOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nXCJ9XG4vLyAgICAgICAgICAgICBhdHRyaWJ1dGlvbj17XCImY29weTsgPGEgaHJlZj0mcXVvdDtodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHQmcXVvdDs+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzXCJ9XG4vLyAgICAgICAgIC8+XG4vLyAgICAgICAgIDxSTC5NYXJrZXIgcG9zaXRpb249e3Bvc2l0aW9ufT5cbi8vICAgICAgICAgICAgIDxSTC5Qb3B1cD5BIHByZXR0eSBDU1MzIHBvcHVwLjxiciAvPkVhc2lseSBjdXN0b21pemFibGUuPC9STC5Qb3B1cD5cbi8vICAgICAgICAgPC9STC5NYXJrZXI+XG4vLyAgICAgPC9STC5NYXA+XG4vLyApO1xudmFyIE1hcCA9IFJMLk1hcDtcbnZhciBUaWxlTGF5ZXIgPSBSTC5UaWxlTGF5ZXI7XG52YXIgTWFya2VyID0gUkwuTWFya2VyO1xudmFyIFBvcHVwID0gUkwuUG9wdXA7XG5cbmxldCBpY29uU2l6ZSA9IDM1O1xuXG52YXIgbmFwb0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL25hcG9sZW9uMy4xYzA3MmJmYy5qcGVnJyxcbiAgICBzaGFkb3dVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL25hcG9sZW9uMy4xYzA3MmJmYy5qcGVnJyxcblxuICAgIGljb25TaXplOiAgICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHNpemUgb2YgdGhlIGljb25cbiAgICBzaGFkb3dTaXplOiAgIFswLCAwXSwgLy8gc2l6ZSBvZiB0aGUgc2hhZG93XG4gICAgaWNvbkFuY2hvcjogICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gcG9pbnQgb2YgdGhlIGljb24gd2hpY2ggd2lsbCBjb3JyZXNwb25kIHRvIG1hcmtlcidzIGxvY2F0aW9uXG4gICAgc2hhZG93QW5jaG9yOiBbNCwgNjJdLCAgLy8gdGhlIHNhbWUgZm9yIHRoZSBzaGFkb3dcbiAgICBwb3B1cEFuY2hvcjogIFstMywgLTMwXSAvLyBwb2ludCBmcm9tIHdoaWNoIHRoZSBwb3B1cCBzaG91bGQgb3BlbiByZWxhdGl2ZSB0byB0aGUgaWNvbkFuY2hvclxufSk7XG5cbnZhciBiaXNtYXJja0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2Jpc21hcmNrLmJhZGQxNTIxLmpwZWcnLFxuICAgIHNoYWRvd1VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvYmlzbWFyY2suYmFkZDE1MjEuanBlZycsXG5cbiAgICBpY29uU2l6ZTogICAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBzaXplIG9mIHRoZSBpY29uXG4gICAgc2hhZG93U2l6ZTogICBbMCwgMF0sIC8vIHNpemUgb2YgdGhlIHNoYWRvd1xuICAgIGljb25BbmNob3I6ICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHBvaW50IG9mIHRoZSBpY29uIHdoaWNoIHdpbGwgY29ycmVzcG9uZCB0byBtYXJrZXIncyBsb2NhdGlvblxuICAgIHNoYWRvd0FuY2hvcjogWzQsIDYyXSwgIC8vIHRoZSBzYW1lIGZvciB0aGUgc2hhZG93XG4gICAgcG9wdXBBbmNob3I6ICBbLTMsIC0zMF0gLy8gcG9pbnQgZnJvbSB3aGljaCB0aGUgcG9wdXAgc2hvdWxkIG9wZW4gcmVsYXRpdmUgdG8gdGhlIGljb25BbmNob3Jcbn0pO1xuXG52YXIgaHVnb0ljb24gPSBMLmljb24oe1xuICAgIGljb25Vcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2h1Z28uOTQ2NTkzNWMuanBlZycsXG4gICAgc2hhZG93VXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9odWdvLjk0NjU5MzVjLmpwZWcnLFxuXG4gICAgaWNvblNpemU6ICAgICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gc2l6ZSBvZiB0aGUgaWNvblxuICAgIHNoYWRvd1NpemU6ICAgWzAsIDBdLCAvLyBzaXplIG9mIHRoZSBzaGFkb3dcbiAgICBpY29uQW5jaG9yOiAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBwb2ludCBvZiB0aGUgaWNvbiB3aGljaCB3aWxsIGNvcnJlc3BvbmQgdG8gbWFya2VyJ3MgbG9jYXRpb25cbiAgICBzaGFkb3dBbmNob3I6IFs0LCA2Ml0sICAvLyB0aGUgc2FtZSBmb3IgdGhlIHNoYWRvd1xuICAgIHBvcHVwQW5jaG9yOiAgWy0zLCAtMzBdIC8vIHBvaW50IGZyb20gd2hpY2ggdGhlIHBvcHVwIHNob3VsZCBvcGVuIHJlbGF0aXZlIHRvIHRoZSBpY29uQW5jaG9yXG59KTtcblxubGV0IGljb25zID0gW2Jpc21hcmNrSWNvbixodWdvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbixuYXBvSWNvbl07XG5cblxuXG5jbGFzcyBNeUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblNhdmUgPSBwcm9wcy5vblNhdmU7XG4gICAgICAgIHRoaXMub25EZWxldGUgPSBwcm9wcy5vbkRlbGV0ZTtcbiAgICAgICAgdGhpcy5vbkZpbmlzaCA9IHByb3BzLm9uRmluaXNoO1xuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge2NvbW1lbnQ6bnVsbH07XG4gICAgfVxuXG4gICAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLm9uU2F2ZSh7Y29tbWVudDp0aGlzLmlucHV0LmN1cnJlbnQudmFsdWV9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKXtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fSA+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ9XCJyZXF1aXJlZFwiIHJlZj17dGhpcy5pbnB1dH0gc2l6ZT1cIjYwXCIgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPkVucmVnaXN0cmVyPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGEgbmFtZT1cImRlbGV0ZVwiIGNsYXNzPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5vbkRlbGV0ZX0+U3VwcHJpbWVyPC9hPlxuICAgICAgICAgICAgICAgIDxhIG5hbWU9XCJmaW5pc2hcIiBjbGFzcz1cImJ0blwiIG9uQ2xpY2s9e3RoaXMub25GaW5pc2h9PkZpbmlyPC9hPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgTXlQb3B1cCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCl7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxQb3B1cCB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubXNnfVxuICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5maW5pc2hlZCA/XG4gICAgICAgICAgICAgICAgICAgIDxNeUZvcm0gey4uLnRoaXMucHJvcHN9Lz5cbiAgICAgICAgICAgICAgICAgICAgOm51bGx9XG4gICAgICAgICAgICA8L1BvcHVwPlxuICAgICAgICApXG4gICAgfVxufVxuXG5jb25zdCByZXNvdXJjZUdlb21ldHJ5ID0ge1xuICAgIGdldFBvaW50Q29vcmRzKCl7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnRhcmdldEdlb21ldHJ5ID09PSd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy50YXJnZXRHZW9tZXRyeS52YWx1ZSA9PT0ndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHRoaXMudGFyZ2V0R2VvbWV0cnkudmFsdWUudHlwZSA9PT0ndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdGhpcy50YXJnZXRHZW9tZXRyeS52YWx1ZS50eXBlICE9PSdQb2ludCcpIHJldHVybiBbMCwwXTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0R2VvbWV0cnkudmFsdWUuY29vcmRpbmF0ZXM7XG4gICAgfSxcbiAgICBnZXRQb2ludExhdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQb2ludENvb3JkcygpWzBdO1xuICAgIH0sXG4gICAgZ2V0UG9pbnRMbmcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnRDb29yZHMoKVsxXTtcbiAgICB9XG59O1xuXG5jb25zdCBnZXRJZEdlbmVyYXRvciA9ICBmdW5jdGlvbiAoYmVnaW49MCxzdGVwPTEpIHtcbiAgICBsZXQgaWQgPSBiZWdpbjtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdG9SZXR1cm4gPSBpZDtcbiAgICAgICAgaWQgPSBpZCArIHN0ZXA7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9O1xufTtcblxuXG5cbmNsYXNzIFNpbXBsZUV4YW1wbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbGF0OiA1MS41MDUsXG4gICAgICAgICAgICBsbmc6IC0wLjA5LFxuICAgICAgICAgICAgem9vbTogNixcbiAgICAgICAgICAgIHBpbnM6W10sXG4gICAgICAgICAgICBsb2FkaW5nOjAsXG4gICAgICAgICAgICBpZEdlbmVyYXRvciA6IGdldElkR2VuZXJhdG9yKDAsLTEpXG4gICAgICAgIH07XG4gICAgfVxuXG5cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgICAgIC8qaGIudXRpbC5zZXJ2ZXIuZ2V0KCdyZXNvdXJjZUdlb21ldHJ5Jyx7bWluaW1hbDp0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNlcHRpb24gY2xpZW50XCIpO1xuICAgICAgICAgICAgICAgIGRhdGEucm93cy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLm9uUGluUmVjZXB0aW9uKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcGluczpkYXRhLnJvd3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyovXG4gICAgfVxuXG4gICAgaGFuZGxlT25EZWxldGVQaW4oa2V5KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgbGV0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwaW5zLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IGtleSk7XG4gICAgICAgICAgICBwaW5zLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpbnMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGluczpwaW5zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU9uU2F2ZVBpbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZm9ybURhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1EYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBpbnMuZmluZEluZGV4KHggPT4geC5pZCA9PT0ga2V5KTtcbiAgICAgICAgICAgIGxldCBwaW4gPSBwaW5zW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpbik7XG5cbiAgICAgICAgICAgIC8qaGIudXRpbC5zZXJ2ZXIucG9zdCgncmVzb3VyY2VHZW9tZXRyeScse21pbmltYWw6dHJ1ZX0scGluLGZvcm1EYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT57XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVjZXB0aW9uIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHBpbnNbaW5kZXhdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgLyppZihpbmRleCAhPT0gZGF0YS5pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5zLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbnNbZGF0YS5pZF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5zW2luZGV4XSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGlucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGluczpwaW5zXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVPbkZpbmlzaFBpbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIHBpbnMuZmluZCh4ID0+IHguaWQgPT09IGtleSkuZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGluczpwaW5zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrT25NYXAoZXZlbnQpe1xuICAgICAgICBsZXQgbGF0bG5nID0gZXZlbnQubGF0bG5nO1xuXG4gICAgICAgIGxldCBkYXRhID0ge2lkOnRoaXMuc3RhdGUuaWRHZW5lcmF0b3IoKSxcbiAgICAgICAgICAgIHRhcmdldEdlb21ldHJ5Ont2YWx1ZTp7dHlwZTpcIlBvaW50XCIsY29vcmRpbmF0ZXM6W2xhdGxuZy5sYXQsbGF0bG5nLmxuZ119fX07XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihkYXRhLHJlc291cmNlR2VvbWV0cnkpO1xuXG4gICAgICAgIHRoaXMub25QaW5SZWNlcHRpb24oZGF0YSk7XG4gICAgICAgIGNvbnN0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBpbnM6cGlucy5jb25jYXQoW2RhdGFdKVxuICAgICAgICB9KTtcblxuICAgICAgICAvKmhiLnV0aWwuc2VydmVyLmdldE5ldygncmVzb3VyY2VHZW9tZXRyeScsdGFyZ2V0R2VvbWV0cnkgPSB7fSwpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+e1xuICAgICAgICAgICAgICAgIGRhdGEudGFyZ2V0R2VvbWV0cnkgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhLnRhcmdldEdlb21ldHJ5LnZhbHVlID0ge3R5cGU6XCJQb2ludFwiLGNvb3JkaW5hdGVzOltsYXRsbmcubGF0LGxhdGxuZy5sbmddfTtcblxuICAgICAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICBvblBpblJlY2VwdGlvbihkYXRhKXtcbiAgICAgICAgZGF0YS5maW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICBkYXRhLm1hcmtlciA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICAgIH1cblxuICAgIHVwZGF0ZVBvc2l0aW9uKGtleSl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IHBpbiA9IHBpbnMuZmluZCh4ID0+IHguaWQgPT09IGtleSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpbik7XG5cbiAgICAgICAgICAgIGlmKCFwaW4ubWFya2VyIHx8ICFwaW4ubWFya2VyLmN1cnJlbnQgfHwgIXBpbi5tYXJrZXIuY3VycmVudC5sZWFmbGV0RWxlbWVudCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgeyBsYXQsIGxuZyB9ID0gcGluLm1hcmtlci5jdXJyZW50LmxlYWZsZXRFbGVtZW50LmdldExhdExuZygpO1xuXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICAgICAgICBwaW4udGFyZ2V0R2VvbWV0cnkudmFsdWUuY29vcmRpbmF0ZXMgPSBbbGF0LGxuZ107XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaW5zLm1hcChwaW4gPT4ge3JldHVybiB7aWQ6cGluLmlkLGNvb3JkczpwaW4udGFyZ2V0R2VvbWV0cnkudmFsdWUuY29vcmRpbmF0ZXN9O30pKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHBpbnM6IHBpbnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBbdGhpcy5zdGF0ZS5sYXQsIHRoaXMuc3RhdGUubG5nXTtcblxuICAgICAgICBjb25zdCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zO1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgICBjb25zdCBtYXJrZXJzID0gcGlucy5tYXAocGluID0+IHtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxNYXJrZXIga2V5PXtwaW4uaWR9IGljb249e2ljb25zW2luZGV4XX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPXtbcGluLmdldFBvaW50TGF0KCkscGluLmdldFBvaW50TG5nKCldfVxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnZW5kPXt0aGlzLnVwZGF0ZVBvc2l0aW9uKHBpbi5pZCkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZj17cGluLm1hcmtlcn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxNeVBvcHVwIGF1dG9DbG9zZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlT25DbGljaz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZz17cGluLmNvbW1lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkPXtwaW4uZmluaXNoZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRGVsZXRlPXt0aGlzLmhhbmRsZU9uRGVsZXRlUGluKHBpbi5pZCkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXt0aGlzLmhhbmRsZU9uU2F2ZVBpbihwaW4uaWQpLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluaXNoPXt0aGlzLmhhbmRsZU9uRmluaXNoUGluKHBpbi5pZCkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgey8qPFBvcHVwIGF1dG9DbG9zZT17ZmFsc2V9IGNsb3NlT25DbGljaz17ZmFsc2V9PiovfVxuICAgICAgICAgICAgICAgICAgICB7Lyp7cGluLm1zZ30qL31cbiAgICAgICAgICAgICAgICAgICAgey8qPC9Qb3B1cD4qL31cbiAgICAgICAgICAgICAgICA8L01hcmtlcj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE1hcCBjZW50ZXI9e3Bvc2l0aW9ufSB6b29tPXt0aGlzLnN0YXRlLnpvb219IG9uQ2xpY2s9eyhldmVudCk9Pnt0aGlzLmhhbmRsZUNsaWNrT25NYXAoZXZlbnQpfX0+XG4gICAgICAgICAgICAgICAgPFRpbGVMYXllclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbj0nJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXG4gICAgICAgICAgICAgICAgICAgIHVybD0naHR0cDovL3tzfS50aWxlLm9zbS5vcmcve3p9L3t4fS97eX0ucG5nJ1xuICAgICAgICAgICAgICAgICAgICBtaW5ab29tPXswfVxuICAgICAgICAgICAgICAgICAgICBtYXhab29tPXszMn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIHsvKjxUaWxlTGF5ZXIqL31cbiAgICAgICAgICAgICAgICAgICAgey8qYXR0cmlidXRpb249JycqL31cbiAgICAgICAgICAgICAgICAgICAgey8qdXJsPSdodHRwOi8vbG9jYWxob3N0OjgwMDAvdGlsZXMve3p9L3t4fS97eX0ucG5nJyovfVxuICAgICAgICAgICAgICAgICAgICB7LypvcGFjaXR5PXswLjg1fSovfVxuICAgICAgICAgICAgICAgICAgICB7LyptaW5ab29tPXswfSovfVxuICAgICAgICAgICAgICAgICAgICB7LyptYXhab29tPXs4fSovfVxuICAgICAgICAgICAgICAgIHsvKi8+Ki99XG4gICAgICAgICAgICAgICAge21hcmtlcnN9XG4gICAgICAgICAgICA8L01hcD5cbiAgICAgICAgKTtcbiAgICB9XG59XG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChTaW1wbGVFeGFtcGxlLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcDInKSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4Il0sInNvdXJjZVJvb3QiOiIifQ==