import {
  PrimaryButton,
  Stack,
  TextField,
  Modal,
  DefaultButton,
  initializeIcons,
  MessageBar,
  MessageBarType,
  ActionButton,
  FocusZone,
  List,
  FocusZoneDirection,
} from "@fluentui/react";
import React, { useContext, useState } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import {
  actionProps,
  cancelActionProps,
  classNames,
  container,
  descProps,
  emailActionProps,
  headerProps,
  headingProps,
  LayoutProps,
  meetingListProps,
  meetingNameActionProps,
  modalActionProps,
  modalProps,
  modalStackChildProps,
  modalStackProps,
  newMeetingProps,
  nextActionProps,
  personaStyles,
  sandbox,
  vertical,
  videoCallActionProps,
} from "./Styles";
import teamsSVG from "../assets/teams.svg";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { Text } from "@fluentui/react/lib/Text";
import { auth, db } from "../config/firebase";
import { SocketContext } from "../SockectContext";
import { useHistory } from "react-router";
import FirebaseUser from "../interfaces/user.interface";
import { fetchEnteredUserDetailsAction } from "../redux-store/Firebase/EnteredUserDetailsReducer";
import { fetchEnteredUserDetails } from "../services/firebase/FetchEnteredUserDetails";
import { useDispatch } from "react-redux";
import firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import MeetingHistory from "../interfaces/meetingHistory.interface";
import { RootState } from "../redux-store";
import { CallNotification } from "./CallNotification/CallNotification";

const TeamsHeading = "Microsoft Teams Meetings, Here, there, anywhere!";
const TeamsDesc = "Try video calling or group calling, your call!";
const ModalHeading = "Email address of the person to connect";
const errorMessage1 = "You cannot video call yourself";
const errorMessage2 = "User doesn't exist in our database";
const errorMessage3 = "Email can't be empty";
const errorMessage4 = "Meeting Name can't be empty";

