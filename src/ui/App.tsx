import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SongPage from './pages/SongPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/song/:songId" element={<SongPage/>} />
      </Routes>
    </BrowserRouter>    
  )
}

export default App
