import React from "react";
import { View } from "react-native";
import { Button, Menu, IconButton } from "react-native-paper";
import { ROUTE_NAMES } from "../navigation/constants";

// import {asContactShareable, getContactByAlias, showRel} from '../relationships';

export default function IconActions(...props) {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    //  console.log("IconActions - props",props)
    const navigation = props[0]["nav"];
    const add = props[0]["add"];
    const person = props[0]["person"];
    const scan = props[0]["scan"];
    const settings = props[0]["settings"];
    const workflows = props[0]["workflows"];

    return (
        <View style={{ display: "flex", flexDirection: "row" }}>
            <IconButton
                icon="qrcode-scan"
                size={28}
                iconColor="#e69138"
                onPress={() => {
                    navigation.navigate(ROUTE_NAMES.SCAN_QR_CODE, { type: scan });
                    closeMenu();
                }}
            />
            <View style={{ display: "flex", alignItems: "flex-end" }}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    contentStyle={{
                        backgroundColor: "#000000",
                        display: "flex",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: '#DE984F',
                        borderRadius: 12
                    }}
                    anchor={
                        <IconButton
                            onPress={openMenu}
                            icon="dots-vertical"
                            size={28}
                            iconColor="#e69138"
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => console.log("onPress clicked")}
                        style={{ backgroundColor: "#000000" }}
                        title={<IconButton icon="account" size={28} iconColor="#e69138" />}
                    />
                    {/* <Menu.Item
          onPress={() => {
            navigation.navigate(ROUTE_NAMES.SCAN_QR_CODE, { type: scan });
            closeMenu();
          }}
          style={{ backgroundColor: "#000000" }}
          title={
            <IconButton
              icon="qrcode-scan"
              size={28}
              iconColor="#e69138"
              onPress={() => {
                navigation.navigate(ROUTE_NAMES.SCAN_QR_CODE, { type: scan });
                closeMenu();
              }}
            />
          }
        /> */}
                    <Menu.Item
                        onPress={() => {
                            navigation.navigate(settings);
                            closeMenu();
                        }}
                        title={<IconButton icon="cog-outline" size={28} iconColor="#e69138" />}
                        style={{ backgroundColor: "#000000" }}
                    />
                    <Menu.Item
                        onPress={() => {
                            navigation.navigate(workflows);
                            closeMenu();
                        }}
                        title={<IconButton icon="sitemap" size={28} iconColor="#e69138" />}
                        style={{ backgroundColor: "#000000" }}
                    />
                </Menu>
            </View>
        </View>
    );
}
