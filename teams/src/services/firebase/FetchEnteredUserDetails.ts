import { auth, db } from "../../config/firebase";
import FirebaseUser from "../../interfaces/user.interface";

export const fetchEnteredUserDetails = async (email: string): Promise<any> => {
  let dummyUser1: FirebaseUser = {
    displayName: "",
    photoURL: "",
    uid: "",
    email: "",
    socketID: "",
  };

  const dummyUser2: FirebaseUser = {
    displayName: "same",
    photoURL: "same",
    uid: "same",
    email: "same",
    socketID: "",
  };

  if (email === auth.currentUser?.email) return dummyUser2;

  await db
    .collection("users")
    .doc(email + "")
    .get()
    .then((doc) => {
      if (doc.exists) {
        dummyUser1.displayName = doc.data()?.displayName;
        dummyUser1.email = doc.data()?.email;
        dummyUser1.photoURL = doc.data()?.photoURL;
        dummyUser1.uid = doc.data()?.uid;
        dummyUser1.socketID = doc.data()?.socketID;
      }
    });
  return dummyUser1;
};
