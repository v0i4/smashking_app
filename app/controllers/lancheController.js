import { useEffect, useState } from 'react';
import api from "../../services/api";


function handleLoadLanches() {


    return api.get('/lanches').then(response => response.data)
    

    
   
  
}

export default handleLoadLanches;