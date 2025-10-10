import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
    return (
        <View style={styles.header}>
            <TouchableOpacity>
                <Text style={styles.back}>{'‹'}</Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <Text style={styles.onlineText}>Online</Text>
            </View>
            <View style={{ width: 32 }} />
        </View>

    );
}
const styles = StyleSheet.create({
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    back: { fontSize: 26, color: '#111' },
    headerTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
    onlineText: { fontSize: 12, color: '#1db954', textAlign: 'center' },
})