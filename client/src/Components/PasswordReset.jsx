
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../Assets/JSON/Base_Url.json';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const Navigate = useNavigate()


  console.log(token);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        toast('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        toast('Passwords do not match');  
        setLoading(false);
        return;
      }
      const response = await fetch(`${BASE_URL.BASE_URL}user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuccess(data.message);

        setError(null);
        toast.success(data.message);
        Navigate('/login')
      } else {
        setError(data.message);
        setSuccess(null);
      }
      setLoading(false);
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="container mx-auto p-4 md:p-6 lg:p-8  rounded shadow">
        <h1 className="text-3xl text-center font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div
                className="absolute right-0 top-0 mt-2 mr-2"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye className='text-black' /> 
                ) : (
                  <FaEyeSlash className='text-black'  />
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <div
                className="absolute right-0 top-0 mt-2 mr-2"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye className='text-black'  /> 
                ) : (
                  <FaEyeSlash className='text-black' />
                )}
              </div>
            </div>
          </div>
          <div className='flex item-center justify-center' >
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Password'}
          </button>
          </div>
          {error && (
            <p className="text-white-500 text-xxl italic mt-2">{error}</p>
          )}
          {success && (
            <p className="text-white-500 text-xxl italic mt-2">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
