"use strict";

class MenuRestaurant extends React.Component {

    state = {
        foods: [
            {
                id: 0,
                name: "Pizza 🍕",
                description: "Une belle margaritha !"
            },
            {
                id: 1,
                name: "Blanquette de veau",
                description: "Les plats à base de viande sont-ils de qualité ?"
            },
            {
                id: 2,
                name: "Maki 🍙",
                description: "Avocat et saumon"
            },
            {
                id: 3,
                name: "Sandwish 🥪",
                description: "Végé pâté aux tomates"
            }
        ],
        foodSelected:-1
    }

    onPlatClicked(food){
        //alert(food.description);

        this.setState(
            {
                foodSelected: food.id
            }
        )
    }


    //  Une fonction "render" qui retourne la structure à afficher à l'utilisateur
    render() {
        // Dans le return, on peut écrire de l'HTML ou référencer un autre Composant
        return (
            <div>
                Bienvenue, voici notre carte (cool ) :
                {
                    this.state.foods.map((food) => <Plat
                        showDescription={this.state.foodSelected==food.id}
                        food={food}
                        onClick={this.onPlatClicked.bind(this)}/>)
                }
            </div>
        );
    }
}

class Plat extends React.Component {

    onClickPlat() {
        // On peut facilement implémenter notre fonction
        // On reçoit une variable "onClick" dans notre "props"

        // Si on a une props "onClick", alors...
        if (this.props.onClick) {
            // On déclencher la fonction "onClick" en donnant en paramètre l'id du plat
            this.props.onClick(this.props.food);
        }
    }

    render() {
        return(
            <div
                onClick={this.onClickPlat.bind(this)}
                style={{
                    padding: 5,
                    marginLeft: "5%",
                    backgroundColor: this.props.showDescription ? "rgb(225, 225, 225)" : "transparent"
                }}
            >
                {
                    this.props.food.name
                }
                {
                    this.props.showDescription ?
                        <div><b>{this.props.food.description}</b></div>
                        :
                        null
                }
            </div>
        );
    }
}

// tuto react

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function RestartButton(props) {
    return (
        <button onClick={props.onClick}>
            Replay ?
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber:0,
            player: 'X',
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        const squares = current.squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.player;

        const player = (this.state.player === 'X')?'O':'X';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber:history.length,
            player:player});
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            player: ((step % 2) === 0)?'X':'O',
        });
    }

    restartGame(){
        console.log("restart");
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber:0,
            player: 'X'
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });



        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.state.player;
        }
        <div className="status">{status}</div>
        {(winner)?<RestartButton onClick={()=>this.restartGame()}/>:null}

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status } {(winner)?<RestartButton onClick={()=>this.restartGame()}/>:null}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(MenuRestaurant, null),
    document.getElementById('menu'));

ReactDOM.render(
    React.createElement(Game, null),
    document.getElementById('game'));

const position = [48.845, 2.29];
//import { Map, Marker, Popup, TileLayer } from 'RL';
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

let iconSize = 35;

