import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../lib/theme';
import {
    ArrowRight,
    Zap,
    Shield,
    Globe,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Check,
    Cpu,
    Info,
    Layers,
    Activity,
    Sliders
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

type BomItem = {
    code: string;
    title: string;
    spec: string;
    desc: string;
    compliance?: string;
    details?: string[];
};

type BomGroup = {
    id: string;
    n: string;
    title: string;
    lead: string;
    items: BomItem[];
    stats?: { label: string; value: string }[];
};

const BOM: BomGroup[] = [
    {
        id: 'core',
        n: '01',
        title: 'Core Charging Hardware',
        lead: 'Foundational power infrastructure for rapid, reliable charging of modern electric vehicles.',
        stats: [
            { label: 'COMPLIANCE', value: 'IEC 61851-23' },
            { label: 'EFFICIENCY', value: '≥ 95% at Load' },
            { label: 'FIRMWARE', value: 'OCPP 1.6J / 2.0.1' }
        ],
        items: [
            {
                code: '1.01',
                title: 'DC Dual-Gun CCS2 Charger',
                spec: '60kW · CCS2 × 2',
                desc: 'Heavy-duty, high-efficiency fast charger with dual CCS2 connectors for simultaneous or sequential fast charging.',
                compliance: 'CE Certified / IEC 61851 compliant',
                details: [
                    'Dual-gun simultaneous output power sharing (30kW + 30kW)',
                    'Smart thermal management & cooling grid integration',
                    'Integrates OCPP 1.6J/2.0.1 for live network monitoring',
                    'Rugged IP54 weather-proof & dust-protected chassis'
                ]
            },
            {
                code: '1.02',
                title: 'Installation, Testing & Commissioning',
                spec: 'TURNKEY',
                desc: 'Full physical deployment, electrical integration, comprehensive safety testing, and firmware configuration for operational readiness.',
                compliance: 'IS 732 Standards / QC Certified',
                details: [
                    'Reinforced civil foundation & base plate anchors erection',
                    'Precision cable terminations & industrial glanding seals',
                    'Comprehensive insulation resistance & earth resistance audits',
                    'OCPP network configuration & server-handshake confirmation'
                ]
            },
        ],
    },
    {
        id: 'power',
        n: '02',
        title: 'Power Distribution & Protection',
        lead: 'Heavy-duty distribution equipment that bridges your main power source to the charging hardware — safely.',
        stats: [
            { label: 'ENCLOSURE', value: 'IP65 Rated' },
            { label: 'SURGE PROT.', value: 'Type 2 SPD' },
            { label: 'STANDARDS', value: 'IEC 61439-1 & 2' }
        ],
        items: [
            {
                code: '2.01',
                title: 'Outdoor ACDB Panel',
                spec: 'IP-RATED',
                desc: 'Supply, installation, and commissioning of an outdoor-rated AC Distribution Board panel.',
                compliance: 'IEC 61439 compliant panels',
                details: [
                    '3-Phase Incomer featuring high-rupturing-capacity MCCB',
                    'Type 2 Surge Protection Device (SPD) protects against spikes',
                    'IP65 dust/waterproof outdoor-rated steel sheet enclosure',
                    'Integrated multi-function digital energy panel meter'
                ]
            },
            {
                code: '2.02',
                title: 'Secure Mounting Frame',
                spec: 'CONCRETE BASE',
                desc: 'Durable outdoor metal enclosure on a dedicated frame, engineered for concrete-foundation mounting — weatherproof and vandalism-protected.',
                compliance: 'IS 875 Structural Wind Code',
                details: [
                    'Hot-dip galvanized heavy-gauge structural steel frame',
                    'Aerodynamically optimized to withstand 150 km/h wind loads',
                    'Pre-machined anchor points for standard civil concrete bases',
                    'Integrated anti-tampering mechanical locks & security hinges'
                ]
            },
        ],
    },
    {
        id: 'cabling',
        n: '03',
        title: 'High-Spec Industrial Cabling',
        lead: 'High-conductivity, heavy-duty cables optimized for continuous high-load power transfer — supplied and laid.',
        stats: [
            { label: 'CONDUCTOR', value: 'Pure Copper (Cu)' },
            { label: 'ARMORING', value: 'Steel Wire Armoured' },
            { label: 'INSULATION', value: 'XLPE / FR-PVC' }
        ],
        items: [
            {
                code: '3.01',
                title: 'Charger ↔ ACDB link',
                spec: '25 sq.mm Cu · FLEX',
                desc: 'Copper flexible cable engineered to handle high-current flexibility between the 60kW charger and the distribution board.',
                compliance: 'IS 694 Flexible Cables',
                details: [
                    'Class 5 high-flexibility annealed copper multi-strand conductors',
                    'Flame-retardant low-smoke (FRLS) insulation barrier',
                    'Configured for up to 120A continuous load delivery',
                    'UV-resistant double sheath for harsh outdoor wiring paths'
                ]
            },
            {
                code: '3.02',
                title: 'Transformer ↔ ACDB link',
                spec: '3.5 sq.mm Al · ARMOURED',
                desc: 'Aluminium armoured cable for heavy-duty mechanical protection and minimal voltage drop on primary power delivery.',
                compliance: 'IS 7098 (Part 1) Standard',
                details: [
                    'Multi-core sector-shaped compact aluminium conductors',
                    'Cross-linked polyethylene (XLPE) heat-tolerant insulation',
                    'Galvanized steel wire armoring provides mechanical protection',
                    'Engineered to minimize voltage drop over longer cable runs'
                ]
            },
            {
                code: '3.03',
                title: 'Canopy lighting link',
                spec: '1.5 sq.mm Cu · FLEX',
                desc: 'Copper flexible cable safely powering integrated canopy LED illumination.',
                compliance: 'BS 6004 Lighting Quality',
                details: [
                    '3-core flexible copper cabling with clean PVC jacket',
                    'Routed safely through dedicated waterproof structural conduits',
                    'FRLS insulated to ensure fire safety within structural channels'
                ]
            },
        ],
    },
    {
        id: 'earthing',
        n: '04',
        title: 'Advanced Chemical Earthing',
        lead: 'Maintenance-free grounding that protects equipment longevity and absorbs electrical surges.',
        stats: [
            { label: 'ELECTRODE', value: 'Dual-Pipe Tech' },
            { label: 'FILLER', value: 'Bentonite Compound' },
            { label: 'STANDARDS', value: 'IEEE 80 / IS 3043' }
        ],
        items: [
            {
                code: '4.01',
                title: 'Chemical Earthing Electrode',
                spec: 'Ø58 mm · 2 m',
                desc: 'Maintenance-free, high-conductivity chemical earthing electrodes providing low-resistance grounding.',
                compliance: 'IEEE 80 Grounding Standards',
                details: [
                    'Dual-pipe technology expands surface area contact with earth',
                    'Pre-filled with proprietary high-conductivity chemical mix',
                    'Corrosion-resistant heavy-zinc coated copper-bonded pipe',
                    'Low impedance output ensures immediate fault current dissipation'
                ]
            },
            {
                code: '4.02',
                title: 'Earthing GI Strip',
                spec: '25 mm × 3 mm',
                desc: 'Galvanized iron strips for robust fault-current paths between the earthing pit and the equipment.',
                compliance: 'IS 2062 Hot-Dip GI',
                details: [
                    '25mm x 3mm hot-dip galvanized structural iron strips',
                    'Thick zinc coating (> 80 microns) prevents rust over decades',
                    'Laid in continuous lengths with secure overlap welding joints'
                ]
            },
            {
                code: '4.03',
                title: 'Earthing Cable',
                spec: '10 sq.mm Cu · GREEN',
                desc: 'Green copper cable for localized equipment grounding across the install.',
                compliance: 'IS 694 Earth Conduit',
                details: [
                    'Bright green-sheathed copper core grounding conductor',
                    'Highly flexible layout allows clean termination on cabinets',
                    'Establishes continuous metal-to-metal bonding for safety'
                ]
            },
        ],
    },
    {
        id: 'canopy',
        n: '05',
        title: 'Custom Protective Canopy & Branding',
        lead: 'Protect the capital investment from the elements — and put your brand on it.',
        stats: [
            { label: 'FINISH', value: 'Powder-Coated MS' },
            { label: 'LIGHTING', value: 'IP65 4000K LED' },
            { label: 'STANDARDS', value: 'IS 800 Steel Design' }
        ],
        items: [
            {
                code: '5.01',
                title: 'Structural Canopy',
                spec: '2650 W × 1200 H × 2250 T × 300 mm',
                desc: 'Custom engineered shelter, dimensioned for a single charging bay with full canopy reach.',
                compliance: 'IS 800 Steel Structural Code',
                details: [
                    'Sturdy mild-steel (MS) square hollow section main frame',
                    'High-impact clear UV-coated polycarbonate roof panels',
                    'Modular bolt-together pre-engineered structure for quick assembly',
                    'Double-coat polyurethane paint matching custom corporate livery'
                ]
            },
            {
                code: '5.02',
                title: 'End-to-End Execution',
                spec: 'TURNKEY',
                desc: 'Complete design, supply, installation, and commissioning of the canopy assembly.',
                compliance: 'Trio Safety & QC Guidelines',
                details: [
                    'Complete structural fabrication and pre-assembly testing',
                    'On-site lifting, precise alignment, and anchor bolt securing',
                    'Seamless coordination with under-ground conduit routings'
                ]
            },
            {
                code: '5.03',
                title: 'Branding & Lighting',
                spec: 'INTEGRATED',
                desc: 'Custom corporate signage and built-in canopy LED infrastructure for 24/7 visibility and safety.',
                compliance: 'IP65 Weatherproof LED Strip',
                details: [
                    'Built-in linear IP65 4000K natural white LED lighting tracks',
                    'Premium acrylic backlit brand signage panel',
                    'Integrated dusk-to-dawn photocell for automated operations'
                ]
            },
        ],
    },
];

export function ChargerSupplyPage({ isMobile, onPrimaryCta, onSecondaryCta }: Props) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const [activeGroupId, setActiveGroupId] = React.useState('core');

    return (
        <motion.div
            key="charger-supply"
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
            {/* Ambient backdrop */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '8%',
                    left: '40%',
                    width: isMobile ? 320 : 680,
                    height: isMobile ? 320 : 680,
                    background: `radial-gradient(circle, ${ACCENT_SOFT}1a, transparent 65%)`,
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

                <SiteDiagram
                    isMobile={isMobile}
                    activeGroupId={activeGroupId}
                    setActiveGroupId={setActiveGroupId}
                />

                <BomLedger
                    isMobile={isMobile}
                    activeGroupId={activeGroupId}
                    setActiveGroupId={setActiveGroupId}
                />

                <WhyIntegrated isMobile={isMobile} />

                <Closing isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
            </div>
        </motion.div>
    );
}

/* =================================================================== */
/* HERO — datasheet header                                             */
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
        <section style={{ marginBottom: isMobile ? 64 : 110 }}>
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
                    <span>SUPPLY · INSTALLATION · COMMISSIONING</span>
                </div>

                <h1
                    style={{
                        fontSize: isMobile ? '2rem' : 'clamp(2.6rem, 5.4vw, 4.8rem)',
                        fontWeight: 800,
                        color: HEADING,
                        margin: 0,
                        marginBottom: 22,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        maxWidth: 1100,
                    }}
                >
                    Turnkey DC fast-charging supply{' '}
                    <span style={{ color: ACCENT }}>down to the last earthing strip.</span>
                </h1>

                <p
                    style={{
                        fontSize: isMobile ? '0.98rem' : '1.15rem',
                        color: TEXT_DIM,
                        lineHeight: 1.6,
                        maxWidth: 720,
                        margin: 0,
                        marginBottom: 32,
                    }}
                >
                    A complete, end-to-end equipment supply and installation package — engineered
                    for high-performance fleet and commercial charging. Core charger, electrical
                    panels, heavy-duty cabling, chemical earthing, and custom canopy. One scope, one
                    accountable team.
                </p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: isMobile ? 36 : 56 }}>
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
                        Request a BOM <ArrowRight size={16} />
                    </button>
                </div>

                {/* Datasheet metadata row */}
                <div
                    style={{
                        borderTop: `1px solid ${BORDER}`,
                        borderBottom: `1px solid ${BORDER}`,
                        padding: isMobile ? '14px 0' : '18px 0',
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)',
                        gap: isMobile ? 12 : 20,
                    }}
                >
                    {[
                        ['DOC', 'TRIO/SUP/60kW'],
                        ['REV', 'A · 2026'],
                        ['SCOPE', '5 SUB-SYSTEMS'],
                        ['LINE ITEMS', '13'],
                        ['STATUS', 'AVAILABLE'],
                    ].map(([k, v], i) => (
                        <div key={i} className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.22em', fontWeight: 700 }}>
                            <div style={{ color: TEXT_DIM, marginBottom: 4 }}>{k}</div>
                            <div style={{ color: ACCENT, fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                                {v}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

/* =================================================================== */
/* SITE DIAGRAM — annotated SVG showing all 5 subsystems               */
/* =================================================================== */
function SiteDiagram({
    isMobile,
    activeGroupId,
    setActiveGroupId,
}: {
    isMobile: boolean;
    activeGroupId: string;
    setActiveGroupId: (id: string) => void;
}) {
    const theme = useTheme();
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = theme;
    const diagramFilter = theme.mode === 'light' ? 'contrast(3) saturate(2.5) brightness(0.55)' : undefined;
    const isSelected = (id: string) => activeGroupId === id;

    const handleSubsystemClick = (id: string) => {
        setActiveGroupId(id);
        const element = document.getElementById('bom-ledger');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 64 : 120 }}
        >
            <SectionIndex n="DIAGRAM" label="SUBSYSTEM LAYOUT" />

            <div
                style={{
                    marginTop: 24,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    padding: isMobile ? '20px 0' : '36px 32px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Faint grid pattern */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                            linear-gradient(to right, ${ACCENT}06 1px, transparent 1px),
                            linear-gradient(to bottom, ${ACCENT}06 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px',
                        pointerEvents: 'none',
                    }}
                />

                {/* MOBILE — compact portrait diagram, fits screen, no scroll */}
                {isMobile && (
                    <MobilePortraitDiagram
                        activeGroupId={activeGroupId}
                        setActiveGroupId={setActiveGroupId}
                    />
                )}

                {/* DESKTOP — wide annotated SVG diagram */}
                {!isMobile && (
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <svg
                            viewBox="-280 -10 1400 470"
                            style={{ width: '100%', height: 'auto', display: 'block', filter: diagramFilter }}
                            aria-hidden
                        >
                            <defs>
                                <linearGradient id="canopyGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.4" />
                                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                                </linearGradient>
                                <filter id="diagramGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.2" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="1.4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <style>{`
                                    @keyframes pulseDot { 0%, 100% { opacity: 0.9; transform-origin: center; } 50% { opacity: 0.4; } }
                                    @keyframes flowDash { to { stroke-dashoffset: -24; } }
                                    @keyframes labelFlicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.78; } }
                                    @keyframes chargeBar { 0% { opacity: 0.15; } 50% { opacity: 1; } 100% { opacity: 0.15; } }
                                    @keyframes chargeFill { 0% { width: 0; } 90%, 100% { width: 44px; } }
                                    .anchor-dot { animation: pulseDot 1.8s ease-in-out infinite; }
                                    .anchor-dot-2 { animation-delay: 0.3s; }
                                    .anchor-dot-3 { animation-delay: 0.6s; }
                                    .anchor-dot-4 { animation-delay: 0.9s; }
                                    .anchor-dot-5 { animation-delay: 1.2s; }
                                    .flow-line { stroke-dasharray: 6 6; animation: flowDash 1.4s linear infinite; }
                                    .ground-flow { stroke-dasharray: 3 5; animation: flowDash 2.2s linear infinite; }
                                    .callout-label { animation: labelFlicker 3.2s ease-in-out infinite; }
                                    .charge-bar { animation: chargeBar 1.6s ease-in-out infinite; }
                                    .charge-fill { animation: chargeFill 3.2s ease-out infinite; transform-origin: left center; }
                                    
                                    .diagram-group {
                                        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                                        cursor: pointer;
                                        opacity: 0.7;
                                    }
                                    .diagram-group:hover, .diagram-group.active {
                                        opacity: 1;
                                    }
                                    .diagram-group.active {
                                        filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.65)) drop-shadow(0 0 3px rgba(0, 255, 136, 0.45));
                                    }
                                `}</style>
                            </defs>

                            {/* === STRUCTURE === */}

                            {/* Group 5: Canopy */}
                            <g className={`diagram-group ${isSelected('canopy') ? 'active' : ''}`} onClick={() => handleSubsystemClick('canopy')}>
                                <path
                                    d="M170,150 Q450,100 730,150 L730,168 Q450,118 170,168 Z"
                                    fill={isSelected('canopy') ? 'url(#canopyGrad)' : 'rgba(255, 255, 255, 0.015)'}
                                    stroke={isSelected('canopy') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                                    strokeOpacity={isSelected('canopy') ? 0.95 : 0.5}
                                    strokeWidth={isSelected('canopy') ? 1.8 : 1.2}
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                                <line x1="180" y1="168" x2="180" y2="340" stroke={ACCENT} strokeOpacity={isSelected('canopy') ? 0.7 : 0.3} strokeWidth="1.2" strokeDasharray="4 4" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="720" y1="168" x2="720" y2="340" stroke={ACCENT} strokeOpacity={isSelected('canopy') ? 0.7 : 0.3} strokeWidth="1.2" strokeDasharray="4 4" style={{ transition: 'all 0.3s ease' }} />
                                <CalloutOrthogonal
                                    index={5}
                                    anchor={[450, 110]}
                                    bend={[180, 50]}
                                    labelAnchor="end"
                                    labelXOffset={-10}
                                    label="05 · CANOPY + LIGHTING"
                                    isActive={isSelected('canopy')}
                                />
                            </g>

                            {/* Ground line & hatches (static decorative elements) */}
                            <line x1="60" y1="340" x2="840" y2="340" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1.2" />
                            {Array.from({ length: 16 }).map((_, i) => (
                                <line
                                    key={i}
                                    x1={70 + i * 50}
                                    y1={340}
                                    x2={62 + i * 50}
                                    y2={348}
                                    stroke={ACCENT}
                                    strokeOpacity="0.3"
                                    strokeWidth="0.8"
                                />
                            ))}

                            {/* Group 1: DC Charger */}
                            <g className={`diagram-group ${isSelected('core') ? 'active' : ''}`} onClick={() => handleSubsystemClick('core')}>
                                <rect
                                    x="400"
                                    y="240"
                                    width="80"
                                    height="100"
                                    fill={isSelected('core') ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.015)'}
                                    stroke={isSelected('core') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                                    strokeOpacity={isSelected('core') ? 0.95 : 0.55}
                                    strokeWidth={isSelected('core') ? 1.8 : 1.2}
                                    rx="4"
                                    style={{ transition: 'all 0.3s ease' }}
                                    filter={isSelected('core') ? 'url(#diagramGlow)' : undefined}
                                />
                                <rect x="414" y="258" width="52" height="14" fill="rgba(0,0,0,0.4)" stroke={ACCENT} strokeOpacity={isSelected('core') ? 0.75 : 0.4} strokeWidth="1" rx="1" style={{ transition: 'all 0.3s ease' }} />
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <rect
                                        key={i}
                                        className="charge-bar"
                                        x={417 + i * 8}
                                        y={261}
                                        width={6}
                                        height={8}
                                        fill={ACCENT}
                                        fillOpacity={isSelected('core') ? 1 : 0.35}
                                        style={{ animationDelay: `${i * 0.18}s` }}
                                    />
                                ))}
                                <rect
                                    className="charge-fill"
                                    x={416}
                                    y={261}
                                    height={8}
                                    fill={ACCENT}
                                    fillOpacity={isSelected('core') ? 0.18 : 0.05}
                                    filter="url(#diagramGlow)"
                                />
                                <circle cx="422" cy="288" r="5" fill={ACCENT} fillOpacity={isSelected('core') ? 0.75 : 0.3} style={{ transition: 'all 0.3s ease' }} />
                                <circle cx="458" cy="288" r="5" fill={ACCENT} fillOpacity={isSelected('core') ? 0.75 : 0.3} style={{ transition: 'all 0.3s ease' }} />
                                <text
                                    x="440"
                                    y="322"
                                    textAnchor="middle"
                                    fontFamily="'Inter', sans-serif"
                                    fontSize="15"
                                    fill={ACCENT}
                                    fillOpacity={isSelected('core') ? 1 : 0.5}
                                    fontWeight="700"
                                    filter={isSelected('core') ? 'url(#textGlow)' : undefined}
                                    style={{ transition: 'all 0.3s ease' }}
                                >
                                    60kW
                                </text>
                                <CalloutOrthogonal
                                    index={1}
                                    anchor={[480, 250]}
                                    bend={[720, 200]}
                                    labelAnchor="start"
                                    labelXOffset={10}
                                    label="01 · DC CHARGER"
                                    isActive={isSelected('core')}
                                />
                            </g>

                            {/* Group 2: ACDB Panel */}
                            <g className={`diagram-group ${isSelected('power') ? 'active' : ''}`} onClick={() => handleSubsystemClick('power')}>
                                <rect
                                    x="600"
                                    y="262"
                                    width="68"
                                    height="78"
                                    fill={isSelected('power') ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.015)'}
                                    stroke={isSelected('power') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                                    strokeOpacity={isSelected('power') ? 0.95 : 0.55}
                                    strokeWidth={isSelected('power') ? 1.8 : 1.2}
                                    rx="3"
                                    style={{ transition: 'all 0.3s ease' }}
                                    filter={isSelected('power') ? 'url(#diagramGlow)' : undefined}
                                />
                                <line x1="600" y1="282" x2="668" y2="282" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.7 : 0.3} strokeWidth="1" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="600" y1="302" x2="668" y2="302" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.7 : 0.3} strokeWidth="1" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="600" y1="322" x2="668" y2="322" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.7 : 0.3} strokeWidth="1" style={{ transition: 'all 0.3s ease' }} />
                                <CalloutOrthogonal
                                    index={2}
                                    anchor={[668, 300]}
                                    bend={[840, 300]}
                                    labelAnchor="start"
                                    labelXOffset={10}
                                    label="02 · ACDB PANEL"
                                    isActive={isSelected('power')}
                                />
                            </g>

                            {/* Group 3: Cabling */}
                            <g className={`diagram-group ${isSelected('cabling') ? 'active' : ''}`} onClick={() => handleSubsystemClick('cabling')}>
                                <path
                                    className="flow-line"
                                    d="M480,310 Q540,322 600,310"
                                    stroke={ACCENT}
                                    strokeOpacity={isSelected('cabling') ? 0.95 : 0.45}
                                    strokeWidth={isSelected('cabling') ? 2.2 : 1.5}
                                    fill="none"
                                    filter={isSelected('cabling') ? 'url(#diagramGlow)' : undefined}
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                                <path
                                    className="ground-flow"
                                    d="M250,345 L320,345 L380,320 L400,320"
                                    stroke={ACCENT}
                                    strokeOpacity={isSelected('cabling') ? 0.9 : 0.4}
                                    strokeWidth={isSelected('cabling') ? 1.8 : 1.2}
                                    fill="none"
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                                <CalloutOrthogonal
                                    index={3}
                                    anchor={[540, 320]}
                                    bend={[760, 410]}
                                    labelAnchor="start"
                                    labelXOffset={10}
                                    label="03 · CABLING"
                                    isActive={isSelected('cabling')}
                                />
                            </g>

                            {/* Group 4: Earthing */}
                            <g className={`diagram-group ${isSelected('earthing') ? 'active' : ''}`} onClick={() => handleSubsystemClick('earthing')}>
                                <circle
                                    cx="250"
                                    cy="355"
                                    r="10"
                                    fill={isSelected('earthing') ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.015)'}
                                    stroke={isSelected('earthing') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                                    strokeOpacity={isSelected('earthing') ? 0.95 : 0.55}
                                    strokeWidth="1.2"
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                                <line x1="250" y1="365" x2="250" y2="395" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.95 : 0.55} strokeWidth="1.4" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="240" y1="395" x2="260" y2="395" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.95 : 0.55} strokeWidth="1.4" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="244" y1="400" x2="256" y2="400" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.75 : 0.4} strokeWidth="1.2" style={{ transition: 'all 0.3s ease' }} />
                                <line x1="248" y1="405" x2="252" y2="405" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.6 : 0.3} strokeWidth="1.2" style={{ transition: 'all 0.3s ease' }} />
                                <CalloutOrthogonal
                                    index={4}
                                    anchor={[250, 395]}
                                    bend={[180, 425]}
                                    labelAnchor="end"
                                    labelXOffset={-10}
                                    label="04 · EARTHING"
                                    isActive={isSelected('earthing')}
                                />
                            </g>
                        </svg>
                    </div>
                )}
            </div>
        </motion.section>
    );
}

/* MOBILE — portrait diagram that fits a phone screen with no scrolling */
function MobilePortraitDiagram({
    activeGroupId,
    setActiveGroupId,
}: {
    activeGroupId: string;
    setActiveGroupId: (id: string) => void;
}) {
    const theme = useTheme();
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = theme;
    const diagramFilter = theme.mode === 'light' ? 'contrast(3) saturate(2.5) brightness(0.55)' : undefined;
    const isSelected = (id: string) => activeGroupId === id;

    const handleSubsystemClick = (id: string) => {
        setActiveGroupId(id);
        const element = document.getElementById('bom-ledger');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    return (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 8px' }}>
            {/* SVG Visual Explorer */}
            <div
                style={{
                    position: 'relative',
                    background: SURFACE,
                    borderRadius: 12,
                    border: `1px solid rgba(0, 255, 136, 0.04)`,
                    padding: '8px',
                    marginBottom: 12,
                    boxShadow: 'inset 0 0 16px rgba(0, 255, 136, 0.02)',
                }}
            >
                <svg viewBox="0 0 360 260" style={{ width: '100%', height: 'auto', display: 'block', filter: diagramFilter }} aria-hidden>
                    <defs>
                        <linearGradient id="mCanopyGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                        </linearGradient>
                        <filter id="mDiagramGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <style>{`
                            @keyframes mFlowDash { to { stroke-dashoffset: -12; } }
                            @keyframes mPulseEarthing { 0% { r: 9; opacity: 0.9; } 100% { r: 18; opacity: 0; } }
                            @keyframes mChargeBar { 0% { opacity: 0.15; } 50% { opacity: 1; } 100% { opacity: 0.15; } }
                            .m-flow-line { stroke-dasharray: 4 4; animation: mFlowDash 0.8s linear infinite; }
                            .m-pulse-ring { animation: mPulseEarthing 1.5s ease-out infinite; transform-origin: 90px 210px; }
                            .m-charge-bar { animation: mChargeBar 1.2s ease-in-out infinite; }
                            
                            .m-diagram-group {
                                transition: all 0.3s ease;
                                cursor: pointer;
                                opacity: 0.55;
                            }
                            .m-diagram-group:hover, .m-diagram-group.active {
                                opacity: 1;
                            }
                            .m-diagram-group.active {
                                filter: drop-shadow(0 0 7px rgba(0, 255, 136, 0.75)) drop-shadow(0 0 2px rgba(0, 255, 136, 0.5));
                            }
                        `}</style>
                    </defs>

                    {/* Ground line */}
                    <line x1="20" y1="200" x2="340" y2="200" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.2" />
                    {Array.from({ length: 9 }).map((_, i) => (
                        <line key={i} x1={36 + i * 36} y1={200} x2={28 + i * 36} y2={208} stroke={ACCENT} strokeOpacity="0.25" strokeWidth="0.8" />
                    ))}

                    {/* === GROUP 5: CANOPY & PILLARS === */}
                    <g className={`m-diagram-group ${isSelected('canopy') ? 'active' : ''}`} onClick={() => handleSubsystemClick('canopy')}>
                        {/* Interactive transparent tap helper */}
                        <rect x="40" y="20" width="280" height="60" fill="transparent" />
                        {/* Structural canopy roof */}
                        <path
                            d="M50,55 Q180,25 310,55 L310,67 Q180,37 50,67 Z"
                            fill={isSelected('canopy') ? 'url(#mCanopyGrad)' : 'rgba(255, 255, 255, 0.025)'}
                            stroke={isSelected('canopy') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                            strokeWidth={isSelected('canopy') ? 1.8 : 1.2}
                            filter={isSelected('canopy') ? 'url(#mDiagramGlow)' : undefined}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Canopy pillars */}
                        <line x1="62" y1="67" x2="62" y2="200" stroke={ACCENT} strokeOpacity={isSelected('canopy') ? 0.7 : 0.3} strokeWidth="1" strokeDasharray="3 3" style={{ transition: 'all 0.3s ease' }} />
                        <line x1="298" y1="67" x2="298" y2="200" stroke={ACCENT} strokeOpacity={isSelected('canopy') ? 0.7 : 0.3} strokeWidth="1" strokeDasharray="3 3" style={{ transition: 'all 0.3s ease' }} />
                    </g>

                    {/* === GROUP 1: DC CHARGER === */}
                    <g className={`m-diagram-group ${isSelected('core') ? 'active' : ''}`} onClick={() => handleSubsystemClick('core')}>
                        {/* Interactive transparent tap helper */}
                        <rect x="128" y="105" width="82" height="105" fill="transparent" />
                        {/* Main cabinet */}
                        <rect
                            x="138"
                            y="115"
                            width="62"
                            height="85"
                            fill={isSelected('core') ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.025)'}
                            stroke={isSelected('core') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                            strokeWidth={isSelected('core') ? 1.8 : 1.2}
                            rx="4"
                            filter={isSelected('core') ? 'url(#mDiagramGlow)' : undefined}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Display frame */}
                        <rect x="150" y="128" width="38" height="12" fill="rgba(0, 0, 0, 0.4)" stroke={ACCENT} strokeOpacity={isSelected('core') ? 0.75 : 0.4} strokeWidth="0.8" rx="1" style={{ transition: 'all 0.3s ease' }} />
                        {/* Staggered LED charging indicator lights */}
                        {isSelected('core') ? (
                            [0, 1, 2, 3].map((i) => (
                                <rect
                                    key={i}
                                    className="m-charge-bar"
                                    x={154 + i * 5}
                                    y={131}
                                    width={3}
                                    height={6}
                                    fill={ACCENT}
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))
                        ) : (
                            <rect x="154" y="131" width="30" height="6" fill={ACCENT} fillOpacity="0.2" />
                        )}
                        <circle cx="157" cy="154" r="3.5" fill={ACCENT} fillOpacity={isSelected('core') ? 0.75 : 0.3} style={{ transition: 'all 0.3s ease' }} />
                        <circle cx="181" cy="154" r="3.5" fill={ACCENT} fillOpacity={isSelected('core') ? 0.75 : 0.3} style={{ transition: 'all 0.3s ease' }} />
                        <text
                            x="169"
                            y="182"
                            textAnchor="middle"
                            fontFamily="'Inter', sans-serif"
                            fontSize="10"
                            fill={ACCENT}
                            fontWeight="700"
                            style={{ letterSpacing: '0.02em', transition: 'all 0.3s ease' }}
                            fillOpacity={isSelected('core') ? 1 : 0.5}
                        >
                            60kW
                        </text>
                    </g>

                    {/* === GROUP 2: ACDB PANEL === */}
                    <g className={`m-diagram-group ${isSelected('power') ? 'active' : ''}`} onClick={() => handleSubsystemClick('power')}>
                        {/* Interactive transparent tap helper */}
                        <rect x="210" y="120" width="74" height="90" fill="transparent" />
                        <rect
                            x="220"
                            y="130"
                            width="54"
                            height="70"
                            fill={isSelected('power') ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.025)'}
                            stroke={isSelected('power') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                            strokeWidth={isSelected('power') ? 1.8 : 1.2}
                            rx="3"
                            filter={isSelected('power') ? 'url(#mDiagramGlow)' : undefined}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        <line x1="220" y1="147" x2="274" y2="147" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.75 : 0.4} strokeWidth="0.8" style={{ transition: 'all 0.3s ease' }} />
                        <line x1="220" y1="164" x2="274" y2="164" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.75 : 0.4} strokeWidth="0.8" style={{ transition: 'all 0.3s ease' }} />
                        <line x1="220" y1="181" x2="274" y2="181" stroke={ACCENT} strokeOpacity={isSelected('power') ? 0.75 : 0.4} strokeWidth="0.8" style={{ transition: 'all 0.3s ease' }} />
                    </g>

                    {/* === GROUP 4: EARTHING === */}
                    <g className={`m-diagram-group ${isSelected('earthing') ? 'active' : ''}`} onClick={() => handleSubsystemClick('earthing')}>
                        {/* Interactive transparent tap helper */}
                        <rect x="70" y="195" width="40" height="65" fill="transparent" />
                        {/* Pulsing ring under ground */}
                        {isSelected('earthing') && (
                            <circle cx="90" cy="210" className="m-pulse-ring" fill="none" stroke={ACCENT} strokeOpacity="0.85" strokeWidth="1.2" />
                        )}
                        <circle
                            cx="90"
                            cy="210"
                            r="9"
                            fill={isSelected('earthing') ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.025)'}
                            stroke={isSelected('earthing') ? ACCENT : 'rgba(0, 255, 136, 0.25)'}
                            strokeWidth={isSelected('earthing') ? 1.8 : 1.2}
                            filter={isSelected('earthing') ? 'url(#mDiagramGlow)' : undefined}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        <line x1="90" y1="219" x2="90" y2="242" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.95 : 0.55} strokeWidth="1.2" style={{ transition: 'all 0.3s ease' }} />
                        <line x1="81" y1="242" x2="99" y2="242" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.95 : 0.55} strokeWidth="1.2" style={{ transition: 'all 0.3s ease' }} />
                        <line x1="84" y1="246" x2="96" y2="246" stroke={ACCENT} strokeOpacity={isSelected('earthing') ? 0.75 : 0.4} strokeWidth="1" style={{ transition: 'all 0.3s ease' }} />
                    </g>

                    {/* === GROUP 3: CABLING === */}
                    <g className={`m-diagram-group ${isSelected('cabling') ? 'active' : ''}`} onClick={() => handleSubsystemClick('cabling')}>
                        {/* Transparent touch lines to capture click */}
                        <path d="M200,165 Q210,172 220,165" stroke="transparent" strokeWidth="20" fill="none" />
                        <path d="M90,210 L120,210 L132,185 L138,185" stroke="transparent" strokeWidth="20" fill="none" />
                        <path d="M260,130 L260,95 L285,95 L285,62" stroke="transparent" strokeWidth="20" fill="none" />
                        
                        {/* Cable charger <-> ACDB */}
                        <path
                            className={isSelected('cabling') ? 'm-flow-line' : undefined}
                            d="M200,165 Q210,172 220,165"
                            stroke={ACCENT}
                            strokeWidth={isSelected('cabling') ? 2 : 1.3}
                            strokeOpacity={isSelected('cabling') ? 0.95 : 0.55}
                            fill="none"
                            filter={isSelected('cabling') ? 'url(#mDiagramGlow)' : undefined}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Cable earthing <-> charger */}
                        <path
                            d="M90,210 L120,210 L132,185 L138,185"
                            stroke={ACCENT}
                            strokeWidth={isSelected('cabling') ? 1.8 : 1.1}
                            strokeOpacity={isSelected('cabling') ? 0.9 : 0.45}
                            strokeDasharray="2 3"
                            fill="none"
                            style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Cable ACDB <-> Canopy lighting */}
                        <path
                            d="M260,130 L260,95 L285,95 L285,62"
                            stroke={ACCENT}
                            strokeWidth={isSelected('cabling') ? 1.8 : 1.1}
                            strokeOpacity={isSelected('cabling') ? 0.9 : 0.45}
                            strokeDasharray="3 3"
                            fill="none"
                            style={{ transition: 'all 0.3s ease' }}
                        />
                    </g>
                </svg>
            </div>
            {/* Caption */}
            <div
                style={{
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    color: TEXT_DIM,
                    marginTop: 10,
                    marginBottom: 6,
                    fontStyle: 'italic',
                }}
            >
                Tap diagram components to view detailed specifications below.
            </div>
        </div>
    );
}

function CalloutOrthogonal({
    anchor,
    bend,
    labelAnchor,
    labelXOffset,
    label,
    index = 1,
    isActive = false,
}: {
    anchor: [number, number];
    bend: [number, number];
    labelAnchor: 'start' | 'end';
    labelXOffset: number;
    label: string;
    index?: number;
    isActive?: boolean;
}) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const [ax, ay] = anchor;
    const [bx, by] = bend;
    const stubLength = 110;
    const stubX = labelAnchor === 'start' ? bx + stubLength : bx - stubLength;
    const labelX = stubX + labelXOffset;
    return (
        <g filter="url(#textGlow)">
            <polyline
                points={`${ax},${ay} ${bx},${by} ${stubX},${by}`}
                fill="none"
                stroke={isActive ? ACCENT : 'rgba(0, 255, 136, 0.35)'}
                strokeWidth="1"
                style={{ transition: 'all 0.3s ease' }}
            />
            <circle
                className={`anchor-dot anchor-dot-${index}`}
                cx={ax}
                cy={ay}
                r={isActive ? 4.5 : 3.5}
                fill={isActive ? ACCENT : 'rgba(0, 255, 136, 0.6)'}
                style={{ transition: 'all 0.3s ease' }}
            />
            <text
                className="callout-label"
                x={labelX}
                y={by + 4}
                textAnchor={labelAnchor}
                fontFamily="'Inter', sans-serif"
                fontSize="16"
                fill={isActive ? ACCENT : TEXT_DIM}
                fontWeight={isActive ? '800' : '500'}
                style={{ letterSpacing: '0.08em', transition: 'all 0.3s ease' }}
            >
                {label}
            </text>
        </g>
    );
}

/* =================================================================== */
/* BOM LEDGER — the 5 groups + their line items                        */
/* =================================================================== */

function BomLedger({
    isMobile,
    activeGroupId,
    setActiveGroupId,
}: {
    isMobile: boolean;
    activeGroupId: string;
    setActiveGroupId: (id: string) => void;
}) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const activeGroup = BOM.find((g) => g.id === activeGroupId) || BOM[0];

    const groupIcons: Record<string, React.ComponentType<any>> = {
        core: Zap,
        power: Shield,
        cabling: Sliders,
        earthing: Globe,
        canopy: Sparkles,
    };

    return (
        <motion.section
            id="bom-ledger"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 64 : 120 }}
        >
            <SectionIndex n="BOM" label="BILL OF MATERIALS" />

            <h2
                style={{
                    marginTop: 24,
                    marginBottom: isMobile ? 32 : 48,
                    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 800,
                    color: HEADING,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    maxWidth: 860,
                }}
            >
                Every component, every spec.{' '}
                <span style={{ color: ACCENT }}>Itemised, supplied, installed.</span>
            </h2>

            {isMobile ? (
                /* ========================================== */
                /* MOBILE LAYOUT                              */
                /* ========================================== */
                <div>
                    {/* Horizontal tabs scrollbar */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            overflowX: 'auto',
                            paddingBottom: 12,
                            marginBottom: 20,
                            scrollbarWidth: 'none',
                            WebkitOverflowScrolling: 'touch',
                            borderBottom: `1px solid ${BORDER}`,
                        }}
                    >
                        {BOM.map((group) => {
                            const isActive = group.id === activeGroupId;
                            return (
                                <button
                                    key={group.id}
                                    onClick={() => setActiveGroupId(group.id)}
                                    style={{
                                        background: isActive ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${isActive ? ACCENT : 'rgba(255, 255, 255, 0.05)'}`,
                                        borderRadius: 8,
                                        padding: '8px 14px',
                                        color: isActive ? HEADING : TEXT_DIM,
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        outline: 'none',
                                    }}
                                >
                                    {group.n} {group.title.split(' ')[0]}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Group Lead Info */}
                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: '0.9rem', color: TEXT_DIM, lineHeight: 1.5, margin: 0, marginBottom: 16 }}>
                            {activeGroup.lead}
                        </p>

                        {activeGroup.stats && (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 10,
                                    borderTop: `1px dashed ${BORDER}`,
                                    borderBottom: `1px dashed ${BORDER}`,
                                    padding: '10px 0',
                                }}
                            >
                                {activeGroup.stats.map((st, idx) => (
                                    <div key={idx} className="mono" style={{ fontSize: '0.58rem' }}>
                                        <div style={{ color: TEXT_DIM, marginBottom: 2 }}>{st.label}</div>
                                        <div style={{ color: ACCENT, fontWeight: 700 }}>{st.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Items list */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeGroupId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                        >
                            {activeGroup.items.map((item) => (
                                <BomCard key={item.code} item={item} isMobile={true} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) : (
                /* ========================================== */
                /* DESKTOP LAYOUT (HIGH-TECH DASHBOARD)      */
                /* ========================================== */
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '320px 1fr',
                        gap: 40,
                        background: SURFACE,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 20,
                        padding: 32,
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                    }}
                >
                    {/* Left Sidebar Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, zIndex: 1 }}>
                        {BOM.map((group) => {
                            const Icon = groupIcons[group.id] || Zap;
                            const isActive = group.id === activeGroupId;
                            return (
                                <button
                                    key={group.id}
                                    onClick={() => setActiveGroupId(group.id)}
                                    style={{
                                        background: isActive ? 'rgba(0, 255, 136, 0.04)' : 'transparent',
                                        border: `1px solid ${isActive ? 'rgba(0, 255, 136, 0.18)' : 'rgba(255, 255, 255, 0.02)'}`,
                                        borderRadius: 12,
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 16,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        color: isActive ? HEADING : TEXT_DIM,
                                        outline: 'none',
                                        width: '100%',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 8,
                                            background: isActive ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isActive ? ACCENT : TEXT_DIM,
                                            transition: 'all 0.25s',
                                            border: `1px solid ${isActive ? 'rgba(0, 255, 136, 0.15)' : 'transparent'}`,
                                        }}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: '0.62rem',
                                                color: isActive ? ACCENT : TEXT_DIM,
                                                letterSpacing: '0.12em',
                                                marginBottom: 2,
                                            }}
                                        >
                                            SYSTEM / {group.n}
                                        </div>
                                        <div style={{ fontSize: '0.92rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                                            {group.title}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {/* System Status Display Card */}
                        <div
                            style={{
                                marginTop: 24,
                                padding: 20,
                                background: 'rgba(0, 255, 136, 0.01)',
                                border: `1px dashed ${BORDER_STRONG}`,
                                borderRadius: 12,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: ACCENT,
                                        boxShadow: `0 0 8px ${ACCENT}`,
                                    }}
                                />
                                <span
                                    className="mono"
                                    style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.12em',
                                        color: ACCENT,
                                    }}
                                >
                                    DIAGNOSTIC STATUS: READY
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                    fontSize: '0.62rem',
                                    color: TEXT_DIM,
                                }}
                                className="mono"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>INSTALLATION</span>
                                    <span style={{ color: HEADING }}>TURNKEY COMPLETE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>CERTIFICATION</span>
                                    <span style={{ color: HEADING }}>INDUSTRIAL GRADE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>WARRANTY</span>
                                    <span style={{ color: HEADING }}>5 YEAR INCLUDED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Subsystem Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
                        <div style={{ marginBottom: 28, borderBottom: `1px solid ${BORDER}`, paddingBottom: 24 }}>
                            <div
                                className="mono"
                                style={{
                                    color: ACCENT,
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    marginBottom: 6,
                                }}
                            >
                                SUBSYSTEM_{activeGroup.n} // DESCRIPTION
                            </div>
                            <p
                                style={{
                                    fontSize: '1.05rem',
                                    color: TEXT,
                                    lineHeight: 1.6,
                                    margin: 0,
                                    opacity: 0.95,
                                    maxWidth: 720,
                                }}
                            >
                                {activeGroup.lead}
                            </p>

                            {activeGroup.stats && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 20,
                                        marginTop: 20,
                                    }}
                                >
                                    {activeGroup.stats.map((st, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                background: SURFACE,
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: 8,
                                                padding: '10px 14px',
                                            }}
                                        >
                                            <div className="mono" style={{ fontSize: '0.6rem', color: TEXT_DIM, marginBottom: 2 }}>
                                                {st.label}
                                            </div>
                                            <div
                                                className="mono"
                                                style={{
                                                    color: ACCENT,
                                                    fontSize: '0.82rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.04em',
                                                }}
                                            >
                                                {st.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Staggered transition layout for items */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeGroupId}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                            >
                                {activeGroup.items.map((item) => (
                                    <BomCard key={item.code} item={item} isMobile={false} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.section>
    );
}

function BomCard({ item, isMobile }: { item: BomItem; isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const hasDetails = !!(item.details && item.details.length > 0);

    return (
        <div
            onClick={() => hasDetails && setIsExpanded(!isExpanded)}
            style={{
                background: SURFACE,
                border: `1px solid ${isExpanded ? 'rgba(0, 255, 136, 0.22)' : BORDER}`,
                borderRadius: 12,
                padding: isMobile ? 16 : 24,
                cursor: hasDetails ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isExpanded ? '0 10px 30px rgba(0, 255, 136, 0.03)' : 'none',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.28)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 136, 0.04)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isExpanded ? 'rgba(0, 255, 136, 0.22)' : BORDER;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                e.currentTarget.style.boxShadow = isExpanded ? '0 10px 30px rgba(0, 255, 136, 0.03)' : 'none';
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 12 : 16,
                    marginBottom: 10,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                        className="mono"
                        style={{
                            fontSize: isMobile ? '0.78rem' : '0.88rem',
                            color: ACCENT,
                            fontWeight: 700,
                            background: 'rgba(0, 255, 136, 0.06)',
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: `1px solid rgba(0, 255, 136, 0.12)`,
                        }}
                    >
                        {item.code}
                    </span>
                    <h4
                        style={{
                            fontSize: isMobile ? '1rem' : '1.15rem',
                            fontWeight: 600,
                            color: HEADING,
                            margin: 0,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {item.title}
                    </h4>
                </div>
                {!isMobile && <SpecTag spec={item.spec} />}
            </div>

            <p
                style={{
                    fontSize: isMobile ? '0.85rem' : '0.92rem',
                    color: TEXT_DIM,
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 720,
                }}
            >
                {item.desc}
            </p>

            {isMobile && (
                <div style={{ marginTop: 12 }}>
                    <SpecTag spec={item.spec} />
                </div>
            )}

            {hasDetails && (
                <div
                    style={{
                        marginTop: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: `1px solid rgba(255, 255, 255, 0.02)`,
                        paddingTop: 12,
                    }}
                >
                    <div
                        className="mono"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: ACCENT,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                        }}
                    >
                        <Info size={13} />
                        <span>{isExpanded ? 'COLLAPSE SPECS' : 'EXPAND SPECIFICATIONS'}</span>
                    </div>
                    <div style={{ color: ACCENT }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            )}

            <AnimatePresence initial={false}>
                {isExpanded && hasDetails && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            style={{
                                marginTop: 16,
                                padding: 16,
                                background: SURFACE,
                                border: `1px solid rgba(0, 255, 136, 0.08)`,
                                borderRadius: 8,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {item.compliance && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 12,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <span
                                        className="mono"
                                        style={{ fontSize: '0.62rem', color: TEXT_DIM, letterSpacing: '0.05em' }}
                                    >
                                        STANDARD COMPLIANCE:
                                    </span>
                                    <span
                                        className="mono"
                                        style={{
                                            fontSize: '0.62rem',
                                            color: ACCENT,
                                            background: 'rgba(0, 255, 136, 0.04)',
                                            border: `1px solid rgba(0, 255, 136, 0.15)`,
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {item.compliance}
                                    </span>
                                </div>
                            )}

                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                }}
                            >
                                {item.details?.map((detail, dIdx) => (
                                    <li
                                        key={dIdx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 10,
                                            fontSize: '0.85rem',
                                            color: TEXT,
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        <span style={{ color: ACCENT, marginTop: 3, flexShrink: 0 }}>
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SpecTag({ spec }: { spec: string }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <span
            className="mono"
            style={{
                display: 'inline-block',
                fontSize: '0.64rem',
                color: ACCENT,
                fontWeight: 700,
                letterSpacing: '0.14em',
                padding: '4px 10px',
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 6,
                background: 'rgba(0, 255, 136, 0.02)',
                whiteSpace: 'nowrap',
            }}
        >
            {spec}
        </span>
    );
}

/* =================================================================== */
/* WHY INTEGRATED — three editorial pillars                            */
/* =================================================================== */

function WhyIntegrated({ isMobile }: { isMobile: boolean }) {
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    const pillars = [
        {
            big: 'Single point of accountability.',
            sub: 'One scope, one team',
            body: 'Charger supply, structural canopy, heavy cabling, and chemical earthing — bundled under one service. No coordination gaps between vendors, no finger-pointing.',
        },
        {
            big: 'Go live faster.',
            sub: 'Engineered for speed',
            body: 'Pre-coordinated procurement and a fixed BOM remove the longest delays on EV installs — vendor selection, spec mismatches, and rework.',
        },
        {
            big: 'Fully compliant.',
            sub: 'Industrial electrical standards',
            body: 'Every subsystem — from 25 sq.mm copper to 58 mm chemical earthing electrodes — is specced and installed to industrial electrical compliance.',
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 64 : 120 }}
        >
            <SectionIndex n="WHY" label="THE INTEGRATED PACKAGE" />

            <div style={{ marginTop: isMobile ? 24 : 32 }}>
                {pillars.map((p, i) => (
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
                            padding: isMobile ? '22px 0' : '34px 0',
                            borderTop: `1px solid ${BORDER}`,
                            borderBottom: i === pillars.length - 1 ? `1px solid ${BORDER}` : 'none',
                            alignItems: 'start',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: isMobile ? '1rem' : '1.4rem',
                                color: ACCENT,
                                fontWeight: 800,
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
                                    textTransform: 'uppercase',
                                }}
                            >
                                {p.sub}
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? '1.5rem' : 'clamp(1.7rem, 3vw, 2.4rem)',
                                    fontWeight: 800,
                                    color: HEADING,
                                    letterSpacing: '-0.035em',
                                    lineHeight: 1.05,
                                }}
                            >
                                {p.big}
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: isMobile ? '0.92rem' : '0.98rem',
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
    const { ACCENT, ACCENT_SOFT, BG, SURFACE, CARD, BORDER, BORDER_STRONG, TEXT, TEXT_DIM, HEADING, ACCENT_ON } = useTheme();
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
                paddingTop: isMobile ? 40 : 64,
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
                    ONE SCOPE · ONE TEAM · ONE GO-LIVE
                </div>
                <h2
                    style={{
                        fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4.2vw, 3.6rem)',
                        fontWeight: 800,
                        color: HEADING,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.02,
                        margin: 0,
                    }}
                >
                    Ready to procure your next charging site?
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
                    Share your site dimensions and load requirements. We'll send a tailored Bill of
                    Materials, turnaround estimate, and a single-point project owner.
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
                        Request a BOM <ArrowRight size={16} />
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
