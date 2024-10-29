// UploadFile.js
import React, { useState } from "react";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("请选择一个文件");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(`文件上传成功！路径：${result.filePath}`);
      } else {
        const errorResult = await response.json();
        setUploadStatus(`文件上传失败：${errorResult.message}`);
      }
    } catch (error) {
      setUploadStatus(`文件上传失败：${error.message}`);
    }
  };

  return (
    <div>
      <h3>选择上传文件</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>上传</button>
      <p>{uploadStatus}</p>
    </div>
  );
}

export default UploadFile;
