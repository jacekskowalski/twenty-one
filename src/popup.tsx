import React, {FunctionComponent} from "react";
import { Route, Link } from 'react-router-dom';


export interface IResult {
    result: any | any[]
    
}
const Popup: FunctionComponent<IResult> = ({ result}) =>  {
    let compareResults: any = Array.from(result).sort((a: any, b: any) => (Math.abs(a.value - 21) > Math.abs(b.value - 21)) ? 1 : -1);
  
        return (
            <>
            <div className="popup">
                <div className="popup__content">
                        <h1 className="popup__content__heading u-margin-bottom-small">Scores table</h1>
                        <div className="popup__content__list">
                            <ul>
                            {compareResults.map((item: any, index: string) =>
                                (<li key={index} className="popup__content__li"> Player  {item.id+1}  points: {item.value} </li>) )
                                }
                                </ul>
                        </div>
                        <Link className="btn btn--red results" to="/">Back to menu</Link>
                </div>
            </div>
                <Route path={"/"} />
                </>
        );
    }


export default Popup;