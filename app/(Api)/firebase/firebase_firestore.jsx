import { db } from "@/app/(Api)/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { format } from "date-fns";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { signOutUser } from "./firebase_auth";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const colorArray = [
  "#fe7a07",
  "#c95e00",
  "#ffcca3",
  "#feb474",
  "#ff983e",
  "#f4883c",
  "#f8bb8f",
  "#fb9f21",
  "#ff9f1e",
];

const adminColorArray = [
  "#fceee3",
  "#fcdfc7",
  "#fad2b1",
  "#fac396",
  "#ffb980",
  "#faa966",
  "#faa055",
  "#fa9643",
  "#f7872a",
];

//User

export const addUserToFirestore = async (userId, userInfo) => {
  try {
    await addDoc(collection(db, "user"), {
      userId: userId,
      uName: userInfo.uName,
      uEmail: userInfo.uEmail.toLowerCase(),
      organizationType: userInfo.organizationType,
      organizationName: userInfo.organizationName,
      organizationWebsite: userInfo.organizationWebsite,
      organizationLogo: userInfo.organizationLogo,
      organizerPhoneNumber: userInfo.organizerPhoneNumber,
      invoiceCountry: userInfo.invoiceCountry,
      invoicePostalCode: parseInt(userInfo.invoicePostalCode),
      invoiceStreet: userInfo.invoiceStreet,
      invoiceNumber: userInfo.invoiceNumber,
      accountCreated: userInfo.accountCreated,
      ibannumber: userInfo.ibannumber,
      isBlocked: false,
      createdAt: new Date()
    });
    // console.log("User Added: ", docRef.id);
  } catch (error) {
    toast.error("Error adding user: ", error);
  }
};

export const fetchUsers = async (setUsersArray) => {
  try {
    const usersRef = collection(db, "user");
    const querySnapshot = await getDocs(usersRef);
    const userData = querySnapshot.docs.map((doc) => doc.data());
    setUsersArray(userData);
    // console.log("Fetched Users:", userData);
  } catch (error) {
    // toast.error("Error fetching Users:", error);
  }
};

export const fetchOneUser = async (userId, setFetchUsers) => {
  try {
    const usersRef = collection(db, "user");
    const usersQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(usersQuery);
    const usersData = querySnapshot.docs.map((doc) => doc.data());
    setFetchUsers(usersData);
    // console.log("Fetched User User with ID:", userId, usersData);
  } catch (error) {
    // toast.error("Error fetching user:", userId, "Error: ", error);
  }
};

export const fetchUserById = async (userId) => {
  try {
    if (!userId) {
      return;
    }
    const userRef = collection(db, "user");
    const userQuery = query(userRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.empty) {
      console.log("No user found");
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = { id: userDoc.id, ...userDoc.data() };
    console.log("userdetails form db", userData);
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const blockOrganization = async (userId, block) => {
  try {
    const usersRef = collection(db, "user");
    const usersQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(usersQuery);
    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        isBlocked: block,
      });
    }
  } catch (error) {
    // toast.error("Error fetching user:", userId, "Error: ", error);
  }
};

export const updateOneUserField = async (userId, uVar, updateUserData) => {
  try {
    const usersRef = collection(db, "user");
    const usersQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(usersQuery);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        [uVar]: updateUserData,
      });
      // console.log(`Field ${uVar} updated successfully`);
    } else {
      // toast.error(
      //   "No document found with userId matching the provided userId."
      // );
    }
  } catch (error) {
    // toast.error(`Error updating field ${uVar}`, error);
  }
};

export const updateOneUser = async (userId, userData) => {
  try {
    const usersRef = collection(db, "user");
    const usersQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(usersQuery);

    if (!querySnapshot.empty) {
      const usersDoc = querySnapshot.docs[0];
      const usersDocRef = doc(db, "user", usersDoc.id);

      await updateDoc(usersDocRef, userData);
      toast.success("User Profile Updated!");
    } else {
      toast.error("User not found with userId:", userId);
    }
  } catch (error) {
    toast.error("Error updating user data status ", error);
  }
};

export const updateOneCollection = async (
  Id,
  collectionName,
  matchID,
  updateData
) => {
  try {
    const usersRef = collection(db, collectionName);
    const usersQuery = query(usersRef, where(matchID, "==", Id));
    const querySnapshot = await getDocs(usersQuery);

    if (!querySnapshot.empty) {
      const usersDoc = querySnapshot.docs[0];
      const usersDocRef = doc(db, collectionName, usersDoc.id);

      await updateDoc(usersDocRef, updateData);
      return true;
    } else {
      console.error(
        `Error updating document, Empty Snapshot! No document found with ${matchID}: ${Id}`
      );
      return false;
    }
  } catch (error) {
    return false;
  }
};
const generateAlphaNumericCode = (docId) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const combinedId = docId.toString();
  for (let i = 0; i < combinedId.length; i++) {
    const charIndex = combinedId.charCodeAt(i) % characters.length;
    result += characters.charAt(charIndex);
  }
  while (result.length < 8) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  if (result.length > 8) {
    result = result.slice(0, 8);
  }
  return result;
};

export const fetchUserEvents = async (userId, setEventsArray) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(eventsQuery);
    const eventsData = querySnapshot.docs.map((doc) => doc.data());
    setEventsArray(eventsData);
    // console.log("Fetched User Events:", eventsData);
  } catch (error) {
    toast.error("Error fetching user events ", error);
  }
};

export const checkUserExists = async (email) => {
  try {
    const usersRef = collection(db, "user");
    const querySnapshot = await getDocs(
      query(usersRef, where("uEmail", "==", email))
    );
    return !querySnapshot.empty;
  } catch (error) {
    toast.error("Error checking if user exists ", error);
    return false;
  }
};

//Buyers

export const addBuyers = async (buyerData) => {
  try {
    const tOrderTime = Timestamp.fromDate(new Date(buyerData.tOrderTime));
    const buyerQuery = query(
      collection(db, "buyer"),
      where("eId", "==", buyerData.eId),
      where("bEmail", "==", buyerData.bEmail)
    );

    const querySnapshot = await getDocs(buyerQuery);

    let buyerExists = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.tOrderTime &&
        data.tOrderTime.seconds === tOrderTime.seconds &&
        data.tOrderTime.nanoseconds === tOrderTime.nanoseconds
      ) {
        buyerExists = true;
      }
    });

    if (!buyerExists) {
      const docRef = await addDoc(collection(db, "buyer"), {});
      const docId = docRef.id;
      buyerData.tOrderTime = tOrderTime;

      const code = generateAlphaNumericCode(docId);
      buyerData.tQrCode = code;

      const buyerDocRef = doc(db, "buyer", docId);
      await setDoc(buyerDocRef, buyerData);
      // setQrCode(code);
      console.log("Buyer Added successfully!");
      return { docRef, code: buyerData.tQrCode, status: buyerData.tIsScanned };
    } else {
      console.error(
        "Buyer with the same eId, bEmail, and tOrderTime already exists. No new document added."
      );
      return null;
    }
  } catch (error) {
    console.error("Error adding buyer ", error);
    throw error;
  }
};

export const fetchBuyers = async (userid, eventid, setBuyersArray) => {
  try {
    const userId = userid;
    const buyersRef = collection(db, "buyer");
    const buyersQuery = query(buyersRef, where("eId", "==", eventid));
    const querySnapshot = await getDocs(buyersQuery);
    const buyersData = querySnapshot.docs.map((doc) => doc.data());
    setBuyersArray(buyersData);
    // console.log("Fetched Buyers:", buyersData);
  } catch (error) {
    // toast.error("Error fetching buyers ", error);
  }
};
export const fetchBuyersTickets = async (eventid) => {
  try {
    const buyersRef = collection(db, "buyer");
    const buyersQuery = query(buyersRef, where("eId", "==", eventid));
    const querySnapshot = await getDocs(buyersQuery);
    const buyerExists = !querySnapshot.empty;
    console.log(buyerExists,"avable ofr not")
    return buyerExists; 
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return false; // Default to false in case of error
  }
};


