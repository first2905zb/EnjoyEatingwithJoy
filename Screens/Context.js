import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  // const [saveUsername, setSaveUsername] = React.useState(null);

  const saveUsername = (user) => {
    setUsername(user);
  }

  const signIn = async (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('username', user);
  };

  const signOut = async () => {
    setIsLoggedIn(false);
    setUsername(null);
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
  };

  const checkLoginStatus = async () => {
    const loginStatus = await AsyncStorage.getItem('isLoggedIn');
    const storedUsername = await AsyncStorage.getItem('username');
    if (loginStatus === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, signIn, signOut, saveUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
