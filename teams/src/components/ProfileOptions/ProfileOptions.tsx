import React, { useContext } from "react";
import { Icon, Stack } from "@fluentui/react";
import { auth } from "../../config/firebase";
import { SocketContext } from "../../SockectContext";
import { useHistory } from "react-router";
import { IconProps } from "../MainBody/MainBody.styles";

export const ProfileOptions: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  const history = useHistory();

  const handleSignOut = () => {
    auth.signOut().then(() => {
      context.socket.current.emit("signOut");
      history.push("/signup");
    });
  };

  return (
    <Stack>
      <Icon
        onClick={handleSignOut}
        iconName={"SignOut"}
        style={{ fontSize: "18px" }}
        {...IconProps}
      />
    </Stack>
  );
};
