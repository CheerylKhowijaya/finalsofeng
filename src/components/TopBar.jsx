import { IconBell, IconSearch, IconFire } from './Icons';

const pageTitles = {
  dashboard: 'Dashboard',
  booking: 'Booking Latihan',
  jadwal: 'Jadwal Mingguan',
  progress: 'Progress & Analitik',
  settings: 'Pengaturan',
};

export default function TopBar({ activeScreen }) {
  return (
    <header style={{
      height: 64, background: '#fff',
      borderBottom: '1.5px solid #FFD6E7',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 16,
      position: 'fixed', top: 0, left: 260, right: 0, zIndex: 40,
      boxShadow: '0 2px 12px rgba(255,45,120,0.06)'
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: '"Playfair Display",serif', fontWeight: 700,
          fontSize: 22, color: '#1A0A12', letterSpacing: '-0.3px'
        }}>
          {pageTitles[activeScreen]}
        </h1>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 220 }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <IconSearch size={16} color="#B08090" />
        </div>
        <input
          type="text"
          placeholder="Cari latihan, trainer..."
          style={{
            width: '100%', padding: '8px 12px 8px 36px',
            borderRadius: 12, border: '1.5px solid #FFD6E7',
            background: '#FFF5F8', fontSize: 13,
            fontFamily: '"Plus Jakarta Sans",sans-serif',
            color: '#1A0A12', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#FF2D78'}
          onBlur={e => e.target.style.borderColor = '#FFD6E7'}
        />
      </div>

      {/* Streak badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20,
        background: 'rgba(255,45,120,0.08)',
        border: '1.5px solid rgba(255,45,120,0.2)',
      }}>
        <IconFire size={16} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FF2D78', fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
          12 Hari
        </span>
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative', width: 40, height: 40, borderRadius: 12,
        background: '#FFF5F8', border: '1.5px solid #FFD6E7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = '#FFD6E7'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F8'; }}
      >
        <IconBell size={18} color="#FF2D78" />
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 8, height: 8, borderRadius: '50%',
          background: '#FF2D78', border: '1.5px solid #fff'
        }} />
      </button>
    </header>
  );
}
