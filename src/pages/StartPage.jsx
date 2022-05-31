import { useEffect, useState } from 'react'
import { useGameContext } from '../contexts/GameContextProvider'
import { Col, Row, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


const StartPage = () => {
    const [ username, setUsername] = useState('')
    const [room, setRoom] = useState()
    const [roomlist, setRoomlist] = useState([])
    const { setGameUsername, socket} = useGameContext()
    const navigate = useNavigate()

    const handleSubmit = e => {
		e.preventDefault()

		setGameUsername(username)

        socket.emit('user:joined', username, room, status => {
            console.log(`successfully joined ${room} as ${username}`, status)
        })

        // redirect to game room
		navigate(`/rooms/${room}`)
	}

    useEffect(() => {
		// send roomlist event to server
		socket.emit('get-room-list', rooms => {
			setRoomlist(rooms)
		})
	}, [socket])

    return (
        <Row>
            <Col lg={4} md={6} xs={8} className="mx-auto">
                <div className="logo"></div>
                <div className="start-wrapper">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                type="text"
                                value={username}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="room">
					        <Form.Select
                                onChange={e => setRoom(e.target.value)}
                                required
                                value={room}
                            >
                                {roomlist.length === 0 && <option disabled>Loading...</option>}
                                {roomlist.length && (
                                    <>
                                        <option value="">Select a game to join</option>
                                        {roomlist.map(r =>
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        )}
                                    </>
                                )}
                            </Form.Select>
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