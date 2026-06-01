import { useState, useEffect, useRef, useMemo, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import logo from './assets/TM_Secondary_1_JPEG-removebg-preview.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'
import serviceImg from './assets/Screenshot_2026-05-06_131630-removebg-preview-Picsart-AiImageEnhancer.png'
import { NoticeModal } from './components/NoticeModal';
import { HeroCarousel } from './components/HeroCarousel';
import { BlogPage } from './components/BlogPage';
import { ContactSalesForm } from './components/ContactSalesForm';
import { PremiumChargingHubPage } from './components/PremiumChargingHubPage';
import { EVInfraConsultancyPage } from './components/EVInfraConsultancyPage';
import { ChargerSupplyPage } from './components/ChargerSupplyPage';
import { CPMSPage } from './components/CPMSPage';
import { OMServicesPage } from './components/OMServicesPage';
import { trackPageView } from './lib/track';
import { api } from './lib/axios';
import { useTheme, useThemeToggle } from './lib/theme';
import professorImg from './assets/Screenshot_2026-05-08_003804-removebg-preview.png'

type ApiStation = { id: string; name: string; state: string; lat: number; lon: number; kw: number; connector: string; stalls: number; tariff: number; enabled: boolean; order: number };
type LocalStation = { id: string; name: string; state: string; lon: number; lat: number; kw: number; conn: string; stalls: number; tariff: number };
async function fetchStations(): Promise<LocalStation[]> {
  const { data } = await api.get<ApiStation[]>('/api/stations');
  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    state: s.state,
    lon: s.lon,
    lat: s.lat,
    kw: s.kw,
    conn: s.connector,
    stalls: s.stalls,
    tariff: s.tariff,
  }));
}

type SocialLinkApi = { platform: string; url: string; enabled?: boolean; label?: string | null };
type SiteSettingsPublic = {
  registeredAddress: string;
  officeAddress: string;
  phone: string;
  email: string;
  contactCtaUrl: string;
  socials: SocialLinkApi[];
};
async function fetchSiteSettings(): Promise<SiteSettingsPublic | null> {
  try {
    const { data } = await api.get<SiteSettingsPublic>('/api/settings');
    return data;
  } catch {
    return null;
  }
}

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  whatsapp: 'M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.001.001-.999 3.648 3.477-.609zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
  tiktok: 'M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z',
  pinterest: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z',
  website: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
  other: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71m-3.05 11.36l-1.72 1.72a5 5 0 01-7.07-7.07l3-3A5 5 0 0114 5',
};

// Dark-theme fallback constants — only used by module-scope arrow components
// where a hook can't be called. Theme-aware components (and the App body)
// destructure live colours from useTheme() and shadow these names.
const ACCENT = '#00FF88';
const ACCENT_SOFT = '#00CC77';
const BG = '#0B0F0D';
const SURFACE = '#111715';
const CARD = '#151B18';
const BORDER = 'rgba(0,255,136,0.08)';
const BORDER_STRONG = 'rgba(0,255,136,0.18)';
const TEXT = '#F5F7F6';
const TEXT_DIM = '#8C948F';

// --- HOOKS ---
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

// --- HUD CARD ---
const HUDCard = ({ icon, title, value, unit, delay = 0.5, lineCycle = 2.6 }: any) => {
  const t = useTheme();
  const { ACCENT, TEXT, TEXT_DIM, BORDER, ACCENT_SOFT } = t;
  const cardBg = t.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(10, 14, 12, 0.55)';
  const cardBorder = t.mode === 'light' ? 'rgba(0,169,87,0.18)' : 'rgba(255,255,255,0.04)';
  return (
    <motion.div
      className="hero-hud-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: [
          '0 0 0px 0 rgba(0, 255, 136, 0)',      // 0%   — fully off, pulse just started
          '0 0 0px 0 rgba(0, 255, 136, 0)',      // 60%  — still dark, pulse travelling
          '0 0 6px 1px rgba(0, 255, 136, 0.15)', // 70%  — very faint glow begins
          '0 0 18px 3px rgba(0, 255, 136, 0.5)', // 78%  — pulse arrives, glow builds
          '0 0 22px 4px rgba(0, 255, 136, 0.65)',// 83%  — peak glow
          '0 0 14px 2px rgba(0, 255, 136, 0.35)',// 90%  — slow fade starts
          '0 0 6px 1px rgba(0, 255, 136, 0.12)', // 96%  — almost gone
          '0 0 0px 0 rgba(0, 255, 136, 0)',      // 100% — fully off again
        ],
      }}
      transition={{
        default: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        boxShadow: {
          duration: lineCycle,
          // dark 0→60%, slow rise 60→83%, slow fade 83→100%
          times: [0, 0.60, 0.70, 0.78, 0.83, 0.90, 0.96, 1],
          repeat: Infinity,
          ease: 'linear',
          delay: delay + 0.6,
        },
      }}
      style={{
        background: cardBg,
        backdropFilter: 'blur(6px)',
        border: `1px solid ${cardBorder}`,
        padding: '10px 16px',
        minWidth: '150px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {icon && (
        <div style={{
          color: ACCENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: TEXT, letterSpacing: -0.01 }}>{value}</span>
          {unit && <span style={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 600 }}>{unit}</span>}
        </div>
        <div style={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 500, marginTop: 2 }}>{title}</div>
      </div>
    </motion.div>
  );
};

