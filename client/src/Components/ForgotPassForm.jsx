import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BASE_URL = require('../Assets/JSON/Base_Url.json');

const ForgotPassForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setSuccess(data.message);
        toast.success(data.message);
        Navigate('/login');
      } else {
        setError(data.message);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-transparent">
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 rounded-lg p-8">
        <div className="flex flex-row items-center ">
          <label className="text-lg font-medium mr-4">Email:</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="p-2 border text-black border-gray-900 rounded-lg w-full" />
        </div>
        <div>
          <button type="submit" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
        {error && <p className="text-white-500 text-xxl mt-4">{error}</p>}
        {success && <p className="text-white-500 text-xxl mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default ForgotPassForm;
