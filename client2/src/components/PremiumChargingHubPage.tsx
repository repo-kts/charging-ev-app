import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { useTheme } from '../lib/theme';
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

export function PremiumChargingHubPage({ isMobile, onPrimaryCta, onSecondaryCta }: Props) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.div
            key="premium-charging-hub"
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
            {/* Ambient glow */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-15%',
                    right: '-20%',
                    width: isMobile ? 380 : 780,
                    height: isMobile ? 380 : 780,
                    background: `radial-gradient(circle, ${ACCENT_SOFT}22, transparent 65%)`,
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
                {/* ============ HERO — EDITORIAL ============ */}
                <Hero isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />

                {/* ============ MARQUEE STAT BAND ============ */}
                <StatTicker isMobile={isMobile} />

                {/* ============ 01 — DEDICATED BAYS (asymmetric, no cards) ============ */}
                <DedicatedBays isMobile={isMobile} />

                {/* ============ 02 — CANOPY (full-width band w/ SVG) ============ */}
                <CanopyBand isMobile={isMobile} />

                {/* ============ 03 — AMENITIES (manifest list) ============ */}
                <AmenitiesManifest isMobile={isMobile} />

                {/* ============ 04 — SAFETY (triptych w/ vertical labels) ============ */}
                <SafetyTriptych isMobile={isMobile} />

                {/* ============ CLOSING ============ */}
                <Closing isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
            </div>
        </motion.div>
    );
}

/* =================================================================== */
/* HERO                                                                */
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
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <section style={{ marginBottom: isMobile ? 64 : 120, position: 'relative' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
                    gap: isMobile ? 32 : 48,
                    alignItems: 'end',
                }}
            >
                {/* Left — copy */}
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
                        <span>PREMIUM CHARGING</span>
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: isMobile ? '2rem' : 'clamp(2.8rem, 6vw, 5.2rem)',
                            fontWeight: 800,
                            color: HEADING,
                            margin: 0,
                            marginBottom: 22,
                            letterSpacing: '-0.04em',
                            lineHeight: 0.98,
                        }}
                    >
                        TRIO-EV<br />
                        Charging Hub.
                    </h1>

                    <p
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: isMobile ? '0.98rem' : '1.15rem',
                            color: TEXT_DIM,
                            lineHeight: 1.6,
                            maxWidth: 560,
                            margin: 0,
                            marginBottom: 32,
                            fontWeight: 400,
                        }}
                    >
                        Never wait. Never compromise. A next-generation charging oasis for SUVs,
                        premium electric sedans, and commercial EV fleets — engineered to take care
                        of the vehicle <em style={{ color: TEXT, fontStyle: 'italic' }}>and</em> the driver.
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
                            Locate a hub <ArrowRight size={16} />
                        </button>
                        <button
                            className="btn-ghost"
                            onClick={onSecondaryCta}
                            style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                        >
                            Talk to sales
                        </button>
                    </div>
                </motion.div>

                {/* Right — giant Orbitron readout */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                        position: 'relative',
                        borderLeft: isMobile ? 'none' : `1px solid ${BORDER}`,
                        borderTop: isMobile ? `1px solid ${BORDER}` : 'none',
                        paddingLeft: isMobile ? 0 : 36,
                        paddingTop: isMobile ? 28 : 0,
                    }}
                >
                    <div
                        className="mono"
                        style={{
                            color: TEXT_DIM,
                            fontSize: '0.6rem',
                            letterSpacing: '0.22em',
                            fontWeight: 600,
                            marginBottom: 14,
                        }}
                    >
                        DEDICATED BAY OUTPUT
                    </div>
                    <div
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: isMobile ? '3.4rem' : 'clamp(5rem, 9vw, 9rem)',
                            fontWeight: 800,
                            color: HEADING,
                            lineHeight: 0.9,
                            letterSpacing: '-0.04em',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 8,
                        }}
                    >
                        60
                        <span style={{ color: ACCENT, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>kW</span>
                    </div>
                    <div
                        style={{
                            fontSize: '0.82rem',
                            color: TEXT_DIM,
                            marginTop: 14,
                            maxWidth: 260,
                            lineHeight: 1.55,
                        }}
                    >
                        Full rated DC fast charging — delivered per bay, not shared across the lot.
                    </div>
                    {/* tiny indicator row */}
                    <div
                        className="mono"
                        style={{
                            marginTop: 22,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            color: ACCENT,
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                        }}
                    >
                        <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT, borderRadius: '50%' }} />
                        LIVE / ALL BAYS ONLINE
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* =================================================================== */
/* STAT TICKER — single horizontal band, slash separators              */
/* =================================================================== */

