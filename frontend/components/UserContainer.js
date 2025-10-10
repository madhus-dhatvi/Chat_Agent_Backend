import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

export default function UserContainer({ children }) {
    return (
        <View style={styles.container}>
            <View style={styles.msgContainer}>
                <Text style={styles.userText}>{children}</Text>
            </View>
            <Avatar initials={'SJ'} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 8,
        justifyContent: 'flex-end',
    },
    msgContainer: {
        maxWidth: '75%',
        width: "60%",
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#d9d9d9',
        marginRight: 8,
        borderBottomRightRadius: 0,
        marginBottom: 15,
    },
    userText: {
        color: '#111'
    },
})