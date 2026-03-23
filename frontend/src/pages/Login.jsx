import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import apiClient from '../../lib/apiClient';

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) navigate('/subjects', { replace: true });
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim(),
        password,
      });

      const accessToken = response?.data?.accessToken;
      if (!accessToken) {
        throw new Error('No access token returned by server');
      }

      localStorage.setItem('accessToken', accessToken);
      navigate('/subjects', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mt-10 bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Login</h1>
        <p className="text-slate-500 mb-6">Sign in to continue your learning.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your password"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-sm">
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