export const updateBuyerScannedStatus = async (selectedBuyer) => {
  
  try {
    if (!selectedBuyer || !selectedBuyer.buyerId) {
      console.log("buyer id is ",selectedBuyer)
      toast.error("Selected buyer or buyer's ID is not defined.");
      return;
    }
    const newStatus = !selectedBuyer.tIsScanned;
    const buyerRef = doc(db, "buyer", selectedBuyer.buyerId);
    await updateDoc(buyerRef, {
      tIsScanned: newStatus,
    });
    if (!selectedBuyer.tIsScanned) {
      toast.success("Buyer marked as scanned!");
    } else {
      toast.success("Buyer marked as unscanned!");
    }
  } catch (error) {
    toast.error("Failed to update status. Try again.");
    console.log(error)
  }
};
export const updatebuyerstatus = async (id) => {
  try {
    if (!id) {
      console.log("Buyer ID is missing");
      return;
    }

    const buyerQuery = query(collection(db, "buyer"), where("buyerId", "==", id));
    const querySnapshot = await getDocs(buyerQuery);

    if (querySnapshot.empty) {
      return;
    }
    const buyerDoc = querySnapshot.docs[0];
    const buyerRef = buyerDoc.ref;
    const currentStatus = buyerDoc.data().tIsScanned;
    const newStatus = !currentStatus;

    await updateDoc(buyerRef, {
      tIsScanned: newStatus,
    });

    toast.success(`Ticket marked as ${newStatus ? "Active" : "Disable"}!`);
  } catch (error) {
    toast.error("Failed to update status. Try again.");
    console.log(error)
  }
};

export const updateOneBuyer = async (buyerId, buyerData) => {
  try {
    const buyersRef = collection(db, "buyer");
    const buyersQuery = query(buyersRef, where("buyerId", "==", buyerId));
    const querySnapshot = await getDocs(buyersQuery);

    if (!querySnapshot.empty) {
      const buyersDoc = querySnapshot.docs[0];
      const buyersDocRef = doc(db, "buyer", buyersDoc.id);

      await updateDoc(buyersDocRef, buyerData);
      toast.success("Buyer updated successfully");
    } else {
      toast.error("Buyer not found with buyerId ", buyerId);
    }
  } catch (error) {
    toast.error("Error updating data data status ", error);
  }
};
export const addEventToFirestore = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, "event"), {});
    const docId = docRef.id;
    eventData.eId = docId;
    const code = generateAlphaNumericCode(docId);
    eventData.eQrCode = code;
    eventData.createdAt = new Date();
    const eventDocRef = doc(db, "event", docId);
    await setDoc(eventDocRef, eventData);
    toast.success("New Event Added Successfully");
    return docRef;
  } catch (error) {
    toast.error("Error adding event document ", error);
    throw error;
  }
};

export const addTransaction = async (
  transaction_id,
  eventId,
  buyerData,
  noOfTickets,
  ticketType,
  uEmail,
  eName,
  eStart,
  referrals,
  discount
) => {
  try {
    if (
      !buyerData ||
      !buyerData.name ||
      !buyerData.email ||
      !buyerData.number
    ) {
      throw new Error("Buyer data is missing or incomplete.");
    }
    // const docId = buyerId || transaction_id;
    // const code = generateAlphaNumericCode(docId);
    const docRef = await addDoc(collection(db, "transactions"), {
      eventId,
      transaction_id,
      buyerId: null,
      buyerName: buyerData.name,
      buyerEmail: buyerData.email,
      buyerNumber: buyerData.number,
      tQuantity: noOfTickets,
      ticketType: ticketType,
      paymentStatus: "pending",
      Amount: null,
      discountPercent: discount || 0,
      Reference: "",
      IbanNumber: null,
      paymentMethod: "",
      bankTransactionId: null,
      Settled: "no",
      BankId: null,
      orgnizeremail: uEmail,
      eventname: eName,
      eStart: eStart,
      referrals: referrals,
      SettlementDate: null,
      isrefund: false,
      refundAmount: 0,
      createdAt: new Date(),
    });
    await updateDoc(docRef, { buyerId: docRef.id });
    console.log("data add sucessfully in the transaction");
  } catch (error) {
    toast.error("Error adding transaction document: " + error.message);
    throw error;
  }
};

export const updatePaymentStatusByTransactionId = async (
  logEntry,
  Iban,
  bankId
) => {
  try {
    const transactionsRef = collection(db, "transactions");
    const transaction_id = logEntry.PaymentId;
    if (!transaction_id) {
      console.log("Transaction ID is missing.");
    }

    const {
      Status,
      Amount,
      Reference,
      Method,
      BankTransactionId,
      Settled,
      SettlementDate,
    } = logEntry;

    // Query Firestore to find the document with matching transaction_id
    const q = query(
      transactionsRef,
      where("transaction_id", "==", transaction_id)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No transaction data found with this ID:", transaction_id);
      return;
    }
    // Get the first matching document
    const transactionDoc = querySnapshot.docs[0];
    const transactionDocRef = doc(db, "transactions", transactionDoc.id);
    const trannsactiondata = transactionDoc.data();
    if (trannsactiondata.paymentStatus?.toLowerCase() === "done") {
      await updateDoc(transactionDocRef, {
        Settled: Settled?.toLowerCase() || "no",
        SettlementDate: SettlementDate || null,
        bankTransactionId: BankTransactionId || null,
      });
      console.log("Only settlement details updated in transaction.");
      return;
    }


    // Update the payment status to true
    await updateDoc(transactionDocRef, {
      paymentStatus: Status.toLowerCase(),
      Amount: Amount || null,
      Reference: Reference,
      IbanNumber: Iban || null,
      paymentMethod: Method,
      bankTransactionId: BankTransactionId || null,
      Settled: Settled?.toLowerCase() || "no",
      SettlementDate: SettlementDate || null,
      BankId: bankId || null,
    });

    if (Status.toLowerCase() !== "done") {
      console.log("payment is failed");
      return;
    }
    return {
      buyerEmail: transactionDoc.data().buyerEmail,
      buyerName: transactionDoc.data().buyerName,
      paymentStatus: Status,
      buyerId: transactionDoc.data().buyerId,
      amountPaid: Amount,
      transactionReference: Reference,
      bankTransactionId: BankTransactionId,
      tquantity: transactionDoc.data().tQuantity,
      tickettype: transactionDoc.data().ticketType,
      discount: transactionDoc.data().discountPercent,
      uEmail: transactionDoc.data().orgnizeremail,
      eName: transactionDoc.data().eventname,
      eStart: transactionDoc.data().eStart,
      eventId: transactionDoc.data().eventId,
      referrals: transactionDoc.data().referrals,
      paymentMethod: Method,
  
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};
export const getTransactionById = async (eventId) => {
  try {
    const transactionsRef = collection(db, "buyer");
    const q = query(transactionsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No event found wiht this id", eventId);
      return null;
    }

    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(), 
    }));
    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
};

export const getTotalRev = async (eventId) =>{
  console.log("evnet id ",eventId)
  if(!eventId){
    console.log("no amount fount with this data")
    return 0;
  
  }
  try {
    const transactionsRef = collection(db,"transactions");
    const q = query(transactionsRef,where("eventId","==",eventId))
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      console.log("no amout is found")
      return 0;
    }
    let total_amount = 0;
   querySnapshot.forEach((doc)=>{
   const data = doc.data();
   if(data.paymentStatus == "done"){
  total_amount += data.Amount || 0;
   }
  })
    return total_amount
  } catch (error) {
    console.log("something went wrong at found total amount of an event")
    
  }

}
export const getTotalOrgRev = async (userId) =>{
  if(!userId){
    console.log("no evet is found")
    return 0;
  }
    try {
      const eventref = collection(db,"event")
      const q = query(eventref, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        console.log("no amount foun this id")
        return 0;
      }
      let totalRevenue = 0;

        for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (data.eId) {
        const eventRevenue = await getTotalRev(data.eId);
        totalRevenue += eventRevenue; // Accumulate event revenue
      }
    }
    console.log(totalRevenue,"og")
   return totalRevenue;

    } catch (error) {
    console.log("something went wrong") 
    }
  }
