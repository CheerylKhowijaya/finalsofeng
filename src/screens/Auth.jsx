import { useState } from 'react';
import { IconDumbbell, IconCheck } from '../components/Icons';


function IconEye({ open = true, size = 18 }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B08090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B08090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, icon, error, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#6B3F52', marginBottom: 7 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>{icon}</div>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '13px 44px 13px 44px', borderRadius: 14, fontSize: 14,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            border: `1.5px solid ${error ? '#FF2D78' : focused ? '#FF2D78' : '#FFD6E7'}`,
            background: focused ? '#FFF5F8' : '#FFF0F5', color: '#1A0A12', outline: 'none',
            transition: 'all 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(255,45,120,0.10)' : 'none',
          }} />
        {rightSlot && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{rightSlot}</div>}
      </div>
      {error && <div style={{ fontSize: 12, color: '#FF2D78', marginTop: 5, fontWeight: 600 }}>⚠ {error}</div>}
    </div>
  );
}

const ROLES = [
  { id: 'member',  label: 'Member',  icon: '👤', color: '#FF2D78', hint: 'Email bebas · Password 6+ karakter' },
  { id: 'trainer', label: 'Trainer', icon: '🏋️', color: '#00C97A', hint: 'andi@fittrack.com · trainer123' },
  { id: 'admin',   label: 'Admin',   icon: '👑', color: '#7C3AED', hint: 'admin@fittrack.com · admin123' },
];

const LEFT_FEATURES = [
  { icon: '🏋️', title: 'Trainer Profesional', desc: 'Latih bersama trainer bersertifikat terbaik' },
  { icon: '📊', title: 'Pantau Progres', desc: 'Grafik perkembangan berat & performa real-time' },
  { icon: '📅', title: 'Jadwal Fleksibel', desc: 'Booking sesi sesuai waktu kamu, kapan saja' },
  { icon: '🔥', title: 'Streak Motivasi', desc: 'Sistem streak harian untuk jaga konsistensi' },
];

