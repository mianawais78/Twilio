import Login  from './components/Login';
import {useImmer} from 'use-immer';
import axios from './utils/Axios';
import socket from './utils/Socket';
import { useEffect } from 'react';
function App() {
  useEffect(()=>{
    socket.on('disconnect',()=>{
      console.log('Socket disconnected.');
    })
    return ()=>{};
  },[])
  const [user,setUser] = useImmer({
    username:'',
    mobileNumber:'',
    verificationCode:'',
    verificationSent:false,
  });
  async function sendSmsCode(){
    
    console.log("Sending SMS");
    await axios.post('/login',{
      to:user.mobileNumber,
      username:user.username,
      channel:'sms'
    });
    setUser(draft =>{
      draft.verificationSent= true;
    })
  }
   const sendVerificationCode = async () =>{
    console.log('Sending Verification Code.')
    const response = await axios.post('/verify',{
      to:user.mobileNumber,
      code:user.verificationCode
    });
    console.log("Verification Code", response.data);
  }
  return (
    <div className="App">
     <Login user={user}
      setUser={setUser}
      sendSmsCode = {sendSmsCode}
      sendVerificationCode = {sendVerificationCode}
      /> 
    </div>
  );
}

export default App;
