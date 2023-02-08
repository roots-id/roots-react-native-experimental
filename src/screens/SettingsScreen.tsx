import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as ExpoImagePicker from "react-native-image-picker";
import { Button, Image, Text, ScrollView, View } from "react-native";
import { IconButton, ToggleButton } from "react-native-paper";
import { styles } from "../styles/styles";
import { CompositeScreenProps } from "@react-navigation/core/src/types";
import { useCardAnimation } from "@react-navigation/stack";
import FormButton from "../components/FormButton";
import { Picker } from "../components/picker";
import { ConfigService, ServerService } from "../services";
import { MediatorType, ServerType } from "../models/constants";
import { ROUTE_NAMES } from "../navigation";
import FormInput from "../components/FormInput";
import { BottomSheet } from '../components/bottom-sheet';
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  getIsPinProtected,
  getWalletPin,
} from "../store/selectors/wallet";
import { changePin, changePinStatus } from "../store/slices/wallet";
import { updateProfileInfo } from "../store/thunks/wallet";

const serverService = new ServerService();
const configService = new ConfigService();

export default function SettingsScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  const [demoMode, setDemoMode] = useState<boolean>();
  const [host, setHost] = useState<string>();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
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

    if (profile?.displayName) {
      setUsername(profile?.displayName);
    }

    if (profile?.displayPictureUrl) {
      setAvatar(profile?.displayPictureUrl);
    }
  }, []);

  const handleDemoModeChange = () => {
    configService.setDemo(!configService.isDemo);
    setDemoMode(!configService.isDemo);
  };

  const handlePinProtectedChange = () => {
    dispatch(changePinStatus(!pinProtected));
  };

  const handleUsernameChange = (userName) => {
    setUsername(userName)
    dispatch(
      updateProfileInfo({
        data: { displayName: username },
        message: `Username has been updated to ${username}`,
      })
    );
  };

  const handleAvatarChange = (image) => {
    setAvatar(image);
    dispatch(
      updateProfileInfo({
        data: { displayPictureUrl: image },
        message: `Avatar picture has been updated`,
      })
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1
    });

    console.log("result", result);

    if (!result.didCancel) {
      let image = result.assets[0]
      handleAvatarChange(image.uri);
    }
  };

  return (
    <BottomSheet snapPoints={["75%", "90%"]} >
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={[styles.titleText]}>Settings</Text>
            <IconButton
              icon="keyboard-backspace"
              size={28}
              color="#C5C8D1"
              onPress={() => navigation.goBack()}
              style={{
                borderWidth: 1,
                borderColor: "#FFA149",
                borderRadius: 10,
              }}
            />
          </View>
          <View style={styles.viewAnimatedStart}>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 10,
                width: 300,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.listItemCenteredBlack}>Username </Text>
              </View>
              <FormInput
                labelName=""
                value={username}
                secureTextEntry={false}
                onChangeText={handleUsernameChange}
                style={{
                  backgroundColor: "#24121B",
                  width: "100%",
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#e69138",
                }}
                theme={{ colors: { text: "#e69138" } }}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 10,
                width: 260,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.listItemCenteredBlack}>Avatar </Text>
                <FormButton
                  title={avatar ? "Change image" : "Pick an image"}
                  modeValue="contained"
                  onPress={pickImage}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                {avatar && (
                  <Image
                    source={{
                      uri: avatar,
                    }}
                    style={{
                      width: 65,
                      height: 65,
                      resizeMode: "contain",
                      margin: 8,
                    }}
                  />
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 10,
                width: 260,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: 6
                }}
              >
                <FormButton
                  title={pinProtected ? "Disable Pin":"Enable Pin"}
                  modeValue="contained"
                  onPress={handlePinProtectedChange}
                />
              </View>
              {pinProtected ? (
                <FormInput
                  labelName="Pin"
                  value={pin}
                  secureTextEntry={false}
                  onChangeText={(userPin: string) => {
                    dispatch(changePin(userPin));
                  }}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#24121B",
                    width: 250,
                    height: 50,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#e69138",
                  }}
                  theme={{ colors: { text: "#e69138" } }}
                />
              ) : null}
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text style={styles.listItemCenteredBlack}>Server </Text>
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
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text style={styles.listItemCenteredBlack}>Mediator </Text>
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
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormButton
                  title={demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
                  modeValue="contained"
                  onPress={handleDemoModeChange}
                />
            </View>
            <Text />
            <View style={{ flexDirection: "row" }}>
              <FormButton
                title="Save/Restore Wallet"
                modeValue="contained"
                onPress={() => navigation.navigate(ROUTE_NAMES.SAVE)}
              />
            </View>
            <Text />
            <View style={{ flexDirection: "row" }}>
              <FormButton
                title="Developers Only"
                modeValue="contained"
                onPress={() => navigation.navigate(ROUTE_NAMES.DEVELOPERS)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
