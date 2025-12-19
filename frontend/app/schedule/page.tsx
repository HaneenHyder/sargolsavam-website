'use client';

import { useState, useEffect } from 'react';
import { schedule as defaultSchedule, DaySchedule } from '@/data/schedule';
import { Calendar, Clock, MapPin, Users, Sparkles, Search, X, Loader2, ScrollText, ShieldCheck, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getCategoryColor } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

export default function SchedulePage() {
    const [scheduleData, setScheduleData] = useState<DaySchedule[]>(defaultSchedule);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedStage, setSelectedStage] = useState<string>("all");
    const [selectedEventType, setSelectedEventType] = useState<string>("all");

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Load from API on mount
    useEffect(() => {
        const fetchSchedule = async () => {
            console.log('DEBUG: API_URL is', API_URL);
            try {
                const targetUrl = `${API_URL}/api/schedule`;
                console.log('DEBUG: Fetching', targetUrl);

                const res = await fetch(targetUrl);
                console.log('DEBUG: Response Status:', res.status, res.statusText);

                if (res.ok) {
                    const text = await res.text();
                    console.log('DEBUG: Response Body:', text);

                    if (!text) {
                        throw new Error('Empty response body');
                    }

                    const data = JSON.parse(text);
                    if (data && data.length > 0) {
                        setScheduleData(data);
                    }
                } else {
                    console.error('DEBUG: Response not OK');
                }
            } catch (err) {
                console.error('Failed to fetch schedule, using default:', err);
                // Keep default data on error
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [API_URL]);

    // Filter events based on search query and dropdowns
    const getEventType = (item: string) => {
        const lowerItem = item.toLowerCase();
        if (lowerItem.includes('song') || lowerItem.includes('pattu') || lowerItem.includes('qawwali') || lowerItem.includes('ensemble')) return 'Song';
        if (lowerItem.includes('recitation')) return 'Recitation';
        if (lowerItem.includes('poetry')) return 'Poetry';
        if (lowerItem.includes('speech') || lowerItem.includes('talk') || lowerItem.includes('monologue') || lowerItem.includes('storytelling') || lowerItem.includes('reading') || lowerItem.includes('translation')) return 'Speech/Story';
        if (lowerItem.includes('ceremony')) return 'Ceremony';
        return 'Other';
    };

    const getFilteredEvents = () => {
        let events = scheduleData[selectedDay].events;

        // Filter by Category
        if (selectedCategory !== 'all') {
            events = events.filter(e => e.category === selectedCategory);
        }

        // Filter by Stage
        if (selectedStage !== 'all') {
            events = events.filter(e => e.stage === selectedStage);
        }

        // Filter by Event Type
        if (selectedEventType !== 'all') {
            events = events.filter(e => getEventType(e.item) === selectedEventType);
        }

        // Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            events = events.filter(event =>
                event.item.toLowerCase().includes(query) ||
                event.category.toLowerCase().includes(query)
            );
        }

        return events;
    };

    const isBreakEvent = (item: string) => {
        return item.includes('Scheduled Break');
    };

    const isCeremonyEvent = (item: string) => {
        return item === 'Opening Ceremony' || item === 'Valedictory Ceremony';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary font-achiko mb-4">
                        Event Schedule
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Sargolsavam 2025-26 - Complete program schedule across 3 days
                    </p>
                    <div className="h-1 w-24 bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Day Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {scheduleData.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(index)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedDay === index
                                ? 'bg-primary text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                }`}
                        >
                            <div className="text-sm">{day.day}</div>
                            <div className="text-xs opacity-75 mt-1">
                                {day.date.split(' ').slice(0, 2).join(' ')}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Sub Junior">Sub Junior</SelectItem>
                            <SelectItem value="Group">Group</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="1">Stage 1</SelectItem>
                            <SelectItem value="2">Stage 2</SelectItem>
                            <SelectItem value="3">Stage 3</SelectItem>
                            <SelectItem value="4">Stage 4</SelectItem>
                            <SelectItem value="5">Stage 5</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Event Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Event Types</SelectItem>
                            <SelectItem value="Song">Song</SelectItem>
                            <SelectItem value="Recitation">Recitation</SelectItem>
                            <SelectItem value="Poetry">Poetry</SelectItem>
                            <SelectItem value="Speech/Story">Speech & Story</SelectItem>
                            <SelectItem value="Ceremony">Ceremony</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events, categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Found {getFilteredEvents().length} events matching "{searchQuery}"
                        </p>
                    )}
                </div>

                {/* Schedule Content */}
                <div className="max-w-5xl mx-auto">
                    <Card className="mb-6 bg-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="text-primary" size={24} />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {scheduleData[selectedDay].date}
                                    </h2>
                                    <p className="text-gray-500 text-sm">{scheduleData[selectedDay].day}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Events Timeline */}
                    <div className="space-y-4">
                        {/* Group events by time */}
                        {Object.entries(
                            getFilteredEvents().reduce((acc, event) => {
                                if (!acc[event.time]) acc[event.time] = [];
                                acc[event.time].push(event);
                                return acc;
                            }, {} as Record<string, typeof scheduleData[0]['events']>)
                        ).map(([time, events]) => {
                            const isBreak = events.some(e => isBreakEvent(e.item));
                            const isCeremony = events.some(e => isCeremonyEvent(e.item));

                            return (
                                <Card
                                    key={time}
                                    className={`hover:shadow-lg transition-shadow ${isCeremony
                                        ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300 shadow-lg'
                                        : isBreak
                                            ? 'bg-slate-200 border border-dashed border-slate-400'
                                            : 'bg-white'
                                        }`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Time */}
                                            <div className="md:w-48 flex-shrink-0">
                                                <div className="flex items-center gap-2 text-primary font-semibold">
                                                    <Clock size={18} />
                                                    <span className="text-lg">{time}</span>
                                                </div>
                                            </div>

                                            {/* Events */}
                                            <div className="flex-1 space-y-3">
                                                {events.map((event, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex flex-wrap items-center gap-3 ${idx > 0 ? 'pt-3 border-t border-gray-200' : ''
                                                            }`}
                                                    >
                                                        {event.stage !== '-' && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <MapPin size={16} />
                                                                <span className="text-sm font-medium">{event.stage}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            {isCeremonyEvent(event.item) ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Sparkles size={20} className="text-amber-500" />
                                                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                                                                        {event.item}
                                                                    </span>
                                                                    <Sparkles size={20} className="text-amber-500" />
                                                                </div>
                                                            ) : (
                                                                <span className={`font-semibold ${isBreakEvent(event.item) ? 'text-gray-700' : 'text-gray-900'
                                                                    }`}>
                                                                    {event.item}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {event.category !== '-' && (
                                                            <div className="flex items-center gap-2">
                                                                <Users size={14} className="text-gray-400" />
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                                    {event.category}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4">Category Legend</h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-700"></div>
                            <span className="text-sm text-gray-600">Senior</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-700"></div>
                            <span className="text-sm text-gray-600">Junior</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-700"></div>
                            <span className="text-sm text-gray-600">Sub Junior</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-700"></div>
                            <span className="text-sm text-gray-600">Group</span>
                        </div>
                    </div>
                </div>

                {/* Policy Footer */}
                <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        <Link href="/terms">
                            <Button variant="ghost" className="text-gray-500 hover:text-primary hover:bg-primary/5 gap-2 px-4 h-9">
                                <ScrollText className="w-4 h-4" />
                                <span>Terms & Conditions</span>
                            </Button>
                        </Link>

                        <Link href="/privacy">
                            <Button variant="ghost" className="text-gray-500 hover:text-primary hover:bg-primary/5 gap-2 px-4 h-9">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Privacy Policy</span>
                            </Button>
                        </Link>

                        <Link href="/policy">
                            <Button variant="ghost" className="text-gray-500 hover:text-primary hover:bg-primary/5 gap-2 px-4 h-9">
                                <Receipt className="w-4 h-4" />
                                <span>Refund Policy</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
