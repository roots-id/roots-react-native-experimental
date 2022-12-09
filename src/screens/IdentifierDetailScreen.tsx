import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Text,
  Pressable,
  View,
  ScrollView,
} from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import * as models from '../models';
import { styles } from '../styles/styles';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { goToShowQrCode } from '../navigation/helper/navigate-to';
import { useDispatch } from 'react-redux';
const atalaLogo = require('../assets/ATALAPRISM.png');
const discordLogo = require('../assets/discord.png');

export default function IdentifierDetailScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log('id details - route params are', JSON.stringify(route.params));
  const dispatch = useDispatch();
  const [id, setId] = useState<models.identifier>(route.params.identifier);

    useEffect(() => {
      console.log('id details - initially setting id', id);
      setId(route.params.identifier);
    }, []);

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
        {/*<IconButton*/}
        {/*  icon='close-circle'*/}
        {/*  size={36}*/}
        {/*  color='#e69138'*/}
        {/*  onPress={() => navigation.goBack()}*/}
        {/*/>*/}
      </View>
      <Animated.View style={styles.viewAnimated}>
        <View style={{ flexDirection: 'row' }}>
          {/*<IconButton icon={verified} size={36} color='#e69138' onPress={updateVerification} />*/}
          {/*<IconButton*/}
          {/*  icon='qrcode'*/}
          {/*  size={36}*/}
          {/*  color='#e69138'*/}
          {/*  onPress={() =>*/}
          {/*    goToShowQrCode(navigation, {*/}
          {/*      encodedSignedCredential: 'dummy_vcEncodedSignedCredential',*/}
          {/*      proof: {*/}
          {/*        hash: 'dummy_proofHash',*/}
          {/*        index: 0,*/}
          {/*      },*/}
          {/*    })*/}
          {/*  }*/}
          {/*/>*/}
        </View>
        <Image source={atalaLogo} style={styles.credLogoStyle} />
        <FlatList
          data={Object.entries(id)}
          keyExtractor={([key, val]) => key}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={(item) => {
            return (
              <ScrollView style={styles.scrollableModal}>
                <Text style={{ color: 'black' }}>
                  {item.item[0] + ': ' + item.item[1]}
                </Text>
              </ScrollView>
            );
          }}
        />
      </Animated.View>
    </View>
  );
}
