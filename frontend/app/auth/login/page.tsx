'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      router.push('/subjects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const THEME = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#94A3B8',
    white: '#FFFFFF'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${THEME.bg} 0%, #172554 100%)`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.7)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '48px 40px', 
        borderRadius: '24px', 
        width: '100%', 
        maxWidth: '440px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryHover} 100%)`, 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '24px',
            marginBottom: '16px'
          }}>🎓</div>
          <h1 style={{ color: THEME.white, fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Welcome Back</h1>
          <p style={{ color: THEME.secondary, fontSize: '15px', margin: 0 }}>Sign in to continue your learning journey.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: THEME.secondary, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                color: THEME.white,
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = THEME.primary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: THEME.secondary, fontSize: '13px', fontWeight: '600' }}>PASSWORD</label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                color: THEME.white,
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = THEME.primary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              required
            />
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#FCA5A5', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              marginTop: '8px',
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryHover} 100%)`, 
              color: THEME.white, 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: `0 8px 16px rgba(99, 102, 241, 0.25)`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              if(!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 20px rgba(99, 102, 241, 0.3)`;
              }
            }}
            onMouseLeave={(e) => {
              if(!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 16px rgba(99, 102, 241, 0.25)`;
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: THEME.secondary, fontSize: '15px' }}>
            Don't have an account?{' '}
            <a href="/auth/register" style={{ 
              color: THEME.primary, 
              textDecoration: 'none', 
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = THEME.white}
            onMouseLeave={(e) => e.currentTarget.style.color = THEME.primary}
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}