export const fetchAuthorizedEvents = async (
  userId,
  eventId,
  setEventsArray
) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(
      eventsRef,
      where("eId", "==", eventId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(eventsQuery);
    const eventsData = querySnapshot.docs.map((doc) => doc.data());
    setEventsArray(eventsData);
    return eventsData.length > 0;
  } catch (error) {
    toast.error("Error fetching events: ", error.message);
    return false;
  }
};

export const fetchEvents = async (setEventsArray) => {
  try {
    const usersRef = collection(db, "user");
    const usersSnapshot = await getDocs(usersRef);
    const usersData = usersSnapshot.docs.map((doc) => doc.data());

    const userMap = new Map();
    usersData.forEach((user) => {
      userMap.set(user.userId, user.uEmail);
    });

    const eventsRef = collection(db, "event");
    const eventsSnapshot = await getDocs(eventsRef);
    const eventsData = eventsSnapshot.docs.map((doc) => {
      const eventData = doc.data();
      eventData.uEmail = userMap.get(eventData.userId) || "Email Not Found";
      return eventData;
    });

    setEventsArray(eventsData);
    // console.log("Fetched Events with User Emails:", eventsData);
  } catch (error) {
    // toast.error("Error fetching events with user emails ", error);
  }
};

export const fetchOneEvent = async (eId, setEventData) => {
  try {
    const eventId = eId;
    const eventRef = collection(db, "event");
    const eventQuery = query(eventRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventQuery);
    if (!querySnapshot.empty) {
      const eventData = querySnapshot.docs[0].data();
      setEventData(eventData);
      // console.log("Fetched event:", eventData);
    } else {
      // console.log("Event not found with eventId:", eventId);
    }
  } catch (error) {
    toast.error("Error fetching event:", error);
  }
};

export const updateEventVisibility = async (userId, eId, newVisibility) => {
  try {
    if (!eId) {
      toast.error("Event ID is not defined.");
      return;
    }

    const eventsRef = collection(db, "event");
    const eventsQuery = query(
      eventsRef,
      where("eId", "==", eId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(eventsQuery);

    if (querySnapshot.empty) {
      console.error(
        "Event not found or you do not have permission to update it."
      );
      return;
    }
    const eventDoc = querySnapshot.docs[0].ref;
    await updateDoc(eventDoc, {
      isVisible: newVisibility,
    });
    if (newVisibility == false) {
      toast.success("Event is now Hidden!");
    } else {
      toast.success("Event is now Active");
    }
  } catch (error) {
    toast.error("Error updating event visibility: ", error);
  }
};

export const checkDuplicateEvent = async (eventName) => {
  const eventsRef = collection(db, "event");
  const eventQuery = query(eventsRef, where("eName", "==", eventName));
  const querySnapshot = await getDocs(eventQuery);

  return !querySnapshot.empty;
};

export const updateEventStatus = async (userId, eId, newStatus) => {
  try {
    if (!eId) {
      toast.error("Event ID is not defined.");
      return;
    }

    const eventsRef = collection(db, "event");
    const eventsQuery = query(
      eventsRef,
      where("eId", "==", eId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(eventsQuery);

    if (querySnapshot.empty) {
      toast.error(
        "Event not found or you do not have permission to update it."
      );
      return;
    }
    const eventDoc = querySnapshot.docs[0].ref;
    await updateDoc(eventDoc, {
      adminAuth: newStatus,
    });
    if (newStatus == false) {
      toast.success("Event is now Disabled!");
    } else {
      toast.success("Event is now Enabled");
    }
  } catch (error) {
    toast.error("Error updating event Status: ", error);
  }
};

export const updateOneEvent = async (eventId, userId, updateEventData) => {
  try {
    const eventsRef = collection(db, "event");
    const eventQuery = query(
      eventsRef,
      where("eId", "==", eventId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(eventQuery);

    if (!querySnapshot.empty) {
      const eventDoc = querySnapshot.docs[0];
      const eventDocRef = doc(db, "event", eventDoc.id);

      await updateDoc(eventDocRef, updateEventData);
      // toast.success("Event updated successfully!");
    } else {
      toast.error(
        "Event not found or you do not have permission to update it."
      );
    }
  } catch (error) {
    toast.error("Error updating event data!", error);
  }
};

export const fetchOneEventViaName = async (eName, setEventData) => {
  try {
    const eventName = eName;
    const eventRef = collection(db, "event");
    const eventQuery = query(eventRef, where("eName", "==", eventName));
    const querySnapshot = await getDocs(eventQuery);
    if (!querySnapshot.empty) {
      const eventData = querySnapshot.docs[0].data();
      setEventData(eventData);
      // console.log("Fetched event:", eventData);
    } else {
      toast.error("Event not found with Event Name ", eventName);
    }
  } catch (error) {
    toast.error("Error fetching event ", error);
  }
};

export const deleteEvent = async (eventId, eBanner, eventPDF) => {
  const storage = getStorage();

  try {
    // Check if the banner is used by other events
    if (eBanner) {
      const eventsUsingBanner = await checkEventsUsingBanner(eBanner);
      if (eventsUsingBanner.length === 0) {
        const bannerRef = ref(storage, eBanner);
        await deleteObject(bannerRef)
          .then(() => {
            // console.log(`Deleted banner image: ${eBanner}`);
          })
          .catch((error) => {
            if (error.code === "storage/object-not-found") {
              console.log(`Banner image not found: ${eBanner}`);
            } else {
              throw error;
            }
          });
      } else {
        console.log(
          "Banner is still in use by other events, so it won't be deleted."
        );
      }
    }

    // Same check can be applied for the PDF if necessary
    if (eventPDF) {
      const pdfRef = ref(storage, eventPDF);
      await deleteObject(pdfRef)
        .then(() => {
          // console.log(`Deleted PDF file: ${eventPDF}`);
        })
        .catch((error) => {
          if (error.code === "storage/object-not-found") {
            console.log(`PDF file not found: ${eventPDF}`);
          } else {
            throw error;
          }
        });
    }

    const eventDocRef = doc(db, "event", eventId);
    await deleteDoc(eventDocRef);
    toast.success("Event deleted successfully.");
  } catch (error) {
    // console.log("Error while deleting event: ", error);
    toast.error("Error deleting event or files " + error.message);
  }
};

const checkEventsUsingBanner = async (eBanner) => {
  const eventsQuery = query(
    collection(db, "event"),
    where("eBanner", "==", eBanner)
  );
  const querySnapshot = await getDocs(eventsQuery);

  const events = [];
  querySnapshot.forEach((doc) => {
    events.push(doc.data());
  });

  return events;
};
//Tickets

export const addNewTicket = async (eventId, ticketData) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventsQuery);
    if (!querySnapshot.empty) {
      const eventDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "event", eventDoc.id), {
        ticketInfo: arrayUnion(ticketData),
      });
      toast.success("New Ticket Added Successfully!");
    } else {
      toast.error(
        "No document found with event ID matching the provided event ID."
      );
    }
  } catch (error) {
    toast.error("Error adding new ticket ", error);
  }
};

export const updateEventTicket = async (
  eventId,
  ticketIndex,
  updatedTicketData
) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventsQuery);

    if (!querySnapshot.empty) {
      const eventDoc = querySnapshot.docs[0];

      const ticketInfo = eventDoc.data().ticketInfo;

      ticketInfo[ticketIndex] = updatedTicketData;

      await updateDoc(doc(db, "event", eventDoc.id), {
        ticketInfo: ticketInfo,
      });

      toast.success("Event ticket updated successfully!");
    } else {
      toast.error("No document found with eId matching the provided eventId.");
    }
  } catch (error) {
    toast.error("Error updating event ticket ", error);
  }
};

//update ticket quantity
// export const updateTicket = async (eventId, tquantity,tickettype) => {
//   try {
//     const eventsRef = collection(db, "event");
//     const eventsQuery = query(eventsRef, where("eId", "==", eventId));
//     const querySnapshot = await getDocs(eventsQuery);

//     if (!querySnapshot.empty) {
//       const eventDoc = querySnapshot.docs[0]; // Get the first matching document
//       const eventDocRef = doc(db, "event", eventDoc.id); // Get document reference
//       const ticketInfo = eventDoc.data().ticketInfo || [];

