import firebase from "firebase";
import { auth } from "../../config/firebase";

// This is what gives us the popup screen
export const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) =>
  new Promise<firebase.auth.UserCredential>((resolve, reject) => {
    auth.signInWithRedirect(provider);
    auth
      .getRedirectResult()
      .then((result) => resolve(result))
      .catch((error) => reject(error));

    // auth
    //   .signInWithPopup(provider)
    //   .then((result) => resolve(result))
    //   .catch((error) => reject(error));
  });
