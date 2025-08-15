import mongoose, { Schema } from "mongoose";

const mediaViewLogSchema = new Schema(
    {
        media_id: {
            type: Schema.Types.ObjectId,
            ref: "MediaAsset",
            required: true,
            index: true
        },
        viewed_by_ip: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Compound indexes for efficient queries
mediaViewLogSchema.index({ media_id: 1, timestamp: -1 });
mediaViewLogSchema.index({ viewed_by_ip: 1, timestamp: -1 });
mediaViewLogSchema.index({ timestamp: -1 });

// TTL index to automatically delete old logs after 90 days
mediaViewLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const MediaViewLog = mongoose.model("MediaViewLog", mediaViewLogSchema);
