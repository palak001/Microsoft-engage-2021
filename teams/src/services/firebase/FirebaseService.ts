import { db } from "../../config/firebase";
import FirebaseUser from "../../interfaces/user.interface";

export const fetchUserContacts = async (): Promise<any> => {
  let userDetails: Array<FirebaseUser> = [];
  await db
    .collection("users")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc: any) => {
        const snap = doc.data();
        // console.log(snap);

        userDetails = userDetails.concat(snap);
      });
    });
  return userDetails;
};
