import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import BottomSheet from "@gorhom/bottom-sheet";
const atalaLogo = require('../assets/ATALAPRISM.png');
const discordLogo = require('../assets/discord.png');

export default function IdentifierDetailScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log('id details - route params are', JSON.stringify(route.params));
  const dispatch = useDispatch();
  const [id, setId] = useState<models.identifier>(route.params.identifier);

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ["50%", "75%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    useEffect(() => {
      console.log('id details - initially setting id', id);
      setId(route.params.identifier);
    }, []);

  return (
      <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{backgroundColor: '#140A0F', borderWidth: 1, borderColor: '#DE984F'}}
      >
          <View
              style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 16
              }}
          >
              <View style={styles.closeButtonContainer}>
                  <IconButton
                      icon="close-circle"
                      size={28}
                      iconColor="#C5C8D1"
                      onPress={() => navigation.goBack()}
                      style={{borderWidth: 1, borderColor: '#FFA149', borderRadius: 10 }}
                  />
                  <IconButton
                      icon="qrcode"
                      size={28}
                      iconColor="#C5C8D1"
                      style={{borderWidth: 1, borderColor: '#FFA149', borderRadius: 10 }}
                      onPress={() =>
                          goToShowQrCode(navigation, {
                              identifier: "TODO"
                          })
                      }
                  />
              </View>
              <Animated.View style={styles.viewAnimated}>
        <Image source={atalaLogo} style={styles.credLogoStyle} />
        <FlatList
          data={Object.entries(id)}
          keyExtractor={([key, val]) => key}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={(item) => {
            return (
              <ScrollView style={styles.scrollableModal}>
                <Text style={{ color: 'white' }}>
                  {item.item[0] + ': ' + item.item[1]}
                </Text>
              </ScrollView>
            );
          }}
        />
      </Animated.View>
          </View>
      </BottomSheet>
  );
}
