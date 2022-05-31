import { useEffect, useState } from 'react'
import {useGameContext} from '../contexts/GameContextProvider'

const GameBoard = () => {
  
    const {socket} = useGameContext()
    const [playerBoard, setPlayerBoard] = useState([]);
	const [opponentBoard, setOpponentBoard] = useState([]);
    
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    const yourBoard = []
    const enemyBoard = []
    
    const createBoard = (mBoard, eBoard) => {
        
        for (let y=0; y<rows.length; y++ ) {
            for (let x=0; x<cols.length; x++){
                mBoard.push(<div className="cell" key={`${cols[x]}${rows[y]}`} data-id={`${cols[x]}${rows[y]}`}></div>)
                eBoard.push(<div onClick={handleClick} className="cell" key={`${cols[x]}${rows[y]}`} data-id={`${cols[x]}${rows[y]}`}></div>)
            }
        } 
        setPlayerBoard((playerBoard) => [...playerBoard, ...mBoard])    
        setOpponentBoard((opponentBoard) => [...opponentBoard, ...eBoard])    
    }  
  
    const handleClick = (e) => {
        const clicked = e.target.getAttribute("data-id")

        if(e.target.className === "ship"){
            e.target.className = "hit"
            console.log("Hit!")

        }   else{
            e.target.className = "miss"
            console.log("Miss!")
        }

        console.log(`shots fired at ${clicked}`);
        socket.emit('user:click', `${clicked}`);
    }
        
    useEffect(()=>{
        createBoard(yourBoard,enemyBoard)
    },[])
        
    return (
        <div >
            <h2 className="text-center">Time to sink some ships!</h2>


            <div className="game-wrapper">
                <div>
                    <h3>Your Board</h3>
                    <div className="yourBoard">{playerBoard}</div>
                </div>

                <div>
                    <h3>friendly ships left: 4/4</h3>
                    <h3>Enemy ships left: 4/4</h3>
                </div>

                <div>
                    <h3>Enemy Board</h3>
                    <div className="enemyBoard">
                        {opponentBoard}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameBoard