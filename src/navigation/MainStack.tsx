import { Avatar } from 'react-native-paper';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, { useState } from 'react';
import LogoTitle from '../components/LogoTitle';
import IconActions from '../components/IconActions';
import RelationshipsScreen from '../screens/RelationshipsScreen';
import RelationshipDetailScreen from '../screens/RelationshipDetailScreen';
import CredentialsScreen from '../screens/CredentialsScreen';
import DeveloperScreen from '../screens/DeveloperScreen';
import WalletScreen from '../screens/WalletScreen';
import ChatScreen from '../screens/ChatScreen';
import CredentialDetailScreen from '../screens/CredentialDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SaveScreen from '../screens/SaveScreen';
import { DevStack } from './dev-stack';
import { ROUTE_NAMES } from './constants';
import ScanQrCode from '../screens/ScanQrCodeScreen';
import ShowQrCodeScreen from '../screens/ShowQrCodeScreen';
import TestScreen from "../screens/TestScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function MainStack() {
  console.log('MainStack - Determining which main screen to use.');
  const Main = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
            tabBarActiveBackgroundColor: '#362631',
          tabBarInactiveBackgroundColor: '#150510',
          tabBarActiveTintColor: 'orange',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { fontSize: 22 },
        }}
      >
          <Tab.Screen name='Test' component={TestStack} />
        {/*<Tab.Screen name='Contacts' component={RelationshipsStack} />*/}
        {/*<Tab.Screen name='Credentials' component={CredentialsStack} />*/}
      </Tab.Navigator>
    );
  };

    const TestStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#150510',
                    },
                    headerTintColor: '#eeeeee',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    animationEnabled: true,
                }}
            >
                <Stack.Group>
                    <Stack.Screen
                        name={ROUTE_NAMES.TEST}
                        component={TestScreen}
                        options={({ navigation, route }) => ({
                            headerTitle: (props) => <LogoTitle {...props} title='Test' />,
                        })}
                    />
                </Stack.Group>
            </Stack.Navigator>
        );
    };

  const RelationshipsStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#150510',
          },
          headerTintColor: '#eeeeee',
          headerTitleStyle: {
            fontSize: 22,
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      >
        <Stack.Group>
          <Stack.Screen
            name={ROUTE_NAMES.RELATIONSHIPS}
            component={RelationshipsScreen}
            options={({ navigation, route }) => ({
              headerTitle: (props) => <LogoTitle {...props} title='Contacts' />,
              headerRight: (props) => (
                <IconActions
                  {...props}
                  nav={navigation}
                  add='Create Rel'
                  person={'user-id-1'}
                  scan='contact'
                  settings='Settings'
                />
              ),
            })}
          />
          <Stack.Screen
            name={ROUTE_NAMES.CHAT}
            component={ChatScreen}
            options={({ navigation, route }: { navigation; route }) => ({
              headerBackTitleVisible: false,
              headerTitle: (props) => (
                <LogoTitle {...props} title={route.params?.user?.displayName} />
              ),
              headerTitleAlign: 'left',
              headerTitleAllowFontScaling: true,
              headerRight: (props) => (
                <IconActions
                  {...props}
                  nav={navigation}
                  add='Create Rel'
                  person={'user-id-1'}
                  scan='credential'
                  settings='Settings'
                />
              ),
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    );
  };

  const CredentialsStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#150510',
          },
          headerTintColor: '#eeeeee',
          headerTitleStyle: {
            fontSize: 22,
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      >
        <Stack.Group>
          <Stack.Screen
            name={ROUTE_NAMES.VCS}
            component={CredentialsScreen}
            options={({ navigation, route }) => ({
              headerTitle: (props) => (
                <LogoTitle {...props} title='Credentials' />
              ),
              headerRight: (props) => (
                <IconActions
                  {...props}
                  nav={navigation}
                  person={'user-id-1'}
                  scan='credential'
                  settings='Settings'
                />
              ),
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name={ROUTE_NAMES.MAIN_TABS} component={Main} />
      </Stack.Group>
      <Stack.Group
        navigationKey={'init'}
        screenOptions={{ presentation: 'transparentModal' }}
      >
        <Stack.Screen
          name={ROUTE_NAMES.RELATIONSHIP_DETAILS}
          component={RelationshipDetailScreen}
        />
        <Stack.Screen
          name={ROUTE_NAMES.CREDENTIAL_DETAILS}
          component={CredentialDetailScreen}
        />
        <Stack.Screen
          name={ROUTE_NAMES.SCAN_QR_CODE}
          component={ScanQrCode}
        />
        <Stack.Screen
          name={ROUTE_NAMES.SHOW_QR_CODE}
          component={ShowQrCodeScreen}
        />
        <Stack.Screen name={ROUTE_NAMES.SETTINGS} component={SettingsScreen} />
        <Stack.Screen name={ROUTE_NAMES.SAVE} component={SaveScreen} />
        <Stack.Screen name={ROUTE_NAMES.DEVELOPERS} component={DevStack} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
