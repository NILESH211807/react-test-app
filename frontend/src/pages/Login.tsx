import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 1. Define state with types
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const [loggedIn] = useState<boolean>(
        () => Boolean(localStorage.getItem('user_loggedIn'))
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            navigate('/', { replace: true })
        }
    }, [loggedIn, navigate]);


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        localStorage.setItem('user_loggedIn', 'true');
        navigate('/', { replace: true })
    };

    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <div className='max-w-lg w-[90%] p-5 border border-gray-800 rounded-md'>
                <h1 className='text-xl font-semibold text-center uppercase my-5'>Login</h1>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        className='w-full my-2 border border-gray-600 p-3 rounded-md'
                        type="text" name="email" placeholder='Enter Email'
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input
                        className='w-full my-2 border border-gray-600 p-3 rounded-md'
                        type="text" name="password" placeholder='Enter Password'
                        value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className='w-full py-3 rounded-md my-2 bg-indigo-600 font-medium cursor-pointer'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
