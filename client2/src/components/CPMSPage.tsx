import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../lib/theme';
import {
    ArrowRight,
    Activity,
    Zap,
    CreditCard,
    Users,
    Truck,
    Building2,
    Globe,
} from 'lucide-react';

// Dark-theme fallback colours for module-scope code; theme-aware components destructure useTheme() and shadow these.
const ACCENT = '#00FF88';
const ACCENT_SOFT = '#00CC77';
const BG = '#0B0F0D';
const SURFACE = '#111715';
const CARD = '#151B18';
const BORDER = 'rgba(0,255,136,0.08)';
const BORDER_STRONG = 'rgba(0,255,136,0.18)';
const TEXT = '#F5F7F6';
const TEXT_DIM = '#8C948F';

type Props = {
    isMobile: boolean;
    onPrimaryCta?: () => void;
    onSecondaryCta?: () => void;
};

export function CPMSPage({ isMobile, onPrimaryCta, onSecondaryCta }: Props) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.div
            key="cpms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                background: BG,
                color: TEXT,
                fontFamily: "'Inter', sans-serif",
                paddingTop: isMobile ? 80 : 100,
                paddingBottom: isMobile ? 24 : 36,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-12%',
                    right: '-15%',
                    width: isMobile ? 380 : 720,
                    height: isMobile ? 380 : 720,
                    background: `radial-gradient(circle, ${ACCENT_SOFT}1c, transparent 65%)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: isMobile ? '0 20px' : '0 var(--side-padding, 88px)',
                    maxWidth: 1400,
                    margin: '0 auto',
                }}
            >
                <Hero isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
                <BuiltInHouse isMobile={isMobile} />
                <DriverApp isMobile={isMobile} />
                <CapabilityConsole isMobile={isMobile} />
                <Compliance isMobile={isMobile} />
                <Personas isMobile={isMobile} />
            </div>
        </motion.div>
    );
}

/* =================================================================== */
/* HERO — copy + live network telemetry panel                          */
/* =================================================================== */

function Hero({
    isMobile,
    onPrimaryCta,
}: {
    isMobile: boolean;
    onPrimaryCta?: () => void;
    onSecondaryCta?: () => void;
}) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT_DIM, HEADING } = useTheme();
    return (
        <section style={{ marginBottom: isMobile ? 48 : 120 }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
                    gap: isMobile ? 32 : 60,
                    alignItems: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    <div
                        className="mono"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            color: ACCENT,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            letterSpacing: '0.22em',
                            marginBottom: 26,
                            padding: '5px 12px',
                            background: 'rgba(0,255,136,0.08)',
                            border: `1px solid ${BORDER_STRONG}`,
                            borderRadius: 99,
                        }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                        <span>BUILT IN-HOUSE · TRIO CPMS · v4.2</span>
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: isMobile ? '1.5rem' : 'clamp(1.7rem, 3vw, 2.4rem)',
                            fontWeight: 600,
                            color: HEADING,
                            margin: 0,
                            marginBottom: 18,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.12,
                            maxWidth: 560,
                        }}
                    >
                        We built the software that runs our fleet.{' '}
                        <span style={{ color: ACCENT }}>Now it runs yours.</span>
                    </h1>

                    <p
                        style={{
                            fontSize: isMobile ? '0.98rem' : '1.15rem',
                            color: TEXT_DIM,
                            lineHeight: 1.6,
                            maxWidth: 620,
                            margin: 0,
                            marginBottom: 24,
                        }}
                    >
                        Trio CPMS is the in-house cloud platform that powers our own 100+ EV fleet and our charging hub in New Town, Kolkata. Operator dashboard, driver app, and developer API — battle-tested on our own operations before it ever ran on yours.
                    </p>

                    {/* Platform availability strip */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginBottom: 32,
                        }}
                    >
                        {[
                            { label: 'Web Dashboard', icon: 'M3 4h18v14H3z M3 18l6-6 4 4 8-8' },
                            { label: 'iOS · Android', icon: 'M5 2h14v20H5z M9 18h6' },
                            { label: 'REST + Webhook API', icon: 'M8 9l-4 3 4 3 M16 9l4 3-4 3 M14 4l-4 16' },
                        ].map((p) => (
                            <div
                                key={p.label}
                                className="mono"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    padding: '6px 12px',
                                    border: `1px solid ${BORDER}`,
                                    borderRadius: 8,
                                    fontSize: '0.62rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.14em',
                                    color: TEXT_DIM,
                                    textTransform: 'uppercase',
                                    background: SURFACE,
                                }}
                            >
                                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d={p.icon} />
                                </svg>
                                <span>{p.label}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        <button
                            className="btn-accent"
                            onClick={onPrimaryCta}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                fontSize: '0.92rem',
                                width: isMobile ? '100%' : 'auto',
                            }}
                        >
                            Request a demo <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <LiveNetworkPanel isMobile={isMobile} />
                </motion.div>
            </div>
        </section>
    );
}

/* =================================================================== */
/* LIVE NETWORK PANEL — mock operator console                          */
/* =================================================================== */

type ChargerState = 'AVAILABLE' | 'CHARGING' | 'OFFLINE' | 'RESERVED';

const initialChargers: { id: string; state: ChargerState }[] = [
    { id: 'TR-01', state: 'CHARGING' },
    { id: 'TR-02', state: 'AVAILABLE' },
    { id: 'TR-03', state: 'CHARGING' },
    { id: 'TR-04', state: 'OFFLINE' },
    { id: 'TR-05', state: 'CHARGING' },
    { id: 'TR-06', state: 'RESERVED' },
    { id: 'TR-07', state: 'AVAILABLE' },
    { id: 'TR-08', state: 'CHARGING' },
    { id: 'TR-09', state: 'AVAILABLE' },
    { id: 'TR-10', state: 'CHARGING' },
    { id: 'TR-11', state: 'AVAILABLE' },
    { id: 'TR-12', state: 'RESERVED' },
];

function stateColor(s: ChargerState): string {
    if (s === 'CHARGING') return ACCENT;
    if (s === 'AVAILABLE') return '#8C948F';
    if (s === 'OFFLINE') return '#FF7373';
    return '#FFB454';
}

type LogEntry = { ts: string; kind: 'WS' | 'API' | 'OCPP' | 'JOB'; target: string; msg: string; status?: string };

const initialLogs: LogEntry[] = [
    { ts: '12:34:56', kind: 'WS', target: 'TR-08', msg: 'state=charging session_id=ses_8a2', status: 'ok' },
    { ts: '12:34:55', kind: 'API', target: 'POST /v1/sessions', msg: '201 created  82ms', status: '201' },
    { ts: '12:34:54', kind: 'OCPP', target: 'TR-03', msg: 'StatusNotification → Preparing', status: 'ok' },
    { ts: '12:34:52', kind: 'JOB', target: 'tariff_engine', msg: 'recomputed prices for 12 ports', status: 'ok' },
    { ts: '12:34:50', kind: 'WS', target: 'TR-12', msg: 'reservation_held for user_8a2f', status: 'ok' },
];

function logColor(k: LogEntry['kind'], ACCENT: string): string {
    if (k === 'WS') return ACCENT;
    if (k === 'API') return '#5EC8FF';
    if (k === 'OCPP') return '#FFB454';
    return '#C792EA';
}

function LiveNetworkPanel({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const [chargers, setChargers] = useState(initialChargers);
    const [kw, setKw] = useState(284);
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [ping, setPing] = useState(18);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'api' | 'settings'>('dashboard');

    useEffect(() => {
        const i = setInterval(() => {
            // mutate one charger state
            const newState: ChargerState = (['AVAILABLE', 'CHARGING', 'CHARGING', 'RESERVED'] as ChargerState[])[Math.floor(Math.random() * 4)];
            let mutatedId = '';
            setChargers((prev) => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * next.length);
                mutatedId = next[idx].id;
                next[idx] = { ...next[idx], state: newState };
                return next;
            });
            setKw((k) => Math.max(180, Math.min(360, k + Math.floor(Math.random() * 20) - 10)));
            setPing((p) => Math.max(8, Math.min(48, p + Math.floor(Math.random() * 8) - 4)));

            // push a new log entry
            const now = new Date();
            const ts = now.toTimeString().slice(0, 8);
            const r = Math.random();
            let entry: LogEntry;
            if (r < 0.45) {
                entry = { ts, kind: 'WS', target: mutatedId, msg: `state=${newState.toLowerCase()}`, status: 'ok' };
            } else if (r < 0.75) {
                entry = { ts, kind: 'OCPP', target: mutatedId, msg: `StatusNotification → ${newState[0] + newState.slice(1).toLowerCase()}`, status: 'ok' };
            } else if (r < 0.92) {
                const codes = ['200', '201', '204'];
                const code = codes[Math.floor(Math.random() * codes.length)];
                const ms = 30 + Math.floor(Math.random() * 80);
                entry = { ts, kind: 'API', target: 'POST /v1/sessions', msg: `${code} ${ms}ms`, status: code };
            } else {
                entry = { ts, kind: 'JOB', target: 'tariff_engine', msg: 'recomputed prices', status: 'ok' };
            }
            setLogs((prev) => [entry, ...prev].slice(0, 5));
        }, 1600);
        return () => clearInterval(i);
    }, []);

    const tabs: Array<{ id: typeof activeTab; label: string }> = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'events', label: 'Events' },
        { id: 'api', label: 'API' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <div
            style={{
                background: SURFACE,
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: `0 30px 80px ${ACCENT}10`,
            }}
        >
            {/* Title bar — traffic-light controls + app title + API health */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderBottom: `1px solid ${BORDER}`,
                    background: BG,
                    gap: 12,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                    </div>
                    <span
                        className="mono"
                        style={{
                            fontSize: '0.58rem',
                            color: TEXT_DIM,
                            letterSpacing: '0.18em',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minWidth: 0,
                        }}
                    >
                        {isMobile ? 'trio-cpms' : 'trio-cpms · ops.trio.dev'}
                    </span>
                </div>
                {/* API health pill */}
                <div
                    className="mono"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: TEXT_DIM,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: ACCENT }}
                    >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
                        {isMobile ? 'WS' : 'WS·CONNECTED'}
                    </motion.span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{ping}ms</span>
                    {!isMobile && (
                      <>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span style={{ color: '#5EC8FF' }}>API 200</span>
                      </>
                    )}
                </div>
            </div>

            {/* Tab bar */}
            <div
                style={{
                    display: 'flex',
                    background: BG,
                    borderBottom: `1px solid ${BORDER}`,
                    overflowX: 'auto',
                }}
            >
                {tabs.map((t) => {
                    const on = activeTab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className="mono"
                            style={{
                                background: on ? SURFACE : 'transparent',
                                border: 'none',
                                borderBottom: on ? `2px solid ${ACCENT}` : '2px solid transparent',
                                color: on ? ACCENT : TEXT_DIM,
                                padding: '9px 16px',
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                whiteSpace: 'nowrap',
                                transition: 'all 150ms',
                            }}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Stat row */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    borderBottom: `1px solid ${BORDER}`,
                }}
            >
                {[
                    { l: 'PORTS', v: chargers.length },
                    { l: 'IN USE', v: chargers.filter((c) => c.state === 'CHARGING').length },
                    { l: 'LIVE LOAD', v: `${kw}kW` },
                ].map((s, i) => (
                    <div
                        key={i}
                        style={{
                            padding: isMobile ? '12px 12px' : '14px 16px',
                            borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.55rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.22em',
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            {s.l}
                        </div>
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: isMobile ? '1.3rem' : '1.6rem',
                                color: ACCENT,
                                fontWeight: 700,
                                letterSpacing: '-0.025em',
                                fontVariantNumeric: 'tabular-nums',
                                lineHeight: 1,
                            }}
                        >
                            {s.v}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charger grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                    gap: 1,
                    background: BORDER,
                }}
            >
                {chargers.map((c) => (
                    <div
                        key={c.id}
                        style={{
                            background: BG,
                            padding: isMobile ? '10px 8px' : '12px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <motion.span
                                animate={c.state === 'CHARGING' ? { opacity: [1, 0.4, 1] } : {}}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: stateColor(c.state),
                                    boxShadow: c.state === 'CHARGING' ? `0 0 6px ${ACCENT}` : 'none',
                                }}
                            />
                            <span
                                className="mono"
                                style={{
                                    fontSize: '0.58rem',
                                    color: TEXT,
                                    letterSpacing: '0.14em',
                                    fontWeight: 700,
                                }}
                            >
                                {c.id}
                            </span>
                        </div>
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.5rem',
                                color: stateColor(c.state),
                                letterSpacing: '0.18em',
                                fontWeight: 700,
                            }}
                        >
                            {c.state}
                        </span>
                    </div>
                ))}
            </div>

            {/* Live event log — console output */}
            <div
                style={{
                    background: BG,
                    borderTop: `1px solid ${BORDER}`,
                    padding: '8px 14px 10px',
                }}
            >
                <div
                    className="mono"
                    style={{
                        fontSize: '0.5rem',
                        color: TEXT_DIM,
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>EVENT STREAM · live</span>
                    <span style={{ opacity: 0.5 }}>tail -f</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {logs.map((l, i) => (
                        <motion.div
                            key={l.ts + l.target + i}
                            initial={i === 0 ? { opacity: 0, x: -6 } : false}
                            animate={{ opacity: 1 - i * 0.18, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mono"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                fontSize: isMobile ? '0.58rem' : '0.62rem',
                                lineHeight: 1.5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                        >
                            <span style={{ color: TEXT_DIM, opacity: 0.7, flexShrink: 0 }}>{l.ts}</span>
                            <span
                                style={{
                                    color: logColor(l.kind, ACCENT),
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    width: 36,
                                    flexShrink: 0,
                                }}
                            >
                                {l.kind}
                            </span>
                            <span style={{ color: TEXT, fontWeight: 600, flexShrink: 0 }}>{l.target}</span>
                            <span style={{ color: TEXT_DIM, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.msg}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =================================================================== */
/* CAPABILITY CONSOLE — tabbed                                         */
/* =================================================================== */

type Capability = {
    id: string;
    n: string;
    label: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    intro: string;
    bullets: string[];
    render: (isMobile: boolean) => React.ReactNode;
};

/* =================================================================== */
/* BUILT IN-HOUSE — the origin story of the platform                   */
/* =================================================================== */

function BuiltInHouse({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING } = useTheme();

    const proofPoints = [
        { num: '100+', lbl: 'EVs running on it daily' },
        { num: '1', lbl: 'Owned charging hub in production' },
        { num: '24/7', lbl: 'Live operations since Nov 2025' },
        { num: '₹0', lbl: 'License fees, ever — built in-house' },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 56 : 140 }}
        >
            <SectionIndex n="00" label="WHY WE BUILT IT" />

            <div
                style={{
                    marginTop: 24,
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
                    gap: isMobile ? 28 : 60,
                    alignItems: 'start',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: isMobile ? '1.6rem' : 'clamp(2rem, 3.6vw, 3rem)',
                            fontWeight: 800,
                            color: HEADING,
                            letterSpacing: '-0.035em',
                            lineHeight: 1.06,
                            margin: 0,
                            marginBottom: 20,
                            maxWidth: 620,
                        }}
                    >
                        We needed it. We couldn't buy it.{' '}
                        <span style={{ color: ACCENT }}>So we built it.</span>
                    </h2>
                    <p
                        style={{
                            fontSize: isMobile ? '0.95rem' : '1.02rem',
                            color: TEXT_DIM,
                            lineHeight: 1.7,
                            margin: 0,
                            marginBottom: 16,
                            maxWidth: 540,
                        }}
                    >
                        When Trio's fleet went live in early 2025, every off-the-shelf CPMS we tried was either built for European tariff models, locked us into a hardware brand, or charged per-port fees that broke our unit economics from day one.
                    </p>
                    <p
                        style={{
                            fontSize: isMobile ? '0.95rem' : '1.02rem',
                            color: TEXT_DIM,
                            lineHeight: 1.7,
                            margin: 0,
                            marginBottom: 16,
                            maxWidth: 540,
                        }}
                    >
                        So our engineering team wrote our own. Every release ships to our own fleet first — load-balanced across our hub in New Town, billed through our own tariff engine, monitored by our own ops console. <strong style={{ color: TEXT, fontWeight: 600 }}>If it doesn't survive a Kolkata Monday morning rush, it doesn't ship.</strong>
                    </p>
                    <p
                        style={{
                            fontSize: isMobile ? '0.95rem' : '1.02rem',
                            color: TEXT,
                            lineHeight: 1.7,
                            margin: 0,
                            maxWidth: 540,
                        }}
                    >
                        Now the same platform is open to partners — fleet operators, residential complexes, CPO networks, and anyone running OCPP hardware in India.
                    </p>
                </div>

                {/* Proof card */}
                <div
                    style={{
                        background: SURFACE,
                        border: `1px solid ${BORDER_STRONG}`,
                        borderRadius: 16,
                        padding: isMobile ? '22px 22px' : '28px 30px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 0%, ${ACCENT_SOFT}14, transparent 60%)`, pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.6rem',
                                color: ACCENT,
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                marginBottom: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                            <span>BATTLE-TESTED · PRODUCTION</span>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 1,
                                background: BORDER,
                                border: `1px solid ${BORDER}`,
                                borderRadius: 12,
                                overflow: 'hidden',
                            }}
                        >
                            {proofPoints.map((p) => (
                                <div key={p.lbl} style={{ background: BG, padding: '18px 16px' }}>
                                    <div
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: isMobile ? '1.7rem' : '2rem',
                                            fontWeight: 700,
                                            color: ACCENT,
                                            lineHeight: 1,
                                            marginBottom: 6,
                                        }}
                                    >
                                        {p.num}
                                    </div>
                                    <div
                                        className="mono"
                                        style={{
                                            fontSize: '0.56rem',
                                            color: TEXT_DIM,
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {p.lbl}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                marginTop: 18,
                                padding: '12px 14px',
                                background: 'rgba(0,255,136,0.05)',
                                border: `1px solid ${BORDER}`,
                                borderRadius: 10,
                                fontFamily: "'Cormorant Garamond', serif",
                                fontStyle: 'italic',
                                fontSize: isMobile ? '0.95rem' : '1.05rem',
                                lineHeight: 1.5,
                                color: HEADING,
                            }}
                        >
                            "If it doesn't run our fleet, we don't ship it to yours."
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* CAPABILITY CONSOLE — feature modules                                */
/* =================================================================== */

/* =================================================================== */
/* DRIVER APP — three phone mockups: discover, scan, session            */
/* =================================================================== */

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
    const { ACCENT, BG, SURFACE, BORDER_STRONG, TEXT_DIM } = useTheme();
    return (
        <div
            style={{
                width: '100%',
                maxWidth: 260,
                margin: '0 auto',
                aspectRatio: '9 / 19.5',
                background: '#000',
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 36,
                padding: 6,
                position: 'relative',
                boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px ${BORDER_STRONG}, 0 0 24px ${ACCENT}10`,
            }}
        >
            {/* notch */}
            <div
                style={{
                    position: 'absolute',
                    top: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 18,
                    background: '#000',
                    borderRadius: '0 0 14px 14px',
                    zIndex: 10,
                }}
            />
            {/* inner screen */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: SURFACE,
                    borderRadius: 30,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {children}
            </div>
            {/* screen label */}
            <div
                className="mono"
                style={{
                    position: 'absolute',
                    bottom: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: TEXT_DIM,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </div>
        </div>
    );
}

function PhoneBottomNav() {
    const { ACCENT, BG, BORDER, TEXT_DIM } = useTheme();
    const items = [
        { id: 'home', d: 'M3 12l9-9 9 9 M5 10v11h14V10' },
        { id: 'route', d: 'M3 6h13a3 3 0 0 1 3 3v6 M19 18h-3 M7 18H4 M9 6l-3 3 3 3 M15 12l3 3-3 3' },
        { id: 'scan', d: '', icon: true },
        { id: 'wallet', d: 'M3 7h18v12H3z M3 11h18 M16 15h2' },
        { id: 'profile', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1' },
    ];
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: BG,
                borderTop: `1px solid ${BORDER}`,
                padding: '8px 6px 12px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 5,
            }}
        >
            {items.map((it) =>
                it.icon ? (
                    <div
                        key={it.id}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: ACCENT,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 12px ${ACCENT}55`,
                            transform: 'translateY(-8px)',
                        }}
                    >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z" />
                        </svg>
                    </div>
                ) : (
                    <svg
                        key={it.id}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={TEXT_DIM}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d={it.d} />
                    </svg>
                ),
            )}
        </div>
    );
}

