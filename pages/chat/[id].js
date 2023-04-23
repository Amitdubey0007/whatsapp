import ChatScreen from "@/components/ChatScreen";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import styled from "styled-components";
import { getFirestore, collection, doc, query, orderBy, getDocs,getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";

function Chat({messages,chat}) {
const [user] = useAuthState(auth)

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users,user)}</title>
      </Head>
    <Sidebar />

    <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
    </ChatContainer>
      
    </Container>
  )
}

export default Chat;

export async function getServerSideProps(context) {
    const db = getFirestore();
    const ref = doc(collection(db, "chats"), context.query.id);
  
    // Prep the messages on the server
    const messagesRef = query(
      collection(ref, "messages"),
      orderBy("timestamp", "asc")
    );
  
    const messagesSnapshot = await getDocs(messagesRef);
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().getTime(),
    }));

    //prep the chats
    const chatRes = await getDoc(ref);
    const chat = {
        id:chatRes.id,
        ...chatRes.data()
    }
   
  
    return {
      props: {
        messages: JSON.stringify(messages),
        chat:chat
      },
    };
  }

const Container = styled.div`
display: flex;
`;

const ChatContainer = styled.div`
flex: 1;
overflow: scroll;
height: 100vh;

::-webkit-scrollbar{
    display: none;
}
`;