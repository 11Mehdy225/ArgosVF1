import mongoose from "mongoose";

const bilanMonthSchema = new mongoose.Schema({
  month: String,  // exemple : "Mai 2025"
  revenue: {
    type: Number,
    default: 0,
  },
});

const BilanMonth = mongoose.model("BilanMonth", bilanMonthSchema);
export default BilanMonth;
