import { HashRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SongPage from './pages/SongPage'
import PerformancePlay from './pages/PerformancePlay'
import Search from './pages/Search'
import SongPlay from './pages/SongPlay'
import DuetSelect from './pages/DuetSelect'
import FinishedRecording from './pages/FinishedRecording'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/song/:songId" element={<SongPage/>} />
        <Route path="/performance/:performanceId" element={<PerformancePlay/>} />
        <Route path="/play/:type/:part/:songId" element={<SongPlay/>} />
        <Route path="/duet-select/:songId" element={<DuetSelect/>} />
        <Route path="/search/:query" element={<Search/>} />
        <Route path="/finish-rec/:songId/:fileName" element={<FinishedRecording/>} />
      </Routes>
    </HashRouter>    
  )
}

export default App
