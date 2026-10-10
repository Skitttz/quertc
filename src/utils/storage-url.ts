const FIREBASE_STORAGE_HOST = "firebasestorage.googleapis.com";

const isFirebaseStorageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === FIREBASE_STORAGE_HOST;
  } catch {
    return false;
  }
};

export { isFirebaseStorageUrl };
