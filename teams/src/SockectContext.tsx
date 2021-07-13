import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import { useDispatch } from "react-redux";
import { fetchMediaStreamErrorAction } from "./redux-store/Video/MediaStreamErrorReducer";

interface ICallDetails {
  meetingName: string;
  from: string;
  photoURL: string;
  name: string;
  uid: string;
  signal: any;
  isReceivedCall: boolean;
  meetingID: string;
}

interface IContext {
  socket: any;
  callDetails: ICallDetails;
  callAccepted: any;
  callStarted: any;
  gettingCall: any;
  yourVideo: any;
  friendVideo: any;
  stream: any;
  friendStream: any;
  callEnded: any;
  yourID: string;
  callRejected: any;
  startingCall: any;
  acceptingCall: any;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
  rejectCall: () => void;
  toggleAudioSettings: () => void;
  toggleVideoSettings: () => void;
  getUserMediaFunction: () => void;
  sendChatMessage: (chat: any) => void;
  setAcceptingCallToTrue: () => void;
  setStartingCallToTrue: () => void;
  stopMediaTracks: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const history = useHistory();
  const { search }: any = useLocation();
  const queryParameter = qs.parse(search, { ignoreQueryPrefix: true });
  const dispatch = useDispatch();

  // Local States
  const [stream, setStream] = useState<any>();
  const [friendStream, setFriendStream] = useState<any>();
  const [yourID, setYourID] = useState<string>("");
  const [callDetails, setCallDetails] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [callStarted, setCallStarted] = useState<any>(false);
  const [callEnded, setCallEnded] = useState<any>(false);
  const [callRejected, setCallRejected] = useState<any>(false);
  const [gettingCall, setGettingCall] = useState<any>(false);
  const [otherPersonID, setOtherPersonID] = useState<any>();
  const [startingCall, setStartingCall] = useState<any>(false);
  const [acceptingCall, setAcceptingCall] = useState<any>(false);
  // refs
  const yourVideo = useRef<any>();
  const friendVideo = useRef<any>();
  const connectionRef = useRef<any>();
  const socket = useRef<any>();

  // useEffects
  useEffect(() => {
    /* For production */
    socket.current = io("https://microsoft-engage-2021-server.herokuapp.com", {
      autoConnect: false,
    });
    /* for developement */
    // socket.current = io("http://localhost:8000", {
    //   autoConnect: false,
    // });

    socket.current.on("connect", () => {
      socket.current.emit("authentication", {
        username: auth.currentUser?.email,
        uid: auth.currentUser?.uid,
      });

      /* When you already have an active session */
      socket.current.on("InvalidSession", () => {
        history.push("/activesession");
      });
      socket.current.on("authenticated", function () {
        // console.log("authenticated");
      });

      /* Recieve socketID */
      socket.current.on("yourID", (socketID: string) => {
        setYourID(socketID);
        if (auth.currentUser) {
          db.collection("users")
            .doc(auth.currentUser?.email + "")
            .set(
              {
                socketID: socketID,
              },
              { merge: true }
            );
        }
      });

      /* Receiving call */
      socket.current.on("callingYou", (data: ICallDetails) => {
        setGettingCall(true);
        setCallDetails({
          from: data.from,
          name: data.name,
          photoURL: data.photoURL,
          uid: data.uid,
          signal: data.signal,
          meetingID: data.meetingID,
          meetingName: data.meetingName,
          isReceivedCall: data.isReceivedCall,
        });
        setOtherPersonID(data.from);
        history.push("/");
      });
    });
  }, [history]);

  /* Setting streams if not already set */
  useEffect(() => {
    if (callAccepted || callStarted) {
      if (yourVideo.current && !yourVideo.current.srcObject) {
        yourVideo.current.srcObject = stream;
      }
      if (friendVideo.current && !friendVideo.current.srcObject) {
        friendVideo.current.srcObject = friendStream;
      }
    }
  }, [callStarted, callAccepted, stream, friendStream]);

  // Helper Functions

  /* For starting a call */
  const startCall = (socketId: string) => {
    setCallStarted(true);
    setOtherPersonID(socketId);

    /* Creating a new peer */
    const peer = new Peer({
      initiator: true,
      offerOptions: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      },
      stream: stream,
    });

