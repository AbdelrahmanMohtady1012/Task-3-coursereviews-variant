import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, uppercase: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// one review per student per course
reviewSchema.index({ courseCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
