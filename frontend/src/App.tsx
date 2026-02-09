import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom'
import ProtectedLayout from './layout/ProtectedLayout';

const Signup = lazy(() => import('./pages/(auth)/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/(auth)/Login'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const ForgotPassword = lazy(() => import('./pages/(auth)/ForgotPassword'));

const App = () => {

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-3 animate-spin border-indigo-600 border-l-transparent"></div>
            </div>
        }>
            <Routes>
                <Route path="/" element={<ProtectedLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                </Route>
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='forgot-password' element={<ForgotPassword />} />
            </Routes>
        </Suspense>
    )
}

export default App
