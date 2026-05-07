import { useState, useEffect } from 'react';
import { WEIGHT_DATA, WEIGHT_MONTHS, ACHIEVEMENTS_UNLOCKED, ACHIEVEMENTS_LOCKED } from '../data/mockData';
import { IconCheck, IconLock } from '../components/Icons';

// ── SVG Line Chart ─────────────────────────────────────────────────
function WeightChart({ data, months }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  const W = 720, H = 200, PAD = { top: 20, right: 20, bottom: 30, left: 40 };
  const minW = Math.min(...data) - 2;
  const maxW = Math.max(...data) + 2;
  const xScale = i => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const yScale = v => PAD.top + ((maxW - v) / (maxW - minW)) * (H - PAD.top - PAD.bottom);
  const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
  const areaD = `${pathD} L${xScale(data.length - 1)},${H - PAD.bottom} L${PAD.left},${H - PAD.bottom} Z`;
  const pathLen = 1000;

  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 400, display: 'block' }}>
        <defs>
          <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF2D78" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chartClip">
            <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={H - PAD.top - PAD.bottom} />
          </clipPath>
        </defs>
        {/* Grid lines */}
        {[minW, (minW + maxW) / 2, maxW].map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)} stroke="#FFD6E7" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize="11" fill="#B08090" fontFamily='"Fira Code",monospace'>{v}</text>
          </g>
        ))}
        {/* X-axis labels */}
        {months.map((m, i) => (
          <text key={i} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#B08090" fontFamily='"Fira Code",monospace'>{m}</text>
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#pinkGrad)" clipPath="url(#chartClip)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#FF2D78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={pathLen} strokeDashoffset={animated ? 0 : pathLen}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
          clipPath="url(#chartClip)"
        />
        {/* Data points */}
        {data.map((v, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <circle cx={xScale(i)} cy={yScale(v)} r={hovered === i ? 7 : 5}
              fill="#fff" stroke="#FF2D78" strokeWidth={hovered === i ? 3 : 2}
              style={{ transition: 'r 0.15s, stroke-width 0.15s' }} />
          </g>
        ))}
        {/* Tooltip */}
        {hovered !== null && (
          <g>
            <rect x={xScale(hovered) - 28} y={yScale(data[hovered]) - 36} width={56} height={26} rx={8}
              fill="#fff" stroke="#FFD6E7" strokeWidth="1.5"
              filter="drop-shadow(0 4px 12px rgba(255,45,120,0.15))" />
            <text x={xScale(hovered)} y={yScale(data[hovered]) - 18} textAnchor="middle"
              fontSize="12" fontWeight="700" fill="#FF2D78" fontFamily='"Plus Jakarta Sans",sans-serif'>
              {data[hovered]} kg
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Achievement Badge ────────────────────────────────────────────────
function AchievementCard({ item, locked = false }) {
  const [hovering, setHovering] = useState(false);
  const glow = item.color === 'green'
    ? '0 0 0 2px rgba(0,201,122,0.3), 0 8px 32px rgba(0,201,122,0.20)'
    : '0 0 0 2px rgba(255,45,120,0.3), 0 8px 32px rgba(255,45,120,0.20)';

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: '#fff', borderRadius: 22, padding: '24px 20px', textAlign: 'center',
        border: locked ? '1.5px solid #F0F0F0' : `2px solid ${item.color === 'green' ? 'rgba(0,201,122,0.35)' : 'rgba(255,45,120,0.30)'}`,
        boxShadow: locked ? 'none' : (hovering ? glow : '0 4px 20px rgba(255,45,120,0.08)'),
        filter: locked ? 'grayscale(1)' : 'none',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s',
        transform: hovering ? 'translateY(-4px) scale(1.02)' : 'none',
      }}
    >
      {locked && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <IconLock size={16} color="#CCC" />
        </div>
      )}
      <div style={{ fontSize: 40, marginBottom: 10 }}>{item.icon}</div>
      <div style={{ fontWeight: 800, fontSize: 15, color: locked ? '#CCC' : '#1A0A12', marginBottom: 4 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: locked ? '#DDD' : '#B08090', marginBottom: 12 }}>{item.desc}</div>

      {/* Hover overlay */}
      {hovering && !locked && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 12px', background: item.color === 'green' ? 'rgba(0,201,122,0.08)' : 'rgba(255,45,120,0.06)',
          borderTop: `1px solid ${item.color === 'green' ? 'rgba(0,201,122,0.2)' : 'rgba(255,45,120,0.15)'}`,
          fontSize: 11, fontWeight: 600, color: item.color === 'green' ? '#00A85A' : '#FF2D78',
          animation: 'fadeIn 0.2s ease'
        }}>
          🗓 Dicapai: {item.date}
        </div>
      )}

      {/* Locked progress bar */}
      {hovering && locked && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{ height: 6, borderRadius: 6, background: '#F0F0F0', overflow: 'hidden', marginTop: 4 }}>
            <div style={{
              height: '100%', width: `${item.progress}%`, borderRadius: 6,
              background: 'linear-gradient(90deg,#00C97A,#00A85A)',
              transition: 'width 0.6s ease'
            }} />
          </div>
          <div style={{ fontSize: 11, color: '#B08090', marginTop: 4 }}>{item.progress}% menuju pencapaian</div>
        </div>
      )}
    </div>
  );
}

