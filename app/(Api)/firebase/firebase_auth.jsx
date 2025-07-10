import {
  getAuth,
  updateEmail,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updatePassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/(Api)/firebase/firebase";
import toast from "react-hot-toast";

const firebaseAuth = getAuth();

export const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    toast.success("Signed in successfully!");
    return result;
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request") {
      return false;
    } else if (error.code === "auth/popup-closed-by-user") {
      return false;
    } else {
      toast.error(`Error during sign-in: ${error.message}`);
    }
  }
};

export const updateUserEmail = async (
  currentEmail,
  currentPassword,
  newEmail
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      currentEmail,
      currentPassword
    );
    const user = userCredential.user;

    await sendEmailVerification(user, { url: window.location.href });

    alert(
      "A verification email has been sent to the new email address. Please verify it to complete the update."
    );

    const checkVerification = async () => {
      await user.reload();
      return user.emailVerified;
    };

    const interval = setInterval(async () => {
      const isVerified = await checkVerification();
      if (isVerified) {
        clearInterval(interval);

        await updateEmail(user, newEmail);

        const userDocRef = doc(db, "user", user.uid);
        await updateDoc(userDocRef, { uEmail: newEmail });
        toast.success("User email updated successfully");
      }
    }, 3000);
  } catch (error) {
    toast.error(`Error updating user email: ${error.message}`);
  }
};

export const updateUserPassword = async (
  currentEmail,
  currentPassword,
  newPassword
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      currentEmail,
      currentPassword
    );
    const user = userCredential.user;

    await updatePassword(user, newPassword);

    toast.success("Password successfully updated!");
    return true;
  } catch (error) {
    toast.error(`Failed to update password: ${error.message}`);
    return false;
  }
};

export const signOutUser = async (user) => {
  const auth = getAuth();

  try {
    await signOut(auth);
    toast.success("Successfully logged out");
  } catch (error) {
    toast.error(`Failed to logout: ${error.message}`);
    throw error;
  }
};

export const forgetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
