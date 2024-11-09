import { auth, clerkClient } from "@clerk/nextjs/server";
const { subtle } = crypto;
import bcrypt from "bcrypt";

export async function setEncryptionKey(encryptionKey: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    await clerkClient().users.updateUserMetadata(userId, {
      privateMetadata: {
        encryptionKey: encryptionKey,
      },
    });
    console.log("Encryption key set successfully");
  } catch (error) {
    console.error("Error setting encryption key:", error);
    throw error;
  }
}

export async function getEncryptionKey() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const user = await clerkClient().users.getUser(userId);
    return user.privateMetadata.encryptionKey as string | undefined;
  } catch (error) {
    console.error("Error retrieving encryption key:", error);
    throw error;
  }
}

export async function getOrCreateEncryptionKey() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getEncryptionKey();

  // it should already be set on sign up, but just adding a check here just in case
  if (!encryptionKey) {
    const newEncryptionKey = generateSecureKey(); // Generate a secure encryption key
    await setEncryptionKey(newEncryptionKey);
    return newEncryptionKey;
  } else {
    return encryptionKey;
  }
}

export const generateApiKey = () => {
  const length = 32;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let apiKey = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
export function generateSecureKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32)); // Generate a random key
  return Buffer.from(key).toString("base64"); // Encode to base64 for storage
}
export async function encrypt(text: string, key: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV for AES-GCM
  const keyUint8Array = new Uint8Array(Buffer.from(key, "base64"));
  const cryptoKey = await subtle.importKey(
    "raw",
    keyUint8Array,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const encryptedData = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    encoder.encode(text)
  );
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  return Buffer.from(combined).toString("base64"); // Return as base64-encoded string
}
export async function decrypt(
  ciphertext: string,
  key: string
): Promise<string> {
  try {
    const data = Buffer.from(ciphertext, "base64");
    if (data.length <= 12) {
      throw new Error("Ciphertext is too short");
    }
    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);
    const keyUint8Array = new Uint8Array(Buffer.from(key, "base64"));
    const cryptoKey = await subtle.importKey(
      "raw",
      keyUint8Array,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const decrypted = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      encryptedData
    );
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}


// Function to hash the API key
export async function hashApiKey(apiKey: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(apiKey, saltRounds);
}