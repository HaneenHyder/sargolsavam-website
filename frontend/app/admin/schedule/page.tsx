'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Modal } from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleEvent {
    id?: number;
    time: string;
    stage: string;
    item: string;
    category: string;
}

interface DaySchedule {
    id: number;
    date: string;
    day: string;
    events: ScheduleEvent[];
}

export default function AdminSchedulePage() {
    const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Fetch schedule from API
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${apiUrl}/schedule`);
            if (res.ok) {
                const data = await res.json();
                setScheduleData(data);
            } else {
                toast.error('Failed to load schedule');
            }
        } catch (err) {
            console.error('Error fetching schedule:', err);
            toast.error('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    // Open modal for new event
    const openAddModal = () => {
        setEditingEvent({ time: '', stage: '', item: '', category: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    // Open modal for editing
    const openEditModal = (event: ScheduleEvent) => {
        setEditingEvent({ ...event });
        setEditingId(event.id || null);
        setIsModalOpen(true);
    };

    // Save event (add or update)
    const saveEvent = async () => {
        if (!editingEvent) return;

        if (!editingEvent.time || !editingEvent.item) {
            toast.error('Time and Event name are required');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');

            if (editingId) {
                // Update existing
                const res = await fetch(`${apiUrl}/schedule/events/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify(editingEvent)
                });
                if (!res.ok) throw new Error('Failed to update');
                toast.success('Event updated');
            } else {
                // Add new
                const dayId = scheduleData[selectedDay]?.id;
                const res = await fetch(`${apiUrl}/schedule/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({ ...editingEvent, dayId })
                });
                if (!res.ok) throw new Error('Failed to add');
                toast.success('Event added');
            }

            setIsModalOpen(false);
            fetchSchedule();
        } catch (err) {
            console.error('Error saving event:', err);
            toast.error('Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    // Delete event
    const deleteEvent = async (eventId: number) => {
        if (!confirm('Delete this event?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${apiUrl}/schedule/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Event deleted');
            fetchSchedule();
        } catch (err) {
            console.error('Error deleting event:', err);
            toast.error('Failed to delete event');
        }
    };

    const categories = ['Senior', 'Junior', 'Sub Junior', 'Group', '-'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-2">Loading schedule...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Schedule</h1>
                    <p className="text-gray-500 text-sm mt-1">Add, edit, or remove schedule events (stored in database)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchSchedule}>Refresh</Button>
                    <Button onClick={openAddModal} className="gap-2">
                        <Plus size={16} /> Add Event
                    </Button>
                </div>
            </div>

            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2">
                {scheduleData.map((day, index) => (
                    <button
                        key={day.id}
                        onClick={() => setSelectedDay(index)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedDay === index
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {day.day} - {day.date.split(' ')[1]} {day.date.split(' ')[2]}
                    </button>
                ))}
            </div>

            {/* Events Table */}
            {scheduleData[selectedDay] && (
                <Card>
                    <CardHeader>
                        <CardTitle>{scheduleData[selectedDay].date}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Stage</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Event</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduleData[selectedDay].events.map((event) => (
                                        <tr key={event.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{event.time}</td>
                                            <td className="py-3 px-4 text-sm">{event.stage}</td>
                                            <td className="py-3 px-4 font-medium">{event.item}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${event.category === 'Senior' ? 'bg-blue-100 text-blue-700' :
                                                    event.category === 'Junior' ? 'bg-green-100 text-green-700' :
                                                        event.category === 'Sub Junior' ? 'bg-purple-100 text-purple-700' :
                                                            event.category === 'Group' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => openEditModal(event)}>
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button size="sm" variant="danger" onClick={() => deleteEvent(event.id!)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {scheduleData[selectedDay].events.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No events scheduled for this day
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Event' : 'Add Event'}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveEvent} disabled={saving} className="gap-2">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </Button>
                    </>
                }
            >
                {editingEvent && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                placeholder="e.g., 9:00-10:00 AM"
                                value={editingEvent.time}
                                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="stage">Stage</Label>
                            <Input
                                id="stage"
                                placeholder="e.g., 1, 2, 3 or - for no stage"
                                value={editingEvent.stage}
                                onChange={(e) => setEditingEvent({ ...editingEvent, stage: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="item">Event Name *</Label>
                            <Input
                                id="item"
                                placeholder="e.g., Arabic Song"
                                value={editingEvent.item}
                                onChange={(e) => setEditingEvent({ ...editingEvent, item: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                value={editingEvent.category}
                                onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
