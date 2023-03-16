const twilio = require('twilio');

class Twilio{
    tokenSid = 'SKd7223d3a4a67843a900490ea27a265cc'
    tokenSecret = 'ImjDHSDUz0BnDcBHrE5J7Fzuc6iP26O5'
    accountSid = 'AC3d49578db5bb9721b1fcc245d233743a'
    authToken = '21e662eaad7491c05f90cf74ce49983c'
    phoneNumber = '+15075854132'
    phoneNumberSid = 'PN852974ecb56871dda622502e8f6df59f'
    verify = 'VA46e2618d5984d3f7a1dd92712c5d9270'
    
    constructor(){
        this.client = twilio(this.tokenSid,this.tokenSecret, {
            accountSid: this.accountSid,
        });
    }
    
    getTwilio(){
        this.client;
    }
    
    async sendVerifyAsync(to,channel){
        const data = await this.client.verify.v2.services(this.verify).verifications.create({
            to,
            channel,
        });
        console.log('sendVerify',data)
        return data;
    }
    async verifyCodeAsync(to,code){
        const data = await this.client.verify.v2.services(this.verify).verificationChecks.
        create({
            to,
            code,
        });
        console.log('verifyCode',data);
        return ;
    }
}
const instance = new Twilio()

Object.freeze(instance);

module.exports = instance