function DiscoveryMockup() {
    const { ACCENT } = useTheme();
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#eae6dc' }}>
            {/* Stylized SVG map — roads, blocks, water */}
            <svg
                viewBox="0 0 240 480"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                aria-hidden
            >
                {/* base land */}
                <rect width="240" height="480" fill="#eae6dc" />
                {/* water body — diagonal river */}
                <path
                    d="M -10 360 C 40 320 90 380 140 340 C 190 300 230 350 260 320 L 260 500 L -10 500 Z"
                    fill="#b9d6df"
                    opacity="0.85"
                />
                {/* park / greenery */}
                <ellipse cx="40" cy="180" rx="36" ry="28" fill="#c7d8b3" opacity="0.9" />
                <rect x="160" y="80" width="68" height="48" rx="4" fill="#c7d8b3" opacity="0.85" />
                {/* building block clusters — light tan rects */}
                {[
                    { x: 14, y: 60, w: 32, h: 22 },
                    { x: 50, y: 56, w: 26, h: 30 },
                    { x: 92, y: 60, w: 38, h: 24 },
                    { x: 14, y: 120, w: 24, h: 28 },
                    { x: 82, y: 124, w: 30, h: 22 },
                    { x: 122, y: 120, w: 28, h: 30 },
                    { x: 14, y: 220, w: 38, h: 24 },
                    { x: 60, y: 220, w: 24, h: 28 },
                    { x: 96, y: 224, w: 38, h: 22 },
                    { x: 148, y: 220, w: 30, h: 28 },
                    { x: 184, y: 224, w: 42, h: 22 },
                    { x: 14, y: 280, w: 32, h: 24 },
                    { x: 56, y: 282, w: 28, h: 22 },
                    { x: 96, y: 280, w: 40, h: 26 },
                    { x: 146, y: 282, w: 30, h: 24 },
                    { x: 184, y: 286, w: 42, h: 22 },
                ].map((b, i) => (
                    <rect
                        key={i}
                        x={b.x}
                        y={b.y}
                        width={b.w}
                        height={b.h}
                        rx="2"
                        fill="#dcd6c4"
                        opacity="0.95"
                    />
                ))}
                {/* main roads — white strokes */}
                <g stroke="#ffffff" strokeLinecap="round" fill="none">
                    {/* horizontal arterial roads */}
                    <path d="M -10 100 L 260 100" strokeWidth="6" />
                    <path d="M -10 200 L 260 200" strokeWidth="5" />
                    <path d="M -10 260 L 260 260" strokeWidth="4" />
                    {/* vertical roads */}
                    <path d="M 50 -10 L 50 360" strokeWidth="5" />
                    <path d="M 140 -10 L 140 360" strokeWidth="5" />
                    <path d="M 90 100 L 90 360" strokeWidth="3" />
                    {/* curvy road */}
                    <path d="M -10 320 C 60 300 120 340 200 300 L 260 290" strokeWidth="4" />
                </g>
                {/* secondary roads — thin gray */}
                <g stroke="#c6c0ae" strokeWidth="1.5" fill="none">
                    <path d="M -10 150 L 240 150" />
                    <path d="M -10 240 L 240 240" />
                    <path d="M 110 -10 L 110 200" />
                    <path d="M 180 100 L 180 320" />
                    <path d="M 20 200 L 20 320" />
                </g>
                {/* tiny labels — place names */}
                <text x="20" y="42" fontSize="6" fontWeight="700" fill="#8a8472" fontFamily="'Inter', sans-serif">KALITALA</text>
                <text x="120" y="170" fontSize="6" fontWeight="700" fill="#8a8472" fontFamily="'Inter', sans-serif">NEWTOWN</text>
                <text x="160" y="430" fontSize="6" fontWeight="700" fill="#5a8896" fontFamily="'Inter', sans-serif">RIVER</text>
            </svg>

            {/* top status bar */}
            <div style={{ position: 'absolute', top: 30, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }} className="mono">
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>9:41</span>
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>●●●●</span>
            </div>

            {/* map pins */}
            {[
                { x: '28%', y: '36%', label: 'TRIOEV01', active: true },
                { x: '62%', y: '50%', label: '' },
                { x: '38%', y: '58%', label: '' },
                { x: '70%', y: '26%', label: '' },
            ].map((p, i) => (
                <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -100%)' }}>
                    {p.active && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 6px)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#0d0d0d',
                                color: ACCENT,
                                padding: '4px 8px',
                                borderRadius: 6,
                                fontSize: '0.45rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                border: `1px solid ${ACCENT}55`,
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            }}
                        >
                            {p.label}
                        </div>
                    )}
                    <div
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: ACCENT,
                            border: '2px solid #fff',
                            boxShadow: `0 0 10px ${ACCENT}cc, 0 2px 4px rgba(0,0,0,0.4)`,
                        }}
                    />
                </div>
            ))}

            {/* user location dot */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '78%',
                    transform: 'translateX(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#5EC8FF',
                    border: '2px solid #fff',
                    boxShadow: '0 0 12px #5EC8FF99, 0 2px 4px rgba(0,0,0,0.4)',
                }}
            />
            <PhoneBottomNav />
        </div>
    );
}

