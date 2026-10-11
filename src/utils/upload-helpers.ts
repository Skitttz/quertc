import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";

type UploadCallbacks = {
  onProgress?: (progress: number) => void;
  onError?: (error: unknown) => void;
};

type UploadOptions = {
  path: string;
  file: File;
};

const MAX_IMAGE_SIZE_MB = 2;

const getUploadError = (file: File) => {
  if (!file.type.startsWith("image/")) {
    return "Apenas imagens são permitidas.";
  }

  if (file.size / 1024 / 1024 >= MAX_IMAGE_SIZE_MB) {
    return `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
};

const uploadFileToFirebase = (
  { path, file }: UploadOptions,
  callbacks?: UploadCallbacks,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        callbacks?.onProgress?.(Math.round(progress));
      },
      (error) => {
        callbacks?.onError?.(error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      },
    );
  });
};

export { getUploadError, uploadFileToFirebase };
