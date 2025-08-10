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
import Register from './pages/Register'
import EditProfile from './pages/EditProfile'
import ArrangementsSubPage from './subpages/Arrangements'
import CreateArrangementPage from './pages/CreateArrangement'
import LoginSmuleDotComSubPage from './subpages/LoginSmuleDotCom'
import UploadMP3SubPage from './subpages/UploadMP3SubPage'
import CustomizeArrSubPage from './subpages/CustomizeArr'
import LyricsSubPage from './subpages/LyricsSubPage'
import LyricsSyncSubPage from './subpages/LyricsSyncSubPage'
import { SegmentsSubPage } from './subpages/SegmentsSubPage'
import PublishArrSubPage from './subpages/PublishArrSubPage'

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
            <Route path="arr" element={<ArrangementsSubPage/>} />
            <Route path="live" element={<LiveTest/>} />
          </Route>
          <Route path="/create-arr" element={<CreateArrangementPage/>}>
            <Route index element={<LoginSmuleDotComSubPage/>} />
            <Route path="upload" element={<UploadMP3SubPage/>} />
            <Route path="customize" element={<CustomizeArrSubPage/>} />
            <Route path="lyrics" element={<LyricsSubPage/>} />
            <Route path="sync" element={<LyricsSyncSubPage/>} />
            <Route path="segments" element={<SegmentsSubPage/>} />
            <Route path="publish" element={<PublishArrSubPage/>} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
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
          <Route path="/edit-profile" element={<EditProfile/>}/>
          <Route path="/what/:id" element={<SongOrPerformanceQuestion/>} />
        </Routes>
      </HashRouter>    
    </>
  )
}

export default App