var napoIcon = L.icon({
    iconUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',
    shadowUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',

    iconSize:     [iconSize, iconSize], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [iconSize, iconSize], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

var bismarckIcon = L.icon({
    iconUrl: 'http://localhost:8000/build/images/bismarck.badd1521.jpeg',
    shadowUrl: 'http://localhost:8000/build/images/bismarck.badd1521.jpeg',

    iconSize:     [iconSize, iconSize], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [iconSize, iconSize], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

var hugoIcon = L.icon({
    iconUrl: 'http://localhost:8000/build/images/hugo.9465935c.jpeg',
    shadowUrl: 'http://localhost:8000/build/images/hugo.9465935c.jpeg',

    iconSize:     [iconSize, iconSize], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [iconSize, iconSize], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

let icons = [bismarckIcon,hugoIcon,napoIcon,napoIcon,napoIcon,napoIcon,napoIcon,napoIcon];



class MyForm extends React.Component{

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSave = props.onSave;
        this.onDelete = props.onDelete;
        this.onFinish = props.onFinish;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
        this.data = {comment:null};
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.onSave({comment:this.input.current.value});
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit} >
                <input type="text" required="required" ref={this.input} size="60" />
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a name="delete" class="btn btn-warning" onClick={this.onDelete}>Supprimer</a>
                <a name="finish" class="btn" onClick={this.onFinish}>Finir</a>
            </form>
        );
    }
}

class MyPopup extends React.Component {
    render(){
        return(
            <Popup {...this.props}>
                {this.props.msg}
                {!this.props.finished ?
                    <MyForm {...this.props}/>
                    :null}
            </Popup>
        )
    }
}

const resourceGeometry = {
    getPointCoords(){
        if(typeof this.targetGeometry ==='undefined' ||
            typeof this.targetGeometry.value ==='undefined' ||
            typeof this.targetGeometry.value.type ==='undefined' ||
            this.targetGeometry.value.type !=='Point') return [0,0];
        return this.targetGeometry.value.coordinates;
    },
    getPointLat(){
        return this.getPointCoords()[0];
    },
    getPointLng(){
        return this.getPointCoords()[1];
    }
};

const getIdGenerator =  function (begin=0,step=1) {
    let id = begin;
    return function () {
        let toReturn = id;
        id = id + step;
        return toReturn;
    };
};



class SimpleExample extends React.Component {
    constructor() {
        super();
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 6,
            pins:[],
            loading:0,
            idGenerator : getIdGenerator(0,-1)
        };
    }



    componentDidMount(){
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

    handleOnDeletePin(key){
        return function(){
            console.log(key);
            let pins = this.state.pins.slice(0, this.state.pins.length);
            let index = pins.findIndex(x => x.id === key);
            pins.splice(index,1);
            console.log(pins);
            this.setState({
                pins:pins
            });
        }
    }

    handleOnSavePin(key){
        return function(formData) {
            console.log(formData);
            console.log(key);
            let pins = this.state.pins.slice(0, this.state.pins.length);
            let index = pins.findIndex(x => x.id === key);
            let pin = pins[index];
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
        }
    }

    handleOnFinishPin(key){
        return function() {
            let pins = this.state.pins.slice(0, this.state.pins.length);
            pins.find(x => x.id === key).finished = true;
            this.setState({
                pins:pins
            });
        }
    }

    handleClickOnMap(event){
        let latlng = event.latlng;

        let data = {id:this.state.idGenerator(),
            targetGeometry:{value:{type:"Point",coordinates:[latlng.lat,latlng.lng]}}};
        Object.setPrototypeOf(data,resourceGeometry);

        this.onPinReception(data);
        const pins = this.state.pins.slice(0, this.state.pins.length);
        console.log(data);
        this.setState({
            pins:pins.concat([data])
        });

        /*hb.util.server.getNew('resourceGeometry',targetGeometry = {},)
            .then(data =>{
                data.targetGeometry = {};
                data.targetGeometry.value = {type:"Point",coordinates:[latlng.lat,latlng.lng]};

            });*/
    }

    onPinReception(data){
        data.finished = false;
        data.marker = React.createRef();
    }

    updatePosition(key){
        return function() {
            let pins = this.state.pins.slice(0, this.state.pins.length);
            let pin = pins.find(x => x.id === key);

            console.log(pin);

            if(!pin.marker || !pin.marker.current || !pin.marker.current.leafletElement) return;
            const { lat, lng } = pin.marker.current.leafletElement.getLatLng();


            console.log(key);
            pin.targetGeometry.value.coordinates = [lat,lng];
            console.log(pins.map(pin => {return {id:pin.id,coords:pin.targetGeometry.value.coordinates};}));
            this.setState({
                pins: pins,
            });
        }
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        const pins = this.state.pins;
        let index = -1;

        const markers = pins.map(pin => {
            index++;
            return (
                <Marker key={pin.id} icon={icons[index]}
                        position={[pin.getPointLat(),pin.getPointLng()]}
                        draggable={true}
                        onDragend={this.updatePosition(pin.id).bind(this)}
                        ref={pin.marker}
                >
                    <MyPopup autoClose={false}
                             closeOnClick={false}
                             msg={pin.comment}
                             finished={pin.finished}
                             onDelete={this.handleOnDeletePin(pin.id).bind(this)}
                             key={index}
                             onSave={this.handleOnSavePin(pin.id).bind(this)}
                             onFinish={this.handleOnFinishPin(pin.id).bind(this)}
                    />
                    {/*<Popup autoClose={false} closeOnClick={false}>*/}
                    {/*{pin.msg}*/}
                    {/*</Popup>*/}
                </Marker>
            );
        });



        return (
            <Map center={position} zoom={this.state.zoom} onClick={(event)=>{this.handleClickOnMap(event)}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    minZoom={0}
                    maxZoom={32}
                />
                {/*<TileLayer*/}
                    {/*attribution=''*/}
                    {/*url='http://localhost:8000/tiles/{z}/{x}/{y}.png'*/}
                    {/*opacity={0.85}*/}
                    {/*minZoom={0}*/}
                    {/*maxZoom={8}*/}
                {/*/>*/}
                {markers}
            </Map>
        );
    }
}
ReactDOM.render(React.createElement(SimpleExample, null), document.getElementById('map2'));