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

export { beforeUpload };
