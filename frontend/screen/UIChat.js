import { useState, useRef, useEffect, useContext } from "react";
import { Alert, Animated, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { BotContext } from "../store/botContext";
import BotContainer from "../components/BotContainer";
import SecondaryButton from "../components/SecondaryButton";
import UserContainer from "../components/UserContainer";
import Header from "../components/Header";
import { dummyData, recentFaqsData } from "../data/dummyData";
import MenuButton from "../components/MenuButton";
import Modal from "../components/Modal";
import { Ionicons } from '@expo/vector-icons';
import BackToMenuButton from "../components/BackToMenuButton";
import TypeContainer from "../components/TypeContainer";
import KeyBoard from "../components/KeyBoard";


export default function ChatScreen() {
    const { messages, addMessages } = useContext(BotContext);
    const [isTyping, setIsTyping] = useState(false);
    const listRef = useRef(null);
    const SHEET_HEIGHT = Math.round(Math.min(480, Dimensions.get('window').height * 0.55));
    const sheetAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const [isSheetMounted, setIsSheetMounted] = useState(false);
    const sheetStyle = { transform: [{ translateY: sheetAnim }] };

    const openMenu = () => {
        setIsSheetMounted(true);
        sheetAnim.setValue(SHEET_HEIGHT);
        Animated.timing(sheetAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        // slide down then unmount overlay
        Animated.timing(sheetAnim, {
            toValue: SHEET_HEIGHT,
            duration: 220,
            useNativeDriver: true,
        }).start(() => setIsSheetMounted(false));
    };

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isTyping]);

    function handleGenerateOptions(option, isMenu) {
        const item = isMenu ? dummyData.find((i) => i.category === option) : recentFaqsData.find((i) => i.category === option);
        const subOptions = item.sub_queries.map((i) => i.question);
        const userObj = {
            id: Date.now().toString(),
            type: "user",
            content: item.category,
        };

        addMessages(userObj);

        // show typing
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);

            const botObj = {
                id: (Date.now() + 1).toString(),
                type: "bot",
                content: "",
                options: [...subOptions],
                isInitial: false,
                index: item.id,
                isMenu: isMenu,
            };
            addMessages(botObj);
        }, 1200);
    }

    function handleGenerateAnswer(index, child, isMenu) {

        let res = "";
        if (isMenu) {
            const answer = dummyData[index - 1].sub_queries.find(
                (item) => item.question === child
            )?.answer;
            // ans += answer;

            res += answer;
        }
        else {
            const answer = recentFaqsData[index - 1].sub_queries.find(
                (item) => item.question === child
            )?.answer;
            // ans += answer;

            res += answer;


        }

        const userObj = {
            id: Date.now().toString(),
            type: "user",
            content: child,
        };

        addMessages(userObj);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);

            const botObj = {
                id: (Date.now() + 1).toString(),
                type: "bot",
                content: res,
            };
            addMessages(botObj);
        }, 1500);
    }
    function renderMessage({ item }) {
        if (item.type === "bot") {
            if (item.isInitial) {
                return (
                    <BotContainer content={item.content}>
                        {item.options?.map((option) => (
                            <SecondaryButton
                                onPress={() => handleGenerateOptions(option, false)}
                                key={option}
                            >
                                {option}
                            </SecondaryButton>
                        ))}

                        <MenuButton openMenu={openMenu} />
                    </BotContainer>
                );
            }

            // Plain text bot response
            if (item.content) {
                return <BotContainer content={item.content} />;
            }

            // Options response
            if (item.options?.length) {
                return (
                    <BotContainer>
                        {item.options.map((subOption) => (
                            <SecondaryButton
                                onPress={() =>
                                    handleGenerateAnswer(item.index, subOption, item.isMenu)
                                }
                                key={subOption}
                            >
                                {subOption}
                            </SecondaryButton>
                        ))}
                        <BackToMenuButton/>

                    </BotContainer>

                );
            }

            // fallback
            return null;
        }

        // User messages
        return <UserContainer>{item.content}</UserContainer>;
    }


    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 16, paddingBottom: 20, marginHorizontal: -8, }}
                ListFooterComponent={
                    isTyping ? (
                        <TypeContainer />



                    ) : (
                        <View style={{ height: 6 }} />
                    )
                }
                keyboardShouldPersistTaps="handled"
            />
            <KeyBoard style={styles.keyboard}
                onSend={(message) => {
                    const userObj = {
                        id: Date.now().toString(),
                        type: "user",
                        content: message,
                    };
                    addMessages(userObj);

                    // optionally trigger bot response
                    setIsTyping(true);
                    setTimeout(() => {
                        setIsTyping(false);
                        const botObj = {
                            id: (Date.now() + 1).toString(),
                            type: "bot",
                            content: "I received: " + message,
                        };
                        addMessages(botObj);
                    }, 1500);
                }}
            />

            <Modal SHEET_HEIGHT={SHEET_HEIGHT} closeMenu={closeMenu} isSheetMounted={isSheetMounted} sheetStyle={sheetStyle} handleGenerateOptions={handleGenerateOptions} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    keyboard: {
        textAlign: 'justify'
    }
});






