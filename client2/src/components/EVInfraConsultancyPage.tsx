import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight,
    Map,
    Cpu,
    FileCheck,
    Wrench,
    Check,
    ChevronDown,
    ChevronUp,
    Calendar,
    Target,
    Activity,
    Info
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

export function EVInfraConsultancyPage({ isMobile, onPrimaryCta, onSecondaryCta }: Props) {
    return (
        <motion.div
            key="ev-infra-consultancy"
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
            {/* Blueprint grid background */}
            <BlueprintGrid />

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

                <Process isMobile={isMobile} />

                <Sectors isMobile={isMobile} />

                <WhyPartner isMobile={isMobile} />

                <Closing isMobile={isMobile} onPrimaryCta={onPrimaryCta} onSecondaryCta={onSecondaryCta} />
            </div>
        </motion.div>
    );
}

/* =================================================================== */
/* BLUEPRINT GRID BACKGROUND                                           */
/* =================================================================== */

function BlueprintGrid() {
    return (
        <>
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(to right, ${ACCENT}08 1px, transparent 1px),
                        linear-gradient(to bottom, ${ACCENT}08 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-15%',
                    left: '-20%',
                    width: 720,
                    height: 720,
                    background: `radial-gradient(circle, ${ACCENT_SOFT}18, transparent 65%)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
        </>
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
    return (
        <section style={{ marginBottom: isMobile ? 72 : 130 }}>
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
                    <span>SERVICE / 02</span>
                    <span style={{ width: 36, height: 1, background: BORDER_STRONG }} />
                    <span>EV INFRA CONSULTANCY</span>
                </div>

                <h1
                    style={{
                        fontSize: isMobile ? '2.3rem' : 'clamp(2.6rem, 5.6vw, 5rem)',
                        fontWeight: 800,
                        color: '#fff',
                        margin: 0,
                        marginBottom: 22,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        maxWidth: 1100,
                    }}
                >
                    From feasibility to first plug-in —{' '}
                    <span style={{ color: ACCENT }}>we engineer the network</span> behind your fleet.
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
                    The transition to EVs isn't about buying new cars — it's about building the
                    powerhouse that keeps them moving. We bridge the gap between your electrification
                    goals and a fully operational, future-proof charging network.
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
                        Book a consultation <ArrowRight size={16} />
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={onSecondaryCta}
                        style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                    >
                        See our process
                    </button>
                </div>

                {/* Hero footer strip */}
                <div
                    style={{
                        marginTop: isMobile ? 40 : 64,
                        borderTop: `1px solid ${BORDER}`,
                        paddingTop: isMobile ? 18 : 24,
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: isMobile ? 12 : 24,
                    }}
                >
                    {[
                        ['VENDOR', 'AGNOSTIC'],
                        ['END-TO-END', 'ACCOUNTABILITY'],
                        ['DATA-DRIVEN', 'MODELING'],
                        ['GRID + GRANT', 'EXPERTISE'],
                    ].map(([a, b], i) => (
                        <div key={i} className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.22em', fontWeight: 700 }}>
                            <div style={{ color: ACCENT }}>{a}</div>
                            <div style={{ color: TEXT_DIM, marginTop: 4 }}>{b}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

/* =================================================================== */
/* PROCESS — Horizontal roadmap with 4 phases                          */
/* =================================================================== */

type ProcessSubTask = {
    title: string;
    desc: string;
    deliverable: string;
};

type ProcessPhase = {
    n: string;
    title: string;
    lead: string;
    duration: string;
    focus: string;
    deliverable: string;
    icon: React.ComponentType<any>;
    subTasks: ProcessSubTask[];
};

function Process({ isMobile }: { isMobile: boolean }) {
    const [activePhaseIndex, setActivePhaseIndex] = React.useState(0);

    const phases: ProcessPhase[] = [
        {
            n: 'P1',
            title: 'Strategic Planning & Feasibility',
            lead: 'Before you dig trenches or buy hardware, you need a roadmap.',
            duration: '2-3 Weeks',
            focus: 'Risk Mitigation & ROI',
            deliverable: 'Feasibility Report & Roadmap',
            icon: Map,
            subTasks: [
                {
                    title: 'Site assessment',
                    desc: 'Physical space inspection, vehicle traffic flow analysis, safety margins, and accessibility optimization.',
                    deliverable: 'Civil layout recommendation map'
                },
                {
                    title: 'Grid capacity analysis',
                    desc: 'Detailed load evaluations and discussions with utilities regarding transformer thresholds and upgrade timelines.',
                    deliverable: 'Power availability confirmation document'
                },
                {
                    title: 'TCO modeling',
                    desc: 'Comprehensive CAPEX/OPEX forecasts, utility demand charge modeling, and localized ROI timeline projections.',
                    deliverable: 'Financial cash flow & pricing simulation models'
                }
            ]
        },
        {
            n: 'P2',
            title: 'Engineering & Technical Design',
            lead: 'Smart engineering for reliability and minimal energy waste.',
            duration: '3-4 Weeks',
            focus: 'Efficiency & Future-Proofing',
            deliverable: 'SLD & Civil Engineering Plans',
            icon: Cpu,
            subTasks: [
                {
                    title: 'Load management & smart charging',
                    desc: 'Configuring dynamic load sharing, peak shaving algorithms, and scheduling limits to prevent grid overloads.',
                    deliverable: 'Load management profile matrices'
                },
                {
                    title: 'Vendor-neutral hardware & software selection',
                    desc: 'Evaluation of OCPP controllers, charger form-factors, and CPMS integrations matched to your specific operational schedule.',
                    deliverable: 'Technical datasheet RFP recommendation package'
                },
                {
                    title: 'Renewable integration',
                    desc: 'Feasibility of incorporating solar PV arrays and Battery Energy Storage Systems (BESS) for microgrid resiliency.',
                    deliverable: 'Hybrid energy network topology blueprints'
                }
            ]
        },
        {
            n: 'P3',
            title: 'Regulatory & Incentives',
            lead: "We handle the red tape so you don't have to.",
            duration: '4-6 Weeks',
            focus: 'Compliance & Subsidy Capture',
            deliverable: 'Approved Permits & Subsidy Grants',
            icon: FileCheck,
            subTasks: [
                {
                    title: 'Permitting & zoning navigation',
                    desc: 'Handling local municipal permit submission, fire safety clearance certificates, and easement zoning approvals.',
                    deliverable: 'Zoning clearances & building permits portfolio'
                },
                {
                    title: 'Grant & subsidy identification',
                    desc: 'Applying for and securing federal, state, and regional EV charging infrastructure grants.',
                    deliverable: 'Submitted grant application packets and tracking status'
                },
                {
                    title: 'Tax credits & utility rebates',
                    desc: 'Maximizing corporate tax breaks and negotiating utility power discount incentives for clean energy usage.',
                    deliverable: 'Utility rebate approvals and compliance sheets'
                }
            ]
        },
        {
            n: 'P4',
            title: 'Deployment & Project Management',
            lead: 'Delivered on time and within budget.',
            duration: '6-8 Weeks',
            focus: 'Quality Control & Timely Launch',
            deliverable: 'Live Charging Station & Commissioning Report',
            icon: Wrench,
            subTasks: [
                {
                    title: 'Utility interconnection liaison',
                    desc: 'Coordinating high-voltage hookups, metering equipment placement, and power turn-on sequences with utilities.',
                    deliverable: 'Utility final inspection certificate & grid tie-in approval'
                },
                {
                    title: 'Contractor supervision',
                    desc: 'On-site technical supervision, quality control auditing, electrical conduit testing, and safety protocols execution.',
                    deliverable: 'Daily site log journals & construction completion photos'
                },
                {
                    title: 'Commissioning & safety testing',
                    desc: 'End-to-end electrical testing, insulation audits, OCPP messaging handshakes, and actual load charge runs.',
                    deliverable: 'Official commissioning certification documents'
                }
            ]
        }
    ];

    const activePhase = phases[activePhaseIndex] || phases[0];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? 80 : 140 }}
        >
            <SectionIndex n="A" label="OUR PROCESS" />

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
                Four phases. <span style={{ color: ACCENT }}>One accountable partner.</span>
            </h2>

            {isMobile ? (
                /* =================================================== */
                /* MOBILE VIEW (VERTICAL ROADMAP ACCORDION)           */
                /* =================================================== */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {phases.map((p, idx) => {
                        const isOpen = activePhaseIndex === idx;
                        const Icon = p.icon;
                        return (
                            <div key={p.n} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                                {/* Vertical line connector */}
                                {idx < phases.length - 1 && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            top: 40, 
                                            bottom: -20, 
                                            left: 19, 
                                            width: 1, 
                                            background: BORDER_STRONG 
                                        }} 
                                    />
                                )}
                                
                                {/* Node circle */}
                                <div 
                                    onClick={() => setActivePhaseIndex(idx)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: isOpen ? '#14271F' : BG,
                                        border: `2px solid ${isOpen ? ACCENT : 'rgba(255, 255, 255, 0.1)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isOpen ? ACCENT : TEXT_DIM,
                                        cursor: 'pointer',
                                        zIndex: 1,
                                        boxShadow: isOpen ? `0 0 10px ${ACCENT}22` : 'none',
                                        transition: 'all 0.25s'
                                    }}
                                >
                                    <Icon size={16} />
                                </div>
                                
                                {/* Content */}
                                <div style={{ flex: 1, paddingTop: 4 }}>
                                    <div 
                                        onClick={() => setActivePhaseIndex(idx)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="mono" style={{ fontSize: '0.65rem', color: ACCENT, letterSpacing: '0.1em' }}>
                                            {p.n} · PHASE
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>{p.title}</span>
                                            <span style={{ color: ACCENT }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                                        </h3>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <p style={{ fontSize: '0.9rem', color: TEXT_DIM, lineHeight: 1.5, margin: '0 0 16px 0' }}>
                                                    {p.lead}
                                                </p>
                                                
                                                {/* Mobile stats panel */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                                                    <div 
                                                        style={{ 
                                                            display: 'grid', 
                                                            gridTemplateColumns: 'repeat(2, 1fr)', 
                                                            gap: 12,
                                                            borderTop: `1px dashed ${BORDER}`,
                                                            borderBottom: `1px dashed ${BORDER}`,
                                                            padding: '12px 0'
                                                        }}
                                                    >
                                                        <div>
                                                            <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>DURATION</div>
                                                            <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{p.duration}</div>
                                                        </div>
                                                        <div>
                                                            <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>PRIMARY FOCUS</div>
                                                            <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{p.focus}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: `1px dashed ${BORDER}`, paddingBottom: 12 }}>
                                                        <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>KEY DELIVERABLE</div>
                                                        <div style={{ fontSize: '0.82rem', color: ACCENT, fontWeight: 600 }}>{p.deliverable}</div>
                                                    </div>
                                                </div>

                                                {/* Mobile checklist */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
                                                    {p.subTasks.map((task, tIdx) => (
                                                        <PhaseTaskCard key={tIdx} task={task} isMobile={true} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* =================================================== */
                /* DESKTOP VIEW (HIGH-TECH DASHBOARD SELECTOR)         */
                /* =================================================== */
                <div>
                    {/* SVG track & Step nodes */}
                    <div style={{ position: 'relative', width: '100%', height: 90, marginBottom: 40 }}>
                        {/* Horizontal running trace line */}
                        <svg style={{ position: 'absolute', top: 22, left: '6%', width: '88%', height: 8 }} aria-hidden>
                            <line x1="0" y1="4" x2="100%" y2="4" stroke="rgba(0, 255, 136, 0.08)" strokeWidth="2" />
                            <motion.line 
                                x1="0" 
                                y1="4" 
                                x2="100%" 
                                y2="4" 
                                stroke={ACCENT} 
                                strokeWidth="2" 
                                strokeDasharray="8 12"
                                animate={{ strokeDashoffset: [-40, 0] }}
                                transition={{ ease: "linear", duration: 5, repeat: Infinity }}
                            />
                        </svg>

                        <div 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '0 6%', 
                                position: 'relative', 
                                zIndex: 2 
                            }}
                        >
                            {phases.map((p, idx) => {
                                const isActive = activePhaseIndex === idx;
                                const Icon = p.icon;
                                return (
                                    <div 
                                        key={p.n} 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            width: 140 
                                        }}
                                    >
                                        {/* Button Circle */}
                                        <button
                                            onClick={() => setActivePhaseIndex(idx)}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                background: isActive ? '#14271F' : '#111715',
                                                border: `2px solid ${isActive ? ACCENT : 'rgba(0, 255, 136, 0.15)'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isActive ? ACCENT : TEXT_DIM,
                                                cursor: 'pointer',
                                                boxShadow: isActive ? `0 0 20px ${ACCENT}35` : 'none',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                outline: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                                                    e.currentTarget.style.color = '#fff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.15)';
                                                    e.currentTarget.style.color = TEXT_DIM;
                                                }
                                            }}
                                        >
                                            <Icon size={18} />
                                        </button>
                                        
                                        {/* Phase details */}
                                        <div 
                                            onClick={() => setActivePhaseIndex(idx)}
                                            style={{ 
                                                marginTop: 10, 
                                                textAlign: 'center', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            <div 
                                                className="mono" 
                                                style={{ 
                                                    fontSize: '0.62rem', 
                                                    fontWeight: 800, 
                                                    color: isActive ? ACCENT : TEXT_DIM,
                                                    letterSpacing: '0.12em'
                                                }}
                                            >
                                                {p.n} · PHASE
                                            </div>
                                            <div 
                                                style={{ 
                                                    fontSize: '0.78rem', 
                                                    fontWeight: 600, 
                                                    color: isActive ? '#fff' : TEXT_DIM, 
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: 130,
                                                    marginTop: 2
                                                }}
                                            >
                                                {p.title.split(' & ')[0]}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Step Content details dashboard */}
                    <div
                        style={{
                            background: 'rgba(17, 23, 21, 0.45)',
                            border: `1px solid ${BORDER}`,
                            borderRadius: 20,
                            padding: 32,
                            backdropFilter: 'blur(16px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePhaseIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.2fr 1.8fr',
                                    gap: 40,
                                    alignItems: 'start',
                                }}
                            >
                                {/* Left workspace panel: Summary & Stats */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'flex-start' }}>
                                    <div>
                                        <div
                                            className="mono"
                                            style={{
                                                color: ACCENT,
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.2em',
                                                marginBottom: 8,
                                            }}
                                        >PHASE_{activePhase.n} // OVERVIEW</div>
                                        <h3
                                            style={{
                                                fontSize: '1.6rem',
                                                fontWeight: 800,
                                                color: '#fff',
                                                margin: 0,
                                                marginBottom: 14,
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.15
                                            }}
                                        >
                                            {activePhase.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: '0.96rem',
                                                color: TEXT_DIM,
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            {activePhase.lead}
                                        </p>
                                    </div>

                                    {/* Parameters grid cards */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {/* Parameter 1: Duration */}
                                        <div
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.01)',
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: 10,
                                                padding: '12px 18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 16,
                                            }}
                                        >
                                            <div style={{ color: ACCENT }}>
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>DURATION</div>
                                                <div className="mono" style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
                                                    {activePhase.duration}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parameter 2: Focus */}
                                        <div
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.01)',
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: 10,
                                                padding: '12px 18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 16,
                                            }}
                                        >
                                            <div style={{ color: ACCENT }}>
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>PRIMARY FOCUS</div>
                                                <div className="mono" style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
                                                    {activePhase.focus}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parameter 3: Deliverable */}
                                        <div
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.01)',
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: 10,
                                                padding: '12px 18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 16,
                                            }}
                                        >
                                            <div style={{ color: ACCENT }}>
                                                <Target size={18} />
                                            </div>
                                            <div>
                                                <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM }}>KEY DELIVERABLE</div>
                                                <div className="mono" style={{ fontSize: '0.85rem', color: ACCENT, fontWeight: 700 }}>
                                                    {activePhase.deliverable}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right workspace panel: checklist items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'flex-start' }}>
                                    <div
                                        className="mono"
                                        style={{
                                            color: TEXT_DIM,
                                            fontSize: '0.62rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.12em',
                                            borderBottom: `1px solid ${BORDER}`,
                                            paddingBottom: 8,
                                        }}
                                    >TASKS & SPECIFICATIONS</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {activePhase.subTasks.map((task, tIdx) => (
                                            <PhaseTaskCard key={tIdx} task={task} isMobile={false} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.section>
    );
}

function PhaseTaskCard({ task, isMobile }: { task: ProcessSubTask; isMobile: boolean }) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${isExpanded ? 'rgba(0, 255, 136, 0.22)' : BORDER}`,
                borderRadius: 12,
                padding: isMobile ? '14px 18px' : '18px 24px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: ACCENT,
                            boxShadow: `0 0 6px ${ACCENT}`,
                        }}
                    />
                    <h4 style={{ fontSize: isMobile ? '0.92rem' : '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                        {task.title}
                    </h4>
                </div>
                <div style={{ color: ACCENT, display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
            
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p style={{ fontSize: '0.88rem', color: TEXT_DIM, lineHeight: 1.5, margin: '0 0 12px 0' }}>
                            {task.desc}
                        </p>
                        <div
                            style={{
                                background: 'rgba(0, 255, 136, 0.02)',
                                border: `1px dashed ${BORDER_STRONG}`,
                                borderRadius: 8,
                                padding: '10px 14px',
                            }}
                        >
                            <div className="mono" style={{ fontSize: '0.58rem', color: TEXT_DIM, marginBottom: 2 }}>EXPECTED DELIVERABLE</div>
                            <div style={{ fontSize: '0.82rem', color: ACCENT, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ display: 'inline-flex', width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                                {task.deliverable}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* =================================================================== */
/* SECTORS — Horizontal ledger rows (Who We Serve)                     */
/* =================================================================== */

function Sectors({ isMobile }: { isMobile: boolean }) {
    const sectors = [
        {
            code: 'CR',
            name: 'Commercial & Retail',
            impact: 'Attract high-spending EV drivers, increase property value, and generate a new revenue stream.',
        },
        {
            code: 'FL',
            name: 'Fleets — Logistics & Transit',
            impact: 'Transition your trucks, vans, or buses seamlessly without disrupting daily delivery schedules.',
        },
        {
            code: 'MU',
            name: 'Multi-Unit Residential (MUD)',
            impact: 'Provide a premium amenity for residents that future-proofs your real estate asset.',
        },
        {
            code: 'MC',
            name: 'Municipalities & Cities',
            impact: 'Develop public charging master plans that align with clean energy mandates and community needs.',
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
            <SectionIndex n="B" label="WHO WE SERVE" />

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
                        fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 4vw, 3.4rem)',
                        fontWeight: 800,
                        color: '#fff',
                        margin: 0,
                        letterSpacing: '-0.035em',
                        lineHeight: 1.02,
                    }}
                >
                    Tailored for every <span style={{ color: ACCENT }}>operational reality.</span>
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
                    The right charging strategy looks different for a retail forecourt, a logistics
                    depot, an apartment tower, and a city block. We design accordingly.
                </p>
            </div>

            {/* Ledger */}
            <div
                style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: SURFACE,
                }}
            >
                {/* Header row */}
                {!isMobile && (
                    <div
                        className="mono"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '90px 1.2fr 2fr',
                            gap: 24,
                            padding: '14px 28px',
                            fontSize: '0.6rem',
                            letterSpacing: '0.22em',
                            color: TEXT_DIM,
                            fontWeight: 700,
                            borderBottom: `1px solid ${BORDER}`,
                            background: BG,
                        }}
                    >
                        <span>CODE</span>
                        <span>SECTOR</span>
                        <span>OUR IMPACT</span>
                    </div>
                )}
                {sectors.map((s, i) => (
                    <motion.div
                        key={s.code}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.06 }}
                        whileHover={{ backgroundColor: 'rgba(0,255,136,0.03)' }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '60px 1fr' : '90px 1.2fr 2fr',
                            gap: isMobile ? 14 : 24,
                            padding: isMobile ? '20px 18px' : '22px 28px',
                            borderBottom: i < sectors.length - 1 ? `1px solid ${BORDER}` : 'none',
                            alignItems: isMobile ? 'start' : 'center',
                            transition: 'background-color 220ms ease',
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: isMobile ? '1rem' : '1.1rem',
                                color: ACCENT,
                                letterSpacing: '0.12em',
                                fontWeight: 800,
                            }}
                        >
                            {s.code}
                        </div>
                        <div
                            style={{
                                fontSize: isMobile ? '1.05rem' : '1.15rem',
                                fontWeight: 700,
                                color: TEXT,
                                letterSpacing: '-0.015em',
                            }}
                        >
                            {s.name}
                        </div>
                        <p
                            style={{
                                fontSize: isMobile ? '0.88rem' : '0.95rem',
                                color: TEXT_DIM,
                                lineHeight: 1.55,
                                margin: 0,
                                gridColumn: isMobile ? '2' : 'auto',
                                marginTop: isMobile ? 4 : 0,
                            }}
                        >
                            {s.impact}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

/* =================================================================== */
/* WHY PARTNER — Stacked numbered statements                           */
/* =================================================================== */

function WhyPartner({ isMobile }: { isMobile: boolean }) {
    const reasons = [
        {
            big: 'Vendor-agnostic.',
            small: 'Expertise meets objectivity',
            body: 'We are entirely vendor-agnostic. Our only priority is designing the best possible system for your specific needs — not selling a particular brand of hardware.',
        },
        {
            big: 'Future-proof.',
            small: 'Built to scale',
            body: 'We build scalability into every project, ensuring your infrastructure can grow as EV adoption increases — no costly retrofits.',
        },
        {
            big: 'Risk mitigated.',
            small: 'Rigorous modeling',
            body: 'Rigorous grid and financial modeling prevent costly surprises down the road. We surface the risks before contractors do.',
        },
        {
            big: 'One throat to choke.',
            small: 'End-to-end accountability',
            body: 'You get a single point of contact from the initial sketch to the first plug-in — no finger-pointing across vendors.',
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
            <SectionIndex n="C" label="WHY PARTNER WITH US" />

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
                            gridTemplateColumns: isMobile ? '1fr' : '70px 1.4fr 1fr',
                            gap: isMobile ? 14 : 48,
                            padding: isMobile ? '24px 0' : '36px 0',
                            borderTop: `1px solid ${BORDER}`,
                            borderBottom: i === reasons.length - 1 ? `1px solid ${BORDER}` : 'none',
                            alignItems: 'start',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: isMobile ? '1rem' : '1.5rem',
                                color: ACCENT,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
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
                                {r.small.toUpperCase()}
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3.2vw, 2.6rem)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    letterSpacing: '-0.035em',
                                    lineHeight: 1.02,
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
                    READY TO ELECTRIFY YOUR OPERATIONS?
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
                    Let's build the infrastructure that powers your growth.
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
                    Contact our expert consultancy team for an initial consultation — site
                    assessment, grid analysis, and a ballpark ROI within two weeks.
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
                        Book consultation <ArrowRight size={16} />
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={onSecondaryCta}
                        style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                    >
                        Email the team
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
