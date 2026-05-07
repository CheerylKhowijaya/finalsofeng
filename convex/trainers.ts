import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get all active trainers — for Booking screen trainer selection. */
export const getAllTrainers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("trainers")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/** Get trainer profile by their userId — for logged-in trainer. */
export const getTrainerByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("trainers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

/** Get trainer stats: total confirmed clients, sessions, rating. */
export const getTrainerStats = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, { trainerId }) => {
    const trainer = await ctx.db.get(trainerId);
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_trainer", (q) => q.eq("trainerId", trainerId))
      .collect();
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    return {
      totalClients: confirmed.length,
      totalSessions: confirmed.length,
      rating: trainer?.rating ?? 0,
      pendingCount: bookings.filter((b) => b.status === "pending").length,
    };
  },
});

/** Get time slots for a trainer on a given day. */
export const getTimeSlots = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, { trainerId }) => {
    return await ctx.db
      .query("timeSlots")
      .withIndex("by_trainer", (q) => q.eq("trainerId", trainerId))
      .collect();
  },
});

/** Update trainer slot availability. */
export const updateTrainerSlots = mutation({
  args: { trainerId: v.id("trainers"), slots: v.number() },
  handler: async (ctx, { trainerId, slots }) => {
    await ctx.db.patch(trainerId, { slots });
  },
});
