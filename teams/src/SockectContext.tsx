import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import FirebaseUser from "./interfaces/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "./redux-store";

// const socket = io("http://localhost:8000/", {
//   autoConnect: false,
// });
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
  console.log("Context socket rendered");
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
    console.log("Welcome3");

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
        // });
      }
    });

    socket.on("callingYou", (data: ICallDetails) => {
      console.log("callAccepted");
      console.log(callAccepted);
      if (!callAccepted) {
        console.log("you are getting a call");
        setCallDetails({
          from: data.from,
          signal: data.signal,
          isReceivedCall: data.isReceivedCall,
        });
        console.log(data.from);
      }
    });
  }, [callAccepted]);

  // useEffect(() => {
  //   if (auth.currentUser) {
  //     console.log("your Video");
  //     console.log(yourVideo.current.srcObject);
  //     console.log(!yourVideo.current.srcObject);
  //     if (yourVideo.current && !yourVideo.current.srcObject) {
  //       console.log("video?");
  //       navigator.mediaDevices
  //         .getUserMedia({ video: true, audio: true })
  //         .then((currentStream) => {
  //           setStream(currentStream);
  //           if (yourVideo.current) yourVideo.current.srcObject = currentStream;
  //         });
  //     }
  //   }
  // });

  const answerCall = () => {
    console.log("You have answered a call");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      },
    });
    // console.log("peer oject");
    // console.log(peer);
    peer.on("signal", (signalData) => {
      console.log("you are emmiting this info");
      console.log(signalData);
      socket.emit("acceptCall", { signal: signalData, to: callDetails.from });
    });

    peer.on("stream", (currentStream) => {
      console.log("caller video");
      console.log(currentStream);
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
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      },
    });

    console.log("peer at start call");
    console.log(peer);

    // fires when the peer want to send signalling data to other peers
    peer.on("signal", (signalData: any) => {
      socket.emit("callUser", {
        userToCall: socketId,
        signalData: signalData,
        from: yourID,
      });
    });

    peer.on("stream", (currentStream) => {
      console.log("callee video");
      console.log(currentStream);
      console.log(currentStream);
      friendVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      console.log("do you still have your video?");
      console.log(signal);
      // setCallAccepted(true);
      // peer.signal(JSON.stringify(signal));
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const setCalleeStreamFunction = async () => {
    if (!callAccepted) {
      setCallAccepted(true);
      await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          setStream((state: any) => {
            console.log("current Stream");
            console.log(state);
            yourVideo.current.srcObject = state;
            answerCall();
            return state;
          });
        });
    }
  };

  const setCallerStreamFunction = async () => {
    const currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(currentStream);
    setStream((state: any) => {
      console.log("current Stream");
      console.log(state);
      yourVideo.current.srcObject = state;
      db.collection("users")
        .doc(selectedUser.email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data()?.socketID) startCall(doc.data()?.socketID);
            else console.log("Person if offline");
          }
        });
      return state;
    });

    // console.log(stream);

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     setStream(currentStream);
    //     yourVideo.current.srcObject = currentStream;
    //   })
    //   .then(() => {
    //     db.collection("users")
    //       .doc(selectedUser.email)
    //       .get()
    //       .then((doc) => {
    //         if (doc.exists) {
    //           if (doc.data()?.socketID) startCall(doc.data()?.socketID);
    //           else console.log("Person if offline");
    //         }
    //       });
    //   });
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
