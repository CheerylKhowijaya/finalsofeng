import { NAV_ITEMS } from '../data/mockData';
import { IconHome, IconCalendar, IconSchedule, IconChart, IconSettings, IconDumbbell, IconCheck } from './Icons';

function IconLogout({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

const iconMap = {
  home: IconHome,
  calendar: IconCalendar,
  schedule: IconSchedule,
  chart: IconChart,
  settings: IconSettings,
};

export default function Sidebar({ activeScreen, setActiveScreen, onLogout, user }) {
  const initials = user?.initials || (user?.name ? user.name[0] : 'U');
  
  return (
    <aside style={{
      width: '260px', minHeight: '100vh', background: '#FFFFFF',
      borderRight: '1.5px solid #FFD6E7', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
      boxShadow: '4px 0 24px rgba(255,45,120,0.06)'
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1.5px solid #FFD6E7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(255,45,120,0.35)'
          }}>
            <IconDumbbell size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 20, color: '#1A0A12', letterSpacing: '-0.3px' }}>
              FitTrack
            </div>
            <div style={{ fontSize: 11, color: '#B08090', fontWeight: 500, marginTop: -2 }}>Premium Fitness</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.icon];
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 14, marginBottom: 4,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? 'rgba(255,45,120,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #FF2D78' : '3px solid transparent',
                color: isActive ? '#FF2D78' : '#6B3F52',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14, fontFamily: '"Plus Jakarta Sans",sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,45,120,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} color={isActive ? '#FF2D78' : '#B08090'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      <div style={{
        margin: '12px', padding: '16px', borderRadius: 20,
        background: 'linear-gradient(135deg,#FFF0F5,#FFF5F8)',
        border: '1.5px solid #FFD6E7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 15
            }}>{initials}</div>
            <div style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 10, height: 10, borderRadius: '50%',
              background: '#00C97A', border: '2px solid #fff'
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1A0A12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 11, color: '#B08090', marginTop: 1 }}>🎯 Target: {user?.targetWeight || '70'} kg</div>
          </div>
        </div>
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 10,
          background: 'rgba(0,201,122,0.1)', display: 'flex', alignItems: 'center', gap: 6
        }}>
          <IconCheck size={14} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#00A85A' }}>{user?.streak || 0} Hari Streak Aktif 🔥</span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            marginTop: 10, width: '100%', padding: '9px 12px',
            borderRadius: 10, border: '1.5px solid rgba(255,45,120,0.15)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            color: '#FF2D78', fontSize: 12, fontWeight: 700,
            fontFamily: '"Plus Jakarta Sans",sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.08)'; e.currentTarget.style.borderColor = '#FF2D78'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'; }}
        >
          <IconLogout size={14} />
          Keluar dari Akun
        </button>
      </div>
    </aside>
  );
}
