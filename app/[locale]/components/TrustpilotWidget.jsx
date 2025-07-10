"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TrustpilotWidget = () => {
  const router = useRouter();
  useEffect(() => {
    // Dynamically load the Trustpilot script on the client side
    const loadTruspiolt =  () =>{
    const oldwidget = document.getElementById("trustbox");
    if(oldwidget){
      oldwidget.innerHTML = "";
    }

    setTimeout(()=>{
      if(window.Trustpilot){
        window.Trustpilot.loadFromElement(document.getElementById("trustbox"),true);
      }
    },500);
  };

    if (!document.querySelector('script[src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"]')) {
    const script = document.createElement("script");
    script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    script.onload = loadTruspiolt;
    document.body.appendChild(script);
    }else{
      loadTruspiolt();
    }
  //   return () => {
  //     // Clean up the script when the component unmounts
  //     document.body.removeChild(script);
  //   };
    
    
  }, [router.asPath]);
  
  

  return (
    <div 
        id="trustbox"
        className="trustpilot-widget" 
        data-locale="en-US" 
        data-template-id="56278e9abfbbba0bdcd568bc" 
        data-businessunit-id="675ef2b988bd057610707ed7" 
        data-style-height="80px" 
        data-style-width="100%" 
        data-theme="light"
    >
          <a href="https://nl.trustpilot.com/review/tickgetr.be" target="_blank" rel="noopener">Trustpilot</a>
    </div>
  );
};

export default TrustpilotWidget;
