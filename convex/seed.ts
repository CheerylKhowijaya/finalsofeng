import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed all test data into the database.
 * Run ONCE from Convex dashboard or via:
 *   npx convex run seed:seedAll
 *
 * Creates: 1 admin, 4 trainers, 6 members, 6 bookings,
 *          weekly schedule, 12-month weight history, 8 achievements,
 *          time slots for each trainer.
 */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // ── Clear existing data ───────────────────────────────────────
    const tables = ["achievements","weightHistory","exercises","workoutSchedules","bookings","timeSlots","members","trainers","users"] as const;
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) await ctx.db.delete(doc._id);
    }

    // ── Admin ─────────────────────────────────────────────────────
    await ctx.db.insert("users", {
      name: "Admin FitTrack", email: "admin@fittrack.com", password: "admin123",
      role: "admin", initials: "AF", createdAt: Date.now(),
    });

    // ── Trainers ──────────────────────────────────────────────────
    const trainerData = [
      { name: "Andi Pratama", email: "andi@fittrack.com",  specialty: "Strength & Power",  rating: 4.9, slots: 5, reviews: 128, initials: "AP", bio: "Spesialis kekuatan dan daya tahan otot." },
      { name: "Sari Dewi",    email: "sari@fittrack.com",  specialty: "Yoga & Flexibility", rating: 4.8, slots: 3, reviews: 97,  initials: "SD", bio: "Pelatih yoga bersertifikat internasional." },
      { name: "Rizky Hasan",  email: "rizky@fittrack.com", specialty: "HIIT & Cardio",      rating: 4.7, slots: 7, reviews: 84,  initials: "RH", bio: "HIIT dan cardio untuk pembakaran kalori maksimal." },
      { name: "Maya Putri",   email: "maya@fittrack.com",  specialty: "Pilates & Core",     rating: 4.6, slots: 4, reviews: 112, initials: "MP", bio: "Pilates untuk core strength dan postur tubuh." },
    ];

    const trainerIds: Record<string, any> = {};
    for (const t of trainerData) {
      const userId = await ctx.db.insert("users", {
        name: t.name, email: t.email, password: "trainer123",
        role: "trainer", initials: t.initials, createdAt: Date.now(),
      });
      const trainerId = await ctx.db.insert("trainers", {
        userId, name: t.name, specialty: t.specialty,
        rating: t.rating, slots: t.slots, reviews: t.reviews,
        initials: t.initials, bio: t.bio, isActive: true,
      });
      trainerIds[t.initials] = trainerId;

      // Time slots for each trainer
      const times = ["06:00","07:00","08:00","10:00","15:00","16:00","17:00"];
      const unavailable = ["08:00","16:00"];
      for (let day = 1; day <= 6; day++) {
        for (const time of times) {
          await ctx.db.insert("timeSlots", {
            trainerId, time, dayOfWeek: day,
            available: !unavailable.includes(time),
          });
        }
      }
    }

    // ── Members ───────────────────────────────────────────────────
    const memberData = [
      { name: "Budi Santoso",  email: "budi@email.com",  streak: 12, totalSessions: 48, targetWeight: 70, currentWeight: 73, height: 175, gender: "Laki-laki"  as const, joinDate: "Jan 2025", status: "Aktif"    as const, initials: "BS" },
      { name: "Rina Wijaya",   email: "rina@email.com",  streak: 7,  totalSessions: 22, targetWeight: 55, currentWeight: 58, height: 162, gender: "Perempuan"  as const, joinDate: "Feb 2025", status: "Aktif"    as const, initials: "RW" },
      { name: "Doni Kusuma",   email: "doni@email.com",  streak: 3,  totalSessions: 15, targetWeight: 80, currentWeight: 82, height: 178, gender: "Laki-laki"  as const, joinDate: "Mar 2025", status: "Aktif"    as const, initials: "DK" },
      { name: "Lisa Amalia",   email: "lisa@email.com",  streak: 0,  totalSessions: 31, targetWeight: 50, currentWeight: 54, height: 158, gender: "Perempuan"  as const, joinDate: "Jan 2025", status: "Nonaktif" as const, initials: "LA" },
      { name: "Anton Hidayat", email: "anton@email.com", streak: 1,  totalSessions: 5,  targetWeight: 75, currentWeight: 80, height: 172, gender: "Laki-laki"  as const, joinDate: "Apr 2025", status: "Aktif"    as const, initials: "AH" },
      { name: "Siska Rahma",   email: "siska@email.com", streak: 21, totalSessions: 60, targetWeight: 52, currentWeight: 55, height: 160, gender: "Perempuan"  as const, joinDate: "Feb 2025", status: "Aktif"    as const, initials: "SR" },
    ];

    const memberIds: Record<string, any> = {};
    for (const m of memberData) {
      const userId = await ctx.db.insert("users", {
        name: m.name, email: m.email, password: "member123",
        role: "member", initials: m.initials, createdAt: Date.now(),
      });
      const memberId = await ctx.db.insert("members", {
        userId, name: m.name, email: m.email,
        targetWeight: m.targetWeight, currentWeight: m.currentWeight,
        height: m.height, gender: m.gender, streak: m.streak,
        totalSessions: m.totalSessions, joinDate: m.joinDate, status: m.status,
      });
      memberIds[m.initials] = memberId;
    }

    // ── Bookings ──────────────────────────────────────────────────
    const bookingSeed = [
      { mI: "BS", tI: "AP", mn: "Budi Santoso",  mi: "BS", tn: "Andi Pratama",  sp: "Strength & Power",  date: "21 April 2025", time: "07:00", status: "confirmed" as const },
      { mI: "RW", tI: "SD", mn: "Rina Wijaya",   mi: "RW", tn: "Sari Dewi",     sp: "Yoga & Flexibility",date: "22 April 2025", time: "08:00", status: "pending"   as const },
      { mI: "DK", tI: "AP", mn: "Doni Kusuma",   mi: "DK", tn: "Andi Pratama",  sp: "Strength & Power",  date: "23 April 2025", time: "06:00", status: "pending"   as const },
      { mI: "LA", tI: "RH", mn: "Lisa Amalia",   mi: "LA", tn: "Rizky Hasan",   sp: "HIIT & Cardio",     date: "24 April 2025", time: "15:00", status: "rejected"  as const },
      { mI: "BS", tI: "SD", mn: "Budi Santoso",  mi: "BS", tn: "Sari Dewi",     sp: "Yoga & Flexibility",date: "25 April 2025", time: "10:00", status: "confirmed" as const },
      { mI: "AH", tI: "MP", mn: "Anton Hidayat", mi: "AH", tn: "Maya Putri",    sp: "Pilates & Core",    date: "25 April 2025", time: "16:00", status: "pending"   as const },
    ];
    for (const b of bookingSeed) {
      await ctx.db.insert("bookings", {
        memberId: memberIds[b.mI], trainerId: trainerIds[b.tI],
        memberName: b.mn, memberInitials: b.mi,
        trainerName: b.tn, specialty: b.sp,
        date: b.date, time: b.time, status: b.status,
        createdAt: Date.now(), updatedAt: Date.now(),
      });
    }

    // ── Budi's Weekly Schedule ────────────────────────────────────
    const budiId = memberIds["BS"];
    const weekStart = "2025-04-21";
    const schedule = [
      { day: "Sen", date: 21, workout: "Full Body",     intensity: "Hard"   as const, done: true,  exercises: [
        { name: "Barbell Squat",     muscle: "Quadriceps", sets: "4×12", kal: 80, order: 1 },
        { name: "Romanian Deadlift", muscle: "Hamstring",  sets: "3×10", kal: 70, order: 2 },
        { name: "Leg Press",         muscle: "Glutes",     sets: "3×15", kal: 55, order: 3 },
        { name: "Calf Raises",       muscle: "Calves",     sets: "4×20", kal: 30, order: 4 },
      ]},
      { day: "Sel", date: 22, workout: "Upper Body",    intensity: "Medium" as const, done: true,  exercises: [
        { name: "Push Up Variation", muscle: "Chest",   sets: "4×15", kal: 60, order: 1 },
        { name: "Dumbbell Row",      muscle: "Back",    sets: "3×12", kal: 55, order: 2 },
        { name: "Shoulder Press",    muscle: "Deltoid", sets: "3×12", kal: 50, order: 3 },
        { name: "Bicep Curl",        muscle: "Biceps",  sets: "3×15", kal: 35, order: 4 },
      ]},
      { day: "Rab", date: 23, workout: "HIIT Cardio",   intensity: "Hard"   as const, done: false, exercises: [
        { name: "Burpees",           muscle: "Full Body", sets: "5×10",  kal: 90, order: 1 },
        { name: "Jump Squat",        muscle: "Legs",      sets: "4×12",  kal: 70, order: 2 },
        { name: "Mountain Climbers", muscle: "Core",      sets: "4×30s", kal: 60, order: 3 },
        { name: "Box Jump",          muscle: "Explosive", sets: "3×8",   kal: 55, order: 4 },
      ]},
      { day: "Kam", date: 24, workout: "Legs & Glutes", intensity: "Hard"   as const, done: false, exercises: [
        { name: "Hip Thrust",      muscle: "Glutes",      sets: "4×12", kal: 75, order: 1 },
        { name: "Walking Lunges",  muscle: "Quadriceps",  sets: "3×20", kal: 65, order: 2 },
        { name: "Sumo Squat",      muscle: "Inner Thigh", sets: "4×15", kal: 60, order: 3 },
        { name: "Leg Curl",        muscle: "Hamstring",   sets: "3×12", kal: 45, order: 4 },
        { name: "Glute Kickback",  muscle: "Glutes",      sets: "3×15", kal: 40, order: 5 },
        { name: "Step Up",         muscle: "Full Leg",    sets: "3×12", kal: 35, order: 6 },
      ]},
      { day: "Jum", date: 25, workout: "Yoga & Core",   intensity: "Medium" as const, done: false, exercises: [
        { name: "Vinyasa Flow",   muscle: "Full Body",   sets: "1×20m", kal: 80, order: 1 },
        { name: "Plank Variation",muscle: "Core",        sets: "4×45s", kal: 40, order: 2 },
        { name: "Warrior Pose",   muscle: "Balance",     sets: "3×60s", kal: 35, order: 3 },
        { name: "Child's Pose",   muscle: "Flexibility", sets: "2×60s", kal: 15, order: 4 },
      ]},
      { day: "Sab", date: 26, workout: "Istirahat",     intensity: "Rest"   as const, done: false, exercises: [] },
      { day: "Min", date: 27, workout: "Light Walk",    intensity: "Medium" as const, done: false, exercises: [
        { name: "Brisk Walk",  muscle: "Cardio",      sets: "1×45m", kal: 180, order: 1 },
        { name: "Stretching",  muscle: "Flexibility", sets: "1×15m", kal: 30,  order: 2 },
      ]},
    ];
    for (const s of schedule) {
      const sid = await ctx.db.insert("workoutSchedules", {
        memberId: budiId, day: s.day, date: s.date, workout: s.workout,
        intensity: s.intensity, done: s.done, weekStart,
      });
      for (const ex of s.exercises) {
        await ctx.db.insert("exercises", { scheduleId: sid, ...ex });
      }
    }

    // ── Budi's Weight History (12 months) ────────────────────────
    const months = ["Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des","Jan","Feb","Mar","Apr"];
    const weights = [68, 69, 68, 70, 71, 70, 72, 71, 73, 72, 73, 73];
    for (let i = 0; i < 12; i++) {
      await ctx.db.insert("weightHistory", {
        memberId: budiId, weight: weights[i],
        recordedAt: `${months[i]} 2024`, timestamp: Date.now() + i * 86400000,
      });
    }

    // ── Budi's Achievements ───────────────────────────────────────
    const ach = [
      { icon: "🏆", title: "Konsisten",    desc: "30 hari berturut-turut", color: "green", isUnlocked: true,  progress: 100, unlockedAt: "15 Mar 2025" },
      { icon: "💪", title: "Power Lifter", desc: "Squat 100kg",            color: "pink",  isUnlocked: true,  progress: 100, unlockedAt: "2 Apr 2025"  },
      { icon: "🔥", title: "On Fire",      desc: "7 hari streak",          color: "pink",  isUnlocked: true,  progress: 100, unlockedAt: "20 Apr 2025" },
      { icon: "⚡", title: "Early Bird",   desc: "10 sesi jam 6 pagi",     color: "green", isUnlocked: true,  progress: 100, unlockedAt: "10 Apr 2025" },
      { icon: "🎯", title: "Goal Achieved",desc: "Capai berat target",     color: "pink",  isUnlocked: false, progress: 78  },
      { icon: "🥇", title: "Century",      desc: "48/100 sesi selesai",    color: "green", isUnlocked: false, progress: 48  },
      { icon: "🦅", title: "Iron Will",    desc: "12/60 hari streak",      color: "pink",  isUnlocked: false, progress: 20  },
      { icon: "👑", title: "Elite",        desc: "1/12 bulan aktif",       color: "green", isUnlocked: false, progress: 8   },
    ];
    for (const a of ach) {
      await ctx.db.insert("achievements", { memberId: budiId, ...a });
    }

    return {
      message: "✅ Seed selesai! Database FitTrack sudah terisi.",
      counts: { users: 11, trainers: 4, members: 6, bookings: 6 },
    };
  },
});
