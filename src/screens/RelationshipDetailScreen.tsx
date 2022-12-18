import React, {
    useEffect,
    useState,
    useRef,
    useMemo,
    useCallback,
} from "react";
import {
  Animated,
  Image,
  Text,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { styles } from '../styles/styles';
import BottomSheet from "@gorhom/bottom-sheet";
import * as models from '../models';
import { goToShowQrCode } from '../navigation/helper/navigate-to';
// import { showQR } from '../qrcode';
// import { addDidDoc, asContactShareable } from '../relationships';
// import { recursivePrint } from '../utils';

export default function RelationshipDetailScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log(
    'RelDetailScreen - route params are',
    JSON.stringify(route.params)
  );
  const [rel, setRel] = useState<any>(route.params.user);
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ["50%", "75%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

  useEffect(() => {
    console.log('RelDetailScreen - rel changed', rel);
  }, [rel]);

  return (
      <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
              backgroundColor: "#140A0F",
              borderWidth: 1,
              borderColor: "#DE984F",
          }}
      >
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <Pressable style={styles.pressable} onPress={navigation.goBack} />
      <View style={styles.closeButtonContainer}>
        <IconButton
            icon="keyboard-backspace"
            size={28}
            iconColor="#C5C8D1"
          onPress={() => navigation.goBack()}
            style={{ borderWidth: 1, borderColor: "#FFA149", borderRadius: 10 }}
        />
          <IconButton
            icon='text-box'
            size={28}
            iconColor="#C5C8D1"
            onPress={async () => {
              if (rel) {
                console.log('RelDetailScreen - setting rel', rel);
                // setRel(await addDidDoc(rel));
              } else {
                console.error(
                  'RelDetailScreen - cant set rel, rel not set',
                  rel
                );
              }
            }}
            style={{ borderWidth: 1, borderColor: "#FFA149", borderRadius: 10 }}
          />
          <IconButton
            icon='qrcode'
            size={28}
            iconColor="#C5C8D1"
            onPress={() => {
              if (rel) {
                console.log('RelDetailScreen - show QR for rel', rel);
                goToShowQrCode(navigation, rel)
              } else {
                console.error(
                  'RelDetailScreen - cant show qr, rel not set',
                  rel
                );
              }
            }}
            style={{ borderWidth: 1, borderColor: "#FFA149", borderRadius: 10 }}
          />
        </View>
          <Animated.View style={styles.viewAnimated}>
              <View
                  style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
              >
        <Image
          source={{ uri: rel.displayPictureUrl }}
          style={{
            // width: '30%',
            // height: '30%',
            resizeMode: 'contain',
            margin: 8,
            justifyContent: 'flex-start',
            width: 65,
            height: 75,
          }}
        />
                  <Text style={{ ...styles.subText, fontWeight: "700" }}>
                      {rel.displayName}
                  </Text>
              </View>
        <Divider />
        <ScrollView style={styles.scrollableModal}>
          <Text style={styles.subText}>{rel?.did}</Text>
          <Divider />
          <Text
            style={styles.subText}
          >{`did:prism:0206326ed47eda4bd9917886cfad6bdaf9d6420af80ecc23af5791bfc7bcc05c:Cr8BCrwBEjsKB21hc3RlcjAQAUouCglzZWNwMjU2azESIQN6DKpb9OFDasJVeXCPBU34cF4E6FGaljA3VBlA7EJqjhI8Cghpc3N1aW5nMBACSi4KCXNlY3AyNTZrMRIhA1NKHFw8xk2ptXovPwKGzMokfddV9YRvs2X14P66HrzsEj8KC3Jldm9jYXRpb24wEAVKLgoJc2VjcDI1NmsxEiECH-dwm0ZXDHz6xSDKAQDQFl3hQT0pcyqdE0xKJcm7nrs`}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  </BottomSheet>
  );
}
