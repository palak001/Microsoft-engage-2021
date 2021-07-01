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
  callEnded: any;
  yourID: string;
  callRejected: any;
  muteAudio: any;
  muteVideo: any;
  answerCall: () => void;
  startCall: (id: string) => void;
  leaveCall: () => void;
  rejectCall: () => void;
  toggleAudioSettings: () => void;
  toggleVideoSettings: () => void;
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
  const [callRejected, setCallRejected] = useState<any>(false);
  const [gettingCall, setGettingCall] = useState<any>(false);
  const [otherPersonID, setOtherPersonID] = useState<any>();
  const [muteAudio, setMuteAudio] = useState<boolean>(false);
  const [muteVideo, setMuteVideo] = useState<boolean>(false);
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
        console.log("disconnecting");
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
        console.log("again");
        setStream(currentStream);
        setCallStarted(true);
        setOtherPersonID(socketId);
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
            photoURL: auth.currentUser?.photoURL,
            name: auth.currentUser?.displayName,
            uid: auth.currentUser?.uid,
          });
        });

        peer.on("stream", (currentStream) => {
          console.log("peerstream:", currentStream);
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

        socket.current.on("callEnded", () => {
          if (currentStream) {
            currentStream.getTracks().forEach(function (track: any) {
              track.stop();
            });
            setStream(null);
          }
          setCallEnded(true);
          console.log("callEnded");
          setCallAccepted(false);
          setCallStarted(false);
        });

        socket.current.on("callRejected", () => {
          if (currentStream) {
            currentStream.getTracks().forEach(function (track: any) {
              track.stop();
            });
            setStream(null);
          }
          setCallEnded(true);
          console.log("callRejected");
          setCallAccepted(false);
          setCallStarted(false);
        });
      });
  };

  const answerCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setCallAccepted(true);
        setGettingCall(false);
        if (yourVideo.current) yourVideo.current.srcObject = currentStream;

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: currentStream,
        });

        connectionRef.current = peer;

        peer.on("signal", (signalData) => {
          socket.current.emit("acceptedCall", {
            signal: signalData,
            to: callDetails.from,
          });
        });

        peer.on("stream", (currentStream) => {
          if (friendVideo.current)
            friendVideo.current.srcObject = currentStream;
        });

        peer.on("error", (err) => {
          console.log(err);
        });

        peer.signal(JSON.stringify(callDetails.signal));

        socket.current.on("callEnded", () => {
          if (currentStream) {
            currentStream.getTracks().forEach(function (track: any) {
              track.stop();
            });
          }
          console.log("currentStream1: ", currentStream);
          setCallEnded(true);
          console.log("callEnded");
          setCallAccepted(false);
          setCallStarted(false);
        });

        socket.current.on("callRejected", () => {
          if (currentStream) {
            currentStream.getTracks().forEach(function (track: any) {
              track.stop();
            });
          }
          setCallEnded(true);
          console.log("callRejected");
          setCallAccepted(false);
          setCallStarted(false);
        });
      });
  };

  const leaveCall = () => {
    // To switch your webcam light!
    if (yourVideo.current && yourVideo.current.srcObject) {
      for (const track of yourVideo.current.srcObject.getTracks()) {
        track.stop();
      }
      yourVideo.current.srcObject = null;
      setStream(null);
    }

    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    console.log("streams: ", stream);
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callEnded", { to: otherPersonID });
  };

  const rejectCall = () => {
    // To switch your webcam light!
    if (yourVideo.current && yourVideo.current.srcObject) {
      for (const track of yourVideo.current.srcObject.getTracks()) {
        track.stop();
      }
      yourVideo.current.srcObject = null;
      setStream(null);
    }

    setCallRejected(true);
    if (connectionRef.current) connectionRef.current.destroy();
    setCallAccepted(false);
    setCallStarted(false);
    setGettingCall(false);
    socket.current.emit("callRejected", { to: otherPersonID });
  };

  const toggleAudioSettings = () => {
    if (stream) {
      setMuteAudio(!muteAudio);
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    }
  };

  const toggleVideoSettings = () => {
    if (stream) {
      setMuteVideo(!muteVideo);
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
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
        callEnded,
        yourID,
        callRejected,
        muteAudio,
        muteVideo,
        answerCall,
        startCall,
        leaveCall,
        rejectCall,
        toggleAudioSettings,
        toggleVideoSettings,
        // setCallerStreamFunction,
        // setCalleeStreamFunction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
