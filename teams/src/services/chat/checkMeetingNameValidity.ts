import { db } from "../../config/firebase"

export const checkMeetingNameValidity =  (meetingName: string): boolean => {
    let flag = 0;
    db.collection("meetings").doc(meetingName).get().then((doc: any) => {
        if (doc.exists) {
            flag = 1;
        }
        else {
            
        }
    })

    if (flag === 1)
        return false;
    else
        return true;
}