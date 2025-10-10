import { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

export default function MenuButton({ openMenu }) {
    return <Pressable style={styles.menuBtn} onPress={openMenu}>
        <Text style={styles.menuBtnText}>☰ Menu</Text>
    </Pressable>

}
const styles = StyleSheet.create({
    menuBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 28, alignItems: 'center', marginTop: 6, alignSelf: 'center', width: 220, borderWidth: 1, borderColor: "black" },
    menuBtnText: { fontWeight: '700' },
})