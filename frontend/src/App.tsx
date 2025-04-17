import { useAuthContext } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
// import Schedule from './pages/Schedule'
import NavBar from './components/Navbar'
import SettingsPage from './pages/Settings'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import NotFound from './pages/NotFound'
function App() {

  const {user} = useAuthContext();


  return (
    <>

      <BrowserRouter>
        {user && <NavBar />}
        <Routes>
          <Route path="/" element={user ? <Home /> : <LoginPage />} />
          {/* <Route path="/schedule" element={user ? <Schedule /> : <LoginPage />} /> */}
          <Route path="/settings" element={user ? <SettingsPage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
