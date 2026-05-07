import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /** All platform users: member, trainer, admin */
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("member"), v.literal("trainer"), v.literal("admin")),
    initials: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  /** Trainer profiles (linked to users) */
  trainers: defineTable({
    userId: v.id("users"),
    name: v.string(),
    specialty: v.string(),
    rating: v.number(),
    slots: v.number(),
    reviews: v.number(),
    initials: v.string(),
    bio: v.string(),
    isActive: v.boolean(),
  }).index("by_userId", ["userId"]),

  /** Member profiles (linked to users) */
  members: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    targetWeight: v.number(),
    currentWeight: v.number(),
    height: v.number(),
    gender: v.union(v.literal("Perempuan"), v.literal("Laki-laki")),
    streak: v.number(),
    totalSessions: v.number(),
    joinDate: v.string(),
    status: v.union(v.literal("Aktif"), v.literal("Nonaktif")),
  }).index("by_userId", ["userId"]),

  /** Booking sessions — core table linking member ↔ trainer */
  bookings: defineTable({
    memberId: v.id("members"),
    trainerId: v.id("trainers"),
    memberName: v.string(),
    memberInitials: v.string(),
    trainerName: v.string(),
    specialty: v.string(),
    date: v.string(),
    time: v.string(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("rejected")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_member", ["memberId"])
    .index("by_trainer", ["trainerId"])
    .index("by_status", ["status"]),

  /** Weekly workout schedule per member */
  workoutSchedules: defineTable({
    memberId: v.id("members"),
    day: v.string(),
    date: v.number(),
    workout: v.string(),
    intensity: v.union(v.literal("Hard"), v.literal("Medium"), v.literal("Rest")),
    done: v.boolean(),
    weekStart: v.string(),
  }).index("by_member_week", ["memberId", "weekStart"]),

  /** Exercises inside a workout schedule day */
  exercises: defineTable({
    scheduleId: v.id("workoutSchedules"),
    name: v.string(),
    muscle: v.string(),
    sets: v.string(),
    kal: v.number(),
    order: v.number(),
  }).index("by_schedule", ["scheduleId"]),

  /** Weight tracking history per member */
  weightHistory: defineTable({
    memberId: v.id("members"),
    weight: v.number(),
    recordedAt: v.string(),
    timestamp: v.number(),
  }).index("by_member", ["memberId"]),

  /** Achievements — unlocked & locked with progress */
  achievements: defineTable({
    memberId: v.id("members"),
    icon: v.string(),
    title: v.string(),
    desc: v.string(),
    color: v.string(),
    isUnlocked: v.boolean(),
    progress: v.number(),
    unlockedAt: v.optional(v.string()),
  }).index("by_member", ["memberId"]),

  /** Available time slots per trainer */
  timeSlots: defineTable({
    trainerId: v.id("trainers"),
    time: v.string(),
    available: v.boolean(),
    dayOfWeek: v.number(),
  }).index("by_trainer", ["trainerId"]),
});