//       if (ticketInfo) {
//         ticketInfo[0].tQuantity -= tquantity; // Reduce ticket quantity

//         // Update Firestore document
//         await updateDoc(eventDocRef, {
//           ticketInfo: ticketInfo
//         });
//         console.log("Ticket quantity updated successfully!");
//       } else {
//         console.log("No ticket information found.");
//       }
//     } else {
//       console.log("Event not found.");
//     }
//   } catch (error) {
//     console.error("Error updating ticket quantity:", error);
//   }
// };
export const updateTicket = async (eventId, tquantity, tickettype) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventsQuery);

    if (!querySnapshot.empty) {
      for (const eventDoc of querySnapshot.docs) {
        // Loop through all matching events
        const eventDocRef = doc(db, "event", eventDoc.id);
        const ticketInfo = eventDoc.data().ticketInfo || [];

        // Find the ticket with the matching type
        const ticketIndex = ticketInfo.findIndex(
          (ticket) => ticket.tType == tickettype
        );

        if (ticketIndex !== -1) {
          ticketInfo[ticketIndex].tQuantity -= tquantity;

          // Prevent negative ticket quantity
          if (ticketInfo[ticketIndex].tQuantity < 0) {
            ticketInfo[ticketIndex].tQuantity = 0;
          }

          // Update Firestore document
          await updateDoc(eventDocRef, { ticketInfo });

          console.log(
            `Ticket quantity updated for Event ID: ${eventId}, Type: ${tickettype}`
          );
          return; // Exit after updating the correct ticket
        }
      }
      console.log("Ticket type not found in any matching events.");
    } else {
      console.log("No event found with the given ID.");
    }
  } catch (error) {
    console.error("Error updating ticket quantity:", error);
  }
};

export const deleteEventTicket = async (eventId, ticketIndex) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventsQuery);

    if (!querySnapshot.empty) {
      const eventDoc = querySnapshot.docs[0];

      let ticketInfo = eventDoc.data().ticketInfo;

      ticketInfo.splice(ticketIndex, 1);

      await updateDoc(doc(db, "event", eventDoc.id), {
        ticketInfo: ticketInfo,
      });

      toast.success("Event ticket deleted successfully!");
    } else {
      toast.error("No document found with eId matching the provided eventId.");
    }
  } catch (error) {
    toast.error("Error deleting event ticket", error);
  }
};

export const updateTicketField = async (
  eventId,
  tickettype,
  updatedTicketData,
  tvar
) => {
  try {
    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(eventsQuery);

    if (!querySnapshot.empty) {
      const eventDoc = querySnapshot.docs[0];
      const ticketInfo = eventDoc.data().ticketInfo;
      const ticketIndex = ticketInfo.findIndex(
        (ticket) => ticket.tType == tickettype
      );

        // // Prevent negative ticket quantity
        if (ticketInfo[ticketIndex].tQuantity < 0) {
          ticketInfo[ticketIndex].tQuantity = 0;
        }
      ticketInfo[ticketIndex][tvar] = updatedTicketData[tvar];

      await updateDoc(doc(db, "event", eventDoc.id), {
        ticketInfo: ticketInfo,
      });

      return true;
    } else {
      toast.error("No document found with eId matching the provided eventId.");
      return false;
    }
  } catch (error) {
    // toast.error(`Error updating ticket ${tvar}`);
    return false;
  }
};

//Lost Ticket
export const checkLostTicket = async (email, date) => {
  try {
    const buyersRef = collection(db,"buyer");
    const buyersQuery = query(buyersRef, where("bEmail", "==", email));
    const querySnapshot = await getDocs(buyersQuery);
    let tOrderTime;
    let matchingDocs = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const ts = data.tOrderTime.toMillis();
      const conDate = new Date(ts);

      const formattedTOrderTime = `${conDate.getDate()}/${
        conDate.getMonth() + 1
      }/${conDate.getFullYear()}`;

      if (
        formattedTOrderTime ===
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      ) {
        matchingDocs.push(doc.data());
      }
    });
    if (matchingDocs.length > 0) {
      for (const doc of matchingDocs) {
        const eId = doc.eId;
        const tPrice = doc.tPrice;
        let eventData;
        let userId;
        let uEmail;
        let eventDataTemp;
        let eventName;
        let eStart;
        await fetchOneEvent(eId, (data) => {
          eventDataTemp = data;
        });
        if (eventDataTemp) {
          eventData = eventDataTemp;
          userId = eventData.userId;
          eventName = eventData.eName;
          eStart = eventData.eStart;
        } else {
          toast.error("Event not found!");
          continue;
        }

        let userData;
        await fetchOneUser(userId, (data) => {
          userData = data;
        });
        if (userData) {
          uEmail = userData[0].uEmail;
        } else {
          continue;
        }
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            tQrCode: doc.tQrCode,
            // paymentMethod: doc.paymentMethod ,
            // cardDigits: doc.cardDigits || "no",
            uEmail: uEmail,
            bName: doc.bName,
            tQuantity: doc.tQuantity,
            tType: doc.tType,
            amountPaid: doc.tPrice,
            eventName: eventName,
             eStart: format(eStart.toDate(), "dd/MM/yyyy HH:mm:ss 'UTC'XXX"),
            tUID: process.env.NEXT_PUBLIC_MAILTRAP_TICKET_TID,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Email sent successfully!");
        } else {
          toast.error("Error sending email ", data.error);
        }
      }
    } else {
      toast.error("No tickets found with the provided email and date.");
    }
  } catch (error) {
    console.error("Error checking lost ticket ", error.message);
  }
};

export const addDiscountCode = async (eventId, ticketIndex, discountData) => {
  try {
    const discountRef = collection(db, "discount");
    const discountQuery = query(discountRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(discountQuery);

    const discountUpdates = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnapshot) => {
        const existingDiscountData = docSnapshot.data().discountData || [];
        const updatedDiscountData = [...existingDiscountData, ...discountData];

        discountUpdates.push(
          updateDoc(docSnapshot.ref, {
            discountData: updatedDiscountData,
          })
        );
      });
    } else {
      discountUpdates.push(
        addDoc(discountRef, {
          eId: eventId,
          discountData: discountData,
        })
      );
    }

    await Promise.all(discountUpdates);
    toast.success("Discount Code Added Successfully!");

    const eventsRef = collection(db, "event");
    const eventsQuery = query(eventsRef, where("eId", "==", eventId));
    const eventQuerySnapshot = await getDocs(eventsQuery);

    if (!eventQuerySnapshot.empty) {
      const eventDoc = eventQuerySnapshot.docs[0];
      const ticketInfo = eventDoc.data().ticketInfo;

      if (ticketIndex !== null) {
        ticketIndex.forEach((index) => {
          if (ticketInfo[index]) {
            if (!ticketInfo[index].dCodes) {
              ticketInfo[index].dCodes = [];
            }
            discountData.forEach((discount) => {
              if (
                discount.discountCode &&
                !ticketInfo[index].dCodes.includes(discount.discountCode)
              ) {
                ticketInfo[index].dCodes.push(discount.discountCode);
              }
            });
          }
        });
      }

      await updateDoc(eventDoc.ref, {
        ticketInfo: ticketInfo,
      });

      // toast.success("Discount code added to selected tickets!");
    } else {
      toast.error(
        "No event document found with eId matching the provided eventId."
      );
    }
  } catch (error) {
    toast.error("Error adding discount-code ", error);
  }
};

export const fetchDiscountData = async (eventId, setDiscountArray) => {
  try {
    const eventid = eventId;
    const discountRef = collection(db, "discount");
    const discountQuery = query(discountRef, where("eId", "==", eventid));
    const querySnapshot = await getDocs(discountQuery);
    const discountData = querySnapshot.docs.map((doc) => doc.data());

    // console.log("Fetched discounts:", discountData);
    setDiscountArray(discountData);
  } catch (error) {
    toast.error("Error fetching discount-codes ", error);
  }
};

