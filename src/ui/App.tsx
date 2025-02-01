import { BrowserRouter, HashRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SongPage from './pages/SongPage'
import PerformancePlay from './pages/PerformancePlay'
import Search from './pages/Search'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/song/:songId" element={<SongPage/>} />
        <Route path="/performance/:performanceId" element={<PerformancePlay/>} />
        <Route path="/search/:query" element={<Search/>} />
      </Routes>
    </HashRouter>    
  )
}

export default App
