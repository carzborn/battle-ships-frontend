import { Col, Row, Button } from 'react-bootstrap'
const StartPage = () => {
    return (
		<>
            <Row>
                <Col md={8} className="mx-auto">
                    <div className="start-wrapper">
                        <h1>Click to start game!</h1>
                        <Button className='tja'>Starta</Button>
                    </div>
                </Col>
            </Row>

		</>
	)
}

export default StartPage