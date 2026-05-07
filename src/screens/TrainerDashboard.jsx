import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { IconDumbbell, IconCheck, IconX } from '../components/Icons';


function IconInbox({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}
function IconCalendar2({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function IconStats({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
}
function IconLogout2({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

const TRAINER_NAV = [
  { id: 'requests', label: 'Permintaan Masuk', Icon: IconInbox },
  { id: 'schedule', label: 'Jadwal Saya',       Icon: IconCalendar2 },
  { id: 'stats',    label: 'Statistik',          Icon: IconStats },
];

function StatusBadge({ status }) {
  const cfg = {
    pending:   { bg: 'rgba(251,191,36,0.12)',  color: '#D97706', border: 'rgba(251,191,36,0.3)',  label: '🟡 Menunggu'   },
    confirmed: { bg: 'rgba(0,201,122,0.10)',   color: '#00A85A', border: 'rgba(0,201,122,0.25)', label: '✅ Diterima'   },
    rejected:  { bg: 'rgba(255,45,120,0.08)',  color: '#FF2D78', border: 'rgba(255,45,120,0.2)', label: '❌ Ditolak'    },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

function BookingCard({ booking, onAccept, onReject }) {
  const [loading, setLoading] = useState(null);
  const act = (fn, type) => { setLoading(type); setTimeout(() => { fn(); setLoading(null); }, 700); };
  const isPending = booking.status === 'pending';

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '20px 24px',
      border: `1.5px solid ${isPending ? 'rgba(251,191,36,0.3)' : '#FFD6E7'}`,
      boxShadow: isPending ? '0 4px 20px rgba(251,191,36,0.10)' : '0 2px 12px rgba(0,0,0,0.04)',
      marginBottom: 12, animation: 'fadeSlideUp 0.35s ease both',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isPending ? '0 4px 20px rgba(251,191,36,0.10)' : '0 2px 12px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Member avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 17,
        }}>{booking.memberInitials}</div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#1A0A12' }}>{booking.memberName}</span>
            <StatusBadge status={booking.status} />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#6B3F52' }}>📅 {booking.date}</span>
            <span style={{ fontSize: 13, color: '#6B3F52' }}>🕐 {booking.time} WIB</span>
            <span style={{ fontSize: 12, color: '#B08090' }}>Masuk: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
          </div>
        </div>

        {/* Actions for pending */}
        {isPending && (
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => act(onReject, 'reject')} disabled={!!loading} style={{
              width: 38, height: 38, borderRadius: 12, border: '1.5px solid rgba(255,45,120,0.3)',
              background: loading === 'reject' ? 'rgba(255,45,120,0.1)' : '#fff',
              color: '#FF2D78', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,45,120,0.08)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#fff'; }}
              title="Tolak"
            >
              {loading === 'reject' ? '⟳' : <IconX size={16} color="#FF2D78" />}
            </button>
            <button onClick={() => act(onAccept, 'accept')} disabled={!!loading} style={{
              width: 38, height: 38, borderRadius: 12, border: 'none',
              background: loading === 'accept' ? '#00A85A' : '#00C97A',
              color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,201,122,0.35)',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#00A85A'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#00C97A'; }}
              title="Terima"
            >
              {loading === 'accept' ? '⟳' : <IconCheck size={16} color="#fff" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrainerDashboard({ user, onLogout }) {
  const [active, setActive] = useState('requests');

  // ── Real-time Convex queries ──────────────────────────────────
  const myBookings = useQuery(
    api.bookings.getBookingsByTrainer,
    user.trainerId ? { trainerId: user.trainerId } : 'skip'
  ) ?? [];
  const updateStatus = useMutation(api.bookings.updateBookingStatus);

  const pendingCount    = myBookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');

  const handleAccept = (id) => updateStatus({ bookingId: id, status: 'confirmed' });
  const handleReject = (id) => updateStatus({ bookingId: id, status: 'rejected' });

  const gradList = [
    'linear-gradient(135deg,#FF2D78,#FF6FAE)',
    'linear-gradient(135deg,#00C97A,#00A85A)',
    'linear-gradient(135deg,#FF6FAE,#FFB3D1)',
    'linear-gradient(135deg,#00A85A,#00C97A)',
  ];
  const grad = gradList[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0FFF8', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, minHeight: '100vh', background: '#fff',
        borderRight: '1.5px solid rgba(0,201,122,0.2)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 50,
        boxShadow: '4px 0 24px rgba(0,201,122,0.08)',
      }}>
        {/* Logo */}
        <div style={{ padding: '26px 22px 20px', borderBottom: '1.5px solid rgba(0,201,122,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#00C97A,#00A85A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,201,122,0.35)' }}>
              <IconDumbbell size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 19, color: '#1A0A12' }}>FitTrack</div>
              <div style={{ fontSize: 11, color: '#00A85A', fontWeight: 700 }}>Trainer Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {TRAINER_NAV.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const showBadge = id === 'requests' && pendingCount > 0;
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 14, marginBottom: 4,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? 'rgba(0,201,122,0.10)' : 'transparent',
                borderLeft: isActive ? '3px solid #00C97A' : '3px solid transparent',
                color: isActive ? '#00A85A' : '#6B3F52',
                fontWeight: isActive ? 700 : 500, fontSize: 14,
                fontFamily: '"Plus Jakarta Sans",sans-serif', transition: 'all 0.2s',
                position: 'relative',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,201,122,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} color={isActive ? '#00C97A' : '#B08090'} />
                {label}
                {showBadge && (
                  <span style={{
                    marginLeft: 'auto', minWidth: 22, height: 22, borderRadius: 20,
                    background: '#FF2D78', color: '#fff', fontSize: 11, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                  }}>{pendingCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Trainer user card */}
        <div style={{ margin: '12px', padding: '16px', borderRadius: 20, background: 'linear-gradient(135deg,#F0FFF8,#E6FFF5)', border: '1.5px solid rgba(0,201,122,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>{user.initials}</div>
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#00C97A', border: '2px solid #fff' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1A0A12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#00A85A', fontWeight: 600 }}>🏋️ Trainer Aktif</div>
            </div>
          </div>
          <button onClick={onLogout} style={{
            marginTop: 10, width: '100%', padding: '9px 12px', borderRadius: 10,
            border: '1.5px solid rgba(255,45,120,0.15)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            color: '#FF2D78', fontSize: 12, fontWeight: 700,
            fontFamily: '"Plus Jakarta Sans",sans-serif', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.06)'; e.currentTarget.style.borderColor = '#FF2D78'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'; }}
          >
            <IconLogout2 size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ marginLeft: 260, flex: 1, padding: '36px 36px' }}>

        {/* ── TAB: Permintaan Masuk ── */}
        {active === 'requests' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 4 }}>
                Permintaan Booking
              </h1>
              <p style={{ color: '#6B3F52', fontSize: 14 }}>
                {pendingCount > 0
                  ? `${pendingCount} permintaan baru menunggu konfirmasimu`
                  : 'Tidak ada permintaan yang menunggu saat ini.'}
              </p>
            </div>

            {/* Summary chips */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Semua', count: myBookings.length, color: '#6B3F52', bg: '#FFF5F8' },
                { label: '🟡 Menunggu', count: myBookings.filter(b => b.status === 'pending').length, color: '#D97706', bg: 'rgba(251,191,36,0.10)' },
                { label: '✅ Diterima', count: myBookings.filter(b => b.status === 'confirmed').length, color: '#00A85A', bg: 'rgba(0,201,122,0.10)' },
                { label: '❌ Ditolak', count: myBookings.filter(b => b.status === 'rejected').length, color: '#FF2D78', bg: 'rgba(255,45,120,0.08)' },
              ].map((c, i) => (
                <div key={i} style={{ padding: '8px 18px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 13, fontWeight: 700, border: '1px solid transparent' }}>
                  {c.label} <span style={{ fontFamily: '"Fira Code",monospace', marginLeft: 4 }}>({c.count})</span>
                </div>
              ))}
            </div>

            {/* Pending first */}
            {myBookings.filter(b => b.status === 'pending').length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', letterSpacing: 1.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulseRing 1.8s infinite' }} />
                  MENUNGGU KONFIRMASI
                </div>
                {myBookings.filter(b => b.status === 'pending').map(b => (
                  <BookingCard key={b._id} booking={b} onAccept={() => handleAccept(b._id)} onReject={() => handleReject(b._id)} />
                ))}
              </div>
            )}

            {/* Confirmed */}
            {myBookings.filter(b => b.status !== 'pending').length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 12 }}>RIWAYAT</div>
                {myBookings.filter(b => b.status !== 'pending').map(b => (
                  <BookingCard key={b._id} booking={b} onAccept={() => {}} onReject={() => {}} />
                ))}
              </div>
            )}

            {myBookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <div style={{ fontWeight: 700, color: '#1A0A12', fontSize: 18, marginBottom: 8 }}>Belum ada booking</div>
                <div style={{ color: '#B08090', fontSize: 14 }}>Permintaan booking dari member akan muncul di sini.</div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Jadwal ── */}
        {active === 'schedule' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 4 }}>Jadwal Sesi Saya</h1>
            <p style={{ color: '#6B3F52', fontSize: 14, marginBottom: 28 }}>{confirmedBookings.length} sesi terkonfirmasi</p>

            {confirmedBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                <div style={{ fontWeight: 700, color: '#1A0A12', fontSize: 18 }}>Belum ada sesi terkonfirmasi</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {confirmedBookings.map(b => (
                  <div key={b._id} style={{
                    background: '#fff', borderRadius: 20, padding: '20px 24px',
                    border: '1.5px solid rgba(0,201,122,0.25)',
                    boxShadow: '0 4px 16px rgba(0,201,122,0.08)',
                    display: 'flex', alignItems: 'center', gap: 16,
                    animation: 'fadeSlideUp 0.35s ease both',
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 17 }}>{b.memberInitials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1A0A12' }}>{b.memberName}</div>
                      <div style={{ fontSize: 13, color: '#6B3F52' }}>📅 {b.date} · 🕐 {b.time} WIB</div>
                    </div>
                    <StatusBadge status="confirmed" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Statistik ── */}
        {active === 'stats' && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 30, color: '#1A0A12', marginBottom: 28 }}>Statistik Saya</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 600 }}>
              {[
                { icon: '👥', label: 'Total Klien', value: confirmedBookings.length, color: '#00C97A' },
                { icon: '📅', label: 'Sesi Bulan Ini', value: myBookings.filter(b => b.status === 'confirmed').length, color: '#FF2D78' },
                { icon: '⭐', label: 'Rating Rata-rata', value: '4.9', color: '#F59E0B' },
                { icon: '💰', label: 'Est. Pendapatan', value: `Rp ${(confirmedBookings.length * 150000).toLocaleString('id')}`, color: '#00A85A' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 22, padding: '24px', boxShadow: '0 4px 20px rgba(0,201,122,0.08)', border: '1.5px solid rgba(0,201,122,0.15)', animation: `fadeSlideUp 0.4s ${i * 0.07}s both` }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 28, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6B3F52', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
