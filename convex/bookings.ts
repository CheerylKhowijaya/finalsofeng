import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new booking — always starts as "pending".
 * Called when member confirms a booking in step 3.
 */
export const createBooking = mutation({
  args: {
    memberId: v.id("members"),
    trainerId: v.id("trainers"),
    memberName: v.string(),
    memberInitials: v.string(),
    trainerName: v.string(),
    specialty: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    return bookingId;
  },
});

/**
 * Update booking status — trainer accepts/rejects, or admin overrides.
 * @param status "confirmed" | "rejected"
 */
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("confirmed"), v.literal("rejected")),
  },
  handler: async (ctx, { bookingId, status }) => {
    await ctx.db.patch(bookingId, {
      status,
      updatedAt: Date.now(),
    });

    // If confirmed, increment trainer confirmed session count
    if (status === "confirmed") {
      const booking = await ctx.db.get(bookingId);
      if (booking) {
        const trainer = await ctx.db.get(booking.trainerId);
        if (trainer && trainer.slots > 0) {
          await ctx.db.patch(booking.trainerId, { slots: trainer.slots - 1 });
        }
        // Increment member totalSessions
        const member = await ctx.db.get(booking.memberId);
        if (member) {
          await ctx.db.patch(booking.memberId, {
            totalSessions: member.totalSessions + 1,
          });
        }
      }
    }
    return { success: true };
  },
});

/**
 * Get all bookings for a specific member (real-time subscription).
 */
export const getBookingsByMember = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_member", (q) => q.eq("memberId", memberId))
      .order("desc")
      .collect();
  },
});

/**
 * Get all bookings for a trainer — used in TrainerDashboard.
 */
export const getBookingsByTrainer = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, { trainerId }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_trainer", (q) => q.eq("trainerId", trainerId))
      .order("desc")
      .collect();
  },
});

/**
 * Get ALL bookings — for admin dashboard.
 */
export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

/**
 * Count pending bookings for a trainer — used for notification badge.
 */
export const getPendingCount = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, { trainerId }) => {
    const pending = await ctx.db
      .query("bookings")
      .withIndex("by_trainer", (q) => q.eq("trainerId", trainerId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
    return pending.length;
  },
});
