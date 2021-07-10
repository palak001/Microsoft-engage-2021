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
  content,
  descProps,
  emailActionProps,
  headerProps,
  headingProps,
  LayoutProps,
  mainStack,
  meetingListProps,
  meetingNameActionProps,
  modalActionProps,
  modalProps,
  modalStackChildProps,
  modalStackProps,
  newMeetingProps,
  nextActionProps,
  sandbox,
  videoCallActionProps,
} from "./Styles";
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
import "./MediaQueryStyles.css";
import { fetchMeetingHistory } from "../services/firebase/FetchMeetingHistory";
import { fetchMeetingHistoryAction } from "../redux-store/Firebase/MeetingHistoryReducer";

const TeamsHeading = "Microsoft Teams Meetings";
const TeamsDesc = "Try video calling or chat, your call!";
const ModalHeading = "Meeting Details";
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
  const [
    isAddMeetingModalOpen,
    { setTrue: showAddMeetingModal, setFalse: hideAddMeetingModal },
  ] = useBoolean(false);
  const examplePersona: IPersonaSharedProps = {
    imageUrl: auth.currentUser?.photoURL!,
    text: auth.currentUser?.displayName!,
    secondaryText: auth.currentUser?.email!,
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

  const handleNext = async (flag: any) => {
    await checkEmailValidity().then(async () => {
      if (
        emailError === "" &&
        email !== "" &&
        meetingNameError === "" &&
        meetingName !== ""
      ) {
        const meetingID = uuidv4();
        await db
          .collection("users")
          .doc(email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // return doc.data()?.uid;
              // adding two participants involved in conversation having this meeting ID
              db.collection("meetings").doc(meetingID).set({
                user1: auth.currentUser?.email,
                user2: email,
                meetingName: meetingName,
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
                    uid2: doc.data()?.uid,
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
                    uid1: doc.data()?.uid,
                    uid2: auth.currentUser?.uid,
                  }),
                });

              // Dispatch the event of adding meeting history
              fetchMeetingHistory().then((result: Array<MeetingHistory>) => {
                dispatch(fetchMeetingHistoryAction(result));
              });

              if (flag) {
                context.getUserMediaFunction();
                context.setStartingCallToTrue();
                // important *****************************************************
                history.push(
                  `/meeting?uid1=${auth.currentUser?.uid}&uid2=${
                    doc.data()?.uid
                  }&meetingID=${meetingID}`
                );
              } else {
                hideAddMeetingModal();
              }
            }
          });
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
          onClick={async () => {
            console.log(item);
            await fetchEnteredUserDetails(item.user2Email).then(
              (result: FirebaseUser) => {
                dispatch(fetchEnteredUserDetailsAction(result));
              }
            );
            history.push(
              `/chat?uid1=${item.uid1}&uid2=${item.uid2}&meetingID=${item.meetingID}`
            );
          }}
          style={{ cursor: "pointer" }}
        >
          <div className={classNames.itemName}>{item.meetingName}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Stack {...mainStack}>
        <Stack {...headerProps} horizontal>
          <Stack style={{ width: "74%" }}>
            <Persona
              {...examplePersona}
              size={PersonaSize.size72}
              presence={PersonaPresence.offline}
              // styles={personaStyles}
            />
          </Stack>
          <Stack horizontalAlign="end" style={{ width: "26%" }}>
            <PrimaryButton
              text="Sign out"
              allowDisabledFocus
              onClick={handleSignOut}
              style={{ width: "98px" }}
            />
          </Stack>
        </Stack>
        <Stack {...LayoutProps} className="layout-class">
          <Stack {...sandbox} className="newMeeting-class">
            <Stack {...content}>
              <Stack>
                <Text {...headingProps}>{TeamsHeading} </Text>
              </Stack>
              <Stack style={{ overflow: "hidden" }}>
                <Text {...descProps}>{TeamsDesc}</Text>
              </Stack>
              <Stack {...actionProps}>
                <PrimaryButton {...videoCallActionProps} onClick={showModal} />
              </Stack>
            </Stack>
          </Stack>
          {/* <Stack {...vertical} className="verticalLine-class"></Stack> */}
          <Stack {...sandbox} className="meetingHistory">
            <Stack {...content}>
              <Stack>
                <Text {...headingProps}>Meetings History</Text>
              </Stack>
              <Stack
                {...descProps}
                verticalAlign="center"
                onClick={showAddMeetingModal}
              >
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
      </Stack>

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
                maxLength={20}
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
                  handleNext(1);
                }}
              />
              <DefaultButton {...cancelActionProps} onClick={hideModal} />
            </Stack>
          </Stack>
        </Stack>
      </Modal>

      {/* Add new meeting Modal */}
      <Modal
        titleAriaId={titleId}
        isOpen={isAddMeetingModalOpen}
        onDismiss={hideAddMeetingModal}
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
                maxLength={20}
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
                  handleNext(0);
                }}
              />
              <DefaultButton
                {...cancelActionProps}
                onClick={hideAddMeetingModal}
              />
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};