function StatTicker({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const items = [
        { v: '60kW', l: 'DC fast charging' },
        { v: '2×', l: 'CCS2 guns per bay' },
        { v: '24/7', l: 'Security & support' },
        { v: '100%', l: 'Dedicated power' },
        { v: '58mm', l: 'Earthing electrodes' },
    ];
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{
                borderTop: `1px solid ${BORDER}`,
                borderBottom: `1px solid ${BORDER}`,
                padding: isMobile ? '20px 0' : '28px 0',
                marginBottom: isMobile ? 80 : 140,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 16 : 0,
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
            }}
        >
            {items.map((it, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        flex: isMobile ? '0 0 auto' : 1,
                        justifyContent: isMobile ? 'flex-start' : 'center',
                        borderRight: !isMobile && i < items.length - 1 ? `1px solid ${BORDER}` : 'none',
                        paddingRight: isMobile ? 0 : 16,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: isMobile ? '1.4rem' : '1.7rem',
                            fontWeight: 800,
                            color: ACCENT,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {it.v}
                    </span>
                    <span
                        className="mono"
                        style={{
                            fontSize: '0.62rem',
                            color: TEXT_DIM,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {it.l}
                    </span>
                </div>
            ))}
        </motion.div>
    );
}

/* =================================================================== */
/* 01 — DEDICATED BAYS                                                 */
/* Asymmetric: huge "01" + heading on left, paragraph + power-flow on right */
/* =================================================================== */

function DedicatedBays({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 80 : 140, position: 'relative' }}
        >
            <SectionIndex n="01" label="DEDICATED BAYS" />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
                    gap: isMobile ? 24 : 64,
                    alignItems: 'start',
                    marginTop: 24,
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                        fontWeight: 800,
                        color: HEADING,
                        margin: 0,
                        letterSpacing: '-0.035em',
                        lineHeight: 1.02,
                    }}
                >
                    No shared power drops.{' '}
                    <span style={{ color: ACCENT }}>Full wattage, every session.</span>
                </h2>

                <div>
                    <p
                        style={{
                            fontSize: isMobile ? '0.96rem' : '1.05rem',
                            color: TEXT_DIM,
                            lineHeight: 1.65,
                            margin: 0,
                            marginBottom: 28,
                        }}
                    >
                        Most public stations split a single power budget across multiple plugs — so
                        plugging in a second car halves your speed. TRIO-EV allocates a dedicated
                        60kW DC unit to <em style={{ color: TEXT, fontStyle: 'italic' }}>every</em> bay, with dual CCS2 guns ready
                        for SUVs, sedans, and commercial fleet vehicles. From plug-in to session
                        end, you get the full promised wattage.
                    </p>
                    <PowerFlowDiagram isMobile={isMobile} />
                </div>
            </div>
        </motion.section>
    );
}

