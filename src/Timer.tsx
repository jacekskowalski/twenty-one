import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
    const [seconds, setSeconds] = useState(3);
    const [show, setShow] = useState(true);

    useEffect(() => {
        let interval:any = null;
        if (seconds < 1) {
            setShow(false);
            return;
        }
         interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        
        return () => {         
            clearInterval(interval);
         
        }
    }, [seconds]);

    return (
        <>{show === true &&
            <div className="timer" >
                <span className="timer--clock ">{seconds}
                </span>
               
            </div>
        }
            </>
    );
       
}

export default Timer