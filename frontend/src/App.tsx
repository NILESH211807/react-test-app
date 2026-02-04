import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
    return (
        <div className='w-full min-h-screen bg-gray-900 text-white'>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home />} />
            </Routes>
        </div>
    )
}

export default App