// --- LIVE STAT (hero strip) ---
const FlipStat = ({ label, value }: any) => {
  const { TEXT, TEXT_DIM } = useTheme();
  return (
    <div className="flip-stat" style={{ padding: '4px 0', paddingRight: 24 }}>
      <div className="stat-label" style={{ fontSize: '0.74rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02, color: TEXT }}>{value}</div>
    </div>
  );
};

// --- SPARKLINE (synapse cards) ---
const Sparkline = ({ color = ACCENT, points }: { color?: string, points: number[] }) => {
  const w = 220, h = 44;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (p / 100) * h}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gid = `g-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '44px', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle r="2" cx={(points.length - 1) * step} cy={h - (points[points.length - 1] / 100) * h} fill={color} />
    </svg>
  );
};

// --- MODULE CARD (synapse) ---
const ModuleCard = ({ idx, title, desc, status, statusColor, metrics, points, delay = 0 }: any) => {
  const { ACCENT, TEXT, TEXT_DIM, BORDER } = useTheme();
  if (!statusColor) statusColor = ACCENT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="module-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 500, color: TEXT_DIM }}>0{idx} · Module</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', fontWeight: 500, color: statusColor }}>
          <span className="circle" style={{ width: 6, height: 6, background: statusColor }} />
          {status.toLowerCase()}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, letterSpacing: -0.02, color: TEXT }}>{title}</h3>
      <p style={{ color: TEXT_DIM, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 22, fontWeight: 400 }}>{desc}</p>

      <Sparkline color={statusColor} points={points} />

      <div style={{ display: 'flex', gap: 24, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
        {metrics.map((m: any) => (
          <div key={m.label} style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: TEXT, letterSpacing: -0.01 }}>{m.val}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const WHY_SLIDES = [
  {
    title: 'CRUCIAL FOR ELECTRIC VEHICLE ADOPTION',
    text: "Experts widely agree that a robust, reliable, and accessible network of charging stations is the absolute foundation for the widespread adoption of electric vehicles (EVs) globally. The availability of charging infrastructure is a primary factor influencing consumers' willingness to switch from internal combustion engine vehicles, directly addressing 'range anxiety' and ensuring that long-distance travel becomes as seamless as traditional refueling."
  },
  {
    title: 'REDUCING ENVIRONMENTAL IMPACT',
    text: "Experts recognize that EV charging stations are instrumental in drastically reducing the environmental impact of modern transportation systems. Unlike fossil-fuel-powered cars, EVs produce zero tailpipe emissions. When these vehicles are charged using renewable energy sources—such as solar, wind, or hydroelectric power—their total carbon footprint is significantly lower, contributing to cleaner air and a more sustainable future."
  },
  {
    title: 'DRIVING THE FUTURE OF MOBILITY',
    text: "By integrating smart grid technology and distributed renewable energy, EV charging infrastructure becomes more than just a power source—it's the backbone of a sustainable, connected ecosystem. This synergy allows for 'Vehicle-to-Grid' (V2G) capabilities, where EVs can actually return power to the grid during peak demand, creating a balanced and resilient energy network that powers the smart cities of tomorrow."
  }
];

type Page = 'home' | 'find-stations' | 'privacy-policy' | 'terms-conditions' | 'refund-policy' | 'about-us' | 'blog' | 'contact-us' | 'premium-charging-hub' | 'ev-infra-consultancy' | 'charger-supply' | 'cpms' | 'om-services';
const PAGE_TO_PATH: Record<Page, string> = {
  'home': '/',
  'find-stations': '/find-stations',
  'about-us': '/about-us',
  'blog': '/blog',
  'privacy-policy': '/privacy-policy',
  'terms-conditions': '/terms-conditions',
  'refund-policy': '/refund-policy',
  'contact-us': '/contact-us',
  'premium-charging-hub': '/services/premium-charging-hub',
  'ev-infra-consultancy': '/services/ev-infra-consultancy',
  'charger-supply': '/services/charger-supply',
  'cpms': '/services/cpms',
  'om-services': '/services/om-services',
};
function pathToPage(path: string): Page {
  const normalized = (path || '/').replace(/\/+$/, '') || '/';
  for (const [p, url] of Object.entries(PAGE_TO_PATH) as [Page, string][]) {
    if (url === normalized) return p;
  }
  return 'home';
}

export default function App() {
  const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
  const { mode: themeMode } = useThemeToggle();
  // Theme-aware big-display heading gradient
  const headingGradient = themeMode === 'light'
    ? 'linear-gradient(180deg, #0F1714 0%, #3F4A45 55%, #6B7570 100%)'
    : 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 45%, #606060 100%)';
  const headingGradient2 = themeMode === 'light'
    ? 'linear-gradient(180deg, #0F1714 0%, #5A6660 100%)'
    : 'linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)';
  const headingShadow = themeMode === 'light'
    ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.06))'
    : 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))';
  // Apply gradient text-clip in dark mode; in light use a solid colour to avoid
  // the gradient painting a dark slab when -webkit-background-clip is flaky.
  const gradTextStyle = themeMode === 'light'
    ? { color: HEADING }
    : { background: headingGradient, WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' };
  const gradTextStyle2 = themeMode === 'light'
    ? { color: HEADING }
    : { background: headingGradient2, WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' };

  const [sessions] = useState([
    { id: 'TR-01', status: 'CHARGING', power: '150kW' },
    { id: 'TR-04', status: 'READY', power: '0kW' },
    { id: 'TR-09', status: 'CHARGING', power: '350kW' },
  ]);

  const [clock, setClock] = useState('');
  const [stationsOnline, setStationsOnline] = useState(10);
  const [kwhToday, setKwhToday] = useState(4000);
  const [indiaGeo, setIndiaGeo] = useState<{ countryPath: string; states: { name: string; path: string }[]; project: (lon: number, lat: number) => [number, number] } | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dashboardIframeRef = useRef<HTMLIFrameElement | null>(null);
  const findStationsIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [page, setPage] = useState<Page>(() =>
    typeof window !== 'undefined' ? pathToPage(window.location.pathname) : 'home',
  );
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    if (!desktopServicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(e.target as Node)) {
        setDesktopServicesOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setDesktopServicesOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [desktopServicesOpen]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connFilter, setConnFilter] = useState('Any');
  const [minPower, setMinPower] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState('WB-410');
  const [stationSheetOpen, setStationSheetOpen] = useState(false);
  const [stationListExpanded, setStationListExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [whySlide, setWhySlide] = useState(0);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWhySlide(prev => (prev + 1) % WHY_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate Services showcase every 4s; timer resets on manual change (mobile + desktop)
  useEffect(() => {
    const t = setTimeout(() => {
      setActiveService(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearTimeout(t);
  }, [activeService, isMobile]);

  const stationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStations, staleTime: 60_000 });
  const STATIONS: LocalStation[] = useMemo(
    () => stationsQuery.data ?? [],
    [stationsQuery.data],
  );

  const iframeApiBase = useMemo(() => {
    const base = (api.defaults.baseURL ?? '') as string;
    return encodeURIComponent(base);
  }, []);

  useEffect(() => {
    if (!stationsQuery.data) return;
    const payload = {
      type: 'ev-stations-update',
      stations: STATIONS.map((s) => ({
        id: s.id, name: s.name, state: s.state,
        lon: s.lon, lat: s.lat, kw: s.kw, connector: s.conn,
      })),
    };
    dashboardIframeRef.current?.contentWindow?.postMessage(payload, '*');
    findStationsIframeRef.current?.contentWindow?.postMessage(payload, '*');
  }, [STATIONS, stationsQuery.data]);

  const settingsQuery = useQuery({ queryKey: ['site-settings'], queryFn: fetchSiteSettings, staleTime: 60_000 });
  const siteSettings = useMemo(() => {
    const s = settingsQuery.data;
    return {
      registeredAddress: s?.registeredAddress?.trim() || '29E, Raipur Mondal Para Road, P.S. Netaji Nagar, Naktala, Kolkata - 700047, West Bengal, India',
      officeAddress: s?.officeAddress?.trim() || 'Shilpata More, Mahammadpur Road (Opposite Curiosity), New Town, Kolkata - 700135, West Bengal, India',
      phone: s?.phone?.trim() || '+91 62918 42000',
      email: s?.email?.trim() || 'info@trioev.com',
      socials: (s?.socials ?? []).filter((x) => x.enabled !== false && x.url?.trim()),
    };
  }, [settingsQuery.data]);

  const filteredStations = useMemo(() => STATIONS.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConn = connFilter === 'Any' || s.conn === connFilter;
    const matchesPower = s.kw >= minPower;
    return matchesQuery && matchesConn && matchesPower;
  }), [STATIONS, searchQuery, connFilter, minPower]);

  const selectedStation = STATIONS.find(s => s.id === selectedStationId) || STATIONS[0];

  const clusteredStations = useMemo(() => {
    const groups: Record<string, typeof filteredStations> = {};
    filteredStations.forEach(s => {
      if (!groups[s.state]) groups[s.state] = [];
      groups[s.state].push(s);
    });
    return Object.entries(groups).map(([state, stations]) => ({
      state,
      stations,
      count: stations.length,
      lon: stations[0].lon,
      lat: stations[0].lat,
      id: `cluster-${state}`,
      totalKw: stations.reduce((acc, curr) => acc + curr.kw, 0)
    }));
  }, [filteredStations, isMobile]);

  const focusedState = indiaGeo?.states.find(s =>
    searchQuery.length > 2 && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )?.name || null;

  const selectedCluster = useMemo(
    () => clusteredStations.find(c => c.id === selectedClusterId),
    [clusteredStations, selectedClusterId]
  );

  // PREMIUM CLUSTER POPUP
  const ClusterPopup = ({ cluster, onClose, onPick }: { cluster: any, onClose: () => void, onPick: (s: any) => void }) => (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? 'calc(100vw - 32px)' : 380,
        maxWidth: 380,
        zIndex: 4000,
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        key="cluster-popup-inner"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          background: BG, border: `1px solid ${ACCENT}`, borderRadius: 14,
          padding: isMobile ? 16 : 32,
          boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${ACCENT}33`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 16 : 24, gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: ACCENT, fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: isMobile ? 6 : 8 }}>{cluster.state} · {cluster.count === 1 ? 'STATION' : 'CLUSTER'}</div>
            <h3 style={{ fontSize: isMobile ? '1.05rem' : '1.6rem', fontWeight: 700, color: HEADING, margin: 0, letterSpacing: -0.5, lineHeight: 1.2 }}>{cluster.count === 1 ? cluster.stations[0].name : `${cluster.count} stations in this area`}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: HEADING, cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: isMobile ? 16 : 32, marginBottom: isMobile ? 14 : 24, paddingBottom: isMobile ? 14 : 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontSize: isMobile ? '1rem' : '1.4rem', fontWeight: 700, color: ACCENT }}>{cluster.totalKw}<span style={{ fontSize: isMobile ? '0.62rem' : '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW total</span></div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? '1rem' : '1.4rem', fontWeight: 700, color: HEADING }}>{Math.round(cluster.totalKw / cluster.count)}<span style={{ fontSize: isMobile ? '0.62rem' : '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW avg</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: isMobile ? 180 : 240, overflowY: 'auto' }} className="custom-scrollbar">
          {cluster.stations.map((s: any) => (
            <div key={s.id} onClick={() => onPick(s)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
              padding: isMobile ? '8px 10px' : '12px 16px', borderRadius: 8, transition: 'all 0.2s'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: HEADING, fontSize: isMobile ? '0.82rem' : '0.9rem', fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: TEXT_DIM, fontSize: isMobile ? '0.62rem' : '0.7rem' }}>{s.id}</div>
              </div>
              <div style={{ color: ACCENT, fontWeight: 700, fontSize: isMobile ? '0.82rem' : '0.9rem' }}>{s.kw} kW</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Map Component for reuse
  const IndiaMap = ({ highlighted, onHover }: { highlighted?: string | null, onHover?: (name: string | null) => void }) => {
    if (!indiaGeo) return <div style={{ color: TEXT_DIM, fontSize: '0.8rem' }}>Initializing GeoData...</div>;
    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={indiaGeo.countryPath} fill="rgba(0,255,136,0.02)" stroke={ACCENT} strokeWidth="0.4" fillRule="evenodd" style={{ opacity: 0.3 }} />
        {indiaGeo.states.map((s: any, i: number) => (
          <motion.path
            key={i}
            d={s.path}
            fill={highlighted === s.name ? `${ACCENT}15` : 'transparent'}
            stroke={highlighted === s.name ? ACCENT : ACCENT}
            strokeWidth={highlighted === s.name ? 0.6 : 0.2}
            strokeOpacity={highlighted === s.name ? 0.8 : 0.15}
            whileHover={{ fill: `${ACCENT}22`, strokeOpacity: 0.6 }}
            transition={{ duration: 0.2 }}
            style={{ cursor: 'default' }}
            onMouseEnter={() => onHover && onHover(s.name)}
            onMouseLeave={() => onHover && onHover(null)}
          />
        ))}

        {clusteredStations.map((c, i) => {
          if (!indiaGeo || !indiaGeo.project) return null;
          const [x, y] = indiaGeo.project(c.lon, c.lat);
          if (isNaN(x) || isNaN(y)) return null;

          return (
            <g
              key={c.id}
              onClick={(e) => { e.stopPropagation(); setSelectedClusterId(c.id); }}
              style={{ cursor: 'pointer' }}
            >
              {/* MARKER — cyan glow with bolt + cluster count (matches desktop spots) */}
              <circle cx={x} cy={y} r={9.5} fill="#5EC8FF" opacity={0.08} />
              <circle cx={x} cy={y} r={7} fill="none" stroke="#5EC8FF" strokeWidth="0.35" opacity={0.4} />
              <circle cx={x} cy={y} r={5.5} fill="#0B1620" stroke="#5EC8FF" strokeWidth={0.8} style={{ filter: `drop-shadow(0 0 2.5px #5EC8FF)` }} />
              <path d={`M ${x - 1.6} ${y - 2.2} L ${x - 2.8} ${y + 0.2} L ${x - 1.9} ${y + 0.2} L ${x - 2.3} ${y + 2.2} L ${x - 0.8} ${y - 0.3} L ${x - 1.7} ${y - 0.3} L ${x - 1.2} ${y - 2.2} Z`} fill="#5EC8FF" />
              <text x={x + 1.2} y={y + 1.3} fontSize="3.4" fontWeight="700" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" style={{ pointerEvents: 'none' }}>{c.count}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const navigate = (target: string) => {
    if (target === 'find-stations') {
      setPage('find-stations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === '#top' || target === 'home') {
      setPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'privacy-policy') {
      setPage('privacy-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'terms-conditions') {
      setPage('terms-conditions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'refund-policy') {
      setPage('refund-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'about-us') {
      setPage('about-us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'blog') {
      setPage('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'contact-us') {
      setPage('contact-us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'premium-charging-hub') {
      setPage('premium-charging-hub');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'ev-infra-consultancy') {
      setPage('ev-infra-consultancy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'charger-supply') {
      setPage('charger-supply');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'cpms') {
      setPage('cpms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'om-services') {
      setPage('om-services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPage('home');
      setTimeout(() => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  useEffect(() => {
    const tick = () => {
      const time = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });
      setClock(`${time} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    const id2 = setInterval(() => setStationsOnline(n => n + (Math.random() > 0.45 ? 1 : -1)), 2400);
    const id3 = setInterval(() => setKwhToday(n => n + Math.floor(Math.random() * 18 + 4)), 1200);
    return () => { clearInterval(id); clearInterval(id2); clearInterval(id3); };
  }, []);

  useEffect(() => {
    trackPageView('/' + (page === 'home' ? '' : page));
  }, [page]);

  // Keep /contact-us and the Contact Sales form modal in sync (works in both directions)
  useEffect(() => {
    if (page === 'contact-us' && !showContactForm) setShowContactForm(true);
  }, [page, showContactForm]);
  useEffect(() => {
    if (showContactForm && page !== 'contact-us') setPage('contact-us');
  }, [showContactForm, page]);

  useEffect(() => {
    const target = PAGE_TO_PATH[page];
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
  }, [page]);

  useEffect(() => {
    const handler = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // Fetch real India GeoJSON and build projected SVG path
  useEffect(() => {
    let cancelled = false;
    const SOURCES = [
      'https://cdn.jsdelivr.net/gh/adarshbiradar/maps-geojson@master/india.json',
      'https://cdn.jsdelivr.net/gh/Subhash9325/GeoJson-Data-of-Indian-States@master/Indian_States',
    ];
    (async () => {
      let geo: any = null;
      for (const url of SOURCES) {
        try {
          const r = await fetch(url, { mode: 'cors' });
          if (!r.ok) continue;
          geo = await r.json();
          if (geo) break;
        } catch (e) { /* try next */ }
      }
      if (cancelled || !geo?.features) return;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const eachRing = (coords: any, fn: (p: number[]) => void) => { for (const ring of coords) for (const p of ring) fn(p); };
      const eachGeom = (g: any, fn: (p: number[]) => void) => {
        if (!g) return;
        if (g.type === 'Polygon') eachRing(g.coordinates, fn);
        else if (g.type === 'MultiPolygon') for (const p of g.coordinates) eachRing(p, fn);
      };
      for (const f of geo.features) {
        eachGeom(f.geometry, (pt: number[]) => {
          const x = pt[0], y = -pt[1];
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        });
      }

      // Project into viewBox 0 0 200 200 (matches Loader.html exactly)
      const PAD = 22, W = 200, H = 200;
      const dataW = maxX - minX, dataH = maxY - minY;
      const scale = Math.min((W - PAD * 2) / dataW, (H - PAD * 2) / dataH);
      const offX = (W - dataW * scale) / 2 - minX * scale;
      const offY = (H - dataH * scale) / 2 - minY * scale;
      const project = (lon: number, lat: number): [number, number] => [lon * scale + offX, (-lat) * scale + offY];

      const ringToPath = (ring: number[][]) => {
        let d = '';
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = project(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
        }
        return d + 'Z';
      };
      const geomToPath = (g: any): string => {
        if (!g) return '';
        if (g.type === 'Polygon') return g.coordinates.map(ringToPath).join(' ');
        if (g.type === 'MultiPolygon') return g.coordinates.map((p: any) => p.map(ringToPath).join(' ')).join(' ');
        return '';
      };

      const states: { name: string; path: string }[] = [];
      let combinedD = '';
      for (const f of geo.features) {
        const d = geomToPath(f.geometry);
        if (!d) continue;
        const name = (f.properties && (f.properties.st_nm || f.properties.NAME_1 || f.properties.ST_NM)) || 'State';
        states.push({ name, path: d });
        combinedD += ' ' + d;
      }
      setIndiaGeo({ countryPath: combinedD.trim(), states, project });
    })();
    return () => { cancelled = true; };
  }, []);

  const modules = [
    {
      title: 'Load balancing', desc: 'Grid-aware orchestration redistributing kilowatts across stations in real time.',
      status: 'Active', statusColor: ACCENT,
      metrics: [{ label: 'Nodes', val: '2,847' }, { label: 'Balance', val: '99.4%' }],
      points: [40, 55, 35, 70, 50, 80, 45, 75, 60, 88, 55, 72, 65, 90],
    },
    {
      title: 'Smart billing', desc: 'Per-electron settlement engine reconciling fleet ledgers across currencies.',
      status: 'Syncing', statusColor: ACCENT_SOFT,
      metrics: [{ label: 'Tx / sec', val: '1.2K' }, { label: 'Accuracy', val: '100%' }],
      points: [60, 65, 70, 68, 72, 78, 75, 82, 80, 85, 88, 84, 90, 92],
    },
    {
      title: 'Diagnostics', desc: 'Edge telemetry predicting hardware failure 72 hours before incidence.',
      status: 'Scanning', statusColor: ACCENT_SOFT,
      metrics: [{ label: 'Scans / hr', val: '4.8M' }, { label: 'Integrity', val: '99.9%' }],
      points: [70, 50, 80, 45, 75, 55, 85, 60, 78, 65, 82, 70, 88, 76],
    },
    {
      title: 'API integration', desc: 'Universal data bridge connecting fleets, logistics and grid operators in 4 ms.',
      status: 'Linked', statusColor: ACCENT,
      metrics: [{ label: 'Partners', val: '184' }, { label: 'Latency', val: '4ms' }],
      points: [55, 62, 58, 65, 60, 70, 68, 75, 72, 80, 76, 82, 78, 86],
    },
  ];

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: -0.022em; color: ${TEXT}; }
        h1 { letter-spacing: -0.035em; }
        h2 { letter-spacing: -0.028em; }
        p { color: ${TEXT_DIM}; }

        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'ss01' on; }
        .circle { border-radius: 9999px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${ACCENT_SOFT}; font-weight: 500; }

        .btn-accent { background: ${ACCENT}; color: #0B0F0D; border: none; padding: 14px 26px; font-weight: 600; font-size: 0.88rem; letter-spacing: 0; cursor: pointer; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif; }
        .btn-accent:hover { background: #B5F08A; transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: ${TEXT}; border: 1px solid rgba(245,247,246,0.12); padding: 14px 26px; font-weight: 500; font-size: 0.88rem; cursor: pointer; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 8px; font-family: 'Inter', sans-serif; }
        .btn-ghost:hover { background: rgba(245,247,246,0.04); border-color: rgba(245,247,246,0.22); }

        .glass-card { background: ${CARD}; border: 1px solid ${BORDER}; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 14px; }
        .glass-card:hover { border-color: ${BORDER_STRONG}; transform: translateY(-2px); }
        .grid-bg { background-image: radial-gradient(rgba(245,247,246,0.025) 1px, transparent 1px); background-size: 56px 56px; }

        /* Bracket corner ornaments — tiny + subtle */
        .bracket { position: absolute; width: 8px; height: 8px; border: 1px solid ${ACCENT_SOFT}; opacity: 0.35; pointer-events: none; }
        .bracket-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .bracket-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .bracket-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        .bracket-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

        :root {
          --side-padding: 88px;
        }

        @media (max-width: 1024px) {
          :root {
            --side-padding: 24px;
          }
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: ${themeMode === 'light' ? 'rgba(255,255,255,0.96)' : 'rgba(11,15,13,0.98)'};
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 40px 14px;
        }

        .mobile-menu-link {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: ${TEXT};
          text-decoration: none;
          letter-spacing: -0.01em;
          padding: 6px 16px;
        }
        .mobile-menu-link:active { color: ${ACCENT}; }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: ${TEXT};
          cursor: pointer;
          padding: 8px;
          z-index: 2100;
        }

        @media (max-width: 1024px) {
          .menu-toggle { display: flex !important; align-items: center; justify-content: center; }
          .desktop-nav { display: none !important; }
        }

        /* Pulse dot ring — subtle */
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(2.2); opacity: 0; } }
        .pulse-dot { position: relative; }
        .pulse-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 9999px; border: 1px solid currentColor; animation: pulse-ring 2.4s ease-out infinite; }

        /* Marquee ticker */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker { width: 100%; overflow: hidden; border-top: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; background: ${SURFACE}; padding: 18px 0; }
        .ticker-track { display: flex; gap: 72px; white-space: nowrap; animation: marquee 90s linear infinite; will-change: transform; }
        .ticker-item { font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; letter-spacing: 0.04em; color: ${TEXT_DIM}; font-weight: 500; }
        .ticker-item .acc { color: ${ACCENT_SOFT}; }
        .ticker-item .sep { color: rgba(245,247,246,0.12); margin: 0 10px; }

        /* MODULE CARD — refined */
        .module-card { background: ${CARD}; border: 1px solid ${BORDER}; padding: 28px; position: relative; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 14px; }
        .module-card:hover { border-color: ${BORDER_STRONG}; transform: translateY(-2px); background: #181F1B; }

        /* SYNAPSE GRID */
        .synapse-grid { display: grid; grid-template-columns: minmax(280px, 360px) 1fr minmax(280px, 360px); grid-template-rows: auto auto; gap: 56px 96px; position: relative; max-width: 1440px; margin: 0 auto; }
        .core-col { grid-column: 2; grid-row: 1 / span 2; display: flex; align-items: center; justify-content: center; position: relative; min-height: 460px; }
        .module-nw { grid-column: 1; grid-row: 1; }
        .module-ne { grid-column: 3; grid-row: 1; }
        .module-sw { grid-column: 1; grid-row: 2; }
        .module-se { grid-column: 3; grid-row: 2; }
        .synapse-connectors { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

        /* Event feed */
        @keyframes feed-scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .event-feed-container { max-width: 1440px; margin: 96px auto 0; border: 1px solid ${BORDER}; padding: 18px 22px; background: ${SURFACE}; display: grid; grid-template-columns: 200px 1fr 80px; gap: 28px; align-items: center; border-radius: 12px; }
        .feed-window { height: 22px; overflow: hidden; position: relative; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.02em; }
        .feed-track { animation: feed-scroll 36s linear infinite; }
        .feed-line { height: 22px; line-height: 22px; color: ${TEXT_DIM}; font-weight: 500; }
        .feed-line .tag { color: ${ACCENT_SOFT}; margin-right: 10px; }

        /* ======================================================
           NETWORK MAP — refined, premium dashboard aesthetic
           ====================================================== */
        .loader-section { background: ${BG}; color: ${TEXT}; }
        .loader-stage { width: 460px; height: 460px; position: relative; display: grid; place-items: center; }
        .finder-stage { width: 100%; height: 100%; position: relative; display: grid; place-items: center; background: radial-gradient(circle at 50% 50%, ${ACCENT}08, transparent 70%); }
        .loader-grid { position: absolute; inset: 0; background-image: linear-gradient(${ACCENT}08 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}08 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%); -webkit-mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%); }
        .loader-stage svg, .finder-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; z-index: 2; }

        .loader-hud-overlay { position: absolute; inset: -36px; pointer-events: none; z-index: 10; font-family: 'JetBrains Mono', monospace; }
        .loader-hud-corner { position: absolute; width: 18px; height: 18px; border: 1px solid ${ACCENT_SOFT}; opacity: 0.45; }
        .loader-corner-tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
        .loader-corner-tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
        .loader-corner-bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
        .loader-corner-br { bottom: 0; right: 0; border-left: 0; border-top: 0; }

        .loader-hud-labels { position: absolute; inset: 18px; color: ${ACCENT_SOFT}; font-size: 10px; letter-spacing: 0.12em; }
        .loader-hud-top-left { position: absolute; top: 0; left: 0; line-height: 1.7; text-transform: uppercase; }
        .loader-hud-bottom-right { position: absolute; bottom: 0; right: 0; text-align: right; line-height: 1.7; text-transform: uppercase; }
        .loader-accent-white { color: ${TEXT}; }
        .loader-hud-brand-text { display: none; }

        .loader-hud-scanline { display: none; }

        .loader-ring-wrap { z-index: 1; pointer-events: none; }
        .loader-ring-track { fill: none; stroke: rgba(245,247,246,0.06); stroke-width: 1; }
        .loader-ring-fill { fill: none; stroke: ${ACCENT_SOFT}; stroke-opacity: 0.35; stroke-width: 1; stroke-linecap: round; stroke-dasharray: 3 6; }
        .loader-ring-ticks line { stroke: rgba(159,232,112,0.18); stroke-width: 0.6; }

        .loader-car-body { fill: ${ACCENT}; }
        .loader-car-glass { fill: rgba(11,15,13,0.85); }
        .loader-car-wheel { fill: #0B0F0D; }
        .loader-car-light { fill: ${TEXT}; }

        .loader-map { z-index: 2; }
        .loader-country { fill: rgba(159,232,112,0.025); stroke: ${ACCENT_SOFT}; stroke-width: 0.6; stroke-opacity: 0.55; stroke-linejoin: round; stroke-linecap: round; pointer-events: none; }
        .loader-state { fill: transparent; stroke: ${ACCENT_SOFT}; stroke-width: 0.25; stroke-opacity: 0.22; stroke-linejoin: round; stroke-linecap: round; cursor: pointer; transition: all 220ms cubic-bezier(0.22, 1, 0.36, 1); }
        .loader-state:hover { fill: rgba(159,232,112,0.08); stroke-opacity: 0.6; }
        .loader-station-label { fill: ${TEXT}; font-size: 5.5px; font-weight: 600; letter-spacing: 0.04em; pointer-events: none; font-family: 'Inter', sans-serif; }
        .loader-station-count { fill: ${TEXT_DIM}; font-size: 4.8px; opacity: 0.85; font-weight: 500; }

        .loader-tooltip { position: absolute; pointer-events: none; background: ${CARD}; color: ${TEXT}; font-size: 11px; letter-spacing: 0.02em; padding: 6px 10px; border: 1px solid ${BORDER_STRONG}; border-radius: 6px; white-space: nowrap; transform: translate(-50%, -130%); opacity: 0; transition: opacity 180ms ease; z-index: 10; font-family: 'Inter', sans-serif; font-weight: 500; }
        .loader-tooltip::after { content: ""; position: absolute; left: 50%; bottom: -4px; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background: ${CARD}; border-right: 1px solid ${BORDER_STRONG}; border-bottom: 1px solid ${BORDER_STRONG}; }
        .loader-tooltip.show { opacity: 1; }
        .loader-tooltip .accent { color: ${ACCENT}; }

        .loader-stations { z-index: 3; pointer-events: none; }
        .loader-station-core { fill: ${ACCENT}; animation: loader-blink 3s ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .loader-station-pulse { fill: none; stroke: ${ACCENT_SOFT}; stroke-width: 0.7; transform-origin: var(--cx) var(--cy); animation: loader-pulse 3s ease-out infinite; animation-delay: var(--delay, 0s); }
        .loader-station-halo { fill: rgba(11,15,13,0.5); }
        @keyframes loader-pulse { 0% { transform: scale(0.5); opacity: 0.55; } 80% { transform: scale(2.2); opacity: 0; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes loader-blink { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }

        .loader-bolt { display: none; }

        @media (max-width: 1100px) {
          .synapse-grid { grid-template-columns: 1fr; gap: 32px; }
          .core-col { grid-column: 1; grid-row: 5; min-height: 320px; }
          .module-nw { grid-row: 1; }
          .module-ne { grid-row: 2; }
          .module-sw { grid-row: 3; }
          .module-se { grid-row: 4; }
          
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; padding-top: 40px !important; }
          .hero-left { display: flex; flex-direction: column; align-items: center; }
          .hero-btns { justify-content: center !important; }
          .hero-right { order: -1; }

          .why-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }

        /* ==================== MOBILE OVERRIDES ==================== */
        @media (max-width: 1024px) {
          /* HEADER / FOOTER LOGO */
          .header-logo { height: 76px !important; }
          .footer-logo { height: 110px !important; margin-top: -25px !important; margin-bottom: -11px !important; }
          .menu-toggle { min-width: 44px; min-height: 44px; }

          /* HERO — charger first (visual), then text + stats */
          .hero-grid { padding-top: 24px !important; gap: 24px !important; }
          .hero-right { order: -1 !important; }
          .hero-right-charger { min-height: 220px !important; }
          .hero-right-charger img { max-width: 260px !important; }
          .hero-hud-left, .hero-hud-right { display: none !important; }
          .hero-charging-lines { display: none !important; }
          .hero-stat-strip { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; max-width: 100% !important; margin-top: 8px; }
          .hero-stat-strip .flip-stat { padding-right: 6px !important; padding-left: 6px !important; }
          .hero-stat-strip .flip-stat .stat-val { font-size: 1rem !important; }
          .hero-stat-strip .flip-stat .stat-label { font-size: 0.62rem !important; }
          .hero-stat-strip .flip-stat .stat-trend { font-size: 0.58rem !important; }

          /* SERVICES SECTION */
          .services-main-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-top: 8px !important; }
          .services-img-container { height: 200px !important; margin-bottom: 18px !important; }
          .services-img-container img { object-position: center center !important; }
          .services-desc { padding-left: 0 !important; text-align: center; }
          .services-desc p { max-width: 100% !important; }
          .service-item { padding: 18px 16px !important; }
          .service-item h4 { font-size: 1rem !important; }
          .services-eyebrow { font-size: 0.65rem !important; }
          .services-h2 { font-size: 2.4rem !important; }
          .services-tag { font-size: 0.95rem !important; }

          /* HERO TICKER hidden on mobile (overflow) */
          .ticker { display: none !important; }

          /* INDIA COVERAGE */
          .network-inner { padding: 0 16px !important; }
          .network-iframe-wrap { height: 380px !important; border-radius: 14px !important; }

          /* WHY-EV */
          .why-grid { gap: 40px !important; }
          .why-slide-title { font-size: 1.25rem !important; margin-bottom: 20px !important; }
          .why-slide-content { min-height: auto !important; }
          .why-right-col { text-align: center !important; }
          .prof-img-container { width: 100% !important; max-width: 320px !important; height: 360px !important; margin: 0 auto !important; }
          .prof-name { font-size: 1.9rem !important; }
          .prof-role { font-size: 0.7rem !important; }

          /* CTA */
          .cta-section { padding: 60px 20px 0 !important; }
          .cta-section .cta-btn-row { gap: 12px !important; margin-bottom: 40px !important; }

          /* POLICY PAGES */
          .policy-section { padding-top: 96px !important; padding-bottom: 64px !important; }
          .policy-inner { padding: 0 16px !important; }
          .policy-title { font-size: 2rem !important; margin-bottom: 28px !important; }
          .policy-inner h2 { font-size: 1.2rem !important; margin-top: 32px !important; }
          .policy-inner p, .policy-inner ul { font-size: 0.95rem !important; }

          /* ABOUT US */
          .about-hero { margin-bottom: 64px !important; padding: 0 16px !important; }
          .about-inner { padding: 0 16px !important; }
          .vision-grid, .mission-grid { grid-template-columns: 1fr !important; gap: 28px !important; margin-bottom: 64px !important; }
          .vision-img, .mission-img { height: 240px !important; border-radius: 20px !important; }
          .about-section-title { font-size: 1.7rem !important; }
          .story-block { margin-bottom: 80px !important; }
          .story-quote { font-size: 1.35rem !important; padding: 32px 0 !important; }
          .story-block h2 { font-size: 2rem !important; }
          .leadership-block { margin-bottom: 80px !important; }
          .leadership-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .leadership-card { padding: 36px 24px !important; border-radius: 24px !important; }
          .leadership-card .leader-avatar { width: 96px !important; height: 96px !important; margin-bottom: 20px !important; }
          .leadership-card h3 { font-size: 1.35rem !important; }
          .impact-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .impact-card { padding: 20px !important; }
          .impact-card h4 { font-size: 1rem !important; margin-bottom: 10px !important; }
          .impact-card p { font-size: 0.82rem !important; }

          /* FIND-STATIONS IFRAME */
          .find-stations-iframe { height: 760px !important; }

          /* FOOTER */
          footer { padding-top: 56px !important; padding-bottom: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }

        @media (max-width: 600px) {
          .impact-grid { grid-template-columns: 1fr !important; }
          .network-iframe-wrap { height: 320px !important; }
          .find-stations-iframe { height: 660px !important; }
          .hero-stat-strip { grid-template-columns: 1fr !important; gap: 14px !important; }
          .hero-stat-strip .flip-stat { padding-right: 0 !important; border-bottom: 1px solid ${BORDER}; padding-bottom: 14px !important; }
          .hero-stat-strip .flip-stat:last-child { border-bottom: none; padding-bottom: 0 !important; }
          .hero-stat-strip .flip-stat .stat-val { font-size: 1.3rem !important; }
        }

        /* PREMIUM MOBILE CARD MENU */
        .mobile-card-menu {
          width: 100%;
          max-width: 440px;
          background: ${themeMode === 'light'
          ? 'linear-gradient(180deg, #FFFFFF 0%, #F4F7F5 100%)'
          : 'linear-gradient(180deg, #151B18 0%, #0F1412 100%)'};
          border: 1px solid ${themeMode === 'light' ? 'rgba(15,30,25,0.10)' : 'rgba(255, 255, 255, 0.08)'};
          border-radius: 24px;
          padding: 8px 0px 8px 0px;
          display: flex;
          flex-direction: column;
          box-shadow: ${themeMode === 'light' ? '0 24px 48px rgba(15,30,25,0.10)' : '0 24px 48px rgba(0, 0, 0, 0.6)'};
          position: relative;
          overflow: hidden;
        }
        .mobile-card-menu::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -30%;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, ${themeMode === 'light' ? 'rgba(0,169,87,0.10)' : 'rgba(0,255,136,0.16)'}, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .mobile-card-menu > * { position: relative; z-index: 1; }
        .mobile-card-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          color: ${TEXT};
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 1px solid ${themeMode === 'light' ? 'rgba(15,30,25,0.08)' : 'rgba(255, 255, 255, 0.06)'};
          transition: background-color 0.2s, color 0.2s;
        }
        .mobile-card-link:last-child {
          border-bottom: none;
        }
        .mobile-card-link:hover {
          background-color: ${themeMode === 'light' ? 'rgba(15,30,25,0.04)' : 'rgba(255, 255, 255, 0.03)'};
          color: ${ACCENT};
        }
        .mobile-card-link:hover svg {
          stroke: ${ACCENT};
          transform: translateX(2px);
        }
        .mobile-card-btn-container {
          padding: 14px 11px 9px 11px;
          border-top: 1px solid ${themeMode === 'light' ? 'rgba(15,30,25,0.08)' : 'rgba(255, 255, 255, 0.06)'};
        }
        .mobile-card-btn {
          width: 100%;
          background: ${ACCENT};
          color: ${ACCENT_ON};
          border: none;
          padding: 16px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .mobile-card-btn:hover {
          background: ${themeMode === 'light' ? ACCENT_SOFT : '#B5F08A'};
          transform: translateY(-1px);
        }
        .mobile-card-btn:hover svg {
          transform: translateX(2px);
        }

        /* DESKTOP NAV — glassmorphism capsule pill (light theme only) */
        .desktop-nav.nav-capsule {
          padding: 10px 28px !important;
          background: rgba(15, 30, 25, 0.05);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(15, 30, 25, 0.08);
          border-radius: 999px;
          box-shadow: 0 8px 32px rgba(15, 30, 25, 0.06);
          gap: 28px !important;
        }
        .desktop-nav.nav-capsule .nav-link { color: rgba(15, 30, 25, 0.7); }
        .desktop-nav.nav-capsule .nav-link:hover { color: rgba(15, 30, 25, 0.95); }
        .desktop-nav.nav-capsule .nav-services-wrap.is-open .nav-services-trigger { color: ${ACCENT}; }
        .desktop-nav.nav-capsule .nav-services-trigger svg { stroke: rgba(15, 30, 25, 0.55); }
        .desktop-nav.nav-capsule .nav-services-wrap.is-open .nav-services-trigger svg { stroke: ${ACCENT}; }

        /* DESKTOP NAV — Services dropdown */
        .nav-link {
          color: ${TEXT_DIM};
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 200ms;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link:hover { color: ${TEXT}; }
        .nav-services-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .nav-services-trigger svg {
          transition: transform 220ms ease, stroke 200ms;
        }
        .nav-services-wrap.is-open .nav-services-trigger svg {
          transform: rotate(180deg);
          stroke: ${ACCENT};
        }
        .nav-services-wrap.is-open .nav-services-trigger { color: ${ACCENT}; }
        .nav-services-menu {
          position: absolute;
          top: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 260px;
          background: ${SURFACE};
          border: 1px solid ${BORDER_STRONG};
          border-radius: 14px;
          padding: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,255,136,0.04);
          z-index: 100;
        }
        .nav-services-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 14px;
          border-radius: 9px;
          color: ${TEXT};
          background: none;
          border: none;
          width: 100%;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: -0.005em;
          cursor: pointer;
          text-align: left;
          transition: background-color 180ms, color 180ms;
        }
        .nav-services-item svg {
          color: ${TEXT_DIM};
          transition: color 200ms, transform 200ms;
        }
        .nav-services-item:hover {
          background: rgba(0,255,136,0.08);
          color: ${ACCENT};
        }
        .nav-services-item:hover svg {
          color: ${ACCENT};
          transform: translateX(2px);
        }
      `}</style>

      {/* HEADER */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '72px', display: 'flex', alignItems: 'center', padding: '0 var(--side-padding)', background: themeMode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(11,15,13,0.78)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('home')}>
          <img className="header-logo" src={logo} alt="TRIO" style={{ height: '96px', width: 'auto', position: 'relative', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav */}
        <div className={`desktop-nav${themeMode === 'light' ? ' nav-capsule' : ''}`} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 32, alignItems: 'center' }}>
          <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('find-stations'); }}>Find stations</a>

          <div className={`nav-services-wrap${desktopServicesOpen ? ' is-open' : ''}`} ref={servicesMenuRef}>
            <button
              className="nav-link nav-services-trigger"
              type="button"
              aria-expanded={desktopServicesOpen}
              onClick={() => setDesktopServicesOpen(o => !o)}
            >
              Services
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {desktopServicesOpen && (
              <div className="nav-services-menu" role="menu">
                {[
                  { label: 'Charging Solutions', target: 'premium-charging-hub' },
                  { label: 'CPM Application', target: 'cpms' },
                  { label: 'Energy Management', target: 'ev-infra-consultancy' },
                  { label: 'Hardware Supply', target: 'charger-supply' },
                  { label: 'Maintenance & Support', target: 'om-services' },
                ].map(s => (
                  <button
                    key={s.target}
                    className="nav-services-item"
                    type="button"
                    onClick={() => { setDesktopServicesOpen(false); navigate(s.target as any); }}
                  >
                    <span>{s.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('about-us'); }}>About us</a>
          <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('blog'); }}>Blog</a>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isMobile && !['premium-charging-hub', 'cpms', 'ev-infra-consultancy', 'charger-supply', 'om-services'].includes(page) && (
            <button
              className="btn-accent"
              onClick={() => setShowContactForm(true)}
              style={{ padding: '12px 28px', fontSize: '0.88rem', fontWeight: 700 }}
            >
              Contact Us
            </button>
          )}

          <button className="menu-toggle" onClick={() => setShowMobileMenu(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              overflowY: 'auto',
              justifyContent: 'center',
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            <button
              style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: TEXT, cursor: 'pointer', zIndex: 10 }}
              onClick={() => setShowMobileMenu(false)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Styled Menu Card */}
            <div className="mobile-card-menu">
              {/* List of Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {[
                  { label: 'Find stations', target: 'find-stations' },
                ].map(l => (
                  <a
                    key={l.label}
                    href="#"
                    className="mobile-card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(l.target as any);
                      setShowMobileMenu(false);
                    }}
                  >
                    <span>{l.label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={themeMode === "light" ? "rgba(15,30,25,0.45)" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s, transform 0.2s' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                ))}

                {/* Services — expandable dropdown */}
                <button
                  className="mobile-card-link"
                  style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 600, borderBottom: `1px solid ${themeMode === 'light' ? 'rgba(15,30,25,0.08)' : 'rgba(255,255,255,0.06)'}` }}
                  onClick={() => setMobileServicesOpen(o => !o)}
                >
                  <span>Services</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={mobileServicesOpen ? ACCENT : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.25s, stroke 0.2s', transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: mobileServicesOpen ? 1 : 0.55 }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden', background: 'rgba(0,255,136,0.03)' }}
                    >
                      {[
                        { label: 'Charging Solutions', target: 'premium-charging-hub' },
                        { label: 'CPM Application', target: 'cpms' },
                        { label: 'Energy Management', target: 'ev-infra-consultancy' },
                        { label: 'Hardware Supply', target: 'charger-supply' },
                        { label: 'Maintenance & Support', target: 'om-services' },
                      ].map(s => (
                        <a
                          key={s.target}
                          href="#"
                          className="mobile-card-link"
                          style={{ paddingLeft: 40, fontSize: '0.98rem', fontWeight: 500 }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(s.target as any);
                            setShowMobileMenu(false);
                            setMobileServicesOpen(false);
                          }}
                        >
                          <span>{s.label}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={themeMode === "light" ? "rgba(15,30,25,0.45)" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {[
                  { label: 'About us', target: 'about-us' },
                  { label: 'Blog', target: 'blog' },
                ].map(l => (
                  <a
                    key={l.label}
                    href="#"
                    className="mobile-card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(l.target as any);
                      setShowMobileMenu(false);
                    }}
                  >
                    <span>{l.label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={themeMode === "light" ? "rgba(15,30,25,0.45)" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s, transform 0.2s' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                ))}
              </div>

              {/* Contact Button Container */}
              <div className="mobile-card-btn-container">
                <button
                  className="mobile-card-btn"
                  onClick={() => {
                    setShowContactForm(true);
                    setShowMobileMenu(false);
                  }}
                >
                  <span>Contact Us</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NoticeModal />
      <ContactSalesForm
        open={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          if (page === 'contact-us') setPage('home');
        }}
      />

      {/* STATION DETAIL — bottom sheet (global; opens from Find-stations list and from ENERGY SYNAPSE mobile map) */}
      <AnimatePresence>
        {stationSheetOpen && selectedStation && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setStationSheetOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1500 }}
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 500) setStationSheetOpen(false); }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(180deg, ${SURFACE}, ${BG})`,
                borderTop: `1px solid ${BORDER_STRONG}`,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                zIndex: 1600,
                padding: '10px 20px 28px',
                maxHeight: '88vh',
                overflowY: 'auto',
                boxShadow: `0 -16px 40px rgba(0,0,0,0.5), 0 0 60px ${ACCENT}14`,
              }}
            >
              {/* Drag handle */}
              <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.22)', borderRadius: 999, margin: '0 auto 18px' }} />

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {selectedStation.id} · Charging Station
                  </div>
                  <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 2 }}>{selectedStation.name}</h2>
                  <div style={{ color: TEXT_DIM, fontSize: '0.78rem' }}>{selectedStation.state}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStationSheetOpen(false)}
                  aria-label="Close"
                  style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.06)', color: TEXT, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Specs table */}
              <div style={{ marginBottom: 18 }}>
                {[
                  { label: 'POWER', value: <><span style={{ color: ACCENT }}>{selectedStation.kw}</span> <span style={{ color: TEXT }}>kW</span></> },
                  { label: 'CONNECTOR', value: <span style={{ color: ACCENT }}>{selectedStation.conn}</span> },
                  { label: 'COORDS', value: <span style={{ color: TEXT }}>{selectedStation.lat.toFixed(2)}° N, {selectedStation.lon.toFixed(2)}° E</span> },
                  { label: 'STALLS', value: <><span style={{ color: ACCENT }}>{selectedStation.stalls}</span> <span style={{ color: TEXT }}>available</span></> },
                  { label: 'TARIFF', value: <span style={{ color: ACCENT }}>₹ {selectedStation.tariff}/ kWh</span> },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 0',
                      borderBottom: i < arr.length - 1 ? `1px dashed ${BORDER_STRONG}` : 'none',
                    }}
                  >
                    <span className="mono" style={{ color: TEXT_DIM, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em' }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Online status footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
                <span className="circle pulse-dot" style={{ width: 7, height: 7, background: ACCENT, color: ACCENT }} />
                <span className="mono" style={{ color: ACCENT, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em' }}>
                  ONLINE · ACCEPTING SESSIONS
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-accent"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lon}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  style={{ flex: 1, padding: '15px 20px', fontSize: '0.9rem', fontWeight: 700, justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  Get directions
                </button>
                <button
                  type="button"
                  onClick={() => { setStationSheetOpen(false); setShowContactForm(true); }}
                  aria-label="Reserve / contact"
                  style={{ width: 52, height: 52, borderRadius: 999, border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Floating WhatsApp contact button */}
            <a
              href={`https://wa.me/916291842407?text=${encodeURIComponent('Hi, I want to inquire about charging')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              style={{
                position: 'fixed',
                bottom: isMobile ? 20 : 28,
                right: isMobile ? 20 : 28,
                width: isMobile ? 52 : 60,
                height: isMobile ? 52 : 60,
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 9000,
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
            >
              <svg width={isMobile ? 26 : 30} height={isMobile ? 26 : 30} viewBox="0 0 24 24" fill="#fff">
                <path d={SOCIAL_ICONS.whatsapp} />
              </svg>
            </a>

            {/* HERO — refined, premium */}
            <HeroCarousel fallback={
              isMobile ? (
                <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 92, paddingBottom: 48, background: BG }}>
                  {/* Ambient gradients */}
                  <div style={{ position: 'absolute', top: '12%', right: '-35%', width: 480, height: 480, background: `radial-gradient(circle, ${ACCENT_SOFT}28, transparent 65%)`, pointerEvents: 'none', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-15%', left: '-35%', width: 420, height: 420, background: `radial-gradient(circle, ${ACCENT_SOFT}1c, transparent 70%)`, pointerEvents: 'none', borderRadius: '50%' }} />

                  <div style={{ position: 'relative', zIndex: 5, padding: '0 20px' }}>
                    {/* Live status pill */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px', border: `1px solid ${BORDER_STRONG}`, borderRadius: 999, background: themeMode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(11,15,13,0.6)', backdropFilter: 'blur(10px)', marginBottom: 22 }}
                    >
                      <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                      <span className="mono" style={{ color: ACCENT, fontSize: '0.62rem', letterSpacing: '0.14em', fontWeight: 600 }}>LIVE · {clock || '--:--:--'}</span>
                    </motion.div>

                    {/* Title */}
                    <h1 style={{ fontSize: '2.6rem', lineHeight: 1.0, marginBottom: 14, fontWeight: 700, letterSpacing: '-0.035em' }}>
                      <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: 'block' }}>
                        EV power,
                      </motion.span>
                      <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: 'block', color: ACCENT }}>
                        redefined.
                      </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      style={{ color: TEXT_DIM, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 340 }}
                    >
                      The intelligence layer for industrial scale charging — from grid to vehicle, in real time.
                    </motion.p>

                    {/* Charger showcase */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: 'relative', height: 300, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {/* Floor glow */}
                      <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '85%', height: '32%', background: `radial-gradient(ellipse at center, ${ACCENT}38, transparent 65%)`, pointerEvents: 'none', filter: 'blur(10px)', zIndex: 0 }} />

                      {/* Soft radial spotlight backdrop */}
                      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${ACCENT_SOFT}10, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />

                      {/* Connecting lines — charger ↔ badges. Lines start just outside the charger silhouette and terminate inside each badge's bounding box (badges have higher z-index so they cleanly cap the line). */}
                      <svg
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                      >
                        {/* Top-right line: exits charger right side → bends up → enters CHARGING badge from below */}
                        <motion.path
                          d="M 58 32 L 88 32 L 88 10"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.4"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                          opacity={0.7}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, -12] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.path
                          d="M 58 32 L 88 32 L 88 10"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="10 200"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 4px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [200, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Bottom-left line: exits charger left side → bends down → enters CONNECTOR badge from above */}
                        <motion.path
                          d="M 42 32 L 12 32 L 12 50"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.4"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                          opacity={0.7}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, -12] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.path
                          d="M 42 32 L 12 32 L 12 50"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="10 200"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 4px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [200, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        />
                      </svg>

                      {/* Charger image + TRIO wordmark on the head — float wrapper for both */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: '72%',
                          maxWidth: 240,
                          filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.55))',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <img src={charger3d} alt="Trio Charger" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </motion.div>

                      {/* Charging status badge — top right */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: 12 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          boxShadow: [
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 22px 3px rgba(0,255,136,0.55)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                          ],
                        }}
                        transition={{
                          default: { delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                          boxShadow: { duration: 2.4, times: [0, 0.82, 0.95, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                        }}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 8,
                          background: themeMode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(11,15,13,0.88)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: `1px solid ${ACCENT}55`,
                          borderRadius: 10,
                          padding: '6px 9px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          zIndex: 3,
                        }}
                      >
                        <span style={{ width: 12, height: 12, color: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <div>
                          <div style={{ fontSize: '0.46rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>Total Customers</div>
                          <div style={{ fontSize: '0.72rem', color: TEXT, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>1,000<span style={{ color: ACCENT, fontSize: '0.58rem' }}>+</span></div>
                        </div>
                      </motion.div>

                      {/* Connector badge — bottom left */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: -12 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          boxShadow: [
                            '0 0 0 0 rgba(0,255,136,0)',
                            '0 0 0 0 rgba(0,255,136,0)',
                            '0 0 22px 3px rgba(0,255,136,0.55)',
                            '0 0 0 0 rgba(0,255,136,0)',
                          ],
                        }}
                        transition={{
                          default: { delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                          boxShadow: { duration: 2.4, times: [0, 0.82, 0.95, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.7 },
                        }}
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          left: 8,
                          background: themeMode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(11,15,13,0.88)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: `1px solid ${BORDER_STRONG}`,
                          borderRadius: 10,
                          padding: '6px 9px',
                          zIndex: 3,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ width: 12, height: 12, color: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          </span>
                          <div>
                            <div style={{ fontSize: '0.46rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>Total Units Consumed</div>
                            <div style={{ fontSize: '0.72rem', color: TEXT, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>½ million<span style={{ color: ACCENT, fontSize: '0.58rem' }}>+</span></div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 0.5 }}
                      style={{ display: 'flex', gap: 10, marginBottom: 28 }}
                    >
                      <button
                        className="btn-accent"
                        onClick={() => setPage('find-stations')}
                        style={{ flex: 1, padding: '15px 20px', fontSize: '0.92rem', fontWeight: 700, justifyContent: 'center' }}
                      >
                        Find a station <span style={{ fontSize: '1.05rem' }}>→</span>
                      </button>
                      <button
                        onClick={() => { const el = document.querySelector('#network'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                        aria-label="View network"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 999,
                          border: `1px solid ${BORDER_STRONG}`,
                          background: SURFACE,
                          color: ACCENT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      </button>
                    </motion.div>

                    {/* Live stat cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85, duration: 0.5 }}
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
                    >
                      {[
                        { label: 'Stations', val: '10+', accent: true },
                        { label: 'kWh today', val: '4.0K' },
                        { label: 'Avg session', val: '35 min' },
                      ].map((s, i) => (
                        <div
                          key={i}
                          style={{
                            background: s.accent ? `${ACCENT}10` : SURFACE,
                            border: `1px solid ${s.accent ? BORDER_STRONG : BORDER}`,
                            borderRadius: 12,
                            padding: '12px 10px',
                          }}
                        >
                          <div style={{ fontSize: '1rem', color: s.accent ? ACCENT : TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{s.val}</div>
                          <div style={{ fontSize: '0.62rem', color: TEXT_DIM, fontWeight: 500, marginTop: 5, letterSpacing: '0.03em' }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </section>
              ) : (
                <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 72, background: BG }}>
                  {/* Subtle ambient gradient */}
                  <div style={{ position: 'absolute', right: '-10%', top: '15%', width: 760, height: 760, background: `radial-gradient(circle, ${ACCENT_SOFT}22, transparent 60%)`, pointerEvents: 'none', borderRadius: '50%' }} />

                  <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 80, padding: '24px var(--side-padding) 0', alignItems: 'center', minHeight: 'calc(100vh - 120px)', position: 'relative', zIndex: 5, maxWidth: 1440, margin: '0 auto' }}>

                    {/* LEFT COLUMN */}
                    <div className="hero-left">
                      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                        {/* Eyebrow */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '6px 12px', border: `1px solid ${BORDER}`, borderRadius: 999, background: SURFACE }}>
                          <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                          <span className="eyebrow" style={{ color: ACCENT_SOFT, fontSize: '0.68rem' }}>Live network · {clock || '--:--:--'}</span>
                        </div>

                        {/* TITLE */}
                        <h1 style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.8rem)', lineHeight: 1.02, marginBottom: 28, fontWeight: 600 }}>
                          <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'block' }}>
                            EV power,
                          </motion.span>
                          <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'block', color: ACCENT }}>
                            redefined.
                          </motion.span>
                        </h1>

                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                          style={{ color: TEXT_DIM, fontSize: '1.1rem', lineHeight: 1.65, marginBottom: 40, maxWidth: '520px', fontWeight: 400 }}
                        >
                          The intelligence layer for industrial scale charging infrastructure orchestrating every electron from grid to vehicle, in real time.
                        </motion.p>

                        <motion.div
                          className="hero-btns"
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                          style={{ display: 'flex', gap: 12, marginBottom: 64 }}
                        >
                          <button
                            className="btn-accent"
                            onClick={() => setPage('find-stations')}
                          >
                            Find a station <span style={{ fontSize: '1rem' }}>→</span>
                          </button>
                        </motion.div>

                        {/* STAT STRIP */}
                        <motion.div
                          className="hero-stat-strip"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 640, gap: 0 }}
                        >
                          <FlipStat label="Stations live" value="10+" />
                          <FlipStat label="kWh delivered today" value="4,000" />
                          <FlipStat label="Avg session" value="35 min" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* RIGHT COLUMN — charger */}
                    <div className="hero-right hero-right-charger" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
                      {/* Soft floor gradient */}
                      <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '40%', background: `radial-gradient(ellipse at center, ${ACCENT_SOFT}1f, transparent 65%)`, pointerEvents: 'none' }} />

                      {/* charger image + TRIO wordmark on the head — entrance then continuous float (matches mobile hero) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                        transition={{
                          opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                          scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
                        }}
                        style={{ position: 'relative', width: '100%', maxWidth: '680px', zIndex: 5 }}
                      >
                        <img src={charger3d} alt="Trio Charger" style={{ width: '100%', display: 'block' }} />
                      </motion.div>

                      {/* HUD cards & Charging Lines */}
                      <div className="hero-hud-left" style={{ position: 'absolute', top: '22%', left: '-15%', zIndex: 20 }}>
                        <HUDCard
                          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                          title="Total Customers"
                          value="1,000+"
                          delay={0.8}
                          lineCycle={9}
                        />
                      </div>
                      <div className="hero-hud-right" style={{ position: 'absolute', bottom: '28%', right: '-15%', zIndex: 20 }}>
                        <HUDCard
                          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                          title="Total units consumed"
                          value="½ million+"
                          delay={1.0}
                          lineCycle={8}
                        />
                      </div>

                      {/* CHARGING LINES — Static green dashed connectors. preserveAspectRatio=none so SVG units map 1:1 to container percentages; overflow:visible lets lines extend outside viewBox to reach cards (which sit at left/right:-15%) */}
                      <svg
                        className="hero-charging-lines"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
                        viewBox="0 0 1000 600"
                        preserveAspectRatio="none"
                      >
                        {/* Left Connection (Total Customers): flowing dashes toward card. Path is card→charger so positive offset moves dashes toward card */}
                        <motion.path
                          d="M -25 180 L -25 380 L 360 380"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.5"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                          opacity={0.75}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, 24] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Bright pulse traveling from charger → card (left) */}
                        <motion.path
                          d="M -25 180 L -25 380 L 360 380"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="50 600"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [-650, 0] }}
                          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Right Connection (Total units consumed): flowing dashes toward card. Path is charger→card so negative offset moves dashes toward card */}
                        <motion.path
                          d="M 760 320 L 1025 320 L 1025 380"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.5"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                          opacity={0.75}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, -24] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Bright pulse traveling from charger → card (right) */}
                        <motion.path
                          d="M 760 320 L 1025 320 L 1025 380"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="40 360"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [400, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom ticker — Siemens Energy partnership */}
                  <div className="ticker" style={{ position: 'relative', marginTop: 64 }}>
                    <div className="ticker-track">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span
                          key={i}
                          className="ticker-item"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}
                        >
                          <span style={{ color: ACCENT_SOFT }}>●</span>
                          <span style={{ color: TEXT, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Eastern India's only e-mobility partner of
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                            <span
                              style={{
                                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                                color: '#009999',
                              }}
                            >
                              SIEMENS
                            </span>
                            <span style={{ color: TEXT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              energy
                            </span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )
            } />

            {/* OUR SERVICES */}
            <section id="services" style={{ padding: isMobile ? '48px 20px 56px' : '40px var(--side-padding) 60px', position: 'relative', overflow: 'hidden', background: BG }}>
              {isMobile ? (() => {
                const MOBILE_SERVICES = [
                  {
                    short: 'Charging',
                    title: 'Charging Solutions',
                    desc: 'Level 2 charging at 240V — moderate speed, ideal for daily use and longer stops.',
                    features: ['Universal CCS · CHAdeMO · Type 2', '240V smart output', '4–8 hour full charge'],
                    tag: 'Daily use',
                    target: 'premium-charging-hub',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                  },
                  {
                    short: 'CPMS',
                    title: 'Charging Point Management Application',
                    desc: 'Locate stations, start sessions, and pay seamlessly through the Trio app. Real-time availability with smart routing built in.',
                    features: ['Live station availability', 'In-app payments', 'Smart route planning'],
                    tag: 'One-tap',
                    target: 'cpms',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2.5" ry="2.5" /><line x1="12" y1="18" x2="12" y2="18" /></svg>,
                  },
                  {
                    short: 'Energy',
                    title: 'Energy Management',
                    desc: 'Hubs powered by 100% renewable energy with BESS stabilization for grid resilience and zero net emissions.',
                    features: ['100% renewable input', 'BESS grid stabilization', 'Zero carbon footprint'],
                    tag: 'Renewable',
                    target: 'ev-infra-consultancy',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-7-5-7-12a7 7 0 0 1 14 0c0 7-7 12-7 12z" /><path d="M9 9c1 2 3 3 6 3" /></svg>,
                  },
                  {
                    short: 'Hardware',
                    title: 'Hardware Supply',
                    desc: 'Turnkey supply and installation — 60kW DC chargers, ACDB panels, industrial cabling, chemical earthing, and custom canopies.',
                    features: ['Dual-gun CCS2 chargers', 'IP65-rated ACDB panels', 'Custom branded canopy'],
                    tag: 'Turnkey',
                    target: 'charger-supply',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="13" height="13" rx="2" /><path d="M16 10h3l2 3v5a1 1 0 0 1-1 1h-1" /><circle cx="7" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>,
                  },
                  {
                    short: 'Support',
                    title: 'Maintenance & Support',
                    desc: '24/7 O&M with tiered support, ≥97% uptime SLAs, certified field engineers, and audit-ready compliance reporting.',
                    features: ['≥97% uptime SLA', 'Tiered L1 → L2 → L3 support', 'Compliance reporting'],
                    tag: '24 / 7',
                    target: 'om-services',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3z" /><path d="M3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>,
                  },
                ];
                const current = MOBILE_SERVICES[activeService];
                return (
                  <div style={{ position: 'relative', zIndex: 5 }}>
                    {/* Ambient backdrop */}
                    <div style={{ position: 'absolute', top: '15%', right: '-30%', width: 360, height: 360, background: `radial-gradient(circle, ${ACCENT_SOFT}18, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                    {/* Eyebrow + title */}
                    <motion.div initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ position: 'relative' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 14 }}>
                        <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                        <span className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>WHAT WE OFFER</span>
                      </div>
                      <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: TEXT, lineHeight: 1.05, marginBottom: 8, letterSpacing: '-0.03em' }}>
                        Powering your fleet,<br /><span style={{ color: ACCENT }}>end to end.</span>
                      </h2>
                      <p style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.55, marginBottom: 22 }}>
                        Five integrated services that take your EV operation from grid to gateway.
                      </p>
                    </motion.div>

                    {/* Integrated eco-car charging animation iframe */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 220,
                        overflow: 'hidden',
                        borderRadius: 20,
                        background: SURFACE,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        marginTop: 12,
                        marginBottom: 20,
                        border: `1px solid ${BORDER_STRONG}`
                      }}
                    >
                      <iframe
                        src="/ev-eco-car.html"
                        title="TRIO EV — Eco Charging"
                        style={{
                          width: '140%',
                          height: '140%',
                          position: 'absolute',
                          top: '-20%',
                          left: '-20%',
                          border: 'none',
                          display: 'block',
                          background: SURFACE,
                        }}
                      />
                    </div>

                    {/* Hero showcase card — swipeable, slides up from below with subtle 3D tilt */}
                    <div style={{ position: 'relative', perspective: 1200, minHeight: 360, marginTop: 24 }}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeService}
                          initial={{ opacity: 0, x: 80 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -80 }}
                          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.18}
                          dragMomentum={false}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50 && activeService < MOBILE_SERVICES.length - 1) {
                              setActiveService(activeService + 1);
                            } else if (info.offset.x > 50 && activeService > 0) {
                              setActiveService(activeService - 1);
                            }
                          }}
                          style={{
                            background: `linear-gradient(150deg, ${SURFACE} 0%, ${BG} 100%)`,
                            border: `1px solid ${BORDER_STRONG}`,
                            borderRadius: 22,
                            padding: '24px 22px',
                            position: 'relative',
                            overflow: 'hidden',
                            transformStyle: 'preserve-3d',
                            cursor: 'grab',
                            touchAction: 'pan-y',
                          }}
                        >
                          {/* Glow blob */}
                          <div style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, background: `radial-gradient(circle, ${ACCENT}26, transparent 70%)`, pointerEvents: 'none' }} />
                          {/* Dotted grid */}
                          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${ACCENT}12 1px, transparent 1px)`, backgroundSize: '16px 16px', opacity: 0.4, pointerEvents: 'none', maskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)' }} />

                          <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Top row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                              <div className="mono" style={{ color: ACCENT, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', marginTop: 14 }}>
                                0{activeService + 1} <span style={{ color: TEXT_DIM, fontWeight: 500 }}>/ 0{MOBILE_SERVICES.length}</span>
                              </div>
                              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${ACCENT}1a`, border: `1px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, boxShadow: `0 0 24px ${ACCENT}22 inset, 0 0 16px ${ACCENT}22` }}>
                                {current.icon}
                              </div>
                            </div>

                            {/* Tag pill */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', background: themeMode === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(11,15,13,0.55)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 999, marginBottom: 12 }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />
                              <span style={{ fontSize: '0.6rem', color: ACCENT, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.tag}</span>
                            </div>

                            {/* Title */}
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: TEXT, marginBottom: 12, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                              {current.title}
                            </h3>

                            {/* Description */}
                            <p style={{ color: TEXT_DIM, fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 22 }}>
                              {current.desc}
                            </p>

                            {/* Feature list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                              {current.features.map((f, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 11 }}
                                >
                                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${ACCENT}1c`, border: `1px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                  </div>
                                  <span style={{ color: TEXT, fontSize: '0.84rem', lineHeight: 1.4 }}>{f}</span>
                                </motion.div>
                              ))}
                            </div>

                            {/* Explore Solutions CTA */}
                            <div style={{ marginTop: 24 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(current.target);
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  padding: '12px 20px',
                                  background: `linear-gradient(90deg, ${ACCENT}e0 0%, ${ACCENT_SOFT}e0 100%)`,
                                  border: 'none',
                                  borderRadius: 12,
                                  color: BG,
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: `0 4px 12px ${ACCENT}22`,
                                  fontFamily: 'Inter, sans-serif',
                                  transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e: any) => {
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e: any) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                Explore {current.short} Solutions
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Carousel controls — pagination dots + arrows (matches why-ev section) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {MOBILE_SERVICES.map((_, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveService(i)}
                            style={{
                              width: activeService === i ? 24 : 6,
                              height: 6,
                              borderRadius: 999,
                              background: activeService === i ? ACCENT : 'rgba(255,255,255,0.22)',
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setActiveService((activeService - 1 + MOBILE_SERVICES.length) % MOBILE_SERVICES.length)}
                          aria-label="Previous service"
                          style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                          onClick={() => setActiveService((activeService + 1) % MOBILE_SERVICES.length)}
                          aria-label="Next service"
                          style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="services-eyebrow" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e0e0e0', marginBottom: 16, textTransform: 'uppercase' }}>
                      EXPLORE OUR SERVICES
                    </div>
                    <h2 className="services-h2" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', fontWeight: 800, letterSpacing: -0.01, marginBottom: 20, textTransform: 'uppercase', filter: headingShadow, ...gradTextStyle }}>
                      OUR SERVICES
                    </h2>
                    <p className="services-tag" style={{ color: TEXT_DIM, fontSize: '1.05rem', fontWeight: 400, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                      We provide the best services for your electric vehicles, Fast,<br />Convenient and Eco-friendly.
                    </p>
                  </div>

                  {/* Main Content Grid — left: live EV-Eco animation iframe + active description, right: services list */}
                  <div className="services-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'stretch', marginTop: 20 }}>
                    {/* Left: live animated hero + active service description */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div
                        className="services-iframe-wrap"
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '460px',
                          marginBottom: 36,
                          overflow: 'hidden',
                        }}
                      >
                        <iframe
                          src="/ev-eco-car.html"
                          title="TRIO EV — Eco Charging"
                          style={{
                            width: '130%',
                            height: '130%',
                            position: 'absolute',
                            top: '-15%',
                            left: '-15%',
                            border: 'none',
                            display: 'block',
                            background: SURFACE,
                          }}
                        />
                      </div>

                      {(() => {
                        const SERVICES = [
                          { title: 'CHARGING SOLUTIONS', desc: 'Premium DC fast charging hubs with dedicated 60kW bays, structural canopies, and a hospitality lounge for drivers.' },
                          { title: 'CHARGING POINT MANAGEMENT APPLICATION', desc: 'Cloud CPMS — live station discovery, in-app sessions, dynamic tariffs, multi-payment, and white-label driver experience.' },
                          { title: 'ENERGY MANAGEMENT', desc: 'End-to-end infrastructure consultancy — site feasibility, load planning, solar + BESS integration, and grid interconnection.' },
                          { title: 'HARDWARE SUPPLY', desc: 'Turnkey supply and installation — 60kW chargers, ACDB panels, industrial cabling, chemical earthing, and custom canopies.' },
                          { title: 'MAINTENANCE & SUPPORT', desc: '24/7 O&M with tiered support, ≥97% uptime SLAs, certified field engineers, and audit-ready compliance reporting.' }
                        ];
                        return (
                          <div className="services-desc" style={{ paddingLeft: 12 }}>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeService}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: HEADING, textTransform: 'uppercase', marginBottom: 14, letterSpacing: -0.01 }}>
                                  {SERVICES[activeService].title}
                                </h3>
                                <p style={{ color: TEXT_DIM, fontSize: '1rem', lineHeight: 1.6, maxWidth: '90%' }}>
                                  {SERVICES[activeService].desc}
                                </p>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Right: compact clickable services list — click navigates to dedicated page */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 460 }}>
                      {[
                        { title: 'CHARGING SOLUTIONS', target: 'premium-charging-hub' },
                        { title: 'CHARGING POINT MANAGEMENT APPLICATION', target: 'cpms' },
                        { title: 'ENERGY MANAGEMENT', target: 'ev-infra-consultancy' },
                        { title: 'HARDWARE SUPPLY', target: 'charger-supply' },
                        { title: 'MAINTENANCE & SUPPORT', target: 'om-services' }
                      ].map((srv, idx) => {
                        const isActive = activeService === idx;
                        return (
                          <div
                            key={idx}
                            className="service-item"
                            onClick={() => navigate(srv.target)}
                            onMouseEnter={() => setActiveService(idx)}
                            style={{
                              padding: '16px 28px',
                              cursor: 'pointer',
                              position: 'relative',
                              borderBottom: idx === 4 ? 'none' : `1px solid ${BORDER}`,
                              background: 'transparent',
                              transition: 'all 0.3s ease',
                              borderLeft: '4px solid transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 16,
                            }}
                          >
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: isActive ? ACCENT : HEADING, textTransform: 'uppercase', letterSpacing: -0.01, transition: 'color 0.3s ease', margin: 0 }}>
                              {srv.title}
                            </h4>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={isActive ? ACCENT : 'rgba(255,255,255,0.4)'}
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ transition: 'all 0.3s ease', transform: isActive ? 'translateX(2px)' : 'translateX(0)', flexShrink: 0 }}
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>



            {/* INDIA COVERAGE — operational dashboard */}
            {/* INDIA COVERAGE OPERATIONAL DASHBOARD (Integrated High-Fidelity Prototype) */}
            <section id="network" className="loader-section" style={{ padding: '60px 0 80px', background: BG, overflow: 'hidden' }}>
              <div className="network-inner" style={{ maxWidth: 1250, margin: '0 auto', padding: '0 40px' }}>
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 99, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, background: '#00FF88', borderRadius: '50%', boxShadow: '0 0 10px #00FF88' }}></div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00FF88', letterSpacing: '0.12em', textTransform: 'uppercase' }}>System Status: Operational</span>
                  </div>
                  <h2 style={{ fontSize: isMobile ? '1.9rem' : 'clamp(2rem, 3vw, 3rem)', fontWeight: 600, marginBottom: 10, letterSpacing: '-0.03em', color: HEADING }}>
                    ENERGY <span style={{ color: '#00FF88' }}>SYNAPSE</span>
                  </h2>
                  <p style={{ fontSize: isMobile ? '0.88rem' : '1.05rem', color: TEXT_DIM, maxWidth: 540, margin: '0 auto', lineHeight: 1.5 }}>
                    India Coverage Operational Dashboard — Real-time infrastructure telemetry and network deployment metrics.
                  </p>
                </div>

                {isMobile ? (() => {
                  const totalKw = STATIONS.reduce((a, s) => a + s.kw, 0);
                  const stateCount = new Set(STATIONS.map(s => s.state)).size;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      style={{
                        background: BG,
                        border: `1px solid ${BORDER_STRONG}`,
                        borderRadius: 20,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                        marginTop: 72,
                      }}
                    >
                      {/* HUD top bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, background: 'rgba(0,255,136,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="circle pulse-dot" style={{ width: 5, height: 5, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT }}>SCANNING</span>
                        </div>
                        <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', color: TEXT_DIM }}>NETWORK · IND</span>
                        <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.12em', color: TEXT_DIM }}>{clock || '--:--:--'}</span>
                      </div>

                      {/* Map area */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        padding: '8px',
                        background: `radial-gradient(circle at 50% 50%, ${ACCENT}08, transparent 70%)`,
                      }}>
                        {/* HUD corner brackets */}
                        <div style={{ position: 'absolute', top: 12, left: 12, width: 18, height: 18, borderTop: `1.5px solid ${ACCENT_SOFT}`, borderLeft: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, borderTop: `1.5px solid ${ACCENT_SOFT}`, borderRight: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 18, height: 18, borderBottom: `1.5px solid ${ACCENT_SOFT}`, borderLeft: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 18, height: 18, borderBottom: `1.5px solid ${ACCENT_SOFT}`, borderRight: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />

                        {/* Subtle grid backdrop */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ACCENT}08 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}08 1px, transparent 1px)`, backgroundSize: '24px 24px', maskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 85%)', pointerEvents: 'none' }} />

                        {/* The map itself */}
                        <div style={{ position: 'absolute', inset: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IndiaMap />
                        </div>

                        {/* Floating live counter bottom-center */}
                        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: themeMode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(11,15,13,0.85)', border: `1px solid ${ACCENT}44`, borderRadius: 999, backdropFilter: 'blur(8px)', zIndex: 5 }}>
                          <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: TEXT, letterSpacing: '0.06em' }}>{stationsOnline.toLocaleString()}</span>
                          <span style={{ fontSize: '0.58rem', color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>live</span>
                        </div>

                        {/* Cluster detail popup — appears when user taps a cluster, dismissed by tapping outside or close button */}
                        <AnimatePresence>
                          {selectedCluster && (
                            <>
                              <motion.div
                                key="cluster-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => setSelectedClusterId(null)}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 3900 }}
                              />
                              <div
                                key="cluster-popup-outer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'fixed',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: 'calc(100vw - 32px)',
                                  maxWidth: 380,
                                  zIndex: 4000,
                                  pointerEvents: 'auto',
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                  style={{
                                    width: '100%',
                                    background: BG,
                                    border: `1px solid ${ACCENT}`,
                                    borderRadius: 14,
                                    padding: 18,
                                    boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${ACCENT}33`,
                                  }}
                                >
                                  {(() => {
                                    const c = selectedCluster;
                                    const isOne = c.count === 1;
                                    const first = c.stations[0];
                                    const isFast = first && first.kw >= 100;
                                    return (
                                      <>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ color: ACCENT, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 5 }}>{c.state} · {isOne ? 'STATION' : 'CLUSTER'}</div>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: HEADING, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                              {isOne ? first.name : `${c.count} stations in this area`}
                                            </h3>
                                          </div>
                                          <button onClick={() => setSelectedClusterId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: HEADING, cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>×</button>
                                        </div>

                                        {/* Single-station stats: power, connector, status */}
                                        {isOne ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ background: 'rgba(0,255,136,0.06)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Output</div>
                                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{first.kw}<span style={{ fontSize: '0.6rem', marginLeft: 2 }}>kW</span></div>
                                            </div>
                                            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Connector</div>
                                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: TEXT, lineHeight: 1 }}>{first.conn}</div>
                                            </div>
                                            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Type</div>
                                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isFast ? ACCENT : TEXT, lineHeight: 1 }}>{isFast ? 'DC Fast' : 'Standard'}</div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div style={{ display: 'flex', gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div>
                                              <div style={{ fontSize: '1rem', fontWeight: 700, color: ACCENT }}>{c.totalKw}<span style={{ fontSize: '0.62rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW total</span></div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '1rem', fontWeight: 700, color: HEADING }}>{Math.round(c.totalKw / c.count)}<span style={{ fontSize: '0.62rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW avg</span></div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Station list (always shows; for single it's just one row) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 180, overflowY: 'auto' }}>
                                          {c.stations.map((s: any) => (
                                            <div
                                              key={s.id}
                                              onClick={() => { setSelectedStationId(s.id); setSelectedClusterId(null); setStationSheetOpen(true); }}
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                padding: '8px 10px',
                                                borderRadius: 8,
                                              }}
                                            >
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ color: HEADING, fontSize: '0.82rem', fontWeight: 600 }}>{s.name}</div>
                                                <div style={{ color: TEXT_DIM, fontSize: '0.62rem' }}>{s.id}{isOne ? ` · ${s.state}` : ''}</div>
                                              </div>
                                              <div style={{ color: ACCENT, fontWeight: 700, fontSize: '0.82rem' }}>{s.kw} kW</div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </motion.div>
                              </div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bottom stats strip */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${BORDER}`, background: 'rgba(0,255,136,0.02)' }}>
                        {[
                          { val: STATIONS.length.toString(), label: 'Stations' },
                          { val: stateCount.toString(), label: 'States' },
                          { val: (totalKw / 1000).toFixed(1) + ' MW', label: 'Capacity' },
                        ].map((s, i) => (
                          <div key={i} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                            <div style={{ color: i === 0 ? ACCENT : TEXT, fontSize: '0.95rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{s.val}</div>
                            <div style={{ color: TEXT_DIM, fontSize: '0.55rem', marginTop: 4, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })() : (
                  <div className="network-iframe-wrap" style={{
                    width: '100%',
                    height: '560px',
                    background: BG,
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                    position: 'relative'
                  }}>
                    <iframe
                      ref={dashboardIframeRef}
                      src={`/dashboard.html?apiUrl=${iframeApiBase}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: BG
                      }}
                      title="Energy Synapse Dashboard"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* WHY EV CHARGING SECTION */}
            <section id="why-ev" style={{ padding: isMobile ? '56px 20px 72px' : '70px var(--side-padding) 100px', background: BG, position: 'relative', overflow: 'hidden' }}>
              {/* Background Glow */}
              <div style={{ position: 'absolute', left: '-10%', top: '40%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

              {isMobile ? (
                <div style={{ position: 'relative', zIndex: 5 }}>
                  {/* Pill eyebrow */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 18 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>The case for EVs</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    style={{ fontSize: '2.2rem', fontWeight: 800, color: TEXT, lineHeight: 1.08, marginBottom: 14, letterSpacing: '-0.03em' }}
                  >
                    Why EV <span style={{ color: ACCENT }}>charging</span> matters.
                  </motion.h2>

                  {/* Intro */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    style={{ color: TEXT_DIM, fontSize: '0.94rem', lineHeight: 1.65, marginBottom: 28 }}
                  >
                    EV charging is at the forefront of a transportation revolution reshaping the way we move and the world we live in.
                  </motion.p>

                  {/* Combined Expert + Insight card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ background: `linear-gradient(180deg, ${CARD}, ${SURFACE})`, border: `1px solid ${BORDER_STRONG}`, borderRadius: 20, padding: '20px 18px 22px', marginBottom: 18, position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, background: `radial-gradient(circle, ${ACCENT}18, transparent 70%)`, pointerEvents: 'none' }} />

                    {/* Expert header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: `1px solid ${BORDER_STRONG}`, marginBottom: 18, position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${ACCENT}66`, flexShrink: 0, boxShadow: `0 0 18px ${ACCENT}33`, background: SURFACE }}>
                        <img
                          src={professorImg}
                          alt="David M. Johnson"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: ACCENT, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 5 }}>Expert insight</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: TEXT, marginBottom: 2, letterSpacing: '-0.01em' }}>David M. Johnson</div>
                        <div style={{ color: TEXT_DIM, fontSize: '0.68rem', letterSpacing: '0.04em' }}>Environment Professor · Harvard</div>
                      </div>
                    </div>

                    {/* Slide content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span className="mono" style={{ color: ACCENT, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em' }}>
                          0{whySlide + 1} / 0{WHY_SLIDES.length}
                        </span>
                        <svg width="18" height="14" viewBox="0 0 32 24" fill={ACCENT} style={{ opacity: 0.35 }}>
                          <path d="M0 14 C 0 6, 4 0, 12 0 L 12 4 C 8 4, 6 6, 6 12 L 12 12 L 12 24 L 0 24 Z M 20 14 C 20 6, 24 0, 32 0 L 32 4 C 28 4, 26 6, 26 12 L 32 12 L 32 24 L 20 24 Z" />
                        </svg>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={whySlide}
                          initial={{ opacity: 0, x: 60 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -60 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: TEXT, marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                            {WHY_SLIDES[whySlide].title}
                          </h3>
                          <p style={{ color: TEXT_DIM, fontSize: '0.86rem', lineHeight: 1.65, margin: 0 }}>
                            {WHY_SLIDES[whySlide].text}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Carousel controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {WHY_SLIDES.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setWhySlide(i)}
                          style={{
                            width: whySlide === i ? 24 : 6,
                            height: 6,
                            borderRadius: 999,
                            background: whySlide === i ? ACCENT : 'rgba(255,255,255,0.22)',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setWhySlide(prev => (prev - 1 + WHY_SLIDES.length) % WHY_SLIDES.length)}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>
                      <button
                        onClick={() => setWhySlide(prev => (prev + 1) % WHY_SLIDES.length)}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e0e0e0', marginBottom: 16, textTransform: 'uppercase' }}
                    >
                      EV CHARGING IS THE BEST FOR ELECTRICAL VEHICLES
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      style={{
                        fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                        fontWeight: 800,
                        letterSpacing: -0.01,
                        marginBottom: 32,
                        textTransform: 'uppercase',
                        filter: headingShadow,
                        ...gradTextStyle
                      }}
                    >
                      WHY EV CHARGING?
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{ color: TEXT_DIM, fontSize: '1.1rem', fontWeight: 400, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}
                    >
                      Electric vehicle (EV) charging is at the forefront of a transportation revolution that is reshaping the way we move and the world we live in.
                    </motion.p>
                  </div>

                  {/* Content Grid */}
                  <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 100, alignItems: 'center' }}>
                    {/* Left side: Text Carousel */}
                    <div style={{ position: 'relative' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={whySlide}
                          className="why-slide-content"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.5 }}
                          style={{ minHeight: '320px' }}
                        >
                          <h3 className="why-slide-title" style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            marginBottom: 32,
                            letterSpacing: '0.02em',
                            ...gradTextStyle2,
                          }}>
                            {WHY_SLIDES[whySlide].title}
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <p style={{ color: TEXT_DIM, fontSize: '1rem', lineHeight: 1.7 }}>
                              {WHY_SLIDES[whySlide].text}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Carousel Controls */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 48 }}
                      >
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setWhySlide(prev => (prev - 1 + WHY_SLIDES.length) % WHY_SLIDES.length)}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              border: '1px solid rgba(132, 204, 22, 0.4)',
                              background: 'rgba(132, 204, 22, 0.05)',
                              color: '#84cc16',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.15)'; e.currentTarget.style.borderColor = '#84cc16'; }}
                            onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.05)'; e.currentTarget.style.borderColor = 'rgba(132, 204, 22, 0.4)'; }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                          </button>

                          <button
                            onClick={() => setWhySlide(prev => (prev + 1) % WHY_SLIDES.length)}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              border: '1px solid rgba(132, 204, 22, 0.4)',
                              background: 'rgba(132, 204, 22, 0.05)',
                              color: '#84cc16',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.15)'; e.currentTarget.style.borderColor = '#84cc16'; }}
                            onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.05)'; e.currentTarget.style.borderColor = 'rgba(132, 204, 22, 0.4)'; }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          {WHY_SLIDES.map((_, i) => (
                            <div
                              key={i}
                              onClick={() => setWhySlide(i)}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: whySlide === i ? '#84cc16' : 'rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Right side: Professor Profile */}
                    <div className="why-right-col" style={{ textAlign: 'right' }}>
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'relative', display: 'inline-block', marginRight: '60px' }}
                      >
                        {/* Image Container with Gradient Background */}
                        <div className="prof-img-container" style={{
                          width: '420px',
                          height: '520px',
                          background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}>
                          <img
                            src={professorImg}
                            alt="David M. Johnson"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'bottom center',
                              filter: themeMode === 'light' ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.10))' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
                            }}
                          />
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          style={{ marginTop: 32, width: '420px', textAlign: 'center' }}
                        >
                          <h4 className="prof-name" style={{
                            fontSize: '2.4rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            letterSpacing: '-0.02em',
                            marginBottom: 4,
                            ...gradTextStyle,
                          }}>
                            DAVID M. JOHNSON
                          </h4>
                          <p className="prof-role" style={{ color: TEXT_DIM, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            ENVIRONMENT PROFESSOR AT HARVARD
                          </p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* CTA SECTION */}
            <section className="cta-section" style={{ padding: '100px 48px 0', background: `linear-gradient(to bottom, ${BG}, ${SURFACE})`, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <div style={{
                  color: TEXT_DIM,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: 24
                }}>
                  FIND STATION NEAR IN YOUR LOCATION
                </div>

                <h2 style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 'clamp(2rem, 4.2vw, 3.8rem)',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: HEADING,
                  textDecoration: 'none',
                  textShadow: themeMode === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 4px 24px rgba(0,0,0,0.5)',
                  marginBottom: 48,
                  lineHeight: 1.2
                }}>
                  <span style={{ color: HEADING, fontWeight: 900 }}>ENGINEERING THE FUTURE OF</span><br />
                  <span style={{ color: ACCENT, fontWeight: 900 }}>EMISSION-FREE MOBILITY.</span>
                </h2>

                <div className="cta-btn-row" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 80 }}>
                  <button className="btn-accent" onClick={() => navigate('find-stations')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    FIND STATION
                  </button>
                </div>
              </div>

              {/* 3D Illustration — Aggressive attachment */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', zIndex: 5, marginTop: '-20px', marginBottom: 0, lineHeight: 0 }}>
                <img src={hub3d} alt="EV Station 3D" style={{ maxWidth: '100%', width: 1100, objectFit: 'contain', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 -20px 40px rgba(0,0,0,0.6))', marginBottom: '-12px', verticalAlign: 'bottom' }} />
                {/* Subtle glow behind the station */}
                <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, 0)', width: '60%', height: '40%', background: `${ACCENT}20`, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%' }} />
              </div>
            </section>
          </motion.div>
        )}

        {page === 'find-stations' && (
          <motion.section
            key="find-stations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: BG, paddingTop: '72px', overflow: 'hidden' }}
          >
            {isMobile ? (
              <div style={{ padding: '24px 0 80px', minHeight: 'calc(100vh - 72px)', background: BG, position: 'relative', overflow: 'hidden' }}>
                {/* Ambient backdrop glow */}
                <div style={{ position: 'absolute', top: '-5%', right: '-30%', width: 420, height: 420, background: `radial-gradient(circle, ${ACCENT_SOFT}1f, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '40%', left: '-30%', width: 360, height: 360, background: `radial-gradient(circle, ${ACCENT_SOFT}15, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>
                  {/* HERO CARD — pill + title + icon-led stats unified */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: `linear-gradient(150deg, ${SURFACE} 0%, ${BG} 100%)`,
                      border: `1px solid ${BORDER_STRONG}`,
                      borderRadius: 22,
                      padding: '20px 18px',
                      marginBottom: 14,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative glow */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${ACCENT}1c, transparent 70%)`, pointerEvents: 'none' }} />
                    {/* Decorative dotted grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${ACCENT}10 1px, transparent 1px)`, backgroundSize: '18px 18px', opacity: 0.5, pointerEvents: 'none', maskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Top row — pill + icon actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.1)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99 }}>
                          <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>{filteredStations.length} LIVE</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            aria-label={searchOpen ? 'Close search' : 'Open search'}
                            onClick={() => setSearchOpen(o => !o)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              border: `1px solid ${searchOpen ? ACCENT : BORDER_STRONG}`,
                              background: searchOpen ? `${ACCENT}1c` : 'rgba(11,15,13,0.5)',
                              color: searchOpen ? ACCENT : TEXT,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 200ms',
                              backdropFilter: 'blur(6px)',
                            }}
                          >
                            {searchOpen ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={filtersOpen ? 'Close filters' : 'Open filters'}
                            onClick={() => setFiltersOpen(o => !o)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              border: `1px solid ${filtersOpen ? ACCENT : BORDER_STRONG}`,
                              background: filtersOpen ? `${ACCENT}1c` : 'rgba(11,15,13,0.5)',
                              color: filtersOpen ? ACCENT : TEXT,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 200ms',
                              backdropFilter: 'blur(6px)',
                              position: 'relative',
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            {(connFilter !== 'Any' || minPower > 0) && (
                              <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: ACCENT, border: `2px solid ${SURFACE}`, boxShadow: `0 0 6px ${ACCENT}` }} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 style={{ fontSize: '1.95rem', fontWeight: 700, color: TEXT, lineHeight: 1.1, marginBottom: 6, letterSpacing: '-0.03em' }}>
                        Find your <span style={{ color: ACCENT, whiteSpace: 'nowrap' }}>charging spot.</span>
                      </h1>

                      {/* Subtitle */}
                      <p style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.45, marginBottom: 18 }}>
                        Real-time charging network across India.
                      </p>

                      {/* Divider */}
                      <div style={{ height: 1, background: `linear-gradient(to right, transparent 0%, ${BORDER_STRONG} 30%, ${BORDER_STRONG} 70%, transparent 100%)`, marginBottom: 16 }} />

                      {/* Icon-led stats */}
                      {(() => {
                        const totalKw = STATIONS.reduce((a, s) => a + s.kw, 0);
                        const items = [
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                            val: STATIONS.length,
                            label: 'Stations',
                          },
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                            val: new Set(STATIONS.map(s => s.state)).size,
                            label: 'States',
                          },
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line><line x1="6" y1="11" x2="6" y2="13"></line><line x1="10" y1="11" x2="10" y2="13"></line></svg>,
                            val: (totalKw / 1000).toFixed(1),
                            unit: 'MW',
                            label: 'Capacity',
                          },
                        ];
                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {items.map((stat, i) => (
                              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: i === 0 ? 0 : 12 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: ACCENT, marginBottom: 6 }}>
                                  {stat.icon}
                                  <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{stat.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.val}</span>
                                  {stat.unit && <span style={{ fontSize: '0.65rem', color: ACCENT, fontWeight: 600 }}>{stat.unit}</span>}
                                </div>
                                {i < 2 && <div style={{ position: 'absolute', right: 0, top: 4, bottom: 4, width: 1, background: BORDER }} />}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>

                  {/* Collapsible search bar — only visible when icon tapped */}
                  <AnimatePresence initial={false}>
                    {searchOpen && (
                      <motion.div
                        key="search-collapsible"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <input
                            type="search"
                            autoFocus
                            placeholder="City, state, or station ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '14px 44px 14px 42px',
                              background: SURFACE,
                              border: `1px solid ${ACCENT}55`,
                              borderRadius: 14,
                              color: TEXT,
                              fontSize: '0.95rem',
                              outline: 'none',
                              fontFamily: 'inherit',
                              boxShadow: `0 0 0 3px ${ACCENT}11`,
                            }}
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              aria-label="Clear search"
                              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: TEXT_DIM, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Combined Filters — collapsible */}
                  <AnimatePresence initial={false}>
                    {filtersOpen && (
                      <motion.div
                        key="filters-panel"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ background: SURFACE, border: `1px solid ${BORDER_STRONG}`, borderRadius: 16, padding: '16px 14px' }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ACCENT }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Filters</span>
                            </div>
                            {(connFilter !== 'Any' || minPower > 0) && (
                              <button
                                type="button"
                                onClick={() => { setConnFilter('Any'); setMinPower(0); }}
                                style={{ background: 'none', border: 'none', color: TEXT_DIM, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0, letterSpacing: '0.04em' }}
                              >
                                Clear all
                              </button>
                            )}
                          </div>

                          {/* Connector */}
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ color: TEXT_DIM, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Connector</div>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
                              {['Any', 'CCS', 'CHAdeMO', 'Type 2'].map((c) => {
                                const count = c === 'Any' ? STATIONS.length : STATIONS.filter(s => s.conn === c).length;
                                const active = connFilter === c;
                                return (
                                  <button
                                    key={c}
                                    onClick={() => setConnFilter(c)}
                                    style={{
                                      padding: '7px 13px',
                                      background: active ? `${ACCENT}22` : 'transparent',
                                      border: `1px solid ${active ? ACCENT : BORDER_STRONG}`,
                                      color: active ? ACCENT : TEXT,
                                      borderRadius: 999,
                                      fontSize: '0.76rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      fontFamily: 'inherit',
                                    }}
                                  >
                                    {c}
                                    <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 500 }}>{count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Hairline divider */}
                          <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

                          {/* Min power */}
                          <div>
                            <div style={{ color: TEXT_DIM, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Min power</div>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
                              {[0, 50, 100, 150].map(p => {
                                const active = minPower === p;
                                return (
                                  <button
                                    key={p}
                                    onClick={() => setMinPower(p)}
                                    style={{
                                      padding: '7px 13px',
                                      background: active ? `${ACCENT}22` : 'transparent',
                                      border: `1px solid ${active ? ACCENT : BORDER_STRONG}`,
                                      color: active ? ACCENT : TEXT,
                                      borderRadius: 999,
                                      fontSize: '0.76rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      fontFamily: 'inherit',
                                    }}
                                  >
                                    {p === 0 ? 'Any' : `${p}+ kW`}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ color: TEXT_DIM, fontSize: '0.78rem', fontWeight: 500 }}>
                      <span style={{ color: TEXT, fontWeight: 700 }}>{filteredStations.length}</span> result{filteredStations.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ color: ACCENT_SOFT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                      By power
                    </div>
                  </div>

                  {/* Tap hint */}
                  <div style={{ fontSize: '0.65rem', color: TEXT_DIM, marginBottom: 8, fontStyle: 'italic' }}>Tap a station for details & directions</div>

                  {/* Station cards */}
                  {filteredStations.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', border: `1px dashed ${BORDER_STRONG}`, borderRadius: 16, background: SURFACE, marginTop: 8 }}>
                      <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>⚡</div>
                      <div style={{ color: TEXT, fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>No stations match</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginBottom: 18, lineHeight: 1.5 }}>Try clearing filters or expanding your search.</div>
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setConnFilter('Any'); setMinPower(0); }}
                        style={{ background: 'transparent', border: `1px solid ${ACCENT}`, color: ACCENT, padding: '9px 18px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(() => {
                        const sorted = [...filteredStations].sort((a, b) => b.kw - a.kw);
                        const visible = stationListExpanded ? sorted : sorted.slice(0, 5);
                        const hiddenCount = sorted.length - visible.length;
                        return (
                          <>
                            {visible.map((s, idx) => {
                              const isSelected = selectedStationId === s.id;
                              const isFast = s.kw >= 100;
                              const connColor = s.conn === 'CCS' ? ACCENT : s.conn === 'CHAdeMO' ? '#FFB020' : '#5EC8FF';
                              return (
                                <motion.div
                                  key={s.id}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4) }}
                                  whileTap={{ scale: 0.985 }}
                                  onClick={() => { setSelectedStationId(s.id); setStationSheetOpen(true); }}
                                  style={{
                                    background: isSelected ? `${ACCENT}10` : CARD,
                                    border: `1px solid ${isSelected ? ACCENT : BORDER}`,
                                    borderRadius: 16,
                                    padding: '14px 16px 14px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                    cursor: 'pointer',
                                    transition: 'background 200ms, border-color 200ms',
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scaleY: 0 }}
                                      animate={{ scaleY: 1 }}
                                      transition={{ duration: 0.25 }}
                                      style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, background: ACCENT, borderRadius: 999, transformOrigin: 'center' }}
                                    />
                                  )}

                                  {/* Connector icon */}
                                  <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: `${connColor}18`,
                                    border: `1px solid ${connColor}33`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: connColor,
                                  }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                                  </div>

                                  {/* Info */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                      <div style={{ color: TEXT, fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{s.name}</div>
                                      {isFast && (
                                        <span style={{ fontSize: '0.55rem', fontWeight: 700, color: ACCENT, background: `${ACCENT}1c`, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.12em', flexShrink: 0 }}>FAST</span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: TEXT_DIM, marginBottom: 6 }}>
                                      <span>{s.id}</span>
                                      <span style={{ opacity: 0.5 }}>·</span>
                                      <span>{s.state}</span>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 7px', background: `${connColor}10`, border: `1px solid ${connColor}25`, borderRadius: 6 }}>
                                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: connColor }} />
                                      <span style={{ color: connColor, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.04em' }}>{s.conn}</span>
                                    </div>
                                  </div>

                                  {/* Power */}
                                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div>
                                      <div style={{ color: isSelected ? ACCENT : TEXT, fontWeight: 700, fontSize: '1.3rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.kw}</div>
                                      <div style={{ color: TEXT_DIM, fontSize: '0.58rem', marginTop: 4, letterSpacing: '0.18em', fontWeight: 600 }}>KW</div>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isSelected ? ACCENT : TEXT_DIM} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
                                  </div>
                                </motion.div>
                              );
                            })}
                            {hiddenCount > 0 && (
                              <motion.button
                                key="show-more"
                                type="button"
                                onClick={() => setStationListExpanded(true)}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  marginTop: 6,
                                  padding: '14px 20px',
                                  background: 'transparent',
                                  border: `1px dashed ${ACCENT}66`,
                                  color: ACCENT,
                                  borderRadius: 14,
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  fontFamily: 'inherit',
                                  letterSpacing: '0.01em',
                                }}
                              >
                                Show {hiddenCount} more {hiddenCount === 1 ? 'station' : 'stations'}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                              </motion.button>
                            )}
                            {stationListExpanded && sorted.length > 5 && (
                              <motion.button
                                key="show-less"
                                type="button"
                                onClick={() => { setStationListExpanded(false); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  marginTop: 6,
                                  padding: '12px 20px',
                                  background: 'transparent',
                                  border: `1px solid ${BORDER_STRONG}`,
                                  color: TEXT_DIM,
                                  borderRadius: 14,
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6,
                                  fontFamily: 'inherit',
                                }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                Show less
                              </motion.button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <iframe
                ref={findStationsIframeRef}
                className="find-stations-iframe"
                src={`/find-stations.html?apiUrl=${iframeApiBase}&v=dir5`}
                scrolling="yes"
                style={{
                  width: '100%',
                  height: '760px',
                  border: 'none',
                  filter: themeMode === 'light' ? 'invert(0.92) hue-rotate(180deg)' : undefined,
                }}
                title="Find Charging Stations"
              />
            )}
          </motion.section>
        )}

        {/* FOOTER — EXACT REPLICA OF REFERENCE IMAGE */}

        {page === 'privacy-policy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: HEADING }}>Privacy Policy</h1>
                <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>At Trio, your privacy is important to us. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Information We Collect</h2>
                  <p style={{ marginBottom: 24 }}>We may collect personal identification information such as name, email address, phone number, etc., when users visit our site, register, or interact with our services.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. How We Use Your Information</h2>
                  <p style={{ marginBottom: 24 }}>We use the information we collect in various ways, including to:</p>
                  <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                    {['Improve our website and services', 'Send periodic emails and updates', 'Respond to customer service requests', 'Personalize user experience'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
                  </ul>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Data Protection</h2>
                  <p style={{ marginBottom: 24 }}>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>4. Sharing Your Information</h2>
                  <p style={{ marginBottom: 24 }}>We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information.</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {page === 'terms-conditions' && (
          <motion.div
            key="terms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: HEADING }}>Terms & Conditions</h1>
                <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>Welcome to Trio. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Acceptance of Terms</h2>
                  <p style={{ marginBottom: 24 }}>By accessing this website we assume you accept these terms and conditions. Do not continue to use Trio if you do not agree to all the terms stated on this page.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. Intellectual Property Rights</h2>
                  <p style={{ marginBottom: 24 }}>Other than the content you own, under these Terms, Trio and/or its licensors own all the intellectual property rights and materials contained in this website.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Restrictions</h2>
                  <p style={{ marginBottom: 24 }}>You are specifically restricted from all of the following:</p>
                  <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                    {['Publishing any website material in any other media', 'Selling, sublicensing and/or commercializing any website material', 'Publicly performing and/or showing any website material', 'Using this website in any way that is or may be damaging to this website'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {page === 'refund-policy' && (
          <motion.div
            key="refund"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: HEADING }}>Refund Policy</h1>
                <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>At Trio, we strive to ensure satisfaction with our services. If you're not entirely satisfied, we're here to help with a fair refund policy.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Eligibility for Refunds</h2>
                  <p style={{ marginBottom: 24 }}>To be eligible for a refund, your request must be made within 7 days of service purchase and should include a valid reason for the request.</p>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. Non-refundable Cases</h2>
                  <p style={{ marginBottom: 24 }}>The following cases are generally ineligible for a refund:</p>
                  <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                    {['Service already delivered and accepted by user', 'Customized or personalized fleet solutions', 'Issues arising from misuse or third-party integrations'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
                  </ul>
                  <h2 style={{ color: HEADING, fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Refund Process</h2>
                  <p style={{ marginBottom: 24 }}>Once your request is approved, refunds will be processed to the original method of payment within 5–7 business days.</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {page === 'about-us' && (() => {
          const chapterTitleStyle: CSSProperties = {
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '1.35rem' : 'clamp(1.5rem, 2.4vw, 2rem)',
            fontWeight: 700,
            color: HEADING,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
            marginBottom: 18,
          };
          const bodyStyle: CSSProperties = {
            fontFamily: "'Outfit', sans-serif",
            color: TEXT_DIM,
            fontSize: isMobile ? '0.88rem' : '0.96rem',
            lineHeight: 1.75,
            fontWeight: 300,
            marginBottom: 18,
          };
          const strongStyle: CSSProperties = { color: HEADING, fontWeight: 600 };
          const accentStrongStyle: CSSProperties = { color: ACCENT, fontWeight: 600 };
          const emStyle: CSSProperties = { color: ACCENT, fontStyle: 'italic' };
          const pullQuoteStyle: CSSProperties = {
            margin: isMobile ? '24px 0' : '32px 0',
            padding: isMobile ? '16px 18px 16px 20px' : '20px 24px 20px 28px',
            background: 'rgba(0,255,136,0.04)',
            borderLeft: `3px solid ${ACCENT}`,
            borderRadius: '4px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontStyle: 'italic',
            lineHeight: 1.55,
            color: HEADING,
            fontWeight: 500,
          };
          const ChapterTag = ({ num }: { num: string }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.22em' }}>CHAPTER {num}</span>
              <div style={{ flex: 1, height: 1, background: BORDER_STRONG }} />
            </div>
          );

          return (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <section style={{ background: BG, color: TEXT, paddingTop: isMobile ? '92px' : '110px', paddingBottom: isMobile ? '56px' : '80px', position: 'relative', overflow: 'hidden' }}>
                {/* Ambient backdrops */}
                <div style={{ position: 'absolute', top: '0%', right: '-25%', width: isMobile ? 420 : 720, height: isMobile ? 420 : 720, background: `radial-gradient(circle, ${ACCENT_SOFT}1a, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '-20%', width: isMobile ? 360 : 600, height: isMobile ? 360 : 600, background: `radial-gradient(circle, ${ACCENT_SOFT}14, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                <div style={{ maxWidth: 920, margin: '0 auto', padding: isMobile ? '0 20px' : '0 var(--side-padding, 88px)', position: 'relative', zIndex: 1 }}>

                  {/* HERO */}
                  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: isMobile ? 56 : 110, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 22 }}>
                      <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                      <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.2em' }}>THE FOUNDERS' STORY</span>
                    </div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 3.6vw, 2.8rem)', fontWeight: 700, color: HEADING, lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: 18 }}>
                      From a village with <span style={emStyle}>nothing</span> to Kolkata's EV Revolution.
                    </h1>
                    <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.92rem' : '1rem', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
                      Two men. No money. No cars. No plan. Just a belief so stubborn it outlasted 200 rejections, three crashes to zero, and a ₹100 Crore offer they walked away from.
                    </p>
                    <div style={{ width: 64, height: 2, background: ACCENT, margin: '32px auto 0', opacity: 0.7 }} />
                  </motion.div>

                  {/* OPENER — drop cap */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: isMobile ? 64 : 100 }}>
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '3.2rem' : '5rem', fontWeight: 800, color: ACCENT, opacity: 0.22, float: 'left', lineHeight: 0.85, marginRight: 14, marginTop: 4 }}>T</span>
                      <p style={{ ...bodyStyle, color: TEXT, marginBottom: 22 }}>
                        here is a kind of hunger that doesn't come from ambition — it comes from necessity. From growing up in a village in Bihar where money was a stranger, where the school bus was a luxury you couldn't afford, where the question wasn't <em>which career to choose</em> — it was <strong style={strongStyle}>how to survive long enough to have one.</strong>
                      </p>
                    </div>
                    <p style={bodyStyle}>
                      This is the story of <strong style={strongStyle}>Subhash Kumar</strong> and <strong style={strongStyle}>Somnath Das</strong> — two men who came from nothing, failed spectacularly, hit zero more than once, and still built something Kolkata had never seen before.
                    </p>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      It's not a story about talent. It's a story about what happens when <strong style={strongStyle}>a person with nothing to lose refuses to stop.</strong>
                    </p>
                  </motion.div>

                  {/* CHAPTER 01 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="01" />
                    <h2 style={chapterTitleStyle}>A village boy who had no business <em style={emStyle}>starting a business.</em></h2>
                    <p style={bodyStyle}>
                      Subhash Kumar was born in a small village in the interior belt of Madhubani district, Bihar. His family farmed the land. Money was not a concept that lived in their house — it was always just outside the door.
                    </p>
                    <p style={bodyStyle}>
                      He moved through schools one small step at a time — a government school, then a boarding school in a tier-three city, then, when his father's work brought the family to Kolkata, everything changed. <strong style={strongStyle}>He was in class six. He had never seen a city like this.</strong> Most kids from small towns feel lost in a metropolis. Subhash felt the opposite. He felt possibility — raw, overflowing, everywhere he looked.
                    </p>
                    <blockquote style={pullQuoteStyle}>
                      "Coming here, I started seeing that there is a huge scope and so much can be done. I had a great curiosity to see things. From class six, I used to go wandering around the city."
                    </blockquote>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      While his wealthy classmates took the air-conditioned school bus, <strong style={strongStyle}>Subhash saved his daily bus fare and rode public transport</strong> — quietly calculating, quietly watching, quietly planning. By class eight, he had a word in his head that wouldn't leave: <strong style={accentStrongStyle}>business.</strong>
                    </p>
                  </motion.div>

                  {/* CHAPTER 02 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="02" />
                    <h2 style={chapterTitleStyle}>He started with ₹1,000 and a <em style={emStyle}>school bag.</em></h2>
                    <p style={bodyStyle}>
                      It was 2011. He was 13 years old, in class eight. Chinese MP3 players — clones of Sony and Apple originals — were flooding Chandni market. Rich classmates wanted them. No one was selling them inside school.
                    </p>
                    <p style={{ ...bodyStyle, marginBottom: 28 }}>
                      Subhash saved every rupee of his daily bus allowance. With ₹1,000 he went to Chandni market, bought players at ₹100 each, carried them back in his bag, and sold them in school for ₹600 to ₹700 — complete with a handwritten bill and a self-issued 6-month warranty.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: BORDER_STRONG, border: `1px solid ${BORDER_STRONG}`, borderRadius: 12, overflow: 'hidden', margin: '8px 0 32px' }}>
                      {[
                        { num: '₹1K', lbl: 'Starting capital, age 13' },
                        { num: '₹500', lbl: 'Profit per sale' },
                        { num: '₹25K', lbl: 'Saved by class 10' },
                      ].map((s, i) => (
                        <div key={i} style={{ background: SURFACE, padding: '20px 14px', textAlign: 'center' }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.6rem' : '1.85rem', fontWeight: 800, color: ACCENT, lineHeight: 1, marginBottom: 6, letterSpacing: '-0.02em' }}>{s.num}</div>
                          <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>
                    <p style={bodyStyle}>
                      When CBSE introduced PSA books unavailable in stores, he walked to College Street, bought in bulk at 25% off, and sold to classmates at full price plus a "sourcing fee." He started downloading class 10 sample papers all night, printing them at home with refilled cartridges, and selling them every morning.
                    </p>
                    <p style={{ ...bodyStyle, color: TEXT, fontWeight: 400, marginBottom: 0 }}>
                      <strong style={strongStyle}>He wasn't just selling things. He was learning the grammar of business —</strong> finding the gap, moving faster than anyone else, and making something from nothing.
                    </p>
                  </motion.div>

                  {/* CHAPTER 03 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="03" />
                    <h2 style={chapterTitleStyle}>IIM Bangalore at 20. No degree. No money. <em style={emStyle}>Just an idea.</em></h2>
                    <p style={bodyStyle}>
                      Subhash earned a Computer Science seat at SRM University, Chennai. Within a year, the entrepreneur in him couldn't sit still. He noticed students from villages and small towns across India were being told they had two choices — engineering or medicine. Every other path was invisible to them. He had lived that confusion himself. <strong style={strongStyle}>So he decided to solve it.</strong>
                    </p>
                    <p style={bodyStyle}>
                      He co-founded <strong style={strongStyle}>Updeshak.com</strong> — a career counseling platform for first-generation students. Four young men. One domain. One dream. No funding. They submitted to NSRCEL, IIM Bangalore's incubation cell. 500 ideas entered. Updeshak made the <strong style={accentStrongStyle}>top 25.</strong>
                    </p>
                    <blockquote style={pullQuoteStyle}>
                      "He cut the time of two other ideas and gave us 45 minutes instead of 15. He said the idea was too good — but he warned us: people don't want their kids to know about too many career options."
                    </blockquote>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      They deployed across Tamil Nadu. They got subscription contracts. They were building something real. Then, by final year, his co-founders caved to family pressure and sat for placements. Subhash was the last one standing — and eventually, he fell too.
                    </p>
                  </motion.div>

                  {/* CHAPTER 04 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="04" />
                    <h2 style={chapterTitleStyle}>Two hundred companies <em style={emStyle}>said no.</em> Then two said yes.</h2>
                    <p style={{ ...bodyStyle, marginBottom: 28 }}>
                      He sat for interviews knowing he didn't want a job. His heart wasn't in it. Company after company — <strong style={strongStyle}>two hundred of them</strong> — looked at him and passed.
                    </p>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', gap: 0, background: 'rgba(255,176,32,0.06)', border: `1px solid rgba(255,176,32,0.25)`, borderRadius: 14, overflow: 'hidden', margin: '8px 0 32px' }}>
                      <div style={{ background: 'rgba(255,176,32,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '18px 20px' : '20px 28px', minWidth: isMobile ? 'auto' : 120 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '2.2rem' : '2.6rem', fontWeight: 800, color: '#FFB020', lineHeight: 1, letterSpacing: '-0.02em' }}>200</div>
                      </div>
                      <div style={{ flex: 1, padding: isMobile ? '16px 18px' : '18px 22px' }}>
                        <div className="mono" style={{ fontSize: '0.58rem', color: '#FFB020', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Rejections</div>
                        <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT, fontSize: isMobile ? '0.82rem' : '0.88rem', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                          He sat for campus and off-campus interviews not truly wanting a job. 200 companies said no. Then, through an off-campus exam, Atos Syntel said yes — ₹4.25L package. The same week, Vodafone's campus offer came through. He accepted both simultaneously.
                        </p>
                      </div>
                    </div>
                    <p style={bodyStyle}>
                      He joined Vodafone. Rose from Graduate Engineer Trainee to Senior Executive. Learned how corporate India operates. But under it all — always — <strong style={strongStyle}>the fire to build something of his own.</strong>
                    </p>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      Three years of parallel network marketing followed — not by choice, but by circumstance. A relative had invested ₹1 lakh on his behalf without telling him what it was. The money couldn't be refunded. So he leaned in: built a team of 20, made ₹4–5 lakh monthly in sales, learned to sell products worth lakhs to strangers in 5-star hotel lobbies. And in that circle, he met the man who would change everything.
                    </p>
                  </motion.div>

                  {/* CHAPTER 05 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="05" />
                    <h2 style={chapterTitleStyle}>The second man. The one who would <em style={emStyle}>drive the first cab.</em></h2>
                    <p style={bodyStyle}>
                      Somnath Das came from a different world of struggle. He had lost his father. He was supporting his ageing mother. He had left a steady job to chase something more — and had wound up, like Subhash, deep in network marketing, wondering what was next.
                    </p>
                    <p style={bodyStyle}>
                      The two men found each other in 2022. They worked side by side. They argued, planned, built a team together. And when they both grew disillusioned with referral business, <strong style={strongStyle}>they made a quiet decision: leave everything and build something real.</strong>
                    </p>
                    <blockquote style={pullQuoteStyle}>
                      "His grandfather had once told him — do something in transport, and you will do well. We were crossing a 5-kilometre flyover. We had no money. We had no plan. We looked at each other and decided."
                    </blockquote>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      A week later, Subhash landed in Pune for work, hailed an Uber, and learned about Everest Fleet — a company that leases cabs for a ₹10,000 deposit. He called Somnath that night. They said two words: <strong style={accentStrongStyle}>let's go.</strong> Somnath drove the cab himself. Not because they couldn't afford a driver — but because they needed to understand every single centimetre of the business before they built it.
                    </p>
                  </motion.div>

                  {/* CHAPTER 06 — TIMELINE */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="06" />
                    <h2 style={chapterTitleStyle}>They hit zero. And zero again. <em style={emStyle}>And zero again.</em></h2>
                    <p style={{ ...bodyStyle, marginBottom: 28 }}>
                      They came back to Kolkata on 2nd October 2023 — Gandhi Jayanti — and started Try Evolution India Private Limited. What followed were lessons no one teaches in business school — because the only classroom is failure itself.
                    </p>
                    <div style={{ margin: '12px 0 32px' }}>
                      {[
                        { yr: "Oct '23", title: 'CNG fleet — launched with 5 leased cabs', body: 'Initial loss of ₹1.5 lakh absorbed. Reached profitability. Then CNG queues of 8–9 hours destroyed the model entirely. Back to zero.' },
                        { yr: "Early '24", title: 'Global Fleet EV deal — ₹5 lakh committed', body: "Partnership collapsed when drivers couldn't be found in the 2-week deadline. Money lost. Yash, the third co-founder, pulled out. Back to zero." },
                        { yr: "Mid '24", title: '₹100 Crore investor offer — walked away', body: 'Full funding offered. The terms: 5% equity each, no directorship, ₹1L salary. They rejected it without hesitation. They had not come this far to become employees of their own company.' },
                        { yr: "Dec '24", title: 'Subhash quit Vodafone — on a promise never kept', body: 'A second investor gave verbal commitment. Subhash resigned. Four months passed with no money, no cars, no progress. He walked away from Patna in February 2025 and came home to Kolkata.' },
                      ].map((it, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '64px 1fr' : '90px 1fr', gap: isMobile ? '0 12px' : '0 18px' }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '0.78rem' : '0.88rem', fontWeight: 700, color: ACCENT, textAlign: 'right', paddingTop: 3 }}>{it.yr}</div>
                          <div style={{ borderLeft: `1px solid ${BORDER_STRONG}`, paddingLeft: isMobile ? 16 : 20, paddingBottom: 22, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: -4, top: 6, width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '0.85rem' : '0.92rem', fontWeight: 600, color: HEADING, marginBottom: 4 }}>{it.title}</h4>
                            <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.76rem' : '0.82rem', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{it.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <blockquote style={pullQuoteStyle}>
                      "In March 2025, we were negative ₹15 lakhs. We had no cars, no drivers, no business — just a registered company and the stubbornness to keep going. We started anyway."
                    </blockquote>
                    <p style={{ ...bodyStyle, marginBottom: 0 }}>
                      <strong style={strongStyle}>This is where most stories end.</strong> They are not reasonable people. They are the kind of people who were born with nothing and have spent their entire lives proving that nothing is just a starting point.
                    </p>
                  </motion.div>

                  {/* CHAPTER 07 */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ marginBottom: isMobile ? 64 : 96 }}>
                    <ChapterTag num="07" />
                    <h2 style={chapterTitleStyle}>They borrowed. They built. <em style={emStyle}>They became the first.</em></h2>
                    <p style={bodyStyle}>
                      In April 2025, Subhash took a ₹6 lakh personal loan. They leased 20–25 EVs. Operations finally began — for real, this time. No partner backing out. No investor disappearing. Just two men and a fleet.
                    </p>
                    <p style={bodyStyle}>
                      Their CA and CS partners — who had watched every crash and every comeback — came forward and invested ₹10–15 lakhs of their own money. A project report was written. A bank loan was secured. A new entity was born: <strong style={accentStrongStyle}>Try EV Charging LLP.</strong> A friend named Mohit from Siemens — who knew the full story, every rupee of debt, every failure — connected them to people who mattered. They have since done over ₹1 Crore of business through his introductions alone.
                    </p>
                    <p style={{ ...bodyStyle, color: TEXT, fontWeight: 400 }}>
                      By the first week of November 2025, their own EV charging station went live in New Town, Kolkata. <strong style={strongStyle}>They became the first fleet operator in the market to own their own EV charging infrastructure.</strong>
                    </p>
                    <blockquote style={{ ...pullQuoteStyle, marginBottom: 0 }}>
                      "We became the first fleet owner to have an in-house charging station along with our own fleet. The dream we saw years ago — it was finally real."
                    </blockquote>
                  </motion.div>

                  {/* FOUNDERS */}
                  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginTop: isMobile ? 64 : 100, marginBottom: isMobile ? 64 : 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                      <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.22em' }}>THE FOUNDERS</span>
                      <div style={{ flex: 1, height: 1, background: BORDER_STRONG }} />
                    </div>
                    <h2 style={chapterTitleStyle}>
                      The two men behind <em style={emStyle}>every electric mile.</em>
                    </h2>
                    <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.88rem' : '0.96rem', lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>
                      Trio EV is not a company built by people with inherited advantages. It was built by two men who had none — and chose to build anyway.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 18 }}>
                      {[
                        { initials: 'SK', photo: 'https://www.trio-ev.com/assets/subhasht2-BbwMLUwq.jpg', name: 'Subhash Kumar', role: 'Co-Founder & Director — Strategy & Growth', desc: 'Born in a village in Madhubani, Bihar. Sold MP3 players from his school bag at 13. Reached the top 25 at IIM Bangalore without a rupee of external funding. Rejected 200 companies before landing his first job — then rejected a ₹100 Crore investment offer to keep control of his own dream. Handles strategy, funding, investor relations, and the big-picture vision of Trio EV.' },
                        { initials: 'SD', photo: 'https://www.trio-ev.com/assets/somnath-DQNgJxFg.jpg' as string | null, name: 'Somnath Das', role: 'Co-Founder & Director — Operations', desc: 'Born into his own struggle — supporting his mother alone after losing his father. Left a corporate career and network marketing to build something from the ground up. Drove the very first Trio EV cab himself — not out of necessity, but to understand every detail of the business he was building. Every driver, every route, every charging schedule runs through his hands.' },
                      ].map((f, i) => (
                        <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER_STRONG}`, borderRadius: 14, overflow: 'hidden' }}>
                          <div style={{ height: isMobile ? 200 : 240, background: `linear-gradient(135deg, ${BG}, ${SURFACE})`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                            {f.photo ? (
                              <>
                                <img
                                  src={f.photo}
                                  alt={f.name}
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, ${SURFACE}cc 100%)`, pointerEvents: 'none' }} />
                              </>
                            ) : (
                              <>
                                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ACCENT}05 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}05 1px, transparent 1px)`, backgroundSize: '20px 20px', opacity: 0.6 }} />
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}24, ${ACCENT}08)`, border: `1px solid ${ACCENT}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 800, color: ACCENT, position: 'relative', zIndex: 1, boxShadow: `0 0 24px ${ACCENT}33` }}>
                                  {f.initials}
                                </div>
                              </>
                            )}
                          </div>
                          <div style={{ padding: isMobile ? '16px 18px 18px' : '20px 22px 22px' }}>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 700, color: HEADING, marginBottom: 3, letterSpacing: '-0.01em' }}>{f.name}</h3>
                            <div className="mono" style={{ fontSize: '0.55rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>{f.role}</div>
                            <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.8rem' : '0.84rem', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* FINALE */}
                  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ background: `linear-gradient(180deg, ${SURFACE}, ${BG})`, border: `1px solid ${BORDER_STRONG}`, borderRadius: 20, padding: isMobile ? '40px 24px' : '64px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 0%, ${ACCENT_SOFT}1a, transparent 60%)`, pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 22 }}>
                        <span style={{ width: 6, height: 6, background: ACCENT, borderRadius: '50%', boxShadow: `0 0 8px ${ACCENT}` }} />
                        <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.2em' }}>AS OF MAY 2026</span>
                      </div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.4rem' : 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 700, color: HEADING, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 18 }}>
                        From ₹1,000 saved on a bus to <em style={emStyle}>Kolkata's EV future.</em>
                      </h2>
                      <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.88rem' : '0.96rem', lineHeight: 1.75, fontWeight: 300, maxWidth: 580, margin: '0 auto 14px' }}>
                        From Madhubani to Kolkata. From a farming family to a founding team. From carrying MP3 players in a school bag to running 100+ electric vehicles on the city's roads. From a flyover conversation with ₹15 lakhs in debt to Kolkata's first fleet-owned EV charging station.
                      </p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: isMobile ? '0.85rem' : '0.92rem', lineHeight: 1.75, fontWeight: 300, maxWidth: 580, margin: '0 auto', fontStyle: 'italic' }}>
                        The story of Trio EV is not about resources. It is about what happens when two men with nothing to lose decide that the answer is always one more try.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 1, background: BORDER_STRONG, border: `1px solid ${BORDER_STRONG}`, borderRadius: 12, overflow: 'hidden', marginTop: isMobile ? 28 : 44 }}>
                        {[
                          { num: '100+', lbl: 'EVs running today' },
                          { num: '₹3 CR', lbl: 'Year 1 revenue' },
                          { num: '₹60L', lbl: 'Charging revenue (6 months)' },
                          { num: '#1', lbl: 'Fleet-owned charging station, Kolkata' },
                        ].map((s, i) => (
                          <div key={i} style={{ background: BG, padding: isMobile ? '18px 12px' : '22px 14px', textAlign: 'center' }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: ACCENT, lineHeight: 1, marginBottom: 6 }}>{s.num}</div>
                            <div className="mono" style={{ fontSize: '0.54rem', color: TEXT_DIM, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>{s.lbl}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                </div>
              </section>
            </motion.div>
          );
        })()}

        {page === 'blog' && (
          <motion.div
            key="blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BlogPage />
          </motion.div>
        )}

        {page === 'premium-charging-hub' && (
          <PremiumChargingHubPage
            isMobile={isMobile}
            onPrimaryCta={() => navigate('find-stations')}
            onSecondaryCta={() => navigate('contact-us')}
          />
        )}

        {page === 'ev-infra-consultancy' && (
          <EVInfraConsultancyPage
            isMobile={isMobile}
            onPrimaryCta={() => navigate('contact-us')}
            onSecondaryCta={() => navigate('contact-us')}
          />
        )}

        {page === 'charger-supply' && (
          <ChargerSupplyPage
            isMobile={isMobile}
            onPrimaryCta={() => navigate('contact-us')}
            onSecondaryCta={() => navigate('contact-us')}
          />
        )}

        {page === 'cpms' && (
          <CPMSPage
            isMobile={isMobile}
            onPrimaryCta={() => navigate('contact-us')}
            onSecondaryCta={() => navigate('contact-us')}
          />
        )}

        {page === 'om-services' && (
          <OMServicesPage
            isMobile={isMobile}
            onPrimaryCta={() => navigate('contact-us')}
            onSecondaryCta={() => navigate('contact-us')}
          />
        )}
      </AnimatePresence>

      <footer style={{ padding: '56px var(--side-padding) 28px', background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {isMobile ? (
            <div>
              {/* Brand */}
              <div style={{ marginBottom: 28 }}>
                <img src={logo} alt="TRIO" style={{ height: 96, display: 'block', marginTop: -16, marginBottom: -14 }} />
                <div style={{ color: ACCENT, fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>Drive Smart. Go Green.</div>
                <p style={{ color: TEXT_DIM, fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 18 }}>
                  TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {siteSettings.socials.map((s, i) => (
                    <a
                      key={`${s.platform}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label ?? s.platform}
                      style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_STRONG}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={ACCENT}><path d={SOCIAL_ICONS[s.platform] ?? SOCIAL_ICONS.other}></path></svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <button
                className="btn-accent"
                style={{ width: '100%', padding: '15px 24px', fontSize: '0.85rem', fontWeight: 800, borderRadius: 12, background: '#5AF59F', color: ACCENT_ON, boxShadow: '0 4px 14px rgba(90, 245, 159, 0.3)', letterSpacing: '0.05em', marginBottom: 32, justifyContent: 'center' }}
                onClick={() => setShowContactForm(true)}
              >
                CONTACT US →
              </button>

              {/* Links — two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, paddingTop: 28, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.18em' }}>EXPLORE</div>
                  {[
                    { label: 'Find stations', target: 'find-stations' },
                    { label: 'About us', target: 'about-us' },
                    { label: 'Blog', target: 'blog' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 12, fontSize: '0.92rem', fontWeight: 500 }}>{l.label}</a>
                  ))}
                </div>
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.18em' }}>LEGAL</div>
                  {[
                    { label: 'Privacy Policy', target: 'privacy-policy' },
                    { label: 'Terms & Conditions', target: 'terms-conditions' },
                    { label: 'Refund Policy', target: 'refund-policy' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 12, fontSize: '0.92rem', fontWeight: 500 }}>{l.label}</a>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div style={{ paddingTop: 28, borderTop: `1px solid rgba(255,255,255,0.05)`, marginBottom: 32 }}>
                <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.18em' }}>GET IN TOUCH</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: TEXT, fontSize: '0.78rem', fontWeight: 600, marginBottom: 3 }}>Office</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.8rem', lineHeight: 1.5 }}>{siteSettings.officeAddress}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 7v10M15 7v10M3 12h18"></path></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: TEXT, fontSize: '0.78rem', fontWeight: 600, marginBottom: 3 }}>Registered</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.8rem', lineHeight: 1.5 }}>{siteSettings.registeredAddress}</div>
                    </div>
                  </div>

                  <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div style={{ color: TEXT, fontSize: '0.92rem', fontWeight: 500 }}>{siteSettings.phone}</div>
                  </a>

                  <a href={`mailto:${siteSettings.email}`} style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div style={{ color: TEXT, fontSize: '0.92rem', fontWeight: 500 }}>{siteSettings.email}</div>
                  </a>
                </div>
              </div>

              {/* Bottom — stacked, centered */}
              <div style={{ paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center', color: TEXT_DIM, fontSize: '0.72rem' }}>
                <div>© 2026 Trio Inc. All rights reserved.</div>
                <div style={{ fontStyle: 'italic', marginTop: 6, color: ACCENT_SOFT }}>Clean. Green. Smart.</div>
              </div>
            </div>
          ) : (
            <>
              <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr 1.2fr', gap: 32, marginBottom: 32, alignItems: 'start' }}>
                {/* Column 1: Brand */}
                <div>
                  <img className="footer-logo" src={logo} alt="TRIO" style={{ height: '110px', display: 'block', marginTop: -25, marginBottom: -11 }} />
                  <div style={{ color: ACCENT, fontSize: '1rem', fontWeight: 700, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Drive Smart. Go Green.</div>
                  <p style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.55, marginBottom: 14, maxWidth: 240 }}>
                    TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {siteSettings.socials.map((s, i) => (
                      <a
                        key={`${s.platform}-${i}`}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label ?? s.platform}
                        style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={TEXT_DIM}><path d={SOCIAL_ICONS[s.platform] ?? SOCIAL_ICONS.other}></path></svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Column 2: Categories */}
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>CATEGORIES</div>
                  {[
                    { label: 'Find stations', target: 'find-stations' },
                    { label: 'About us', target: 'about-us' },
                    { label: 'Blog', target: 'blog' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 10, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
                  ))}
                </div>

                {/* Column 3: Policies */}
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>POLICIES</div>
                  {[
                    { label: 'Privacy Policy', target: 'privacy-policy' },
                    { label: 'Terms & Conditions', target: 'terms-conditions' },
                    { label: 'Refund Policy', target: 'refund-policy' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 10, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
                  ))}
                </div>

                {/* Column 4: Registered Address */}
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>REGISTERED ADDRESS</div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                    <div style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {siteSettings.registeredAddress}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                    <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} style={{ color: TEXT_DIM, fontSize: '0.82rem', textDecoration: 'none' }}>{siteSettings.phone}</a>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                    <a href={`mailto:${siteSettings.email}`} style={{ color: TEXT_DIM, fontSize: '0.82rem', textDecoration: 'none' }}>{siteSettings.email}</a>
                  </div>
                </div>

                {/* Column 5: Office Address + Button */}
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>OFFICE ADDRESS</div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                    <div style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {siteSettings.officeAddress}
                    </div>
                  </div>
                  <button
                    className="btn-accent"
                    style={{ width: '100%', padding: '12px 20px', fontSize: '0.8rem', fontWeight: 800, borderRadius: 8, background: '#5AF59F', color: ACCENT_ON, boxShadow: '0 4px 14px rgba(90, 245, 159, 0.3)' }}
                    onClick={() => setShowContactForm(true)}
                  >
                    CONTACT US
                  </button>
                </div>
              </div>
              <div className="footer-bottom" style={{ color: TEXT_DIM, fontSize: '0.72rem', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <span>© 2026 Trio Inc. All rights reserved.</span>
                <span style={{ fontStyle: 'italic' }}>Clean. Green. Smart.</span>
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