export const fetchDiscountCode = async (
  eId,
  discountCode,
  setDiscountPercentage,
  tType
) => {
  try {
    const discountRef = collection(db, "discount");
    const eventRef = doc(db, "event", eId);

    if (typeof eId === "string" && typeof discountCode === "string") {
      const eventDoc = await getDoc(eventRef);
      if (!eventDoc.exists()) {
        // console.log("Event not found!");
        return;
      }

      const eventData = eventDoc.data();
      const ticketInfo = eventData.ticketInfo;

      let isValidForEvent = false;
      for (let ticket of ticketInfo) {
        if (ticket.tType === tType && Array.isArray(ticket.dCodes)) {
          if (ticket.dCodes.includes(discountCode)) {
            isValidForEvent = true;
            break;
          }
        }
      }

      if (!isValidForEvent) {
        toast.error(
          "Discount code not valid for this ticket type in the event!"
        );
        return;
      }

      const discountQuery = query(discountRef, where("eId", "==", eId));
      const querySnapshot = await getDocs(discountQuery);
      querySnapshot.forEach((doc) => {
        const discountData = doc.data().discountData;

        if (Array.isArray(discountData)) {
          const discount = discountData.find(
            (data) => data.discountCode === discountCode
          );

          if (discount) {
            const { dCodeUsed, percent, dEnd, dStatus, dStart } = discount;

            const endDate = dEnd.toDate();
            const startdate = dStart.toDate();

            if (startdate > new Date()) {
              toast.error("Discount code in not active yet !");
            } else if (
              endDate > new Date() &&
              dCodeUsed > 0 &&
              dStatus === true
            ) {
              const discountIndex = discountData.indexOf(discount);
              setDiscountPercentage([
                discountIndex,
                Number(percent),
                Number(dCodeUsed),
              ]);
              toast.success(`${percent}% Discount Applied!"`);
            } else {
              toast.error(
                "Discount code is expired, no usages left, or inactive!"
              );
            }
          } else {
            toast.error("Discount code not valid for this event!");
          }
        } else {
          // toast.error("Discount data is not an array.");
        }
      });
    } else {
      toast.error("Invalid discountCode");
    }
  } catch (error) {
    toast.error("Error fetching discount code ", error);
  }
};

export const updateDiscountCode = async (
  eventId,
  discountIndex,
  ticketIndex,
  updateDiscountData,
  isChangeChecked,
  oldDiscountCode
) => {
  try {
    const discountRef = collection(db, "discount");
    const discountQuery = query(discountRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(discountQuery);

    if (!querySnapshot.empty) {
      const discountDoc = querySnapshot.docs[0];
      const discountData = discountDoc.data().discountData;

      discountData[discountIndex] = updateDiscountData;

      discountData.forEach((discount, index) => {
        Object.keys(discount).forEach((key) => {
          if (discount[key] === undefined) {
            toast.error(
              `Error: ${key} is undefined in discountData at index ${index}`
            );
          }
        });
      });

      await updateDoc(doc(db, "discount", discountDoc.id), {
        discountData: discountData,
      });

      toast.success("Discount Code Updated!");

      const eventsRef = collection(db, "event");
      const eventsQuery = query(eventsRef, where("eId", "==", eventId));
      const eventQuerySnapshot = await getDocs(eventsQuery);

      if (!eventQuerySnapshot.empty) {
        const eventDoc = eventQuerySnapshot.docs[0];
        let ticketInfo = eventDoc.data().ticketInfo;

        ticketInfo = ticketInfo.map((ticket) => ({
          ...ticket,
          tStart:
            ticket.tStart instanceof Timestamp
              ? ticket.tStart
              : Timestamp.fromDate(new Date(ticket.tStart)),
          tEnd:
            ticket.tEnd instanceof Timestamp
              ? ticket.tEnd
              : Timestamp.fromDate(new Date(ticket.tEnd)),
        }));

        ticketIndex.forEach((idx) => {
          const isChecked = isChangeChecked[idx];
          const ticket = ticketInfo[idx];
          const dCode = ticketInfo[idx]?.dCodes || [];

          if (isChecked && ticket) {
            const dCodes = ticket.dCodes || [];
            const oldDiscountCodeIndex = dCodes.indexOf(oldDiscountCode);

            if (oldDiscountCodeIndex !== -1) {
              dCodes[oldDiscountCodeIndex] = updateDiscountData.discountCode;
            } else {
              dCodes.push(updateDiscountData.discountCode);
            }

            ticketInfo[idx] = { ...ticket, dCodes };
          } else {
            const codeIndex = dCode.indexOf(updateDiscountData.discountCode);
            if (codeIndex !== -1) {
              dCode.splice(codeIndex, 1);
            }
          }
        });

        await updateDoc(eventDoc.ref, {
          ticketInfo: ticketInfo,
        });

        // toast.success("Discount codes updated for tickets successfully!");
      } else {
        toast.error(
          "No event document found with event ID matching the provided event ID."
        );
      }
    } else {
      toast.error(
        "No document found with event ID matching the provided event ID."
      );
    }
  } catch (error) {
    toast.error("Error updating discount-code status ", error);
  }
};

export const deleteDiscountCode = async (
  eventId,
  discountIndex,
  oldDiscountCode
) => {
  try {
    const discountRef = collection(db, "discount");
    const discountQuery = query(discountRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(discountQuery);

    if (!querySnapshot.empty) {
      const discountDoc = querySnapshot.docs[0];
      const discountData = discountDoc.data().discountData;

      discountData.splice(discountIndex, 1);

      await updateDoc(doc(db, "discount", discountDoc.id), {
        discountData: discountData,
      });

      toast.success("Discount code deleted successfully.");

      const eventRef = collection(db, "event");
      const eventQuery = query(eventRef, where("eId", "==", eventId));
      const eventSnapshot = await getDocs(eventQuery);

      if (!eventSnapshot.empty) {
        const eventDoc = eventSnapshot.docs[0];
        const eventData = eventDoc.data();

        eventData.ticketInfo.forEach((ticket, index) => {
          if (ticket.dCodes && ticket.dCodes.includes(oldDiscountCode)) {
            const codeIndex = ticket.dCodes.indexOf(oldDiscountCode);
            ticket.dCodes.splice(codeIndex, 1);
          }
        });

        await updateDoc(doc(db, "event", eventDoc.id), {
          ticketInfo: eventData.ticketInfo,
        });

        // toast.success("Discount code removed from the selected tickets!");
      }
    }
  } catch (error) {
    toast.error("Error deleting discount-code status ", error);
  }
};

export const updateDiscounFields = async (
  eventId,
  discountIndex,
  updatedDiscountStatus,
  dVar
) => {
  try {
    const discountRef = collection(db, "discount");
    const discountQuery = query(discountRef, where("eId", "==", eventId));
    const querySnapshot = await getDocs(discountQuery);

    if (!querySnapshot.empty) {
      const discountDoc = querySnapshot.docs[0];

      const discountData = discountDoc.data().discountData;

      if (discountIndex >= 0 && discountIndex < discountData.length) {
        if (discountData[discountIndex]) {
          discountData[discountIndex][dVar] = updatedDiscountStatus[dVar];

          await updateDoc(doc(db, "discount", discountDoc.id), {
            discountData: discountData,
          });
        } else {
          // toast.error(`Invalid discount index: ${discountIndex}`);
          return false;
        }
      } else {
        // toast.error(`Invalid discount index: ${discountIndex}`);
        return false;
      }
      return true;
    } else {
      toast.error(
        "No document found with event ID matching the provided event ID."
      );
    }
  } catch (error) {
    // toast.error(`Error updating discount-code-${dVar} `, error);
    return false;
  }
};

export const fetchTotalRevenueAndOrders = async (eventId) => {
  if (!eventId) {
    toast.error("eventId is undefined or null");
    return { totalRevenue: 0, ticketsPerOrder: 0, amountPerOrder: 0 };
  }

  try {
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const eventSnapshot = await getDocs(eventQuery);
    let totalRevenue = 0;
    let totalTickets = 0;
    let totalOrders = 0;

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      if (data.refundAmount == undefined || data.Amount == null) {
        return;
      }
      console.log(data.Amount, data.refundAmount);
      totalRevenue += data.Amount - data.refundAmount;
      totalTickets += data.tQuantity;
      totalOrders += 1;
    });
    const ticketsPerOrder = totalTickets / totalOrders;
    const amountPerOrder = totalRevenue / totalOrders;
    return { totalRevenue, ticketsPerOrder, amountPerOrder };
  } catch (error) {
    toast.error("Error fetching data ", error);
    return { totalRevenue: 0, ticketsPerOrder: 0, amountPerOrder: 0 };
  }
};

