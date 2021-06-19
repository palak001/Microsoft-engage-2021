// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import { auth, db } from "../../config/firebase";

// export interface IVideocallProps {}

// export const Videocall: React.FunctionComponent<IVideocallProps> = (props) => {
//   // Local States
//   const [yourID, setYourID] = useState<string>("");
//   const [users, setUsers] = useState<object>({});
//   const [stream, setStream] = useState<MediaStream>();
//   const [receivingCall, setReceivingCall] = useState<boolean>(false);
//   const [caller, setCaller] = useState<string>("");
//   const [callerSignal, setCallerSignal] = useState<any>();
//   const [callAccepted, setCallAccepted] = useState<boolean>(false);

//   const userVideo = useRef<any>();
//   const partnerVideo = useRef<any>();
//   const socket = useRef<any>();

//   useEffect(() => {
//     socket.current = io("http://localhost:8000/");
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         if (userVideo.current) {
//           userVideo.current.srcObject = stream;
//         }
//       });

//     socket.current.on("yourID", (id: string) => {
//       // console.log("This is your id: " + id);
//       // update the socket id of currently logged in user on connect/reconnect in firebase
//       if (auth.currentUser) {
//         db.collection("users")
//           .doc(auth.currentUser?.email + "")
//           .set(
//             {
//               socketID: id,
//             },
//             { merge: true }
//           );
//       }

//       setYourID(id);
//     });

//     socket.current.on("allUsers", (users: object) => {
//       setUsers(users);
//     });

//     socket.current.on("hey", (data: any) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   function callPeer(id: string) {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       socket.current.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: yourID,
//       });
//     });

//     peer.on("stream", (stream: MediaStream) => {
//       if (partnerVideo.current) {
//         partnerVideo.current.srcObject = stream;
//       }
//     });

//     socket.current.on("callAccepted", (signal: any) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });
//   }

//   function acceptCall() {
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.current.emit("acceptCall", { signal: data, to: caller });
//     });

//     peer.on("stream", (stream: MediaStream) => {
//       if (partnerVideo.current) partnerVideo.current.srcObject = stream;
//     });

//     peer.signal(callerSignal);
//   }

//   let UserVideo;
//   if (stream) {
//     UserVideo = (
//       <video
//         style={{ border: "red" }}
//         playsInline
//         muted
//         ref={userVideo}
//         autoPlay
//       />
//     );
//   }

//   let PartnerVideo;
//   if (callAccepted) {
//     PartnerVideo = (
//       <video
//         style={{ border: "red" }}
//         playsInline
//         ref={partnerVideo}
//         autoPlay
//       />
//     );
//   }

//   let incomingCall;
//   if (receivingCall) {
//     incomingCall = (
//       <div>
//         <h1>{caller} is calling you</h1>
//         <button
//           onClick={() => {
//             acceptCall();
//           }}
//         >
//           Accept
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div>
//         {UserVideo}
//         {PartnerVideo}
//       </div>

//       <div>
//         {Object.keys(users).map((key) => {
//           // console.log("yourId: " + yourID);
//           // console.log("key: " + key);
//           if (key === yourID) {
//             return null;
//           }
//           return (
//             <button key={key} onClick={() => callPeer(key)}>
//               Call {key}
//             </button>
//           );
//         })}
//       </div>

//       <div>{incomingCall}</div>
//     </div>
//   );
// };

// export default Videocall;

export {};
