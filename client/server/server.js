// server/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件设置
app.use(cors());
app.use(bodyParser.json());

// 创建上传文件的目录
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("创建了 uploads 文件夹");
} else {
  console.log("uploads 文件夹已存在");
}

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 使用绝对路径存储文件
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 文件名
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xls/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("只允许上传Excel文件"));
    }
  },
});

// 上传路由
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("收到的文件信息:", req.file); // 输出文件信息
  console.log("请求头:", req.headers); // 输出请求头
  if (!req.file) {
    console.error("没有文件被上传");
    return res.status(400).json({ message: "没有文件被上传" });
  }
  try {
    res.json({ message: "文件上传成功", filePath: req.file.path });
  } catch (error) {
    console.error("上传失败的错误信息:", error);
    res.status(500).json({ message: "文件上传失败" });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
