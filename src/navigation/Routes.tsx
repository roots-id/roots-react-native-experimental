import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LocalStorageService } from '../services';
import { USER_AUTH } from '../common/constants';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletExists, getWallet, } from '../store/selectors/wallet';
import { initiateWalletCreation, createConnection } from '../store/thunks/wallet';

const localStorageService = new LocalStorageService();

export const AuthContext = React.createContext({});

export default function Routes() {
  console.log('Routes - navigation/Routes');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const walletExists = useSelector(getWalletExists);
  const wallet = useSelector(getWallet)
  const dispatch = useDispatch();


  useEffect(() => {
    localStorageService.clear();
    const checkWalletCreation = async () => {
      console.log('walletExists', walletExists)
      if (!walletExists) {
        await dispatch(initiateWalletCreation({}));
        // console.log(wallet)
        setLoggedIn(true);
         //prism demo for discord with api 
        let invite_url = 'https://www.domain.com/path?_oob=eyJpZCI6ImQ0ZTEwOTEyLTQ4MDgtNGE0Yy05YmEwLTc1MTQ4Mzk4ZjU5OCIsInR5cGUiOiJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzIuMC9pbnZpdGF0aW9uIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNxbmRoQmRtN3NoalJIbzJrOTN5TDJ1NVJhcDZjUjJqRW1Ya1J6OGJ0ZzNHNi5WejZNa3FiaXJtRzcydUR2YXdRNXhnbUxkRWIzN1JRdnlWd3ZvVDRoMmlNUm15WVBZLlNleUowSWpvaVpHMGlMQ0p6SWpvaWFIUjBjSE02THk5aVp6WTFhaTVoZEdGc1lYQnlhWE50TG1sdkwzQnlhWE50TFdGblpXNTBMMlJwWkdOdmJXMGlMQ0p5SWpwYlhTd2lZU0k2V3lKa2FXUmpiMjF0TDNZeUlsMTkiLCJib2R5Ijp7ImdvYWxfY29kZSI6ImlvLmF0YWxhcHJpc20uY29ubmVjdCIsImdvYWwiOiJFc3RhYmxpc2ggYSB0cnVzdCBjb25uZWN0aW9uIGJldHdlZW4gdHdvIHBlZXJzIHVzaW5nIHRoZSBwcm90b2NvbCAnaHR0cHM6Ly9hdGFsYXByaXNtLmlvL21lcmN1cnkvY29ubmVjdGlvbnMvMS4wL3JlcXVlc3QnIiwiYWNjZXB0IjpbXX19'
        let invitation = invite_url.split('=')
        console.log('invitation is', invitation[1])
        await dispatch(createConnection(invitation[1]));

        // navigator.navigate('CreateWallet')
      }
    };
    checkWalletCreation();
  }, []);

  return (
    <AuthContext.Provider value={AuthContext}>
      <NavigationContainer>
        {walletExists ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
