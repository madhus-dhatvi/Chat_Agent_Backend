import { StyleSheet, Text, View } from "react-native";


export default function Avatar({ initials, size = 40 }) {
    return (

        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={styles.avatarText}>{initials}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    avatar: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd' },
    avatarText: { fontWeight: '700' },
})

