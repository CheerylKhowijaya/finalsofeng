import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get member profile by their document ID. */
export const getMemberById = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    return await ctx.db.get(memberId);
  },
});

/** Get member profile by their userId. */
export const getMemberByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

/** Get all members — admin only. */
export const getAllMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("members").collect();
  },
});

/** Increment member streak by 1. */
export const updateMemberStreak = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    const member = await ctx.db.get(memberId);
    if (!member) throw new Error("Member not found");
    await ctx.db.patch(memberId, { streak: member.streak + 1 });
  },
});

/** Reset member streak to 0. */
export const resetStreak = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    await ctx.db.patch(memberId, { streak: 0 });
  },
});

/** Add a new weight record entry for a member. */
export const addWeightRecord = mutation({
  args: {
    memberId: v.id("members"),
    weight: v.number(),
    recordedAt: v.string(),
  },
  handler: async (ctx, { memberId, weight, recordedAt }) => {
    // Update current weight on member profile too
    await ctx.db.patch(memberId, { currentWeight: weight });
    return await ctx.db.insert("weightHistory", {
      memberId,
      weight,
      recordedAt,
      timestamp: Date.now(),
    });
  },
});

/** Get all weight records for a member — for Progress chart. */
export const getWeightHistory = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    return await ctx.db
      .query("weightHistory")
      .withIndex("by_member", (q) => q.eq("memberId", memberId))
      .order("asc")
      .collect();
  },
});

/** Update member status (admin action). */
export const updateMemberStatus = mutation({
  args: {
    memberId: v.id("members"),
    status: v.union(v.literal("Aktif"), v.literal("Nonaktif")),
  },
  handler: async (ctx, { memberId, status }) => {
    await ctx.db.patch(memberId, { status });
  },
});