// ── Progress bar row ──────────────────────────────────────────────────
function MetricBar({ label, current, target, unit, pct, badge }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnim(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1.5px solid #FFD6E7', boxShadow: '0 4px 16px rgba(255,45,120,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1A0A12' }}>{label}</div>
        {badge && (
          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(0,201,122,0.1)', color: '#00A85A', border: '1px solid rgba(0,201,122,0.2)' }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 24, color: '#FF2D78' }}>{current}</span>
        <span style={{ fontSize: 13, color: '#B08090' }}>/ {target} {unit} target</span>
      </div>
      <div style={{ height: 8, borderRadius: 8, background: '#FFD6E7', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%', borderRadius: 8, width: anim ? `${pct}%` : '0%',
          background: 'linear-gradient(90deg,#FF2D78,#FF6FAE)',
          transition: 'width 1s cubic-bezier(.4,0,.2,1)'
        }} />
      </div>
    </div>
  );
}

const RANGE_TABS = ['Bulan Ini', '3 Bulan', '6 Bulan', '1 Tahun'];

export default function Progress() {
  const [activeTab, setActiveTab] = useState('1 Tahun');

  const statCards = [
    { icon: '🏋️', label: 'Total Sesi', value: '48', sub: '+8 bulan ini', subColor: '#00A85A' },
    { icon: '🔥', label: 'Total Kalori', value: '18,420', sub: 'kal terbakar', subColor: '#FF2D78' },
    { icon: '⏱️', label: 'Total Durasi', value: '62', sub: 'jam latihan', subColor: '#FF2D78' },
    { icon: '📅', label: 'Rata-rata', value: '3.2', sub: 'sesi / minggu', subColor: '#00A85A' },
  ];

  return (
    <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
      {/* Date range tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', borderRadius: 16, padding: 6, border: '1.5px solid #FFD6E7', width: 'fit-content', boxShadow: '0 2px 12px rgba(255,45,120,0.06)' }}>
        {RANGE_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            background: activeTab === t ? '#FF2D78' : 'transparent',
            color: activeTab === t ? '#fff' : '#B08090',
            boxShadow: activeTab === t ? '0 4px 14px rgba(255,45,120,0.30)' : 'none',
            transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Weight chart card */}
      <div style={{
        background: '#fff', borderRadius: 24, padding: '28px 32px', marginBottom: 24,
        boxShadow: '0 8px 32px rgba(255,45,120,0.10)', border: '1.5px solid #FFD6E7'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 22, color: '#1A0A12' }}>
              Perkembangan Berat Badan
            </div>
            <div style={{ fontSize: 13, color: '#B08090', marginTop: 2 }}>12 bulan terakhir · kg</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#FF2D78' }}>73 kg</div>
            <div style={{ fontSize: 12, color: '#00A85A', fontWeight: 700 }}>▼ 2 kg dari awal</div>
          </div>
        </div>
        <WeightChart data={WEIGHT_DATA} months={WEIGHT_MONTHS} />
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((c, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 20, padding: '20px 22px',
            boxShadow: '0 6px 24px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7',
            transition: 'transform 0.22s, box-shadow 0.22s',
            animation: `fadeSlideUp 0.5s ${i * 0.07}s both`
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(255,45,120,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,45,120,0.08)'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 26, color: '#FF2D78' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: c.subColor, fontWeight: 700, marginTop: 2 }}>{c.sub}</div>
            <div style={{ fontSize: 12, color: '#B08090', marginTop: 1 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Body metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricBar label="Berat Badan" current="73 kg" target="70" unit="kg" pct={70} />
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1.5px solid #FFD6E7', boxShadow: '0 4px 16px rgba(255,45,120,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1A0A12', marginBottom: 8 }}>Indeks Massa Tubuh</div>
          <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 32, color: '#FF2D78' }}>22.4</div>
          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'rgba(0,201,122,0.1)', color: '#00A85A', border: '1px solid rgba(0,201,122,0.2)' }}>
            ✓ Normal
          </span>
        </div>
        <MetricBar label="Konsistensi Latihan" current="85%" target="100" unit="%" pct={85} badge="Luar Biasa!" />
      </div>

      {/* Achievements */}
      <div style={{ background: '#fff', borderRadius: 24, padding: '28px 32px', boxShadow: '0 8px 32px rgba(255,45,120,0.08)', border: '1.5px solid #FFD6E7' }}>
        <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 24, color: '#1A0A12', marginBottom: 6 }}>
          🏆 Pencapaian Kamu
        </div>
        <div style={{ fontSize: 13, color: '#B08090', marginBottom: 24 }}>
          {ACHIEVEMENTS_UNLOCKED.length} terbuka · {ACHIEVEMENTS_LOCKED.length} terkunci
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#00A85A', letterSpacing: 1.5, marginBottom: 12 }}>DIRAIH</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {ACHIEVEMENTS_UNLOCKED.map((a, i) => <AchievementCard key={i} item={a} />)}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 12 }}>TERKUNCI</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {ACHIEVEMENTS_LOCKED.map((a, i) => <AchievementCard key={i} item={a} locked />)}
        </div>
      </div>
    </div>
  );
}
