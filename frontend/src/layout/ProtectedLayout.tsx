import Navbar from '@/components/Navbar';
import { useGetUserQuery } from '../redux/features/api/userSlice';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    const { data, isLoading, isError } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 animate-spin border-indigo-600 border-l-transparent"></div>
            </div>
        );
    }

    if (isError) {
        return <Navigate to="/login" replace />;
    }

    return data ? (
        <>
            <Navbar />
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedLayout;
