import { useState } from 'react';
import { WEEKLY_SCHEDULE } from '../data/mockData';
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconCheck } from '../components/Icons';

function IntensityBadge({ level }) {
  const cfg = {
    Hard:   { bg: 'rgba(255,45,120,0.1)',   color: '#FF2D78',  border: 'rgba(255,45,120,0.2)'   },
    Medium: { bg: 'rgba(255,179,209,0.2)',  color: '#FF6FAE',  border: 'rgba(255,111,174,0.25)' },
    Rest:   { bg: 'rgba(0,201,122,0.1)',    color: '#00A85A',  border: 'rgba(0,201,122,0.2)'    },
  };
  const c = cfg[level] || cfg.Medium;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`
    }}>{level}</span>
  );
}

function ExerciseRow({ ex, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1.5px solid #FFD6E7', marginBottom: 8,
      transition: 'all 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '13px 16px', background: open ? '#FFF5F8' : '#fff',
          border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#FFF5F8'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#fff'; }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0
        }}>{idx + 1}</div>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: '#1A0A12' }}>{ex.name}</div>
        <span style={{
          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: 'rgba(0,201,122,0.08)', color: '#00A85A', border: '1px solid rgba(0,201,122,0.15)'
        }}>{ex.muscle}</span>
        <span style={{ fontFamily: '"Fira Code",monospace', fontSize: 13, fontWeight: 700, color: '#6B3F52', minWidth: 50, textAlign: 'right' }}>{ex.sets}</span>
        <span style={{ fontSize: 12, color: '#B08090', minWidth: 40, textAlign: 'right' }}>{ex.kal} kal</span>
        <div style={{ marginLeft: 8, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <IconChevronDown size={14} color="#B08090" />
        </div>
      </button>
      {open && (
        <div style={{ padding: '12px 16px 14px', background: '#FFF0F5', borderTop: '1px solid #FFD6E7', animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: 13, color: '#6B3F52', lineHeight: 1.6 }}>
            Lakukan <strong>{ex.sets}</strong> dengan teknik yang benar. Istirahat 60–90 detik antar set.
            Fokus pada {ex.muscle.toLowerCase()} — jaga punggung tetap lurus dan gerakkan secara terkontrol.
            Catat beban yang digunakan untuk memantau perkembangan.
          </p>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,45,120,0.08)', color: '#FF2D78', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,45,120,0.15)' }}>
              {ex.kal} kal
            </span>
            <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(0,201,122,0.08)', color: '#00A85A', fontSize: 12, fontWeight: 600, border: '1px solid rgba(0,201,122,0.15)' }}>
              {ex.muscle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom SVG bar chart
function ActivityChart() {
  const bars = [
    { day: 'Sen', active: true, height: 75 },
    { day: 'Sel', active: false, height: 55 },
    { day: 'Rab', active: true, height: 80 },
    { day: 'Kam', active: false, height: 45 },
    { day: 'Jum', active: true, height: 70 },
    { day: 'Sab', active: false, height: 20 },
    { day: 'Min', active: false, height: 30 },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80, padding: '0 4px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: '100%', height: b.height, borderRadius: '6px 6px 0 0',
            background: b.active ? '#00C97A' : 'rgba(255,255,255,0.3)',
            transition: 'height 0.6s ease',
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{b.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function Jadwal() {
  const [selectedDay, setSelectedDay] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [completedDays, setCompletedDays] = useState([0, 1]);

  const current = WEEKLY_SCHEDULE[selectedDay];
  const isDone = completedDays.includes(selectedDay);

  const handleDone = () => {
    if (!isDone) setCompletedDays(d => [...d, selectedDay]);
  };

  const handleRegenerate = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1800);
  };

  const totalKal = current.exercises.reduce((a, e) => a + e.kal, 0);
  const totalMin = current.exercises.length * 7 + 5;

  return (
    <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
      {/* Week navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#FF2D78', fontWeight: 700, fontSize: 14 }}>
          <IconChevronLeft size={18} color="#FF2D78" /> Minggu Lalu
        </button>
        <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 18, color: '#1A0A12' }}>
          21 – 27 April 2025
        </div>
        <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#FF2D78', fontWeight: 700, fontSize: 14 }}>
          Minggu Depan <IconChevronRight size={18} color="#FF2D78" />
        </button>
      </div>

      {/* Weekly day cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10, marginBottom: 24 }}>
        {WEEKLY_SCHEDULE.map((day, i) => {
          const isSelected = i === selectedDay;
          const isDoneDay = completedDays.includes(i);
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: '16px 8px', borderRadius: 20, border: '1.5px solid',
                borderColor: isSelected ? '#FF2D78' : isDoneDay ? 'rgba(0,201,122,0.3)' : '#FFD6E7',
                background: isSelected ? 'linear-gradient(135deg,#FF2D78,#FF6FAE)' : isDoneDay ? 'rgba(0,201,122,0.06)' : '#fff',
                borderLeft: isDoneDay && !isSelected ? '4px solid #00C97A' : isSelected ? 'auto' : '1.5px solid #FFD6E7',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                boxShadow: isSelected ? '0 6px 24px rgba(255,45,120,0.30)' : '0 2px 8px rgba(255,45,120,0.06)',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.8)' : '#B08090', marginBottom: 4 }}>{day.day}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: isSelected ? '#fff' : '#1A0A12', marginBottom: 6 }}>{day.date}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.9)' : '#6B3F52', marginBottom: 8, lineHeight: 1.2 }}>
                {day.workout}
              </div>
              <IntensityBadge level={day.intensity} />
              <div style={{ marginTop: 10 }}>
                {isDoneDay ? (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#00C97A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                  }}>
                    <IconCheck size={13} color="#fff" />
                  </div>
                ) : (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'rgba(255,255,255,0.5)' : '#FFD6E7'}`,
                    margin: '0 auto'
                  }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      <div style={{
        background: '#fff', borderRadius: 24, padding: '28px 32px',
        boxShadow: '0 8px 32px rgba(255,45,120,0.10)', border: '1.5px solid #FFD6E7', marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 6 }}>
              {current.day.toUpperCase()}, 21–27 APRIL 2025
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 32,
              color: '#FF2D78', letterSpacing: '-0.5px', marginBottom: 8
            }}>{current.workout.toUpperCase()}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {current.exercises.length > 0 && (
                <>
                  <span style={{ fontSize: 13, color: '#6B3F52', fontWeight: 600 }}>📋 {current.exercises.length} Latihan</span>
                  <span style={{ color: '#FFD6E7' }}>·</span>
                  <span style={{ fontSize: 13, color: '#6B3F52', fontWeight: 600 }}>⏱ ~{totalMin} Menit</span>
                  <span style={{ color: '#FFD6E7' }}>·</span>
                  <span style={{ fontSize: 13, color: '#FF2D78', fontWeight: 700 }}>🔥 {totalKal} kal</span>
                </>
              )}
              {current.exercises.length === 0 && (
                <span style={{ fontSize: 13, color: '#00A85A', fontWeight: 600 }}>🌿 Hari Istirahat — Recovery penting!</span>
              )}
            </div>
          </div>
          {current.exercises.length > 0 && (
            <button
              onClick={handleDone}
              style={{
                padding: '12px 24px', borderRadius: 14, border: 'none', cursor: isDone ? 'default' : 'pointer',
                background: isDone ? 'linear-gradient(135deg,#00C97A,#00A85A)' : 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: isDone ? '0 4px 16px rgba(0,201,122,0.35)' : '0 4px 16px rgba(255,45,120,0.35)',
                transition: 'all 0.3s',
              }}
            >
              <IconCheck size={16} color="#fff" />
              {isDone ? 'Sesi Selesai!' : 'Tandai Selesai'}
            </button>
          )}
        </div>

        {current.exercises.length > 0 ? (
          <div>
            {current.exercises.map((ex, i) => <ExerciseRow key={i} ex={ex} idx={i} />)}
          </div>
        ) : (
          <div style={{
            padding: '32px', textAlign: 'center', borderRadius: 16,
            background: '#E6FFF5', border: '1.5px solid rgba(0,201,122,0.2)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
            <div style={{ fontWeight: 700, color: '#00A85A', fontSize: 16 }}>Hari Istirahat</div>
            <div style={{ color: '#6B3F52', fontSize: 13, marginTop: 4 }}>Tubuh butuh recovery. Istirahat adalah bagian dari latihan!</div>
          </div>
        )}
      </div>

      {/* Bottom: Habit insight + weekly summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Habit insight card */}
        <div style={{
          borderRadius: 24, padding: '24px 28px',
          background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
          boxShadow: '0 8px 32px rgba(255,45,120,0.28)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 6 }}>📊 KEBIASAAN AKTIFMU</div>
          <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>
            Paling aktif: Senin, Rabu, Jumat
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
            Konsistensi 3 hari/minggu — sangat bagus!
          </div>
          <ActivityChart />
          <button
            onClick={handleRegenerate}
            style={{
              marginTop: 16, padding: '10px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <span style={{ display: 'inline-block', animation: spinning ? 'spin-slow 1s linear infinite' : 'none' }}>⟳</span>
            {spinning ? 'Memuat jadwal baru...' : 'Regenerate Jadwal'}
          </button>
        </div>

        {/* Weekly summary */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: '24px 28px',
          boxShadow: '0 8px 32px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7',
          display: 'flex', flexDirection: 'column', gap: 14
        }}>
          <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 18, color: '#1A0A12' }}>Ringkasan Minggu</div>
          {[
            { icon: '✓', label: 'Sesi Selesai', value: `${completedDays.length}/7`, color: '#00A85A', bg: 'rgba(0,201,122,0.08)' },
            { icon: '🔥', label: 'Kalori Minggu Ini', value: '1,240 kal', color: '#FF2D78', bg: 'rgba(255,45,120,0.06)' },
            { icon: '⚡', label: 'Streak Aktif', value: '12 Hari', color: '#FF2D78', bg: 'rgba(255,45,120,0.06)' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}22`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 13, color: '#6B3F52', fontWeight: 600 }}>{s.label}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