export const fetchWeeklyRevenue = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const buyerSnapshot = await getDocs(eventQuery);
    let weeklyRevenue = 0;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 7);

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      console.log("data", data);
      if (data.refundAmount == undefined || data.Amount == null) {
        return;
      }
      const orderDate = new Date(data.createdAt.toDate());
      if (orderDate >= startDate && orderDate < endDate) {
        weeklyRevenue += Number(data.Amount - data.refundAmount);
      }
    });
    console.log("weekly revenue", weeklyRevenue);
    return weeklyRevenue;
  } catch (error) {
    toast.error("Error fetching weekly revenue data ", error);
    return 0;
  }
};
export const fetchDailyRevenue = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const buyerSnapshot = await getDocs(eventQuery);

    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    ); // Start of current week (Sunday)

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7); // End of current week (next Sunday)

    const dailyRevenue = {};
    const dailyTicketCount = {};

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      // Check if the order date is within the current week range
      if (orderDate >= currentWeekStart && orderDate < currentWeekEnd) {
        const dayOfWeek = orderDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const ticketCount = Number(data.tQuantity);
        if (dailyRevenue[dayOfWeek]) {
          dailyRevenue[dayOfWeek] += data.Amount - data.refundAmount;
          dailyTicketCount[dayOfWeek] += ticketCount
        } else {
          dailyRevenue[dayOfWeek] = data.Amount - data.refundAmount;
          dailyTicketCount[dayOfWeek] = ticketCount
        }
      }
    });

    // Round all daily revenues to 2 decimal places (if needed)
    Object.keys(dailyRevenue).forEach((day) => {
      dailyRevenue[day] = parseFloat(dailyRevenue[day].toFixed(2));
    });

    // Format the data for chart
    const formattedData = Object.keys(dailyRevenue).map((day) => ({
      day,
      revenue: dailyRevenue[day],
      ticket: dailyTicketCount[day]
    }));
    return formattedData;
  } catch (error) {
    toast.error("Error fetching daily revenue data ", error);
    return [];
  }
};
export const fetchMonthlyRevenue = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const buyerSnapshot = await getDocs(eventQuery);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthlyRevenue = {};
    let totalMonthlyRevenue = 0; 

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;

      const orderDate = new Date(data.createdAt.toDate());
      const year = orderDate.getFullYear();
      const month = orderDate.toLocaleString("en-US", { month: "short" });

      const ticketCount = Number(data.tQuantity) || 0;
      const revenue = Number(data.Amount) - Number(data.refundAmount || 0);
      const monthYearKey = `${month}-${year}`;

      if (!monthlyRevenue[monthYearKey]) {
        monthlyRevenue[monthYearKey] = { revenue: 0, totalTickets: 0 };
      }

      // Accumulate revenue and ticket count
      monthlyRevenue[monthYearKey].revenue += revenue;
      monthlyRevenue[monthYearKey].totalTickets += ticketCount;

      if (year === currentYear && orderDate.getMonth() === currentMonth) {
        totalMonthlyRevenue += revenue;
      }
    });

    Object.keys(monthlyRevenue).forEach((monthYearKey) => {
      monthlyRevenue[monthYearKey].revenue = parseFloat(
        monthlyRevenue[monthYearKey].revenue.toFixed(2)
      );
    });

    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      months.unshift(`${month}-${year}`);
    }

    // Format the data for the chart
    const formattedData = months.map((monthYearKey) => ({
      month: monthYearKey,
      revenue: monthlyRevenue[monthYearKey]?.revenue || 0,
      ticket: monthlyRevenue[monthYearKey]?.totalTickets || 0,
    }));

    totalMonthlyRevenue = parseFloat(totalMonthlyRevenue.toFixed(2));
    console.log(totalMonthlyRevenue, "data of current month");

    return { formattedData, totalMonthlyRevenue };
  } catch (error) {
    console.error("Error fetching monthly revenue data: ", error);
    toast.error("Error fetching monthly revenue data");
    return { formattedData: [], totalMonthlyRevenue: 0 };
  }
};



export const fetchOverallRevenue = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const buyerSnapshot = await getDocs(eventQuery);

    const overallRevenue = {};

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      const date = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (overallRevenue[date]) {
        overallRevenue[date] += Number(data.Amount - data.refundAmount);
      } else {
        overallRevenue[date] = Number(data.Amount - data.refundAmount);
      }
    });

    const formattedData = Object.keys(overallRevenue).map((date) => ({
      date,
      revenue: overallRevenue[date],
    }));

    return formattedData;
  } catch (error) {
    toast.error("Error fetching overall revenue data ", error);
    return [];
  }
};

export const fetchReferralsData = async (eventId) => {
  const allReferralSources = {
    Facebook: 0,
    Instagram: 0,
    Twitter: 0,
    Snapchat: 0,
    Linkedin: 0,
    Others: 0,
  };

  try {
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const eventSnapshot = await getDocs(eventQuery);

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const referralSource = data.referrals;

      if (referralSource && allReferralSources.hasOwnProperty(referralSource)) {
        allReferralSources[referralSource] += 1;
      } else if (referralSource) {
        allReferralSources.Others += 1; // If the referral source is not listed, count it as "Others"
      }
    });

    return Object.keys(allReferralSources).map((ref) => ({
      name: ref,
      value: allReferralSources[ref],
    }));
  } catch (error) {
    toast.error("Error fetching referrals data ", error);
    return [];
  }
};

export const fetchPaymentMethodsData = async (eventId) => {
  const allPaymentMethods = {};
  const paymentMethodColors = {};
  const Topbanks = new Set() ;
  const OtherBank = "Other"

  try {
    const buyerRef = collection(db, "transactions");
    const eventQuery = query(buyerRef, where("eventId", "==", eventId));
    const eventSnapshot = await getDocs(eventQuery);

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const paymentMethod = data.BankId;

      if (paymentMethod) {
        if(!Topbanks.has(paymentMethod) && Topbanks.size <5 ){
          Topbanks.add(paymentMethod);
        }
        const key = Topbanks.has(paymentMethod) ? paymentMethod : OtherBank;
        allPaymentMethods[key] =
          (allPaymentMethods[key] || 0) + 1;
      }
    });

    let colorIndex = 0;
    return Object.keys(allPaymentMethods).map((method) => {
      if (!paymentMethodColors[method]) {
        paymentMethodColors[method] =
          colorArray[colorIndex % colorArray.length];
        colorIndex++;
      }
      return {
        name: method,
        value: allPaymentMethods[method],
        colors: paymentMethodColors[method],
      };
    });
  } catch (error) {
    toast.error("Error fetching payment methods data ", error);
    return [];
  }
};

export const addCompareCalculatorUse = async () => {
  const settingId = "0xIAcPds7GJbX9qO8Yrf";
  try {
    const settingRef = collection(db, "setting");
    const settingsQuery = query(
      settingRef,
      where("settingId", "==", settingId)
    );
    const querySnapshot = await getDocs(settingsQuery);
    const settingsData = querySnapshot.docs.map((doc) => doc.data());
    const settingURef = doc(db, "setting", querySnapshot.docs[0].id);
    await updateDoc(settingURef, {
      count: settingsData[0].count + 1,
      updatedAt: new Date(),
    });
  } catch (error) {
    toast.error("Error adding value: ", error);
  }
};

export const fetchCompareCalculatorUse = async () => {
  const settingId = "0xIAcPds7GJbX9qO8Yrf";
  try {
    const settingRef = collection(db, "setting");
    const settingsQuery = query(
      settingRef,
      where("settingId", "==", settingId)
    );
    const querySnapshot = await getDocs(settingsQuery);
    const settingsData = querySnapshot.docs.map((doc) => doc.data());
    return settingsData[0];
  } catch (error) {
    toast.error("Error adding value: ", error);
  }
};

