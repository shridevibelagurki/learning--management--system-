import React from 'react';
import { FileText, Download } from 'lucide-react';

const Materials = () => {
  const materials = [
    { title: 'React Cheatsheet 2024', size: '2.4 MB', type: 'PDF' },
    { title: 'Python Data Science Handbook', size: '15.1 MB', type: 'PDF' },
    { title: 'JavaScript Interview Questions', size: '1.2 MB', type: 'DOCX' },
    { title: 'System Design Fundamentals', size: '8.4 MB', type: 'PDF' }
  ];

  return (
    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '16px' }}>Study Materials</h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px' }}>
        Download supplementary resources, cheatsheets, and guides to help you ace your courses.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {materials.map((mat, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <FileText color="#475569" size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.1rem' }}>{mat.title}</h3>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{mat.type} • {mat.size}</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f46e5' }}>
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
