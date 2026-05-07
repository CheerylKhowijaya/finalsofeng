import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import './index.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './screens/Dashboard';
import Booking from './screens/Booking';
import Jadwal from './screens/Jadwal';
import Progress from './screens/Progress';
import Auth from './screens/Auth';
import TrainerDashboard from './screens/TrainerDashboard';
import AdminDashboard from './screens/AdminDashboard';

function SettingsScreen({ user }) {
  return (
    <div style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '36px', boxShadow: '0 8px 32px rgba(255,45,120,0.10)', border: '1.5px solid #FFD6E7', maxWidth: 600 }}>
        <h2 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: 26, color: '#1A0A12', marginBottom: 24 }}>Pengaturan Akun</h2>
        {[
          { label: 'Nama Lengkap', value: user?.name || '' },
          { label: 'Email', value: user?.email || '' },
          { label: 'Target Berat (kg)', value: user?.targetWeight || '70' },
          { label: 'Tinggi Badan (cm)', value: '175' }
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6B3F52', display: 'block', marginBottom: 8 }}>{item.label}</label>
            <input defaultValue={item.value}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid #FFD6E7', background: '#FFF5F8', fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 14, color: '#1A0A12', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#FF2D78'}
              onBlur={e => e.target.style.borderColor = '#FFD6E7'}
            />
          </div>
        ))}
        <button style={{ padding: '13px 32px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#FF2D78,#FF6FAE)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,45,120,0.35)' }}>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuth, setIsAuth]         = useState(false);
  const [userRole, setUserRole]     = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  // Convex login mutation
  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);

  const handleLogout = () => {
    setIsAuth(false);
    setUserRole(null);
    setCurrentUser(null);
    setActiveScreen('dashboard');
  };

  if (!isAuth) {
    return (
      <Auth
        onLogin={async (email, password) => {
          try {
            const user = await loginMutation({ email, password });
            setUserRole(user.role);
            setCurrentUser(user);
            setIsAuth(true);
          } catch (err) {
            alert(err.message); // Menampilkan "Password salah" atau "User tidak ditemukan"
          }
        }}
        onRegister={async (name, email, password, targetWeight, gender) => {
          try {
            const user = await registerMutation({ name, email, password, targetWeight, gender });
            setUserRole(user.role);
            setCurrentUser(user);
            setIsAuth(true);
          } catch (err) {
            alert(err.message);
          }
        }}
      />
    );
  }

  if (userRole === 'trainer') {
    return (
      <TrainerDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  if (userRole === 'admin') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
      />
    );
  }

  // Member view
  const screens = {
    dashboard: <Dashboard setActiveScreen={setActiveScreen} currentUser={currentUser} />,
    booking:   <Booking currentUser={currentUser} />,
    jadwal:    <Jadwal currentUser={currentUser} />,
    progress:  <Progress currentUser={currentUser} />,
    settings:  <SettingsScreen user={currentUser} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FFF0F5' }}>
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={handleLogout} user={currentUser} />
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar activeScreen={activeScreen} />
        <main style={{ marginTop: 64, padding: '32px', flex: 1, minHeight: 'calc(100vh - 64px)' }}>
          <div key={activeScreen} style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            {screens[activeScreen]}
          </div>
        </main>
      </div>
    </div>
  );
}
