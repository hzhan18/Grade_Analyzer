// client/src/components/UploadFile.js
import React, { useState } from "react";
import axios from "axios";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // 处理文件选择
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 处理文件上传
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("请选择一个文件！");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 使用完整的后端地址确保代理问题不影响上传
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("文件上传失败:", error);
      setMessage("文件上传失败");
    }
  };

  return (
    <div>
      <h2>上传 Excel 文件</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">上传</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadFile;
