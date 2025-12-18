export interface ScheduleEvent {
    time: string;
    stage: string;
    item: string;
    category: string;
}

export interface DaySchedule {
    date: string;
    day: string;
    events: ScheduleEvent[];
}

export const schedule: DaySchedule[] = [
    {
        date: "Monday 22 December 2025",
        day: "Day 1",
        events: [
            { time: "4:30-5:30 PM", stage: "2", item: "Arabic Song", category: "Senior" },
            { time: "4:30-5:30 PM", stage: "4", item: "Quran Recitation", category: "Junior" },
            { time: "4:30-5:30 PM", stage: "5", item: "Arabic Poetry Recitation", category: "Sub Junior" },
            { time: "6:30-8:00 PM", stage: "-", item: "Opening Ceremony", category: "-" },
            { time: "8:30-10:00 PM", stage: "1", item: "Mappila Song", category: "Senior" },
            { time: "8:30-10:00 PM", stage: "1", item: "Mappila Song", category: "Junior" },
            { time: "8:30-10:00 PM", stage: "1", item: "Mappila Song", category: "Sub Junior" },
            { time: "8:30-9:30 PM", stage: "3", item: "Urdu Poetry Recitation", category: "Senior" },
            { time: "8:30-9:30 PM", stage: "4", item: "Arabic Storytelling", category: "Junior" },
        ]
    },
    {
        date: "Tuesday 23 December 2025",
        day: "Day 2",
        events: [
            { time: "6:00-7:45 AM", stage: "1", item: "Quran Recitation", category: "Senior" },
            { time: "6:00-7:45 AM", stage: "1", item: "Quran Recitation", category: "Sub Junior" },
            { time: "7:00-8:00 AM", stage: "2", item: "Arabic Poetry Recitation", category: "Senior" },
            { time: "7:00-8:00 AM", stage: "4", item: "English Storytelling", category: "Sub Junior" },
            { time: "7:00-8:00 AM", stage: "5", item: "Arabic Poetry Recitation", category: "Junior" },
            { time: "8:00-8:30 AM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "8:30-9:30 AM", stage: "3", item: "English Speech", category: "Senior" },
            { time: "8:30-9:30 AM", stage: "2", item: "Urdu Speech", category: "Junior" },
            { time: "8:30-9:30 AM", stage: "4", item: "Arabic Speech", category: "Sub Junior" },
            { time: "8:30-9:30 AM", stage: "5", item: "English Speech", category: "Junior" },
            { time: "9:45-10:45 AM", stage: "2", item: "English Poetry Recitation", category: "Senior" },
            { time: "9:45-10:45 AM", stage: "4", item: "Live Translation (English–Malayalam)", category: "Junior" },
            { time: "9:45-10:45 AM", stage: "5", item: "Malayalam Poetry Recitation", category: "Senior" },
            { time: "9:45-10:45 AM", stage: "3", item: "Malayalam Speech", category: "Sub Junior" },
            { time: "11:00-12:00 PM", stage: "3", item: "Live Translation (Urdu–Malayalam)", category: "Senior" },
            { time: "11:00-12:00 PM", stage: "2", item: "Urdu Poetry Recitation", category: "Junior" },
            { time: "11:00-12:00 PM", stage: "4", item: "Malayalam Storytelling", category: "Sub Junior" },
            { time: "11:00-12:00 PM", stage: "5", item: "Urdu Song", category: "Senior" },
            { time: "12:15-1:15 PM", stage: "3", item: "Urdu Poetry Recitation", category: "Sub Junior" },
            { time: "12:15-1:15 PM", stage: "2", item: "Arabic Song", category: "Junior" },
            { time: "12:15-1:15 PM", stage: "4", item: "Urdu Song", category: "Junior" },
            { time: "12:15-1:15 PM", stage: "5", item: "News Reading", category: "Group" },
            { time: "1:15-2:15 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "2:15-3:15 PM", stage: "5", item: "English Poetry Recitation", category: "Sub Junior" },
            { time: "2:15-3:15 PM", stage: "4", item: "Malayalam Poetry Recitation", category: "Junior" },
            { time: "2:15-3:15 PM", stage: "2", item: "Islamic Song", category: "Sub Junior" },
            { time: "3:15-4:15 PM", stage: "2", item: "Islamic Song", category: "Senior" },
            { time: "3:00-4:00 PM", stage: "4", item: "Arabic Speech", category: "Junior" },
            { time: "3:00-4:00 PM", stage: "5", item: "English Speech", category: "Sub Junior" },
            { time: "4:00-4:30 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "6:30-8:00 PM", stage: "1", item: "Group Song (Urdu)", category: "Group" },
            { time: "6:30-8:00 PM", stage: "1", item: "Group Song (Arabic)", category: "Group" },
            { time: "6:30-8:00 PM", stage: "1", item: "Group Song (Malayalam)", category: "Group" },
            { time: "8:00-8:30 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "8:30-9:45 PM", stage: "1", item: "Musical Ensemble", category: "Group" },
            { time: "9:45-11:00 PM", stage: "1", item: "Vattappaattu (Folk Song)", category: "Group" },
        ]
    },
    {
        date: "Wednesday 24 December 2025",
        day: "Day 3",
        events: [
            { time: "6:30-7:30 AM", stage: "4", item: "English Storytelling", category: "Junior" },
            { time: "6:30-7:30 AM", stage: "5", item: "Malayalam Storytelling", category: "Sub Junior" },
            { time: "7:30-8:30 AM", stage: "4", item: "Urdu Speech", category: "Senior" },
            { time: "7:30-8:30 AM", stage: "3", item: "Malayalam Speech", category: "Junior" },
            { time: "8:30-9:00 AM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "9:00-10:00 AM", stage: "3", item: "Malayalam Speech", category: "Senior" },
            { time: "9:00-10:00 AM", stage: "5", item: "English Poetry Recitation", category: "Junior" },
            { time: "9:00-10:00 AM", stage: "4", item: "Malayalam Poetry Recitation", category: "Sub Junior" },
            { time: "9:00-10:00 AM", stage: "2", item: "One-Minute Speech", category: "Sub Junior" },
            { time: "10:00-11:00 AM", stage: "3", item: "Monologue", category: "Junior" },
            { time: "11:00-12:00 PM", stage: "3", item: "Live Translation (Arabic–Malayalam)", category: "Group" },
            { time: "11:00-12:00 PM", stage: "2", item: "Arabic Speech", category: "Senior" },
            { time: "11:00-12:00 PM", stage: "5", item: "Arabic Poetry Recitation", category: "Sub Junior" },
            { time: "11:00-12:00 PM", stage: "4", item: "Islamic Song", category: "Junior" },
            { time: "12:00-1:00 PM", stage: "4", item: "Urdu Song", category: "Sub Junior" },
            { time: "12:00-1:00 PM", stage: "3", item: "TED Talk (Arabic)", category: "Group" },
            { time: "1:00-2:00 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "2:00-4:00 PM", stage: "3", item: "Monologue", category: "Sub Junior" },
            { time: "2:00-4:00 PM", stage: "3", item: "Monologue", category: "Senior" },
            { time: "4:00-4:30 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "4:30-5:30 PM", stage: "-", item: "Qawwali", category: "Group" },
            { time: "5:45-6:30 PM", stage: "-", item: "Scheduled Break", category: "-" },
            { time: "6:45-8:30 PM", stage: "-", item: "Drama", category: "Group" },
            { time: "8:30-9:00 PM", stage: "-", item: "Valedictory Ceremony", category: "-" },
        ]
    }
];
