import mongoose, { Schema } from "mongoose";

const mediaAssetSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: ['video', 'audio'],
            lowercase: true
        },
        file_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

mediaAssetSchema.index({ title: 'text' });
mediaAssetSchema.index({ type: 1, createdAt: -1 });

export const MediaAsset = mongoose.model("MediaAsset", mediaAssetSchema);
