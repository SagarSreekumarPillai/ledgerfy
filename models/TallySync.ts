// FILE: /models/TallySync.ts
import mongoose from "mongoose";

const TallySyncSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", index: true },
  fileName: String,
  fileType: { type: String, enum: ["csv", "xml", "excel"] },
  status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
  totalRows: Number,
  processedRows: Number,
  skippedRows: Number,
  errorRows: Number,
  errors: [{
    row: Number,
    field: String,
    message: String,
    value: String
  }],
  accountMapping: mongoose.Schema.Types.Mixed, // Custom account mapping for this client
  startedAt: Date,
  completedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  report: {
    anomalies: [String],
    duplicates: [String],
    missingCounterparts: [String]
  }
}, {
  timestamps: true
});

// Indexes for performance
TallySyncSchema.index({ firmId: 1, clientId: 1, createdAt: -1 });
TallySyncSchema.index({ status: 1 });

export default mongoose.models.TallySync || mongoose.model("TallySync", TallySyncSchema);
