import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ACCENT = '#00FF88';
const ACCENT_SOFT = '#00CC77';
const BG = '#0B0F0D';
const SURFACE = '#111715';
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
                paddingBottom: isMobile ? 80 : 140,
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
                <CapabilityConsole isMobile={isMobile} />
                <Compliance isMobile={isMobile} />
                <Personas isMobile={isMobile} />
                <Closing isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
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
    onSecondaryCta,
}: {
    isMobile: boolean;
    onPrimaryCta?: () => void;
    onSecondaryCta?: () => void;
}) {
    return (
        <section style={{ marginBottom: isMobile ? 64 : 120 }}>
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            color: ACCENT,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.24em',
                            marginBottom: 28,
                        }}
                    >
                        <span>CHARGE POINT MANAGEMENT</span>
                    </div>

                    <h1
                        style={{
                            fontSize: isMobile ? '2rem' : 'clamp(2.6rem, 5.4vw, 4.8rem)',
                            fontWeight: 800,
                            color: '#fff',
                            margin: 0,
                            marginBottom: 22,
                            letterSpacing: '-0.04em',
                            lineHeight: 1,
                            maxWidth: 1100,
                        }}
                    >
                        Great hardware is half the job.{' '}
                        <span style={{ color: ACCENT }}>This is the brain.</span>
                    </h1>

                    <p
                        style={{
                            fontSize: isMobile ? '0.98rem' : '1.15rem',
                            color: TEXT_DIM,
                            lineHeight: 1.6,
                            maxWidth: 620,
                            margin: 0,
                            marginBottom: 32,
                        }}
                    >
                        A cloud CPMS that turns passive electrical hardware into an intelligent,
                        revenue-generating, self-healing energy network — from a single dashboard.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            className="btn-accent"
                            onClick={onPrimaryCta}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                fontSize: '0.92rem',
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

function LiveNetworkPanel({ isMobile }: { isMobile: boolean }) {
    const [chargers, setChargers] = useState(initialChargers);
    const [kw, setKw] = useState(284);

    useEffect(() => {
        const i = setInterval(() => {
            setChargers((prev) => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * next.length);
                const states: ChargerState[] = ['AVAILABLE', 'CHARGING', 'CHARGING', 'RESERVED'];
                next[idx] = { ...next[idx], state: states[Math.floor(Math.random() * states.length)] };
                return next;
            });
            setKw((k) => Math.max(180, Math.min(360, k + Math.floor(Math.random() * 20) - 10)));
        }, 1600);
        return () => clearInterval(i);
    }, []);

    return (
        <div
            style={{
                background: SURFACE,
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 30px 80px ${ACCENT}10`,
            }}
        >
            {/* Console header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: `1px solid ${BORDER}`,
                    background: BG,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: `${ACCENT}55`,
                                }}
                            />
                        ))}
                    </div>
                    <span
                        className="mono"
                        style={{
                            fontSize: '0.6rem',
                            color: TEXT_DIM,
                            letterSpacing: '0.22em',
                            fontWeight: 700,
                        }}
                    >
                        TRIO-CPMS · OPERATOR CONSOLE
                    </span>
                </div>
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="mono"
                    style={{
                        fontSize: '0.55rem',
                        color: ACCENT,
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                    }}
                >
                    ● LIVE
                </motion.span>
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

function CapabilityConsole({ isMobile }: { isMobile: boolean }) {
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
            style={{ marginBottom: isMobile ? 80 : 140 }}
        >
            <SectionIndex n="A" label="CORE CAPABILITIES" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 40,
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Four modules.{' '}
                <span style={{ color: ACCENT }}>One control plane.</span>
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
                                color: '#fff',
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
            style={{ marginBottom: isMobile ? 80 : 140 }}
        >
            <SectionIndex n="B" label="TECHNICAL & COMPLIANCE" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 24 : 36,
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Built on open standards.{' '}
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
    const personas = [
        {
            icon: <Truck size={22} />,
            label: 'FLEET MANAGERS',
            title: 'Align charging with shifts.',
            body: 'Schedule windows to match driver routes, monitor state-of-charge, and cut depot energy costs to the kWh.',
        },
        {
            icon: <Building2 size={22} />,
            label: 'COMMERCIAL REAL ESTATE',
            title: 'Perk by day, profit by weekend.',
            body: 'Offer free charging to employees as a workplace amenity, then charge a premium public rate for weekend visitors.',
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
            style={{ marginBottom: isMobile ? 80 : 140 }}
        >
            <SectionIndex n="C" label="WHO BENEFITS" />

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
                                    color: '#fff',
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
/* CLOSING                                                             */
/* =================================================================== */

function Closing({
    isMobile,
    onPrimaryCta,
    onSecondaryCta,
}: {
    isMobile: boolean;
    onPrimaryCta?: () => void;
    onSecondaryCta?: () => void;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
                paddingTop: isMobile ? 48 : 80,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
                gap: isMobile ? 24 : 64,
                alignItems: 'end',
            }}
        >
            <div>
                <div
                    className="mono"
                    style={{
                        color: ACCENT,
                        fontSize: '0.65rem',
                        letterSpacing: '0.24em',
                        fontWeight: 700,
                        marginBottom: 18,
                    }}
                >
                    ONE DASHBOARD · EVERY PORT · EVERY POLICY
                </div>
                <h2
                    style={{
                        fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4.2vw, 3.6rem)',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.02,
                        margin: 0,
                    }}
                >
                    See your network the way an operator should.
                </h2>
            </div>
            <div>
                <p
                    style={{
                        fontSize: isMobile ? '0.95rem' : '1.02rem',
                        color: TEXT_DIM,
                        lineHeight: 1.65,
                        marginBottom: 24,
                    }}
                >
                    Book a 30-minute live walkthrough with a Trio CPMS engineer. Bring your network
                    — any brand of charger, any size.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                        className="btn-accent"
                        onClick={onPrimaryCta}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer',
                            fontSize: '0.92rem',
                        }}
                    >
                        Book a demo <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* SHARED                                                              */
/* =================================================================== */

function SectionIndex({ n, label }: { n: string; label: string }) {
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