export const HomeComponent: React.FunctionComponent = () => {
  initializeIcons();
  const context = useContext(SocketContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const meetingHistory: Array<MeetingHistory> = useSelector(
    (state: RootState) => state.meetingHistoryReducer.meetingHistory
  );
  // const enteredUserDetails: FirebaseUser = useSelector(
  //   (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  // );

  // Local States
  const [email, setEmail] = useState<string>("");
  const [meetingName, setMeetingName] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [meetingNameError, setMeetingNameError] = useState<string>("");

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const examplePersona: IPersonaSharedProps = {
    imageUrl: auth.currentUser?.photoURL!,
    imageInitials: "AL",
    text: auth.currentUser?.displayName!,
    secondaryText: auth.currentUser?.email!,
    tertiaryText: "In a meeting",
  };
  const titleId = useId("title");

  const handleSignOut = () => {
    auth.signOut().then(() => {
      context.socket.current.emit("signOut");
      history.push("/signup");
    });
  };

  const handleEmailInput = (e: any) => {
    setEmail(e.target.value);
  };

  const handleMeetingNameInput = (e: any) => {
    setMeetingName(e.target.value);
  };

  const checkEmailValidity = async (): Promise<any> => {
    // Checking for possible errors
    if (email === "") {
      setEmailError(errorMessage3);
    }
    if (meetingName === "") {
      setMeetingNameError(errorMessage4);
    } else {
      await fetchEnteredUserDetails(email).then((result: FirebaseUser) => {
        if (result.email === "same") setEmailError(errorMessage1);
        else if (result.email === "") setEmailError(errorMessage2);
        else {
          dispatch(fetchEnteredUserDetailsAction(result));
        }
      });
    }
  };

  const handleNext = async () => {
    await checkEmailValidity().then(async () => {
      if (
        emailError === "" &&
        email !== "" &&
        meetingNameError === "" &&
        meetingName !== ""
      ) {
        const meetingID = uuidv4();
        const uidOfEmail = await db
          .collection("users")
          .doc(email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              return doc.data()?.uid;
            }
          });

        // adding two participants involved in conversation having this meeting ID
        db.collection("meetings").doc(meetingID).set({
          user1: auth.currentUser?.email,
          user2: email,
        });

        // user 1
        db.collection("users")
          .doc(auth.currentUser?.email + "")
          .update({
            meetingHistory: firebase.firestore.FieldValue.arrayUnion({
              meetingName: meetingName,
              meetingID: meetingID,
              user1Email: auth.currentUser?.email,
              user2Email: email,
              uid1: auth.currentUser?.uid,
              uid2: uidOfEmail,
            }),
          });
        // user 2
        db.collection("users")
          .doc(email + "")
          .update({
            meetingHistory: firebase.firestore.FieldValue.arrayUnion({
              meetingName: meetingName,
              meetingID: meetingID,
              user1Email: email,
              user2Email: auth.currentUser?.email,
              uid1: uidOfEmail,
              uid2: auth.currentUser?.uid,
            }),
          });

        context.getUserMediaFunction();
        history.push(
          `/meeting?uid1=${auth.currentUser?.uid}&uid2=${uidOfEmail}&meetingID=${meetingID}`
        );
      }
    });
  };

  const onRenderCell = (
    item: any | undefined,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={item.meetingID}
        className={classNames.itemCell}
        data-is-focusable={true}
      >
        <div
          className={classNames.itemContent}
          onClick={() => {
            console.log(item);
            history.push(
              `/chat?uid1=${item.uid1}&uid2=${item.uid2}&meetingID=${item.meetingID}`
            );
          }}
        >
          <div className={classNames.itemName}>{item.meetingName}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Stack>
        <Stack {...headerProps}>
          <Persona
            {...examplePersona}
            size={PersonaSize.size72}
            presence={PersonaPresence.offline}
            styles={personaStyles}
          />

          <PrimaryButton
            text="Sign out"
            allowDisabledFocus
            onClick={handleSignOut}
          />
        </Stack>
        <Stack {...LayoutProps}>
          <Stack {...sandbox}>
            <Stack>
              <Text {...headingProps}>{TeamsHeading} </Text>
            </Stack>
            <Stack>
              <Text {...descProps}>{TeamsDesc}</Text>
            </Stack>
            <Stack {...actionProps}>
              <PrimaryButton {...videoCallActionProps} onClick={showModal} />
            </Stack>
          </Stack>
          <Stack {...vertical}></Stack>
          <Stack {...sandbox}>
            <Stack>
              <Text {...headingProps}>Meetings History</Text>
            </Stack>
            <Stack {...descProps} verticalAlign="center">
              <ActionButton {...newMeetingProps}>
                <Text>Add new meeting</Text>
              </ActionButton>
            </Stack>
            <Stack {...meetingListProps}>
              <FocusZone direction={FocusZoneDirection.vertical}>
                <div className={classNames.container} data-is-scrollable>
                  <List items={meetingHistory} onRenderCell={onRenderCell} />
                </div>
              </FocusZone>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* <Stack {...LayoutProps}>
          <Stack {...sandbox}>
            <Stack>
              <Text {...headingProps}>{TeamsHeading} </Text>
            </Stack>
            <Stack>
              <Text {...descProps}>{TeamsDesc}</Text>
            </Stack>
            <Stack {...actionProps}>
              <PrimaryButton {...videoCallActionProps} onClick={showModal} />
              <TextField {...groupCallActionProps} />
            </Stack>
          </Stack>
          
          <Stack>
            <Image
              alt="Welcome to the Microsoft Teams"
              className={imgStyle}
              styles={imageStyleProps}
              {...imageProps}
            />
          </Stack>
        </Stack>
      </Stack> */}

      {context.gettingCall && !context.callAccepted && context.callDetails ? (
        <Stack style={{ height: "10%", width: "10%" }}>
          <CallNotification />
        </Stack>
      ) : (
        <></>
      )}

      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isModeless={true}
      >
        <Stack {...container}>
          <Stack id={titleId}>
            <Text {...modalProps}>{ModalHeading}</Text>
          </Stack>

          <Stack {...modalStackProps}>
            <Stack {...modalStackChildProps}>
              <TextField
                {...meetingNameActionProps}
                value={meetingName}
                onChange={handleMeetingNameInput}
              />
              {meetingNameError !== "" ? (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  onDismiss={() => {
                    setMeetingNameError("");
                    setMeetingName("");
                  }}
                  dismissButtonAriaLabel="Close"
                >
                  {meetingNameError}
                </MessageBar>
              ) : (
                <> </>
              )}
            </Stack>
            <Stack {...modalStackChildProps}>
              <TextField
                {...emailActionProps}
                value={email}
                onChange={handleEmailInput}
              />
              {emailError !== "" ? (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  onDismiss={() => {
                    setEmailError("");
                    setEmail("");
                  }}
                  dismissButtonAriaLabel="Close"
                >
                  {emailError}
                </MessageBar>
              ) : (
                <> </>
              )}
            </Stack>

            <Stack {...modalActionProps}>
              <PrimaryButton
                {...nextActionProps}
                onClick={() => {
                  console.log(email);
                  handleNext();
                }}
              />
              <DefaultButton {...cancelActionProps} onClick={hideModal} />
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};
