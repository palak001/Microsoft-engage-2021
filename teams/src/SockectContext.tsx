import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import FirebaseUser from "./interfaces/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "./redux-store";

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
  setCallerStreamFunction: () => void;
  setCalleeStreamFunction: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const selectedUser: FirebaseUser = useSelector(
    (state: RootState) => state.selectedUserReducer.selectedUserDetails
  );

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
      console.log("Got your socket id");
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
  });

  const answerCall = () => {
    console.log("You have answered a call");
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
    console.log("you have started a call");
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

  const setCalleeStreamFunction = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        yourVideo.current.srcObject = currentStream;
      })
      .then(() => {
        answerCall();
      });
  };

  const setCallerStreamFunction = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        yourVideo.current.srcObject = currentStream;
      })
      .then(() => {
        db.collection("users")
          .doc(selectedUser.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              if (doc.data()?.socketID) startCall(doc.data()?.socketID);
              else console.log("Person if offline");
            }
          });
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
        setCallerStreamFunction,
        setCalleeStreamFunction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
