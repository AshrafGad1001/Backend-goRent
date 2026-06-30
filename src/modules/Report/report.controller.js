import User from "../../DB/Models/user.model.js";
import Property from "../../DB/Models/property.model.js";
import Booking from "../../DB/Models/booking.model.js";
import Dispute from "../../DB/Models/dispute.model.js";
import Review from "../../DB/Models/review.model.js";

export const getPlatformReport = async (req,res,next) =>{
    try {
        const [userStats, propertyStats, bookingStats, disputeStats, reviewStats] = await Promise.all([
            User.aggregate([{
                $facet: {
                    total: [{ $count: "count" }],
                    owners: [{ $match: { role: "owner" } }, { $count: "count" }],
                    tenants: [{ $match: { role: "tenant" } }, { $count: "count" }]
                }
            }]),
            Property.aggregate([{
                $facet: {
                    total: [{ $count: "count" }],
                    approved: [{ $match: { status: "APPROVED" } }, { $count: "count" }],
                    pending: [{ $match: { status: "PENDING" } }, { $count: "count" }]
                }
            }]),
            Booking.aggregate([{
                $match: { status: { $ne: "CANCELLED" } }
            }, {
                $facet: {
                    general: [
                        { $group: { _id: null, totalBookings: { $sum: 1 }, totalRevenue: { $sum: "$amountPaid" } } }
                    ],
                    topProperties: [
                        { $group: { _id: "$propertyId", bookings: { $sum: 1 }, revenue: { $sum: "$amountPaid" } } },
                        { $sort: { revenue: -1 } },
                        { $limit: 5 },
                        { $lookup: { from: "properties", localField: "_id", foreignField: "_id", as: "property" } },
                        { $unwind: "$property" },
                        { $project: { _id: 0, title: "$property.title", bookings: 1, revenue: 1 } }
                    ]
                }
            }]),
            Dispute.aggregate([{
                $facet: {
                    open: [{ $match: { status: { $in: ["OPEN", "IN_REVIEW"] } } }, { $count: "count" }],
                    resolved: [{ $match: { status: { $in: ["RESOLVED", "REJECTED"] } } }, { $count: "count" }]
                }
            }]),
            Review.aggregate([{
                $facet: {
                    total: [{ $count: "count" }],
                    negative: [{ $match: { rating: { $lte: 2 } } }, { $count: "count" }],
                    averageAgg: [{ $group: { _id: null, average: { $avg: "$rating" } } }]
                }
            }])
        ]);

        const totalUsers = userStats[0]?.total[0]?.count || 0;
        const totalOwners = userStats[0]?.owners[0]?.count || 0;
        const totalTenants = userStats[0]?.tenants[0]?.count || 0;

        const totalProperties = propertyStats[0]?.total[0]?.count || 0;
        const approvedProperties = propertyStats[0]?.approved[0]?.count || 0;
        const pendingProperties = propertyStats[0]?.pending[0]?.count || 0;

        const totalBookings = bookingStats[0]?.general[0]?.totalBookings || 0;
        const totalRevenue = bookingStats[0]?.general[0]?.totalRevenue || 0;
        const topPropertiesAgg = bookingStats[0]?.topProperties || [];

        const openDisputes = disputeStats[0]?.open[0]?.count || 0;
        const resolvedDisputes = disputeStats[0]?.resolved[0]?.count || 0;

        const totalReviews = reviewStats[0]?.total[0]?.count || 0;
        const negativeReviews = reviewStats[0]?.negative[0]?.count || 0;
        const rawAverage = reviewStats[0]?.averageAgg[0]?.average || 0;
        const averageRating = rawAverage ? Math.round(rawAverage * 10) / 10 : 0;

        return res.status(200).json({
            report:{
            totalUsers,
            totalOwners,
            totalTenants,
            totalProperties,
            approvedProperties,
            pendingProperties,
            totalBookings,
            totalRevenue,
            openDisputes,
            resolvedDisputes,
            averageRating,
            topProperties: topPropertiesAgg,
            totalReviews,
            negativeReviews,
        }
        })

    }
    catch (error) {return next(error)}
}
