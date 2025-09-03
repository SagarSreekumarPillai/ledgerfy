// FILE: /models/Notification.ts
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  type: { type: String, enum: ["info", "warning", "error", "success"] },
  title: String,
  message: String,
  category: { type: String, enum: ["compliance", "task", "document", "system", "ledger"] },
  read: { type: Boolean, default: false },
  actionUrl: String, // Deep link to relevant page
  metadata: mongoose.Schema.Types.Mixed, // Additional context data
  expiresAt: Date, // Auto-cleanup old notifications
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});

// Indexes for performance
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ firmId: 1, category: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
