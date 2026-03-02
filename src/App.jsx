import { useState, useEffect, useRef, useCallback } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    :root {
      --bg: #0a0a0f;
      --surface: #13131a;
      --surface2: #1c1c26;
      --border: #2a2a38;
      --accent: #e8ff47;
      --accent2: #7c5cff;
      --red: #ff4545;
      --text: #f0f0f8;
      --muted: #6b6b80;
      --hover: #1e1e2c;
      --radius: 12px;
      --font-display: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
    }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sv-app { display: flex; flex-direction: column; min-height: 100vh; }

    /* NAVBAR */
    .sv-navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 60px;
      background: rgba(10,10,15,0.94);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(16px);
      position: sticky; top: 0; z-index: 100;
    }
    .sv-logo {
      font-family: var(--font-display); font-weight: 800; font-size: 1.4rem;
      letter-spacing: -0.5px; color: var(--text); cursor: pointer;
    }
    .sv-logo span { color: var(--accent); }
    .sv-nav-tabs { display: flex; gap: 0.25rem; }
    .sv-nav-tab {
      padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
      color: var(--muted); cursor: pointer; transition: all 0.2s;
      background: none; border: none; font-family: var(--font-body);
    }
    .sv-nav-tab:hover { color: var(--text); background: var(--surface2); }
    .sv-nav-tab.active { color: var(--accent); background: var(--surface2); }
    .sv-nav-right { display: flex; align-items: center; gap: 1rem; }

    /* BUTTONS */
    .sv-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.5rem 1.1rem; border-radius: 8px;
      font-family: var(--font-body); font-weight: 500; font-size: 0.875rem;
      cursor: pointer; transition: all 0.2s; border: none;
    }
    .sv-btn-primary { background: var(--accent); color: #0a0a0f; }
    .sv-btn-primary:hover { background: #d4eb2e; transform: translateY(-1px); }
    .sv-btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
    .sv-btn-ghost:hover { background: var(--hover); border-color: var(--muted); }
    .sv-btn-danger { background: rgba(255,69,69,0.12); color: var(--red); border: 1px solid rgba(255,69,69,0.25); }
    .sv-btn-danger:hover { background: rgba(255,69,69,0.2); }
    .sv-btn-sm { padding: 0.35rem 0.8rem; font-size: 0.8rem; }
    .sv-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    /* AVATAR */
    .sv-avatar-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent2); border: none; cursor: pointer;
      overflow: hidden; display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 700; font-size: 0.875rem;
      color: #fff; transition: transform 0.2s;
    }
    .sv-avatar-btn:hover { transform: scale(1.08); }
    .sv-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }

    /* DROPDOWN */
    .sv-dropdown { position: relative; }
    .sv-dropdown-menu {
      position: absolute; top: calc(100% + 8px); right: 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 0.5rem; min-width: 180px;
      z-index: 150; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: slideUp 0.15s ease;
    }
    .sv-dropdown-item {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.6rem 0.75rem; border-radius: 7px;
      font-size: 0.875rem; color: var(--text);
      cursor: pointer; transition: background 0.15s;
      background: none; border: none; width: 100%; text-align: left;
      font-family: var(--font-body);
    }
    .sv-dropdown-item:hover { background: var(--surface2); }
    .sv-dropdown-item.red { color: var(--red); }
    .sv-dropdown-divider { height: 1px; background: var(--border); margin: 0.35rem 0; }

    /* AUTH PAGE */
    .sv-auth-page {
      display: flex; align-items: center; justify-content: center;
      padding: 2rem; min-height: calc(100vh - 60px);
      position: relative; overflow: hidden; flex: 1;
    }
    .sv-auth-bg {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 70% 30%, rgba(124,92,255,0.14) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 30% 70%, rgba(232,255,71,0.07) 0%, transparent 50%);
    }
    .sv-auth-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 2.5rem;
      width: 100%; max-width: 440px;
      position: relative; z-index: 1;
      animation: slideUp 0.4s ease;
    }
    .sv-auth-card h2 {
      font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem;
    }
    .sv-auth-card p { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }
    .sv-auth-tabs {
      display: flex; gap: 0.5rem; margin-bottom: 2rem;
      background: var(--surface2); border-radius: 10px; padding: 0.3rem;
    }
    .sv-auth-tab {
      flex: 1; padding: 0.5rem; border-radius: 7px;
      font-size: 0.875rem; font-weight: 500;
      border: none; cursor: pointer; transition: all 0.2s;
      background: none; color: var(--muted); font-family: var(--font-body);
    }
    .sv-auth-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }

    /* FORMS */
    .sv-form-group { margin-bottom: 1rem; }
    .sv-form-label { display: block; font-size: 0.8rem; font-weight: 500; color: var(--muted); margin-bottom: 0.4rem; letter-spacing: 0.3px; }
    .sv-form-input {
      width: 100%; padding: 0.7rem 1rem;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text);
      font-family: var(--font-body); font-size: 0.9rem;
      transition: border-color 0.2s; outline: none;
    }
    .sv-form-input:focus { border-color: var(--accent2); }
    .sv-form-input[type="file"] { padding: 0.55rem 1rem; }
    .sv-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .sv-form-error { color: var(--red); font-size: 0.8rem; margin-top: 0.75rem; }
    .sv-form-success { color: var(--accent); font-size: 0.8rem; margin-top: 0.75rem; }

    /* LAYOUT */
    .sv-home-layout { display: flex; gap: 0; flex: 1; }
    .sv-sidebar {
      width: 220px; flex-shrink: 0;
      background: var(--surface); border-right: 1px solid var(--border);
      padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.25rem;
      position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto;
    }
    .sv-sidebar-label {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
      color: var(--muted); padding: 0.5rem 0.75rem; margin-top: 0.5rem;
    }
    .sv-sidebar-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.6rem 0.75rem; border-radius: 8px;
      font-size: 0.875rem; font-weight: 400; color: var(--muted);
      cursor: pointer; transition: all 0.2s;
      background: none; border: none; text-align: left; width: 100%;
      font-family: var(--font-body);
    }
    .sv-sidebar-item:hover { background: var(--surface2); color: var(--text); }
    .sv-sidebar-item.active { background: rgba(232,255,71,0.08); color: var(--accent); }
    .sv-sidebar-item.danger { color: var(--red); margin-top: auto; }

    .sv-main-content { flex: 1; padding: 2rem; overflow-y: auto; }

    /* SECTION HEADER */
    .sv-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .sv-section-title { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; }

    /* VIDEO GRID */
    .sv-video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .sv-video-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
      cursor: pointer; transition: all 0.25s; animation: fadeIn 0.3s ease;
    }
    .sv-video-card:hover { border-color: var(--muted); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    .sv-video-thumb { aspect-ratio: 16/9; background: var(--surface2); position: relative; overflow: hidden; }
    .sv-video-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .sv-video-thumb-placeholder {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--muted);
    }
    .sv-private-badge {
      position: absolute; top: 8px; left: 8px;
      background: rgba(255,69,69,0.85); color: #fff; font-size: 0.65rem; font-weight: 600;
      padding: 2px 7px; border-radius: 4px;
    }
    .sv-video-info { padding: 0.875rem; }
    .sv-video-title {
      font-weight: 500; font-size: 0.9rem; line-height: 1.4; margin-bottom: 0.3rem;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .sv-video-meta { font-size: 0.78rem; color: var(--muted); }
    .sv-video-actions { padding: 0 0.875rem 0.875rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }

    /* EMPTY STATE */
    .sv-empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); grid-column: 1/-1; }
    .sv-empty-state svg { margin-bottom: 1rem; opacity: 0.4; }
    .sv-empty-state h3 { font-family: var(--font-display); font-size: 1.1rem; color: var(--text); margin-bottom: 0.5rem; }

    /* TWEETS */
    .sv-tweets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .sv-tweet-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.25rem; transition: border-color 0.2s;
      animation: fadeIn 0.3s ease;
    }
    .sv-tweet-card:hover { border-color: var(--muted); }
    .sv-tweet-content { font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.75rem; }
    .sv-tweet-footer { display: flex; align-items: center; justify-content: space-between; }
    .sv-tweet-date { font-size: 0.75rem; color: var(--muted); }
    .sv-tweet-actions { display: flex; gap: 0.5rem; }
    .sv-tweet-compose {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.5rem;
    }
    .sv-tweet-textarea {
      width: 100%; background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-family: var(--font-body); font-size: 0.9rem;
      padding: 0.75rem 1rem; resize: vertical; min-height: 80px;
      outline: none; margin-bottom: 0.75rem;
    }
    .sv-tweet-textarea:focus { border-color: var(--accent2); }

    /* MODAL */
    .sv-modal-overlay {
      display: flex; position: fixed; inset: 0;
      background: rgba(0,0,0,0.75); z-index: 200;
      align-items: center; justify-content: center;
      padding: 1rem; backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    .sv-modal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 2rem;
      width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.3s ease;
    }
    .sv-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .sv-modal-title { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; }
    .sv-modal-close {
      background: var(--surface2); border: none; border-radius: 8px;
      color: var(--muted); cursor: pointer; padding: 0.4rem;
      transition: all 0.2s; display: flex;
    }
    .sv-modal-close:hover { color: var(--text); background: var(--hover); }

    /* PROFILE */
    .sv-profile-header { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 2rem; }
    .sv-profile-cover { height: 150px; background: linear-gradient(135deg, var(--accent2), #1a1a2e); position: relative; }
    .sv-profile-cover img { width: 100%; height: 100%; object-fit: cover; }
    .sv-profile-info { padding: 1.5rem; display: flex; align-items: flex-end; gap: 1rem; margin-top: -40px; }
    .sv-profile-avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--accent2); border: 3px solid var(--surface);
      overflow: hidden; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 700; font-size: 1.75rem; color: #fff;
    }
    .sv-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .sv-profile-name { font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; }
    .sv-profile-username { color: var(--muted); font-size: 0.875rem; }
    .sv-profile-stats { display: flex; gap: 2rem; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--border); }
    .sv-stat { text-align: center; }
    .sv-stat-num { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; }
    .sv-stat-label { font-size: 0.75rem; color: var(--muted); }

    /* SETTINGS */
    .sv-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .sv-settings-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
    .sv-settings-card h3 { font-family: var(--font-display); font-weight: 600; margin-bottom: 1rem; }

    /* TOAST */
    .sv-toast-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 300; display: flex; flex-direction: column; gap: 0.5rem; }
    .sv-toast {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 0.75rem 1.25rem; font-size: 0.875rem;
      display: flex; align-items: center; gap: 0.5rem;
      animation: toastIn 0.3s ease; min-width: 250px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .sv-toast.success { border-left: 3px solid var(--accent); }
    .sv-toast.error { border-left: 3px solid var(--red); }

    /* SPINNER */
    .sv-spinner {
      width: 20px; height: 20px; border: 2px solid var(--border);
      border-top-color: var(--accent); border-radius: 50%;
      animation: spin 0.6s linear infinite; display: inline-block; flex-shrink: 0;
    }

    /* LOADING */
    .sv-loading { display: flex; align-items: center; gap: 0.75rem; color: var(--muted); padding: 2rem 0; }

    @media (max-width: 768px) {
      .sv-sidebar { display: none; }
      .sv-form-row { grid-template-columns: 1fr; }
      .sv-nav-tabs { display: none; }
      .sv-settings-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .sv-profile-stats { flex-wrap: wrap; gap: 1rem; }
    }
  `;
  document.head.appendChild(style);
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BASE = "http://localhost:8000/api/v1";

// ─── API ──────────────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  try {
    const res = await fetch(BASE + url, {
      credentials: "include",
      ...opts,
      headers: {
        // Don't set Content-Type for FormData (browser sets it with boundary)
        ...(opts.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...opts.headers,
      },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (e) {
    console.error("API Error:", e);
    return { ok: false, data: { message: "Network error. Is the server running?" } };
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icons = {
  Home: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Chat: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  User: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Clock: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Logout: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Plus: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="#e8ff47" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Err: () => <svg width="14" height="14" fill="none" stroke="#ff4545" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Video: () => <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Play: () => <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

// ─── TOAST SYSTEM ────────────────────────────────────────────────────────────
let _setToasts = null;
function toast(msg, type = "success") {
  if (_setToasts) {
    const id = Date.now();
    _setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => _setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }
}

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _setToasts = setToasts; return () => { _setToasts = null; }; }, []);
  return (
    <div className="sv-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`sv-toast ${t.type}`}>
          {t.type === "success" ? <Icons.Check /> : <Icons.Err />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, maxWidth = 500, children }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sv-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sv-modal" style={{ maxWidth }}>
        <div className="sv-modal-header">
          <span className="sv-modal-title">{title}</span>
          <button className="sv-modal-close" onClick={onClose}><Icons.X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── SPINNER / LOADING ───────────────────────────────────────────────────────
function Loading({ text = "Loading..." }) {
  return <div className="sv-loading"><div className="sv-spinner" />{text}</div>;
}

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAvatar, setRegAvatar] = useState(null);
  const [regCover, setRegCover] = useState(null);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  async function doLogin(e) {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return setLoginError("Please fill all fields");
    setLoginLoading(true); setLoginError("");

    // Send both username and email so backend can match whichever field it uses
    const isEmail = loginUsername.includes("@");
    const body = isEmail
      ? { email: loginUsername, password: loginPassword }
      : { username: loginUsername, password: loginPassword };

    const { ok, data } = await apiFetch("/users/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoginLoading(false);
    if (ok) {
      const user = data.data?.user || data.data;
      onLogin(user);
    } else {
      setLoginError(data.message || "Login failed");
    }
  }

  async function doRegister(e) {
    e.preventDefault();
    if (!regFullName || !regUsername || !regEmail || !regPassword || !regAvatar)
      return setRegError("Please fill all required fields");
    const fd = new FormData();
    fd.append("fullName", regFullName);
    fd.append("username", regUsername);
    fd.append("email", regEmail);
    fd.append("password", regPassword);
    fd.append("avatar", regAvatar);
    if (regCover) fd.append("coverimage", regCover);
    setRegLoading(true); setRegError(""); setRegSuccess("");
    const { ok: regOk, data: regData } = await apiFetch("/users/register", { method: "POST", body: fd });
    if (!regOk) {
      setRegLoading(false);
      return setRegError(regData.message || "Registration failed");
    }
    // Small delay to ensure MongoDB write is complete before login
    await new Promise(resolve => setTimeout(resolve, 800));
    setRegSuccess("Account created! Logging you in...");
    const { ok: loginOk, data: loginData } = await apiFetch("/users/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: regUsername, password: regPassword }),
    });
    setRegLoading(false);
    if (loginOk) {
      toast("Welcome to StreamVault, " + regUsername + "!");
      onLogin(loginData.data?.user || loginData.data);
    } else {
      setRegSuccess("Account created! Please sign in.");
      toast("Account created! Please sign in.");
      setTimeout(() => setTab("login"), 1200);
    }
  }

  return (
    <div className="sv-auth-page">
      <div className="sv-auth-bg" />
      <div className="sv-auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to your StreamVault account</p>
        <div className="sv-auth-tabs">
          <button className={`sv-auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`sv-auth-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab === "login" ? (
          <form onSubmit={doLogin}>
            <div className="sv-form-group">
              <label className="sv-form-label">Username or Email</label>
              <input className="sv-form-input" type="text" placeholder="Enter username or email" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Password</label>
              <input className="sv-form-input" type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            {loginError && <div className="sv-form-error">{loginError}</div>}
            <button type="submit" className="sv-btn sv-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} disabled={loginLoading}>
              {loginLoading ? <><div className="sv-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={doRegister}>
            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">Full Name</label>
                <input className="sv-form-input" type="text" placeholder="John Doe" value={regFullName} onChange={e => setRegFullName(e.target.value)} />
              </div>
              <div className="sv-form-group">
                <label className="sv-form-label">Username</label>
                <input className="sv-form-input" type="text" placeholder="johndoe" value={regUsername} onChange={e => setRegUsername(e.target.value)} />
              </div>
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Email</label>
              <input className="sv-form-input" type="email" placeholder="john@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Password</label>
              <input className="sv-form-input" type="password" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            </div>
            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">Avatar *</label>
                <input className="sv-form-input" type="file" accept="image/*" onChange={e => setRegAvatar(e.target.files[0])} />
              </div>
              <div className="sv-form-group">
                <label className="sv-form-label">Cover Image</label>
                <input className="sv-form-input" type="file" accept="image/*" onChange={e => setRegCover(e.target.files[0])} />
              </div>
            </div>
            {regError && <div className="sv-form-error">{regError}</div>}
            {regSuccess && <div className="sv-form-success">{regSuccess}</div>}
            <button type="submit" className="sv-btn sv-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} disabled={regLoading}>
              {regLoading ? <><div className="sv-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating...</> : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────
function VideoCard({ video, showActions, onEdit, onTogglePublish, onDelete }) {
  return (
    <div className="sv-video-card">
      <div className="sv-video-thumb">
        {video.thumbnail
          ? <img src={video.thumbnail} alt={video.title} loading="lazy" />
          : <div className="sv-video-thumb-placeholder"><Icons.Play /></div>}
        {!video.isPublished && <span className="sv-private-badge">Private</span>}
      </div>
      <div className="sv-video-info">
        <div className="sv-video-title">{video.title || "Untitled"}</div>
        <div className="sv-video-meta">{video.views || 0} views · {video.createdAt ? formatDate(video.createdAt) : ""}</div>
      </div>
      {showActions && (
        <div className="sv-video-actions">
          <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => onEdit(video)}>Edit</button>
          <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => onTogglePublish(video)}>
            {video.isPublished ? "Make Private" : "Make Public"}
          </button>
          <button className="sv-btn sv-btn-danger sv-btn-sm" onClick={() => onDelete(video._id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

// ─── HOME SECTION ─────────────────────────────────────────────────────────────
function HomeSection({ onOpenUpload }) {
  const [videos, setVideos] = useState(null);
  const [editVideo, setEditVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editThumb, setEditThumb] = useState(null);

  const load = useCallback(async () => {
    const { ok, data } = await apiFetch("/video/my-videos");
    setVideos(ok && data.data?.length ? data.data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(videoId) {
    if (!confirm("Delete this video?")) return;
    const { ok, data } = await apiFetch("/video/delete-video", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (ok) { toast("Video deleted"); load(); }
    else toast(data.message || "Failed to delete", "error");
  }

  async function handleTogglePublish(video) {
    const endpoint = video.isPublished ? "/video/make-private" : "/video/make-public";
    const { ok, data } = await apiFetch(endpoint, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: video._id }),
    });
    if (ok) { toast(video.isPublished ? "Video set to private" : "Video set to public"); load(); }
    else toast(data.message || "Failed", "error");
  }

  async function saveEdits() {
    if (editTitle) {
      const { ok, data } = await apiFetch("/video/update-title", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: editVideo._id, title: editTitle }),
      });
      if (!ok) return toast(data.message || "Failed to update title", "error");
    }
    if (editThumb) {
      const fd = new FormData();
      fd.append("videoId", editVideo._id);
      fd.append("thumbnailFile", editThumb);
      const { ok, data } = await apiFetch("/video/update-thumbnail", { method: "PATCH", body: fd });
      if (!ok) return toast(data.message || "Failed to update thumbnail", "error");
    }
    toast("Video updated!"); setEditVideo(null); load();
  }

  return (
    <>
      <div className="sv-section-header">
        <h2 className="sv-section-title">My Videos</h2>
        <button className="sv-btn sv-btn-primary" onClick={onOpenUpload}>
          <Icons.Plus /> Upload Video
        </button>
      </div>
      <div className="sv-video-grid">
        {videos === null ? (
          <Loading text="Loading videos..." />
        ) : videos.length === 0 ? (
          <div className="sv-empty-state">
            <Icons.Video />
            <h3>No videos yet</h3>
            <p>Upload your first video to get started</p>
            <button className="sv-btn sv-btn-primary" style={{ marginTop: "1rem" }} onClick={onOpenUpload}>Upload Video</button>
          </div>
        ) : videos.map(v => (
          <VideoCard key={v._id} video={v} showActions
            onEdit={v => { setEditVideo(v); setEditTitle(v.title || ""); setEditThumb(null); }}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Modal open={!!editVideo} onClose={() => setEditVideo(null)} title="Edit Video">
        <div className="sv-form-group">
          <label className="sv-form-label">New Title</label>
          <input className="sv-form-input" type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
        </div>
        <div className="sv-form-group">
          <label className="sv-form-label">New Thumbnail</label>
          <input className="sv-form-input" type="file" accept="image/*" onChange={e => setEditThumb(e.target.files[0])} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
          <button className="sv-btn sv-btn-ghost" onClick={() => setEditVideo(null)}>Cancel</button>
          <button className="sv-btn sv-btn-primary" onClick={saveEdits}>Save</button>
        </div>
      </Modal>
    </>
  );
}

// ─── TWEETS SECTION ───────────────────────────────────────────────────────────
function TweetsSection() {
  const [tweets, setTweets] = useState(null);
  const [content, setContent] = useState("");
  const [editTweet, setEditTweet] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    const { ok, data } = await apiFetch("/users/get-tweets");
    setTweets(ok && data.data?.length ? data.data : []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function postTweet() {
    if (!content.trim()) return toast("Tweet cannot be empty", "error");
    if (content.length > 280) return toast("Tweet too long", "error");
    setPosting(true);
    const { ok, data } = await apiFetch("/tweet/upload-tweet", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setPosting(false);
    if (ok) { toast("Tweet posted!"); setContent(""); load(); }
    else toast(data.message || "Failed to post tweet", "error");
  }

  async function deleteTweet(tweetId) {
    if (!confirm("Delete this tweet?")) return;
    const { ok, data } = await apiFetch("/tweet/delete-tweet", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetId }),
    });
    if (ok) { toast("Tweet deleted"); load(); }
    else toast(data.message || "Failed", "error");
  }

  async function saveEdit() {
    if (!editContent.trim()) return toast("Tweet cannot be empty", "error");
    const { ok, data } = await apiFetch("/tweet/update-tweet", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetId: editTweet._id, content: editContent }),
    });
    if (ok) { toast("Tweet updated!"); setEditTweet(null); load(); }
    else toast(data.message || "Failed", "error");
  }

  return (
    <>
      <div className="sv-section-header">
        <h2 className="sv-section-title">Tweets</h2>
      </div>
      <div className="sv-tweet-compose">
        <textarea
          className="sv-tweet-textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={280}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{content.length} / 280</span>
          <button className="sv-btn sv-btn-primary sv-btn-sm" onClick={postTweet} disabled={posting}>
            {posting ? "Posting..." : "Tweet"}
          </button>
        </div>
      </div>
      <div className="sv-tweets-grid">
        {tweets === null ? (
          <Loading />
        ) : tweets.length === 0 ? (
          <div className="sv-empty-state"><h3>No tweets yet</h3><p>Share what's on your mind</p></div>
        ) : tweets.map(t => (
          <div key={t._id} className="sv-tweet-card">
            <div className="sv-tweet-content">{t.content}</div>
            <div className="sv-tweet-footer">
              <span className="sv-tweet-date">{t.createdAt ? formatDate(t.createdAt) : ""}</span>
              <div className="sv-tweet-actions">
                <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => { setEditTweet(t); setEditContent(t.content); }}>Edit</button>
                <button className="sv-btn sv-btn-danger sv-btn-sm" onClick={() => deleteTweet(t._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!editTweet} onClose={() => setEditTweet(null)} title="Edit Tweet" maxWidth={380}>
        <div className="sv-form-group">
          <textarea className="sv-form-input sv-tweet-textarea" style={{ minHeight: "80px" }} value={editContent} onChange={e => setEditContent(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button className="sv-btn sv-btn-ghost" onClick={() => setEditTweet(null)}>Cancel</button>
          <button className="sv-btn sv-btn-primary" onClick={saveEdit}>Save</button>
        </div>
      </Modal>
    </>
  );
}

// ─── PROFILE SECTION ─────────────────────────────────────────────────────────
function ProfileSection() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    apiFetch("/users/current-user").then(({ ok, data }) => {
      if (ok) setUser(data.data);
    });
  }, []);
  if (!user) return <Loading />;
  const initial = (user.username || "U")[0].toUpperCase();
  return (
    <div className="sv-profile-header">
      <div className="sv-profile-cover">
        {user.coverImage && <img src={user.coverImage} alt="cover" />}
      </div>
      <div className="sv-profile-info">
        <div className="sv-profile-avatar">
          {user.avatar ? <img src={user.avatar} alt={user.username} /> : initial}
        </div>
        <div>
          <div className="sv-profile-name">{user.fullName || "—"}</div>
          <div className="sv-profile-username">@{user.username}</div>
          <div className="sv-profile-username" style={{ marginTop: "0.2rem" }}>{user.email}</div>
        </div>
      </div>
      <div className="sv-profile-stats">
        <div className="sv-stat">
          <div className="sv-stat-num">{user.subscribersCount || 0}</div>
          <div className="sv-stat-label">Subscribers</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-num">{user.channelsSubscribedToCount || 0}</div>
          <div className="sv-stat-label">Subscribed</div>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY SECTION ─────────────────────────────────────────────────────────
function HistorySection() {
  const [videos, setVideos] = useState(null);
  useEffect(() => {
    apiFetch("/users/watch-history").then(({ ok, data }) => setVideos(ok ? data.data || [] : []));
  }, []);
  return (
    <>
      <div className="sv-section-header">
        <h2 className="sv-section-title">Watch History</h2>
      </div>
      <div className="sv-video-grid">
        {videos === null ? <Loading /> : videos.length === 0
          ? <div className="sv-empty-state"><h3>No watch history</h3></div>
          : videos.map(v => <VideoCard key={v._id} video={v} showActions={false} />)}
      </div>
    </>
  );
}

// ─── SETTINGS SECTION ────────────────────────────────────────────────────────
function SettingsSection({ user, onUserUpdate }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  async function updateAccount() {
    if (!fullName || !email) return toast("Please fill all fields", "error");
    const { ok, data } = await apiFetch("/users/update-user", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });
    if (ok) { onUserUpdate(data.data); toast("Account updated successfully!"); }
    else toast(data.message || "Update failed", "error");
  }

  async function changePassword() {
    if (!oldPass || !newPass) return toast("Please fill both fields", "error");
    const { ok, data } = await apiFetch("/users/change-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
    });
    if (ok) { toast("Password changed!"); setOldPass(""); setNewPass(""); }
    else toast(data.message || "Failed to change password", "error");
  }

  async function updateAvatar() {
    if (!avatarFile) return toast("Please select an image", "error");
    const fd = new FormData();
    fd.append("avatar", avatarFile);
    const { ok, data } = await apiFetch("/users/update-avatar", { method: "PATCH", body: fd });
    if (ok) { onUserUpdate(data.data); toast("Avatar updated!"); }
    else toast(data.message || "Failed to update avatar", "error");
  }

  return (
    <>
      <div className="sv-section-header">
        <h2 className="sv-section-title">Settings</h2>
      </div>
      <div className="sv-settings-grid">
        <div className="sv-settings-card">
          <h3>Account Details</h3>
          <div className="sv-form-group">
            <label className="sv-form-label">Full Name</label>
            <input className="sv-form-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="sv-form-group">
            <label className="sv-form-label">Email</label>
            <input className="sv-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="sv-btn sv-btn-ghost" onClick={updateAccount}>Save Changes</button>
        </div>
        <div className="sv-settings-card">
          <h3>Change Password</h3>
          <div className="sv-form-group">
            <label className="sv-form-label">Current Password</label>
            <input className="sv-form-input" type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="sv-form-group">
            <label className="sv-form-label">New Password</label>
            <input className="sv-form-input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="sv-btn sv-btn-ghost" onClick={changePassword}>Update Password</button>
        </div>
        <div className="sv-settings-card">
          <h3>Update Avatar</h3>
          <div className="sv-form-group">
            <label className="sv-form-label">New Avatar Image</label>
            <input className="sv-form-input" type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />
          </div>
          <button className="sv-btn sv-btn-ghost" onClick={updateAvatar}>Upload Avatar</button>
        </div>
      </div>
    </>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ open, onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!title || !videoFile || !thumbFile) return setError("Title, video file & thumbnail are required");
    const fd = new FormData();
    fd.append("title", title); fd.append("description", desc);
    fd.append("videofile", videoFile); fd.append("thumbnailfile", thumbFile);
    setUploading(true); setError("");
    const { ok, data } = await apiFetch("/video/upload-Video", { method: "POST", body: fd });
    setUploading(false);
    if (ok) {
      toast("Video uploaded successfully!");
      setTitle(""); setDesc(""); setVideoFile(null); setThumbFile(null);
      onClose(); onUploaded();
    } else setError(data.message || "Upload failed");
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload Video">
      <div className="sv-form-group">
        <label className="sv-form-label">Title</label>
        <input className="sv-form-input" type="text" placeholder="Enter video title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="sv-form-group">
        <label className="sv-form-label">Description</label>
        <textarea className="sv-form-input" rows="3" placeholder="Video description..." value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="sv-form-group">
        <label className="sv-form-label">Video File</label>
        <input className="sv-form-input" type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
      </div>
      <div className="sv-form-group">
        <label className="sv-form-label">Thumbnail</label>
        <input className="sv-form-input" type="file" accept="image/*" onChange={e => setThumbFile(e.target.files[0])} />
      </div>
      {error && <div className="sv-form-error">{error}</div>}
      {uploading && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.75rem" }}>
          <div className="sv-spinner" /> Uploading...
        </div>
      )}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
        <button className="sv-btn sv-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="sv-btn sv-btn-primary" onClick={upload} disabled={uploading}>Upload Video</button>
      </div>
    </Modal>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function StreamVault() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState("home");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    apiFetch("/users/current-user").then(({ ok, data }) => {
      if (ok) setUser(data.data);
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function logout() {
    await apiFetch("/users/logout", { method: "POST" });
    setUser(null); toast("Signed out successfully");
  }

  function navigate(s) { setSection(s); setDropdownOpen(false); }

  const initial = user ? (user.username || "U")[0].toUpperCase() : "?";

  if (checking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
        <div className="sv-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div className="sv-app">
      <nav className="sv-navbar">
        <div className="sv-logo" onClick={() => user && navigate("home")}>Stream<span>Vault</span></div>
        {user && (
          <div className="sv-nav-tabs">
            {["home", "tweets", "profile", "settings"].map(s => (
              <button key={s} className={`sv-nav-tab${section === s ? " active" : ""}`} onClick={() => navigate(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}
        <div className="sv-nav-right">
          {user ? (
            <>
              <button className="sv-btn sv-btn-primary sv-btn-sm" onClick={() => setUploadOpen(true)}>+ Upload</button>
              <div className="sv-dropdown" ref={dropdownRef}>
                <button className="sv-avatar-btn" onClick={() => setDropdownOpen(v => !v)}>
                  {user.avatar ? <img src={user.avatar} alt="" /> : initial}
                </button>
                {dropdownOpen && (
                  <div className="sv-dropdown-menu">
                    <button className="sv-dropdown-item" onClick={() => navigate("profile")}><Icons.User /> My Profile</button>
                    <button className="sv-dropdown-item" onClick={() => navigate("settings")}><Icons.Settings /> Settings</button>
                    <div className="sv-dropdown-divider" />
                    <button className="sv-dropdown-item red" onClick={logout}><Icons.Logout /> Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Not signed in</span>
          )}
        </div>
      </nav>

      {!user ? (
        <AuthPage onLogin={u => { setUser(u); toast("Welcome back, " + u.username + "!"); }} />
      ) : (
        <div className="sv-home-layout">
          <aside className="sv-sidebar">
            <button className={`sv-sidebar-item${section === "home" ? " active" : ""}`} onClick={() => navigate("home")}><Icons.Home /> Home</button>
            <button className={`sv-sidebar-item${section === "tweets" ? " active" : ""}`} onClick={() => navigate("tweets")}><Icons.Chat /> Tweets</button>
            <div className="sv-sidebar-label">My Content</div>
            <button className={`sv-sidebar-item${section === "profile" ? " active" : ""}`} onClick={() => navigate("profile")}><Icons.User /> Profile</button>
            <button className={`sv-sidebar-item${section === "history" ? " active" : ""}`} onClick={() => navigate("history")}><Icons.Clock /> Watch History</button>
            <div className="sv-sidebar-label">Account</div>
            <button className={`sv-sidebar-item${section === "settings" ? " active" : ""}`} onClick={() => navigate("settings")}><Icons.Settings /> Settings</button>
            <button className="sv-sidebar-item danger" onClick={logout}><Icons.Logout /> Sign Out</button>
          </aside>
          <main className="sv-main-content">
            {section === "home" && <HomeSection onOpenUpload={() => setUploadOpen(true)} />}
            {section === "tweets" && <TweetsSection />}
            {section === "profile" && <ProfileSection />}
            {section === "history" && <HistorySection />}
            {section === "settings" && <SettingsSection user={user} onUserUpdate={u => setUser(u)} />}
          </main>
        </div>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={() => {}} />
      <ToastContainer />
    </div>
  );
}