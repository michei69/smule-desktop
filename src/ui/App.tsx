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
import Account from './pages/Account'
import PerformancePage from './pages/PerformancePage'
import SongOrPerformanceQuestion from './pages/SongOrPerformanceQuestion'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/song/:songId" element={<SongPage/>} />
        <Route path="/performance/:performanceId" element={<PerformancePage/>} />
        <Route path="/play/:type/:part/:songId" element={<SongPlay/>} />
        <Route path="/play/performance/:performanceId" element={<PerformancePlay/>} />
        <Route path="/duet-select/:songId" element={<DuetSelect/>} />
        <Route path="/search/:query" element={<Search/>} />
        <Route path="/finish-rec/:songId/:part/:fileName/:origTrackUrl/:ensembleType/:performanceId" element={<FinishedRecording/>} />
        <Route path="/account/:accountId" element={<Account/>} />
        <Route path="/what/:id" element={<SongOrPerformanceQuestion/>} />
      </Routes>
    </HashRouter>    
  )
}

export default App
