import { Route, Routes } from 'react-router-dom'
import Login from './pages/(auth)/Login'
import Home from './pages/Home'
import Signup from './pages/(auth)/Signup'
import ProtectedLayout from './layout/ProtectedLayout'

const App = () => {
    return (
        <div className='w-full min-h-screen bg-gray-900 text-white'>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<ProtectedLayout />}>
                    <Route path='/' element={<Home />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
