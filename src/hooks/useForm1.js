import { useState } from 'react';

export const useForm1 = ( {name, description, status,} ) => {
    
    const [state, setState] = useState( {name, description, status,} );

    const onChange = ( value, campo ) => {
        setState({
            ...state,
            [campo]: value
        });
    }

    const onSybmitChanges = () =>{
        
    }
    return {
        ...state,
        formulario: state,
        onChange,
    }

}
