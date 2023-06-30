export const getUsers = async() =>{
    const url = `http://192.168.100.22:3001/api/customer`;
    const resp = await fetch ( url );
    const { data } = await resp.json();
    
    const users = data.map (user => ({
        id: user._id,
        name: user.fullname,
        email:user.email,

    }))
    
    return users;
    
}