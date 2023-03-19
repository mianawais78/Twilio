import { Container, Step } from "semantic-ui-react";

const CallProgress = (props) => {
  return (
    <Container>
      <Step.Group fluid>
        <Step
          icon="phone"
          title="Ringing"
          description={props.call.data.From}
          active={props.call.data.CallStatus === "ringing"}
          completed={props.call.data.CallStatus !== "ringing"}
        />
        <Step
          icon="cogs"
          title="In queue"
          description="User waiting in queue"
          active={props.call.data.CallStatus !== "enqueue"}
          disabled={props.call.data.CallStatus === "ringing"}
        />
        <Step
          icon="headphones"
          title="Answered"
          description="Answer by John"
          disabled={
            props.call.data.CallStatus === "ringing" ||
            props.call.data.CallStatus === "enqueue"
          }
        />
        <Step icon="times" title="Hang up" description="Missed Call" />
      </Step.Group>
    </Container>
  );
};

export default CallProgress;
