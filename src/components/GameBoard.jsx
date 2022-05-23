import React from 'react'
import { useEffect } from 'react'

const GameBoard = () => {
    const yourBoard = []
    const enemyBoard = []

    const createBoard = (team) => {
        for (let i=0; i<100; i++){
            team.push(<div className={`y${i}`} key={i} data-id={i}></div>)
        }
    }

    createBoard(yourBoard)
    createBoard(enemyBoard)

    console.log(yourBoard)
    console.log(enemyBoard)

    const handleClick = (e) => {
        console.log(e.target.data)

    }

    const handleMiss = (e) => {
        
    }
    
  return (
    <div >
        <h2 className="text-center">Time to sink some ships!</h2>


        <div className="game-wrapper">
            <div>
                <h3>Your Board</h3>
                <div className="yourBoard">{yourBoard}</div>
            </div>

            <div>
                <h3>friendly ships left: 4/4</h3>
                <h3>Enemy ships left: 4/4</h3>
            </div>

            <div>
                <h3>Enemy Board</h3>
                <div className="enemyBoard" onClick={handleClick}>{enemyBoard}</div>
            </div>
        </div>
    </div>
  )
}

export default GameBoard