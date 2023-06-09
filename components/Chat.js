
import { auth, db } from '@/firebase';
import getRecipientEmail from '@/utils/getRecipientEmail';
import { Avatar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components'
import {useCollection} from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { Router, useRouter } from 'next/router';

function Chat({id,users}) {
    const [user] = useAuthState(auth);

    const recipientEmail = getRecipientEmail(users, user);

    const recipientQuery = query(collection(db, "users"), where("email", "==", recipientEmail));
    const [recipientSnapshot] = useCollection(recipientQuery);

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const router = useRouter();

    const enterChat = () =>{
      router.push(`/chat/${id}`)
    }

// const recipientEmail = getRecipientEmail(users, user)

  return (
    <Container onClick={enterChat}>
    {recipient ? (
    <UserAvatar src={recipient?.photoURL}/>

    ):( <UserAvatar>{recipientEmail[0]}</UserAvatar>)}

      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat;

const Container = styled.div`
display: flex;
align-items: center;
cursor: pointer;
padding: 15px;
word-break: break-word;

:hover{
    background-color: #e9eaeb;
}
`;

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right:15px;
`;