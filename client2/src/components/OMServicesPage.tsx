import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ArrowDown,
    Wifi,
    Headphones,
    HardHat,
    CalendarCheck,
    AlertTriangle,
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

export function OMServicesPage({ isMobile, onPrimaryCta, onSecondaryCta }: Props) {
    return (
        <motion.div
            key="om-services"
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
                    left: '-15%',
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
                <TierFlow isMobile={isMobile} />
                <CoreOfferings isMobile={isMobile} />
                <SLAMatrix isMobile={isMobile} />
                <WhyChoose isMobile={isMobile} />
                <Closing isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
            </div>
        </motion.div>
    );
}

/* =================================================================== */
/* HERO — copy + circular uptime gauge                                 */
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
                    gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr',
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
                        <span>SERVICE / 05</span>
                        <span style={{ width: 36, height: 1, background: BORDER_STRONG }} />
                        <span>OPERATIONS & MAINTENANCE</span>
                    </div>

                    <h1
                        style={{
                            fontSize: isMobile ? '2.3rem' : 'clamp(2.6rem, 5.4vw, 4.8rem)',
                            fontWeight: 800,
                            color: '#fff',
                            margin: 0,
                            marginBottom: 22,
                            letterSpacing: '-0.04em',
                            lineHeight: 1,
                        }}
                    >
                        Day One is the install.{' '}
                        <span style={{ color: ACCENT }}>Every day after is uptime.</span>
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
                        Hardware-agnostic O&M. 24/7 remote monitoring blended with rapid-response
                        certified field engineering — so your stations are always available, safe,
                        and charging at peak.
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
                            Request an SLA <ArrowRight size={16} />
                        </button>
                        <button
                            className="btn-ghost"
                            onClick={onSecondaryCta}
                            style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                        >
                            Talk to support
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <UptimeGauge isMobile={isMobile} />
                </motion.div>
            </div>
        </section>
    );
}

/* =================================================================== */
/* UPTIME GAUGE — animated SVG ring with center readout                */
/* =================================================================== */

function UptimeGauge({ isMobile }: { isMobile: boolean }) {
    const size = isMobile ? 240 : 320;
    const stroke = 10;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const target = 0.99; // 99% contractual

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                    <linearGradient id="gaugeGrad" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT_SOFT} />
                        <stop offset="100%" stopColor={ACCENT} />
                    </linearGradient>
                </defs>
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={BORDER_STRONG}
                    strokeWidth={stroke}
                />
                {/* Progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${circumference * target} ${circumference}` }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    style={{ filter: `drop-shadow(0 0 8px ${ACCENT}88)` }}
                />
                {/* Tick marks */}
                {Array.from({ length: 60 }).map((_, i) => {
                    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
                    const inner = radius - stroke - 6;
                    const outer = radius - stroke - 2;
                    const x1 = size / 2 + Math.cos(angle) * inner;
                    const y1 = size / 2 + Math.sin(angle) * inner;
                    const x2 = size / 2 + Math.cos(angle) * outer;
                    const y2 = size / 2 + Math.sin(angle) * outer;
                    const isMajor = i % 5 === 0;
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={ACCENT}
                            strokeOpacity={isMajor ? 0.35 : 0.12}
                            strokeWidth={isMajor ? 1.2 : 0.8}
                        />
                    );
                })}
            </svg>

            {/* Center readout */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <div
                    className="mono"
                    style={{
                        fontSize: '0.6rem',
                        color: TEXT_DIM,
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                        marginBottom: 6,
                    }}
                >
                    NETWORK UPTIME TARGET
                </div>
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '3.4rem' : '4.6rem',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.05em',
                        lineHeight: 0.95,
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    ≥97
                    <span style={{ color: ACCENT, fontSize: '0.55em', marginLeft: 4 }}>%</span>
                </div>
                <div
                    className="mono"
                    style={{
                        fontSize: '0.6rem',
                        color: ACCENT,
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                        marginTop: 10,
                    }}
                >
                    CONTRACTUALLY GUARANTEED
                </div>
            </div>
        </div>
    );
}

/* =================================================================== */
/* TIER FLOW — L1 → L2 → L3 escalation                                 */
/* =================================================================== */

