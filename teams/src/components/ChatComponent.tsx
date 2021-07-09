import {
  Stack,
  CommandButton,
  TextField,
  IconButton,
  initializeIcons,
  Icon,
  Text,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import {
  headerProps,
  // personaStyles,
  chatHeadingProps,
  videoCallProps,
  textActionProps,
  textStackProps,
  sendTextProps,
  chatLayoutProps,
  chatScreenProps,
  neutralLight,
  duskLight,
} from "./Styles";
import { CallVideoIcon } from "@fluentui/react-icons-northstar";
import { auth, db } from "../config/firebase";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import firebase from "firebase";
import { useContext } from "react";
import { SocketContext } from "../SockectContext";
import { enteredUserDetailsReducer } from "../redux-store/Firebase/EnteredUserDetailsReducer";
import FirebaseUser from "../interfaces/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store";

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

const getWindowDimensions = () => {
  console.log("now whatQ");
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const ChatComponent: React.FunctionComponent = () => {
  initializeIcons();
  const history = useHistory();
  const [message, setMessage] = useState<string>("");
  const { search }: any = useLocation();
  const queryParameter = qs.parse(search, { ignoreQueryPrefix: true });
  const context = useContext(SocketContext);
  const [receiverEmailID, setReceiverEmailID] = useState<string>("");
  const [meetingName, setMeetingName] = useState<string>("");

  const [teamsChat, setTeamsChat] = useState<Chats>({ message: [] });
  const [initChat, setInitChat] = useState<Chats>({ message: [] });
  const [receiverPhotoURL, setReceiverPhotoURL] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");

  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  );

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const participantsEmail = {
      user1: "",
      user2: "",
    };
    let meetingName = "";
    db.collection("meetings")
      .doc(`${queryParameter.meetingID}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          participantsEmail.user1 = doc.data()?.user1;
          participantsEmail.user2 = doc.data()?.user2;
          meetingName = doc.data()?.meetingName;

          const receiverEmail =
            auth.currentUser?.email === participantsEmail.user1
              ? participantsEmail.user2
              : participantsEmail.user1;

          setReceiverEmailID(receiverEmail);
          setMeetingName(meetingName);
        }
      });
  }, [queryParameter.meetingID]);

  useEffect(() => {
    if (receiverEmailID) {
      db.collection("users")
        .doc(receiverEmailID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setReceiverPhotoURL(doc.data()?.photoURL);
            setReceiverName(doc.data()?.displayName);
          }
        });
    }
  }, [receiverEmailID]);

  useEffect(() => {
    context.socket.current.emit("sendOldChats", {
      meetingID: queryParameter.meetingID,
      user: context.yourID,
      userEmail: auth.currentUser?.email,
    });
    context.socket.current.on("oldChats", (chatHistory: any) => {
      setInitChat({
        message: [...chatHistory],
      });
    });
  }, [queryParameter.meetingID, context.socket, context.yourID]);

  useEffect(() => {
    setTeamsChat(initChat);
  }, [initChat]);

  useEffect(() => {
    context.socket.current.on("newChat", (data: any) => {
      setTeamsChat({
        message: [
          ...teamsChat.message,
          { content: data.message, time: "1", sender: SenderType.frnd },
        ],
      });
    });
  }, [context.socket, teamsChat.message]);

  const friendPersona: IPersonaSharedProps = {
    imageUrl: receiverPhotoURL,
    text: receiverName,
    secondaryText: receiverEmailID,
    // tertiaryText: "In a meeting",
  };

  const handleSendMsg = async () => {
    if (message === "") {
      console.log("not allowed");
    }
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

    // Emit socket event
    context.sendChatMessage({
      message: message,
      receiverEmail: receiverEmailID,
    });

    setMessage("");
  };

  const handleMessageInput = (e: any) => {
    setMessage(e.target.value);
  };

  const handleVideoCall = () => {
    context.getUserMediaFunction();
    context.setStartingCallToTrue();
    console.log(enteredUserDetails);
    history.push(
      `/meeting?uid1=${auth.currentUser?.uid}&uid2=${queryParameter.uid2}&meetingID=${queryParameter.meetingID}`
    );
  };

  return (
    <Stack {...chatLayoutProps}>
      <Stack {...headerProps} horizontal>
        <Stack
          horizontal
          horizontalAlign="space-between"
          style={{ width: "100%" }}
        >
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: "20px" }}
          >
            <Icon
              iconName="Back"
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/")}
            />
            <Stack>
              <Text {...chatHeadingProps} className="meetingName">
                {meetingName}
              </Text>
            </Stack>
          </Stack>

          <CommandButton>
            <Stack {...videoCallProps} onClick={handleVideoCall}>
              <CallVideoIcon size="medium" style={{}} />
            </Stack>
          </CommandButton>
        </Stack>
      </Stack>

      <Stack style={{ height: "87%" }} verticalAlign="end">
        <Stack
          horizontal
          horizontalAlign="space-between"
          tokens={{ padding: "20px 50px 20px 50px" }}
          style={{
            height: "8%",
            width: "100%",
          }}
        >
          <Stack horizontal>
            <Text style={{ color: "#646464", paddingRight: "9px" }}>
              {receiverName}
            </Text>
            <Persona imageUrl={receiverPhotoURL} size={PersonaSize.size24} />
          </Stack>
          <Stack horizontal>
            <Persona
              imageUrl={auth.currentUser?.photoURL!}
              size={PersonaSize.size24}
            />
            <Text style={{ color: "#646464" }}>You</Text>
          </Stack>
        </Stack>
        <Stack
          style={{
            height: "84%",
            overflowY: "scroll",
            scrollbarWidth: "none",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
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
                <Stack
                  horizontal
                  horizontalAlign="start"
                  verticalAlign="center"
                >
                  <Persona
                    imageUrl={receiverPhotoURL}
                    size={PersonaSize.size24}
                    // styles={personaStyles}
                  />
                  <Stack {...neutralLight}>{chat.content}</Stack>
                </Stack>
              )
            )}
          </Stack>
        </Stack>

        <Stack style={{ height: "8%" }} {...textStackProps}>
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
