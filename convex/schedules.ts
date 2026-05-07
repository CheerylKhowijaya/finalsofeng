import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get the 7-day workout schedule for a member on a given week. */
export const getWeeklySchedule = query({
  args: {
    memberId: v.id("members"),
    weekStart: v.string(),
  },
  handler: async (ctx, { memberId, weekStart }) => {
    const schedules = await ctx.db
      .query("workoutSchedules")
      .withIndex("by_member_week", (q) =>
        q.eq("memberId", memberId).eq("weekStart", weekStart)
      )
      .collect();

    // For each schedule, fetch its exercises
    const result = await Promise.all(
      schedules.map(async (s) => {
        const exercises = await ctx.db
          .query("exercises")
          .withIndex("by_schedule", (q) => q.eq("scheduleId", s._id))
          .order("asc")
          .collect();
        return { ...s, exercises };
      })
    );
    return result.sort((a, b) => a.date - b.date);
  },
});

/** Mark a workout day as done — also increments member streak. */
export const markWorkoutDone = mutation({
  args: {
    scheduleId: v.id("workoutSchedules"),
    memberId: v.id("members"),
  },
  handler: async (ctx, { scheduleId, memberId }) => {
    await ctx.db.patch(scheduleId, { done: true });
    // Increment streak
    const member = await ctx.db.get(memberId);
    if (member) {
      await ctx.db.patch(memberId, { streak: member.streak + 1 });
    }
  },
});

/** Unmark a workout day as done. */
export const unmarkWorkoutDone = mutation({
  args: { scheduleId: v.id("workoutSchedules") },
  handler: async (ctx, { scheduleId }) => {
    await ctx.db.patch(scheduleId, { done: false });
  },
});

/** Generate a default 7-day workout plan for a member. */
export const generateWeeklySchedule = mutation({
  args: {
    memberId: v.id("members"),
    weekStart: v.string(),
  },
  handler: async (ctx, { memberId, weekStart }) => {
    const defaultPlan = [
      { day: "Sen", date: 21, workout: "Full Body",      intensity: "Hard"   as const, exercises: [
        { name: "Barbell Squat",     muscle: "Quadriceps", sets: "4×12", kal: 80, order: 1 },
        { name: "Romanian Deadlift", muscle: "Hamstring",  sets: "3×10", kal: 70, order: 2 },
        { name: "Leg Press",         muscle: "Glutes",     sets: "3×15", kal: 55, order: 3 },
        { name: "Calf Raises",       muscle: "Calves",     sets: "4×20", kal: 30, order: 4 },
      ]},
      { day: "Sel", date: 22, workout: "Upper Body",     intensity: "Medium" as const, exercises: [
        { name: "Push Up Variation", muscle: "Chest",     sets: "4×15", kal: 60, order: 1 },
        { name: "Dumbbell Row",      muscle: "Back",      sets: "3×12", kal: 55, order: 2 },
        { name: "Shoulder Press",    muscle: "Deltoid",   sets: "3×12", kal: 50, order: 3 },
        { name: "Bicep Curl",        muscle: "Biceps",    sets: "3×15", kal: 35, order: 4 },
      ]},
      { day: "Rab", date: 23, workout: "HIIT Cardio",    intensity: "Hard"   as const, exercises: [
        { name: "Burpees",           muscle: "Full Body", sets: "5×10", kal: 90, order: 1 },
        { name: "Jump Squat",        muscle: "Legs",      sets: "4×12", kal: 70, order: 2 },
        { name: "Mountain Climbers", muscle: "Core",      sets: "4×30s",kal: 60, order: 3 },
        { name: "Box Jump",          muscle: "Explosive", sets: "3×8",  kal: 55, order: 4 },
      ]},
      { day: "Kam", date: 24, workout: "Legs & Glutes",  intensity: "Hard"   as const, exercises: [
        { name: "Hip Thrust",        muscle: "Glutes",       sets: "4×12", kal: 75, order: 1 },
        { name: "Walking Lunges",    muscle: "Quadriceps",   sets: "3×20", kal: 65, order: 2 },
        { name: "Sumo Squat",        muscle: "Inner Thigh",  sets: "4×15", kal: 60, order: 3 },
        { name: "Leg Curl",          muscle: "Hamstring",    sets: "3×12", kal: 45, order: 4 },
        { name: "Glute Kickback",    muscle: "Glutes",       sets: "3×15", kal: 40, order: 5 },
        { name: "Step Up",           muscle: "Full Leg",     sets: "3×12", kal: 35, order: 6 },
      ]},
      { day: "Jum", date: 25, workout: "Yoga & Core",    intensity: "Medium" as const, exercises: [
        { name: "Vinyasa Flow",      muscle: "Full Body",    sets: "1×20m", kal: 80, order: 1 },
        { name: "Plank Variation",   muscle: "Core",         sets: "4×45s", kal: 40, order: 2 },
        { name: "Warrior Pose",      muscle: "Balance",      sets: "3×60s", kal: 35, order: 3 },
        { name: "Child's Pose",      muscle: "Flexibility",  sets: "2×60s", kal: 15, order: 4 },
      ]},
      { day: "Sab", date: 26, workout: "Istirahat",      intensity: "Rest"   as const, exercises: [] },
      { day: "Min", date: 27, workout: "Light Walk",     intensity: "Medium" as const, exercises: [
        { name: "Brisk Walk",        muscle: "Cardio",       sets: "1×45m", kal: 180, order: 1 },
        { name: "Stretching",        muscle: "Flexibility",  sets: "1×15m", kal: 30,  order: 2 },
      ]},
    ];

    for (const day of defaultPlan) {
      const scheduleId = await ctx.db.insert("workoutSchedules", {
        memberId,
        day: day.day,
        date: day.date,
        workout: day.workout,
        intensity: day.intensity,
        done: false,
        weekStart,
      });
      for (const ex of day.exercises) {
        await ctx.db.insert("exercises", { scheduleId, ...ex });
      }
    }
    return { success: true };
  },
});
