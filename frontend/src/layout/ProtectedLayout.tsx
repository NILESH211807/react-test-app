import { useGetUserQuery } from '../redux/features/api/userSlice';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {

    const { data, isLoading } = useGetUserQuery("");

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-3 animate-spin border-indigo-600 border-l-transparent"></div>
            </div>
        )
    }

    return data ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedLayout
