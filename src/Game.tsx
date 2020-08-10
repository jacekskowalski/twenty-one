import React, { Component } from "react";
import Timer from "./Timer";
import Popup from "./popup";
import DeckOfCards from "./DeckOfCards";
import { Route, Redirect, Link } from 'react-router-dom';
export default class Game extends Component<{}, any> {
    intervalId: any = 0;
    constructor(props: any) {
        super(props);
        this.state = {
            players: [],
            deck_id: "",
            card1_img: "",
            card2_img: "",
            isWinner: false,
            isLooser : false,
            nrOfPlayers: 0,
            componentFlag: false,
            currentPlayer: 0,
            pts: 0,
            areTwoAces: false,
            isMulti: false,
            results: []
        } 
       
        this.getDeckId = this.getDeckId.bind(this);
        this.drawCards = this.drawCards.bind(this);
        this.nextPlayer = this.nextPlayer.bind(this);
    }
  
 
   componentDidMount() {      
       const nrOfPlayers: any = Number(localStorage.getItem('players'));
       localStorage.clear();
       let tmpArray = [];
       for (let i = 0; i < nrOfPlayers; i++) {
           let temp = {
               id: i + 1,
               points: 0,
               cards: []
           };
           tmpArray.push(temp);
       }
       if (nrOfPlayers === 1) {
           this.setState({
               nrOfPlayers: nrOfPlayers,
               players: tmpArray
              
           });
       } else {
           this.setState({
               nrOfPlayers: nrOfPlayers,
               players: tmpArray,
               isMulti: true
           });
       }
       this.getDeckId(); 
       this.drawCards();
      
     }

    componentDidUpdate() {
        if (this.state.componentFlag) {
            this.drawCards();

        }
    }

    componentWillUnmount() {
     
        clearInterval(this.intervalId);
    }

    getDeckId(){
       fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2")
            .then(data => data.json())
            .then(( data: any) => {
                this.setState({
                    deck_id: data.deck_id,
                    componentFlag: true
               });
            });
      
    }

    nextPlayer(){
     
        const nextPlayer = this.state.currentPlayer + 1;
        this.setState({
            currentPlayer: nextPlayer,
            areTwoAces: false,
               pts: 0,       
            card1_img: "",
            card2_img: ""
        });
        this.drawCards();
    }


