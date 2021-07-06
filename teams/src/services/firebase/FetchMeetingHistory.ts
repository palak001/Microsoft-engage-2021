import { auth, db } from "../../config/firebase";
import MeetingHistory from "../../interfaces/meetingHistory.interface";

export const fetchMeetingHistory = async (): Promise<any> => {
  let meetingHistory: Array<MeetingHistory> = [];
  await db
    .collection("users")
    .doc(auth.currentUser?.email!)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let newArray = [...meetingHistory, ...doc.data()?.meetingHistory];
        meetingHistory = newArray;
      }
    });
  return meetingHistory;
};
