/* eslint-disable react/prop-types */
// UserContext.jsx
import { createContext, useState } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem("userInfo");
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export default UserProvider;