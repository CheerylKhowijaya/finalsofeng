import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Login: validates email + password, returns user info + role.
 * Frontend stores this in React state / localStorage.
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("Email tidak terdaftar");
    if (user.password !== password) throw new Error("Password salah");

    // If trainer, get trainerId
    let trainerId: string | null = null;
    if (user.role === "trainer") {
      const trainer = await ctx.db
        .query("trainers")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();
      trainerId = trainer?._id ?? null;
    }

    // If member, get memberId
    let memberId: string | null = null;
    if (user.role === "member") {
      const member = await ctx.db
        .query("members")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();
      memberId = member?._id ?? null;
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      initials: user.initials,
      trainerId,
      memberId,
    };
  },
});

/**
 * Register: creates a new member user + member profile.
 * Only for member role (trainers & admins are seeded).
 */
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    targetWeight: v.number(),
    gender: v.union(v.literal("Perempuan"), v.literal("Laki-laki")),
  },
  handler: async (ctx, { name, email, password, targetWeight, gender }) => {
    // Check duplicate email
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) throw new Error("Email sudah terdaftar");

    const initials = name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    const userId = await ctx.db.insert("users", {
      name,
      email,
      password,
      role: "member",
      initials,
      createdAt: Date.now(),
    });

    const now = new Date();
    const joinDate = `${now.toLocaleString("id-ID", { month: "short" })} ${now.getFullYear()}`;

    const memberId = await ctx.db.insert("members", {
      userId,
      name,
      email,
      targetWeight,
      currentWeight: targetWeight, // Set weight as the one entered during registration
      height: 170,
      gender,
      streak: 0,
      totalSessions: 0,
      joinDate,
      status: "Aktif",
      dailyTarget: 0,
      bestStreak: 0,
    });

    return { userId, memberId, name, role: "member" as const, initials };
  },
});

/**
 * Get user profile by userId (for restoring session from localStorage).
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    let trainerId: string | null = null;
    let memberId: string | null = null;

    if (user.role === "trainer") {
      const trainer = await ctx.db
        .query("trainers")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      trainerId = trainer?._id ?? null;
    }
    if (user.role === "member") {
      const member = await ctx.db
        .query("members")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      memberId = member?._id ?? null;
    }

    return { userId: user._id, name: user.name, email: user.email, role: user.role, initials: user.initials, trainerId, memberId };
  },
});
