import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { IconCheck, IconX } from '../components/Icons';

function IconGrid({ s = 20 }) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function IconUsers({ s = 20 }) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconTrainer({ s = 20 }) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16M18 4v16M8 8h8M8 16h8M4 6h4M16 6h4M4 18h4M16 18h4"/></svg>; }
function IconBook({ s = 20 }) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function IconLogout2({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }

const ADMIN_NAV = [
  { id: 'overview',  label: 'Overview',          Icon: ({ color }) => <IconGrid s={18} /> },
  { id: 'members',   label: 'Manajemen Member',   Icon: ({ color }) => <IconUsers s={18} /> },
  { id: 'trainers',  label: 'Manajemen Trainer',  Icon: ({ color }) => <IconTrainer s={18} /> },
  { id: 'bookings',  label: 'Semua Booking',      Icon: ({ color }) => <IconBook s={18} /> },
];

const STATUS_FILTER = ['Semua', 'pending', 'confirmed', 'rejected'];

function StatusBadge({ status }) {
  const cfg = {
    pending:   { bg: 'rgba(251,191,36,0.12)', color: '#D97706', label: '🟡 Menunggu' },
    confirmed: { bg: 'rgba(0,201,122,0.10)',  color: '#00A85A', label: '✅ Diterima' },
    rejected:  { bg: 'rgba(255,45,120,0.08)', color: '#FF2D78', label: '❌ Ditolak'  },
  };
  const c = cfg[status] || cfg.pending;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>{c.label}</span>;
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E8D5E8' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#7C3AED', letterSpacing: 1.2, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F3E8FF', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAF5FF'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '14px 16px', fontSize: 13, color: '#1A0A12', verticalAlign: 'middle' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#B08090', fontSize: 14 }}>Tidak ada data ditemukan.</div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, delay = 0 }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 22, padding: '22px 24px',
      border: `1.5px solid ${color}25`,
      boxShadow: `0 6px 24px ${color}14`,
      animation: `fadeSlideUp 0.45s ${delay}s both`,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 24px ${color}14`; }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A0A12', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#B08090' }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [active, setActive]   = useState('overview');
  const [bFilter, setBFilter] = useState('Semua');
  const [searchM, setSearchM] = useState('');

  // ── Real-time Convex data ─────────────────────────────────────
  const bookings  = useQuery(api.bookings.getAllBookings)  ?? [];
  const allMembers = useQuery(api.members.getAllMembers)   ?? [];
  const allTrainers = useQuery(api.trainers.getAllTrainers) ?? [];
  const updateStatus = useMutation(api.bookings.updateBookingStatus);

  const pendingCount  = bookings.filter(b => b.status === 'pending').length;
  const todayBookings = bookings.filter(b => b.date.includes('25 April')).length;
  const revenue       = bookings.filter(b => b.status === 'confirmed').length * 150000;

  const filteredBookings = bookings.filter(b =>
    bFilter === 'Semua' || b.status === bFilter
  );
  const filteredMembers = allMembers.filter(m =>
    m.name.toLowerCase().includes(searchM.toLowerCase()) ||
    m.email.toLowerCase().includes(searchM.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF5FF', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, minHeight: '100vh', background: '#fff',
        borderRight: '1.5px solid #E8D5E8', display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 50,
        boxShadow: '4px 0 24px rgba(124,58,237,0.07)',
      }}>
        <div style={{ padding: '26px 22px 20px', borderBottom: '1.5px solid #E8D5E8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7C3AED,#9F67FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
              <span style={{ color: '#fff', fontSize: 18 }}>👑</span>
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 19, color: '#1A0A12' }}>FitTrack</div>
              <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {ADMIN_NAV.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const showBadge = id === 'bookings' && pendingCount > 0;
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 14, marginBottom: 4,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? 'rgba(124,58,237,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
                color: isActive ? '#7C3AED' : '#6B3F52',
                fontWeight: isActive ? 700 : 500, fontSize: 14,
                fontFamily: '"Plus Jakarta Sans",sans-serif', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(124,58,237,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: isActive ? '#7C3AED' : '#B08090' }}><Icon /></span>
                {label}
                {showBadge && <span style={{ marginLeft: 'auto', minWidth: 22, height: 22, borderRadius: 20, background: '#FF2D78', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{pendingCount}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ margin: '12px', padding: '16px', borderRadius: 20, background: 'linear-gradient(135deg,#FAF5FF,#F3E8FF)', border: '1.5px solid #E8D5E8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#9F67FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>AF</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1A0A12' }}>Admin FitTrack</div>
              <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>👑 Super Admin</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid rgba(255,45,120,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#FF2D78', fontSize: 12, fontWeight: 700, fontFamily: '"Plus Jakarta Sans",sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <IconLogout2 size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: 260, flex: 1, padding: '36px 36px' }}>

        {/* ── OVERVIEW ── */}
        {active === 'overview' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 4 }}>Overview Sistem</h1>
              <p style={{ color: '#6B3F52', fontSize: 14 }}>Selamat datang, Admin. Berikut ringkasan aktivitas FitTrack hari ini.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
              <StatCard icon="👥" label="Total Member"      value={allMembers.length}   sub="aktif di platform"                      color="#7C3AED" delay={0}    />
              <StatCard icon="🏋️" label="Total Trainer"     value={allTrainers.length}  sub="trainer terdaftar"                      color="#00C97A" delay={0.06} />
              <StatCard icon="📋" label="Booking Hari Ini"  value={todayBookings}        sub={`${pendingCount} menunggu konfirmasi`}  color="#FF2D78" delay={0.12} />
              <StatCard icon="💰" label="Pendapatan Bulan"  value={`Rp ${(revenue/1000000).toFixed(1)}jt`} sub="estimasi bulan ini" color="#F59E0B" delay={0.18} />
            </div>

            {/* Recent bookings */}
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid #E8D5E8', boxShadow: '0 4px 20px rgba(124,58,237,0.06)', marginBottom: 24 }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid #F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 18, color: '#1A0A12' }}>Booking Terbaru</div>
                <button onClick={() => setActive('bookings')} style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED', border: 'none', background: 'none', cursor: 'pointer' }}>Lihat semua →</button>
              </div>
              <div style={{ padding: '0 28px' }}>
                <Table
                  headers={['MEMBER', 'TRAINER', 'TANGGAL', 'JAM', 'STATUS']}
                  rows={bookings.slice(0, 5).map(b => [
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>{b.memberInitials}</div>
                      <span style={{ fontWeight: 600 }}>{b.memberName}</span>
                    </div>,
                    b.trainerName,
                    b.date,
                    b.time,
                    <StatusBadge status={b.status} />
                  ])}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── MEMBERS ── */}
        {active === 'members' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 2 }}>Manajemen Member</h1>
                <p style={{ color: '#6B3F52', fontSize: 14 }}>{allMembers.length} member terdaftar</p>
              </div>
              <input value={searchM} onChange={e => setSearchM(e.target.value)} placeholder="🔍  Cari member..." style={{ padding: '10px 16px', borderRadius: 14, border: '1.5px solid #E8D5E8', background: '#FAF5FF', fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 13, outline: 'none', width: 220 }}
                onFocus={e => e.target.style.borderColor = '#7C3AED'} onBlur={e => e.target.style.borderColor = '#E8D5E8'} />
            </div>
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid #E8D5E8', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
              <Table
                headers={['MEMBER', 'EMAIL', 'BERGABUNG', 'STREAK', 'TOTAL SESI', 'STATUS', 'AKSI']}
                rows={filteredMembers.map(m => [
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{(m.name||'?')[0]}</div>
                    <span style={{ fontWeight: 700 }}>{m.name}</span>
                  </div>,
                  <span style={{ color: '#B08090' }}>{m.email}</span>,
                  m.joinDate,
                  <span style={{ fontWeight: 700, color: '#FF2D78' }}>🔥 {m.streak} hari</span>,
                  <span style={{ fontFamily: '"Fira Code",monospace', fontWeight: 700 }}>{m.totalSessions}</span>,
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.status === 'Aktif' ? 'rgba(0,201,122,0.10)' : 'rgba(255,45,120,0.08)', color: m.status === 'Aktif' ? '#00A85A' : '#FF2D78' }}>{m.status}</span>,
                  <button style={{ padding: '5px 14px', borderRadius: 10, border: '1.5px solid #E8D5E8', background: '#FAF5FF', color: '#7C3AED', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Detail</button>,
                ])}
              />
            </div>
          </div>
        )}

        {/* ── TRAINERS ── */}
        {active === 'trainers' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 2 }}>Manajemen Trainer</h1>
              <p style={{ color: '#6B3F52', fontSize: 14 }}>{allTrainers.length} trainer aktif</p>
            </div>
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid #E8D5E8', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
              <Table
                headers={['TRAINER', 'SPESIALISASI', 'RATING', 'TOTAL KLIEN', 'SLOT TERSEDIA', 'STATUS', 'AKSI']}
                rows={allTrainers.map((t, idx) => {
                  const tBookings = bookings.filter(b => b.trainerId === t._id && b.status === 'confirmed');
                  const grads = ['linear-gradient(135deg,#FF2D78,#FF6FAE)', 'linear-gradient(135deg,#00C97A,#00A85A)', 'linear-gradient(135deg,#FF6FAE,#FFB3D1)', 'linear-gradient(135deg,#00A85A,#00C97A)'];
                  return [
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: grads[idx%4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>{t.initials}</div>
                      <span style={{ fontWeight: 700 }}>{t.name}</span>
                    </div>,
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(255,45,120,0.08)', color: '#FF2D78' }}>{t.specialty}</span>,
                    <span style={{ fontWeight: 700, color: '#F59E0B' }}>⭐ {t.rating}</span>,
                    <span style={{ fontFamily: '"Fira Code",monospace', fontWeight: 700 }}>{tBookings.length}</span>,
                    <span style={{ fontWeight: 700, color: '#00A85A' }}>{t.slots} slot</span>,
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(0,201,122,0.10)', color: '#00A85A' }}>Aktif</span>,
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '5px 12px', borderRadius: 10, border: '1.5px solid #E8D5E8', background: '#FAF5FF', color: '#7C3AED', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    </div>,
                  ];
                })}
              />
            </div>
          </div>
        )}

        {/* ── ALL BOOKINGS ── */}
        {active === 'bookings' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 2 }}>Semua Booking</h1>
                <p style={{ color: '#6B3F52', fontSize: 14 }}>{bookings.length} total booking · {pendingCount} menunggu konfirmasi</p>
              </div>
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {STATUS_FILTER.map(f => (
                <button key={f} onClick={() => setBFilter(f)} style={{
                  padding: '8px 18px', borderRadius: 20, border: '1.5px solid',
                  borderColor: bFilter === f ? '#7C3AED' : '#E8D5E8',
                  background: bFilter === f ? '#7C3AED' : '#fff',
                  color: bFilter === f ? '#fff' : '#6B3F52',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                }}>{f === 'Semua' ? `Semua (${bookings.length})` : f === 'pending' ? `🟡 Menunggu` : f === 'confirmed' ? '✅ Diterima' : '❌ Ditolak'}</button>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid #E8D5E8', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
              <Table
                headers={['MEMBER', 'TRAINER', 'TANGGAL', 'JAM', 'STATUS', 'AKSI ADMIN']}
                rows={filteredBookings.map(b => [
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>{b.memberInitials}</div>
                    <span style={{ fontWeight: 600 }}>{b.memberName}</span>
                  </div>,
                  b.trainerName,
                  b.date,
                  b.time,
                  <StatusBadge status={b.status} />,
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.status !== 'confirmed' && (
                      <button onClick={() => updateStatus({ bookingId: b._id, status: 'confirmed' })} style={{ padding: '4px 10px', borderRadius: 8, border: 'none', background: '#00C97A', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                        ✓ Approve
                      </button>
                    )}
                    {b.status !== 'rejected' && (
                      <button onClick={() => updateStatus({ bookingId: b._id, status: 'rejected' })} style={{ padding: '4px 10px', borderRadius: 8, border: '1.5px solid rgba(255,45,120,0.3)', background: '#fff', color: '#FF2D78', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                        ✗ Cancel
                      </button>
                    )}
                  </div>,
                ])}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
