import React, { useEffect, useState } from 'react';
import { Animated, Image, Text, Pressable, View } from 'react-native';
import { IconButton, ToggleButton } from 'react-native-paper';
import { styles } from '../styles/styles';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { useCardAnimation } from '@react-navigation/stack';
import FormButton from '../components/FormButton';
import { Picker } from '../components/picker';
import { ConfigService, ServerService } from '../services';
import { MediatorType, ServerType } from '../models/constants';
import { ROUTE_NAMES } from '../navigation';
import FormInput from '../components/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfile,
  getIsPinProtected,
  getWalletPin,
} from '../store/selectors/wallet';
import {
  changePin,
  changePinStatus,
} from '../store/slices/wallet';
import {createNewDidAndNotify, updateProfileInfo} from '../store/thunks/wallet';
// import {IdType} from "roots-manager";

const serverService = new ServerService();
const configService = new ConfigService();

export default function SettingsScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  const [demoMode, setDemoMode] = useState<boolean>();
  const [host, setHost] = useState<string>();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  const profile = useSelector(getProfile);
  const pinProtected = useSelector(getIsPinProtected);
  const pin = useSelector(getWalletPin);
  const dispatch = useDispatch();
  useCardAnimation();
  useEffect(() => {
    async function getHost() {
      const hostReceived = await serverService.getHost();
      setHost(hostReceived);
    }

    async function getDemo() {
      const demoReceived = await configService.getDemo();
      setDemoMode(demoReceived);
    }

    getHost();
    getDemo();

    if(profile?.displayName) {
      setUsername(profile?.displayName)
    }

    if(profile?.displayPictureUrl) {
      setAvatar(profile?.displayPictureUrl)
    }
  }, []);



  const handleDemoModeChange = () => {
    configService.setDemo(!configService.isDemo);
    setDemoMode(!configService.isDemo);
  };

  const handlePinProtectedChange = () => {
    dispatch(changePinStatus(!pinProtected));
  };

  const handleUsernameChange = () => {
    dispatch(updateProfileInfo({ data: { displayName: username }, message: `Username has been updated to ${username}` }));
  };

  const handleAvatarChange = () => {
    dispatch(updateProfileInfo({ data: { displayPictureUrl: avatar }, message: `Avatar picture has been updated` }));
  };

  const handleCreateId = () => {
    dispatch(createNewDidAndNotify({ data: { type: IdType.Fake }, message: `Identifier has been created` }));
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Pressable style={styles.pressable} onPress={navigation.goBack} />
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon='close-circle'
          size={36}
          iconColor='#e69138'
          onPress={() => navigation.goBack()}
        />
      </View>
      <Animated.View style={styles.viewAnimatedStart}>
        <Text style={[styles.titleText, styles.black]}>Settings:</Text>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.listItemCenteredBlack}>Username: </Text>
          <IconButton
            icon='content-save'
            size={18}
            iconColor='#e69138'
            onPress={handleUsernameChange}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <FormInput
            labelName=''
            value={username}
            secureTextEntry={false}
            onChangeText={(userName: string) => setUsername(userName)}
            style={{
              backgroundColor: '#000000',
              width: 250,
              height: 50,
            }}
            theme={{ colors: { text: '#e69138' } }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.listItemCenteredBlack}>Avatar: </Text>
          <IconButton
            icon='content-save'
            size={18}
            iconColor='#e69138'
            onPress={handleAvatarChange}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <FormInput
            labelName=''
            value={avatar}
            secureTextEntry={false}
            onChangeText={(avatarLink: string) => setAvatar(avatarLink)}
            multiline={true}
            keyboardType='numeric'
            placeholder='paste avatar url here'
            placeholderTextColor='#c1bfbc9e'
            style={{
              backgroundColor: '#000000',
              width: 250,
              height: 50,
            }}
            theme={{ colors: { text: '#e69138' } }}
          />
          <Image
            source={{
              uri: avatar,
            }}
            style={{
              width: 65,
              height: 65,
              resizeMode: 'contain',
              margin: 8,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.listItemCenteredBlack}>Pin Protected: </Text>
          <ToggleButton
            icon={pinProtected ? 'toggle-switch' : 'toggle-switch-off-outline'}
            size={26}
            color='#e69138'
            value='toggle demo switch'
            onPress={handlePinProtectedChange}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          {pinProtected ? (
            <FormInput
              labelName='Pin'
              value={pin}
              secureTextEntry={false}
              onChangeText={(userPin: string) => {
                dispatch(changePin(userPin));
              }}
              keyboardType='numeric'
              style={{
                backgroundColor: '#000000',
                width: 250,
                height: 50,
              }}
              theme={{ colors: { text: '#e69138' } }}
            />
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={styles.listItemCenteredBlack}>Server: </Text>
          <Picker
            itemList={[
              {
                label: ServerType.Local.label,
                value: ServerType.Local.hostValue,
              },
              {
                label: ServerType.Prism.label,
                value: ServerType.Prism.hostValue,
              },
            ]}
            selectedValue={host}
            onValueChange={(itemValue) => setHost(String(itemValue))}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={styles.listItemCenteredBlack}>Mediator: </Text>
          <Picker
            itemList={[
              {
                label: MediatorType.Roots.label,
                value: MediatorType.Roots.value,
              },
            ]}
            selectedValue={MediatorType.Roots.value}
            onValueChange={(itemValue) => console.log(itemValue)}
          />
        </View>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.listItemCenteredBlack}>Demo Mode ON/OFF: </Text>
          <ToggleButton
            icon={demoMode ? 'toggle-switch' : 'toggle-switch-off-outline'}
            size={26}
            color='#e69138'
            value='toggle demo switch'
            onPress={handleDemoModeChange}
          />
        </View>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <FormButton
            title='Save/Restore Wallet'
            modeValue='contained'
            labelStyle={styles.loginButtonLabel}
            onPress={() => navigation.navigate(ROUTE_NAMES.SAVE)}
          />
        </View>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <FormButton
            title='Developers Only'
            modeValue='contained'
            labelStyle={styles.loginButtonLabel}
            onPress={() => navigation.navigate(ROUTE_NAMES.DEVELOPERS)}
          />
        </View>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <FormButton
              title='Test Create Id'
              modeValue='contained'
              labelStyle={styles.loginButtonLabel}
              onPress={() => handleCreateId()}
          />
        </View>
      </Animated.View>
    </View>
  );
}
