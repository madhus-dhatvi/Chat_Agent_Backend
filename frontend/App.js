

import ChatScreen from './screen/UIChat';
import BotContextProvider from './store/botContext';

export default function App() {

  return (
    <BotContextProvider>
      <ChatScreen />
    </BotContextProvider>
  );
}