    connectionRef.current = peer;
    // fires when the peer want to send signalling data to other peers
    peer.on("signal", (signalData: any) => {
      db.collection("meetings")
        .doc(`${queryParameter.meetingID}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            socket.current.emit("callUser", {
              userToCall: socketId,
              signalData: signalData,
              from: yourID,
              photoURL: auth.currentUser?.photoURL,
              name: auth.currentUser?.displayName,
              uid: auth.currentUser?.uid,
              meetingID: queryParameter.meetingID,
              meetingName: doc.data()?.meetingName,
            });
          }
        });
    });

    /* fires on receiving friends stream */
    peer.on("stream", (friendStream) => {
      if (friendVideo.current) friendVideo.current.srcObject = friendStream;
      setFriendStream(friendStream);
    });

    peer.on("error", (err) => {
      console.log("call start error");
      console.log(err);
    });

    /* Fires when the friend has accepted the call */
    socket.current.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(JSON.stringify(signal));
    });

    /* Fires when the friend has ended the call */
    socket.current.on("callEnded", () => {
      stopMediaTracks();
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
      window.location.reload();
    });

    /* Fires when the friend has rejected the call */
    socket.current.on("callRejected", () => {
      stopMediaTracks();
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
      window.location.reload();
    });
  };

  /* Answer call function */
  const answerCall = () => {
    setCallAccepted(true);
    setGettingCall(false);
    /* peer object */
    const peer = new Peer({
      initiator: false,
      answerOptions: {
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      },
      trickle: false,
      stream: stream,
    });
    connectionRef.current = peer;
    /* Fires when the peer is ready with signalling data */
    peer.on("signal", (signalData) => {
      socket.current.emit("acceptedCall", {
        signal: signalData,
        to: callDetails.from,
      });
    });

    /* fires on receiving friends stream */
    peer.on("stream", (friendStream) => {
      setFriendStream(friendStream);
      if (friendVideo.current) friendVideo.current.srcObject = friendStream;
    });

    peer.on("error", (err) => {
      console.log(err);
    });

    peer.signal(JSON.stringify(callDetails.signal));

    /* Fires when the friend has ended the call */
    socket.current.on("callEnded", () => {
      stopMediaTracks();
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
      window.location.reload();
    });

    /* Fires when the friend has rejected the call */
    socket.current.on("callRejected", () => {
      stopMediaTracks();
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
      window.location.reload();
    });
  };

  const leaveCall = () => {
    // To switch off your webcam light!
    stopMediaTracks();
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callEnded", { to: otherPersonID });
    history.push("/");
    window.location.reload();
  };

  const rejectCall = () => {
    // To switch of your webcam light!
    stopMediaTracks();
    setCallRejected(true);
    if (connectionRef.current) connectionRef.current.destroy();
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callRejected", { to: otherPersonID });
    history.push("/");
    window.location.reload();
  };

  const setStartingCallToTrue = () => {
    setStartingCall(true);
  };

  const setAcceptingCallToTrue = () => {
    setAcceptingCall(true);
  };

  /* For getting user media */
  const getUserMediaFunction = () => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      var cam = devices.find(function (device) {
        return device.kind === "videoinput";
      });
      var mic = devices.find(function (device) {
        return device.kind === "audioinput";
      });

      var constraints = { video: cam, audio: mic };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          setStream(stream);
          if (yourVideo.current) yourVideo.current.srcObject = stream;
        })
        .catch(function (err) {
          /* Sets error in case of failure in getting user media */
          if (cam || mic) {
            // console.log(err);
            setStream(null);
            if (yourVideo.current) yourVideo.current.srcObject = null;

            handleGetUserMediaError(err);
          } else {
            dispatch(
              fetchMediaStreamErrorAction(
                "Can't find your camera and microphone. Check your system settings to make sure that a camera and microphone is available. You may need to restart your browser."
              )
            );
          }
        });
    });
  };

  /* For handling userMedia related error */
  function handleGetUserMediaError(e: any) {
    switch (e.name) {
      case "NotFoundError":
        dispatch(
          fetchMediaStreamErrorAction(
            "Can't find your camera and microphone. Check your system settings to make sure that a camera and/or microphone is available. You may need to restart your browser."
          )
        );
        break;
      case "SecurityError":
        dispatch(fetchMediaStreamErrorAction("Security Error"));
        break;
      case "PermissionDeniedError":
        dispatch(
          fetchMediaStreamErrorAction(
            "Can't access your camera and microphone. System has denied Permission. Check your system settings to allow access to camera and microphone. You may need to restart your browser."
          )
        );
        break;
      default:
        dispatch(
          fetchMediaStreamErrorAction(
            "Error while opening your camera and/or microphone: " + e.message
          )
        );
        break;
    }
  }

  /* Functions to toggle audio and video settings */
  const toggleAudioSettings = () => {
    if (stream) {
      stream.getTracks().forEach(function (track: any) {
        if (track.kind === "audio") {
          track.enabled = !track.enabled;
        }
      });
    }
  };

  const toggleVideoSettings = () => {
    if (stream) {
      stream.getTracks().forEach(function (track: any) {
        if (track.kind === "video") {
          track.enabled = !track.enabled;
        }
      });
    }
  };

  /* Function to stop media tracks in case of leave call or reject call */
  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach(function (track: any) {
        track.stop();
      });
      if (yourVideo.current) yourVideo.current.srcObject = null;
      setStream(null);
    }
  };

  // Chatting related
  const sendChatMessage = (chatObject: any) => {
    if (socket.current) {
      db.collection("users")
        .doc(chatObject.receiverEmail)
        .get()
        .then((doc) => {
          if (doc.exists) {
            socket.current.emit("chat", {
              to: doc.data()?.socketID,
              message: chatObject.message,
              from: yourID,
              senderEmail: auth.currentUser?.email,
              meetingID: chatObject.meetingID,
            });
          }
        });
    }
  };
  return (
    <SocketContext.Provider
      value={{
        socket,
        callDetails,
        callAccepted,
        callStarted,
        gettingCall,
        yourVideo,
        friendVideo,
        stream,
        friendStream,
        callEnded,
        yourID,
        callRejected,
        startingCall,
        acceptingCall,
        answerCall,
        startCall,
        leaveCall,
        rejectCall,
        toggleAudioSettings,
        toggleVideoSettings,
        getUserMediaFunction,
        sendChatMessage,
        setStartingCallToTrue,
        setAcceptingCallToTrue,
        stopMediaTracks,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