function ScanMockup() {
    const { ACCENT, BG, TEXT, TEXT_DIM, BORDER } = useTheme();
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#0a0d0b' }}>
            {/* status bar */}
            <div style={{ position: 'absolute', top: 30, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }} className="mono">
                <span style={{ fontSize: '0.5rem', color: TEXT, fontWeight: 700 }}>9:41</span>
                <span style={{ fontSize: '0.5rem', color: TEXT, fontWeight: 700 }}>●●●●</span>
            </div>
            {/* header text */}
            <div
                style={{
                    position: 'absolute',
                    top: 56,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: '0.72rem',
                    color: TEXT,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Scan QR on the charger
            </div>
            {/* viewfinder */}
            <div
                style={{
                    position: 'absolute',
                    top: '32%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    aspectRatio: '1 / 1',
                }}
            >
                {[
                    { t: 0, l: 0, br: false, bb: false },
                    { t: 0, r: 0, bl: false, bb: false },
                    { b: 0, l: 0, br: false, bt: false },
                    { b: 0, r: 0, bl: false, bt: false },
                ].map((c, i) => {
                    const isTop = c.t === 0;
                    const isLeft = c.l === 0;
                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: c.t,
                                bottom: c.b,
                                left: c.l,
                                right: c.r,
                                width: 22,
                                height: 22,
                                borderTop: isTop ? `2px solid ${ACCENT}` : 'none',
                                borderBottom: !isTop ? `2px solid ${ACCENT}` : 'none',
                                borderLeft: isLeft ? `2px solid ${ACCENT}` : 'none',
                                borderRight: !isLeft ? `2px solid ${ACCENT}` : 'none',
                                borderRadius: 4,
                                filter: `drop-shadow(0 0 4px ${ACCENT}66)`,
                            }}
                        />
                    );
                })}
            </div>
            {/* scan line */}
            <motion.div
                animate={{ top: ['32%', '60%', '32%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    left: '20%',
                    right: '20%',
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                    filter: `drop-shadow(0 0 6px ${ACCENT})`,
                }}
            />
            {/* enter ID button */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 90,
                    left: 16,
                    right: 16,
                    padding: '10px 0',
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: BG,
                    background: ACCENT,
                    borderRadius: 8,
                    boxShadow: `0 4px 14px ${ACCENT}44`,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Enter Charger ID
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 72,
                    left: 16,
                    right: 16,
                    textAlign: 'center',
                    fontSize: '0.48rem',
                    color: TEXT_DIM,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Charger ID is below the QR
            </div>
            <PhoneBottomNav />
        </div>
    );
}

