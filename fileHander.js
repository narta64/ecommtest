import { storage, database } from "./firebaseConfig.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push, set } from "firebase/database";

export async function uploadFile(userId, file, description) {
    const filePath = `documents/${userId}/${file.name}`;
    const fileRef = storageRef(storage, filePath);

    try {
        // Upload file to Firebase Storage
        await uploadBytes(fileRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(fileRef);

        // Save metadata to Firebase Database
        const metadataRef = dbRef(database, `files/${userId}`);
        const newMetadataRef = push(metadataRef);

        await set(newMetadataRef, {
            fileName: file.name,
            description: description,
            url: downloadURL,
            uploadedAt: new Date().toISOString()
        });

        console.log("File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}
