import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [loggedIn, setIsLoggedIn] = useState<boolean>(
        () => Boolean(localStorage.getItem('user_loggedIn'))
    );

    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login', { replace: true })
        }
    }, [loggedIn, navigate]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('user_loggedIn');
    }

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='max-w-lg w-[90%] p-5 text-center border border-gray-800 rounded-md'>
                {
                    loggedIn ? (
                        <>

                            <h1 className='font-semibold text-2xl text-green-600'>Login Success</h1>
                            <button type='button' className='bg-red-500 cursor-pointer py-1.5 px-5 mt-5 rounded-md font-semibold' onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <h1 className='font-semibold text-2xl text-red-500'>Login Please...</h1>
                    )
                }
            </div>
        </div>
    )
}

export default Home
