import {
  Stack,
  CommandButton,
  TextField,
  IconButton,
  initializeIcons,
  Icon,
  Text,
  Spinner,
  SpinnerSize,
  IStackProps,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { Persona, PersonaSize } from "@fluentui/react/lib/Persona";
import {
  headerProps,
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
import FirebaseUser from "../interfaces/user.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-store";
import { Chat, SenderType } from "../interfaces/chat.interface";
import {
  setChatsHistory,
  updateChatsHistory,
} from "../redux-store/Chat/ChatReducer";

interface ChatsProps {
  options: string;
}

export const ChatComponent: React.FunctionComponent<ChatsProps> = (
  props: ChatsProps
) => {
  initializeIcons();
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");
  const { search }: any = useLocation();
  const queryParameter = qs.parse(search, { ignoreQueryPrefix: true });
  const context = useContext(SocketContext);
  const [receiverEmailID, setReceiverEmailID] = useState<string>("");
  const [meetingName, setMeetingName] = useState<string>("");
  const [receiverPhotoURL, setReceiverPhotoURL] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [disabledSendBtn, setDisabledSendBtn] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const rowProps: IStackProps = {
    verticalFill: true,
    horizontal: true,
    verticalAlign: "center",
    horizontalAlign: "center",
  };

  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  );

  const teamsChat: Chat[] = useSelector(
    (state: RootState) => state.chatReducer.message
  );

  // Fetch Chat History for particular Meeting ID
  useEffect(() => {
    const meetingToken: string = `${queryParameter.meetingID}`;
    db.collection("meetings")
      .doc(meetingToken)
      .get()
      .then((doc) => {
        let chatHistory: Chat[] = [];
        if (doc.exists) {
          if (doc.data()) {
            if (doc.data()?.meetingHistory) {
              doc.data()?.meetingHistory.forEach((element: any) => {
                const senderType =
                  auth.currentUser?.email === element.from
                    ? SenderType.self
                    : SenderType.frnd;
                chatHistory.push({
                  content: element.message,
                  time: "1",
                  sender: senderType,
                });
              });
            }
          }
        }
        setLoading(false);
        dispatch(setChatsHistory(chatHistory));
      });
  }, [dispatch, queryParameter.meetingID]);

  useEffect(() => {
    /* Sets meeting id and receivers email id from query parameters */
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
    /* Fetches receivers info */
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
    /* Add new chat to the meeting */
    context.socket.current.on("newChat", (data: any) => {
      if (data.meetingID === queryParameter.meetingID) {
        const chats = {
          content: data.message,
          time: "1",
          sender: SenderType.frnd,
        };
        dispatch(updateChatsHistory(chats));
      }
    });

    /* Remove event listener for newChat */
    return () => {
      // debugger;
      context.socket.current.removeListener("newChat");
    };
  }, [context.socket, dispatch, queryParameter.meetingID]);

  /* Handle send message */
  const handleSendMsg = async () => {
    let tempMessage = message;
    tempMessage.trim();
    if (tempMessage === "") {
      setMessage("");
      setDisabledSendBtn(true);
    } else {
      db.collection("meetings")
        .doc(`${queryParameter.meetingID}`)
        .update({
          meetingHistory: firebase.firestore.FieldValue.arrayUnion({
            message: message,
            from: auth.currentUser?.email,
            time: firebase.firestore.Timestamp.now(),
          }),
        });

      const chats = {
        content: message,
        time: "1",
        sender: SenderType.self,
      };

      dispatch(updateChatsHistory(chats));

      // Emit socket event
      context.sendChatMessage({
        message: message,
        receiverEmail: receiverEmailID,
        meetingID: queryParameter.meetingID,
      });

      setMessage("");
      setDisabledSendBtn(true);
    }
  };

  /* Handle Message input in the text field */
  const handleMessageInput = (e: any) => {
    if (e.target.value.trim() !== "") {
      setDisabledSendBtn(false);
    } else setDisabledSendBtn(true);
    setMessage(e.target.value);
  };

  /* Handle video call through the chat screen */
  const handleVideoCall = () => {
    context.getUserMediaFunction();
    context.setStartingCallToTrue();
    // console.log(enteredUserDetails);
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
            {/* Whether to show back icon on chat component or not */}
            {props.options === "none" ? (
              <></>
            ) : (
              <Icon
                iconName="Back"
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/")}
              />
            )}

            <Stack>
              <Text {...chatHeadingProps} className="meetingName">
                {meetingName}
              </Text>
            </Stack>
          </Stack>
          {/* Whether to show video icon or not */}
          {props.options === "none" ? (
            <></>
          ) : (
            <Stack>
              <CommandButton>
                <Stack {...videoCallProps} onClick={handleVideoCall}>
                  <CallVideoIcon size="medium" />
                </Stack>
              </CommandButton>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack style={{ height: "90%" }} verticalAlign="end">
        {loading ? (
          <Stack {...rowProps}>
            <Spinner size={SpinnerSize.large} />
          </Stack>
        ) : (
          <>
            <Stack
              horizontal
              horizontalAlign="space-between"
              tokens={{ padding: "10px 40px 10px 40px" }}
              style={{
                height: "6%",
                width: "100%",
              }}
            >
              <Stack horizontal>
                <Text style={{ color: "#646464", paddingRight: "9px" }}>
                  {receiverName}
                </Text>
                <Persona
                  imageUrl={receiverPhotoURL}
                  size={PersonaSize.size24}
                />
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
                height: "88%",
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
                {teamsChat?.map((chat: Chat) =>
                  chat.sender === SenderType.self ? (
                    <Stack horizontalAlign="end">
                      <Stack {...duskLight}>
                        <Text>{chat.content}</Text>
                      </Stack>
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
                        // text={receiverName}
                        // styles={personaStyles}
                      />
                      <Stack {...neutralLight}>
                        <Text>{chat.content}</Text>
                      </Stack>
                    </Stack>
                  )
                )}
              </Stack>
            </Stack>

            <Stack
              style={{ height: "6%" }}
              {...textStackProps}
              verticalAlign="center"
              horizontalAlign="center"
            >
              <Stack horizontal style={{ width: "100%" }}>
                <TextField
                  {...textActionProps}
                  onChange={handleMessageInput}
                  value={message}
                />
                <IconButton
                  {...sendTextProps}
                  disabled={disabledSendBtn}
                  onClick={handleSendMsg}
                />
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};
