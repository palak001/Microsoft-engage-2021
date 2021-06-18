// import Peer from "simple-peer";

// export const callPeer = (id: string, stream: MediaStream, socket: any) => {
//   const peer = new Peer({
//     initiator: true,
//     trickle: false,
//     stream: stream,
//   });

//   peer.on("signal", (data) => {
//     socket.current.emit("callUser", {
//       userToCall: id,
//       signalData: data,
//       from: yourID,
//     });
//   });

//   peer.on("stream", (stream: MediaStream) => {
//     if (partnerVideo.current) {
//       partnerVideo.current.srcObject = stream;
//     }
//   });

//   socket.current.on("callAccepted", (signal: any) => {
//     setCallAccepted(true);
//     peer.signal(signal);
//   });
// };
export {};
