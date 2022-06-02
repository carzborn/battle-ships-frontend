import { useEffect, useState } from 'react'
import { useGameContext } from '../contexts/GameContextProvider'
import { Col, Row, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


const StartPage = () => {
    const {socket} = useGameContext()
    const [ username, setUsername] = useState('')
    const [p1, setP1] = useState('')
    const [p2, setP2] = useState('')
    const [fullGame, setFullGame] = useState('')
    const navigate = useNavigate()

    const handleSubmit = e => {
		e.preventDefault()
        
        socket.emit('user:joined', username)
        // redirect to game room
        navigate(`/game`)
	}

    useEffect(() => {
        socket.on('game:profiles', function(players){
            if(players.length === 2){
                const player1 = players.find((player) => player.id === socket.id)
                const player2 = players.find((player) => player.id !== socket.id)

                setP1(player1)
                setP2(player2)
            }
        })

        socket.on('game:full', () => {
          setFullGame(true)      
        })
          
}, [p1, p2])

    return (
        <Row>
            <Col lg={4} md={6} xs={8} className="mx-auto">
                <div className="logo"></div>
                <div className="start-wrapper">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                type="text"
                                value={username}
                            />
                        </Form.Group>

                        <Button 
                            variant="success" 
                            type="submit" 
                            className='start-btn'>
                                Join Game
                        </Button>

                    </Form>
                </div>
            </Col>
        </Row>
	)
}

export default StartPage