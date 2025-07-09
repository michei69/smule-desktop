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
import Songbook from './subpages/Songbook'
import Explore from './subpages/Explore'
import SettingsSubPage from './subpages/SettingsSubPage'
import RecordingsPerfomancesAndStuffAccount from './subpages/RecordingsPerformancesAndStuffAcccount'
import FollowersFollowingSubPage from './subpages/FollowersFollowingSubPage'
import Chat from './subpages/Chat'
import PerformanceChildren from './pages/PerformanceChildren'
import LiveTest from './subpages/LiveTest'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <HashRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route index element={<Songbook/>} />
            <Route path="explore" element={<Explore/>} />
            <Route path="settings" element={<SettingsSubPage/>} />
            <Route path="chat" element={<Chat/>} />
            <Route path="live" element={<LiveTest/>} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/song/:songId" element={<SongPage/>} />
          <Route path="/performance/:performanceId" element={<PerformancePage/>} />
          <Route path="/performance/:performanceKey/children" element={<PerformanceChildren/>} />
          <Route path="/play/:type/:part/:songId" element={<SongPlay/>} />
          <Route path="/play/performance/:performanceId" element={<PerformancePlay/>} />
          <Route path="/duet-select/:songId" element={<DuetSelect/>} />
          <Route path="/search/:query" element={<Search/>} />
          <Route path="/finish-rec/:songId/:part/:fileName/:origTrackUrl/:ensembleType/:performanceId" element={<FinishedRecording/>} />
          <Route path="/finish-rec/:songId/:part/:fileName/:ensembleType" element={<FinishedRecording/>} />
          <Route path="/account/:accountId" element={<Account/>}>
            <Route index element={<RecordingsPerfomancesAndStuffAccount/>}/>
            <Route path="details" element={<FollowersFollowingSubPage/>}/>
          </Route>
          <Route path="/what/:id" element={<SongOrPerformanceQuestion/>} />
        </Routes>
      </HashRouter>    
    </>
  )
}

export default App
