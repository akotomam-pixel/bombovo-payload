export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#080708' }}>✅ Next.js is Working!</h1>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>
        If you can see this page, Next.js is running correctly.
      </p>
      <a 
        href="/" 
        style={{ 
          display: 'inline-block',
          marginTop: '30px',
          padding: '15px 30px',
          backgroundColor: '#3772FF',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '25px',
          fontSize: '18px'
        }}
      >
        Go to Homepage
      </a>
      <div style={{ marginTop: '40px', color: '#666' }}>
        <p>Test checklist:</p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          <li>✅ Next.js 14 is running</li>
          <li>✅ TypeScript is working</li>
          <li>✅ Routing is functional</li>
        </ul>
      </div>
    </div>
  )
}



