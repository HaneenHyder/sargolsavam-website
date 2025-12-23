'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Trash2, Trophy, Users, Edit, ListOrdered, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { formatCategory } from "@/lib/utils";

interface Event {
    id: string;
    name: string;
    code: string;
    category: string | null;
    item_type: string; // Individual/Group
    event_type: string; // Onstage/Offstage
    status: string;
}

interface Candidate {
    id: string;
    chest_no: string;
    name: string;
    team_code: string;
}

interface EventParticipant {
    id: string;
    event_id: string;
    candidate_id: string;
    candidates: Candidate;
}

interface WinnerEntry {
    candidate_id: string;
    team_code: string;
    grade: string;
}

interface PublishedResult {
    id: string;
    event_id: string;
    candidate_id: string | null;
    team_code: string;
    position: number;
    grade: string;
    points: number;
    status: string;
    event_name: string;
    item_type: string;
    event_type: string;
    candidate_name: string | null;
    chest_no: string | null;
}

export default function UnifiedEventManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsPagination, setEventsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [eventsSearch, setEventsSearch] = useState("");

    const [candidates, setCandidates] = useState<Candidate[]>([]);

    const [candidatesSearch, setCandidatesSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [exitingParticipants, setExitingParticipants] = useState<string[]>([]);
    const [showResultsForm, setShowResultsForm] = useState(false);
    const [chestNumberFilter, setChestNumberFilter] = useState("");
    const [publishedResults, setPublishedResults] = useState<PublishedResult[]>([]);
    const [editingResult, setEditingResult] = useState<PublishedResult | null>(null);
    const [positionResults, setPositionResults] = useState<Record<string, WinnerEntry[]>>({
        "1st": [{ candidate_id: "", team_code: "", grade: "A" }],
        "2nd": [{ candidate_id: "", team_code: "", grade: "A" }],
        "3rd": [{ candidate_id: "", team_code: "", grade: "A" }],
        "Absent": [],
    });

    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const requestConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setConfirmation({ isOpen: true, title, message, onConfirm });
    };

    const [eventForm, setEventForm] = useState({
        name: "",
        item_type: "Individual",
        category: "",
        event_type: "Onstage",
    });

    const [publishingId, setPublishingId] = useState<string | null>(null);

    // Edit Event State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        item_type: "Individual",
        category: "",
        event_type: "Onstage",
    });

    // Auth Modal State for sensitive actions
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authPassword, setAuthPassword] = useState("");
    const [authAction, setAuthAction] = useState<(() => void) | null>(null);

    // Filter states
    const [eventSearchQuery, setEventSearchQuery] = useState("");
    const [eventFilterCategory, setEventFilterCategory] = useState("All");
    const [eventFilterType, setEventFilterType] = useState("All");
    const [eventFilterStage, setEventFilterStage] = useState("All");

    // Bulk Absent State
    const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
    const [bulkAbsentSelection, setBulkAbsentSelection] = useState<string[]>([]);

    // Bulk Add State
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [bulkChestNos, setBulkChestNos] = useState("");

    useEffect(() => {
        fetchData();
        fetchPublishedResults();
    }, []);

    useEffect(() => {
        fetchEvents(1);
    }, [eventsSearch, eventFilterCategory, eventFilterType, eventFilterStage]);

    // Debounce search for candidates
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCandidates(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [candidatesSearch]);

    useEffect(() => {
        if (selectedEvent) {
            fetchEventParticipants(selectedEvent.id);
        }
    }, [selectedEvent]);

    const fetchEvents = async (page = eventsPagination.page) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search: eventsSearch,
            });

            if (eventFilterCategory !== "All") params.append("category", eventFilterCategory);
            if (eventFilterType !== "All") params.append("item_type", eventFilterType);
            if (eventFilterStage !== "All") params.append("event_type", eventFilterStage);

            const res = await fetch(`${API_URL}/api/events?${params.toString()}`, { credentials: 'include' });
            const data = await res.json();

            setEvents(data.data || []);
            if (data.pagination) {
                setEventsPagination({
                    page: data.pagination.page,
                    totalPages: data.pagination.totalPages,
                    total: data.pagination.total
                });
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events");
        }
    };

    const fetchCandidates = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            // Fetch all candidates at once
            const res = await fetch(`${API_URL}/api/candidates?all=true&search=${candidatesSearch}`, { credentials: 'include' });
            const data = await res.json();

            setCandidates(data.data || []);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            toast.error("Failed to load candidates");
        }
    };


    // Kept for compatibility but now essentially splits the work
    const fetchData = async () => {
        await Promise.all([fetchEvents(), fetchCandidates()]);
        setLoading(false);
    };

    const fetchPublishedResults = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${API_URL}/api/results`, { credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to fetch results: ${res.status}`);
            const data = await res.json();
            setPublishedResults(data || []);
        } catch (error) {
            console.error("Error fetching results:", error);
            toast.error("Failed to load results");
        }
    };

    const fetchEventParticipants = async (eventId: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const data = await fetch(`${API_URL}/api/participants/event/${eventId}`, { credentials: 'include' }).then(res => res.json());
            // Transform data to match interface if needed
            // Backend returns joined data, assume it matches or adapt here
            // Backend returns: { id, event_id, candidate_id, team_code, status, candidates: { ... } }
            // We need to map it to EventParticipant interface
            const mappedData = data.map((p: any) => ({
                id: p.id,
                event_id: p.event_id,
                candidate_id: p.candidate_id,
                candidates: {
                    id: p.candidate_id,
                    chest_no: p.chest_no,
                    name: p.candidate_name,
                    team_code: p.team_code
                }
            }));
            setEventParticipants(mappedData || []);
        } catch (error) {
            console.error("Error fetching participants:", error);
            toast.error("Failed to load participants");
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate category for individual events
        if (eventForm.item_type === "Individual" && !eventForm.category) {
            toast.error("Please select a category for individual events");
            return;
        }

        // Code generation is handled by backend if empty, but we can send empty code

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(eventForm)
            });

            if (!res.ok) throw new Error('Failed to create event');
            const data = await res.json();

            toast.success("Event created successfully");
            setShowEventForm(false);
            setEventForm({
                name: "",
                item_type: "Individual",
                category: "",
                event_type: "Onstage",
            });
            await fetchData();

            // Auto-select the new event
            setSelectedEvent(data);
        } catch (error: any) {
            console.error("Error creating event:", error);
            toast.error(error.message || "Failed to create event");
        }
    };

    const handleDeleteEvent = async (id: string) => {
        requestConfirmation(
            "Delete Event",
            "Are you sure you want to delete this event? This action cannot be undone.",
            () => executeDeleteEvent(id)
        );
    };

    const executeDeleteEvent = async (id: string) => {

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete event');

            toast.success("Event deleted successfully");
            if (selectedEvent?.id === id) {
                setSelectedEvent(null);
            }
            fetchData();
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error(error.message || "Failed to delete event");
        }
    };

    const handleDeleteAllEvents = () => {
        setIsAuthModalOpen(true);
    };

    const executeDeleteAllEvents = async (password: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/events`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete all events');
            }

            const data = await res.json();
            toast.success(`Deleted ${data.deletedEvents} events and ${data.deletedParticipants} participants`);
            setSelectedEvent(null);
            setIsAuthModalOpen(false);
            setAuthPassword("");
            fetchData();
            fetchPublishedResults();
        } catch (error: any) {
            console.error("Error deleting all events:", error);
            toast.error(error.message || "Failed to delete all events");
        }
    };

    const handleEditClick = (event: Event) => {
        setEditingEvent(event);
        setEditForm({
            name: event.name,
            item_type: event.item_type,
            category: event.category || "",
            event_type: event.event_type,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        // Validate category for individual events
        if (editForm.item_type === "Individual" && !editForm.category) {
            toast.error("Please select a category for individual events");
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/events/${editingEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(editForm)
            });

            if (!res.ok) throw new Error('Failed to update event');

            toast.success("Event updated successfully");
            setIsEditModalOpen(false);
            setEditingEvent(null);
            fetchData(); // Refresh list headers

            // Update selected event if it matches
            if (selectedEvent?.id === editingEvent.id) {
                setSelectedEvent(prev => prev ? { ...prev, ...editForm, category: editForm.category || null } : null);
            }
        } catch (error: any) {
            console.error("Error updating event:", error);
            toast.error(error.message || "Failed to update event");
        }
    };

    const handleToggleParticipant = (candidateId: string) => {
        if (!selectedEvent) return;

        // Check limit for individual events
        if (selectedEvent.item_type === "Individual") {
            const currentCount = eventParticipants.length;
            const selectedCount = selectedParticipants.length;
            const isSelecting = !selectedParticipants.includes(candidateId);

            if (isSelecting && (currentCount + selectedCount) >= 12) {
                toast.error("Maximum 12 participants allowed for individual events");
                return;
            }
        }

        setSelectedParticipants(prev =>
            prev.includes(candidateId)
                ? prev.filter(id => id !== candidateId)
                : [...prev, candidateId]
        );
    };

    const handleAddParticipants = async () => {
        if (!selectedEvent || selectedParticipants.length === 0) return;

        // Double check limit
        if (selectedEvent.item_type === "Individual" && (eventParticipants.length + selectedParticipants.length) > 12) {
            toast.error("Cannot add participants: Limit of 12 exceeded");
            return;
        }

        // Map selected IDs to the structure expected by backend
        const candidatesToAdd = candidates
            .filter(c => selectedParticipants.includes(c.id))
            .map(c => ({
                candidate_id: c.id,
                team_code: c.team_code
            }));

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/participants/event/${selectedEvent.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ candidates: candidatesToAdd })
            });

            if (!res.ok) throw new Error('Failed to add participants');

            toast.success(`Added ${selectedParticipants.length} participant(s)`);
            setSelectedParticipants([]);
            fetchEventParticipants(selectedEvent.id);
        } catch (error: any) {
            console.error("Error adding participants:", error);
            toast.error(error.message || "Failed to add participants");
        }
    };

    const handleAddBulk = async () => {
        if (!selectedEvent || !bulkChestNos.trim()) return;

        const chestNumbers = bulkChestNos
            .split(/[\s,]+/)
            .map(s => s.trim())
            .filter(Boolean);

        if (chestNumbers.length === 0) {
            toast.error("No valid chest numbers entered");
            return;
        }

        // Find candidates matching these chest numbers
        const candidatesToAdd: { candidate_id: string; team_code: string }[] = [];
        const notFound: string[] = [];
        const alreadyAdded: string[] = [];

        chestNumbers.forEach(chestNo => {
            const candidate = candidates.find(c => c.chest_no === chestNo);
            if (!candidate) {
                notFound.push(chestNo);
            } else if (eventParticipants.some(p => p.candidate_id === candidate.id)) {
                alreadyAdded.push(chestNo);
            } else {
                candidatesToAdd.push({
                    candidate_id: candidate.id,
                    team_code: candidate.team_code
                });
            }
        });

        if (notFound.length > 0) {
            toast.warning(`Chest numbers not found: ${notFound.join(", ")}`);
        }
        if (alreadyAdded.length > 0) {
            toast.info(`Already added: ${alreadyAdded.join(", ")}`);
        }

        if (candidatesToAdd.length === 0) {
            if (notFound.length === 0 && alreadyAdded.length === 0) {
                toast.error("No valid candidates found to add");
            }
            return;
        }

        // Limit Check
        if (selectedEvent.item_type === "Individual" && (eventParticipants.length + candidatesToAdd.length) > 12) {
            toast.error(`Cannot add ${candidatesToAdd.length} candidates: Exceeds limit of 12`);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/participants/event/${selectedEvent.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ candidates: candidatesToAdd })
            });

            if (!res.ok) throw new Error('Failed to add participants');

            toast.success(`Added ${candidatesToAdd.length} participant(s)`);
            setBulkChestNos("");
            setShowBulkInput(false);
            fetchEventParticipants(selectedEvent.id);
        } catch (error: any) {
            console.error("Error adding participants:", error);
            toast.error(error.message || "Failed to add participants");
        }
    };

    const handleRemoveParticipant = async (participantId: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/participants/${participantId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to remove participant');

            // Start exit animation
            setExitingParticipants(prev => [...prev, participantId]);

            // Wait for animation to finish before removing from list
            setTimeout(() => {
                setEventParticipants(prev => prev.filter(p => p.id !== participantId));
                setExitingParticipants(prev => prev.filter(id => id !== participantId));
                toast.success("Participant removed");
            }, 500); // 500ms matches the transition duration

        } catch (error: any) {
            console.error("Error removing participant:", error);
            toast.error(error.message || "Failed to remove participant");
        }
    };

    const addWinnerToPosition = (position: string) => {
        setPositionResults(prev => ({
            ...prev,
            [position]: [...prev[position], { candidate_id: "", team_code: "", grade: "A" }],
        }));
    };

    const removeWinnerFromPosition = (position: string, index: number) => {
        setPositionResults(prev => ({
            ...prev,
            [position]: prev[position].filter((_, i) => i !== index),
        }));
    };

    const updateWinner = (position: string, index: number, field: keyof WinnerEntry, value: string) => {
        setPositionResults(prev => ({
            ...prev,
            [position]: prev[position].map((entry, i) =>
                i === index ? { ...entry, [field]: value } : entry
            ),
        }));
    };

    const handleBulkAbsentToggle = (id: string) => {
        setBulkAbsentSelection(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const confirmBulkAbsent = () => {
        if (!selectedEvent) return;

        const newAbsentEntries = bulkAbsentSelection.map(id => {
            if (selectedEvent.item_type === "Individual") {
                const participant = eventParticipants.find(p => p.candidate_id === id);
                return {
                    candidate_id: id,
                    team_code: participant?.candidates.team_code || "",
                    grade: "A" // grade is ignored for absent but kept for structure
                };
            } else {
                return {
                    candidate_id: "",
                    team_code: id,
                    grade: "A"
                };
            }
        });

        setPositionResults(prev => ({
            ...prev,
            "Absent": [...prev["Absent"], ...newAbsentEntries]
        }));

        setBulkAbsentSelection([]);
        setIsAbsentModalOpen(false);
        toast.success(`Added ${newAbsentEntries.length} to absent list`);
    };

    const handleAddResults = async () => {
        if (!selectedEvent) return;

        const allResults: any[] = [];

        Object.entries(positionResults).forEach(([position, winners]) => {
            winners.forEach(winner => {
                if (winner.candidate_id || winner.team_code) {
                    allResults.push({
                        event_id: selectedEvent.id,
                        candidate_id: winner.candidate_id || null,
                        team_code: winner.team_code,
                        position,
                        grade: position === "Absent" ? "D" : winner.grade,
                    });
                }
            });
        });

        if (allResults.length === 0) {
            toast.error("Please add at least one result");
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ results: allResults })
            });

            if (!res.ok) throw new Error('Failed to add results');

            toast.success("Results added successfully. Go to 'Manage Results' tab to publish them.");
            setShowResultsForm(false);
            setPositionResults({
                "1st": [{ candidate_id: "", team_code: "", grade: "A" }],
                "2nd": [{ candidate_id: "", team_code: "", grade: "A" }],
                "3rd": [{ candidate_id: "", team_code: "", grade: "A" }],
                "Absent": [],
            });
            fetchPublishedResults();
        } catch (error: any) {
            console.error("Error adding results:", error);
            toast.error(error.message || "Failed to add results");
        }
    };

    const executePublishEventResults = async (eventId: string) => {
        setPublishingId(eventId);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("You must be logged in to publish results");
                return;
            }

            const res = await fetch(`${API_URL}/results/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ event_id: eventId })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to publish results');
            }

            toast.success("Results published successfully! Results are now visible to everyone.");
            fetchPublishedResults();

            // Update local state immediately
            setEvents(prevEvents =>
                prevEvents.map(e =>
                    e.id === eventId ? { ...e, status: 'Declared' } : e
                )
            );

            await fetchData(); // Fetch fresh data from server

            // Update selected event status locally to reflect change immediately
            if (selectedEvent && selectedEvent.id === eventId) {
                setSelectedEvent({ ...selectedEvent, status: 'Declared' });
            }
        } catch (error: any) {
            console.error("Error publishing results:", error);
            toast.error(error.message || "Failed to publish results");
        } finally {
            setPublishingId(null);
        }
    };

    const handlePublishEventResults = async (eventId: string) => {
        requestConfirmation(
            "Publish Results",
            "Are you sure you want to publish all pending results for this event? Results will be visible to everyone.",
            () => executePublishEventResults(eventId)
        );
    };

    const executeUnpublishEvent = async (event: Event) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            // We need to send all fields for update
            const payload = {
                name: event.name,
                event_type: event.event_type,
                item_type: event.item_type,
                category: event.category,
                status: 'Pending'
            };

            const res = await fetch(`${API_URL}/api/events/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to unpublish results');

            toast.success("Results unpublished. You can now edit them.");
            fetchData(); // Update event status in list

            // Update selected event status locally
            setSelectedEvent({ ...event, status: 'Pending' });

        } catch (error: any) {
            console.error("Error unpublishing results:", error);
            toast.error(error.message || "Failed to unpublish results");
        }
    };

    const handleUnpublishEvent = async (event: Event) => {
        requestConfirmation(
            "Unpublish Results",
            "Are you sure you want to unpublish results? They will be hidden from candidates, and you can edit them.",
            () => executeUnpublishEvent(event)
        );
    };

    const handleDeleteResult = async (resultId: string) => {
        requestConfirmation(
            "Delete Result",
            "Are you sure you want to delete this result?",
            () => executeDeleteResult(resultId)
        );
    };

    const executeDeleteResult = async (resultId: string) => {
        if (!resultId) {
            toast.error("Invalid result ID");
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/results/${resultId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete result');

            toast.success("Result deleted successfully");
            fetchPublishedResults();
        } catch (error: any) {
            console.error("Error deleting result:", error);
            toast.error(error.message || "Failed to delete result");
        }
    };

    const groupResultsByEvent = () => {
        const grouped: Record<string, { eventName: string; itemType: string; results: PublishedResult[] }> = {};

        publishedResults.forEach(result => {
            const eventId = result.event_id;
            if (!grouped[eventId]) {
                grouped[eventId] = {
                    eventName: result.event_name,
                    itemType: result.item_type,
                    results: []
                };
            }
            grouped[eventId].results.push(result);
        });

        // Sort results within each event by position
        Object.values(grouped).forEach(group => {
            group.results.sort((a, b) => {
                return (a.position || 999) - (b.position || 999);
            });
        });

        return grouped;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            Pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            Ongoing: "bg-green-500/10 text-green-500 border-green-500/20",
            Declared: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        };
        return variants[status] || variants.Pending;
    };

    const getPositionBadge = (position: number) => {
        const styles = {
            1: "bg-yellow-100 text-yellow-800",
            2: "bg-gray-100 text-gray-800",
            3: "bg-amber-100 text-amber-800",
        };
        return styles[position as keyof typeof styles] || "bg-muted text-muted-foreground";
    };

    const getGradeBadge = (grade: string) => {
        const styles = {
            A: "bg-green-100 text-green-800",
            B: "bg-blue-100 text-blue-800",
            C: "bg-purple-100 text-purple-800",
            D: "bg-orange-100 text-orange-800",
        };
        return styles[grade as keyof typeof styles] || "bg-muted text-muted-foreground";
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    const availableCandidates = candidates
        .filter(
            c => !eventParticipants.some(p => p.candidate_id === c.id) &&
                c.chest_no.toLowerCase().includes(chestNumberFilter.toLowerCase())
        )
        .sort((a, b) => {
            const numA = parseInt(a.chest_no);
            const numB = parseInt(b.chest_no);
            return numA - numB;
        });

    return (
        <div className="space-y-6">
            <Modal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                title={confirmation.title}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                confirmation.onConfirm();
                                setConfirmation(prev => ({ ...prev, isOpen: false }));
                            }}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <p className="text-muted-foreground">{confirmation.message}</p>
            </Modal>

            {/* Edit Event Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Event"
                footer={null}
            >
                <form onSubmit={handleUpdateEvent} className="space-y-4">
                    {/* ... form content ... */}
                    <div>
                        <Label htmlFor="edit-name">Event Name</Label>
                        <Input
                            id="edit-name"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            required
                        />
                    </div>
                    {/* Re-rendering existing fields just to keep context, but actually I need to preserve them. 
                       Wait, multi_replace replaces the BLOCK. The target block was short in my previous read? 
                       No, I need to be careful not to delete the form content if I matched the outer block.
                       Actually I will append the AuthModal AFTER the EditModal.
                    */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-item_type">Item Type</Label>
                            <Select
                                value={editForm.item_type}
                                onValueChange={value => setEditForm({ ...editForm, item_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="Group">Group</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-event_type">Stage Type</Label>
                            <Select
                                value={editForm.event_type}
                                onValueChange={value => setEditForm({ ...editForm, event_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Onstage">On Stage</SelectItem>
                                    <SelectItem value="Offstage">Off Stage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {editForm.item_type === "Individual" && (
                        <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={editForm.category}
                                onValueChange={value => setEditForm({ ...editForm, category: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sub Junior">Sub Junior</SelectItem>
                                    <SelectItem value="Junior">Junior</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Event</Button>
                    </div>
                </form>
            </Modal>

            {/* Auth Modal */}
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setAuthPassword("");
                }}
                title="Confirm Action"
                footer={null}
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm">
                        <p className="font-semibold flex items-center gap-2">
                            <Trash2 className="h-4 w-4" /> Warning: Destructive Action
                        </p>
                        <p className="mt-1">
                            You are about to delete ALL events. This action cannot be undone.
                            Please enter your admin password to confirm.
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="auth-password">Admin Password</Label>
                        <Input
                            id="auth-password"
                            type="password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Enter password..."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAuthModalOpen(false);
                                setAuthPassword("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            disabled={!authPassword}
                            onClick={() => executeDeleteAllEvents(authPassword)}
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Absent Modal */}
            <Modal
                isOpen={isAbsentModalOpen}
                onClose={() => setIsAbsentModalOpen(false)}
                title="Bulk Mark Absent"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAbsentModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmBulkAbsent}
                            disabled={bulkAbsentSelection.length === 0}
                        >
                            Mark {bulkAbsentSelection.length} as Absent
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Select participants who were absent. They will be added to the absent list.
                    </p>
                    <div className="border rounded-md max-h-[300px] overflow-y-auto p-2">
                        {selectedEvent && (selectedEvent.item_type === "Individual" ? (
                            eventParticipants
                                .filter(p => !Object.values(positionResults).flat().some(r => r.candidate_id === p.candidate_id))
                                .map(p => (
                                    <div key={p.candidate_id} className="flex items-center space-x-2 py-2 px-2 hover:bg-muted/50 rounded">
                                        <Checkbox
                                            checked={bulkAbsentSelection.includes(p.candidate_id)}
                                            onCheckedChange={() => handleBulkAbsentToggle(p.candidate_id)}
                                        />
                                        <label
                                            className="flex-1 cursor-pointer text-sm"
                                            onClick={() => handleBulkAbsentToggle(p.candidate_id)}
                                        >
                                            {p.candidates.chest_no} - {p.candidates.name}
                                        </label>
                                    </div>
                                ))
                        ) : (
                            ["100", "200", "300"]
                                .filter(team => !Object.values(positionResults).flat().some(r => r.team_code === team))
                                .map(team => (
                                    <div key={team} className="flex items-center space-x-2 py-2 px-2 hover:bg-muted/50 rounded">
                                        <Checkbox
                                            checked={bulkAbsentSelection.includes(team)}
                                            onCheckedChange={() => handleBulkAbsentToggle(team)}
                                        />
                                        <label
                                            className="flex-1 cursor-pointer text-sm"
                                            onClick={() => handleBulkAbsentToggle(team)}
                                        >
                                            Team {team}
                                        </label>
                                    </div>
                                ))
                        ))}
                        {selectedEvent && selectedEvent.item_type === "Individual" && eventParticipants.filter(p => !Object.values(positionResults).flat().some(r => r.candidate_id === p.candidate_id)).length === 0 && (
                            <p className="text-center py-4 text-muted-foreground">No available participants to mark as absent.</p>
                        )}
                    </div>
                </div>
            </Modal>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-4xl font-bold text-primary">
                            Event & Results Management
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage events, participants, and publish results.</p>
                    </div>
                    <Button onClick={() => setShowEventForm(true)} size="lg" className="shadow-md w-full sm:w-auto">
                        <Plus className="h-5 w-5 mr-2" />
                        New Event
                    </Button>
                </div>

                {showEventForm && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Event Name</Label>
                                <Input
                                    id="name"
                                    value={eventForm.name}
                                    onChange={e => setEventForm({ ...eventForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="item_type">Item Type</Label>
                                    <Select
                                        value={eventForm.item_type}
                                        onValueChange={value => setEventForm({ ...eventForm, item_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Individual">Individual</SelectItem>
                                            <SelectItem value="Group">Group</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="event_type">Stage Type</Label>
                                    <Select
                                        value={eventForm.event_type}
                                        onValueChange={value => setEventForm({ ...eventForm, event_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Onstage">On Stage</SelectItem>
                                            <SelectItem value="Offstage">Off Stage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {eventForm.item_type === "Individual" && (
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={eventForm.category}
                                        onValueChange={value => setEventForm({ ...eventForm, category: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sub Junior">Sub Junior</SelectItem>
                                            <SelectItem value="Junior">Junior</SelectItem>
                                            <SelectItem value="Senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button type="submit">Create Event</Button>
                                <Button type="button" variant="outline" onClick={() => setShowEventForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card >
                )
                }

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Events List</h3>
                            {/* <Button
                                variant="danger"
                                size="sm"
                                onClick={handleDeleteAllEvents}
                                disabled={events.length === 0}
                                title="Delete All Events"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete All
                            </Button> */}
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search events..."
                                    value={eventsSearch}
                                    onChange={(e) => setEventsSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                <Select value={eventFilterCategory} onValueChange={setEventFilterCategory}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Cat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Cats</SelectItem>
                                        <SelectItem value="Sub Junior">Sub Jr</SelectItem>
                                        <SelectItem value="Junior">Junior</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={eventFilterType} onValueChange={setEventFilterType}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Types</SelectItem>
                                        <SelectItem value="Individual">Indiv.</SelectItem>
                                        <SelectItem value="Group">Group</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={eventFilterStage} onValueChange={setEventFilterStage}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Stages</SelectItem>
                                        <SelectItem value="Onstage">On Stage</SelectItem>
                                        <SelectItem value="Offstage">Off Stage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(eventSearchQuery || eventFilterCategory !== "All" || eventFilterType !== "All" || eventFilterStage !== "All") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full h-6 text-xs text-muted-foreground"
                                    onClick={() => {
                                        setEventsSearch("");
                                        setEventFilterCategory("All");
                                        setEventFilterType("All");
                                        setEventFilterStage("All");
                                    }}
                                >
                                    <X className="h-3 w-3 mr-1" /> Clear Filters
                                </Button>
                            )}
                        </div>

                        <div
                            className="space-y-2 overflow-y-auto"
                            style={{ maxHeight: '600px', overscrollBehavior: 'contain' }}
                        >
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedEvent?.id === event.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium mr-2">{event.name}</h4>
                                        <div className="flex shrink-0">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(event);
                                                }}
                                            >
                                                <Edit className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEvent(event.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className={getStatusBadge(event.status)}>
                                            {event.status}
                                        </Badge>
                                        <Badge variant="outline">{event.item_type}</Badge>
                                        {event.category && <Badge variant="outline">{formatCategory(event.category)}</Badge>}
                                        {event.event_type && (
                                            <Badge variant="secondary">
                                                {event.event_type}
                                            </Badge>
                                        )}
                                        {event.code && <Badge variant="secondary" className="font-mono">{event.code}</Badge>}
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchEvents(eventsPagination.page - 1)}
                                    disabled={eventsPagination.page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    Page {eventsPagination.page} of {eventsPagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchEvents(eventsPagination.page + 1)}
                                    disabled={eventsPagination.page === eventsPagination.totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="md:col-span-2 p-6">
                        {selectedEvent ? (
                            <Tabs defaultValue="participants">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="participants">
                                        <Users className="h-4 w-4 mr-2" />
                                        Participants
                                    </TabsTrigger>
                                    <TabsTrigger value="results">
                                        <Trophy className="h-4 w-4 mr-2" />
                                        {selectedEvent.status === 'Declared' ? 'Published Results' : 'Publish Results'}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="participants" className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{selectedEvent.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {selectedEvent.item_type === "Group"
                                                ? "Group events automatically include the 3 default teams"
                                                : "Select candidates to participate in this event (Max 12)"}
                                        </p>
                                    </div>

                                    {selectedEvent.item_type === "Individual" && (
                                        selectedEvent.status === 'Declared' ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-lg border border-dashed">
                                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Trophy className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-lg">Results Published</h3>
                                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                                        Participant management is locked because results have been declared.
                                                        Unpublish the results to add or remove participants.
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleUnpublishEvent(selectedEvent)}
                                                >
                                                    Unpublish Results
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">Current Participants ({eventParticipants.length})</h4>
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="whitespace-nowrap">Chest No.</TableHead>
                                                                    <TableHead className="whitespace-nowrap">Name</TableHead>
                                                                    <TableHead className="whitespace-nowrap">Team</TableHead>
                                                                    <TableHead className="whitespace-nowrap">Action</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {eventParticipants.map(p => (
                                                                    <TableRow
                                                                        key={p.id}
                                                                        className={`transition-all duration-500 ${exitingParticipants.includes(p.id) ? 'opacity-0 -translate-x-4 bg-red-50' : 'opacity-100'}`}
                                                                    >
                                                                        <TableCell className="whitespace-nowrap">{p.candidates.chest_no}</TableCell>
                                                                        <TableCell className="min-w-[150px]">{p.candidates.name}</TableCell>
                                                                        <TableCell className="whitespace-nowrap">{p.candidates.team_code}</TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => handleRemoveParticipant(p.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                                                        <h4 className="font-medium">Add Participants</h4>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setShowBulkInput(!showBulkInput)}
                                                                title="Bulk Add via Chest Numbers"
                                                            >
                                                                <ListOrdered className="h-4 w-4 mr-2" />
                                                                {showBulkInput ? "Hide Bulk" : "Bulk Add"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={handleAddParticipants}
                                                                disabled={selectedParticipants.length === 0}
                                                            >
                                                                Add Selected ({selectedParticipants.length})
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {showBulkInput && (
                                                        <div className="bg-muted/50 p-4 rounded-lg space-y-3 border border-dashed border-primary/50">
                                                            <Label htmlFor="bulk-chest-nos" className="text-sm font-semibold text-primary">
                                                                Bulk Add by Chest Numbers
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground">
                                                                Enter logic chest numbers separated by commas, spaces, or newlines (e.g., 101, 102, 105)
                                                            </p>
                                                            <Textarea
                                                                id="bulk-chest-nos"
                                                                placeholder="101, 102, 103..."
                                                                value={bulkChestNos}
                                                                onChange={(e) => setBulkChestNos(e.target.value)}
                                                                className="min-h-[80px]"
                                                            />
                                                            <div className="flex justify-end">
                                                                <Button 
                                                                    size="sm" 
                                                                    onClick={handleAddBulk}
                                                                    disabled={!bulkChestNos.trim()}
                                                                >
                                                                    Verify & Add
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mb-3">
                                                        <Input
                                                            placeholder="Search candidates via Name or Chest No..."
                                                            value={candidatesSearch}
                                                            onChange={e => setCandidatesSearch(e.target.value)}
                                                        />
                                                    </div>
                                                    <div
                                                        className="border rounded-lg p-4 overflow-y-auto"
                                                        style={{ maxHeight: '300px', overscrollBehavior: 'contain' }}
                                                    >
                                                        {candidates.map(candidate => {
                                                            const isAdded = eventParticipants.some(p => p.candidate_id === candidate.id);
                                                            return (
                                                                <div key={candidate.id} className={`flex items-center space-x-2 py-2 ${isAdded ? 'opacity-50' : ''}`}>
                                                                    <Checkbox
                                                                        checked={selectedParticipants.includes(candidate.id) || isAdded}
                                                                        disabled={isAdded}
                                                                        onCheckedChange={() => !isAdded && handleToggleParticipant(candidate.id)}
                                                                    />
                                                                    <label
                                                                        className="flex-1 cursor-pointer text-sm"
                                                                        onClick={() => !isAdded && handleToggleParticipant(candidate.id)}
                                                                    >
                                                                        {candidate.chest_no} - {candidate.name} ({candidate.team_code})
                                                                        {isAdded && <span className="text-xs ml-2 text-green-600">(Added)</span>}
                                                                    </label>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                </div>
                                                </div>
                                            </>
                                        )
                                    )}
                                </TabsContent>

                                <TabsContent value="results" className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {selectedEvent.status === 'Declared' ? `Published Results for ${selectedEvent.name}` :
                                                publishedResults.some(r => r.event_id === selectedEvent.id) ? `Pending Results for ${selectedEvent.name}` :
                                                    `Publish Results for ${selectedEvent.name}`}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {selectedEvent.status === 'Declared' ? "Manage published winners and grades" :
                                                publishedResults.some(r => r.event_id === selectedEvent.id) ? "Results added but not yet published. Review and publish." :
                                                    "Select winners and assign grades for each position"}
                                        </p>
                                    </div>

                                    {selectedEvent.status === 'Declared' ? (
                                        <div className="space-y-6">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <Trophy className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-green-800">Results Published</h4>
                                                        <p className="text-sm text-green-600">These results are visible to all candidates and captains.</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="border-green-200 text-green-700 hover:bg-green-100 w-full sm:w-auto"
                                                    onClick={() => handleUnpublishEvent(selectedEvent)}
                                                >
                                                    Unpublish & Edit
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium">Published Winners</h4>
                                                <div className="grid gap-4">
                                                    {publishedResults
                                                        .filter(r => r.event_id == selectedEvent.id)
                                                        .sort((a, b) => (a.position || 999) - (b.position || 999))
                                                        .map(result => (
                                                            <Card key={result.id} className="p-4 flex justify-between items-center">
                                                                <div className="flex items-center gap-4">
                                                                    <Badge className={getPositionBadge(result.position)}>{result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}</Badge>
                                                                    <div>
                                                                        <p className="font-medium">{result.candidate_name || `Team ${result.team_code}`}</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {result.chest_no ? `Chest No: ${result.chest_no}` : ''}
                                                                            {result.grade ? ` • Grade: ${result.grade}` : ''}
                                                                            {result.points ? ` • Points: ${result.points}` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteResult(result.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </Card>
                                                        ))
                                                    }
                                                    {publishedResults.filter(r => r.event_id == selectedEvent.id).length === 0 && (
                                                        <p className="text-muted-foreground text-center py-4">No results found (but status is Declared?)</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : publishedResults.some(r => r.event_id == selectedEvent.id) ? (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <Trophy className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-blue-800">Results Added (Pending)</h4>
                                                        <p className="text-sm text-blue-600">These results are saved but not yet visible to candidates.</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                                                    onClick={() => handlePublishEventResults(selectedEvent.id)}
                                                >
                                                    Publish Now
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium">Pending Winners</h4>
                                                <div className="grid gap-4">
                                                    {publishedResults
                                                        .filter(r => r.event_id == selectedEvent.id)
                                                        .sort((a, b) => (a.position || 999) - (b.position || 999))
                                                        .map(result => (
                                                            <Card key={result.id} className="p-4 flex justify-between items-center">
                                                                <div className="flex items-center gap-4">
                                                                    <Badge className={getPositionBadge(result.position)}>{result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}</Badge>
                                                                    <div>
                                                                        <p className="font-medium">{result.candidate_name || `Team ${result.team_code}`}</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {result.chest_no ? `Chest No: ${result.chest_no}` : ''}
                                                                            {result.grade ? ` • Grade: ${result.grade}` : ''}
                                                                            {result.points ? ` • Points: ${result.points}` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteResult(result.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </Card>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {(["1st", "2nd", "3rd"] as const).map(position => (
                                                <div key={position} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-medium">{position} Position</h4>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => addWinnerToPosition(position)}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Winner
                                                        </Button>
                                                    </div>

                                                    {positionResults[position].map((winner, index) => (
                                                        <Card key={index} className="p-4">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                                                {selectedEvent.item_type === "Individual" ? (
                                                                    <div>
                                                                        <Label>Candidate</Label>
                                                                        <Select
                                                                            value={winner.candidate_id}
                                                                            onValueChange={value => {
                                                                                const candidate = eventParticipants.find(p => p.candidate_id === value);
                                                                                updateWinner(position, index, "candidate_id", value);
                                                                                if (candidate) {
                                                                                    updateWinner(position, index, "team_code", candidate.candidates.team_code);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select candidate" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {eventParticipants.map(p => (
                                                                                    <SelectItem key={p.candidate_id} value={p.candidate_id}>
                                                                                        {p.candidates.chest_no} - {p.candidates.name}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <Label>Team Code</Label>
                                                                        <Select
                                                                            value={winner.team_code}
                                                                            onValueChange={value => updateWinner(position, index, "team_code", value)}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select team" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="100">100</SelectItem>
                                                                                <SelectItem value="200">200</SelectItem>
                                                                                <SelectItem value="300">300</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <Label>Grade</Label>
                                                                    <Select
                                                                        value={winner.grade}
                                                                        onValueChange={value => updateWinner(position, index, "grade", value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="A">A</SelectItem>
                                                                            <SelectItem value="B">B</SelectItem>
                                                                            <SelectItem value="C">C</SelectItem>
                                                                            <SelectItem value="D">D</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            {positionResults[position].length > 1 && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    onClick={() => removeWinnerFromPosition(position, index)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </Card>
                                                    ))}
                                                </div>
                                            ))}

                                            {/* Absent Candidates Section */}
                                            <div className="space-y-2 mt-6 border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-red-600">Absent Candidates</h4>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => addWinnerToPosition("Absent")}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Mark Absent
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50 ml-2"
                                                        onClick={() => {
                                                            setBulkAbsentSelection([]);
                                                            setIsAbsentModalOpen(true);
                                                        }}
                                                    >
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Bulk Mark Absent
                                                    </Button>
                                                </div>

                                                {positionResults["Absent"].map((entry, index) => (
                                                    <Card key={`absent-${index}`} className="p-4 border-red-100 bg-red-50/30">
                                                        <div className="grid grid-cols-1 gap-4 mb-3">
                                                            {selectedEvent.item_type === "Individual" ? (
                                                                <div>
                                                                    <Label>Candidate</Label>
                                                                    <Select
                                                                        value={entry.candidate_id}
                                                                        onValueChange={value => {
                                                                            const candidate = eventParticipants.find(p => p.candidate_id === value);
                                                                            updateWinner("Absent", index, "candidate_id", value);
                                                                            if (candidate) {
                                                                                updateWinner("Absent", index, "team_code", candidate.candidates.team_code);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select candidate" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {eventParticipants.map(p => (
                                                                                <SelectItem key={p.candidate_id} value={p.candidate_id}>
                                                                                    {p.candidates.chest_no} - {p.candidates.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Label>Team Code</Label>
                                                                    <Select
                                                                        value={entry.team_code}
                                                                        onValueChange={value => updateWinner("Absent", index, "team_code", value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select team" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="100">100</SelectItem>
                                                                            <SelectItem value="200">200</SelectItem>
                                                                            <SelectItem value="300">300</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => removeWinnerFromPosition("Absent", index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Card>
                                                ))}
                                            </div>

                                            <Button onClick={handleAddResults} className="w-full">
                                                Add Results
                                            </Button>
                                        </>
                                    )}
                                </TabsContent>
                            </Tabs>
                    ) : (
                    <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Select an event to manage participants and publish results
                    </div>
                        )}
                </Card>
            </div>







        </div >

    );
}
