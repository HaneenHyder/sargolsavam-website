'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, Send, Users, Calendar, Phone } from 'lucide-react';

// Helper function to format date
const formatDate = (dateString: string): string => {
    if (dateString.includes("Monday 22")) return "Day 1 - 22 Dec";
    if (dateString.includes("Tuesday 23")) return "Day 2 - 23 Dec";
    if (dateString.includes("Wednesday 24")) return "Day 3 - 24 Dec";
    // Handle the incorrect "Tuesday 22" entries (should be Monday 22)
    if (dateString.includes("Tuesday 22")) return "Day 1 - 22 Dec";
    return dateString;
};

// Judge schedule data
const judgesSchedule = [
    {
        name: "SHUKKOOR SULTHAN NADWI",
        phone: "91 81398 60760",
        schedule: [
            { date: "Monday 22 December 2025", time: "4:30-5:30 PM", stage: "Stage 4", event: "ഖുർആൻ പാരായണം", category: "JNR" },
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 3", event: "കവിതാലാപനം ഉറുദു", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Urdu-Mala)", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 5", event: "ഉറുദു ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "12:15 - 1:15 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "JNR" }
        ]
    },
    {
        name: "AMAL MANAS USTHAD",
        phone: "91 75618 67458",
        schedule: [
            { date: "Monday 22 December 2025", time: "4:30-5:30 PM", stage: "Stage 2", event: "ഖുർആൻ പാരായണം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 1", event: "ഖുർആൻ പാരായണം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 2", event: "ഖുർആൻ പാരായണം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "കവിതാലാപനം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "3:15- 4:15 PM", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "ഇസ്ലാമിക് ഗാനം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "4:30 - 5:30", stage: "Stage 1", event: "ഖവ്വാലി", category: "GROUP" }
        ]
    },
    {
        name: "ABDUL SHAREEF NADWI",
        phone: "",
        schedule: [
            { date: "Monday 22 December 2025", time: "4:30-5:30 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Urdu-Mala)", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "കവിതാലാപനം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 5", event: "കവിതാലാപനം അറബി", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 4", event: "പ്രസംഗം ഉറുദു", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Arabi -Mala)", category: "GROUP" }
        ]
    },
    {
        name: "ABDUL VAHID NADWI",
        phone: "91 97464 20638",
        schedule: [
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 3", event: "കവിതാലാപനം അറബി", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 1", event: "ഖുർആൻ പാരായണം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 1", event: "ഖുർആൻ പാരായണം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 2", event: "പ്രസംഗം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 5", event: "ഉറുദു ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 3", event: "കവിതാലാപനം ഉറുദു", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 4", event: "പ്രസംഗം ഉറുദു", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "പ്രസംഗം അറബി", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 3", event: "TED TALK(ARABIC)", category: "GROUP" }
        ]
    },
    {
        name: "NASRUDHEEN NADWI",
        phone: "91 94464 29571",
        schedule: [
            { date: "Monday 22 December 2025", time: "4:30-5:30 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "SNR" },
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 4", event: "കഥാകഥനം അറബി", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 2", event: "കവിതാലാപനം അറബി", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "കവിതാലാപനം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 5", event: "കവിതാലാപനം അറബി", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "SJR" }
        ]
    },
    {
        name: "MUNEEB AZHARI",
        phone: "91 79025 47541",
        schedule: [
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SNR" },
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "JNR" },
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം URDU", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം ARABIC", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം മലയാളം", category: "GROUP" }
        ]
    },
    {
        name: "BASITH ABDULLAH AZHARI",
        phone: "91 7592 051 248",
        schedule: [
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SNR" },
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "JNR" },
            { date: "Monday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "3:15- 4:15", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "4:30 - 5:30 PM", stage: "Stage 1", event: "ഖവ്വാലി", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം URDU", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം ARABIC", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം മലയാളം", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "ഇസ്ലാമിക് ഗാനം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "SJR" }
        ]
    },
    {
        name: "MUHAMMED YASIR USTHAD",
        phone: "91 82813 71467",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 4", event: "കഥാകഥനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SNR" }
        ]
    },
    {
        name: "THAHIR AZHARI",
        phone: "91 70255 35401",
        schedule: [
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SNR" },
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "JNR" },
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "ഇസ്ലാമിക് ഗാനം", category: "JNR" }
        ]
    },
    {
        name: "UMAR AHMED NADWI",
        phone: "91 90485 74632",
        schedule: [
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 3", event: "കവിതാലാപനം ഉറുദു", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 2", event: "കവിതാലാപനം അറബി", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 2", event: "പ്രസംഗം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 3", event: "കവിതാലാപനം ഉറുദു", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Arabi -Mal)", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 3", event: "TED TALK (Arabic)", category: "GROUP" }
        ]
    },
    {
        name: "SHAHABAS AZHARI",
        phone: "91 70346 01531",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 4", event: "കഥാകഥനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 3", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 2", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 4", event: "കഥാകഥനം English", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "JNR" }
        ]
    },
    {
        name: "SHAKKEER MUHAMMED NADWI",
        phone: "91 97464 20638",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 2", event: "കവിതാലാപനം അറബി", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 2", event: "പ്രസംഗം ഉറുദു", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Urdu-Mal)", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 3", event: "ലൈവ് ട്രാൻസലേഷൻ(Ara-Mal)", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "12:00-1:00 PM", stage: "Stage 3", event: "Ted Talk (Arabic)", category: "GROUP" }
        ]
    },
    {
        name: "ANSHAD SIR",
        phone: "91 98479 58006",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 4", event: "കഥാകഥനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 3", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 4", event: "ലൈവ് ട്രാൻസലേഷൻ(Eng-Mal)", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 4", event: "കഥാകഥനം ENGLISH", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "JNR" }
        ]
    },
    {
        name: "SHAFEEK AZHARI",
        phone: "91 86062 19983",
        schedule: [
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 4", event: "കഥാകഥനം അറബി", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 5", event: "കവിതാലാപനം അറബി", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 5", event: "കവിതാലാപനം മലയാളം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 5", event: "കഥാകഥനം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 2", event: "നിമിഷ പ്രസംഗം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "10:00-11:00 AM", stage: "Stage 3", event: "മോണോലോഗ്", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 5", event: "കവിതാലാപനം അറബി", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SNR" }
        ]
    },
    {
        name: "SIMI TEACHER",
        phone: "91 98475 86818",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 2", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "SJR" }
        ]
    },
    {
        name: "RAMLA TEACHER",
        phone: "91 94461 68777",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 4", event: "ലൈവ് ട്രാൻസലേഷൻ(Eng-Mala)", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "കഥാകഥനം Malayalam", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "JNR" }
        ]
    },
    {
        name: "MUHAMMED JAMAL USTHAD",
        phone: "91 96051 31336",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 3", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 4", event: "ലൈവ് ട്രാൻസലേഷൻ(Eng-Mal)", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 3", event: "കവിതാലാപനം ഉറുദു", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 4", event: "പ്രസംഗം ഉറുദു", category: "SNR" }
        ]
    },
    {
        name: "MUFEED SIR",
        phone: "91 94968 40256",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 5", event: "കവിതാലാപനം മലയാളം", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 2", event: "നിമിഷ പ്രസംഗം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "10:00-11:00 AM", stage: "Stage 3", event: "മോണോലോഗ്", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SNR" }
        ]
    },
    {
        name: "ILYAS USTHAD",
        phone: "91 96568 85383",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "6:45-8:30 PM", stage: "Stage 1", event: "നാടകം", category: "GROUP" }
        ]
    },
    {
        name: "JALEEL SIR",
        phone: "91 8078 396 014",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 5", event: "കവിതാലാപനം മലയാളം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:45 PM", stage: "Stage 1", event: "സംഗീതശില്പം", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "10:00-11:00 AM", stage: "Stage 3", event: "മോണോലോഗ്", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "6:45-8:30 PM", stage: "Stage 1", event: "നാടകം", category: "GROUP" }
        ]
    },
    {
        name: "NAYEEF AZHARI",
        phone: "91 79029 35310",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "കഥാകഥനം Malayalam", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 2", event: "നിമിഷ പ്രസംഗം", category: "SJR" }
        ]
    },
    {
        name: "ALTHAF SIR",
        phone: "",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "3:15- 4:15 PM", stage: "Stage 2", event: "ഇസ്ലാമിക് ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം URDU", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം ARABIC", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "6:30-8:00 PM", stage: "Stage 1", event: "സംഘഗാനം മലയാളം", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "9:45-11:00 PM", stage: "Stage 1", event: "വട്ടപ്പാട്ട്", category: "GROUP" }
        ]
    },
    {
        name: "HARIS NENMARA",
        phone: "Haris Nemmara",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:45 PM", stage: "Stage 1", event: "സംഗീതശില്പം", category: "group" }
        ]
    },
    {
        name: "IBRAHIM PZ",
        phone: "",
        schedule: [
            { date: "Wednesday 24 December 2025", time: "6:45-8:30 PM", stage: "Stage 1", event: "നാടകം", category: "GROUP" }
        ]
    },
    {
        name: "SIDDIQ SIR",
        phone: "91 95397 56914",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:45 PM", stage: "Stage 1", event: "സംഗീതശില്പം", category: "group" },
            { date: "Tuesday 23 December 2025", time: "6:30-7:30 AM", stage: "Stage 5", event: "കഥാകഥനം Malayalam", category: "SJR" }
        ]
    },
    {
        name: "NOORUDHEEN AZHARI",
        phone: "91 97456 29954",
        schedule: [
            { date: "Monday 22 December 2025", time: "4:30-5:30 PM", stage: "Stage 4", event: "ഖുർആൻ പാരായണം", category: "JNR" },
            { date: "Monday 22 December 2025", time: "8:30-9:30 PM", stage: "Stage 4", event: "കഥാകഥനം അറബി", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 1", event: "ഖുർആൻ പാരായണം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "6:00-7:45 AM", stage: "Stage 1", event: "ഖുർആൻ പാരായണം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 5", event: "കവിതാലാപനം അറബി", category: "SJR" }
        ]
    },
    {
        name: "FIROZ MURABBI",
        phone: "91 98479 10444",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 5", event: "NEWS READING", category: "GROUP" }
        ]
    },
    {
        name: "MAHAD SIR",
        phone: "91 86062 43441",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 2", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 5", event: "NEWS READING", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 5", event: "കഥാകഥനം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SNR" }
        ]
    },
    {
        name: "ABDUL AZEEZ ALAVI",
        phone: "91 92074 01181",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 4", event: "പ്രസംഗം അറബി", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 6", event: "ഉറുദു ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 4", event: "ഉറുദു ഗാനം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "പ്രസംഗം അറബി", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "JNR" }
        ]
    },
    {
        name: "AJMAL ASLAM AZHARI",
        phone: "91 95672 00145",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "4:30-5:30 PM", stage: "Stage 2", event: "അറബി ഗാനം", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "കഥാകഥനം Malayalam", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 5", event: "NEWS READING", category: "GROUP" },
            { date: "Tuesday 23 December 2025", time: "3:00 - 4:00 PM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 4", event: "കഥാകഥനം ENGLISH", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 2", event: "പ്രസംഗം അറബി", category: "SNR" }
        ]
    }
];

