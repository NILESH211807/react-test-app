/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../redux/features/api/authSlice';
import toast from 'react-hot-toast';
import { signupSchema } from '../../validations/authValidator';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export type SignupForm = {
    name: string;
    email: string;
    password: string;
}

const Signup = () => {

    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: yupResolver(signupSchema)
    });

    const [signupMutation, { isLoading }] = useSignupMutation();

    const onSubmit = async (formData: SignupForm) => {
        try {
            await signupMutation(formData).unwrap();
            toast.success("Account created successfully");
            navigate('/', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    };

    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <div className='max-w-lg w-[90%] p-5 border border-gray-800 rounded-md'>
                <h1 className='text-xl font-semibold text-center uppercase my-5'>Create new account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className='w-full my-2 border border-gray-600 p-3 rounded-md outline-none focus:border-indigo-600'
                        type="text" placeholder='Enter Name'
                        {...register('name')} />
                    {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}

                    <input
                        className='w-full my-2 border border-gray-600 p-3 rounded-md outline-none focus:border-indigo-600'
                        type="email" placeholder='Enter Email'
                        {...register('email')} />
                    {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

                    <div className='w-full my-2 border border-gray-600 rounded-md outline-none focus-within:border-indigo-600 relative'>
                        <input
                            className='w-full h-full p-3 outline-none'
                            type={passwordVisible ? 'text' : 'password'} placeholder='Enter Password'
                            {...register('password')} />

                        {
                            <button type='button' className="absolute top-1/2 cursor-pointer right-0 transform -translate-x-1/2 -translate-y-1/2" onClick={() => setPasswordVisible(prev => !prev)}>
                                {
                                    passwordVisible ? <EyeOff /> : <Eye />
                                }
                            </button>
                        }
                    </div>
                    {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

                    <button type="submit" className='w-full py-3 rounded-md my-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out font-medium cursor-pointer'>
                        {isLoading ? 'Loading...' : 'Signup'}
                    </button>
                </form>
                <div>
                    <p className='text-center'>Already have an account? <Link to="/login" className='text-indigo-600 font-semibold'>Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup
