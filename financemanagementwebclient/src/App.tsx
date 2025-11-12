import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Expenses from './pages/Expenses';
import Home from './pages/Home';

function App() {
    // TODO: react router
    return (
        <BrowserRouter>
            <FluentProvider theme={webDarkTheme}>
                <div>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/expenses" element={<Expenses />} />
                    </Routes>
                </div>
            </FluentProvider>
        </BrowserRouter>
    )
}

export default App
