import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { auth, db } from "./config/firebase";
import { useHistory } from "react-router";

interface ICallDetails {
  from: string;
  signal: any;
  isReceivedCall: boolean;
}

interface IContext {
  socket: any;
  callDetails: ICallDetails;
  callAccepted: any;
  callStarted: any;
  yourVideo: any;
  friendVideo: any;
  stream: any;
  callEnded: any;
  yourID: string;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
}

export const SocketContext = React.createContext({} as IContext);

const ContextProvider: React.FunctionComponent = ({ children }) => {
  const history = useHistory();

  // Local States

  const [stream, setStream] = useState<any>();
  const [yourID, setYourID] = useState<string>("");
  const [callDetails, setCallDetails] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [callStarted, setCallStarted] = useState<any>(false);
  const [callEnded, setCallEnded] = useState<any>(false);
  // refs
  const yourVideo = useRef<any>();
  const friendVideo = useRef<any>();
  const connectionRef = useRef<any>();
  const socket = useRef<any>();

  // useEffects
  useEffect(() => {
    // socket.current = io("https://microsoft-engage-2021-server.herokuapp.com", {
    //   autoConnect: false,
    // });
    socket.current = io("http://localhost:8000", {
      autoConnect: false,
    });

    socket.current.on("connect", () => {
      console.log("sending authentication data");
      socket.current.emit("authentication", {
        username: auth.currentUser?.email,
        token: auth.currentUser?.uid,
      });
      // socket.current.on("unauthorized", (reason: any) => {
      //   console.log("Unauthorized:", reason);
      //   console.log("disconnecting");
      //   history.push("/activesession");
      // });
      // socket.current.on("authenticated", function () {
      //   console.log("authenticated");
      // });

      socket.current.on("unauthorized", (reason: any) => {
        console.log("Unauthorized:", reason);
        console.log("disconnecting");
        history.push("/activesession");
      });
      socket.current.on("authenticated", function () {
        console.log("authenticated");
      });

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
      socket.current.on("callingYou", (data: ICallDetails) => {
        console.log("you are getting a call");
        // setReceiving
        setCallDetails({
          from: data.from,
          signal: data.signal,
          isReceivedCall: data.isReceivedCall,
        });
        console.log(data.from);
      });
    });
  }, [history]);

  useEffect(() => {
    if (callAccepted && callStarted) {
      if (yourVideo.current && !yourVideo.current.srcObject) {
        console.log("here we are again");
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            if (yourVideo.current) yourVideo.current.srcObject = currentStream;
          });
      }
    }
  }, [callStarted, callAccepted]);

  // Helper Functions

  const startCall = (socketId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setCallStarted(true);
        if (yourVideo.current) yourVideo.current.srcObject = currentStream;

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
          stream: currentStream,
        });

        connectionRef.current = peer;

        // fires when the peer want to send signalling data to other peers
        peer.on("signal", (signalData: any) => {
          socket.current.emit("callUser", {
            userToCall: socketId,
            signalData: signalData,
            from: yourID,
          });
        });

        peer.on("stream", (currentStream) => {
          if (friendVideo.current)
            friendVideo.current.srcObject = currentStream;
        });

        peer.on("error", (err) => {
          console.log("call start error");
          console.log(err);
        });

        socket.current.on("callAccepted", (signal: any) => {
          setCallAccepted(true);
          peer.signal(JSON.stringify(signal));
        });
      });
  };

  const answerCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setCallAccepted(true);
        if (yourVideo.current) yourVideo.current.srcObject = currentStream;

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: currentStream,
        });

        connectionRef.current = peer;

        peer.on("signal", (signalData) => {
          socket.current.emit("acceptCall", {
            signal: signalData,
            to: callDetails.from,
          });
        });

        peer.on("stream", (currentStream) => {
          friendVideo.current.srcObject = currentStream;
        });

        peer.on("error", (err) => {
          console.log("anserCall error");
          console.log(err);
        });

        peer.signal(JSON.stringify(callDetails.signal));
      });
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        callDetails,
        callAccepted,
        callStarted,
        yourVideo,
        friendVideo,
        stream,
        callEnded,
        yourID,
        answerCall,
        startCall,
        leaveCall,
        // setCallerStreamFunction,
        // setCalleeStreamFunction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
