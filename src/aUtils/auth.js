// utils/auth.js
export const decodeJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  };
  
  export const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = decodeJwt(token);
    return decoded.exp < Date.now() / 1000;
  };

  