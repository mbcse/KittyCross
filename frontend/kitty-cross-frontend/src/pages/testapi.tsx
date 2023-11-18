import { useEffect, useState } from "react";
import axios from "axios";
import KittyCard from "../components/Profile/KittyCard";
const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const kittydeets = {
    isGestating: false,
    isReady: true,
    cooldownIndex: '3', // Represented as a string
    nextActionAt: '1637260000', // Represented as a string
    siringWithId: '0', // Represented as a string
    birthTime: '1637250000', // Represented as a string
    matronId: '1', // Represented as a string
    sireId: '2', // Represented as a string
    generation: '1', // Represented as a string
    genes: '12345678901234567890', // Represented as a string
  };
  
const YourComponent = () => {
  const [getImgURLS, setImgURLS] = useState();

  useEffect(() => {
    const API_LINK = "https://kitty-cross-server-2.onrender.com/kitties";
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

        const response = await axios.post(API_LINK, kittiesData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(response.data);
        setImgURLS(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [KittyCard]);

  return (
    <div>
      {getImgURLS ? (
        Object.entries(getImgURLS).map(([id, imgUrl]) => (
          <KittyCard key={id} kittyId={id} kittyImg={imgUrl? imgUrl as string : IMAGE} chainId={12} kitty={kittydeets}  />
        ))
      ) : (
        <div>Fetching Data</div>
      )}
      Hello
    </div>
  );
};

export default YourComponent;
