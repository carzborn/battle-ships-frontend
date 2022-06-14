import { useEffect, useState } from 'react'
import {useGameContext} from '../contexts/GameContextProvider'
// import { useNavigate } from 'react-router-dom'

const GameBoard = () => {
  
    // const navigate = useNavigate()
    const {socket, p1, setP1, p2, setP2, setFullGame} = useGameContext()
    const [playerBoard, setPlayerBoard] = useState([]);
	const [opponentBoard, setOpponentBoard] = useState([]);


    //Create both gameboards
    let myGrid = [...Array(10)].map(e => Array(10).fill(null));
    let enemyGrid = [...Array(10)].map(e => Array(10).fill(null));

    // Make a ship with desired length
    const makeShip = (length) => {
        return {
            id: length,
            length: length,
            sunken: false,
            positions: [],
        }
    }

    // Create all 4 ships 
    const ship1 = makeShip(2)
    const ship2 = makeShip(2)
    const ship3 = makeShip(3)
    const ship4 = makeShip(4)

     // Randomize ship poistions and put them on the grid
    const randomShipPos = (ship) => {
        let y = Math.floor(Math.random() * 9)
        let x = Math.floor(Math.random() * (9 - ship.length))
        let occupied = false

        for(let i = x; i < x + ship.length; i++){
            if(myGrid[y][i] !== null){
                occupied = true
            } 
        }

        if(occupied){
            console.log("HERE IS SHIP!!")
            randomShipPos(ship)
        } else {

            for(let i = x; i < x + ship.length; i++){
                myGrid[y][i] = ship
            }
        }
    }

    
    useEffect(()=> {
        setPlayerBoard(myGrid)
        setOpponentBoard(enemyGrid)
        console.log(playerBoard)
    },[])


    useEffect(()=>{
        randomShipPos(ship1)
        randomShipPos(ship2)
        randomShipPos(ship3)
        randomShipPos(ship4)
    },[])

  
    return (
        <>
            
            <div className="logo"></div>

            <div className="game-wrapper">
                <div>
                    <div><h3>{p1.username}</h3></div>
                    <div className="yourBoard">
                        {playerBoard.map((x) => x.map((y, i)=> {
                            return (
                                <div className={y
                                        ? "ship"
                                        : "cell"
                                    }
                                    key={i}>{i+1}
                                </div>
                                )
                            }
                        ))}
                    </div>
                </div>
                
                <div className='info-wrapper'>
                    <div className='turn'>
                        <h2>Someone's turn</h2>
                    </div>
                    <div className="boats-left">
                        <h3>Boats left: </h3>
                        <h3> 4 : 4 </h3>
                    </div>
                </div>

                <div>
                    <div><h3>{p2.username}</h3></div>
                        <div className="enemyBoard">
                                {opponentBoard.map((x) => x.map((y, i)=> {
                                    return (
                                        <div className= "cell"key={i}>{i+1}</div>
                                        )
                                    }
                                ))}
                        </div>
                    </div>
            </div>

        </>
    )
}

export default GameBoard