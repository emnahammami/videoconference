import React, { useEffect, useRef } from "react";
import "./Participants.css";
import { connect } from "react-redux";
import { Participant } from "./Participant/Participant.component";

const Participants = (props) => {
  const videoRef = useRef(null);
  let participantKeys = props.participants ? Object.keys(props.participants) : [];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
      videoRef.current.muted = true;
    }
  }, [props.currentUser, props.stream]);

  const currentUser = props.currentUser
    ? Object.values(props.currentUser)[0]
    : null;

  const gridCol =
    participantKeys.length === 1 ? 1 : participantKeys.length <= 4 ? 2 : 4;
  const gridColSize = participantKeys.length <= 4 ? 1 : 2;
  const gridRowSize =
    participantKeys.length <= 4
      ? participantKeys.length
      : Math.ceil(participantKeys.length / 2);

  const screenPresenter = participantKeys.find((element) => {
    const currentParticipant = props.participants[element];
    return currentParticipant.screen;
  });

  if (screenPresenter) {
    gridCol = 1;
  }

  const participants = participantKeys.map((element, index) => {
    const currentParticipant = props.participants[element];
    const isCurrentUser = currentParticipant.currentUser;
    if (isCurrentUser) {
      return null;
    }
    const pc = currentParticipant.peerConnection;
    const remoteStream = new MediaStream();
    const curentIndex = index;
    if (pc) {
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videoElement = document.getElementById(
          `participantVideo${curentIndex}`
        );
        if (videoElement) {
          videoElement.srcObject = remoteStream;
        }
      };
    }

    return (
      <Participant
        key={curentIndex}
        currentParticipant={currentParticipant}
        curentIndex={curentIndex}
        hideVideo={screenPresenter && screenPresenter !== element}
        showAvatar={
          !currentParticipant.video &&
          !currentParticipant.screen &&
          currentParticipant.name
        }
      />
    );
  });
  return (
    <div
      style={{
        "--grid-size": gridCol,
        "--grid-col-size": gridColSize,
        "--grid-row-size": gridRowSize,
      }}
      className={`participants`}
    >
      {participants}
      <Participant
        currentParticipant={currentUser}
        curentIndex={participantKeys.length}
        hideVideo={screenPresenter && !currentUser?.screen}
        videoRef={videoRef}
        showAvatar={!currentUser?.video && !currentUser?.screen}
        currentUser={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    currentUser: state.currentUser,
    stream: state.mainStream,
  };
};

export default connect(mapStateToProps)(Participants);
