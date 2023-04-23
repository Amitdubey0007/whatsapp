import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import EmailValidator from 'email-validator';
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, query, where  } from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);

  const chatCollectionRef = collection(db, "chats");
  const userChatRef = query(chatCollectionRef, where('users','array-contains',user.email));
  const [chatSnapshot] = useCollection(userChatRef)

  const createChat = () => {
    const input = prompt('Please Enter the email address of the user you wish to chat');

    if (!input) return null;

    async function addChat(user, input) {
      if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
        const chatCollectionRef = collection(db, "chats");
        const newChatDocRef = await addDoc(chatCollectionRef, {
          users: [user.email, input],
        });
      }
    }

    addChat(user, input);
  }

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatSnapshot?.docs.find((chat) =>
      chat.data().users.includes(recipientEmail)
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>
        Start a New Chat
      </SidebarButton>

      {chatSnapshot?.docs.map((chat)=>(
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display:none;
        
        -ms-overflow-style:none;
        scrollbar-width: none;
    }
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius:2px
`;

const SearchInput = styled.input`
    outline-width: 0;
    border:none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
   
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    justify-content: space-between;
    align-items: center;
    top: 0;
    z-index: 1;
    background-color: white;
    padding: 15px;
    height: 54px;
    border-bottom: 1px solid whitesmoke;
    padding-bottom: 7px;
`;

const UserAvatar =styled(Avatar)``;

const IconsContainer =styled.div``;


