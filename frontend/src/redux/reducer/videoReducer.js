import {
  SET_MAIN_STREAM,
  ADD_PARTICIPANT,
  SET_USER,
  REMOVE_PARTICIPANT,
  UPDATE_USER,
  UPDATE_PARTICIPANT,
} from "../Types/authTypes";

import {
  createOffer,
  initializeListensers,
  updatePreference,
} from "../../server/peerConnection";

let defaultUserState = {
  mainStream: null,
  participants: {},
  currentUser: null,
};

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const userReducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case SET_MAIN_STREAM:
      return { ...state, mainStream: action.payload };
    case ADD_PARTICIPANT: {
      const { newUser } = action.payload;
      const currentUserId = Object.keys(state.currentUser)[0];
      const newUserId = Object.keys(newUser)[0];
      let participants = { ...state.participants };
      
      if (state.mainStream && currentUserId !== newUserId) {
        newUser[newUserId].peerConnection = addConnection(
          newUser[newUserId],
          state.currentUser[currentUserId],
          state.mainStream
        );
      }

      if (currentUserId === newUserId) {
        newUser[newUserId].currentUser = true;
      }

      newUser[newUserId].avatarColor = generateColor();
      participants[newUserId] = newUser[newUserId];
      return { ...state, participants };
    }
    case SET_USER: {
      const { currentUser } = action.payload;
      let participants = { ...state.participants };
      const userId = Object.keys(currentUser)[0];
      currentUser[userId].avatarColor = generateColor();
      initializeListensers(userId);
      return { ...state, currentUser, participants };
    }
    case REMOVE_PARTICIPANT: {
      const { id } = action.payload;
      let participants = { ...state.participants };
      delete participants[id];
      return { ...state, participants };
    }
    case UPDATE_USER: {
      const { currentUser } = action.payload;
      const userId = Object.keys(state.currentUser)[0];
      updatePreference(userId, currentUser);
      let updatedUser = { ...state.currentUser[userId], ...currentUser };
      let currentUserCopy = { ...state.currentUser };
      currentUserCopy[userId] = updatedUser;
      return { ...state, currentUser: currentUserCopy };
    }
    case UPDATE_PARTICIPANT: {
      const { newUser } = action.payload;
      const newUserId = Object.keys(newUser)[0];
      let participants = { ...state.participants };
      let updatedUser = { ...participants[newUserId], ...newUser[newUserId] };
      participants[newUserId] = updatedUser;
      return { ...state, participants };
    }
    default:
      return state;
  }
};

const addConnection = (newUser, currentUser, stream) => {
  const peerConnection = new RTCPeerConnection(servers);
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
    const newUserId = Object.keys(newUser)[0];
    const currentUserId = Object.keys(currentUser)[0];
  
    const offerIds = [newUserId, currentUserId].sort((a, b) =>
      a.localeCompare(b)
    );
  
    newUser[newUserId].peerConnection = peerConnection;
    if (offerIds[0] !== currentUserId)
      createOffer(peerConnection, offerIds[0], offerIds[1]);
    return newUser;
  };
  export default userReducer;