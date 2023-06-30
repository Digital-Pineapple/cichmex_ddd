import { useEffect, useState } from "react";
import { getUsers  } from '../helpers'
export const useFetchUsers = ( uid ) => {
  
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState( true )

      const getUser = async () => {
        const newUser = await getUsers( uid );
        setUser(newUser);
        setIsLoading(false);
      };
    
      useEffect( () => {
        getUser();
      }, []);


    return{
    user,
    isLoading
    }
}
