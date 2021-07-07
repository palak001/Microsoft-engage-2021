import { Stack, CommandButton, TextField, IconButton } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import {
  headerProps,
  personaStyles,
  chatHeadingProps,
  videoCallProps,
  textActionProps,
  textStackProps,
  sendTextProps,
  chatContainerProps,
  scrollablePaneProps,
  chatLayoutProps,
  chatScreenProps,
  neutralLight,
  duskLight,
} from "./Styles";
import { CallVideoIcon } from "@fluentui/react-icons-northstar";
import { auth, db } from "../config/firebase";
import { useLocation } from "react-router";
import qs from "qs";
import firebase from "firebase";
import { useContext } from "react";
import { SocketContext } from "../SockectContext";

enum SenderType {
  self = 0,
  frnd = 1,
}

interface Chat {
  content: string;
  time: string;
  sender: SenderType;
}

interface Chats {
  message: Chat[];
}

export const ChatComponent: React.FunctionComponent = () => {
  const [message, setMessage] = useState<string>("");
  const { search }: any = useLocation();
  const queryParameter = qs.parse(search, { ignoreQueryPrefix: true });
  const context = useContext(SocketContext);

  const [teamsChat, setTeamsChat] = useState<Chats>({ message: [] });
  const [initChat, setInitChat] = useState<Chats>({ message: [] });

  useEffect(() => {
    console.log("how many times are we executing this thing?");
    console.log("emitting");
    context.socket.current.emit("sendOldChats", {
      meetingID: queryParameter.meetingID,
      user: context.yourID,
      userEmail: auth.currentUser?.email,
    });
    context.socket.current.on("oldChats", (chatHistory: any) => {
      console.log("atlast");
      setInitChat({
        message: [...chatHistory],
      });
    });
  }, [queryParameter.meetingID, context.socket, context.yourID]);

  useEffect(() => {
    console.log("setting initial chat");
    setTeamsChat(initChat);
  }, [initChat]);

  useEffect(() => {
    console.log("u wanna tell how many times are you called?");
    context.socket.current.on("newChat", (data: any) => {
      console.log("recieved new message");
      setTeamsChat({
        message: [
          ...teamsChat.message,
          { content: data.message, time: "1", sender: SenderType.frnd },
        ],
      });
    });
  }, [context.socket, teamsChat.message]);

  const examplePersona: IPersonaSharedProps = {
    imageUrl: "https://miro.medium.com/max/948/0*9UgsryOBGjrws1_z.jpg",
    imageInitials: "AL",
    text: "Payal",
    secondaryText: "quepayal@gmail.com",
    tertiaryText: "In a meeting",
  };

  const handleSendMsg = async () => {
    if (message === "") {
      console.log("no allowed");
    }
    console.log(message);
    console.log(queryParameter);
    db.collection("meetings")
      .doc(`${queryParameter.meetingID}`)
      .update({
        meetingHistory: firebase.firestore.FieldValue.arrayUnion({
          message: message,
          from: auth.currentUser?.email,
          time: firebase.firestore.Timestamp.now(),
        }),
      });

    setTeamsChat({
      message: [
        ...teamsChat.message,
        { content: message, time: "1", sender: SenderType.self },
      ],
    });

    const participantsEmail = {
      user1: "",
      user2: "",
    };
    await db
      .collection("meetings")
      .doc(`${queryParameter.meetingID}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          participantsEmail.user1 = doc.data()?.user1;
          participantsEmail.user2 = doc.data()?.user2;
        }
      });

    const receiverEmail =
      auth.currentUser?.email === participantsEmail.user1
        ? participantsEmail.user2
        : participantsEmail.user1;

    // Emit socket event
    context.sendChatMessage({
      message: message,
      receiverEmail: receiverEmail,
    });

    setMessage("");
  };

  const handleMessageInput = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <Stack {...chatLayoutProps}>
      <Stack style={{ height: "10%" }} {...headerProps}>
        <Persona
          {...examplePersona}
          size={PersonaSize.size72}
          presence={PersonaPresence.busy}
          styles={personaStyles}
        />
        <Stack {...chatHeadingProps}>Monday Meeting with Palak</Stack>
        <CommandButton>
          <Stack {...videoCallProps}>
            <CallVideoIcon size="medium" />
          </Stack>
        </CommandButton>
      </Stack>

      <Stack style={{ height: "90%" }} verticalAlign="end">
        <Stack
          style={{
            height: "90%",
            overflowY: "scroll",
            scrollbarWidth: "none",
            width: "100%",
            // height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* <ScrollablePane {...scrollablePaneProps}> */}
          <Stack
            {...chatScreenProps}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              bottom: "-20px",
              right: "-20px",
              overflow: "scroll",
            }}
          >
            {teamsChat?.message?.map((chat: Chat) =>
              chat.sender === SenderType.self ? (
                <Stack horizontalAlign="end">
                  <Stack {...duskLight}>{chat.content}</Stack>
                </Stack>
              ) : (
                <Stack horizontalAlign="start">
                  <Stack {...neutralLight}>{chat.content}</Stack>
                </Stack>
              )
            )}
          </Stack>
          {/* </ScrollablePane> */}
        </Stack>

        <Stack
          // style={{}}
          style={{ height: "10%" }}
          {...textStackProps}
        >
          <TextField
            {...textActionProps}
            onChange={handleMessageInput}
            value={message}
          />
          <IconButton {...sendTextProps} onClick={handleSendMsg} />
        </Stack>
      </Stack>
    </Stack>
  );
};

// {
//   /* <Stack.Item grow {...chatContainerProps}>
//           <ScrollablePane {...scrollablePaneProps}>
//             <Stack {...chatScreenProps}>
//               {teamsChat?.message?.map((chat: Chat) =>
//                 chat.sender === SenderType.self ? (
//                   <Stack horizontalAlign="end">
//                     <Stack {...duskLight}>{chat.content}</Stack>
//                   </Stack>
//                 ) : (
//                   <Stack horizontalAlign="start">
//                     <Stack {...neutralLight}>{chat.content}</Stack>
//                   </Stack>
//                 )
//               )}
//             </Stack>
//           </ScrollablePane>
//           <Sticky stickyPosition={StickyPositionType.Both}>
//             <Stack {...textStackProps}>
//               <TextField
//                 {...textActionProps}
//                 onChange={handleMessageInput}
//                 value={message}
//               />
//               <IconButton {...sendTextProps} onClick={handleSendMsg} />
//             </Stack>
//           </Sticky>
//         </Stack.Item> */
// }
