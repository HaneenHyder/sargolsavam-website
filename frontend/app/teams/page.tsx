"use client";

import { motion } from "framer-motion";
import { Users, Flame, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const teams = [
    {
        id: "sumud",
        name: "Sumud",
        description: "This name represents the unbreakable Palestinian spirit that stood 26 months of relentless bombardment, siege, and displacement, yet refused to surrender or leave the land.",
        icon: Shield,
        gradient: "from-emerald-500 to-teal-700",
        shadow: "shadow-emerald-500/20",
    },
    {
        id: "thoofan",
        name: "Thoofan",
        description: "The historic defensive operation launched by the Palestinian resistance that shattered Israeli invincibility and reignited the flame of liberation across the globe.",
        icon: Flame,
        gradient: "from-red-500 to-orange-700",
        shadow: "shadow-red-500/20",
    },
    {
        id: "inthisar",
        name: "Inthisar",
        description: "The triumph of people who turned every massacre into greater resolve, every destroyed home into a promise of return, and every martyr into a guarantee that Palestine will be free from the river to the sea.",
        icon: Trophy,
        gradient: "from-amber-400 to-yellow-600",
        shadow: "shadow-amber-500/20",
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
                            Our <span className="text-primary">Teams</span>
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

                                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 relative z-10">
                                    {/* Icon with Glass effect */}
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl rotate-45 flex items-center justify-center shadow-lg group-hover:rotate-0 transition-transform duration-500 border border-white/20">
                                        <team.icon className="w-10 h-10 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>

                                    <div className="space-y-4 w-full">
                                        <h2 className="text-3xl font-bold text-white font-achiko tracking-wide drop-shadow-sm">
                                            {team.name}
                                        </h2>
                                        <div className="w-16 h-1 mx-auto rounded-full bg-white/40" />
                                        <p className="text-white/90 leading-relaxed font-light text-lg">
                                            {team.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