    async drawCards() {
        if (this.state.currentPlayer < this.state.nrOfPlayers) {
            clearInterval(this.intervalId);
            if (this.state.isWinner === false && this.state.isLooser === false && this.state.currentPlayer < 1 && this.state.pts <= 22) {
                let tempArray: any = this.state.players;
                let tempObj: any = {};
                let resultsArray: any = [];
                fetch('https://deckofcardsapi.com/api/deck/' + encodeURIComponent(this.state.deck_id) + '/draw/?count=2')
                    .then(data => data.json())
                    .then(async (data: any) => {

                        tempArray[this.state.currentPlayer].cards.push(this.cardValue(data.cards[0].value));
                        tempArray[this.state.currentPlayer].cards.push(this.cardValue(data.cards[1].value));
                        const getValue = this.cardValue(data.cards[0].value) + this.cardValue(data.cards[1].value);
                        tempArray[this.state.currentPlayer].points += getValue;

                        this.setState({
                            card1_img: data.cards[0].images.png,
                            card2_img: data.cards[1].images.png,
                            players: tempArray,
                            deck_id: data.deck_id,
                            componentFlag: false,
                            pts: this.state.pts + getValue,
                        });
                        let sum = this.state.players[this.state.currentPlayer].cards.reduce((a: number, b: number) => a + b, 0);
                        let aces = this.state.players[this.state.currentPlayer].cards.filter((val: number) => val === 11).length;

                        if (sum === 21) {
                            tempObj.id = this.state.currentPlayer;
                            tempObj.value = sum;
                            resultsArray.push(tempObj);
                            this.setState({
                                isWinner: true,
                                results: [...this.state.results, ...resultsArray]
                                 });
                
                                this.nextPlayer();
                          
                        } else if (sum == 22 && aces == 2) {
                            tempObj.id = this.state.currentPlayer;
                            tempObj.value = sum;
                            resultsArray.push(tempObj);
                            this.setState({
                                  isWinner: true,
                                areTwoAces: true,
                                results: [...this.state.results, ...resultsArray]
                                  });
                  
                                this.nextPlayer();
                          
                        } else if (sum >= 22 && aces < 2) {
                            tempObj.id = this.state.currentPlayer;
                            tempObj.value = sum;
                            resultsArray.push(tempObj);
                            this.setState({
                                isLooser: true,
                                results: [...this.state.results, ...resultsArray]
                            });
                          
                                this.nextPlayer();
                  
                        }
                    });

            } else if (this.state.currentPlayer >= 1 && this.state.currentPlayer <= this.state.nrOfPlayers && this.state.pts <= 22) {
                this.intervalId = setInterval(() => {
                    let tempArray: any = this.state.players;
                    let tempObj: any = {};
                    let resultsArray: any = [];
                    fetch('https://deckofcardsapi.com/api/deck/' + encodeURIComponent(this.state.deck_id) + '/draw/?count=2')
                        .then(data => data.json())
                        .then(async (data: any) => {

                            tempArray[this.state.currentPlayer].cards.push(this.cardValue(data.cards[0].value));
                            tempArray[this.state.currentPlayer].cards.push(this.cardValue(data.cards[1].value));
                            const getValue = this.cardValue(data.cards[0].value) + this.cardValue(data.cards[1].value);
                            tempArray[this.state.currentPlayer].points += getValue;
                            let sum = this.state.players[this.state.currentPlayer].cards.reduce((a: number, b: number) => a + b, 0);
                            let aces = this.state.players[this.state.currentPlayer].cards.filter((val: number) => val === 11).length;

                            await this.setState({
                                card1_img: data.cards[0].images.png,
                                card2_img: data.cards[1].images.png,
                                players: tempArray,
                                deck_id: data.deck_id,
                                componentFlag: false,
                                isWinner: false,
                                isLooser: false,
                                pts: this.state.pts + getValue
                            });
                            if (sum === 21) {
                                tempObj.id = this.state.currentPlayer;
                                tempObj.value = sum;
                                resultsArray.push(tempObj);
                                this.setState({
                                    results: [...this.state.results, ...resultsArray],
                                    isWinner: true,
                                          });
                               
                                this.nextPlayer();
                            } else if (sum == 22 && aces == 2) {
                                tempObj.id = this.state.currentPlayer;
                                tempObj.value = sum;
                                resultsArray.push(tempObj);
                                this.setState({

                                    results: [...this.state.results, ...resultsArray],
                                    isWinner: true,
                                    areTwoAces: true,
             
                                });
                              
                                this.nextPlayer();
                            } else if (sum >= 22 && aces < 2) {
                                tempObj.id = this.state.currentPlayer;
                                tempObj.value = sum;
                                resultsArray.push(tempObj);
                                this.setState({
                                    results: [...this.state.results, ...resultsArray],
                                    isLooser: true,
      
                                });
                              
                                this.nextPlayer();
                            }
                        });

                }, 2000);
            }

        } else {
            clearInterval(this.intervalId);
        }
    }  
    cardValue(arg: string): number {
       let val = 0;
        switch (arg) {
            case "ACE":
                val = DeckOfCards.ACE;
                break;
            case "QUEEN":
                val = DeckOfCards.QUEEN;
                break
            case "KING":
                val = DeckOfCards.KING;
                break;
            case "JACK":
                val = DeckOfCards.JACK;
                break;
            default:
                val = Number(arg);
        }
        return val;
    }

    render() {
        return (
            <>
                <Timer />
                <div className="container">
                    {    (this.state.isWinner === false && this.state.isLooser === false) &&
                  <div className="section-cards">
                        <img src={this.state.card1_img} alt="card" className="section-cards__card"/>
                        <img src={this.state.card2_img} alt="card" className="section-cards__card" />
                        </div>
                    }
                  
                    <div className="resultInfo">
                        {this.state.isWinner &&
                            <p className="resultInfo__text">You`ve won</p>
                        }
                        {this.state.isLooser &&
                            <p className="resultInfo__text">You`ve lost</p>
                       
                        }
                        </div>
                    {this.state.areTwoAces &&
                        <div className="popUp">
                        <Link to="/">Back to menu</Link>
                           </div>
                    }
                 
                    <div className="section-score">
                        <div className="section-score__ul">
                          {this.state.players.map((item: any, index: string) => 
                             
                              (<p key={index} className="section-score__ul__li"> Player  {item.id}  points: {item.points} </p>)
                            )}
                         </div>
                    </div>
             
                        <div className="section-mode">

                        <button className="btn btn--red btn--height" onClick={this.drawCards}>Continue</button>
                        { this.state.isMulti && 
                            (<button className="btn btn--red btn--height" onClick={this.nextPlayer}>Stop</button>)
                           
                        }
                       
                    </div>
                    {( this.state.results.length === this.state.nrOfPlayers)&&
                        (<Popup result={this.state.results}/>)
                    }
                </div>
                <Route path={"/"}  />
            </>
        )
    }
}

