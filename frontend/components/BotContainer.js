import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

export default function BotContainer({ children, content }) {

    return (<View style={styles.botOuterContainer}>
        <Avatar initials="SJ" size={40} />
        <View style={styles.botInnerContainer}>

            {(content !== undefined && content !== "") && <Text styles={{ marginBottom: 2 }}>
                {content}
            </Text>}
            {children && <View style={styles.buttonsContainer}>
                {children}
            </View>}
        </View>
    </View>
    );
}
const styles = StyleSheet.create({
    botOuterContainer: {
        flexDirection: "row",
        alignItems: "flex-end"

    },
    botInnerContainer: {
        backgroundColor: '#CFAFF6',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        padding: 12,
        paddingHorizontal: 8,
        marginBottom: 15,
        marginLeft: 3,
        width: "80%",
        alignItems: 'flex-start'
        // marginRight: 10,
    },
    buttonsContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        gap: 6,
    },
    content: {
        marginBottom: 10,
    }

})