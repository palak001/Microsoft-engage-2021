import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import { useHistory } from "react-router";

interface ICallDetails {
  from: string;
  photoURL: string;
  name: string;
  uid: string;
  signal: any;
  isReceivedCall: boolean;
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
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
  rejectCall: () => void;
  toggleAudioSettings: () => void;
  toggleVideoSettings: () => void;
  getUserMediaFunction: () => void;
  sendChatMessage: (chat: string) => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const history = useHistory();

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
        console.log("you are getting a call");
        setGettingCall(true);
        setCallDetails({
          from: data.from,
          name: data.name,
          photoURL: data.photoURL,
          uid: data.uid,
          signal: data.signal,
          isReceivedCall: data.isReceivedCall,
        });
        setOtherPersonID(data.from);
        console.log(data.from);
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
    setOtherPersonID(socketId);
    setCallStarted(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun01.sipphone.com" },
          { urls: "stun:stun.ekiga.net" },
          { urls: "stun:stun.fwdnet.net" },
          { urls: "stun:stun.ideasip.com" },
          { urls: "stun:stun.iptel.org" },
          { urls: "stun:stun.rixtelecom.se" },
          { urls: "stun:stun.schlund.de" },
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stunserver.org" },
          { urls: "stun:stun.softjoys.com" },
          { urls: "stun:stun.voiparound.com" },
          { urls: "stun:stun.voipbuster.com" },
          { urls: "stun:stun.voipstunt.com" },
          { urls: "stun:stun.voxgratia.org" },
          { urls: "stun:stun.xten.com" },
        ],
      },
      stream: stream,
    });

    connectionRef.current = peer;

    // fires when the peer want to send signalling data to other peers
    peer.on("signal", (signalData: any) => {
      socket.current.emit("callUser", {
        userToCall: socketId,
        signalData: signalData,
        from: yourID,
        photoURL: auth.currentUser?.photoURL,
        name: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
      });
    });

    peer.on("stream", (friendStream) => {
      if (friendVideo.current) friendVideo.current.srcObject = friendStream;
      setFriendStream(friendStream);
    });

    peer.on("error", (err) => {
      console.log("call start error");
      console.log(err);
    });

    socket.current.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(JSON.stringify(signal));
    });

    socket.current.on("callEnded", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      console.log("callEnded");
      setCallAccepted(false);
      setCallStarted(false);
    });

    socket.current.on("callRejected", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      console.log("callRejected");
      setCallAccepted(false);
      setCallStarted(false);
      // setCallDetails(null);
    });
    // });
  };

  const answerCall = () => {
    setCallAccepted(true);
    setGettingCall(false);
    const peer = new Peer({
      initiator: false,
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
      console.log("callEnded");
      setCallAccepted(false);
      setCallStarted(false);
    });

    socket.current.on("callRejected", () => {
      stopMediaTracks(stream);
      setCallEnded(true);
      console.log("callRejected");
      setCallAccepted(false);
      setCallStarted(false);
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

  const getUserMediaFunction = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (yourVideo.current) yourVideo.current.srcObject = currentStream;
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        console.log("stopping tracks:", track);
        track.stop();
      });
      if (yourVideo.current) yourVideo.current.srcObject = null;
      setStream(null);
    }
  };

  const sendChatMessage = (chat: string) => {
    if (socket.current) {
      socket.current.emit("chat", {
        to: otherPersonID,
        content: chat,
        from: yourID,
        name: auth.currentUser?.displayName,
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
        answerCall,
        startCall,
        leaveCall,
        rejectCall,
        toggleAudioSettings,
        toggleVideoSettings,
        getUserMediaFunction,
        sendChatMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