export default function JudgesNotificationPage() {
    const [message, setMessage] = useState('');
    const [selectedJudge, setSelectedJudge] = useState<string>('all');
    const [isSending, setIsSending] = useState(false);
    const [lastSent, setLastSent] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredJudges = judgesSchedule.filter(judge =>
        judge.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendNotification = async () => {
        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        setIsSending(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/admin/judges/notify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message,
                    judgeName: selectedJudge === 'all' ? null : selectedJudge
                })
            });

            if (response.ok) {
                alert('Notification sent successfully to judges!');
                setMessage('');
                setLastSent(new Date());
            } else {
                const error = await response.json();
                alert(`Failed to send notification: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Judges Schedule & Notification</h1>
                <p className="text-gray-500 text-sm mt-1">
                    View judge schedules and send notifications
                    {lastSent && <span className="ml-2 text-xs opacity-75">Last sent: {lastSent.toLocaleString()}</span>}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{judgesSchedule.length}</div>
                        <p className="text-xs text-gray-500 mt-1">Registered judges</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {judgesSchedule.reduce((total, judge) => total + judge.schedule.length, 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Judging assignments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Notification Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell size={20} />
                        Send Notification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Judge Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Judge</label>
                        <select
                            value={selectedJudge}
                            onChange={(e) => setSelectedJudge(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Judges</option>
                            {judgesSchedule.map((judge, idx) => (
                                <option key={idx} value={judge.name}>{judge.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your notification message for judges..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {message.length} characters
                        </p>
                    </div>

                    {/* Send Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSendNotification}
                            disabled={isSending || !message.trim()}
                            className="gap-2"
                        >
                            <Send size={16} />
                            {isSending ? 'Sending...' : 'Send Notification'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder="Search judges by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Judge Schedules */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Judge Schedules</h2>
                {filteredJudges.map((judge, idx) => (
                    <Card key={idx}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{judge.name}</span>
                                {judge.phone && (
                                    <span className="text-sm font-normal text-gray-500 flex items-center gap-2">
                                        <Phone size={14} />
                                        {judge.phone}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-semibold">Date</th>
                                            <th className="text-left py-2 px-3 font-semibold">Time</th>
                                            <th className="text-left py-2 px-3 font-semibold">Stage</th>
                                            <th className="text-left py-2 px-3 font-semibold">Event</th>
                                            <th className="text-left py-2 px-3 font-semibold">Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {judge.schedule.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3">{formatDate(item.date)}</td>
                                                <td className="py-2 px-3">{item.time}</td>
                                                <td className="py-2 px-3">{item.stage}</td>
                                                <td className="py-2 px-3">{item.event}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.category === 'SNR' ? 'bg-blue-100 text-blue-700' :
                                                        item.category === 'JNR' ? 'bg-green-100 text-green-700' :
                                                            item.category === 'SJR' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
