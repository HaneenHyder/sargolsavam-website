"use client";

import { motion } from "framer-motion";
import { Users, Flame, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";

interface TeamLeader {
    role: string;
    name: string;
    image: string;
}

interface Team {
    id: string;
    name: string;
    description: string;
    icon: any;
    gradient: string;
    shadow: string;
    leaders?: TeamLeader[];
}

const teams: Team[] = [
    {
        id: "sumud",
        name: "Sumud",
        description: "This name represents the unbreakable Palestinian spirit that stood 26 months of relentless bombardment, siege, and displacement, yet refused to surrender or leave the land.",
        icon: Shield,
        gradient: "from-emerald-500 to-teal-700",
        shadow: "shadow-emerald-500/20",
        leaders: [
            { name: "Althaf", role: "Captain", image: "/team-leaders/sumud/captain.jpg" },
            { name: "Nibras", role: "Vice Captain", image: "/team-leaders/sumud/vice.jpg" },
            { name: "Souban Salim", role: "Mentor", image: "/team-leaders/sumud/mentor.jpg" }
        ]
    },
    {
        id: "thoofan",
        name: "Thoofan",
        description: "The historic defensive operation launched by the Palestinian resistance that shattered Israeli invincibility and reignited the flame of liberation across the globe.",
        icon: Flame,
        gradient: "from-red-500 to-orange-700",
        shadow: "shadow-red-500/20",
        leaders: [
            { role: "Captain", name: "Ashik", image: "/team-leaders/thoofan/captain.jpg" },
            { role: "Vice Captain", name: "Mihad Ihsan", image: "/team-leaders/thoofan/vice.jpg" },
            { role: "Mentor", name: "Adil ameen", image: "/team-leaders/thoofan/mentor.jpg" },
        ]
    },
    {
        id: "intisar",
        name: "Intisar",
        description: "The triumph of a people who turned every massacre into resolve, every destroyed home into a promise of return, and martyrdom into unbreakable certainty forever.",
        icon: Trophy,
        gradient: "from-amber-400 to-yellow-600",
        shadow: "shadow-amber-500/20",
        leaders: [
            { name: "Umar Mukthar", role: "Captain", image: "/team-leaders/umar_mukthar.jpg" },
            { name: "Ayman Abdullah", role: "Vice Captain", image: "/team-leaders/ayman_abdullah.jpg" },
            { name: "Faheemul Haque", role: "Mentor", image: "/team-leaders/faheemul_haque.jpg" }
        ]
    }
];

export default function TeamsPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                            Sargolsavam 2025-26
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold font-achiko text-slate-900 tracking-tight">
                            <span className="text-primary">Teams</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-slate-600"
                    >
                        Representing resilience, resistance, and triumph.
                    </motion.p>
                </div>

                {/* Teams Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        >
                            <Card className={`h-full border-0 overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 ${team.shadow} shadow-xl bg-gradient-to-br ${team.gradient}`}>
                                {/* Abstract Pattern overlay */}
                                <div className="absolute inset-0 opacity-10 mix-blend-overlay"
                                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                                </div>

                                <CardContent className="h-full flex flex-col items-center p-8 space-y-8 relative z-10">
                                    {/* Icon with Glass effect */}
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl rotate-45 flex items-center justify-center shadow-lg group-hover:rotate-0 transition-transform duration-500 border border-white/20 shrink-0">
                                        <team.icon className="w-10 h-10 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>

                                    <div className="space-y-4 w-full text-center">
                                        <h2 className="text-3xl font-bold text-white font-achiko tracking-wide drop-shadow-sm">
                                            {team.name}
                                        </h2>
                                        <div className="w-16 h-1 mx-auto rounded-full bg-white/40" />
                                        <p className="text-white/90 leading-relaxed font-light text-lg">
                                            {team.description}
                                        </p>
                                    </div>

                                    {team.leaders && (
                                        <div className="w-full pt-6 border-t border-white/20">
                                            {/* Captain */}
                                            {team.leaders.filter(l => l.role === "Captain").map((leader, i) => (
                                                <div key={`cap-${i}`} className="flex flex-col items-center text-center space-y-2 mb-6">
                                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-xl ring-2 ring-yellow-400/20">
                                                        <img
                                                            src={leader.image}
                                                            alt={leader.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs uppercase tracking-widest font-bold text-yellow-300">
                                                            {leader.role}
                                                        </p>
                                                        <p className="text-sm font-bold text-white leading-tight px-2 bg-white/10 rounded-full py-0.5">
                                                            {leader.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Other Leaders */}
                                            <div className="flex justify-center gap-6">
                                                {team.leaders.filter(l => l.role !== "Captain").map((leader, i) => (
                                                    <div key={i} className="flex flex-col items-center text-center space-y-2">
                                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                                                            <img
                                                                src={leader.image}
                                                                alt={leader.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">
                                                                {leader.role}
                                                            </p>
                                                            <p className="text-xs font-medium text-white leading-tight max-w-[80px]">
                                                                {leader.name.split(' ')[0]}<br />{leader.name.split(' ')[1]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div >
    );
}
