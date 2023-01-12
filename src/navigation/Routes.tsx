import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LocalStorageService } from '../services';
import { USER_AUTH } from '../common/constants';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletExists } from '../store/selectors/wallet';
import { createWallet, initiateWalletCreation } from '../store/thunks/wallet';
import { loadChatsAndMessages } from '../store/thunks/chat';
import { loadAllContacts } from '../store/thunks/contact';
import { loadAllCredenitals } from '../store/thunks/credential';
const localStorageService = new LocalStorageService();

export const AuthContext = React.createContext({});

export default function Routes() {
  console.log('Routes - navigation/Routes');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const walletExists = useSelector(getWalletExists);
  const dispatch = useDispatch();

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // await localStorageService.persist(
        //   USER_AUTH,
        //   JSON.stringify({ id: 'user_5', token: 'jwttoken' })
        // );
        // setLoggedIn(true);
      },
    }),
    []
  );

  useEffect(() => {
    // localStorageService.clear();
    const checkWalletCreation = async () => {
      const isFirstTime = await localStorageService.fetch('123isfirst');
      console.log( typeof (isFirstTime))
      if (isFirstTime == null) {
        await localStorageService.persist('123isfirst', 'true');
        console.log('initiating wallet')
        await dispatch(initiateWalletCreation({}));
  
        // await dispatch(loadAllContacts())
        // await dispatch(loadChatsAndMessages())
        
      }
      else{
        console.log('loading messages')
        await dispatch(createWallet({}))

        await dispatch(loadAllContacts())
        await dispatch(loadChatsAndMessages())
        await dispatch(loadAllCredenitals())
      }
      setLoggedIn(true);
    };
    checkWalletCreation();
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {isLoggedIn ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
