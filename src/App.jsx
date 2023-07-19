import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const SUPAB_URL='https://sbehsdsxxocfemtstwmc.supabase.co'
const SUPAB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZWhzZHN4eG9jZmVtdHN0d21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MTg4NjcsImV4cCI6MjAwNTE5NDg2N30.G6I9TJ10onebCrOInbVvNxizczq_FjgduFQEHeOK_pw'
const supabase = createClient(SUPAB_URL, SUPAB_KEY);

function App() {
  const [featherError, setFeatherError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

  useEffect(()=>{
    const fetchSmoothies=async()=>{
      const {data,error}=await supabase
      .from('database')
      .select()
      if(error){
        setFeatherError(`Coud not`)
        setSmoothies(null)
        console.log(error)
      }
      if(data){
        setSmoothies(data)
        setFeatherError(null)
      }
    }
    fetchSmoothies()
  },[])

  return (
    <>
      <div>
       {featherError && (<p>featherError</p>)}
       {smoothies&&(<div>
        {smoothies.map(smothie=>(
          <div key={smothie.id}>
            <h2>{smothie.name}</h2>
            
            <h2>{smothie.city}</h2>
            
          </div>
        ))}
       </div>)}
      </div>
    </>
  );
}

export default App;




