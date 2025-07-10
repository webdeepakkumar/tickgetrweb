import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable
} from "firebase/storage";
import { db } from "@/app/(Api)/firebase/firebase";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";  
import toast from "react-hot-toast";

export const uploadImageToStorage = async (
  file,
  existingRef,
  collectionName
) => {
  const storage = getStorage();
  let downloadURL = "";

  if (existingRef) {
    try {
      const fileRef = ref(storage, existingRef);
      await deleteObject(fileRef);
      // console.log("Existing image deleted successfully.");
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        // console.log("Image does not exist in Firebase Storage.");
      } else {
        // console.error("Error deleting existing image:", error);
        throw error;
      }
    }
  }

  if (file) {
    const storageRef = ref(storage, `${collectionName}/${file.name}`);
    await uploadBytes(storageRef, file);
    downloadURL = await getDownloadURL(storageRef);
    // toast.success("New image uploaded successfully.");
  }

  return downloadURL;
};

export const addPDF = async (pdfFile, existingRef) => {
  const storage = getStorage();
  let downloadURL = "";

  if (existingRef) {
    const fileRef = ref(storage, existingRef);
    await deleteObject(fileRef);
  }

  if (pdfFile) {
    const storageRef = ref(storage, `event_pdf/${pdfFile.name}`);
    await uploadBytes(storageRef, pdfFile);
    downloadURL = await getDownloadURL(storageRef);
    // toast.success("PDF added successfully.");
  }
  return downloadURL;
};

export const adddocument = async (selectedFile,folderName,Eventid,filetype,onClose) =>{
  if(!selectedFile){
    toast.error("No file are provided")
    return;
  }
  if(!folderName){
    toast.error("No folder name are provided")
    return;
  }
  try {
    const storage = getStorage();
    const StorageRef = ref(storage, `${folderName}/${selectedFile.name}`);
    const uploadtask =  uploadBytesResumable(StorageRef, selectedFile);
    await new Promise((resolve,reject)=>{
    uploadtask.on(
      "state_changed",
      (snapshot)=>{
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`Uploading... ${progress}%`);
      },
      (error)=>{
        console.error("Upload failed",error);
        toast.error("file upload failed")
        reject(error)
      },
      resolve
    )
  });
    const downloaddocumentURL = await getDownloadURL(StorageRef);
    await addDoc(collection(db, "eventDocuments"), {
      eventId: Eventid,
      fileType:filetype,
      fileName: selectedFile.name,
      folderName: folderName,
      downloadURL:downloaddocumentURL ,
      uploadedAt: new Date(),
    });
    toast.success("File uploaded successfully!")
    onClose();
    return downloaddocumentURL
  
  } catch (error) {
    console.log(error)
    throw new Error("something wrong in upload document")
  }
}
export const seeDocuments = async (eventId) =>{
  try {
    const documentref = collection(db,"eventDocuments");
    const q = query(documentref, where("eventId", "==", eventId));
    const querysnapshot = await getDocs(q);

    if(querysnapshot.empty){
      throw new Error("no evend documents found with this eventId")
    }
    const eventsdocuments = querysnapshot.docs.map((doc) => doc.data());
    console.log("Transaction found:", eventsdocuments);
    return eventsdocuments;

  } catch (error) {
    console.log("error fetchind documents")
    
  }

}
export const deleteDocument = async (eventId,fileType) =>{
  try {
    if(!eventId || !fileType){
      console.error("file type or the eventid is missing for the delete process")
      return;
    }
    console.log("details form the database",eventId,fileType)
    const documentref = collection(db,"eventDocuments")
    const q = query(documentref,where("eventId","==",eventId),where("fileType","==",fileType))
    const querysnapshot = await getDocs(q);

    if(querysnapshot.empty){
      console.error("no document is found with this event id ")
      return;
    } 
       for (const docSnap of querysnapshot.docs) {
      await deleteDoc(doc(db, "eventDocuments", docSnap.id));
      console.log(` Document with ID ${docSnap.id} deleted from Firestore`);
    }
  } catch (error) {
    
  }

}