function EnterIDMockup() {
    const { ACCENT, BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING } = useTheme();
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#f7f7f5' }}>
            {/* status bar */}
            <div style={{ position: 'absolute', top: 30, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }} className="mono">
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>9:41</span>
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>●●●●</span>
            </div>
            {/* back chevron */}
            <div style={{ position: 'absolute', top: 56, left: 14, display: 'flex', alignItems: 'center', gap: 6, color: '#3a3a35' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                <span style={{ fontSize: '0.6rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>back</span>
            </div>
            {/* heading */}
            <div style={{ position: 'absolute', top: 84, left: 16, right: 16, fontFamily: "'Inter', sans-serif" }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 4 }}>Enter Charger ID</div>
                <div style={{ fontSize: '0.5rem', color: '#7a7a72' }}>Find charger ID below QR code on charger</div>
            </div>
            {/* form */}
            <div style={{ position: 'absolute', top: 150, left: 16, right: 16, fontFamily: "'Inter', sans-serif" }}>
                <div style={{ fontSize: '0.55rem', color: '#0d0d0d', fontWeight: 700, marginBottom: 6 }}>Charger ID</div>
                <div style={{ background: '#fff', border: '1px solid #FF7373', borderRadius: 4, padding: '10px 12px', fontSize: '0.55rem', color: '#bdbab1' }}>
                    Enter Charger ID
                </div>
                <div style={{ fontSize: '0.42rem', color: '#FF5252', fontWeight: 600, marginTop: 4 }}>Please enter charger Id</div>
            </div>
            {/* submit button */}
            <div
                style={{
                    position: 'absolute',
                    top: 232,
                    left: 16,
                    right: 16,
                    padding: '10px 0',
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#fff',
                    background: '#00b850',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,184,80,0.3)',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Submit
            </div>
            {/* faux keyboard hint */}
            <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, height: 110, background: '#d3d6db', borderTop: '1px solid #bbb' }}>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 2, padding: '6px 4px', height: '100%' }}>
                    {[10, 10, 9, 7].map((n, r) => (
                        <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 2 }}>
                            {Array.from({ length: n }).map((_, i) => (
                                <div key={i} style={{ background: '#fff', borderRadius: 3, boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProfileMockup() {
    const { ACCENT } = useTheme();
    const items = [
        { icon: 'M3 13l9-9 9 9 M5 11v10h14V11', label: 'My Vehicle' },
        { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', label: 'Autocharge' },
        { icon: 'M21 12a9 9 0 1 1-3-6.7 M21 4v5h-5', label: 'Charging Session' },
        { icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M3 21a9 9 0 0 1 18 0', label: 'Account details' },
        { icon: 'M3 5h12 M3 12h12 M3 19h12 M17 5l4 7-4 7', label: 'Change Language' },
        { icon: 'M12 2a10 10 0 1 0 10 10 M12 17v.01 M9 9a3 3 0 1 1 5.2 2c-.4.3-.7.5-1 .8-1 .8-1.2 1.4-1.2 2.2', label: 'Help and Support' },
        { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Refer a Friend' },
        { icon: 'M3 7h18v12H3z M3 11h18', label: 'My Promo Codes' },
    ];
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#f7f7f5' }}>
            {/* status bar */}
            <div style={{ position: 'absolute', top: 30, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }} className="mono">
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>9:41</span>
                <span style={{ fontSize: '0.5rem', color: '#3a3a35', fontWeight: 700 }}>●●●●</span>
            </div>
            {/* user header */}
            <div style={{ position: 'absolute', top: 56, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e1e1d8' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0d0d0d', fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}>SS FLEET</span>
            </div>
            {/* menu list */}
            <div style={{ position: 'absolute', top: 90, left: 8, right: 8, bottom: 90, overflow: 'hidden' }}>
                {items.map((it, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '7px 8px',
                            borderBottom: '1px solid #e6e4dc',
                            background: '#fff',
                        }}
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3a3a35" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d={it.icon} />
                        </svg>
                        <span style={{ flex: 1, fontSize: '0.55rem', fontFamily: "'Inter', sans-serif", color: '#0d0d0d', fontWeight: 500 }}>{it.label}</span>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#bdbab1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                ))}
            </div>
            {/* log out button */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 12,
                    right: 12,
                    padding: '7px 0',
                    textAlign: 'center',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: '#FF5252',
                    border: '1px solid #FF5252',
                    borderRadius: 4,
                    background: '#fff',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Log Out
            </div>
            <PhoneBottomNav />
        </div>
    );
}

function SessionMockup() {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING } = useTheme();
    return (
        <div style={{ position: 'absolute', inset: 0, background: BG, display: 'flex', flexDirection: 'column' }}>
            {/* hero / charger photo placeholder */}
            <div
                style={{
                    height: '32%',
                    background: `linear-gradient(135deg, #1a2018, #0d1410), radial-gradient(circle at 50% 50%, ${ACCENT}1f, transparent 60%)`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* faux charger silhouette */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 36,
                        height: 56,
                        background: `linear-gradient(180deg, #2a2f2c, #1a1e1b)`,
                        borderRadius: 6,
                        border: `1px solid ${BORDER_STRONG}`,
                    }}
                >
                    <div style={{ position: 'absolute', top: 6, left: 6, right: 6, height: 24, background: ACCENT, borderRadius: 3, opacity: 0.8, boxShadow: `0 0 12px ${ACCENT}66` }} />
                </div>
            </div>
            {/* content */}
            <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: TEXT, letterSpacing: '-0.01em', fontFamily: "'Inter', sans-serif" }}>TRIOEV01</div>
                    <div style={{ fontSize: '0.45rem', color: TEXT_DIM, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>Charger ID: TRIOEV01 · Operator: Trio EV</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1, background: ACCENT, color: BG, padding: '6px 0', textAlign: 'center', borderRadius: 6, fontSize: '0.5rem', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Direction</div>
                    <div style={{ flex: 1, background: 'transparent', border: `1px solid ${ACCENT}`, color: ACCENT, padding: '6px 0', textAlign: 'center', borderRadius: 6, fontSize: '0.5rem', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Contact</div>
                </div>
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>
                    <div className="mono" style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.16em', marginBottom: 6 }}>
                        AVAILABLE CONNECTOR
                    </div>
                    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: TEXT, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>CCS Type 2 A</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.5rem', color: TEXT_DIM, fontFamily: "'Inter', sans-serif" }}>30.0 kWh</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.45rem', color: '#FF7373', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF7373' }} />
                                In Use
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <PhoneBottomNav />
        </div>
    );
}

function AppScreenshot({ src, fallback }: { src: string; fallback: React.ReactNode }) {
    const [failed, setFailed] = useState(false);
    if (failed) return <>{fallback}</>;
    return (
        <img
            src={src}
            alt=""
            onError={() => setFailed(true)}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
            }}
        />
    );
}

function DriverApp({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING } = useTheme();

    const screens = [
        {
            n: '01',
            label: 'DISCOVERY',
            title: 'Find the nearest Trio charger.',
            desc: 'Live map shows every Trio port with real-time availability — synced from the same operator console our team uses.',
            mockup: <AppScreenshot src="/app-map.png" fallback={<DiscoveryMockup />} />,
            frameLabel: 'HOME · MAP',
        },
        {
            n: '02',
            label: 'INSTANT START',
            title: 'Scan. Charge. Done.',
            desc: 'The QR scanner kicks off a session in seconds. Damaged code? Tap "Enter Charger ID" and type it manually.',
            mockup: <AppScreenshot src="/app-scan.png" fallback={<ScanMockup />} />,
            frameLabel: 'SCAN',
        },
        {
            n: '03',
            label: 'MANUAL FALLBACK',
            title: 'Type the ID, start the session.',
            desc: 'Validation kicks in immediately — no wrong codes, no silent failures. The driver knows whether the ID is good before they walk over to plug in.',
            mockup: <AppScreenshot src="/app-enter-id.png" fallback={<EnterIDMockup />} />,
            frameLabel: 'ENTER ID',
        },
        {
            n: '04',
            label: 'CHARGER DETAIL',
            title: 'See ports, connectors, hours.',
            desc: 'Tap a station for live availability, supported connectors, operating hours, bay photos, and reviews — before you commit to driving over.',
            mockup: <AppScreenshot src="/app-detail.png" fallback={<SessionMockup />} />,
            frameLabel: 'STATION',
        },
        {
            n: '05',
            label: 'PAY & MANAGE',
            title: 'Wallet, autocharge, profile.',
            desc: 'In-app wallet for one-tap payments. Autocharge for fleet drivers. Vehicles, promo codes, receipts, and full session history — all in one place.',
            mockup: <AppScreenshot src="/app-profile.png" fallback={<ProfileMockup />} />,
            frameLabel: 'PROFILE',
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 56 : 140 }}
        >
            <SectionIndex n="D" label="THE DRIVER APP" />

            <div
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 32 : 48,
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
                    gap: isMobile ? 16 : 48,
                    alignItems: 'end',
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: isMobile ? '1.4rem' : 'clamp(1.6rem, 2.6vw, 2.2rem)',
                        fontWeight: 600,
                        color: HEADING,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.12,
                        margin: 0,
                        maxWidth: 560,
                    }}
                >
                    Three taps — from finding{' '}
                    <span style={{ color: ACCENT }}>to charging.</span>
                </h2>
                <p
                    style={{
                        fontSize: isMobile ? '0.92rem' : '0.98rem',
                        color: TEXT_DIM,
                        lineHeight: 1.65,
                        margin: 0,
                        maxWidth: 460,
                    }}
                >
                    The same driver app our fleet uses every day — iOS &amp; Android, white-labelable to your brand. Map discovery, QR-scan start, wallet payments, autocharge, and session history.
                </p>
            </div>

            {isMobile ? (
                <DriverAppMobileCarousel screens={screens} />
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: 18,
                        rowGap: 64,
                    }}
                >
                    {screens.map((s) => (
                        <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <PhoneFrame label={s.frameLabel}>{s.mockup}</PhoneFrame>
                            <div
                                style={{
                                    marginTop: 56,
                                    width: '100%',
                                    maxWidth: 300,
                                }}
                            >
                                <div
                                    className="mono"
                                    style={{
                                        fontSize: '0.58rem',
                                        color: ACCENT,
                                        letterSpacing: '0.22em',
                                        fontWeight: 700,
                                        marginBottom: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 10,
                                    }}
                                >
                                    <span>{s.n}</span>
                                    <span style={{ width: 24, height: 1, background: BORDER_STRONG }} />
                                    <span>{s.label}</span>
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        color: HEADING,
                                        lineHeight: 1.18,
                                        letterSpacing: '-0.02em',
                                        margin: '0 0 10px',
                                    }}
                                >
                                    {s.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '0.84rem',
                                        color: TEXT_DIM,
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}
                                >
                                    {s.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.section>
    );
}

type DriverScreen = {
    n: string;
    label: string;
    title: string;
    desc: string;
    mockup: React.ReactNode;
    frameLabel: string;
};

function DriverAppMobileCarousel({ screens }: { screens: DriverScreen[] }) {
    const { ACCENT, BORDER_STRONG, TEXT_DIM, HEADING } = useTheme();
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            setActive((i) => (i + 1) % screens.length);
        }, 4500);
        return () => clearInterval(id);
    }, [paused, screens.length]);

    const current = screens[active];

    return (
        <div style={{ position: 'relative' }}>
            {/* Phone with sliding screens */}
            <div
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setTimeout(() => setPaused(false), 800)}
                style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
            >
                <PhoneFrame label={current.frameLabel}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.n}
                            initial={{ opacity: 0, x: 30, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -30, scale: 0.98 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            style={{ position: 'absolute', inset: 0 }}
                        >
                            {current.mockup}
                        </motion.div>
                    </AnimatePresence>
                </PhoneFrame>
            </div>

            {/* Pagination dots */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 52,
                    marginBottom: 22,
                }}
            >
                {screens.map((s, i) => {
                    const on = i === active;
                    return (
                        <button
                            key={s.n}
                            onClick={() => {
                                setActive(i);
                                setPaused(true);
                                setTimeout(() => setPaused(false), 6000);
                            }}
                            aria-label={`Show ${s.label}`}
                            style={{
                                width: on ? 22 : 7,
                                height: 7,
                                borderRadius: 99,
                                background: on ? ACCENT : 'rgba(255,255,255,0.18)',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                boxShadow: on ? `0 0 8px ${ACCENT}66` : 'none',
                                transition: 'width 0.35s ease, background 0.35s ease',
                            }}
                        />
                    );
                })}
            </div>

            {/* Description card — animates per active screen */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.n + '-desc'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{ textAlign: 'center', maxWidth: 360, margin: '0 auto', padding: '0 12px' }}
                >
                    <div
                        className="mono"
                        style={{
                            fontSize: '0.58rem',
                            color: ACCENT,
                            letterSpacing: '0.22em',
                            fontWeight: 700,
                            marginBottom: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                        }}
                    >
                        <span>{current.n}</span>
                        <span style={{ width: 24, height: 1, background: BORDER_STRONG }} />
                        <span>{current.label}</span>
                    </div>
                    <h3
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            color: HEADING,
                            lineHeight: 1.18,
                            letterSpacing: '-0.02em',
                            margin: '0 0 10px',
                        }}
                    >
                        {current.title}
                    </h3>
                    <p
                        style={{
                            fontSize: '0.86rem',
                            color: TEXT_DIM,
                            lineHeight: 1.65,
                            margin: 0,
                        }}
                    >
                        {current.desc}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* =================================================================== */
/* CAPABILITY CONSOLE — feature modules                                */
/* =================================================================== */

function CapabilityConsole({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const [active, setActive] = useState(0);

    const caps: Capability[] = [
        {
            id: 'monitor',
            n: '01',
            label: 'Monitoring',
            icon: <Activity size={16} />,
            title: (
                <>
                    Eyes on every port,{' '}
                    <span style={{ color: ACCENT }}>around the clock.</span>
                </>
            ),
            intro: 'Eliminate on-site inspections. The CPMS keeps an automated eye on the network 24/7.',
            bullets: [
                'Live status — available, in use, reserved, offline',
                'Remote restart, firmware push, fault reset, error clear',
                'Proactive SMS/email alerts on anomalies and power fluctuations',
            ],
            render: (m) => <MonitorMock isMobile={m} />,
        },
        {
            id: 'energy',
            n: '02',
            label: 'Energy',
            icon: <Zap size={16} />,
            title: (
                <>
                    Protect the grid.{' '}
                    <span style={{ color: ACCENT }}>Slash the bill.</span>
                </>
            ),
            intro: 'Smart energy management and load balancing — local grid protection and lower demand charges.',
            bullets: [
                'Dynamic Load Management distributes site power across active EVs',
                'Peak shaving throttles charging during expensive utility windows',
                'Solar + BESS integration prioritises free, clean on-site energy',
            ],
            render: (m) => <EnergyMock isMobile={m} />,
        },
        {
            id: 'billing',
            n: '03',
            label: 'Billing',
            icon: <CreditCard size={16} />,
            title: (
                <>
                    Every plug-in,{' '}
                    <span style={{ color: ACCENT }}>a revenue event.</span>
                </>
            ),
            intro: 'Automated billing and revenue tools turn every port into a profit center.',
            bullets: [
                'Custom tariffs — per kWh, per minute, flat, or idle fees',
                'Dynamic pricing tied to grid demand or time-of-use rates',
                'In-app, card terminal, RFID, and corporate fuel-card payments',
            ],
            render: (m) => <BillingMock isMobile={m} />,
        },
        {
            id: 'access',
            n: '04',
            label: 'Access',
            icon: <Users size={16} />,
            title: (
                <>
                    Who, when,{' '}
                    <span style={{ color: ACCENT }}>and at what price.</span>
                </>
            ),
            intro: 'Granular access control and fleet management — down to the user group and schedule.',
            bullets: [
                'Distinct user groups: employees, residents, VIPs, public, fleet',
                'Schedule charging windows to align with shifts and grid pricing',
                'Automated home-refuel reimbursement for corporate fleets',
            ],
            render: (m) => <AccessMock isMobile={m} />,
        },
    ];

    const cap = caps[active];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 56 : 140 }}
        >
            <SectionIndex n="A" label="WHAT'S IN THE APP" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 40,
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: HEADING,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Four software modules.{' '}
                <span style={{ color: ACCENT }}>One operator console.</span>
            </h2>

            {/* Tab bar */}
            <div
                style={{
                    display: 'flex',
                    gap: 4,
                    marginBottom: isMobile ? 18 : 26,
                    borderBottom: `1px solid ${BORDER}`,
                    overflowX: 'auto',
                }}
            >
                {caps.map((c, i) => {
                    const isActive = i === active;
                    return (
                        <button
                            key={c.id}
                            onClick={() => setActive(i)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: isMobile ? '10px 12px' : '14px 18px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: isActive ? ACCENT : TEXT_DIM,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                borderBottom: isActive ? `2px solid ${ACCENT}` : '2px solid transparent',
                                marginBottom: -1,
                                transition: 'color 220ms ease, border-color 220ms ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span>{c.n}</span>
                            {c.icon}
                            <span>{c.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={cap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
                        gap: isMobile ? 24 : 48,
                        alignItems: 'start',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontSize: isMobile ? '1.6rem' : '2rem',
                                fontWeight: 800,
                                color: HEADING,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                                margin: 0,
                                marginBottom: 16,
                            }}
                        >
                            {cap.title}
                        </h3>
                        <p
                            style={{
                                fontSize: isMobile ? '0.95rem' : '1.02rem',
                                color: TEXT_DIM,
                                lineHeight: 1.65,
                                margin: 0,
                                marginBottom: 22,
                                maxWidth: 540,
                            }}
                        >
                            {cap.intro}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {cap.bullets.map((b, i) => (
                                <li
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 12,
                                        fontSize: isMobile ? '0.9rem' : '0.95rem',
                                        color: TEXT,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span
                                        aria-hidden
                                        style={{
                                            marginTop: 8,
                                            width: 16,
                                            height: 1,
                                            background: ACCENT,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>{cap.render(isMobile)}</div>
                </motion.div>
            </AnimatePresence>
        </motion.section>
    );
}

/* ---- Mock UI panels for each capability ---- */

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <div
            style={{
                background: SURFACE,
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 14,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    padding: '10px 14px',
                    borderBottom: `1px solid ${BORDER}`,
                    background: BG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <span
                    className="mono"
                    style={{
                        fontSize: '0.58rem',
                        color: TEXT_DIM,
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                    }}
                >
                    {title}
                </span>
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="mono"
                    style={{ fontSize: '0.52rem', color: ACCENT, letterSpacing: '0.22em', fontWeight: 700 }}
                >
                    ● LIVE
                </motion.span>
            </div>
            <div style={{ padding: '16px 16px' }}>{children}</div>
        </div>
    );
}

function MonitorMock({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const ports = Array.from({ length: 24 }).map((_, i) => {
        const s: ChargerState =
            i % 5 === 0
                ? 'OFFLINE'
                : i % 4 === 0
                    ? 'RESERVED'
                    : i % 2 === 0
                        ? 'CHARGING'
                        : 'AVAILABLE';
        return { id: `P-${String(i + 1).padStart(2, '0')}`, state: s };
    });

    return (
        <PanelShell title="CHARGER MAP / 24 PORTS">
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                    gap: 6,
                }}
            >
                {ports.map((p, i) => (
                    <div
                        key={p.id}
                        style={{
                            background: BG,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 6,
                            padding: '8px 9px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <motion.span
                                animate={p.state === 'CHARGING' ? { opacity: [1, 0.4, 1] } : {}}
                                transition={{
                                    duration: 1.2 + (i % 4) * 0.15,
                                    repeat: Infinity,
                                }}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: stateColor(p.state),
                                    boxShadow:
                                        p.state === 'CHARGING' ? `0 0 6px ${ACCENT}` : 'none',
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                className="mono"
                                style={{
                                    fontSize: '0.58rem',
                                    color: TEXT,
                                    letterSpacing: '0.14em',
                                    fontWeight: 700,
                                }}
                            >
                                {p.id}
                            </span>
                        </div>
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.5rem',
                                color: stateColor(p.state),
                                letterSpacing: '0.2em',
                                fontWeight: 700,
                            }}
                        >
                            {p.state}
                        </span>
                    </div>
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 14,
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px solid ${BORDER}`,
                    flexWrap: 'wrap',
                }}
            >
                {[
                    { l: 'CHARGING', c: ACCENT },
                    { l: 'AVAILABLE', c: '#8C948F' },
                    { l: 'RESERVED', c: '#FFB454' },
                    { l: 'OFFLINE', c: '#FF7373' },
                ].map((it) => (
                    <div key={it.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: it.c,
                            }}
                        />
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.55rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.2em',
                                fontWeight: 700,
                            }}
                        >
                            {it.l}
                        </span>
                    </div>
                ))}
            </div>
        </PanelShell>
    );
}

function EnergyMock({ isMobile: _isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <PanelShell title="DYNAMIC LOAD / SITE 60kW BUDGET">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                    { id: 'TR-01', kw: 22, label: '22 kW' },
                    { id: 'TR-03', kw: 18, label: '18 kW' },
                    { id: 'TR-05', kw: 12, label: '12 kW' },
                    { id: 'TR-08', kw: 8, label: '8 kW' },
                ].map((r, i) => {
                    const pct = (r.kw / 30) * 100;
                    return (
                        <div key={r.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span className="mono" style={{ fontSize: '0.6rem', color: TEXT, letterSpacing: '0.16em', fontWeight: 700 }}>
                                    {r.id}
                                </span>
                                <span className="mono" style={{ fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.16em', fontWeight: 700 }}>
                                    {r.label}
                                </span>
                            </div>
                            <div style={{ height: 6, background: BG, borderRadius: 3, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                                    style={{
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${ACCENT_SOFT}, ${ACCENT})`,
                                        boxShadow: `0 0 8px ${ACCENT}55`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                <div
                    style={{
                        borderTop: `1px solid ${BORDER}`,
                        marginTop: 6,
                        paddingTop: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span className="mono" style={{ fontSize: '0.6rem', color: TEXT_DIM, letterSpacing: '0.2em', fontWeight: 700 }}>
                        ALLOCATED
                    </span>
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1rem', color: ACCENT, fontWeight: 800 }}>
                        60 / 60 kW
                    </span>
                </div>
            </div>
        </PanelShell>
    );
}

function BillingMock({ isMobile: _isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const tariffs = [
        { name: 'Off-peak · kWh', value: '₹ 12.00 / kWh' },
        { name: 'Standard · kWh', value: '₹ 18.50 / kWh' },
        { name: 'Peak · kWh', value: '₹ 24.00 / kWh' },
        { name: 'Idle fee · min', value: '₹ 4.00 / min' },
        { name: 'Reservation hold', value: '₹ 25.00 flat' },
    ];
    return (
        <PanelShell title="TARIFF ENGINE / 5 RULES ACTIVE">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tariffs.map((t, i) => (
                    <div
                        key={t.name}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 0',
                            borderBottom: i < tariffs.length - 1 ? `1px solid ${BORDER}` : 'none',
                        }}
                    >
                        <span style={{ fontSize: '0.88rem', color: TEXT }}>{t.name}</span>
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.7rem',
                                color: ACCENT,
                                letterSpacing: '0.12em',
                                fontWeight: 700,
                                padding: '4px 10px',
                                border: `1px solid ${BORDER_STRONG}`,
                                borderRadius: 6,
                            }}
                        >
                            {t.value}
                        </span>
                    </div>
                ))}
            </div>
        </PanelShell>
    );
}

function AccessMock({ isMobile: _isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const groups = [
        { name: 'Employees', count: 247, tag: 'FREE · workday' },
        { name: 'Residents', count: 132, tag: 'SUBSIDISED' },
        { name: 'Public drivers', count: 1392, tag: 'STANDARD' },
        { name: 'Fleet vehicles', count: 48, tag: 'SCHEDULED' },
    ];
    return (
        <PanelShell title="USER GROUPS / 4 POLICIES">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {groups.map((g, i) => (
                    <div
                        key={g.name}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto auto',
                            gap: 12,
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: i < groups.length - 1 ? `1px solid ${BORDER}` : 'none',
                        }}
                    >
                        <span style={{ fontSize: '0.92rem', color: TEXT, fontWeight: 600 }}>{g.name}</span>
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.6rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.18em',
                                fontWeight: 700,
                            }}
                        >
                            {g.count.toLocaleString()} USERS
                        </span>
                        <span
                            className="mono"
                            style={{
                                fontSize: '0.58rem',
                                color: ACCENT,
                                letterSpacing: '0.18em',
                                fontWeight: 700,
                                padding: '3px 8px',
                                border: `1px solid ${BORDER_STRONG}`,
                                borderRadius: 99,
                            }}
                        >
                            {g.tag}
                        </span>
                    </div>
                ))}
            </div>
        </PanelShell>
    );
}

/* =================================================================== */
/* COMPLIANCE / TECH ADVANTAGES                                        */
/* =================================================================== */

function Compliance({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const badges = [
        { code: 'OCPP', sub: '1.6J / 2.0.1', label: 'Open protocol' },
        { code: 'OCPI', sub: 'Roaming', label: 'Global hubs' },
        { code: 'WL', sub: 'White-Label', label: 'Your brand' },
        { code: 'CSV', sub: 'Analytics', label: 'Carbon · revenue · util' },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 56 : 140 }}
        >
            <SectionIndex n="B" label="ARCHITECTURE & STANDARDS" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 24 : 36,
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: HEADING,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Engineered on open standards.{' '}
                <span style={{ color: ACCENT }}>No vendor lock-in.</span>
            </h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                    gap: isMobile ? 12 : 16,
                }}
            >
                {badges.map((b) => (
                    <div
                        key={b.code}
                        style={{
                            border: `1px solid ${BORDER}`,
                            borderRadius: 12,
                            padding: isMobile ? '18px 16px' : '22px 22px',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: isMobile ? '1.4rem' : '1.7rem',
                                fontWeight: 800,
                                color: ACCENT,
                                letterSpacing: '-0.02em',
                                lineHeight: 1,
                                marginBottom: 6,
                            }}
                        >
                            {b.code}
                        </div>
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.58rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.2em',
                                fontWeight: 700,
                                marginBottom: 12,
                            }}
                        >
                            {b.sub}
                        </div>
                        <div style={{ fontSize: '0.88rem', color: TEXT, lineHeight: 1.5 }}>
                            {b.label}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* PERSONAS — who benefits                                             */
/* =================================================================== */

function Personas({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const personas = [
        {
            icon: <Zap size={22} />,
            label: 'TRIO FLEET · CUSTOMER #1',
            title: 'It runs our own fleet, first.',
            body: 'Every release ships to Trio EV\'s 100+ cab fleet and the New Town charging hub before anything else. The same platform you\'ll run is the one we run our business on — every Kolkata Monday morning.',
        },
        {
            icon: <Truck size={22} />,
            label: 'PARTNER FLEET OPERATORS',
            title: 'Align charging with shifts.',
            body: 'Schedule charging windows to match driver routes, monitor state-of-charge across the depot, and cut energy costs to the kWh — the same way we do it for Trio.',
        },
        {
            icon: <Building2 size={22} />,
            label: 'COMMERCIAL REAL ESTATE',
            title: 'Perk by day, profit by weekend.',
            body: 'Offer free charging to employees as a workplace amenity, then charge a premium public rate for weekend visitors — separate tariffs, single dashboard.',
        },
        {
            icon: <Globe size={22} />,
            label: 'CPO NETWORKS',
            title: 'From 5 ports to 5,000+.',
            body: 'Scale automated billing, clearing, and payout distribution across a public network — without growing the ops team linearly.',
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 0 }}
        >
            <SectionIndex n="C" label="WHO USES THE APP" />

            <div style={{ marginTop: isMobile ? 24 : 32 }}>
                {personas.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '60px 1.3fr 1.5fr',
                            gap: isMobile ? 12 : 40,
                            padding: isMobile ? '22px 0' : '32px 0',
                            borderTop: `1px solid ${BORDER}`,
                            borderBottom: i === personas.length - 1 ? `1px solid ${BORDER}` : 'none',
                            alignItems: 'start',
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'rgba(0,255,136,0.06)',
                                border: `1px solid ${BORDER_STRONG}`,
                                color: ACCENT,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {p.icon}
                        </div>
                        <div>
                            <div
                                className="mono"
                                style={{
                                    fontSize: '0.62rem',
                                    color: TEXT_DIM,
                                    letterSpacing: '0.22em',
                                    fontWeight: 700,
                                    marginBottom: 10,
                                }}
                            >
                                {p.label}
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? '1.4rem' : 'clamp(1.6rem, 2.6vw, 2.1rem)',
                                    fontWeight: 800,
                                    color: HEADING,
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.05,
                                }}
                            >
                                {p.title}
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: isMobile ? '0.92rem' : '1rem',
                                color: TEXT_DIM,
                                lineHeight: 1.65,
                                margin: 0,
                                maxWidth: 460,
                            }}
                        >
                            {p.body}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* SHARED                                                              */
/* =================================================================== */

function SectionIndex({ n, label }: { n: string; label: string }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <div
            className="mono"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: ACCENT,
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.24em',
            }}
        >
            <span>{n}</span>
            <span style={{ width: 36, height: 1, background: BORDER_STRONG }} />
            <span>{label}</span>
        </div>
    );
}
