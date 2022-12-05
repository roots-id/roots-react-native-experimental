import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';
import Navigation from './src/navigation';
import reduxStore from './src/store';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const { store, persistor } = reduxStore();

export default function App() {
  console.log('Starting App');
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <Navigation />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e69138',
    accent: '#b0bf93',
    background: '#f9f9f9',
  },
};
