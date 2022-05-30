import { Col, Row, Button, Form } from 'react-bootstrap'

const StartPage = () => {
    
    return (
        <Row>
            <Col lg={4} md={6} xs={8} className="mx-auto">
                <div className="logo"></div>
                <div className="start-wrapper">
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                placeholder="Enter your username"
                                required
                                type="text"
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