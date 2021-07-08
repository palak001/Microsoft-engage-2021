import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import SimplePeer from "simple-peer";

interface ICallDetails {
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
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const history = useHistory();
  const { search }: any = useLocation();
  const queryParameter = qs.parse(search, { ignoreQueryPrefix: true });

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
    socket.current = io("https://microsoft-engage-2021-server.herokuapp.com", {
      autoConnect: false,
    });
    // socket.current = io("http://localhost:8000", {
    //   autoConnect: false,
    // });

    socket.current.on("connect", () => {
      console.log("sending authentication data");
      socket.current.emit("authentication", {
        username: auth.currentUser?.email,
        uid: auth.currentUser?.uid,
      });

      socket.current.on("InvalidSession", () => {
        console.log("Unauthorized:");
        history.push("/activesession");
      });
      socket.current.on("authenticated", function () {
        console.log("authenticated");
      });

      socket.current.on("yourID", (socketID: string) => {
        console.log("Your ID: ", socketID);
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
      socket.current.on("callingYou", (data: ICallDetails) => {
        setGettingCall(true);
        // console.log("getting call", callDetails);
        console.log("details: ", data);
        setCallDetails({
          from: data.from,
          name: data.name,
          photoURL: data.photoURL,
          uid: data.uid,
          signal: data.signal,
          meetingID: data.meetingID,
          isReceivedCall: data.isReceivedCall,
        });
        setOtherPersonID(data.from);
      });
    });
  }, [history]);

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

  const startCall = (socketId: string) => {
    console.log("call started so start");
    setCallStarted(true);
    setOtherPersonID(socketId);
    console.log("stream", stream);
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
    console.log("queryParamenter", queryParameter);
    // fires when the peer want to send signalling data to other peers
    peer.on("signal", (signalData: any) => {
      console.log("How many times:", signalData);
      socket.current.emit("callUser", {
        userToCall: socketId,
        signalData: signalData,
        from: yourID,
        photoURL: auth.currentUser?.photoURL,
        name: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
        meetingID: queryParameter.meetingID,
      });
      console.log("seriously!");
    });

    peer.on("stream", (friendStream) => {
      console.log("receiving friendStream");
      if (friendVideo.current) friendVideo.current.srcObject = friendStream;
      setFriendStream(friendStream);
    });

    peer.on("error", (err) => {
      console.log("call start error");
      console.log(err);
    });

    socket.current.on("callAccepted", (signal: any) => {
      console.log("call Accepted");
      console.log("signal: ", signal);
      console.log("signal");
      setCallAccepted(true);
      peer.signal(JSON.stringify(signal));
    });

    socket.current.on("callEnded", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
    });

    socket.current.on("callRejected", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      // setCallDetails(null);
      history.push("/");
    });
    // });
  };

  const answerCall = () => {
    setCallAccepted(true);
    setGettingCall(false);
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

    peer.on("signal", (signalData) => {
      socket.current.emit("acceptedCall", {
        signal: signalData,
        to: callDetails.from,
      });
    });

    peer.on("stream", (friendStream) => {
      setFriendStream(friendStream);
      if (friendVideo.current) friendVideo.current.srcObject = friendStream;
    });

    peer.on("error", (err) => {
      console.log(err);
    });

    peer.signal(JSON.stringify(callDetails.signal));

    socket.current.on("callEnded", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
    });

    socket.current.on("callRejected", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      setCallAccepted(false);
      setCallStarted(false);
      history.push("/");
    });
    // });
  };

  const leaveCall = () => {
    // To switch your webcam light!
    stopMediaTracks(stream);

    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    console.log("streams: ", stream);
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callEnded", { to: otherPersonID });
    // check why this is not working
    history.push("/");
  };

  const rejectCall = () => {
    // To switch your webcam light!
    stopMediaTracks(stream);
    setCallRejected(true);
    if (connectionRef.current) connectionRef.current.destroy();
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callRejected", { to: otherPersonID });
    history.push("/");
  };

  const setStartingCallToTrue = () => {
    setStartingCall(true);
  };

  const setAcceptingCallToTrue = () => {
    setAcceptingCall(true);
  };

  const getUserMediaFunction = () => {
    // console.log("navigator", navigator.mediaDevices);
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     setStream(currentStream);
    //     if (yourVideo.current) yourVideo.current.srcObject = currentStream;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      console.log(devices);
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
          console.log(err);
          setStream(null);
          if (yourVideo.current) yourVideo.current.srcObject = null;

          handleGetUserMediaError(err);
        });
    });
  };

  function handleGetUserMediaError(e: any) {
    // switch (e.name) {
    //   case "NotFoundError":
    //     alert(
    //       "Unable to open your call because no camera and/or microphone" +
    //         "were found."
    //     );
    //     break;
    //   case "SecurityError":
    //   case "PermissionDeniedError":
    //     // Do nothing; this is the same as the user canceling the call.
    //     break;
    //   default:
    //     alert("Error opening your camera and/or microphone: " + e.message);
    //     break;
    // }
    // connectionRef.current.close();
    // closeVideoCall();
  }

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

  const stopMediaTracks = (currentStream: any) => {
    if (currentStream) {
      currentStream.getTracks().forEach(function (track: any) {
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
