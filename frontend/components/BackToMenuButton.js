import { Alert, StyleSheet } from "react-native";
import SecondaryButton from "./SecondaryButton";
import { Ionicons } from "@expo/vector-icons";

export default function BackToMenuButton() {
    return <SecondaryButton onPress={() => {
        Alert.alert("AI Agenent", "You are navigate to Ai Agent");
    }}>
        Menu
        <Ionicons name="caret-forward" size={14} color={"black"} />
    </SecondaryButton>
}
const styles = StyleSheet.create({

})