export default function Auth({ onLogin, onRegister }) {
  const [mode, setMode]         = useState('login');
  const [role, setRole]         = useState('member');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [authError, setAuthError] = useState('');
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '', goal: '70', gender: 'Perempuan' });
  const [errors, setErrors]     = useState({});

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const selectedRole = ROLES.find(r => r.id === role);

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Nama tidak boleh kosong';
    if (!form.email.includes('@')) e.email = 'Email tidak valid';
    if (form.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (mode === 'register' && form.password !== form.confirm) e.confirm = 'Password tidak cocok';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setAuthError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin(form.email, form.password);
      } else {
        await onRegister(form.name, form.email, form.password, Number(form.goal), form.gender);
        setSuccess(true);
      }
    } catch (err) {
      setAuthError(err.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fillHint = () => {
    if (role === 'admin')   setForm(f => ({ ...f, email: 'admin@fittrack.com',  password: 'admin123'   }));
    if (role === 'trainer') setForm(f => ({ ...f, email: 'andi@fittrack.com',   password: 'trainer123' }));
    if (role === 'member')  setForm(f => ({ ...f, email: 'budi@email.com',      password: 'member123'  }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FFF0F5', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '42%', minHeight: '100vh', padding: '52px 48px',
        background: 'linear-gradient(160deg, #FF2D78 0%, #FF6FAE 55%, #FFB3D1 100%)',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56, zIndex: 1 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconDumbbell size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 26, color: '#fff' }}>FitTrack</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Premium Fitness</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ zIndex: 1, flex: 1 }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1.18, marginBottom: 14 }}>
            Mulai Perjalanan<br /><span style={{ fontStyle: 'italic' }}>Sehatmu</span> Hari Ini
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>
            Bergabung bersama <strong>10,000+</strong> member aktif yang telah mencapai target kebugaran bersama FitTrack.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {LEFT_FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, animation: `fadeSlideUp 0.4s ${i * 0.08}s both` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 40, zIndex: 1, padding: '18px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>
            "FitTrack benar-benar mengubah cara aku olahraga. Dalam 3 bulan turun 8 kg!"
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>S</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>Siska R. · Member</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Jan 2025 ⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 52px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'fadeSlideUp 0.45s ease both' }}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,201,122,0.1)', border: '3px solid #00C97A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <IconCheck size={36} color="#00C97A" />
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 28, color: '#1A0A12', marginBottom: 10 }}>Akun Berhasil Dibuat! 🎉</h2>
              <p style={{ color: '#B08090', fontSize: 14 }}>Selamat datang, {form.name}!<br />Mengarahkan ke dashboard...</p>
              <div style={{ marginTop: 20, height: 4, borderRadius: 4, background: '#FFD6E7', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#FF2D78,#00C97A)', animation: 'drawLine 1.8s ease forwards', borderRadius: 4 }} />
              </div>
            </div>
          ) : (
            <>
              {/* ── ROLE SELECTOR ── */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#B08090', letterSpacing: 1.5, marginBottom: 10 }}>MASUK SEBAGAI</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r.id} onClick={() => { setRole(r.id); setErrors({}); setForm(f => ({ ...f, email: '', password: '' })); }} style={{
                      padding: '11px 8px', borderRadius: 14, border: '2px solid',
                      borderColor: role === r.id ? r.color : '#FFD6E7',
                      background: role === r.id ? `${r.color}12` : '#fff',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.22s',
                      boxShadow: role === r.id ? `0 4px 16px ${r.color}30` : 'none',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: role === r.id ? r.color : '#6B3F52' }}>{r.label}</div>
                    </button>
                  ))}
                </div>

                {/* Hint / fill credentials */}
                <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 12, background: `${selectedRole.color}10`, border: `1px solid ${selectedRole.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#6B3F52' }}>💡 {selectedRole.hint}</span>
                  {role !== 'member' && (
                    <button onClick={fillHint} style={{ fontSize: 11, fontWeight: 700, color: selectedRole.color, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Isi otomatis
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Masuk / Daftar (only for member) */}
              <div style={{ display: 'flex', background: '#FFF0F5', borderRadius: 14, padding: 4, marginBottom: 24, border: '1.5px solid #FFD6E7' }}>
                {['login','register'].map(m => (
                  <button key={m} onClick={() => { setMode(m); setErrors({}); }} style={{
                    flex: 1, padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: 13, fontFamily: '"Plus Jakarta Sans", sans-serif',
                    background: mode === m ? (role === 'admin' ? '#7C3AED' : role === 'trainer' ? '#00C97A' : '#FF2D78') : 'transparent',
                    color: mode === m ? '#fff' : '#B08090',
                    boxShadow: mode === m ? `0 4px 14px ${selectedRole.color}40` : 'none',
                    transition: 'all 0.22s',
                    opacity: (role !== 'member' && m === 'register') ? 0.3 : 1,
                    pointerEvents: (role !== 'member' && m === 'register') ? 'none' : 'auto',
                  }}>
                    {m === 'login' ? '🔑 Masuk' : '✨ Daftar'}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 28, color: '#1A0A12', marginBottom: 4 }}>
                  {mode === 'login' ? 'Selamat Datang Kembali! 👋' : 'Buat Akun Baru ✨'}
                </h2>
                <p style={{ color: '#B08090', fontSize: 13 }}>
                  {mode === 'login' ? `Login sebagai ${selectedRole.label} — masukkan kredensial kamu.` : 'Isi data untuk memulai perjalanan fitnesmu.'}
                </p>
              </div>

              {/* ── FORM ── */}
              {mode === 'register' && (
                <InputField label="Nama Lengkap" placeholder="Contoh: Budi Santoso" value={form.name} onChange={set('name')} error={errors.name} icon={<span style={{ fontSize: 16 }}>👤</span>} />
              )}
              <InputField label="Alamat Email" type="email" placeholder="nama@email.com" value={form.email} onChange={set('email')} error={errors.email} icon={<span style={{ fontSize: 16 }}>✉️</span>} />
              <InputField label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password}
                icon={<span style={{ fontSize: 16 }}>🔒</span>}
                rightSlot={<span onClick={() => setShowPass(p => !p)}><IconEye open={showPass} /></span>}
              />

              {mode === 'register' && (
                <>
                  <InputField label="Konfirmasi Password" type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirm} onChange={set('confirm')} error={errors.confirm}
                    icon={<span style={{ fontSize: 16 }}>🔒</span>}
                    rightSlot={<span onClick={() => setShowConfirm(p => !p)}><IconEye open={showConfirm} /></span>}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[['Target Berat (kg)', 'goal', 'number', '70'], ['Gender', 'gender', 'select', '']].map(([lbl, field, type, def]) => (
                      <div key={field}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#6B3F52', marginBottom: 7 }}>{lbl}</label>
                        {type === 'select' ? (
                          <select value={form[field]} onChange={set(field)} style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #FFD6E7', background: '#FFF0F5', fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 14, color: '#1A0A12', outline: 'none' }}>
                            <option>Perempuan</option><option>Laki-laki</option>
                          </select>
                        ) : (
                          <input type={type} value={form[field]} onChange={set(field)} style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #FFD6E7', background: '#FFF0F5', fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 14, color: '#1A0A12', outline: 'none' }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: '#FF2D78', width: 15, height: 15 }} />
                    <span style={{ fontSize: 12, color: '#B08090', lineHeight: 1.5 }}>Saya menyetujui <span style={{ color: '#FF2D78', fontWeight: 700 }}>Syarat & Ketentuan</span> FitTrack.</span>
                  </label>
                </>
              )}

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: '#FF2D78', fontWeight: 700, cursor: 'pointer' }}>Lupa password?</span>
                </div>
              )}

              {/* Error from Convex */}
              {authError && (
                <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,45,120,0.08)', border: '1.5px solid rgba(255,45,120,0.2)', color: '#FF2D78', fontSize: 13, fontWeight: 600 }}>
                  ⚠ {authError}
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 16, border: 'none',
                background: loading ? '#FFB3D1' : `linear-gradient(135deg, ${selectedRole.color}, ${role === 'admin' ? '#9F67FF' : role === 'trainer' ? '#00E58B' : '#FF6FAE'})`,
                color: '#fff', fontWeight: 800, fontSize: 15,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 8px 24px ${selectedRole.color}45`,
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading
                  ? <><span style={{ display: 'inline-block', animation: 'spin-slow 1s linear infinite' }}>⟳</span> {mode === 'login' ? 'Masuk...' : 'Membuat akun...'}</>
                  : mode === 'login' ? `${selectedRole.icon} Masuk sebagai ${selectedRole.label}` : '✨ Buat Akun Sekarang'
                }
              </button>

              {/* Divider + Social */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#FFD6E7' }} />
                <span style={{ fontSize: 12, color: '#B08090', fontWeight: 600 }}>atau</span>
                <div style={{ flex: 1, height: 1, background: '#FFD6E7' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {['🇬  Google', '🍎  Apple'].map((s, i) => (
                  <button key={i} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1.5px solid #FFD6E7', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#6B3F52', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5F8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >{s}</button>
                ))}
              </div>

              {mode === 'login' && role === 'member' && (
                <div style={{ textAlign: 'center', fontSize: 13, color: '#B08090' }}>
                  Belum punya akun?{' '}
                  <span onClick={() => { setMode('register'); setErrors({}); }} style={{ color: '#FF2D78', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                    Daftar gratis →
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
