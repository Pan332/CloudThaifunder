import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const getenvToken = (req, res) => {
  try{
    const config = {
        VITE_SLIP_API_TOKEN: process.env.VITE_SLIP_API_TOKEN,
    };
  
    res.json(config);
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
export const getenvCookie = (req, res) => {
  try{  
  const config = {
        VITE_SLIP_COOKIE: process.env.VITE_SLIP_COOKIE,
    };
  
    res.json(config);
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const getenvLink = (req, res) => {
    try{
    const config = {
        VITE_SLIP_API_LINK: process.env.VITE_SLIP_API_LINK,
    };
  
    res.json(config);
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const getenvAll = (req, res) => {
    try {
      const config = {
        VITE_SLIP_API_TOKEN: process.env.VITE_SLIP_API_TOKEN,
        VITE_SLIP_COOKIE: process.env.VITE_SLIP_COOKIE,
        VITE_SLIP_API_LINK: process.env.VITE_SLIP_API_LINK,
      };
  
      res.json(config);
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };