import {PureComponent, useEffect, useState} from 'react';
import {
  Animated,
  View,
  Text,
  Pressable,
  Button,
  StyleSheet,
  Platform, TouchableOpacity, Linking,
} from 'react-native';
import { IconButton } from 'react-native-paper';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { BarCodeEvent } from 'expo-barcode-scanner/src/BarCodeScanner';
// import { Camera } from 'expo-camera';
import { faker } from '@faker-js/faker';
// import { getDemoCred } from '../credentials';
// import { getDemoRel, getUserId } from '../relationships';
// import {
//   getDid,
//   importContact,
//   importVerifiedCredential,
// } from '../roots';
import React from 'react';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { styles } from '../styles/styles';
import { ConfigService } from '../services';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserContact, getRootsHelperContact } from '../store/selectors/contact';
import { createNewCredential, initiateNewContact } from '../store/thunks/wallet';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from "react-native-camera";
import {
  Camera,
  CameraDevice,
  CameraDevices,
  CameraPermissionStatus,
  useCameraDevices
} from "react-native-vision-camera";

const configService = new ConfigService();

// const BarcodeWrapper = (props) => {
  // return Platform.OS === 'web' ? (
  //   <Camera {...props} />
  // ) : (
  //   <BarCodeScanner {...props} />
  // );
// };

export default function ScanQrCodeScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log('Scan QR - route params', route.params);
  const [scanned, setScanned] = useState<boolean>(false);
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout>();
  const [device,setDevice] = useState<CameraDevices>();
  const [error,setError] = useState<string>("");
  const rootsHelper = useSelector(getRootsHelperContact);
  const currentUser = useSelector(getCurrentUserContact);
  const dispatch = useDispatch();
  const modelType = route.params.type;

  const addDummyCredenial = async () => {
    dispatch(createNewCredential());
  };

  const addDummyContact = async () => {
    dispatch(initiateNewContact());
  };

  const onSuccess = e => {
    console.log('Scan QR - onSuccess');
    Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err)
    );
  };

  const handleDemo = async () => {
    if (!scanned && await configService.getDemo()) {
      setScanned(true);
      console.log('Scan QR - pretending to scan with demo data');
      alert('No data scanned, using demo data instead.');

      if (modelType === 'contact') {
        console.log('Scan QR - getting contact demo data');
        // const demoData = getDemoRel();
        // await importContact(demoData);
        addDummyContact();
      } else {
        console.log('Scan QR - getting credential demo data');
        // const did = getDid(getUserId());
        // if (did) {
        //   const demoData = getDemoCred(did).verifiedCredential;
        //   await importVerifiedCredential(demoData);
        // }
        addDummyCredenial();
      }
    } else {
      console.log(
        'Scan QR - Demo interval triggered, but scanned or not demo',
        scanned,
        configService.getDemo()
      );
    }
    clearAndGoBack();
  };

  useEffect(() => {
    const initFunc = async () => {
      // const { status } = await BarCodeScanner.requestPermissionsAsync();
      // setHasPermission(status === 'granted');
      const cameraPermission = await Camera.getCameraPermissionStatus()
      console.log("camera permission",cameraPermission)

      const microphonePermission = await Camera.getMicrophonePermissionStatus()
      console.log("microphone permission",microphonePermission)

      if (cameraPermission === null || cameraPermission == "not-determined") {
        const reqCamPerm = await Camera.requestCameraPermission()
        console.log("req camera permission",reqCamPerm)
        if(reqCamPerm != "authorized") {
          setError(error+"\nAccess to camera denied:\n"+reqCamPerm)
        } else {
          setDevice(useCameraDevices())
          console.log("camera device",device)
        }
      }
      if (cameraPermission != "authorized") {
        setError(error+"\nNo access to camera:\n"+cameraPermission)
      } else if(!device) {
        setDevice(useCameraDevices())
        console.log("camera device",device)
      }
      if (microphonePermission === null || microphonePermission == "not-determined") {
        const reqMicPerm = await Camera.requestMicrophonePermission()
        console.log("req mic permission",reqMicPerm)
        if(reqMicPerm != "authorized") {
          setError(error+"\nAccess to mic denied:\n"+reqMicPerm)
        }
      }
      if (microphonePermission != "authorized") {
        setError(error+"\nNo access to mic:\n"+microphonePermission)
      }
          // if (await configService.getDemo()) {
      //   setTimeOutId(setTimeout(handleDemo, 10000));
      // }

    };
    //alert("clicked qrcode")
    initFunc().catch(console.error);
  }, []);

  // const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
  //   setScanned(true);
  //   console.log(
  //     'Scan QR - scan complete but only using dummy data',
  //     modelType,
  //     type,
  //     data
  //   );
  //   // const jsonData = JSON.parse(data);
  //   if (modelType == 'credential') {
  //     console.log('Scan QR - Importing dummy vc', data);
  //     addDummyCredenial();
  //     // await importVerifiedCredential(jsonData);
  //   } else if (modelType == 'contact') {
  //     console.log('Scan QR - Importing dummy contact', data);
  //     addDummyContact();
  //     // await importContact(jsonData);
  //   }
  //   clearAndGoBack();
  // };

  const clearAndGoBack = () => {
    setScanned(true);
    if (timeOutId) clearTimeout(timeOutId);
    if (navigation.canGoBack()) navigation.goBack();
  };

  // const takePicture = async () => {
  //   if (camera) {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await camera.takePictureAsync(options);
  //     console.log(data.uri);
  //   }
  // };



  // if (device == null) {
  //   setError("No device found")
  // }

    return (
        <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
        >
          <Pressable style={styles.pressable} onPress={clearAndGoBack}/>
          <View style={styles.closeButtonContainer}>
            <IconButton
                icon='close-circle'
                size={36}
                iconColor='#e69138'
                onPress={() => navigation.goBack()}
            />
          </View>
          <Animated.View
              style={[styles.viewAnimated, {minWidth: '90%', minHeight: '90%'}]}
          >
            <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
            >
              <Text>{error}</Text>
              <Text>{JSON.stringify(device)}</Text>
              {/*<Camera*/}
              {/*    style={StyleSheet.absoluteFill}*/}
              {/*    device={device?.back}*/}
              {/*    isActive={true}*/}
              {/*/>*/}


              {/*<RNCamera*/}
              {/*    ref={ref => {*/}
              {/*      setCamera(ref);*/}
              {/*    }}*/}
              {/*    style={localStyles.preview}*/}
              {/*    type={RNCamera.Constants.Type.back}*/}
              {/*    flashMode={RNCamera.Constants.FlashMode.on}*/}
              {/*    androidCameraPermissionOptions={{*/}
              {/*      title: 'Permission to use camera',*/}
              {/*      message: 'We need your permission to use your camera',*/}
              {/*      buttonPositive: 'Ok',*/}
              {/*      buttonNegative: 'Cancel',*/}
              {/*    }}*/}
              {/*    androidRecordAudioPermissionOptions={{*/}
              {/*      title: 'Permission to use audio recording',*/}
              {/*      message: 'We need your permission to use your audio',*/}
              {/*      buttonPositive: 'Ok',*/}
              {/*      buttonNegative: 'Cancel',*/}
              {/*    }}*/}
              {/*    onGoogleVisionBarcodesDetected={({ barcodes }) => {*/}
              {/*      console.log(barcodes);*/}
              {/*    }}*/}
              {/*/>*/}
              {/*<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>*/}
              {/*  <TouchableOpacity onPress={() => takePicture()} style={localStyles.capture}>*/}
              {/*    <Text style={{ fontSize: 14 }}> SNAP </Text>*/}
              {/*  </TouchableOpacity>*/}
              {/*</View>*/}
              {/*<BarcodeWrapper*/}
              {/*  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}*/}
              {/*  style={StyleSheet.absoluteFillObject}*/}
              {/*/>*/}
              {/*{scanned && (*/}
              {/*  <Button*/}
              {/*    title={'Tap to Scan Again'}*/}
              {/*    onPress={() => setScanned(false)}*/}
              {/*  />*/}
              {/*)}*/}
              {/*<QRCodeScanner*/}
              {/*    onRead={onSuccess}*/}
              {/*    flashMode={RNCamera.Constants.FlashMode.torch}*/}
              {/*    topContent={*/}
              {/*      <Text style={localStyles.centerText}>*/}
              {/*        Go to{' '}*/}
              {/*        <Text style={localStyles.textBold}>wikipedia.org/wiki/QR_code</Text> on*/}
              {/*        your computer and scan the QR code.*/}
              {/*      </Text>*/}
              {/*    }*/}
              {/*    bottomContent={*/}
              {/*      <TouchableOpacity style={localStyles.buttonTouchable}>*/}
              {/*        <Text style={styles.buttonText}>OK. Got it!</Text>*/}
              {/*      </TouchableOpacity>*/}
              {/*    }*/}
              {/*/>*/}
            </View>
          </Animated.View>
        </View>
    );
  }

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
})
