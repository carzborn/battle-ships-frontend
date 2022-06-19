import { useEffect, useState } from 'react'
import {useGameContext} from '../contexts/GameContextProvider'
import classNames from 'classnames'
// import { useNavigate } from 'react-router-dom'

const GameBoard = () => {
  
    // const navigate = useNavigate()
    const {socket, p1, setP1, p2, setP2, setFullGame} = useGameContext()
    const [playerBoard, setPlayerBoard] = useState([]);
	const [opponentBoard, setOpponentBoard] = useState([]);
    const [shipsLeft, setShipsLeft] = useState(4);
    const [myTurn, setMyTurn] = useState();
    const [playerMisses, setPlayerMisses] = useState([]);
    const [playerHits, setPlayerHits] = useState([]);
    const [opponentMisses, setOpponentMisses] = useState([])
    const [opponentHits, setOpponentHits] = useState([])
    
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

    const handleClick = (index,i) => {
        if(myTurn){
            console.log(index, i)
            setMyTurn(false)
            socket.emit('user:clicked', index, i,)
        } else{
            console.log("ITS NOT YOUR TURN")
        }
        
    }

    const handleShot = (index,i,) => {
        setMyTurn(true)

        console.log(index,i)
        console.log(myGrid[index][i])


        if (myGrid[index][i] !== null) {
                socket.emit('user:reply', index,i,true)
                // reduce ships length by 1 and set classname to "hit"
                console.log(myGrid[index][i].length - 1)
                myGrid[index][i].length--
                console.log("HIT")

                setOpponentHits((opponentHits) => {
                    return [...opponentHits, `${index}${i}`]
                })


                // if target ship is sunken reduce ships left by 1
                if (myGrid[index][i].length === 0) {
                    setShipsLeft((prevState) => prevState - 1)
                    console.log("Ett skepp nere")
                }

                console.log(myGrid)

        } else {
            console.log("MISS")
            setOpponentMisses((opponentMisses) => {
				return [...opponentMisses, `${index}${i}`]
			}) 

            console.log(playerMisses)
            myGrid[index][i] = false
            socket.emit('user:reply', index,i, false)
            console.log(myGrid)
        }
    }


    const handleResult = (index, i, hit) => {
        console.log(index,i,hit)

        if(hit){
            enemyGrid[index][i] = true
            setPlayerHits((playerHits) => {
                return [...playerHits, `${index}${i}`]
            })
        } else {
            setPlayerMisses((playerMisses) => {
				return [...playerMisses, `${index}${i}`]
			}) 
        }

        console.log(myGrid)
    }
    
    useEffect(()=> {
        setPlayerBoard(myGrid)
        setOpponentBoard(enemyGrid)
        setMyTurn(p1.turn)
        console.log(myGrid)
    },[])


    useEffect(()=>{
        randomShipPos(ship1)
        randomShipPos(ship2)
        randomShipPos(ship3)
        randomShipPos(ship4)
    },[])


    useEffect(()=>{
        socket.on('user:shot', handleShot)
        socket.on('shot:result', handleResult)
        
        return () => {
            socket.off('user:shot', handleShot)
            socket.off('shot:result', handleResult)
        }

    },[socket])

  
    return (
        <>

            <div className="logo"></div>

            <div className="game-wrapper">
                <div>
                    <div><h3>{p1.username}</h3></div>
                    <div className="yourBoard">
                        {playerBoard.map((x,index) => x.map((y, i)=> {
                            const miss = opponentMisses.find(pos => pos ===`${index}${i}`)
                            const hits = opponentHits.find(pos => pos ===`${index}${i}`)
                            return (
                                <div className={
                                    classNames({
                                        'ship': y,
                                        'cell': true,
                                        'hit': hits,
                                        'miss' : miss
                                        
                                    })                                        
                                    }
                                    data-pos={`${index}${i}`}
                                    key={i}>{i+1}
                                </div>
                                )
                            }
                        ))}
                    </div>
                </div>
                
                <div className='info-wrapper'>
                    <div className='turn'>
                        {myTurn ? <h2>{p1.username}'s turn</h2> : <h2>{p2.username}'s turn</h2>}
                    </div>
                    <div className="boats-left">
                        <h3>Boats left: </h3>
                        <h3>4 : {shipsLeft}</h3>
                    </div>
                </div>

                <div>
                    <div><h3>{p2.username}</h3></div>
                    <div className={myTurn ? "enemyBoard" : "enemyBoard disabled"   }>
                            {opponentBoard.map((x,index) => x.map((y, i)=> {
                                const miss = playerMisses.find(pos => pos ===`${index}${i}`)
                                const hits = playerHits.find(pos => pos ===`${index}${i}`)
                                return (
                                    <div className={
                                        classNames({
                                            'cell': true,
                                            'hit': hits,
                                            'miss' : miss
                                        })
                                    }
                                    onClick={(e)=> {handleClick(index,i,e)}}
                                    data-pos={`${index}${i}`}
                                    key={i}>{i+1}
                                    </div>
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