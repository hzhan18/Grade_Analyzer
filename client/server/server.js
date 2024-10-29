const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const XLSX = require("xlsx"); // 引入 xlsx 包

const app = express();
const PORT = process.env.PORT || 5001;

// 跨域支持
app.use(cors());

// 确保存在上传文件夹
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created 'uploads' directory");
}

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// 路由：上传文件
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.error("No file provided");
    return res.status(400).json({ message: "No file provided" });
  }
  try {
    // 读取上传的 .xlsx 文件
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // 读取第一个工作表
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet); // 将工作表转换为 JSON 格式

    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
      data, // 返回解析后的数据
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed due to server error" });
  }
});

// 静态提供上传文件
app.use("/uploads", express.static(uploadDir));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
