import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get all achievements for a member (unlocked + locked). */
export const getAchievements = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_member", (q) => q.eq("memberId", memberId))
      .collect();
  },
});

/** Unlock a specific achievement for a member. */
export const unlockAchievement = mutation({
  args: { achievementId: v.id("achievements") },
  handler: async (ctx, { achievementId }) => {
    const now = new Date().toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
    await ctx.db.patch(achievementId, {
      isUnlocked: true,
      progress: 100,
      unlockedAt: now,
    });
  },
});

/** Update achievement progress (0–100). */
export const updateAchievementProgress = mutation({
  args: {
    achievementId: v.id("achievements"),
    progress: v.number(),
  },
  handler: async (ctx, { achievementId, progress }) => {
    await ctx.db.patch(achievementId, { progress });
    if (progress >= 100) {
      const now = new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      });
      await ctx.db.patch(achievementId, { isUnlocked: true, unlockedAt: now });
    }
  },
});

/** Seed default achievements for a new member. */
export const seedMemberAchievements = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, { memberId }) => {
    const defaults = [
      // Unlocked
      { icon: "🏆", title: "Konsisten",    desc: "30 hari berturut-turut", color: "green", isUnlocked: true,  progress: 100, unlockedAt: "15 Mar 2025" },
      { icon: "💪", title: "Power Lifter", desc: "Squat 100kg",            color: "pink",  isUnlocked: true,  progress: 100, unlockedAt: "2 Apr 2025"  },
      { icon: "🔥", title: "On Fire",      desc: "7 hari streak",          color: "pink",  isUnlocked: true,  progress: 100, unlockedAt: "20 Apr 2025" },
      { icon: "⚡", title: "Early Bird",   desc: "10 sesi jam 6 pagi",     color: "green", isUnlocked: true,  progress: 100, unlockedAt: "10 Apr 2025" },
      // Locked
      { icon: "🎯", title: "Goal Achieved",desc: "Capai berat target",     color: "pink",  isUnlocked: false, progress: 78  },
      { icon: "🥇", title: "Century",      desc: "48/100 sesi selesai",    color: "green", isUnlocked: false, progress: 48  },
      { icon: "🦅", title: "Iron Will",    desc: "12/60 hari streak",      color: "pink",  isUnlocked: false, progress: 20  },
      { icon: "👑", title: "Elite",        desc: "1/12 bulan aktif",       color: "green", isUnlocked: false, progress: 8   },
    ];
    for (const a of defaults) {
      await ctx.db.insert("achievements", { memberId, ...a });
    }
  },
});
