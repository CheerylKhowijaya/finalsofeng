export const TRAINERS = [
  { id: 1, name: 'Andi Pratama', specialty: 'Strength & Power', rating: 4.9, slots: 5, color: 'from-pink-DEFAULT to-pink-medium', initials: 'AP', reviews: 128 },
  { id: 2, name: 'Sari Dewi', specialty: 'Yoga & Flexibility', rating: 4.8, slots: 3, color: 'from-green-DEFAULT to-green-dark', initials: 'SD', reviews: 97 },
  { id: 3, name: 'Rizky Hasan', specialty: 'HIIT & Cardio', rating: 4.7, slots: 7, color: 'from-pink-medium to-pink-light', initials: 'RH', reviews: 84 },
  { id: 4, name: 'Maya Putri', specialty: 'Pilates & Core', rating: 4.6, slots: 4, color: 'from-green-dark to-green-DEFAULT', initials: 'MP', reviews: 112 },
];

export const TIME_SLOTS = [
  { time: '06:00', available: true },
  { time: '07:00', available: true },
  { time: '08:00', available: false },
  { time: '10:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: false },
  { time: '17:00', available: true },
];

export const WEEKLY_SCHEDULE = [
  { day: 'Sen', date: 21, workout: 'Full Body', intensity: 'Hard', done: true, exercises: [
    { name: 'Barbell Squat', muscle: 'Quadriceps', sets: '4×12', kal: 80 },
    { name: 'Romanian Deadlift', muscle: 'Hamstring', sets: '3×10', kal: 70 },
    { name: 'Leg Press', muscle: 'Glutes', sets: '3×15', kal: 55 },
    { name: 'Calf Raises', muscle: 'Calves', sets: '4×20', kal: 30 },
  ]},
  { day: 'Sel', date: 22, workout: 'Upper Body', intensity: 'Medium', done: true, exercises: [
    { name: 'Push Up Variation', muscle: 'Chest', sets: '4×15', kal: 60 },
    { name: 'Dumbbell Row', muscle: 'Back', sets: '3×12', kal: 55 },
    { name: 'Shoulder Press', muscle: 'Deltoid', sets: '3×12', kal: 50 },
    { name: 'Bicep Curl', muscle: 'Biceps', sets: '3×15', kal: 35 },
  ]},
  { day: 'Rab', date: 23, workout: 'HIIT Cardio', intensity: 'Hard', done: false, exercises: [
    { name: 'Burpees', muscle: 'Full Body', sets: '5×10', kal: 90 },
    { name: 'Jump Squat', muscle: 'Legs', sets: '4×12', kal: 70 },
    { name: 'Mountain Climbers', muscle: 'Core', sets: '4×30s', kal: 60 },
    { name: 'Box Jump', muscle: 'Explosive', sets: '3×8', kal: 55 },
  ]},
  { day: 'Kam', date: 24, workout: 'Legs & Glutes', intensity: 'Hard', done: false, exercises: [
    { name: 'Hip Thrust', muscle: 'Glutes', sets: '4×12', kal: 75 },
    { name: 'Walking Lunges', muscle: 'Quadriceps', sets: '3×20', kal: 65 },
    { name: 'Sumo Squat', muscle: 'Inner Thigh', sets: '4×15', kal: 60 },
    { name: 'Leg Curl', muscle: 'Hamstring', sets: '3×12', kal: 45 },
    { name: 'Glute Kickback', muscle: 'Glutes', sets: '3×15', kal: 40 },
    { name: 'Step Up', muscle: 'Full Leg', sets: '3×12', kal: 35 },
  ]},
  { day: 'Jum', date: 25, workout: 'Yoga & Core', intensity: 'Medium', done: false, exercises: [
    { name: 'Vinyasa Flow', muscle: 'Full Body', sets: '1×20m', kal: 80 },
    { name: 'Plank Variation', muscle: 'Core', sets: '4×45s', kal: 40 },
    { name: 'Warrior Pose', muscle: 'Balance', sets: '3×60s', kal: 35 },
    { name: 'Child\'s Pose', muscle: 'Flexibility', sets: '2×60s', kal: 15 },
  ]},
  { day: 'Sab', date: 26, workout: 'Istirahat', intensity: 'Rest', done: false, exercises: [] },
  { day: 'Min', date: 27, workout: 'Light Walk', intensity: 'Medium', done: false, exercises: [
    { name: 'Brisk Walk', muscle: 'Cardio', sets: '1×45m', kal: 180 },
    { name: 'Stretching', muscle: 'Flexibility', sets: '1×15m', kal: 30 },
  ]},
];

export const WEIGHT_DATA = [68, 69, 68, 70, 71, 70, 72, 71, 73, 72, 73, 73];
export const WEIGHT_MONTHS = ['Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des','Jan','Feb','Mar','Apr'];

export const ACHIEVEMENTS_UNLOCKED = [
  { icon: '🏆', title: 'Konsisten', desc: '30 hari berturut-turut', color: 'green', date: '15 Mar 2025' },
  { icon: '💪', title: 'Power Lifter', desc: 'Squat 100kg', color: 'pink', date: '2 Apr 2025' },
  { icon: '🔥', title: 'On Fire', desc: '7 hari streak', color: 'pink', date: '20 Apr 2025' },
  { icon: '⚡', title: 'Early Bird', desc: '10 sesi jam 6 pagi', color: 'green', date: '10 Apr 2025' },
];

export const ACHIEVEMENTS_LOCKED = [
  { icon: '🎯', title: 'Goal Achieved', desc: 'Capai berat target', progress: 78 },
  { icon: '🥇', title: 'Century', desc: '48/100 sesi selesai', progress: 48 },
  { icon: '🦅', title: 'Iron Will', desc: '12/60 hari streak', progress: 20 },
  { icon: '👑', title: 'Elite', desc: '1/12 bulan aktif', progress: 8 },
];

export const FILTERS = ['Semua', 'Strength', 'Yoga', 'HIIT', 'Pilates'];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'booking', label: 'Booking Latihan', icon: 'calendar' },
  { id: 'jadwal', label: 'Jadwal Mingguan', icon: 'schedule' },
  { id: 'progress', label: 'Progress & Analitik', icon: 'chart' },
  { id: 'settings', label: 'Pengaturan', icon: 'settings' },
];

