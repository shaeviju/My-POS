import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);  // Store the token in localStorage
      router.push('/dashboard');  // Redirect to the dashboard page
    } catch (err) {
      setError('Invalid credentials');
    }
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="p-8 bg-white rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
