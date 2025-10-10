import { createContext, useContext, useState } from "react";
import { dummyData, recentFaqsData } from "../data/dummyData";

export const BotContext = createContext({
    messages: [],
    addMessages: (obj) => { },
})
// const recentFaqs = dummyData.map((item) => item.category);
const recentFaqs = recentFaqsData.map((item) => item.category);
function BotContextProvider({ children }) {
    const [messages, setMessages] = useState([{
        type: "bot",
        content: "Hii there! Welcome to DBS Delivery I'm your virtual assistant - here to make your experiance quick and easy How can i help today? ",
        options: [...recentFaqs],
        isInitial: true,
        index: null,
        child: null,
    }]);
    function addMessages(obj) {
        setMessages((msg) => [...msg, obj])
    }
    const value = {
        messages,
        addMessages,
    }
    return (
        <BotContext.Provider value={value}>
            {children}
        </BotContext.Provider>
    );
}
// export function useApp() {
//     useContext(BotContext)
// }
export default BotContextProvider;