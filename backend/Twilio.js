const twilio = require('twilio');
const VoiceResponse = require("twilio/lib/twiml/VoiceResponse");

class Twilio {
  tokenSid = "SKd7223d3a4a67843a900490ea27a265cc";
  tokenSecret = "ImjDHSDUz0BnDcBHrE5J7Fzuc6iP26O5";
  accountSid = "AC3d49578db5bb9721b1fcc245d233743a";
  authToken = "21e662eaad7491c05f90cf74ce49983c";
  phoneNumber = "+15075854132";
  phoneNumberSid = "PN852974ecb56871dda622502e8f6df59f";
  verify = "VA46e2618d5984d3f7a1dd92712c5d9270";
  outgoingApplicationSid = "AP620682db666c7fa3f62b6b68c2975ba0";

  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }

  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify.v2
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log("sendVerify", data);
    return data;
  }
  async verifyCodeAsync(to, code) {
    const data = await this.client.verify.v2
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log("verifyCode", data);
    return data;
  }
  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "Polly Bianca",
      },
      message
    );
    twiml.redirect("https://hassan-callcenter.loca.lt/enqueue");
    return twiml;
  }
  enqueueCall(name) {
    const twim = new VoiceResponse();
    twim.enqueue(name);
    return twim;
  }
  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log("Access granted with JWT", token.toJwt());
    return token.toJwt();
  };
}
const instance = new Twilio()

Object.freeze(instance);

module.exports = instance