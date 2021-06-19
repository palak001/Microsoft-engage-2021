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
  yourID: any;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
  setStreamFunction: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const [stream, setStream] = useState<any>();
  const [yourID, setYourID] = useState<any>("");
  const [callDetails, setCallDetails] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [callEnded, setCallEnded] = useState<any>(false);

  // refs
  const yourVideo = useRef<any>();
  const friendVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    socket.on("yourID", (socketID) => {
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

    socket.on("calling", (data: any) => {
      setCallDetails({
        from: data.from,
        signal: data.signal,
        isReceivedCall: true,
      });
      console.log(data.from);
    });
  }, [yourID, callDetails]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });
    peer.on("signal", (data: ICallDetails) => {
      socket.emit("acceptCall", { signal: data, to: callDetails.from });
    });

    peer.on("stream", (currentStream) => {
      if (friendVideo.current) {
        friendVideo.current.srcObject = currentStream;
      }
    });
    if (callDetails) peer.signal(callDetails.signal);
    connectionRef.current = peer;
  };

  const startCall = (socketId: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data: any) => {
      socket.emit("callUser", {
        userToCall: socketId,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (currentStream) => {
      if (friendVideo) friendVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
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
        if (yourVideo.current) yourVideo.current.srcObject = currentStream;
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
