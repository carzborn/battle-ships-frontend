import { createContext, useContext, useState } from 'react'
import socketio from "socket.io-client";

const GameContext = createContext()
const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

export const useGameContext = () => {
    return useContext(GameContext)
}

const GameContextProvider = ({ children }) => {

    const values = {
        socket,
    }

    return (
        <GameContext.Provider value={values}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContextProvider