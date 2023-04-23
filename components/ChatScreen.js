import { auth, db } from '@/firebase';
import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore';
// import { collection, doc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { InsertEmoticon, Mic } from '@material-ui/icons';
import { getFirestore, serverTimestamp, collection, doc, updateDoc, addDoc, query,orderBy,getDocs,where } from 'firebase/firestore';
import Message from './Message';
import getRecipientEmail from '@/utils/getRecipientEmail';
import TimeAgo from 'timeago-react';




function ChatScreen({chat, messages}) {
    const endOfMessageRef = useRef(null);
    const [input, setInput] = useState("");
    const[user] = useAuthState(auth);
    const router = useRouter();

    const chatMessagesRef = collection(doc(db, "chats", router.query.id), "messages");
    const q = query(chatMessagesRef, orderBy("timestamp","asc"));
    const [messagesSnapshot] = useCollection(q);

    const [recipientSnapshot] = useCollection(
        query(collection(db, "users"), where("email", "==", getRecipientEmail(chat.users, user)))
    );

    const showMessages = () =>{
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message =>(
                <Message
                key={message.id}
                user={message.data().user}
                message={{...message.data(),
                timestamp: message.data().timestamp?.toDate().getTime()}}
                 />
            ))
        }else{
            return JSON.parse(messages).map(message =>(
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    };

    const scrollToBottom = () =>{
        endOfMessageRef.current.scrollIntoView(
            {behavior: 'smooth',block:"start",
        });
    }

    const sendMessage = (e)=>{
        e.preventDefault();

        //Update the last seen
        updateDoc(doc(db, "users", user.uid), {
            lastSeen: serverTimestamp()
        });

        addDoc(collection(doc(db, "chats", router.query.id), "messages"), {
            timestamp:serverTimestamp(),
            message:input,
            user:user.email,
            photoURL: user.photoURL
        });

        setInput("");
        scrollToBottom();

        }

        const recipient = recipientSnapshot?.docs?.[0]?.data();
        const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <Container>
        <Header>
        {
            recipient ? (
                <Avatar src={recipient?.photoURL} />
            ):
            <Avatar>{recipientEmail[0]}</Avatar>
        }
            

            <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
            <p>Last active: {" "}
            {recipient?.lastSeen?.toDate() ?(
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ): "unavailable" }
            </p>

            ): (
            <p>Loading Last Active...</p>)
            }
                
            </HeaderInformation>
            <HeaderIcon>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </HeaderIcon>
            </Header>

            <MessageContainer>
            {showMessages()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            <InputContainer>
            <InsertEmoticon/>
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} onClick={sendMessage} >Send Message</button>
                <Mic />
            </InputContainer>
        
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`
    
`;

const Header = styled.div`
position: sticky;
background-color: white;
top: 0;
z-index: 100;
display: flex;
padding: 11px;
height: 54px;
align-items: center;
border-bottom:1px solid whitesmoke
`;

const HeaderInformation = styled.div`
margin-left:15px;
flex: 1;

>h3{
    margin-bottom: 3px;
}

>p{
    font-size: 14px;
    color: gray;
}
`;

const MessageContainer = styled.div`
 padding: 30px;
 background-color: #e5ded8;
 min-height: 90vh;
`;

const EndOfMessage = styled.div`
margin-bottom: 50px;
`;

const HeaderIcon = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    position:sticky;
    bottom: 0;
    padding: 10px;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
background-color: whitesmoke;
padding: 20px;
margin-left: 15px;
margin-right: 15px;
`;