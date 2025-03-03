"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {

    const fetchData = async () => { 
      setLoading(true)
      try {
        let config = {
          method:"get",
          url:"/api/user-registration",
          headers: {
            "Content-Type": "application/json",
          },
        }
        const response = await axios.request(config);
        console.log(response.data);
        setData(response.data); 
        
      } catch (error) {
        console.log(error);        
      } finally {
        setLoading(false)
      }
    }
    fetchData();  
  }, [])


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <h1>next app</h1>
     {
      loading ? <div>Loading...</div> :  <pre>{JSON.stringify(data, null, 2)}</pre> 
     }
    </div>
  );
}
