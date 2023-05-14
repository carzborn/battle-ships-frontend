import { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
});

export const useGameContext = () => {
  return useContext(GameContext);
};

const GameContextProvider = ({ children }) => {
  const [fullGame, setFullGame] = useState(false);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const values = {
    socket,
    fullGame,
    setFullGame,
    p1,
    setP1,
    p2,
    setP2,
  };

  return (
    <GameContext.Provider value={values}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
