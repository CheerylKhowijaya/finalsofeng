import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { IconFire, IconCheck, IconArrowRight, IconTarget, IconZap } from '../components/Icons';
import { WEEKLY_SCHEDULE } from '../data/mockData';

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const DATES = [21, 22, 23, 24, 25, 26, 27];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Pagi';
  if (h < 15) return 'Siang';
  if (h < 18) return 'Sore';
  return 'Malam';
}

// Circular progress ring
function RingProgress({ pct = 68, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFD6E7" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#00C97A" strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill="#FF2D78"
        fontSize={14} fontWeight={800} fontFamily='"Plus Jakarta Sans",sans-serif'>
        {pct}%
      </text>
    </svg>
  );
}

// Animated stat card
function StatCard({ icon, label, value, color = '#FF2D78', pulse = false, delay = 0 }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '20px 24px',
      boxShadow: '0 8px 32px rgba(255,45,120,0.10)',
      border: '1.5px solid #FFD6E7', display: 'flex',
      flexDirection: 'column', gap: 8,
      animation: `fadeSlideUp 0.5s ${delay}s both`,
      transition: 'transform 0.22s, box-shadow 0.22s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,45,120,0.16)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,45,120,0.10)'; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: color === '#00C97A' ? 'rgba(0,201,122,0.12)' : 'rgba(255,45,120,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...(pulse ? { animation: 'pulseRing 1.8s infinite' } : {})
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#B08090', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function Dashboard({ setActiveScreen, currentUser }) {
  const [todayIdx, setTodayIdx] = useState(2);

  // Real-time booking status from Convex
  const memberBookings = useQuery(
    api.bookings.getBookingsByMember,
    currentUser?.memberId ? { memberId: currentUser.memberId } : 'skip'
  ) ?? [];

  // Fetch real member stats (streak, weight, etc)
  const memberData = useQuery(
    api.members.getMemberById,
    currentUser?.memberId ? { memberId: currentUser.memberId } : 'skip'
  );

  const stats = {
    streak: memberData?.streak ?? 0,
    totalSessions: memberData?.totalSessions ?? 0,
    weight: memberData?.currentWeight ?? currentUser?.targetWeight ?? 70,
    targetPct: memberData?.dailyTarget ?? 0,
    bestStreak: memberData?.bestStreak ?? 0
  };

  return (
    <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
      {/* Greeting Hero */}
      <div style={{
        borderRadius: 28, padding: '36px 40px', marginBottom: 24,
        background: 'linear-gradient(135deg, #FF2D78 0%, #FF6FAE 60%, #FFB3D1 100%)',
        boxShadow: '0 12px 48px rgba(255,45,120,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: 160, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ zIndex: 1 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 8, letterSpacing: 1 }}>
            SELAMAT {getGreeting().toUpperCase()}
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display",serif', fontWeight: 800,
            fontSize: 38, color: '#fff', marginBottom: 12, lineHeight: 1.1, letterSpacing: '-0.5px'
          }}>
            Hei, {currentUser?.name?.split(' ')[0] || 'Member'}! 💪
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: 500, maxWidth: 380 }}>
            Kamu sudah <strong>{stats.streak} hari konsisten</strong>. Terus pertahankan momentummu — kamu luar biasa!
          </p>
          <button
            onClick={() => setActiveScreen('booking')}
            style={{
              marginTop: 24, padding: '12px 28px', borderRadius: 14,
              background: '#fff', color: '#FF2D78',
              fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
          >
            Booking Sesi Sekarang <IconArrowRight size={16} color="#FF2D78" />
          </button>
        </div>

        {/* SVG fitness character */}
        <div style={{ zIndex: 1, opacity: 0.92 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="35" r="22" fill="rgba(255,255,255,0.25)" />
            <circle cx="70" cy="35" r="15" fill="rgba(255,255,255,0.4)" />
            <ellipse cx="70" cy="36" rx="8" ry="9" fill="rgba(255,255,255,0.6)" />
            <rect x="52" y="60" width="36" height="44" rx="10" fill="rgba(255,255,255,0.25)" />
            <rect x="30" y="65" width="22" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
            <rect x="88" y="65" width="22" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
            <rect x="20" y="61" width="10" height="10" rx="3" fill="rgba(255,255,255,0.4)" />
            <rect x="110" y="61" width="10" height="10" rx="3" fill="rgba(255,255,255,0.4)" />
            <rect x="57" y="104" width="10" height="28" rx="5" fill="rgba(255,255,255,0.25)" />
            <rect x="73" y="104" width="10" height="28" rx="5" fill="rgba(255,255,255,0.25)" />
          </svg>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<IconFire size={20} />} label="Hari Berturut-turut" value={`🔥 ${stats.streak}`} color="#FF2D78" pulse delay={0} />
        <StatCard icon={<IconZap size={20} color="#00C97A" />} label="Total Sesi Latihan" value={`${stats.totalSessions} Sesi`} color="#00C97A" delay={0.05} />
        <StatCard icon={<span style={{ fontSize: 20 }}>⚡</span>} label="Berat Badan" value={`${stats.weight} kg`} color="#FF2D78" delay={0.10} />
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 24px',
          boxShadow: '0 8px 32px rgba(255,45,120,0.10)',
          border: '1.5px solid #FFD6E7',
          display: 'flex', flexDirection: 'column', gap: 6,
          animation: 'fadeSlideUp 0.5s 0.15s both',
          transition: 'transform 0.22s, box-shadow 0.22s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,45,120,0.16)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,45,120,0.10)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: '#B08090', fontWeight: 500 }}>Target Harian</div>
            <RingProgress pct={stats.targetPct} size={60} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#FF2D78' }}>{stats.targetPct}% Tercapai</div>
        </div>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today workout */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '28px 28px',
            boxShadow: '0 8px 32px rgba(255,45,120,0.10)',
            border: '1.5px solid #FFD6E7',
            borderLeft: '6px solid #FF2D78',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 2, marginBottom: 8 }}>LATIHAN HARI INI</div>
            <div style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 800,
              fontSize: 30, color: '#1A0A12', marginBottom: 12, letterSpacing: '-0.5px'
            }}>LEGS & GLUTES</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['6 Latihan', '45 Menit', '420 kal'].map((t, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(0,201,122,0.10)', color: '#00A85A',
                  fontSize: 12, fontWeight: 700, border: '1px solid rgba(0,201,122,0.2)'
                }}>{t}</span>
              ))}
            </div>
            <button
              onClick={() => setActiveScreen('jadwal')}
              style={{
                padding: '13px 24px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 6px 20px rgba(255,45,120,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,45,120,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,45,120,0.35)'; }}
            >
              Mulai Sesi Sekarang <IconArrowRight size={16} color="#fff" />
            </button>
          </div>

          {/* Mini week calendar */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '20px 24px',
            boxShadow: '0 8px 32px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7'
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A0A12', marginBottom: 16 }}>Minggu Ini</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
              {DAYS.map((d, i) => {
                const isActive = i === todayIdx;
                const isDone = WEEKLY_SCHEDULE[i].done;
                const isRest = WEEKLY_SCHEDULE[i].intensity === 'Rest';
                return (
                  <button
                    key={i}
                    onClick={() => setTodayIdx(i)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 4, padding: '10px 4px', borderRadius: 14, border: 'none',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: isActive ? '#FF2D78' : isDone ? 'rgba(0,201,122,0.1)' : isRest ? '#F5F5F5' : '#FFF5F8',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? 'rgba(255,255,255,0.8)' : '#B08090' }}>{d}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: isActive ? '#fff' : isDone ? '#00A85A' : isRest ? '#ccc' : '#1A0A12' }}>
                      {DATES[i]}
                    </span>
                    {isDone && !isActive && <IconCheck size={12} color="#00C97A" />}
                    {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Next session */}
          {(() => {
            const confirmed = memberBookings.filter(b => b.status === 'confirmed');
            if (confirmed.length === 0) return null;
            const latest = confirmed[0];
            return (
              <div style={{
                background: '#fff', borderRadius: 24, padding: '22px 24px',
                boxShadow: '0 8px 32px rgba(255,45,120,0.10)', border: '1.5px solid #FFD6E7'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 14 }}>SESI BERIKUTNYA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#00C97A,#00A85A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 16
                  }}>{latest.trainerName?.[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1A0A12' }}>{latest.trainerName}</div>
                    <div style={{ fontSize: 12, color: '#B08090' }}>Sesi Aktif</div>
                  </div>
                  <span style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(0,201,122,0.1)', color: '#00A85A',
                    fontSize: 11, fontWeight: 700, border: '1px solid rgba(0,201,122,0.2)'
                  }}>Terjadwal</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B3F52' }}>
                    <span>📅</span> {latest.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B3F52' }}>
                    <span>🕐</span> {latest.time} WIB
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Booking Status Card ── */}
          {memberBookings.length > 0 && (() => {
            const latest = [...memberBookings].reverse()[0];
            const statusCfg = {
              pending:   { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.3)',  color: '#D97706', dot: '#F59E0B', label: '🟡 Menunggu Konfirmasi Trainer', pulse: true },
              confirmed: { bg: 'rgba(0,201,122,0.08)',  border: 'rgba(0,201,122,0.25)', color: '#00A85A', dot: '#00C97A', label: '✅ Booking Dikonfirmasi!', pulse: false },
              rejected:  { bg: 'rgba(255,45,120,0.06)', border: 'rgba(255,45,120,0.2)', color: '#FF2D78', dot: '#FF2D78', label: '❌ Booking Ditolak', pulse: false },
            };
            const s = statusCfg[latest.status] || statusCfg.pending;
            return (
              <div style={{
                background: '#fff', borderRadius: 24, padding: '20px 24px',
                boxShadow: '0 8px 32px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7',
                marginBottom: 0,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 12 }}>STATUS BOOKING TERAKHIR</div>
                <div style={{ padding: '14px 16px', borderRadius: 16, background: s.bg, border: `1.5px solid ${s.border}`, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {s.pulse && <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, animation: 'pulseRing 1.8s infinite', flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6B3F52' }}>🏋️ {latest.trainerName}</div>
                  <div style={{ fontSize: 12, color: '#B08090', marginTop: 2 }}>📅 {latest.date} · 🕐 {latest.time}</div>
                </div>
                {latest.status === 'rejected' && (
                  <button onClick={() => setActiveScreen('booking')} style={{ width: '100%', padding: '9px', borderRadius: 12, border: '1.5px solid #FF2D78', background: 'transparent', color: '#FF2D78', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Booking Ulang →
                  </button>
                )}
              </div>
            );
          })()}

          {/* Best streak */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '22px 24px',
            boxShadow: '0 8px 32px rgba(255,45,120,0.10)', border: '1.5px solid #FFD6E7'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 8 }}>STREAK TERBAIKMU</div>
            <div style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 800,
              fontSize: 42, color: '#FF2D78', lineHeight: 1
            }}>{stats.bestStreak} <span style={{ fontSize: 20, color: '#6B3F52' }}>Hari</span></div>
            <div style={{ fontSize: 13, color: '#B08090', marginTop: 4, marginBottom: 12 }}>Rekor terbaik kamu! 🏆</div>
            <div style={{ height: 8, borderRadius: 8, background: '#FFD6E7', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${Math.min((stats.streak / (stats.bestStreak || 1)) * 100, 100)}%`, borderRadius: 8,
                background: 'linear-gradient(90deg,#00C97A,#00A85A)',
                transition: 'width 1s ease'
              }} />
            </div>
            <div style={{ fontSize: 11, color: '#B08090', marginTop: 6 }}>Streak saat ini: {stats.streak} / {stats.bestStreak || stats.streak} hari</div>
          </div>

          {/* Achievements */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '18px 24px',
            boxShadow: '0 8px 32px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 12 }}>PENCAPAIAN TERBARU</div>
            {[
              { icon: '🏆', title: 'Konsisten', desc: '30 hari berturut' },
              { icon: '💪', title: 'Power Lifter', desc: 'Squat 100kg' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: i === 0 ? '1px solid #FFD6E7' : 'none'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(0,201,122,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1A0A12' }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: '#B08090' }}>{a.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <IconCheck size={16} color="#00C97A" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
