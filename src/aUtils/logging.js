const logToServer = async (message) => {
    try {
      await fetch('http://54.204.61.104:3000/log', {
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