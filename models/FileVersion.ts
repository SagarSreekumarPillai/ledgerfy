// FILE: /models/FileVersion.ts
import mongoose from "mongoose";

const FileVersionSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", index: true },
  version: Number,
  storageKey: String,
  size: Number,
  checksum: String,
  notes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for performance
FileVersionSchema.index({ documentId: 1, version: 1 }, { unique: true });
FileVersionSchema.index({ storageKey: 1 });

export default mongoose.models.FileVersion || mongoose.model("FileVersion", FileVersionSchema);
