import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

export default function TypeContainer() {

    return (
        <View style={styles.container}>
            <Avatar initials={"SJ"} />
            <Text style={styles.typing}>Bot is typing...</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    typing: {
        fontStyle: "italic",
        color: "gray",
        marginLeft: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
    },
})
