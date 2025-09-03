// FILE: /models/LedgerEntry.ts
import mongoose from "mongoose";

const LedgerEntrySchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", index: true },
  date: Date,
  account: String,
  particulars: String,
  debit: Number,
  credit: Number,
  balance: Number,
  source: { type: String, enum: ["manual", "tally", "import"] },
  flags: [{ type: String }], // e.g., "anomaly:amount_outlier"
  linkedDocumentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: Date
}, {
  timestamps: true
});

// Compound indexes for performance
LedgerEntrySchema.index({ firmId: 1, clientId: 1, date: 1 });
LedgerEntrySchema.index({ firmId: 1, account: 1 });
LedgerEntrySchema.index({ firmId: 1, flags: 1 });

export default mongoose.models.LedgerEntry || mongoose.model("LedgerEntry", LedgerEntrySchema);