function PowerFlowDiagram({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    // Animated 3-bay schematic, each bay = pulsing 60kW node
    return (
        <div
            style={{
                background: `linear-gradient(180deg, ${SURFACE}, ${BG})`,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: isMobile ? '20px 18px' : '26px 26px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                className="mono"
                style={{
                    fontSize: '0.6rem',
                    color: TEXT_DIM,
                    letterSpacing: '0.2em',
                    marginBottom: 18,
                }}
            >
                BAY ALLOCATION / LIVE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[0, 1, 2].map((i) => (
                    <div key={i} style={{ position: 'relative' }}>
                        <div
                            style={{
                                height: isMobile ? 56 : 64,
                                borderRadius: 10,
                                background: BG,
                                border: `1px solid ${BORDER_STRONG}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: isMobile ? '1.05rem' : '1.2rem',
                                    fontWeight: 800,
                                    color: ACCENT,
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                60kW
                            </motion.div>
                        </div>
                        <div
                            className="mono"
                            style={{
                                fontSize: '0.55rem',
                                color: TEXT_DIM,
                                letterSpacing: '0.2em',
                                marginTop: 8,
                                textAlign: 'center',
                            }}
                        >
                            BAY 0{i + 1}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="mono"
                style={{
                    fontSize: '0.58rem',
                    color: ACCENT,
                    letterSpacing: '0.2em',
                    marginTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}
            >
                <span className="circle pulse-dot" style={{ width: 5, height: 5, background: ACCENT, color: ACCENT, borderRadius: '50%' }} />
                INDEPENDENT POWER LINES · NO THROTTLING
            </div>
        </div>
    );
}

/* =================================================================== */
/* 02 — CANOPY BAND                                                    */
/* Full-width strip with overlapping SVG canopy outline                */
/* =================================================================== */

function CanopyBand({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 80 : 140, position: 'relative' }}
        >
            <SectionIndex n="02" label="STRUCTURAL CANOPY" />

            <div
                style={{
                    marginTop: 24,
                    position: 'relative',
                    background: `linear-gradient(180deg, ${SURFACE} 0%, ${BG} 100%)`,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 20,
                    padding: isMobile ? '32px 22px 40px' : '56px 56px 72px',
                    overflow: 'hidden',
                }}
            >
                {/* Canopy SVG */}
                <svg
                    aria-hidden
                    viewBox="0 0 1200 240"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: isMobile ? 140 : 220,
                        pointerEvents: 'none',
                        opacity: 0.65,
                    }}
                >
                    <defs>
                        <linearGradient id="canopyG" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.32" />
                            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M0,40 Q600,-40 1200,40 L1200,80 Q600,0 0,80 Z" fill="url(#canopyG)" />
                    <path
                        d="M0,40 Q600,-40 1200,40"
                        fill="none"
                        stroke={ACCENT}
                        strokeOpacity="0.55"
                        strokeWidth="1"
                    />
                    {/* pillars */}
                    {[80, 600, 1120].map((x, i) => (
                        <line
                            key={i}
                            x1={x}
                            x2={x}
                            y1={i === 1 ? 8 : 30}
                            y2={isMobile ? 140 : 220}
                            stroke={ACCENT}
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            strokeDasharray="3 4"
                        />
                    ))}
                </svg>

                <div style={{ position: 'relative', zIndex: 1, paddingTop: isMobile ? 60 : 100 }}>
                    <h2
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                            fontWeight: 800,
                            color: HEADING,
                            margin: 0,
                            marginBottom: 18,
                            letterSpacing: '-0.035em',
                            lineHeight: 1.02,
                            maxWidth: 800,
                        }}
                    >
                        Weather should never{' '}
                        <span style={{ color: ACCENT }}>interrupt your charge.</span>
                    </h2>
                    <p
                        style={{
                            fontSize: isMobile ? '0.96rem' : '1.05rem',
                            color: TEXT_DIM,
                            lineHeight: 1.65,
                            maxWidth: 680,
                            margin: 0,
                            marginBottom: isMobile ? 28 : 40,
                        }}
                    >
                        Every individual charger sits under a heavy-duty structural canopy —
                        purpose-built to shield vehicle, hardware, and driver from the elements.
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                            gap: isMobile ? 18 : 32,
                            borderTop: `1px solid ${BORDER}`,
                            paddingTop: isMobile ? 22 : 28,
                        }}
                    >
                        {[
                            {
                                k: 'A',
                                t: 'Element shielding',
                                d: 'Heavy rain, harsh summer heat, dust — kept off the car, the charger, and you.',
                            },
                            {
                                k: 'B',
                                t: 'Integrated LED',
                                d: 'Bright, built-in canopy lighting for seamless connection at any hour.',
                            },
                            {
                                k: 'C',
                                t: 'Day & night ready',
                                d: 'A consistent, comfortable charging environment — midday glare or midnight rain.',
                            },
                        ].map((row) => (
                            <div key={row.k}>
                                <div
                                    className="mono"
                                    style={{
                                        color: ACCENT,
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.22em',
                                        marginBottom: 8,
                                        fontWeight: 700,
                                    }}
                                >
                                    {row.k} /
                                </div>
                                <div
                                    style={{
                                        fontSize: isMobile ? '1.05rem' : '1.15rem',
                                        fontWeight: 700,
                                        color: TEXT,
                                        marginBottom: 6,
                                        letterSpacing: '-0.015em',
                                    }}
                                >
                                    {row.t}
                                </div>
                                <p
                                    style={{
                                        fontSize: '0.88rem',
                                        color: TEXT_DIM,
                                        lineHeight: 1.6,
                                        margin: 0,
                                    }}
                                >
                                    {row.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* 03 — AMENITIES MANIFEST                                             */
/* Editorial index — typography-driven, hairlines, hover reveal        */
/* =================================================================== */

function AmenitiesManifest({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const rows = [
        {
            n: '01',
            title: 'Driver rest room',
            body: 'Air-conditioned lounge, comfortable seating, quiet — designed for drivers to actually unwind during the charging cycle.',
            meta: 'COMPLIMENTARY',
        },
        {
            n: '02',
            title: 'Gender-segregated washrooms',
            body: 'Premium, hygienic, entirely separate facilities for male and female visitors — maintained to the highest standards.',
            meta: 'ON-SITE',
        },
        {
            n: '03',
            title: 'Pure R.O. drinking water',
            body: 'Continuous access to chilled, safe, Reverse Osmosis purified drinking water — refill as long as you are here.',
            meta: 'UNLIMITED',
        },
        {
            n: '04',
            title: 'Mobile charging stations',
            body: 'Safe charging lockers and multi-port docks within the lounge — power your phone alongside your car.',
            meta: 'MULTI-PORT',
        },
        {
            n: '05',
            title: 'Secure bike parking',
            body: 'A dedicated on-site two-wheeler zone for drivers operating or managing fleet cars at the hub.',
            meta: 'DRIVERS ONLY',
        },
        {
            n: '06',
            title: 'No fees. No tiers.',
            body: 'Every amenity is included with your charging session — no extras, no membership levels, no fine print.',
            meta: 'FOREVER FREE',
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
            <SectionIndex n="03" label="DRIVER HOSPITALITY" />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
                    gap: isMobile ? 24 : 64,
                    marginTop: 24,
                    marginBottom: isMobile ? 32 : 48,
                    alignItems: 'end',
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                        fontWeight: 800,
                        color: HEADING,
                        margin: 0,
                        letterSpacing: '-0.035em',
                        lineHeight: 1.02,
                    }}
                >
                    A fully charged vehicle <span style={{ color: ACCENT }}>deserves a refreshed driver.</span>
                </h2>
                <p
                    style={{
                        fontSize: isMobile ? '0.96rem' : '1.05rem',
                        color: TEXT_DIM,
                        lineHeight: 1.65,
                        margin: 0,
                        maxWidth: 480,
                    }}
                >
                    Six amenities, all complimentary — built into every TRIO-EV Hub. Step out of the
                    car. Step into the lounge.
                </p>
            </div>

            {/* The manifest itself */}
            <div style={{ borderTop: `1px solid ${BORDER}` }}>
                {rows.map((r, i) => (
                    <ManifestRow key={r.n} row={r} delay={i * 0.04} isMobile={isMobile} />
                ))}
            </div>
        </motion.section>
    );
}

function ManifestRow({
    row,
    delay,
    isMobile,
}: {
    row: { n: string; title: string; body: string; meta: string };
    delay: number;
    isMobile: boolean;
}) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ backgroundColor: 'rgba(0,255,136,0.025)' }}
            style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '36px 1fr' : '64px 1fr 1fr 140px',
                gap: isMobile ? 12 : 28,
                alignItems: isMobile ? 'start' : 'center',
                padding: isMobile ? '18px 0' : '26px 4px',
                borderBottom: `1px solid ${BORDER}`,
                transition: 'background-color 220ms ease',
            }}
        >
            <div
                className="mono"
                style={{
                    fontSize: isMobile ? '0.7rem' : '0.78rem',
                    color: ACCENT,
                    letterSpacing: '0.2em',
                    fontWeight: 700,
                    fontFamily: "'Orbitron', sans-serif",
                }}
            >
                {row.n}
            </div>
            <div
                style={{
                    fontSize: isMobile ? '1.05rem' : '1.35rem',
                    fontWeight: 700,
                    color: TEXT,
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif",
                    gridColumn: isMobile ? '2' : 'auto',
                }}
            >
                {row.title}
            </div>
            <p
                style={{
                    fontSize: isMobile ? '0.88rem' : '0.95rem',
                    color: TEXT_DIM,
                    lineHeight: 1.55,
                    margin: 0,
                    gridColumn: isMobile ? '2' : 'auto',
                    marginTop: isMobile ? 6 : 0,
                }}
            >
                {row.body}
            </p>
            {!isMobile && (
                <div
                    className="mono"
                    style={{
                        fontSize: '0.6rem',
                        color: ACCENT,
                        letterSpacing: '0.2em',
                        fontWeight: 700,
                        textAlign: 'right',
                        padding: '4px 10px',
                        border: `1px solid ${BORDER_STRONG}`,
                        borderRadius: 99,
                        justifySelf: 'end',
                    }}
                >
                    {row.meta}
                </div>
            )}
        </motion.div>
    );
}

/* =================================================================== */
/* 04 — SAFETY TRIPTYCH                                                */
/* 3 tall panels with vertical labels, big numerals                    */
/* =================================================================== */

function SafetyTriptych({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const panels = [
        {
            n: '24/7',
            label: 'PERIMETER',
            title: 'Day & night security',
            body: 'Permanently stationed professionals guarding entry, exit, and lounge facilities around the clock.',
        },
        {
            n: '0',
            label: 'BLIND SPOTS',
            title: 'Full CCTV coverage',
            body: 'HD, night-vision cameras across charging bays, lounge, parking, and peripheral boundaries.',
        },
        {
            n: '58mm',
            label: 'EARTHING',
            title: 'Industrial grounding',
            body: 'Chemical earthing electrodes and localized grounding strips absorb surges and protect onboard electronics.',
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
            <SectionIndex n="04" label="360° SAFETY" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 28 : 48,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: HEADING,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 800,
                }}
            >
                Ironclad protection, <span style={{ color: ACCENT }}>at every hour.</span>
            </h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? 14 : 2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 20,
                    overflow: 'hidden',
                    background: BORDER,
                }}
            >
                {panels.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        whileHover={{ backgroundColor: '#0E1310' }}
                        style={{
                            background: BG,
                            padding: isMobile ? '28px 22px' : '40px 32px 48px',
                            position: 'relative',
                            minHeight: isMobile ? 0 : 280,
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'background 220ms ease',
                        }}
                    >
                        {/* vertical label on left */}
                        {!isMobile && (
                            <div
                                className="mono"
                                style={{
                                    position: 'absolute',
                                    top: 32,
                                    left: 18,
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    fontSize: '0.58rem',
                                    color: TEXT_DIM,
                                    letterSpacing: '0.3em',
                                    fontWeight: 700,
                                }}
                            >
                                {p.label}
                            </div>
                        )}
                        <div style={{ paddingLeft: isMobile ? 0 : 28 }}>
                            <div
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: isMobile ? '2.2rem' : '3.2rem',
                                    fontWeight: 800,
                                    color: ACCENT,
                                    letterSpacing: '-0.04em',
                                    lineHeight: 0.9,
                                    marginBottom: isMobile ? 16 : 24,
                                }}
                            >
                                {p.n}
                            </div>
                            {isMobile && (
                                <div
                                    className="mono"
                                    style={{
                                        fontSize: '0.58rem',
                                        color: TEXT_DIM,
                                        letterSpacing: '0.24em',
                                        fontWeight: 700,
                                        marginBottom: 10,
                                    }}
                                >
                                    {p.label}
                                </div>
                            )}
                            <div
                                style={{
                                    fontSize: isMobile ? '1.1rem' : '1.25rem',
                                    fontWeight: 700,
                                    color: TEXT,
                                    letterSpacing: '-0.02em',
                                    marginBottom: 8,
                                }}
                            >
                                {p.title}
                            </div>
                            <p
                                style={{
                                    fontSize: isMobile ? '0.88rem' : '0.92rem',
                                    color: TEXT_DIM,
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {p.body}
                            </p>
                        </div>
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
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
                borderTop: `1px solid ${BORDER}`,
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
                    PULL IN · REFRESH · POWER AHEAD
                </div>
                <h2
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4.2vw, 3.6rem)',
                        fontWeight: 800,
                        color: HEADING,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.02,
                        margin: 0,
                    }}
                >
                    Experience the highest standard of public EV charging.
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
                    Locate your nearest TRIO-EV Charging Hub — or talk to our team about bringing
                    premium charging to your fleet, property, or city.
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
                        Find a hub <ArrowRight size={16} />
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={onSecondaryCta}
                        style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                    >
                        Contact sales
                    </button>
                </div>
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* SHARED: section index header                                        */
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
