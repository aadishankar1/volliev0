import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./../lib/firebase";
export const uploadMedia = (
  media: any,
  setUrl: (url:string) => void,
  setProgress: any=null
) => {
  const storageRef = ref(storage, `uploads/${new Date().getTime()}`);
  const uploadTask = uploadBytesResumable(storageRef, media);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(progress,"progresss")
      setProgress && setProgress(progress);
    },
    (error) => {
      console.error("Upload error:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setUrl(downloadURL);
      });
    }
  );
};
