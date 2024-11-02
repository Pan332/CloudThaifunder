import React from 'react';

function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/">Go to Home</a>
    </div>
  );
}

export default Unauthorized;