function TierFlow({ isMobile }: { isMobile: boolean }) {
    const tiers = [
        {
            n: 'L1',
            icon: <Wifi size={20} />,
            label: 'REMOTE & AUTOMATED',
            title: 'Self-healing diagnostics',
            stat: '60%+',
            statLabel: 'resolved remotely',
            body: 'OCPP backend catches anomalies instantly. Cloud-based reboots and over-the-air firmware patches close most software glitches without anyone leaving a desk.',
        },
        {
            n: 'L2',
            icon: <Headphones size={20} />,
            label: 'TECHNICAL HELPDESK',
            title: 'Expert human triage',
            stat: '< 1hr',
            statLabel: 'remote acknowledgement',
            body: 'A dedicated hotline for site hosts, fleet operators, and drivers with session errors. Real humans, real diagnostics, real fix paths.',
        },
        {
            n: 'L3',
            icon: <HardHat size={20} />,
            label: 'CERTIFIED FIELD ENGINEERS',
            title: 'On-site, with parts',
            stat: '< 24hr',
            statLabel: 'on-site dispatch',
            body: 'Locally deployed, certified electricians arrive with specialised test equipment and replacement parts for physical faults, hardware failures, and electrical trips.',
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
            <SectionIndex n="A" label="TIERED SUPPORT FRAMEWORK" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 48,
                    fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Three lines of defense.{' '}
                <span style={{ color: ACCENT }}>One escalation path.</span>
            </h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr auto 1fr',
                    gap: isMobile ? 14 : 0,
                    alignItems: 'stretch',
                }}
            >
                {tiers.map((t, i) => (
                    <Fragment key={t.n}>
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                            style={{
                                background: `linear-gradient(180deg, ${SURFACE}, ${BG})`,
                                border: `1px solid ${BORDER_STRONG}`,
                                borderRadius: 16,
                                padding: isMobile ? '20px 18px' : '26px 24px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: '-30%',
                                    right: '-15%',
                                    width: 200,
                                    height: 200,
                                    background: `radial-gradient(circle, ${ACCENT}10, transparent 70%)`,
                                    pointerEvents: 'none',
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 18,
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '1.8rem',
                                        color: ACCENT,
                                        fontWeight: 800,
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1,
                                    }}
                                >
                                    {t.n}
                                </div>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: 'rgba(0,255,136,0.06)',
                                        border: `1px solid ${BORDER_STRONG}`,
                                        color: ACCENT,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {t.icon}
                                </div>
                            </div>
                            <div
                                className="mono"
                                style={{
                                    fontSize: '0.6rem',
                                    color: TEXT_DIM,
                                    letterSpacing: '0.22em',
                                    fontWeight: 700,
                                    marginBottom: 8,
                                }}
                            >
                                {t.label}
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? '1.15rem' : '1.25rem',
                                    fontWeight: 700,
                                    color: '#fff',
                                    letterSpacing: '-0.018em',
                                    marginBottom: 14,
                                    lineHeight: 1.2,
                                }}
                            >
                                {t.title}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 8,
                                    marginBottom: 14,
                                    paddingBottom: 14,
                                    borderBottom: `1px solid ${BORDER}`,
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: isMobile ? '1.5rem' : '1.8rem',
                                        fontWeight: 800,
                                        color: ACCENT,
                                        letterSpacing: '-0.03em',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {t.stat}
                                </div>
                                <span
                                    className="mono"
                                    style={{
                                        fontSize: '0.6rem',
                                        color: TEXT_DIM,
                                        letterSpacing: '0.18em',
                                        fontWeight: 700,
                                    }}
                                >
                                    {t.statLabel}
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: isMobile ? '0.88rem' : '0.92rem',
                                    color: TEXT_DIM,
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {t.body}
                            </p>
                        </motion.div>

                        {/* Arrow between tiers */}
                        {i < tiers.length - 1 && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: isMobile ? 4 : 14,
                                    color: ACCENT,
                                    opacity: 0.55,
                                }}
                            >
                                {isMobile ? <ArrowDown size={20} /> : <ArrowRight size={22} />}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* CORE OFFERINGS — Preventive vs Corrective                           */
/* =================================================================== */

function CoreOfferings({ isMobile }: { isMobile: boolean }) {
    const blocks = [
        {
            icon: <CalendarCheck size={22} />,
            tag: 'PREVENTIVE',
            title: 'Scheduled lifecycles',
            lead: 'Regular, systematic checkups that drop failure rates and extend hardware life by up to a decade.',
            items: [
                'Physical integrity audits — enclosures, rust, seals, gaskets',
                'Cable & connector overhauls — pin cleaning, latch tests',
                'Thermal management — filter swap, liquid-cool loop checks',
                'Electrical safety verification — insulation, ground loop, continuity',
            ],
        },
        {
            icon: <AlertTriangle size={22} />,
            tag: 'CORRECTIVE',
            title: 'Rapid emergency repair',
            lead: 'When components fail under field load — we minimise revenue and operational losses.',
            items: [
                'Component swaps — AC/DC modules, controllers, HMIs, terminals',
                'Grid & breaker management — GFCI trips, transformer checks',
                'Panel resets and distribution-side diagnostics',
                'Cable replacement, connector failures, holster damage',
            ],
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
            <SectionIndex n="B" label="CORE OFFERINGS" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 40,
                    fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Proactive prevention.{' '}
                <span style={{ color: ACCENT }}>Rapid correction.</span>
            </h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 14 : 0,
                    border: !isMobile ? `1px solid ${BORDER}` : 'none',
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: !isMobile ? BORDER : 'transparent',
                }}
            >
                {blocks.map((b, i) => (
                    <motion.div
                        key={b.tag}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.1 }}
                        style={{
                            background: BG,
                            padding: isMobile ? '24px 20px' : '36px 32px',
                            border: isMobile ? `1px solid ${BORDER}` : 'none',
                            borderRadius: isMobile ? 16 : 0,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 11,
                                    background: 'rgba(0,255,136,0.06)',
                                    border: `1px solid ${BORDER_STRONG}`,
                                    color: ACCENT,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {b.icon}
                            </div>
                            <span
                                className="mono"
                                style={{
                                    fontSize: '0.62rem',
                                    color: ACCENT,
                                    letterSpacing: '0.22em',
                                    fontWeight: 700,
                                }}
                            >
                                {b.tag}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: isMobile ? '1.4rem' : '1.65rem',
                                fontWeight: 800,
                                color: '#fff',
                                letterSpacing: '-0.025em',
                                lineHeight: 1.1,
                                marginBottom: 10,
                            }}
                        >
                            {b.title}
                        </div>
                        <p
                            style={{
                                fontSize: isMobile ? '0.92rem' : '0.98rem',
                                color: TEXT_DIM,
                                lineHeight: 1.6,
                                margin: 0,
                                marginBottom: 22,
                                maxWidth: 480,
                            }}
                        >
                            {b.lead}
                        </p>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                            }}
                        >
                            {b.items.map((it, j) => (
                                <li
                                    key={j}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 12,
                                        fontSize: isMobile ? '0.88rem' : '0.92rem',
                                        color: TEXT,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span
                                        aria-hidden
                                        style={{
                                            marginTop: 8,
                                            width: 14,
                                            height: 1,
                                            background: ACCENT,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span>{it}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* SLA MATRIX — comparison of tiers                                    */
/* =================================================================== */

function SLAMatrix({ isMobile }: { isMobile: boolean }) {
    const rows = [
        {
            metric: 'Network Uptime Target',
            critical: '≥97% — ≥99% Availability',
            commercial: '≥95% Availability',
        },
        {
            metric: 'Support Window',
            critical: '24/7/365 Coverage',
            commercial: 'Standard business hours (8/5)',
        },
        {
            metric: 'Response Time (TTA)',
            critical: '< 1 hour — remote acknowledgement',
            commercial: '< 4 hours',
        },
        {
            metric: 'On-Site Field Dispatch',
            critical: 'Within 4–24 hours (severity-based)',
            commercial: 'Within 48 business hours',
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
            <SectionIndex n="C" label="SERVICE LEVEL AGREEMENTS" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 40,
                    fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                We don't just promise reliability.{' '}
                <span style={{ color: ACCENT }}>We contract it.</span>
            </h2>

            <div
                style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: SURFACE,
                }}
            >
                {/* Header row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : '1.1fr 1.2fr 1.2fr',
                        background: BG,
                        borderBottom: `1px solid ${BORDER}`,
                    }}
                >
                    {!isMobile && (
                        <div
                            className="mono"
                            style={{
                                padding: '16px 22px',
                                fontSize: '0.6rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.22em',
                                fontWeight: 700,
                            }}
                        >
                            METRIC
                        </div>
                    )}
                    <div
                        style={{
                            padding: isMobile ? '14px 14px' : '16px 22px',
                            borderLeft: !isMobile ? `1px solid ${BORDER}` : 'none',
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.58rem',
                                color: ACCENT,
                                letterSpacing: '0.22em',
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            TIER · CRITICAL
                        </div>
                        <div style={{ fontSize: isMobile ? '0.88rem' : '0.95rem', color: TEXT, fontWeight: 700 }}>
                            Public Hubs · Fleet Depots
                        </div>
                    </div>
                    <div
                        style={{
                            padding: isMobile ? '14px 14px' : '16px 22px',
                            borderLeft: `1px solid ${BORDER}`,
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.58rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.22em',
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            TIER · STANDARD
                        </div>
                        <div style={{ fontSize: isMobile ? '0.88rem' : '0.95rem', color: TEXT, fontWeight: 700 }}>
                            Commercial · Workplace Parking
                        </div>
                    </div>
                </div>

                {/* Rows */}
                {rows.map((r, i) => (
                    <motion.div
                        key={r.metric}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1.2fr 1.2fr',
                            borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : 'none',
                        }}
                    >
                        <div
                            style={{
                                padding: isMobile ? '16px 16px 6px' : '20px 22px',
                                fontSize: isMobile ? '0.78rem' : '0.92rem',
                                color: isMobile ? TEXT_DIM : '#fff',
                                fontWeight: 700,
                                letterSpacing: isMobile ? '0.18em' : '-0.015em',
                                textTransform: isMobile ? 'uppercase' : 'none',
                                fontFamily: isMobile ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                            }}
                        >
                            {r.metric}
                        </div>
                        <div
                            style={{
                                padding: isMobile ? '0 16px 8px' : '20px 22px',
                                fontSize: isMobile ? '0.92rem' : '0.95rem',
                                color: ACCENT,
                                fontWeight: 600,
                                borderLeft: !isMobile ? `1px solid ${BORDER}` : 'none',
                                lineHeight: 1.4,
                            }}
                        >
                            {r.critical}
                        </div>
                        <div
                            style={{
                                padding: isMobile ? '0 16px 16px' : '20px 22px',
                                fontSize: isMobile ? '0.9rem' : '0.95rem',
                                color: TEXT_DIM,
                                borderLeft: !isMobile ? `1px solid ${BORDER}` : 'none',
                                lineHeight: 1.4,
                            }}
                        >
                            {r.commercial}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* WHY CHOOSE — 3 reasons                                              */
/* =================================================================== */

function WhyChoose({ isMobile }: { isMobile: boolean }) {
    const reasons = [
        {
            big: 'Vendor-agnostic.',
            sub: 'Certified across the field',
            body: 'Our certified field engineers are trained to service a diverse mix of Level 2 and ultra-fast DC hardware across major tier-one global manufacturing brands.',
        },
        {
            big: 'Parts on the shelf.',
            sub: 'Localised inventory',
            body: 'We maintain a localised stock of high-wear components — cables, holsters, connectors — to eliminate prolonged supply-chain delays during a breakdown.',
        },
        {
            big: 'Audit-ready.',
            sub: 'Compliance reporting',
            body: 'Automated monthly health indices, MTTR tracking logs, and carbon-offset calculations — ready to drop into stakeholder updates.',
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
            <SectionIndex n="D" label="WHY CHOOSE OUR O&M" />

            <div style={{ marginTop: isMobile ? 24 : 32 }}>
                {reasons.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '60px 1.4fr 1fr',
                            gap: isMobile ? 12 : 48,
                            padding: isMobile ? '24px 0' : '34px 0',
                            borderTop: `1px solid ${BORDER}`,
                            borderBottom: i === reasons.length - 1 ? `1px solid ${BORDER}` : 'none',
                            alignItems: 'start',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: isMobile ? '1rem' : '1.4rem',
                                color: ACCENT,
                                fontWeight: 800,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            0{i + 1}
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
                                {r.sub.toUpperCase()}
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? '1.5rem' : 'clamp(1.7rem, 3vw, 2.4rem)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    letterSpacing: '-0.035em',
                                    lineHeight: 1.05,
                                }}
                            >
                                {r.big}
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
                            {r.body}
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
                    MONITORED · DISPATCHED · RESOLVED
                </div>
                <h2
                    style={{
                        fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 4.2vw, 3.6rem)',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.02,
                        margin: 0,
                    }}
                >
                    Hand the network over. Keep the uptime.
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
                    Share your network size, hardware mix, and uptime requirement. We'll send a
                    tailored SLA and a 90-day onboarding plan.
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
                        Request an SLA <ArrowRight size={16} />
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={onSecondaryCta}
                        style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                    >
                        Email support
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
