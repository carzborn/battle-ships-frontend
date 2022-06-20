import { useEffect, useState } from 'react'
import {useGameContext} from '../contexts/GameContextProvider'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

const GameBoard = () => {
  
    const navigate = useNavigate()
    const {socket, p1, setP1, p2, setP2, setFullGame} = useGameContext()
    const [playerBoard, setPlayerBoard] = useState([]);
	const [opponentBoard, setOpponentBoard] = useState([]);
    const [shipsLeft, setShipsLeft] = useState(4);
    const [enemyShipsLeft, setEnemyShipsLeft] = useState(4);
    const [myTurn, setMyTurn] = useState();
    const [playerMisses, setPlayerMisses] = useState([]);
    const [playerHits, setPlayerHits] = useState([]);
    const [opponentMisses, setOpponentMisses] = useState([])
    const [opponentHits, setOpponentHits] = useState([])
    const [gameOver, setGameOver] = useState(false)
    
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
        let y = Math.floor(Math.random() * 10)
        let x = Math.floor(Math.random() * (11 - ship.length))
        let occupied = false

        for(let i = x; i < x + ship.length; i++){
            if(myGrid[y][i] !== null){
                occupied = true
            } 
        }

        if(occupied){
            randomShipPos(ship)
        } else {

            for(let i = x; i < x + ship.length; i++){
                myGrid[y][i] = ship
            }
        }
    }

    const handleClick = (index,i) => {
        if(myTurn){
            setMyTurn(false)
            socket.emit('user:clicked', index, i,)
        }
    }

    const handleShot = (index,i,) => {
        setMyTurn(true)

        if (myGrid[index][i] !== null) {
                socket.emit('user:reply', index,i,true)

                // reduce ships length by 1 and set classname to "hit"
                myGrid[index][i].length--

                setOpponentHits((opponentHits) => {
                    return [...opponentHits, `${index}${i}`]
                })


                // if target ship is sunken reduce ships left by 1
                if (myGrid[index][i].length === 0) {
                    setShipsLeft((prevState) => prevState - 1)
                    socket.emit("ship:sunken")
                }

        } else {
            setOpponentMisses((opponentMisses) => {
				return [...opponentMisses, `${index}${i}`]
			}) 

            myGrid[index][i] = false
            socket.emit('user:reply', index,i, false)
        }
    }

    const handleResult = (index, i, hit) => {
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
    }

    const handleShipsSunk = () =>{
        setEnemyShipsLeft((prevState) => prevState - 1)
    }

    const handlePlayerLeft = () =>{
        setP1('')
        setP2('')
        setFullGame(false)
        navigate(`/`)
    }

    const backToLobby = () => {
        navigate(`/`)
        setFullGame(false)
        setP1('')
        setP2('')
        socket.emit('player:left')
    }

    useEffect(() =>{
        if(shipsLeft === 0 || enemyShipsLeft === 0){
            setGameOver(true)
        }
    },[shipsLeft,enemyShipsLeft])

    useEffect(()=> {
        setPlayerBoard(myGrid)
        setOpponentBoard(enemyGrid)
        setMyTurn(p1.turn)
        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        randomShipPos(ship1)
        randomShipPos(ship2)
        randomShipPos(ship3)
        randomShipPos(ship4)
        // eslint-disable-next-line
    },[])


    useEffect(()=>{
        socket.on('user:shot', handleShot)
        socket.on('shot:result', handleResult)
        socket.on('ship:sunken', handleShipsSunk)
        
        return () => {
            socket.off('user:shot', handleShot)
            socket.off('shot:result', handleResult)
            socket.off('ship:sunken', handleShipsSunk)
        }
        // eslint-disable-next-line
    },[socket])

    useEffect(()=>{
        socket.on("player:disconnected", handlePlayerLeft)
        // eslint-disable-next-line
    },[socket])

    return (
        <>
            <div className="logo"></div>

            {gameOver && 
                <div className="gameOverWrapper">
                    <h2>Play Again?</h2>
                    <div className="gameOverButtons">
                        <button className="exit" onClick={backToLobby} >Exit</button>
                        <button className="playAgain" onClick={backToLobby} >Play Again!</button>
                    </div>
                </div>
            }

            <div className="game-wrapper">
                <div>
                    <div><h3>{p1.username}</h3></div>
                    <div className={
                        classNames({
                            'yourBoard': true,
                            'disabled': gameOver,
                        })
                    }>
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
                                    })}
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
                        <h3>{shipsLeft} : {enemyShipsLeft}</h3>
                    </div>
                    {enemyShipsLeft === 0 && (
                        <div>
                            <h1>You won!</h1>
                        </div>
                    )}

                    {shipsLeft === 0 && (
                        <div>
                            <h1>You Lost!</h1>
                        </div>
                    )}
                </div>

                <div>
                    <div><h3>{p2.username}</h3></div>
                    <div className={classNames({
                            'enemyBoard':true,
                            'disabled': !myTurn || gameOver,                            
                    })}>
                            {opponentBoard.map((x,index) => x.map((y, i)=> {
                                const miss = playerMisses.find(pos => pos ===`${index}${i}`)
                                const hits = playerHits.find(pos => pos ===`${index}${i}`)
                                return (
                                    <div className={
                                        classNames({
                                            'cell': true,
                                            'hit': hits,
                                            'miss' : miss
                                        })}
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