//////////////////////////////////////////////////////////// admin /////////////////////////////////////////////////////////////

export const fetchReferralsDataAdmin = async () => {
  const allReferralSources = {
    Facebook: 0,
    Instagram: 0,
    Twitter: 0,
    Snapchat: 0,
    Linkedin: 0,
    Others: 0,
  };

  try {
    const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      const referralSource = data.referrals;

      if (referralSource && allReferralSources.hasOwnProperty(referralSource)) {
        allReferralSources[referralSource] += 1;
      } else if (referralSource) {
        allReferralSources.Others += 1; // If the referral source is not listed, count it as "Others"
      }
    });

    return Object.keys(allReferralSources).map((ref) => ({
      name: ref,
      value: allReferralSources[ref],
    }));
  } catch (error) {
    toast.error("Error fetching referrals data ", error);
    return [];
  }
};

export const fetchPaymentMethodAdmin = async () => {
  const allPaymentMethods = {};
  const paymentMethodColors = {};
  const TopBanks = new Set(); 
  const otherBank = "Other"; 

  try {
    const buyerRef = collection(db, "transactions");
    // const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);

eventSnapshot.forEach((doc) => {
  const data = doc.data();
  if (data.paymentStatus === "done") {
    const paymentMethod = data.BankId;
    if (paymentMethod) {
      if (!TopBanks.has(paymentMethod) && TopBanks.size < 5) {
        TopBanks.add(paymentMethod);
      }
      const key = TopBanks.has(paymentMethod) ? paymentMethod : otherBank;
      allPaymentMethods[key] = (allPaymentMethods[key] || 0) + 1;
    }
  }
});

    let colorIndex = 0;
    return Object.keys(allPaymentMethods).map((method) => {
      if (!paymentMethodColors[method]) {
        paymentMethodColors[method] =
          adminColorArray[colorIndex % adminColorArray.length];
        colorIndex++;
      }
      return {
        name: method,
        value: allPaymentMethods[method],
        colors: paymentMethodColors[method],
      };
    });
  } catch (error) {
    toast.error("Error fetching payment methods data ", error);
    return [];
  }
};

export const fetchTotalRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);
    let totalRevenue = 0;
    let totalTickets = 0;
    let totalOrders = 0;
    let totalamount = 0;

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      totalTickets += Number(data.tQuantity);
      totalamount += Number(data.Amount);
      totalOrders += 1;
    });
    const totalTicketPrice = totalamount;
    totalRevenue = parseFloat(totalTicketPrice.toFixed(2));
    const ticketsPerOrder = totalTickets / totalOrders;
    const amountPerOrder = totalRevenue / totalOrders;

    return { totalRevenue, ticketsPerOrder, amountPerOrder, totalTickets };
  } catch (error) {
    toast.error("Error fetching data ", error);
    return { totalRevenue: 0, ticketsPerOrder: 0, amountPerOrder: 0 };
  }
};
export const fetchTotalTickgetrRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);
    let totaltRevenue = 0;
    let totalTickets = 0;
    const tickgetrfee = 0.35;
    const nodafee = 0.1;

    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      totalTickets += Number(data.tQuantity);
  
    });
    const totalTicketPrice = (tickgetrfee - nodafee) * totalTickets;
    totaltRevenue = parseFloat(totalTicketPrice.toFixed(2));
    // const ticketsPerOrder = totalTickets / totalOrders;
    // const amountPerOrder = totalRevenue / totalOrders;
    console.log("tota rev",totaltRevenue)
    return {totaltRevenue};
  } catch (error) {
    toast.error("Error fetching data ", error);
    return { totaltRevenue: 0, ticketsPerOrder: 0, amountPerOrder: 0 };
  }
};

export const fetchWeeklyRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);
    let totalWRevenue = 0;
    let weeklyTickets = 0;
    let totalamount = 0;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 7);
    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      if (data.refundAmount == undefined || data.Amount == null) {
        return;
      }
      const orderDate = new Date(data.createdAt.toDate());

      if (orderDate >= startDate && orderDate < endDate) {
        weeklyTickets += Number(data.tQuantity);
        totalamount += Number(data.Amount);
      }
    });
    const weeklyTicketPrice = totalamount;
    totalWRevenue = parseFloat(weeklyTicketPrice.toFixed(2)); // Round to 2 decimal places
    console.log(totalWRevenue,"total week")

    return totalWRevenue;
  } catch (error) {
    toast.error("Error fetching weekly revenue data ", error);
    return 0;
  }
};
export const fetchWeeklyTickgetrRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const eventSnapshot = await getDocs(buyerRef);
   let totalTickgetrWRevenue = 0;
    let weeklyTickets = 0;
    const nodafee = 0.1;
    const tickgetrfee = 0.35;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 7);
    eventSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      if (data.refundAmount == undefined || data.Amount == null) {
        return;
      }
      const orderDate = new Date(data.createdAt.toDate());

      if (orderDate >= startDate && orderDate < endDate) {
        weeklyTickets += Number(data.tQuantity);
      }
    });
    const weeklyTicketPrice = (tickgetrfee-nodafee) * weeklyTickets;
    totalTickgetrWRevenue = parseFloat(weeklyTicketPrice.toFixed(2)); // Round to 2 decimal places
    return totalTickgetrWRevenue;
  } catch (error) {
    toast.error("Error fetching weekly revenue data ", error);
    return 0;
  }
};

export const fetchDailyRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const querySnapshot = await getDocs(buyerRef);

    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0); // Start of current day
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    ); // Start of current week (Sunday)

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7); // End of current week (next Sunday)

    const dailyRevenue = {};
    const dailyTicketCount = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      if (orderDate >= currentWeekStart && orderDate < currentWeekEnd) {
        const dayOfWeek = orderDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const ticketCount = Number(data.tQuantity);
        const ticketPrice = Number(data.Amount);
        const roundedPrice = parseFloat(ticketPrice.toFixed(2));

        if (dailyRevenue[dayOfWeek]) {
          dailyRevenue[dayOfWeek] += roundedPrice;
          dailyTicketCount[dayOfWeek] += ticketCount
        } else {
          dailyRevenue[dayOfWeek] = roundedPrice;
          dailyTicketCount[dayOfWeek] = ticketCount;
        }
      }
    });

    // Round all daily revenues to 2 decimal places
    Object.keys(dailyRevenue).forEach((day) => {
      dailyRevenue[day] = parseFloat(dailyRevenue[day].toFixed(2));
    });

    // Format the data for chart
    const formattedData = Object.keys(dailyRevenue).map((day) => ({
      day,
      revenue: dailyRevenue[day],
      ticket:dailyTicketCount[day],
    }));
    return formattedData;
  } catch (error) {
    toast.error("Error fetching daily revenue data ", error);
    return [];
  }
};
export const fetchDailyTickgetrRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const querySnapshot = await getDocs(buyerRef);
    const nodafee = 0.1;
    const tickgetrfee = 0.35;

    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0); // Start of current day
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    ); // Start of current week (Sunday)

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7); // End of current week (next Sunday)

    const dailyRevenue = {};
    const dailyTicketCount = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      if (orderDate >= currentWeekStart && orderDate < currentWeekEnd) {
        const dayOfWeek = orderDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const ticketCount = Number(data.tQuantity);
        const ticketPrice = (tickgetrfee - nodafee) * ticketCount;
        const roundedPrice = parseFloat(ticketPrice.toFixed(2));

        if (dailyRevenue[dayOfWeek]) {
          dailyRevenue[dayOfWeek] += roundedPrice;
          dailyTicketCount[dayOfWeek] += ticketCount
        } else {
          dailyRevenue[dayOfWeek] = roundedPrice;
          dailyTicketCount[dayOfWeek] = ticketCount;
        }
      }
    });

    // Round all daily revenues to 2 decimal places
    Object.keys(dailyRevenue).forEach((day) => {
      dailyRevenue[day] = parseFloat(dailyRevenue[day].toFixed(2));
    });

    // Format the data for chart
    const formattedData = Object.keys(dailyRevenue).map((day) => ({
      day,
      revenue: dailyRevenue[day],
      ticket:dailyTicketCount[day],
    }));
    return formattedData;
  } catch (error) {
    toast.error("Error fetching daily revenue data ", error);
    return [];
  }
};

