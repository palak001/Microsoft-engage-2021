import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";

const socket = io("http://localhost:8000/");

interface ICallDetails {
  from: string;
  signal: any;
  isReceivedCall: boolean;
}

// interface IInfoNeeded {
//   callDetails: ICallDetails;
//   callAccepted: boolean;
//   yourVideo: any;
//   friendVideo: any;
//   stream: MediaStream;
//   callEnded: boolean;
//   yourID: string;
// }

interface IContext {
  callDetails: any;
  callAccepted: any;
  yourVideo: any;
  friendVideo: any;
  stream: any;
  callEnded: any;
  yourID: any;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const [stream, setStream] = useState<any>();
  const [yourID, setYourID] = useState<any>();
  const [callDetails, setCallDetails] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>();
  const [callEnded, setCallEnded] = useState<any>();

  // refs
  const yourVideo = useRef<any>();
  const friendVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    // get the permission to use camera and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        yourVideo.current.srcObject = currentStream;
      });

    socket.on("yourID", (socketID) => {
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

    socket.on("callUser", (data: any) => {
      setCallDetails({
        from: data.from,
        signal: data.signal,
        isReceivedCall: true,
      });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });
    peer.on("signal", (data: ICallDetails) => {
      socket.emit("acceptCall", { signal: data.signal, to: callDetails?.from });
    });

    peer.on("stream", (currentStream) => {
      friendVideo.current.srcObject = currentStream;
    });
    peer.signal(callDetails?.signal);
    connectionRef.current = peer;
  };

  const startCall = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data: any) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (currentStream) => {
      friendVideo.current.srcObject = currentStream;
    });

    socket.on("callAccpted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
