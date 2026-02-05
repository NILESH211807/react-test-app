/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { useGetUserQuery, useLogoutMutation } from "../redux/features/api/userSlice"
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    const [logoutMutation, { isLoading: mutationLoading }] = useLogoutMutation();
    const { data } = useGetUserQuery("");
    const user = data?.data;

    const handleLogout = async () => {
        try {
            await logoutMutation({}).unwrap()
            toast.success("Logout successfully");
            navigate('/login', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='max-w-lg w-[90%] p-5 text-center border border-gray-800 rounded-md'>
                <h1 className='text-xl font-semibold text-center uppercase my-5'>Welcome {user?.name}</h1>
                <div className='flex flex-col items-center mb-5'>
                    <p className='mb-2 text-xl'>Email: {user?.email}</p>
                    <p className='mb-2 text-xl'>Created At: {user?.createdAt}</p>
                </div>
                <button type='button' onClick={handleLogout} className='w-full py-3 rounded-md my-2 max-w-50 bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out font-medium cursor-pointer'>
                    {mutationLoading ? 'Loading...' : 'Logout'}
                </button>
            </div>
        </div>
    )
}

export default Home
