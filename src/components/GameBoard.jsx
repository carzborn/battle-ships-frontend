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

    useEffect(()=> {
        setPlayerBoard(myGrid)
        setOpponentBoard(enemyGrid)
        console.log(playerBoard)
    },[])

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
  
    return (
        <>
            <div className="logo"></div>

            <div className="game-wrapper">
                <div>
                    <h3>{p1.username}</h3>
                    <div className="yourBoard">{playerBoard}</div>
                </div>

                <div className='info-wrapper'>
                    <div className='turn'>
                        <h2>Someones turn</h2>
                    </div>
                    <div className="boats-left">
                        <h3>Boats left: </h3>
                        <h3>4 : 4</h3>
                    </div>
                </div>

                <div>
                    <h3>{p2.username}</h3>
                    <div className="enemyBoard">
                        {opponentBoard}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameBoard