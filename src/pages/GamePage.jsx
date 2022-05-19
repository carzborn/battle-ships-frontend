import { Col, Row } from 'react-bootstrap'
const GamePage = () => {
	return (
		<>
            <Row>
                <Col md={5}>
                    <div className='P1-board'>
                        <h4>Gameboard p1</h4>
                    </div>
                </Col>
                <Col md={2}>
                    <div className='Player-turn'>
                        <h2>Nisses Tur</h2>
                    </div>
                </Col>
                <Col md={5}>
                    <div className='P2-board'>
                        <h4>Gameboard p2</h4>
                    </div>
                </Col>
            </Row>
		</>
	)
}

export default GamePage