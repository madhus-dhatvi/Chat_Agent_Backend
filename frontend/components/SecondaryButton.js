import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SecondaryButton({ children, onPress }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, pressed && { opacity: 0.5 }]}
        >
            <View>
             <Text style={styles.pillText}>{children}</Text>
            </View>
        </Pressable>
    );

}
const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        elevation: 2,
        marginBottom: 5,


    },
    pillText: {
        fontSize: 14,
        color: '#222',
    },
})