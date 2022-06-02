import GameBoard from '../components/GameBoard'
import { useGameContext } from '../contexts/GameContextProvider'
const GamePage = () => {

	const {fullGame, p1, p2} = useGameContext()

	return (
		<>

			{p1 && p2 && ( <GameBoard /> )}

			{ !p2 && !fullGame &&(
				<h2>Wait for opponent...</h2>
			)}

			{fullGame &&(
				<div>
					<h2>This game is full, please wait!</h2>
				</div>
			)}
		</>
	)
}

export default GamePage