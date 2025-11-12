
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Expenses from './pages/Expenses';
import Home from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/expenses" element={<Expenses />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