export const fetchMonthlyRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const buyerSnapshot = await getDocs(buyerRef);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const monthlyData = {};
    let totalMonthlyRevenue = 0;
    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      const year = orderDate.getFullYear();
      const month = orderDate.toLocaleString("en-US", { month: "short" });
      const ticketCount = Number(data.tQuantity) || 0;
      const ticketPrice = Number(data.Amount) || 0;
      const monthYearKey = `${month}-${year}`;
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = { revenue: 0, totalTickets: 0 };
      }
      // Accumulate revenue and ticket count
      monthlyData[monthYearKey].revenue += ticketPrice;
      monthlyData[monthYearKey].totalTickets += ticketCount;
      if (year === currentYear && orderDate.getMonth() === currentMonth) {
        totalMonthlyRevenue += ticketPrice;
      }
    });
    totalMonthlyRevenue = parseFloat(totalMonthlyRevenue.toFixed(2));

    // Round all revenues to 2 decimal places
    Object.keys(monthlyData).forEach((monthYearKey) => {
      monthlyData[monthYearKey].revenue = parseFloat(
        monthlyData[monthYearKey].revenue.toFixed(2)
      );
    });

    // Generate the last 12 months in the format "Month-Year"
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      months.unshift(`${month}-${year}`);
    }

    // Format the data for the chart
    const formattedData = months.map((monthYearKey) => ({
      month: monthYearKey, // Keep the full "Month-Year" format
      revenue: monthlyData[monthYearKey]?.revenue || 0,
      ticket: monthlyData[monthYearKey]?.totalTickets || 0, // Fixed key name
    }));
    return{formattedData ,totalMonthlyRevenue};
  } catch (error) {
    console.error("Error fetching monthly revenue data: ", error);
    toast.error("Error fetching monthly revenue data");
    return {formattedData:[],totalMonthlyRevenue:0};
  }
};
export const fetchMonthlyTickgetrRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const buyerSnapshot = await getDocs(buyerRef);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const nodafee = 0.1;
    const tickgetrfee = 0.35;
    let   totalTMonthlyRevenue = 0;
    const monthlyData = {};

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      const year = orderDate.getFullYear();
      const month = orderDate.toLocaleString("en-US", { month: "short" });
      const ticketCount = Number(data.tQuantity) || 0;
      const ticketPrice = (tickgetrfee - nodafee ) * ticketCount;
      const monthYearKey = `${month}-${year}`;
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = { revenue: 0, totalTickets: 0 };
      }
      // Accumulate revenue and ticket count
      monthlyData[monthYearKey].revenue += ticketPrice;
      monthlyData[monthYearKey].totalTickets += ticketCount;
      if (year === currentYear && orderDate.getMonth() === currentMonth) {
        totalTMonthlyRevenue += ticketPrice;
      }
    });
    totalTMonthlyRevenue = parseFloat(totalTMonthlyRevenue.toFixed(2));

    // Round all revenues to 2 decimal places
    Object.keys(monthlyData).forEach((monthYearKey) => {
      monthlyData[monthYearKey].revenue = parseFloat(
        monthlyData[monthYearKey].revenue.toFixed(2)
      );
    });

    // Generate the last 12 months in the format "Month-Year"
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      months.unshift(`${month}-${year}`);
    }

    // Format the data for the chart
    const formattedTData = months.map((monthYearKey) => ({
      month: monthYearKey, 
      revenue: monthlyData[monthYearKey]?.revenue || 0,
      ticket: monthlyData[monthYearKey]?.totalTickets || 0,
    }));
    console.log(formattedTData)
    return {formattedTData,totalTMonthlyRevenue: totalTMonthlyRevenue || 0};
  } catch (error) {
    console.error("Error fetching monthly revenue data: ", error);
    toast.error("Error fetching monthly revenue data");
    return {formattedTData:[], totalTMonthlyRevenue:0};
  }
};


export const fetchOverallRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const buyerSnapshot = await getDocs(buyerRef);
    const revenueMap = new Map();

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      const date = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const ticketCount = Number(data.tQuantity);
      const ticketPrice = Number(data.Amount); 

      const roundedPrice = parseFloat(ticketPrice.toFixed(2)); // Round to 2 decimal places

      if (revenueMap.has(date)) {
        const currentRevenue = revenueMap.get(date);
        revenueMap.set(
          date,
          parseFloat((currentRevenue + roundedPrice).toFixed(2))
        );
      } else {
        revenueMap.set(date, roundedPrice);
      }
    });

    const overallRevenue = Array.from(revenueMap, ([date, revenue]) => ({
      date,
      revenue,
    }));
    return overallRevenue;
  } catch (error) {
    toast.error("Error fetching overall revenue data ", error);
    return [];
  }
};
export const fetchOverallTickgetrRev = async () => {
  try {
    const buyerRef = collection(db, "transactions");
    const buyerSnapshot = await getDocs(buyerRef);
    const revenueMap = new Map();
    const nodafee = 0.1;
    const tickgetrfee = 0.35;

    buyerSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus !== "done") return;
      const orderDate = new Date(data.createdAt.toDate());
      const date = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const ticketCount = Number(data.tQuantity);
      const ticketPrice = (tickgetrfee - nodafee ) * ticketCount; // Price per ticket is $0.30

      const roundedPrice = parseFloat(ticketPrice.toFixed(2)); // Round to 2 decimal places

      if (revenueMap.has(date)) {
        const currentRevenue = revenueMap.get(date);
        revenueMap.set(
          date,
          parseFloat((currentRevenue + roundedPrice).toFixed(2))
        );
      } else {
        revenueMap.set(date, roundedPrice);
      }
    });

    const overallRevenue = Array.from(revenueMap, ([date, revenue]) => ({
      date,
      revenue,
    }));
    return overallRevenue;
  } catch (error) {
    toast.error("Error fetching overall revenue data ", error);
    return [];
  }
};
export const fetchTotalEvents = async () => {
  try {
    const eventRef = collection(db, "event");
    const eventSnapshot = await getDocs(eventRef);

    return eventSnapshot.size;
  } catch (error) {
    toast.error("Error fetching total number of events: ", error);
    return 0;
  }
};

export const fetchTotalOrganizers = async () => {
  try {
    const userRef = collection(db, "user");
    const userSnapshot = await getDocs(userRef);

    return userSnapshot.size;
  } catch (error) {
    toast.error("Error fetching total number of users ", error);
    return 0;
  }
};

export const fetchBuyersForEvent = async (eventId) => {
  const buyersQuery = query(
    collection(db, "transactions"),
    where("eventId", "==", eventId)
  );
  const buyersSnapshot = await getDocs(buyersQuery);
  return buyersSnapshot.docs.map((doc) => doc.data());
};

export const deleteUserCollections = async (userId) => {
  const collections = ["user", "event"];
  let success = true;

  for (const collectionName of collections) {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    try {
      await batch.commit();
      // toast.success(Collection ${collectionName} deleted successfully);
    } catch (error) {
      toast
        .error
        // Error deleting collection ${collectionName}: ${error.message}
        ();
      success = false;
    }
  }

  return success;
};

export const deleteUserAccount = async (user) => {
  if (!user) {
    toast.error("No user is currently signed in.");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      prompt("Please enter your password to proceed with account deletion:")
    );
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      toast.error(
        "Session expired. Please log in again to delete your account."
      );
      return false;
    }
    toast.error("Error validating session: " + error.message);
    return false;
  }

  try {
    const response = await deleteUserCollections(user.uid);
    if (response) {
      try {
        await user.delete();
        toast.success("User account deleted successfully.");
        await signOutUser(user);
      } catch (error) {
        toast.error("Error deleting user!", error);
      }
    } else {
      alert(
        "Error deleting user events. Please delete events before deleting the account!",
        response.error
      );
    }
  } catch (error) {
    toast.error("Error deleting user data", error);
  }
};
