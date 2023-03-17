import React from "react";
import {Grid, Header, Segment,Form, Button} from 'semantic-ui-react';

function Login({user,setUser, sendSmsCode, sendVerificationCode}){
    const populateFields = (event,data)=>{
        setUser((draft)=>{
            draft[data.name] = data.value;
        })
    }
    return(
        <Grid textAlign = 'center' verticalAlign='middle' style={{height:'100vh'}}>
            <Grid.Column style={{maxWidth:450}}>
                <Header as='h2' color="teal" textAlign="center">
                    Login into your account:
                </Header>
                <Form>
                    <Segment stacked>
                        <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='UserName'
                        value={user.username}
                        onChange={(event,data)=> populateFields(event,data)}
                        name="username"
                        />
                        <Form.Input
                            fluid
                            icon='mobile alternate'
                            iconPosition="left"
                            placeholder="Mobile number" 
                            value={user.mobileNumber}
                            onChange={(event,data)=> populateFields(event,data)}
                            name='mobileNumber'
                        />
                       {user.verificationSent && ( <Form.Input
                            fluid
                            icon='key'
                            iconPosition="left"
                            placeholder="Enter your code" 
                            value={user.verificationCode}
                            onChange={(event,data)=> populateFields(event,data)}
                            name='verificationCode'
                        />)}
                        <Button type="button" color="teal" fluid size="large" onClick={!user.verificationSent ? sendSmsCode :sendVerificationCode}>
                            {!user.verificationSent ? 'Login/Signup' :"Enter your Code"}
                        </Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    );
}
export default Login;