import React, { Component } from "react";
import { Route, Redirect} from 'react-router-dom';
import Game from "./Game";

export default class Main extends Component<{}, any> {

   
    constructor(props: any) {
        super(props);
        this.state = {
            players: 0,

        }
    }
  
    onclickAction = () => {
      
        localStorage.setItem("players", this.state.players);
     
        
    }
    handleChange = (event: any) => {
             this.setState({
            players: event.target.value,

        });
        this.onclickAction();
    }
    render() {
        if (localStorage.getItem("players") === "1" || localStorage.getItem("players") === "2" || localStorage.getItem("players") === "3"){
            return <Redirect push to={"/game"} />
        }
        return (
            <div className="main-screen" >
                <div className="main-screen__menu u-center-text"> 
                    <div className="row">            
                        <h1 className="heading-primary u-margin-bottom-small">Twenty one</h1>       
                        <h2 className="heading-secondary u-margin-bottom-big">Card game</h2>       
                        </div>
                    <div className="row main-screen__menu--select">            
                        <select className="selectbox" onChange={this.handleChange} >
                            <option>Number of players</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>

                        </select>                     
                            <button className="btn btn--red btn--animated" onClick={this.handleChange}>Start</button>
                        
                    </div>                     
                    </div>
                <Route path={"/game"} component={Game} />
                </div>
            );
    }
}