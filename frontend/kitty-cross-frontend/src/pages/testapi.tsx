import { useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kittiesData = [
          {
            id: 1000,
            chain: 121,
            genes: [31, 19, 8, 10, 9, 24, 23, 17],
          },
          {
            id: 1001,
            chain: 1,
            genes: [31, 19, 8, 10, 9, 24, 23, 0],
          },
        ];

        const response = await axios.post('https://kittycross-dall-e-server.onrender.com/kitties', kittiesData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div>
      <h1>Fetching Data with Axios</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default YourComponent;
