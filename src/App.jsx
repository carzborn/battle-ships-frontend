import Container from 'react-bootstrap/Container'
import { Routes, Route } from 'react-router-dom'
import GamePage from './pages/GamePage'
import StartPage from './pages/StartPage'
import PageNotFound from './pages/PageNotFound'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

function App() {
  return (
    <div className="App">
        <Container className='py-3'>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/rooms/:room_id" element={<GamePage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Container>
    </div>
  );
}

export default App;