import { createContext, useContext, useState } from 'react'
import socketio from "socket.io-client";

const GameContext = createContext()
const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

export const useGameContext = () => {
    return useContext(GameContext)
}

const GameContextProvider = ({ children }) => {

    const [fullGame, setFullGame] = useState(false)
    const [p1, setP1] = useState('')
    const [p2, setP2] = useState('')

    const values = {
        socket,
        fullGame,
        setFullGame,
        p1, 
        setP1, 
        p2, 
        setP2
    }

    return (
        <GameContext.Provider value={values}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContextProvider