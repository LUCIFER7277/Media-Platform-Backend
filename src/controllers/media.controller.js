import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { MediaAsset } from "../models/mediaAsset.model.js";
import { MediaViewLog } from "../models/mediaViewLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";

//this method is used to upload the media to the cloudinary
const uploadMedia = asyncHandler(async (req, res) => {
    const { title, type } = req.body;

    if (!title || !type) {
        throw new ApiError(400, "Title and type are required");
    }

    if (!['video', 'audio'].includes(type.toLowerCase())) {
        throw new ApiError(400, "Type must be either 'video' or 'audio'");
    }

    // Check if media file is provided
    const mediaLocalPath = req.file?.path;

    if (!mediaLocalPath) {
        throw new ApiError(400, "Media file is required");
    }

    // Upload to cloudinary
    const uploadedMedia = await uploadOnCloudinary(mediaLocalPath);

    if (!uploadedMedia) {
        throw new ApiError(400, "Media upload failed");
    }

    // Create media asset record
    const mediaAsset = await MediaAsset.create({
        title: title.trim(),
        type: type.toLowerCase(),
        file_url: uploadedMedia.url,
        public_id: uploadedMedia.public_id,
        uploaded_by: req.admin._id
    });

    const createdMedia = await MediaAsset.findById(mediaAsset._id)
        .populate("uploaded_by", "email")
        .select("-__v");

    if (!createdMedia) {
        throw new ApiError(500, "Something went wrong while creating media record");
    }

    return res.status(201).json(
        new ApiResponse(200, createdMedia, "Media uploaded successfully")
    );
});

//this method is used to generate a stream url for the media
const generateStreamUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Media ID is required");
    }

    // Find media asset
    const mediaAsset = await MediaAsset.findById(id);

    if (!mediaAsset) {
        throw new ApiError(404, "Media not found");
    }

    // Get client IP
    const clientIP = req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        '127.0.0.1';

    // Log the view
    await MediaViewLog.create({
        media_id: mediaAsset._id,
        viewed_by_ip: clientIP
    });

    // Generate secure streaming URL (valid for 10 minutes)
    const expirationTime = Math.floor(Date.now() / 1000) + (10 * 60); // 10 minutes from now
    const secretKey = process.env.STREAM_SECRET;

    // Create signature for the URL
    const dataToSign = `${mediaAsset._id}${expirationTime}${clientIP}`;
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(dataToSign)
        .digest('hex');

    // Construct secure streaming URL
    const baseUrl = 'http://localhost:8000';
    const streamUrl = `${baseUrl}/api/v1/media/stream/${mediaAsset._id}?exp=${expirationTime}&sig=${signature}&ip=${encodeURIComponent(clientIP)}`;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                stream_url: streamUrl,
                expires_at: new Date(expirationTime * 1000).toISOString(),
                valid_for: "10 minutes"
            },
            "Secure streaming URL generated successfully"
        )
    );
});

//this method is used to stream the media
const streamMedia = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { exp, sig, ip } = req.query;

    if (!exp || !sig || !ip) {
        throw new ApiError(400, "Invalid streaming URL");
    }

    // Check if URL has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (parseInt(exp) < currentTime) {
        throw new ApiError(410, "Streaming URL has expired");
    }

    // Verify signature
    const secretKey = process.env.STREAM_SECRET;
    const dataToSign = `${id}${exp}${decodeURIComponent(ip)}`;
    const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(dataToSign)
        .digest('hex');

    if (sig !== expectedSignature) {
        throw new ApiError(403, "Invalid streaming URL signature");
    }

    // Find media asset
    const mediaAsset = await MediaAsset.findById(id);

    if (!mediaAsset) {
        throw new ApiError(404, "Media not found");
    }

    // Redirect to the actual file URL (or serve the file directly)
    return res.redirect(mediaAsset.file_url);
});

//this method is used to log the media view
const logMediaView = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Media ID is required");
    }

    // Check if media exists
    const mediaAsset = await MediaAsset.findById(id);

    if (!mediaAsset) {
        throw new ApiError(404, "Media not found");
    }

    // Get client IP
    const clientIP = req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        '127.0.0.1';

    // Log the view
    const viewLog = await MediaViewLog.create({
        media_id: mediaAsset._id,
        viewed_by_ip: clientIP
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                message: "View logged successfully",
                media_id: mediaAsset._id,
                timestamp: viewLog.createdAt
            },
            "Media view recorded"
        )
    );
});

//this method is used to get the media analytics
const getMediaAnalytics = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Media ID is required");
    }

    // Check if media exists
    const mediaAsset = await MediaAsset.findById(id);

    if (!mediaAsset) {
        throw new ApiError(404, "Media not found");
    }

    try {
        // Get total views
        const totalViews = await MediaViewLog.countDocuments({ media_id: id });

        // Get unique IPs
        const uniqueIPs = await MediaViewLog.distinct('viewed_by_ip', { media_id: id });
        const uniqueIPsCount = uniqueIPs.length;

        // Get views per day aggregation
        const viewsPerDay = await MediaViewLog.aggregate([
            {
                $match: { media_id: mediaAsset._id }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Format views per day as object
        const viewsPerDayFormatted = {};
        viewsPerDay.forEach(item => {
            viewsPerDayFormatted[item._id] = item.count;
        });

        // Additional analytics
        const recentViews = await MediaViewLog.find({ media_id: id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('viewed_by_ip createdAt');

        const analytics = {
            total_views: totalViews,
            unique_ips: uniqueIPsCount,
            views_per_day: viewsPerDayFormatted,
            recent_views: recentViews,
            media_info: {
                title: mediaAsset.title,
                type: mediaAsset.type,
                created_at: mediaAsset.createdAt
            }
        };

        return res.status(200).json(
            new ApiResponse(200, analytics, "Media analytics retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Error retrieving analytics data");
    }
});

export {
    uploadMedia,
    generateStreamUrl,
    streamMedia,
    logMediaView,
    getMediaAnalytics
};
