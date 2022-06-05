import { useEffect, useState } from 'react'
import {useGameContext} from '../contexts/GameContextProvider'

const GameBoard = () => {
  
    const {socket, p1, p2} = useGameContext()
    const [playerBoard, setPlayerBoard] = useState([]);
	const [opponentBoard, setOpponentBoard] = useState([]);
    const [shipsLeft, setShipsLeft] = useState(4)

    const ships = [
        {
            id: "ship1",
            length: 2,
            positions: [],
        },

        {
            id: "ship2",
            length: 2,
            positions: [],
        },

        {
            id: "ship3",
            length: 3,
            positions: [],
        },

        {
            id: "ship4",
            length: 4,
            positions: [],
        }
    ]

    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    const yourBoard = []
    const enemyBoard = []
    
    const createBoard = (mBoard, eBoard) => {
        
        for (let y=0; y<rows.length; y++ ) {
            for (let x=0; x<cols.length; x++){
                mBoard.push(<div className="cell" key={`${cols[x]}${rows[y]}`} data-id={`${cols[x]}${rows[y]}`}></div>)
                eBoard.push(<div className="cell" onClick={handleClick} key={`${cols[x]}${rows[y]}`} data-id={`${cols[x]}${rows[y]}`}></div>)
            }
        } 
        setPlayerBoard((playerBoard) => [...playerBoard, ...mBoard])    
        setOpponentBoard((opponentBoard) => [...opponentBoard, ...eBoard])    
    }

    let takenCords = []
    let occupied = null 

    // playerBoard.findIndex(x => x.id === '45');

    const generateShips = () => {

        ships.forEach((ship) => {
            ship.positions = []
            let yStart = rows[Math.floor(Math.random() * (rows.length + 1))]
            let xStart = cols[Math.floor(Math.random() * (cols.length - ship.length +1))]
          
            while(ship.positions.length < ship.length){     
                ship.positions.push(xStart + yStart)
                xStart = xStart +1 
            }
            
            occupied = ship.positions.some(r=> takenCords.includes(r))
            takenCords = [...takenCords, ...ship.positions]
            console.log(occupied)
            console.log(takenCords)
        })
    
        if (occupied) {
            takenCords = []
            console.log('here is already a boat')
            generateShips()
        }
    }

    const handleClick = (e) => {
        const clicked = e.target.getAttribute("data-id")
        const clickedIndex = takenCords.indexOf(clicked)

        socket.emit('user:clicked', clicked);

        if (takenCords.includes(clicked)) {
            socket.emit("user:reply", clicked, true)
            e.target.className = "hit"
    
            if (clickedIndex <= 1) {
                ships[0].length-- 
                if (ships[0].length === 0){
                    setShipsLeft((prevState) => prevState - 1);
                }
            }

            if (clickedIndex >= 2 && clickedIndex <= 3){
                ships[1].length--
                if (ships[1].length === 0){
                    setShipsLeft((prevState) => prevState - 1);
                } 
            }

            if(clickedIndex >= 4 && clickedIndex <=6){
                ships[2].length--
                if (ships[2].length === 0){
                    setShipsLeft((prevState) => prevState - 1);
                }
            } 

            if(clickedIndex >=7 && clickedIndex <=10){
                ships[3].length--
                if (ships[3].length === 0){
                    setShipsLeft((prevState) => prevState - 1);
                }
            } 

            } else {
            socket.emit('user:reply', clicked, false)
                e.target.className = "miss"
            }

        console.log(`shots fired at ${clicked}`);
        
    }
    console.log(shipsLeft)

    useEffect(()=>{
        createBoard(yourBoard,enemyBoard)
        generateShips()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    socket.on('user:click', handleClick)
    // socket.on('user:recieved', recieveShot)

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
                        <h3>{shipsLeft} : {shipsLeft}</h3>
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