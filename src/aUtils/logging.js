const logToServer = async (message) => {
    try {
      await fetch('http://23.22.78.84:4321/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to log message to server:', error);
    }
  };
  
  export default logToServer;