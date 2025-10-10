// components/KeyBoard.js
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function KeyBoard({ onSend }) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "") return;
        onSend(input);
        setInput(""); // clear input after sending
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS==='ios'?0:-18} // adjust if needed
            style={styles.container}
        >
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#f5f5f5",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom:50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
        color: "#333",
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: "#CFAFF6",
        borderRadius: 20,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});
