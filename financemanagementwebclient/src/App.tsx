
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Expenses from './pages/Expenses';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Sources from './pages/Sources';
import { AIPDataSource, DummyDataSource, type DataSource } from "./services/data-source-service";

function App() {
    const ds: DataSource = new AIPDataSource();//new DummyDataSource();
    ds.useDummyData = window.location.hostname === 'localhost';

    return (
        <BrowserRouter>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/expenses" element={<Expenses datasource={ds} />} />
                    <Route path="/sources" element={<Sources datasource={ds} />} />
                    <Route path="/notfound" element={<NotFound />} />
                    <Route path="*" element={ <Navigate to="/notfound" replace /> } />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
