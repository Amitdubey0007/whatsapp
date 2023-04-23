import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth, provider } from '@/firebase';
import { Button } from '@material-ui/core';
import Head from 'next/head';
import React from 'react'
import styled from 'styled-components';

function Login() {

const signIn = async ()=>{
    const result = await signInWithPopup(auth,provider).catch(alert)
}

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src='https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-whatsapp-mobile-software-icon-png-image_6315991.png' />

        <Button onClick={signIn} variant='outlined'>sign in with google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login;

const Container = styled.div`
display:grid;
place-items: center;
height: 100vh;
background-color: whitesmoke;
`;

const LoginContainer = styled.div`
padding:100px;
display:flex;
flex-direction:column;
align-items: center;
background-color: white;
box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
border-radius: 5px;
`;

const Logo = styled.img`
height: 150px;
width: 150px;
margin-bottom: 50px;
`;
