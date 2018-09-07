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

var napoIcon = L.icon({
    iconUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',
    shadowUrl: 'http://localhost:8000/build/images/napoleon3.1c072bfc.jpeg',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

function MyForm(props){
    return(
        <form>
            <input type="text" required="required" maxlength="60" size="60" />
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    );
}

class MyPopup extends React.Component {
    render(){
        return(
            <Popup {...this.props}>
                {this.props.msg}
                {!this.props.finished ?
                    <MyForm/>
                :null}
            </Popup>
            )
    }
}


class SimpleExample extends React.Component {
    constructor() {
        super();
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 6,
            pins:[{lat:51.505,lng : -0.09,msg : "Napoléon was here",finished : false}]
        }
    }

    handleClickOnMap(event){
        const pins = this.state.pins.slice(0, this.state.pins.length);
        let latlng = event.latlng;
        this.setState({
            pins:pins.concat([{lat:latlng.lat,lng:latlng.lng,msg:"ca roule !",finished:false}])
        });
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        const pins = this.state.pins;
        let index = 0;

        const markers = pins.map(pin => {
            index++;
            return (
                <Marker key={index} icon={napoIcon} position={[pin.lat,pin.lng]} draggable={true}>
                    <MyPopup autoClose={false} closeOnClick={false} msg={pin.msg} finished={pin.finished}/>
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
                <TileLayer
                    attribution=''
                    url='http://localhost:8000/tiles/{z}/{x}/{y}.png'
                    opacity={0.85}
                    minZoom={0}
                    maxZoom={8}
                />
                {markers}
            </Map>
        );
    }
}
ReactDOM.render(React.createElement(SimpleExample, null), document.getElementById('map2'));