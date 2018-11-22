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
      idGenerator: hb.util.cmn.getIdGenerator(0, -1)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjJiZmI1OTVhMDJhODM0ZjBjMTIiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3Rlc3QtcmVhY3QuanN4Il0sIm5hbWVzIjpbIk1lbnVSZXN0YXVyYW50IiwiZm9vZHMiLCJpZCIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsImZvb2RTZWxlY3RlZCIsImZvb2QiLCJzZXRTdGF0ZSIsInN0YXRlIiwibWFwIiwib25QbGF0Q2xpY2tlZCIsImJpbmQiLCJSZWFjdCIsIkNvbXBvbmVudCIsIlBsYXQiLCJwcm9wcyIsIm9uQ2xpY2siLCJvbkNsaWNrUGxhdCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwiYmFja2dyb3VuZENvbG9yIiwic2hvd0Rlc2NyaXB0aW9uIiwiU3F1YXJlIiwidmFsdWUiLCJSZXN0YXJ0QnV0dG9uIiwiQm9hcmQiLCJpIiwic3F1YXJlcyIsInJlbmRlclNxdWFyZSIsIkdhbWUiLCJoaXN0b3J5IiwiQXJyYXkiLCJmaWxsIiwic3RlcE51bWJlciIsInBsYXllciIsInNsaWNlIiwiY3VycmVudCIsImxlbmd0aCIsImNhbGN1bGF0ZVdpbm5lciIsImNvbmNhdCIsImxpbmVzIiwiYSIsImIiLCJjIiwic3RlcCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5uZXIiLCJtb3ZlcyIsIm1vdmUiLCJkZXNjIiwianVtcFRvIiwic3RhdHVzIiwicmVzdGFydEdhbWUiLCJoYW5kbGVDbGljayIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwb3NpdGlvbiIsIk1hcCIsIlJMIiwiVGlsZUxheWVyIiwiTWFya2VyIiwiUG9wdXAiLCJpY29uU2l6ZSIsIm5hcG9JY29uIiwiTCIsImljb24iLCJpY29uVXJsIiwic2hhZG93VXJsIiwic2hhZG93U2l6ZSIsImljb25BbmNob3IiLCJzaGFkb3dBbmNob3IiLCJwb3B1cEFuY2hvciIsImJpc21hcmNrSWNvbiIsImh1Z29JY29uIiwiaWNvbnMiLCJNeUZvcm0iLCJoYW5kbGVTdWJtaXQiLCJvblNhdmUiLCJvbkRlbGV0ZSIsIm9uRmluaXNoIiwiaW5wdXQiLCJjcmVhdGVSZWYiLCJkYXRhIiwiY29tbWVudCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJNeVBvcHVwIiwibXNnIiwiZmluaXNoZWQiLCJyZXNvdXJjZUdlb21ldHJ5IiwiZ2V0UG9pbnRDb29yZHMiLCJ0YXJnZXRHZW9tZXRyeSIsInR5cGUiLCJjb29yZGluYXRlcyIsImdldFBvaW50TGF0IiwiZ2V0UG9pbnRMbmciLCJTaW1wbGVFeGFtcGxlIiwibGF0IiwibG5nIiwiem9vbSIsInBpbnMiLCJsb2FkaW5nIiwiaWRHZW5lcmF0b3IiLCJoYiIsInV0aWwiLCJjbW4iLCJnZXRJZEdlbmVyYXRvciIsImtleSIsImluZGV4IiwiZmluZEluZGV4IiwieCIsInNwbGljZSIsImZvcm1EYXRhIiwicGluIiwiZmluZCIsImxhdGxuZyIsIk9iamVjdCIsInNldFByb3RvdHlwZU9mIiwib25QaW5SZWNlcHRpb24iLCJtYXJrZXIiLCJsZWFmbGV0RWxlbWVudCIsImdldExhdExuZyIsImNvb3JkcyIsIm1hcmtlcnMiLCJ1cGRhdGVQb3NpdGlvbiIsImhhbmRsZU9uRGVsZXRlUGluIiwiaGFuZGxlT25TYXZlUGluIiwiaGFuZGxlT25GaW5pc2hQaW4iLCJoYW5kbGVDbGlja09uTWFwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2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Q0FKYjtBQUtJLGVBQU8sRUFBRTtBQUxiLFFBUEosRUFjS3dDLE9BZEwsQ0FESjtBQWtCSDs7OztFQWpMdUJwSCxLQUFLLENBQUNDLFM7O0FBbUxsQzBDLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQjVDLEtBQUssQ0FBQzZDLGFBQU4sQ0FBb0I0QyxhQUFwQixFQUFtQyxJQUFuQyxDQUFoQixFQUEwRDNDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixNQUF4QixDQUExRCxFIiwiZmlsZSI6InRlc3QtcmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVpbGQvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Fzc2V0cy9qcy90ZXN0LXJlYWN0LmpzeFwiKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMmJmYjU5NWEwMmE4MzRmMGMxMiIsIlwidXNlIHN0cmljdFwiO1xuXG5jbGFzcyBNZW51UmVzdGF1cmFudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBzdGF0ZSA9IHtcbiAgICAgICAgZm9vZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlBpenphIPCfjZVcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJVbmUgYmVsbGUgbWFyZ2FyaXRoYSAhXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJCbGFucXVldHRlIGRlIHZlYXVcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJMZXMgcGxhdHMgw6AgYmFzZSBkZSB2aWFuZGUgc29udC1pbHMgZGUgcXVhbGl0w6kgP1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiTWFraSDwn42ZXCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQXZvY2F0IGV0IHNhdW1vblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiU2FuZHdpc2gg8J+lqlwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlbDqWfDqSBww6J0w6kgYXV4IHRvbWF0ZXNcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBmb29kU2VsZWN0ZWQ6LTFcbiAgICB9XG5cbiAgICBvblBsYXRDbGlja2VkKGZvb2Qpe1xuICAgICAgICAvL2FsZXJ0KGZvb2QuZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9vZFNlbGVjdGVkOiBmb29kLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cblxuICAgIC8vICBVbmUgZm9uY3Rpb24gXCJyZW5kZXJcIiBxdWkgcmV0b3VybmUgbGEgc3RydWN0dXJlIMOgIGFmZmljaGVyIMOgIGwndXRpbGlzYXRldXJcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIERhbnMgbGUgcmV0dXJuLCBvbiBwZXV0IMOpY3JpcmUgZGUgbCdIVE1MIG91IHLDqWbDqXJlbmNlciB1biBhdXRyZSBDb21wb3NhbnRcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgQmllbnZlbnVlLCB2b2ljaSBub3RyZSBjYXJ0ZSAoY29vbCApIDpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZm9vZHMubWFwKChmb29kKSA9PiA8UGxhdFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0Rlc2NyaXB0aW9uPXt0aGlzLnN0YXRlLmZvb2RTZWxlY3RlZD09Zm9vZC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvb2Q9e2Zvb2R9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uUGxhdENsaWNrZWQuYmluZCh0aGlzKX0vPilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNsYXNzIFBsYXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgb25DbGlja1BsYXQoKSB7XG4gICAgICAgIC8vIE9uIHBldXQgZmFjaWxlbWVudCBpbXBsw6ltZW50ZXIgbm90cmUgZm9uY3Rpb25cbiAgICAgICAgLy8gT24gcmXDp29pdCB1bmUgdmFyaWFibGUgXCJvbkNsaWNrXCIgZGFucyBub3RyZSBcInByb3BzXCJcblxuICAgICAgICAvLyBTaSBvbiBhIHVuZSBwcm9wcyBcIm9uQ2xpY2tcIiwgYWxvcnMuLi5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25DbGljaykge1xuICAgICAgICAgICAgLy8gT24gZMOpY2xlbmNoZXIgbGEgZm9uY3Rpb24gXCJvbkNsaWNrXCIgZW4gZG9ubmFudCBlbiBwYXJhbcOodHJlIGwnaWQgZHUgcGxhdFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrKHRoaXMucHJvcHMuZm9vZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2tQbGF0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogXCI1JVwiLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuc2hvd0Rlc2NyaXB0aW9uID8gXCJyZ2IoMjI1LCAyMjUsIDIyNSlcIiA6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmZvb2QubmFtZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc2hvd0Rlc2NyaXB0aW9uID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+PGI+e3RoaXMucHJvcHMuZm9vZC5kZXNjcmlwdGlvbn08L2I+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vLyB0dXRvIHJlYWN0XG5cbmZ1bmN0aW9uIFNxdWFyZShwcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwic3F1YXJlXCIgb25DbGljaz17cHJvcHMub25DbGlja30+XG4gICAgICAgICAgICB7cHJvcHMudmFsdWV9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFJlc3RhcnRCdXR0b24ocHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3Byb3BzLm9uQ2xpY2t9PlxuICAgICAgICAgICAgUmVwbGF5ID9cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuY2xhc3MgQm9hcmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyU3F1YXJlKGkpIHtcbiAgICAgICAgcmV0dXJuIDxTcXVhcmVcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnNxdWFyZXNbaV19XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQ2xpY2soaSl9XG4gICAgICAgIC8+O1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2FyZC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDApfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoMSl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSgyKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvYXJkLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoMyl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg0KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDUpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNxdWFyZSg2KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3F1YXJlKDcpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTcXVhcmUoOCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaGlzdG9yeTogW3tcbiAgICAgICAgICAgICAgICBzcXVhcmVzOiBBcnJheSg5KS5maWxsKG51bGwpLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBzdGVwTnVtYmVyOjAsXG4gICAgICAgICAgICBwbGF5ZXI6ICdYJyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayhpKSB7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLnN0YXRlLmhpc3Rvcnkuc2xpY2UoMCwgdGhpcy5zdGF0ZS5zdGVwTnVtYmVyICsgMSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgY29uc3Qgc3F1YXJlcyA9IGN1cnJlbnQuc3F1YXJlcy5zbGljZSgpO1xuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVXaW5uZXIoc3F1YXJlcykgfHwgc3F1YXJlc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNxdWFyZXNbaV0gPSB0aGlzLnN0YXRlLnBsYXllcjtcblxuICAgICAgICBjb25zdCBwbGF5ZXIgPSAodGhpcy5zdGF0ZS5wbGF5ZXIgPT09ICdYJyk/J08nOidYJztcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBoaXN0b3J5OiBoaXN0b3J5LmNvbmNhdChbe1xuICAgICAgICAgICAgICAgIHNxdWFyZXM6IHNxdWFyZXMsXG4gICAgICAgICAgICB9XSksXG4gICAgICAgICAgICBzdGVwTnVtYmVyOmhpc3RvcnkubGVuZ3RoLFxuICAgICAgICAgICAgcGxheWVyOnBsYXllcn0pO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVdpbm5lcihzcXVhcmVzKSB7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gW1xuICAgICAgICAgICAgWzAsIDEsIDJdLFxuICAgICAgICAgICAgWzMsIDQsIDVdLFxuICAgICAgICAgICAgWzYsIDcsIDhdLFxuICAgICAgICAgICAgWzAsIDMsIDZdLFxuICAgICAgICAgICAgWzEsIDQsIDddLFxuICAgICAgICAgICAgWzIsIDUsIDhdLFxuICAgICAgICAgICAgWzAsIDQsIDhdLFxuICAgICAgICAgICAgWzIsIDQsIDZdLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBbYSwgYiwgY10gPSBsaW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChzcXVhcmVzW2FdICYmIHNxdWFyZXNbYV0gPT09IHNxdWFyZXNbYl0gJiYgc3F1YXJlc1thXSA9PT0gc3F1YXJlc1tjXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcXVhcmVzW2FdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGp1bXBUbyhzdGVwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RlcE51bWJlcjogc3RlcCxcbiAgICAgICAgICAgIHBsYXllcjogKChzdGVwICUgMikgPT09IDApPydYJzonTycsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc3RhcnRHYW1lKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzdGFydFwiKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgIHNxdWFyZXM6IEFycmF5KDkpLmZpbGwobnVsbCksXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIHN0ZXBOdW1iZXI6MCxcbiAgICAgICAgICAgIHBsYXllcjogJ1gnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuc3RhdGUuaGlzdG9yeTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGhpc3RvcnlbdGhpcy5zdGF0ZS5zdGVwTnVtYmVyXTtcbiAgICAgICAgY29uc3Qgd2lubmVyID0gdGhpcy5jYWxjdWxhdGVXaW5uZXIoY3VycmVudC5zcXVhcmVzKTtcblxuICAgICAgICBjb25zdCBtb3ZlcyA9IGhpc3RvcnkubWFwKChzdGVwLCBtb3ZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXNjID0gbW92ZSA/XG4gICAgICAgICAgICAgICAgJ0dvIHRvIG1vdmUgIycgKyBtb3ZlIDpcbiAgICAgICAgICAgICAgICAnR28gdG8gZ2FtZSBzdGFydCc7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e21vdmV9PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuanVtcFRvKG1vdmUpfT57ZGVzY308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgIGxldCBzdGF0dXM7XG4gICAgICAgIGlmICh3aW5uZXIpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdXaW5uZXI6ICcgKyB3aW5uZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnTmV4dCBwbGF5ZXI6ICcgKyB0aGlzLnN0YXRlLnBsYXllcjtcbiAgICAgICAgfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YXR1c1wiPntzdGF0dXN9PC9kaXY+XG4gICAgICAgIHsod2lubmVyKT88UmVzdGFydEJ1dHRvbiBvbkNsaWNrPXsoKT0+dGhpcy5yZXN0YXJ0R2FtZSgpfS8+Om51bGx9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2FtZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2FtZS1ib2FyZFwiPlxuICAgICAgICAgICAgICAgICAgICA8Qm9hcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNxdWFyZXM9e2N1cnJlbnQuc3F1YXJlc31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhpKSA9PiB0aGlzLmhhbmRsZUNsaWNrKGkpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2FtZS1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+eyBzdGF0dXMgfSB7KHdpbm5lcik/PFJlc3RhcnRCdXR0b24gb25DbGljaz17KCk9PnRoaXMucmVzdGFydEdhbWUoKX0vPjpudWxsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8b2w+e21vdmVzfTwvb2w+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lbnVSZXN0YXVyYW50LCBudWxsKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpKTtcblxuUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZSwgbnVsbCksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKSk7XG5cbmNvbnN0IHBvc2l0aW9uID0gWzQ4Ljg0NSwgMi4yOV07XG4vL2ltcG9ydCB7IE1hcCwgTWFya2VyLCBQb3B1cCwgVGlsZUxheWVyIH0gZnJvbSAnUkwnO1xuLy8gY29uc3QgbWFwMiA9IChcbi8vICAgICA8UkwuTWFwIGNlbnRlcj17cG9zaXRpb259IHpvb209ezEzfT5cbi8vICAgICAgICAgPFJMLlRpbGVMYXllclxuLy8gICAgICAgICAgICAgdXJsPXtcImh0dHA6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmdcIn1cbi8vICAgICAgICAgICAgIGF0dHJpYnV0aW9uPXtcIiZjb3B5OyA8YSBocmVmPSZxdW90O2h0dHA6Ly9vc20ub3JnL2NvcHlyaWdodCZxdW90Oz5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNcIn1cbi8vICAgICAgICAgLz5cbi8vICAgICAgICAgPFJMLk1hcmtlciBwb3NpdGlvbj17cG9zaXRpb259PlxuLy8gICAgICAgICAgICAgPFJMLlBvcHVwPkEgcHJldHR5IENTUzMgcG9wdXAuPGJyIC8+RWFzaWx5IGN1c3RvbWl6YWJsZS48L1JMLlBvcHVwPlxuLy8gICAgICAgICA8L1JMLk1hcmtlcj5cbi8vICAgICA8L1JMLk1hcD5cbi8vICk7XG52YXIgTWFwID0gUkwuTWFwO1xudmFyIFRpbGVMYXllciA9IFJMLlRpbGVMYXllcjtcbnZhciBNYXJrZXIgPSBSTC5NYXJrZXI7XG52YXIgUG9wdXAgPSBSTC5Qb3B1cDtcblxubGV0IGljb25TaXplID0gMzU7XG5cbnZhciBuYXBvSWNvbiA9IEwuaWNvbih7XG4gICAgaWNvblVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvbmFwb2xlb24zLjFjMDcyYmZjLmpwZWcnLFxuICAgIHNoYWRvd1VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvbmFwb2xlb24zLjFjMDcyYmZjLmpwZWcnLFxuXG4gICAgaWNvblNpemU6ICAgICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gc2l6ZSBvZiB0aGUgaWNvblxuICAgIHNoYWRvd1NpemU6ICAgWzAsIDBdLCAvLyBzaXplIG9mIHRoZSBzaGFkb3dcbiAgICBpY29uQW5jaG9yOiAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBwb2ludCBvZiB0aGUgaWNvbiB3aGljaCB3aWxsIGNvcnJlc3BvbmQgdG8gbWFya2VyJ3MgbG9jYXRpb25cbiAgICBzaGFkb3dBbmNob3I6IFs0LCA2Ml0sICAvLyB0aGUgc2FtZSBmb3IgdGhlIHNoYWRvd1xuICAgIHBvcHVwQW5jaG9yOiAgWy0zLCAtMzBdIC8vIHBvaW50IGZyb20gd2hpY2ggdGhlIHBvcHVwIHNob3VsZCBvcGVuIHJlbGF0aXZlIHRvIHRoZSBpY29uQW5jaG9yXG59KTtcblxudmFyIGJpc21hcmNrSWNvbiA9IEwuaWNvbih7XG4gICAgaWNvblVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvYmlzbWFyY2suYmFkZDE1MjEuanBlZycsXG4gICAgc2hhZG93VXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2J1aWxkL2ltYWdlcy9iaXNtYXJjay5iYWRkMTUyMS5qcGVnJyxcblxuICAgIGljb25TaXplOiAgICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHNpemUgb2YgdGhlIGljb25cbiAgICBzaGFkb3dTaXplOiAgIFswLCAwXSwgLy8gc2l6ZSBvZiB0aGUgc2hhZG93XG4gICAgaWNvbkFuY2hvcjogICBbaWNvblNpemUsIGljb25TaXplXSwgLy8gcG9pbnQgb2YgdGhlIGljb24gd2hpY2ggd2lsbCBjb3JyZXNwb25kIHRvIG1hcmtlcidzIGxvY2F0aW9uXG4gICAgc2hhZG93QW5jaG9yOiBbNCwgNjJdLCAgLy8gdGhlIHNhbWUgZm9yIHRoZSBzaGFkb3dcbiAgICBwb3B1cEFuY2hvcjogIFstMywgLTMwXSAvLyBwb2ludCBmcm9tIHdoaWNoIHRoZSBwb3B1cCBzaG91bGQgb3BlbiByZWxhdGl2ZSB0byB0aGUgaWNvbkFuY2hvclxufSk7XG5cbnZhciBodWdvSWNvbiA9IEwuaWNvbih7XG4gICAgaWNvblVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZC9pbWFnZXMvaHVnby45NDY1OTM1Yy5qcGVnJyxcbiAgICBzaGFkb3dVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYnVpbGQvaW1hZ2VzL2h1Z28uOTQ2NTkzNWMuanBlZycsXG5cbiAgICBpY29uU2l6ZTogICAgIFtpY29uU2l6ZSwgaWNvblNpemVdLCAvLyBzaXplIG9mIHRoZSBpY29uXG4gICAgc2hhZG93U2l6ZTogICBbMCwgMF0sIC8vIHNpemUgb2YgdGhlIHNoYWRvd1xuICAgIGljb25BbmNob3I6ICAgW2ljb25TaXplLCBpY29uU2l6ZV0sIC8vIHBvaW50IG9mIHRoZSBpY29uIHdoaWNoIHdpbGwgY29ycmVzcG9uZCB0byBtYXJrZXIncyBsb2NhdGlvblxuICAgIHNoYWRvd0FuY2hvcjogWzQsIDYyXSwgIC8vIHRoZSBzYW1lIGZvciB0aGUgc2hhZG93XG4gICAgcG9wdXBBbmNob3I6ICBbLTMsIC0zMF0gLy8gcG9pbnQgZnJvbSB3aGljaCB0aGUgcG9wdXAgc2hvdWxkIG9wZW4gcmVsYXRpdmUgdG8gdGhlIGljb25BbmNob3Jcbn0pO1xuXG5sZXQgaWNvbnMgPSBbYmlzbWFyY2tJY29uLGh1Z29JY29uLG5hcG9JY29uLG5hcG9JY29uLG5hcG9JY29uLG5hcG9JY29uLG5hcG9JY29uLG5hcG9JY29uXTtcblxuXG5cbmNsYXNzIE15Rm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU2F2ZSA9IHByb3BzLm9uU2F2ZTtcbiAgICAgICAgdGhpcy5vbkRlbGV0ZSA9IHByb3BzLm9uRGVsZXRlO1xuICAgICAgICB0aGlzLm9uRmluaXNoID0gcHJvcHMub25GaW5pc2g7XG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5pbnB1dCA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICAgICAgICB0aGlzLmRhdGEgPSB7Y29tbWVudDpudWxsfTtcbiAgICB9XG5cbiAgICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMub25TYXZlKHtjb21tZW50OnRoaXMuaW5wdXQuY3VycmVudC52YWx1ZX0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpe1xuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9ID5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZD1cInJlcXVpcmVkXCIgcmVmPXt0aGlzLmlucHV0fSBzaXplPVwiNjBcIiAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+RW5yZWdpc3RyZXI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YSBuYW1lPVwiZGVsZXRlXCIgY2xhc3M9XCJidG4gYnRuLXdhcm5pbmdcIiBvbkNsaWNrPXt0aGlzLm9uRGVsZXRlfT5TdXBwcmltZXI8L2E+XG4gICAgICAgICAgICAgICAgPGEgbmFtZT1cImZpbmlzaFwiIGNsYXNzPVwiYnRuXCIgb25DbGljaz17dGhpcy5vbkZpbmlzaH0+RmluaXI8L2E+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBNeVBvcHVwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKXtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPFBvcHVwIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5tc2d9XG4gICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmZpbmlzaGVkID9cbiAgICAgICAgICAgICAgICAgICAgPE15Rm9ybSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICAgICAgICAgICAgICA6bnVsbH1cbiAgICAgICAgICAgIDwvUG9wdXA+XG4gICAgICAgIClcbiAgICB9XG59XG5cbmNvbnN0IHJlc291cmNlR2VvbWV0cnkgPSB7XG4gICAgZ2V0UG9pbnRDb29yZHMoKXtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMudGFyZ2V0R2VvbWV0cnkgPT09J3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnRhcmdldEdlb21ldHJ5LnZhbHVlID09PSd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy50YXJnZXRHZW9tZXRyeS52YWx1ZS50eXBlID09PSd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0aGlzLnRhcmdldEdlb21ldHJ5LnZhbHVlLnR5cGUgIT09J1BvaW50JykgcmV0dXJuIFswLDBdO1xuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXRHZW9tZXRyeS52YWx1ZS5jb29yZGluYXRlcztcbiAgICB9LFxuICAgIGdldFBvaW50TGF0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50Q29vcmRzKClbMF07XG4gICAgfSxcbiAgICBnZXRQb2ludExuZygpe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQb2ludENvb3JkcygpWzFdO1xuICAgIH1cbn07XG5cblxuXG5cblxuY2xhc3MgU2ltcGxlRXhhbXBsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBsYXQ6IDUxLjUwNSxcbiAgICAgICAgICAgIGxuZzogLTAuMDksXG4gICAgICAgICAgICB6b29tOiA2LFxuICAgICAgICAgICAgcGluczpbXSxcbiAgICAgICAgICAgIGxvYWRpbmc6MCxcbiAgICAgICAgICAgIGlkR2VuZXJhdG9yIDogaGIudXRpbC5jbW4uZ2V0SWRHZW5lcmF0b3IoMCwtMSlcbiAgICAgICAgfTtcbiAgICB9XG5cblxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICAgICAgLypoYi51dGlsLnNlcnZlci5nZXQoJ3Jlc291cmNlR2VvbWV0cnknLHttaW5pbWFsOnRydWV9KVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlY2VwdGlvbiBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgZGF0YS5yb3dzLmZvckVhY2goKGl0ZW0pID0+IHRoaXMub25QaW5SZWNlcHRpb24oaXRlbSkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBwaW5zOmRhdGEucm93c1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICBoYW5kbGVPbkRlbGV0ZVBpbihrZXkpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICAgICAgICBsZXQgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBpbnMuZmluZEluZGV4KHggPT4geC5pZCA9PT0ga2V5KTtcbiAgICAgICAgICAgIHBpbnMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGlucyk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBwaW5zOnBpbnNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlT25TYXZlUGluKGtleSl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmb3JtRGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGlucy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSBrZXkpO1xuICAgICAgICAgICAgbGV0IHBpbiA9IHBpbnNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGluKTtcblxuICAgICAgICAgICAgLypoYi51dGlsLnNlcnZlci5wb3N0KCdyZXNvdXJjZUdlb21ldHJ5Jyx7bWluaW1hbDp0cnVlfSxwaW4sZm9ybURhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PntcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNlcHRpb24gY2xpZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcGluc1tpbmRleF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAvKmlmKGluZGV4ICE9PSBkYXRhLmlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbnMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGluc1tkYXRhLmlkXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbnNbaW5kZXhdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwaW5zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5zOnBpbnNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU9uRmluaXNoUGluKGtleSl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBwaW5zID0gdGhpcy5zdGF0ZS5waW5zLnNsaWNlKDAsIHRoaXMuc3RhdGUucGlucy5sZW5ndGgpO1xuICAgICAgICAgICAgcGlucy5maW5kKHggPT4geC5pZCA9PT0ga2V5KS5maW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBwaW5zOnBpbnNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2tPbk1hcChldmVudCl7XG4gICAgICAgIGxldCBsYXRsbmcgPSBldmVudC5sYXRsbmc7XG5cbiAgICAgICAgbGV0IGRhdGEgPSB7aWQ6dGhpcy5zdGF0ZS5pZEdlbmVyYXRvcigpLFxuICAgICAgICAgICAgdGFyZ2V0R2VvbWV0cnk6e3ZhbHVlOnt0eXBlOlwiUG9pbnRcIixjb29yZGluYXRlczpbbGF0bG5nLmxhdCxsYXRsbmcubG5nXX19fTtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGRhdGEscmVzb3VyY2VHZW9tZXRyeSk7XG5cbiAgICAgICAgdGhpcy5vblBpblJlY2VwdGlvbihkYXRhKTtcbiAgICAgICAgY29uc3QgcGlucyA9IHRoaXMuc3RhdGUucGlucy5zbGljZSgwLCB0aGlzLnN0YXRlLnBpbnMubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcGluczpwaW5zLmNvbmNhdChbZGF0YV0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qaGIudXRpbC5zZXJ2ZXIuZ2V0TmV3KCdyZXNvdXJjZUdlb21ldHJ5Jyx0YXJnZXRHZW9tZXRyeSA9IHt9LClcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT57XG4gICAgICAgICAgICAgICAgZGF0YS50YXJnZXRHZW9tZXRyeSA9IHt9O1xuICAgICAgICAgICAgICAgIGRhdGEudGFyZ2V0R2VvbWV0cnkudmFsdWUgPSB7dHlwZTpcIlBvaW50XCIsY29vcmRpbmF0ZXM6W2xhdGxuZy5sYXQsbGF0bG5nLmxuZ119O1xuXG4gICAgICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIG9uUGluUmVjZXB0aW9uKGRhdGEpe1xuICAgICAgICBkYXRhLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIGRhdGEubWFya2VyID0gUmVhY3QuY3JlYXRlUmVmKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlUG9zaXRpb24oa2V5KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnMuc2xpY2UoMCwgdGhpcy5zdGF0ZS5waW5zLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgcGluID0gcGlucy5maW5kKHggPT4geC5pZCA9PT0ga2V5KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2cocGluKTtcblxuICAgICAgICAgICAgaWYoIXBpbi5tYXJrZXIgfHwgIXBpbi5tYXJrZXIuY3VycmVudCB8fCAhcGluLm1hcmtlci5jdXJyZW50LmxlYWZsZXRFbGVtZW50KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCB7IGxhdCwgbG5nIH0gPSBwaW4ubWFya2VyLmN1cnJlbnQubGVhZmxldEVsZW1lbnQuZ2V0TGF0TG5nKCk7XG5cblxuICAgICAgICAgICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIHBpbi50YXJnZXRHZW9tZXRyeS52YWx1ZS5jb29yZGluYXRlcyA9IFtsYXQsbG5nXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpbnMubWFwKHBpbiA9PiB7cmV0dXJuIHtpZDpwaW4uaWQsY29vcmRzOnBpbi50YXJnZXRHZW9tZXRyeS52YWx1ZS5jb29yZGluYXRlc307fSkpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGluczogcGlucyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IFt0aGlzLnN0YXRlLmxhdCwgdGhpcy5zdGF0ZS5sbmddO1xuXG4gICAgICAgIGNvbnN0IHBpbnMgPSB0aGlzLnN0YXRlLnBpbnM7XG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlcnMgPSBwaW5zLm1hcChwaW4gPT4ge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPE1hcmtlciBrZXk9e3Bpbi5pZH0gaWNvbj17aWNvbnNbaW5kZXhdfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb249e1twaW4uZ2V0UG9pbnRMYXQoKSxwaW4uZ2V0UG9pbnRMbmcoKV19XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdlbmQ9e3RoaXMudXBkYXRlUG9zaXRpb24ocGluLmlkKS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmPXtwaW4ubWFya2VyfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPE15UG9wdXAgYXV0b0Nsb3NlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VPbkNsaWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnPXtwaW4uY29tbWVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQ9e3Bpbi5maW5pc2hlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25EZWxldGU9e3RoaXMuaGFuZGxlT25EZWxldGVQaW4ocGluLmlkKS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9e3RoaXMuaGFuZGxlT25TYXZlUGluKHBpbi5pZCkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25GaW5pc2g9e3RoaXMuaGFuZGxlT25GaW5pc2hQaW4ocGluLmlkKS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB7Lyo8UG9wdXAgYXV0b0Nsb3NlPXtmYWxzZX0gY2xvc2VPbkNsaWNrPXtmYWxzZX0+Ki99XG4gICAgICAgICAgICAgICAgICAgIHsvKntwaW4ubXNnfSovfVxuICAgICAgICAgICAgICAgICAgICB7Lyo8L1BvcHVwPiovfVxuICAgICAgICAgICAgICAgIDwvTWFya2VyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TWFwIGNlbnRlcj17cG9zaXRpb259IHpvb209e3RoaXMuc3RhdGUuem9vbX0gb25DbGljaz17KGV2ZW50KT0+e3RoaXMuaGFuZGxlQ2xpY2tPbk1hcChldmVudCl9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUxheWVyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uPScmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICAgICAgICAgICAgICAgICAgdXJsPSdodHRwOi8ve3N9LnRpbGUub3NtLm9yZy97en0ve3h9L3t5fS5wbmcnXG4gICAgICAgICAgICAgICAgICAgIG1pblpvb209ezB9XG4gICAgICAgICAgICAgICAgICAgIG1heFpvb209ezMyfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFRpbGVMYXllclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbj0nJ1xuICAgICAgICAgICAgICAgICAgICB1cmw9J2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC90aWxlcy97en0ve3h9L3t5fS5wbmcnXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk9ezAuODV9XG4gICAgICAgICAgICAgICAgICAgIG1pblpvb209ezB9XG4gICAgICAgICAgICAgICAgICAgIG1heFpvb209ezh9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7bWFya2Vyc31cbiAgICAgICAgICAgIDwvTWFwPlxuICAgICAgICApO1xuICAgIH1cbn1cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFNpbXBsZUV4YW1wbGUsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwMicpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanMvdGVzdC1yZWFjdC5qc3giXSwic291cmNlUm9vdCI6IiJ9