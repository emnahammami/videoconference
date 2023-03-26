import React, { useRef, useEffect } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import Participants from "../Participants/Participants.component";
import "./MainScreen.css";
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator"

const MainScreen = ({ stream, participants, currentUser, setMainStream, updateUser }) => {
  const participantRef = useRef(participants);

  const onMicClick = (micEnabled) => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = micEnabled;
      updateUser({ audio: micEnabled });
    }
    console.log(stream)
  };

  const onVideoClick = (videoEnabled) => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = videoEnabled;
      updateUser({ video: videoEnabled });
    }
  };

  useEffect(() => {
    participantRef.current = participants;
  }, [participants]);

  const updateStream = (newStream) => {
    for (const key in participantRef.current) {
      const sender = participantRef.current[key];
      if (sender.currentUser) continue;
      const peerConnection = sender.peerConnection.getSenders()
        .find((s) => s.track?.kind === "video");
      peerConnection.replaceTrack(newStream.getVideoTracks()[0]);
    }
    setMainStream(newStream);
  };

  const onScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStream.getVideoTracks()[0].enabled = Object.values(currentUser)[0].video;
    updateStream(localStream);
    updateUser({ screen: false });
  };

  const onScreenClick = async () => {
    let mediaStream;
    if (navigator.getDisplayMedia) {
      mediaStream = await navigator.getDisplayMedia({ video: true });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: { mediaSource: "screen" } });
    }

    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;
    updateStream(mediaStream);
    updateUser({ screen: true });
  };

  return (
    <div className="wrapper">
      <div className="main-screen">
        <Participants />
      </div>
      <div className="footer">
        <MeetingFooter onScreenClick={onScreenClick} onMicClick={onMicClick} onVideoClick={onVideoClick} />
      </div>
    </div>
  );
};

export default connect(
  (state) => ({ stream: state.mainStream, participants: state.participants, currentUser: state.currentUser }),
  { setMainStream, updateUser }
)(MainScreen);