// ─── Multi-Role Credentials ────────────────────────────────────────
export const USERS = [
  { email: 'admin@fittrack.com',  password: 'admin123',   role: 'admin',   name: 'Admin FitTrack',  initials: 'AF' },
  { email: 'andi@fittrack.com',   password: 'trainer123', role: 'trainer', name: 'Andi Pratama',    initials: 'AP', trainerId: 1 },
  { email: 'sari@fittrack.com',   password: 'trainer123', role: 'trainer', name: 'Sari Dewi',       initials: 'SD', trainerId: 2 },
  { email: 'rizky@fittrack.com',  password: 'trainer123', role: 'trainer', name: 'Rizky Hasan',     initials: 'RH', trainerId: 3 },
  { email: 'maya@fittrack.com',   password: 'trainer123', role: 'trainer', name: 'Maya Putri',      initials: 'MP', trainerId: 4 },
];

// ─── Initial Bookings (seed data) ─────────────────────────────────
export const INITIAL_BOOKINGS = [
  { id: 1, memberId: 'budi', memberName: 'Budi Santoso',   memberInitials: 'BS', trainerId: 1, trainerName: 'Andi Pratama',  specialty: 'Strength & Power', date: '21 April 2025', time: '07:00', status: 'confirmed', createdAt: '20 Apr 2025' },
  { id: 2, memberId: 'rina', memberName: 'Rina Wijaya',    memberInitials: 'RW', trainerId: 2, trainerName: 'Sari Dewi',     specialty: 'Yoga & Flexibility', date: '22 April 2025', time: '08:00', status: 'pending',   createdAt: '21 Apr 2025' },
  { id: 3, memberId: 'doni', memberName: 'Doni Kusuma',    memberInitials: 'DK', trainerId: 1, trainerName: 'Andi Pratama',  specialty: 'Strength & Power', date: '23 April 2025', time: '06:00', status: 'pending',   createdAt: '22 Apr 2025' },
  { id: 4, memberId: 'lisa', memberName: 'Lisa Amalia',    memberInitials: 'LA', trainerId: 3, trainerName: 'Rizky Hasan',   specialty: 'HIIT & Cardio',    date: '24 April 2025', time: '15:00', status: 'rejected',  createdAt: '22 Apr 2025' },
  { id: 5, memberId: 'budi', memberName: 'Budi Santoso',   memberInitials: 'BS', trainerId: 2, trainerName: 'Sari Dewi',     specialty: 'Yoga & Flexibility', date: '25 April 2025', time: '10:00', status: 'confirmed', createdAt: '23 Apr 2025' },
  { id: 6, memberId: 'anto', memberName: 'Anton Hidayat',  memberInitials: 'AH', trainerId: 4, trainerName: 'Maya Putri',    specialty: 'Pilates & Core',   date: '25 April 2025', time: '16:00', status: 'pending',   createdAt: '23 Apr 2025' },
];

// ─── All Members list (for Admin) ─────────────────────────────────
export const ALL_MEMBERS = [
  { id: 'budi', name: 'Budi Santoso',  email: 'budi@email.com',   joinDate: 'Jan 2025', streak: 12, status: 'Aktif',    initials: 'BS', totalSesi: 48 },
  { id: 'rina', name: 'Rina Wijaya',   email: 'rina@email.com',   joinDate: 'Feb 2025', streak: 7,  status: 'Aktif',    initials: 'RW', totalSesi: 22 },
  { id: 'doni', name: 'Doni Kusuma',   email: 'doni@email.com',   joinDate: 'Mar 2025', streak: 3,  status: 'Aktif',    initials: 'DK', totalSesi: 15 },
  { id: 'lisa', name: 'Lisa Amalia',   email: 'lisa@email.com',   joinDate: 'Jan 2025', streak: 0,  status: 'Nonaktif', initials: 'LA', totalSesi: 31 },
  { id: 'anto', name: 'Anton Hidayat', email: 'anton@email.com',  joinDate: 'Apr 2025', streak: 1,  status: 'Aktif',    initials: 'AH', totalSesi: 5  },
  { id: 'siska',name: 'Siska Rahma',   email: 'siska@email.com',  joinDate: 'Feb 2025', streak: 21, status: 'Aktif',    initials: 'SR', totalSesi: 60 },
];
