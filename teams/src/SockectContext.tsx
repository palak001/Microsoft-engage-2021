import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";

// const socket = io("http://localhost:8000/");
const socket = io("https://microsoft-engage-2021-server.herokuapp.com", {
  autoConnect: false,
});

interface ICallDetails {
  from: string;
  signal: any;
  isReceivedCall: boolean;
}

interface IContext {
  socket: any;
  callDetails: ICallDetails;
  callAccepted: any;
  yourVideo: any;
  friendVideo: any;
  stream: any;
  callEnded: any;
  yourID: string;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
  setStreamFunction: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const [stream, setStream] = useState<any>();
  const [yourID, setYourID] = useState<string>("");
  const [callDetails, setCallDetails] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [callEnded, setCallEnded] = useState<any>(false);

  // refs
  const yourVideo = useRef<any>();
  const friendVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    socket.on("yourID", (socketID: string) => {
      setYourID(socketID);
      console.log(socketID);
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

    socket.on("callUser", (data: ICallDetails) => {
      console.log("you are getting a call");
      setCallDetails({
        from: data.from,
        signal: data.signal,
        isReceivedCall: data.isReceivedCall,
      });
      console.log(data.from);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });
    peer.on("signal", (signalData) => {
      socket.emit("acceptCall", { signal: signalData, to: callDetails.from });
    });

    peer.on("stream", (currentStream) => {
      friendVideo.current.srcObject = currentStream;
    });
    // peer.signal(JSON.stringify(callDetails?.signal));
    peer.signal(callDetails.signal);

    connectionRef.current = peer;
  };

  const startCall = (socketId: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    // fires when the peer want to send signalling data to other peers
    peer.on("signal", (signalData: any) => {
      socket.emit("callUser", {
        userToCall: socketId,
        signalData: signalData,
        from: yourID,
      });
    });

    peer.on("stream", (currentStream) => {
      friendVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      console.log("do you still have your video?");
      console.log(signal);
      setCallAccepted(true);
      // peer.signal(JSON.stringify(signal));
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const setStreamFunction = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        yourVideo.current.srcObject = currentStream;
      });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        callDetails,
        callAccepted,
        yourVideo,
        friendVideo,
        stream,
        callEnded,
        yourID,
        answerCall,
        startCall,
        leaveCall,
        setStreamFunction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
