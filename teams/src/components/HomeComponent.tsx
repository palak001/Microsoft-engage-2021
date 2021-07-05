import {
  PrimaryButton,
  Stack,
  TextField,
  Image,
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
  groupCallActionProps,
  headerProps,
  headingProps,
  imageStyleProps,
  imgStyle,
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

const TeamsHeading = "Microsoft Teams Meetings, Here, there, anywhere!";
const TeamsDesc = "Try video calling or group calling, your call!";
const ModalHeading = "Email address of the person to connect";
const errorMessage1 = "You cannot video call yourself";
const errorMessage2 = "User doesn't exist in our database";
const errorMessage3 = "Email can't be empty";
const errorMessage4 = "Meeting Name can't be empty";
const erroMessage5 = "Meeting Name already exists";

export const HomeComponent: React.FunctionComponent = () => {
  initializeIcons();
  const context = useContext(SocketContext);
  const history = useHistory();
  const dispatch = useDispatch();

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
  const imageProps = { src: teamsSVG.toString() };
  const titleId = useId("title");

  // Meeting history
  const meetingHistory: any = [
    { name: "Meeting with Person A" },
    { name: "Meeting with Person B" },
    { name: "Meeting with Person C" },
    { name: "Meeting with Person D" },
  ];

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

  const handleNext = async () => {
    if (email === "") {
      setEmailError(errorMessage3);
    }
    if (meetingName === "") {
      setMeetingNameError(errorMessage4);
    } else {
      await fetchEnteredUserDetails(email).then((result: FirebaseUser) => {
        if (result.email === "same") setEmailError(errorMessage1);
        else if (result.email === "") setEmailError(errorMessage2);
        else setEmailError("");
        dispatch(fetchEnteredUserDetailsAction(result));
      });

      // check validity of the meeting name
    }

    if (
      emailError === "" &&
      email !== "" &&
      meetingNameError === "" &&
      meetingName !== ""
    ) {
      // Direct them to the chat window instead of getusermedia function

      const socketIDofA = await db
        .collection("users")
        .doc(auth.currentUser?.email + "")
        .get()
        .then((doc) => {
          if (doc.exists) {
            return doc.data()?.socketID;
          }
        });

      const socketIDofB = await db
        .collection("users")
        .doc(email + "")
        .get()
        .then((doc) => {
          if (doc.exists) {
            return doc.data()?.socketID;
          }
        });
      context.getUserMediaFunction();
      history.push(
        `/meeting?socketIDofA=${socketIDofA}&socketIDofB=${socketIDofB}`
      );
    }
  };

  const onRenderCell = (
    item: any | undefined,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        <div className={classNames.itemContent}>
          <div className={classNames.itemName}>{item.name}</div>
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
            <Stack {...descProps}>
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
