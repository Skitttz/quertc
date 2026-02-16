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

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("Apenas imagens são permitidas");
    return false;
  }

  const isLt2MB = file.size / 1024 / 1024 < 2;
  if (!isLt2MB) {
    alert("A imagem deve ter no máximo 2MB");
    return false;
  }

  return true;
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

export { beforeUpload, uploadFileToFirebase };
