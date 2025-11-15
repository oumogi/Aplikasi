import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "./firebase";

interface ProfileUpdates {
    displayName?: string;
    photoFile?: File | null; // null means delete
}

export const updateUserProfile = async (updates: ProfileUpdates): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    const updatesForAuth: { displayName?: string; photoURL?: string } = {};

    if (updates.displayName && updates.displayName !== user.displayName) {
        updatesForAuth.displayName = updates.displayName;
    }

    if (updates.photoFile) { // If a new file is provided
        const photoPath = `user_uploads/${user.uid}/profile_picture`;
        const photoRef = ref(storage, photoPath);
        await uploadBytes(photoRef, updates.photoFile);
        const downloadURL = await getDownloadURL(photoRef);
        updatesForAuth.photoURL = downloadURL;
    } else if (updates.photoFile === null) { // If null, it's a request to delete
        const photoPath = `user_uploads/${user.uid}/profile_picture`;
        const photoRef = ref(storage, photoPath);
        try {
            await deleteObject(photoRef);
        } catch (error: any) {
            // Ignore if file doesn't exist
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting profile photo:", error);
            }
        }
        updatesForAuth.photoURL = ""; // Firebase Auth uses empty string to remove
    }

    // Update Firebase Auth profile
    if (Object.keys(updatesForAuth).length > 0) {
        await updateProfile(user, updatesForAuth);
    }
};