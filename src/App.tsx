import React from 'react';
import Main from "./main";
import Game from "./Game";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './sass/main.scss';

const App: React.FC=()=> {
  return (
      <>
          <BrowserRouter>
              <Switch>
                  <Route exact path="/game" component={Game} />
                  < Route component={Main} />
              </Switch>
          </BrowserRouter>
   </>
  );
}

export default App;
