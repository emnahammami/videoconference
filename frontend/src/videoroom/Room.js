import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
const socket = io('http://localhost:4000');

function Room() {
  const params = useParams();
  const [roomId, setRoomId] = useState(uuidv4());
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [peers, setPeers] = useState({});
  const remoteVideoRefs = useRef([]);
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    // Initialize Peer
    const peer = new Peer();

    // Log the peer ID when it opens
    peer.on('open', () => {
      console.log('Peer ID:', peer.id);
      // Join the room with the socket
      socket.emit('join-room', roomId, peer.id);
    });

    // Get user media and set it as the local stream
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      setLocalStream(stream);
      videoRef.current.srcObject = stream;

      // Listen for incoming calls and answer them with the local stream
      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
        });
      });

      // Call all other peers in the room
      socket.on('user-connected', (userId) => {
        const call = peer.call(userId, stream);
        call.on('stream', (remoteStream) => {
          setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
        });
        setPeers((prevPeers) => {
          return { ...prevPeers, [userId]: call.peer };
        });
      });

      // Remove disconnected peers from the list
      socket.on('user-disconnected', (userId) => {
        setRemoteStreams((prevStreams) => prevStreams.filter((stream) => stream.id !== userId));
        setPeers((prevPeers) => {
          const { [userId]: removedPeer, ...restPeers } = prevPeers;
          return restPeers;
        });
      });

      // Clean up the media stream when the component unmounts
      return () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    });
  }, [roomId]);

  useEffect(() => {
    remoteVideoRefs.current = remoteVideoRefs.current.slice(0, remoteStreams.length);
  }, [remoteStreams]);

  const toggleAudio = () => {
    setLocalStream((prevStream) => {
      prevStream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });

      setAudioEnabled(!audioEnabled);
      return prevStream;
    });
  };

  const toggleVideo = () => {
    setLocalStream((prevStream) => {
      prevStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });

      setVideoEnabled(!videoEnabled);
      return prevStream;
    });
  };

  const handleJoinClick = () => {
    const videoCallLink = window.location.href;
    navigator.clipboard.writeText(videoCallLink);
    alert(`The video call link has been copied to your clipboard: ${videoCallLink}`);
  };
  
  return (
    <div>
    <h1>Google Meet Clone</h1>
    <video autoPlay playsInline muted ref={videoRef} />
    {remoteStreams.map((remoteStream, index) => (
  <video key={remoteStream.id} autoPlay playsInline ref={remoteVideoRefs.current[index]} />
))}
    <div>
    <button onClick={toggleAudio}>{audioEnabled ? 'Disable Audio' : 'Enable Audio'}</button>
    <button onClick={toggleVideo}>{videoEnabled ? 'Disable Video' : 'Enable Video'}</button>
    <button onClick={() => {window.location.href = `http://localhost:3000/room/${roomId}`;handleJoinClick()}}>Join</button>

    </div>
    </div>
    );
    }
    
    export default Room;
    

