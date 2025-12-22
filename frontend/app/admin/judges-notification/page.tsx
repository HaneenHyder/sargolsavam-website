'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Phone, Send } from 'lucide-react';

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
        phone: "+91 81398 60760",
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
        phone: "+91 75618 67458",
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
        phone: "+91 94004 27270",
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
        phone: "+91 97464 20638",
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
        phone: "+91 94464 29571",
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
        phone: "+91 79025 47541",
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
        phone: "+91 7592 051 248",
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
        phone: "+91 82813 71467",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "7:00-8:00 AM", stage: "Stage 4", event: "കഥാകഥനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "7:30-8:30 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "JNR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SNR" }
        ]
    },
    {
        name: "THAHIR AZHARI",
        phone: "+91 70255 35401",
        schedule: [
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SNR" },
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "JNR" },
            { date: "Tuesday 22 December 2025", time: "8:30-10:00 PM", stage: "Stage 1", event: "മാപ്പിളപ്പാട്ട്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "ഇസ്ലാമിക് ഗാനം", category: "JNR" }
        ]
    },
    {
        name: "UMAR AHMED NADWI",
        phone: "+91 90485 74632",
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
        phone: "+91 70346 01531",
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
        phone: "+91 97464 20638",
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
        phone: "+91 98479 58006",
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
        phone: "+91 86062 19983",
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
        phone: "+91 98475 86818",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:30 AM", stage: "Stage 5", event: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "JNR" },
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 2", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "2:15-3:15 PM", stage: "Stage 5", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 4", event: "കവിതാലാപനം മലയാളം", category: "SJR" }
        ]
    },
    {
        name: "RAMLA TEACHER",
        phone: "+91 94461 68777",
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
        phone: "+91 96051 31336",
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
        phone: "+91 94968 40256",
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
        phone: "+91 96568 85383",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "2:00 - 4:00 PM", stage: "Stage 3", event: "മോണോലോഗ്", category: "SNR" },
            { date: "Wednesday 24 December 2025", time: "6:45-8:30 PM", stage: "Stage 1", event: "നാടകം", category: "GROUP" }
        ]
    },
    {
        name: "JALEEL SIR",
        phone: "+91 8078 396 014",
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
        phone: "+91 79029 35310",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "11:00-12:00 PM", stage: "Stage 4", event: "കഥാകഥനം Malayalam", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 2", event: "നിമിഷ പ്രസംഗം", category: "SJR" }
        ]
    },
    {
        name: "ALTHAF SIR",
        phone: "+91 81578 90936",
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
        phone: "+91 81290 59309",
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
        phone: "+91 95397 56914",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "8:30-9:45 PM", stage: "Stage 1", event: "സംഗീതശില്പം", category: "group" },
            { date: "Tuesday 23 December 2025", time: "6:30-7:30 AM", stage: "Stage 5", event: "കഥാകഥനം Malayalam", category: "SJR" }
        ]
    },
    {
        name: "NOORUDHEEN AZHARI",
        phone: "+91 97456 29954",
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
        phone: "+91 98479 10444",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 5", event: "NEWS READING", category: "GROUP" }
        ]
    },
    {
        name: "MAHAD SIR",
        phone: "+91 86062 43441",
        schedule: [
            { date: "Tuesday 23 December 2025", time: "9:45-10:45 AM", stage: "Stage 2", event: "കവിതാലാപനം ഇംഗ്ലീഷ്", category: "SNR" },
            { date: "Tuesday 23 December 2025", time: "12:15-01:15 PM", stage: "Stage 5", event: "NEWS READING", category: "GROUP" },
            { date: "Wednesday 24 December 2025", time: "6:30-7:30 AM", stage: "Stage 5", event: "കഥാകഥനം മലയാളം", category: "SJR" },
            { date: "Wednesday 24 December 2025", time: "9:00-10:00 AM", stage: "Stage 3", event: "പ്രസംഗം മലയാളം", category: "SNR" }
        ]
    },
    {
        name: "ABDUL AZEEZ ALAVI",
        phone: "+91 92074 01181",
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
        phone: "+91 95672 00145",
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
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationStatus, setNotificationStatus] = useState<{ [key: string]: string }>(() => {
        // Initialize all judges with 'Pending' status
        const initialStatus: { [key: string]: string } = {};
        judgesSchedule.forEach(judge => {
            initialStatus[judge.name] = 'Pending';
        });
        return initialStatus;
    });

    // Track notification status for each event
    const [eventNotificationStatus, setEventNotificationStatus] = useState<{ [key: string]: string }>(() => {
        const initialStatus: { [key: string]: string } = {};
        judgesSchedule.forEach(judge => {
            judge.schedule.forEach((_, idx) => {
                const eventKey = `${judge.name}-${idx}`;
                initialStatus[eventKey] = 'Pending';
            });
        });
        return initialStatus;
    });

    const filteredJudges = judgesSchedule.filter(judge =>
        judge.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNotify = (judgeName: string, phone: string) => {
        if (!phone) {
            alert(`No phone number available for ${judgeName}`);
            return;
        }
        // TODO: Implement actual notification logic (SMS/WhatsApp)
        alert(`Notification sent to ${judgeName} at ${phone}`);
        // Update status to 'Notified'
        setNotificationStatus(prev => ({
            ...prev,
            [judgeName]: 'Notified'
        }));
    };

    const handleStatusChange = (judgeName: string, newStatus: string) => {
        setNotificationStatus(prev => ({
            ...prev,
            [judgeName]: newStatus
        }));
    };

    // Handle per-event notification
    const handleEventNotify = (judgeName: string, phone: string, eventIdx: number, eventName: string, date: string, time: string) => {
        if (!phone) {
            alert(`No phone number available for ${judgeName}`);
            return;
        }
        const eventKey = `${judgeName}-${eventIdx}`;
        // TODO: Implement actual notification logic (SMS/WhatsApp)
        alert(`Notification sent to ${judgeName} at ${phone}\nEvent: ${eventName}\nDate: ${formatDate(date)}\nTime: ${time}`);
        // Update event status to 'Notified'
        setEventNotificationStatus(prev => ({
            ...prev,
            [eventKey]: 'Notified'
        }));
    };

    // Handle per-event status change
    const handleEventStatusChange = (judgeName: string, eventIdx: number, newStatus: string) => {
        const eventKey = `${judgeName}-${eventIdx}`;
        setEventNotificationStatus(prev => ({
            ...prev,
            [eventKey]: newStatus
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Judges Schedule</h1>
                <p className="text-gray-500 text-sm mt-1">
                    View judge event schedules and assignments
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
                            {/* Notification Control Row */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-gray-700">Notification Status:</label>
                                        <select
                                            value={notificationStatus[judge.name] || 'Pending'}
                                            onChange={(e) => handleStatusChange(judge.name, e.target.value)}
                                            className={`px-3 py-1.5 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${notificationStatus[judge.name] === 'Pending' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                                                notificationStatus[judge.name] === 'Notified' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                                                    'bg-green-50 border-green-300 text-green-700'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Notified">Notified</option>
                                            <option value="Confirmed">Confirmed</option>
                                        </select>
                                    </div>
                                    <Button
                                        onClick={() => handleNotify(judge.name, judge.phone)}
                                        size="sm"
                                        className="gap-2"
                                        disabled={!judge.phone}
                                    >
                                        <Send size={14} />
                                        Notify Judge
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-semibold">Date</th>
                                            <th className="text-left py-2 px-3 font-semibold">Time</th>
                                            <th className="text-left py-2 px-3 font-semibold">Stage</th>
                                            <th className="text-left py-2 px-3 font-semibold">Event</th>
                                            <th className="text-left py-2 px-3 font-semibold">Category</th>
                                            <th className="text-left py-2 px-3 font-semibold">Status</th>
                                            <th className="text-center py-2 px-3 font-semibold">Notify</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {judge.schedule.map((item, itemIdx) => {
                                            const eventKey = `${judge.name}-${itemIdx}`;
                                            const currentStatus = eventNotificationStatus[eventKey] || 'Pending';

                                            return (
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
                                                    <td className="py-2 px-3">
                                                        <select
                                                            value={currentStatus}
                                                            onChange={(e) => handleEventStatusChange(judge.name, itemIdx, e.target.value)}
                                                            className={`px-2 py-1 border rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary ${currentStatus === 'Pending' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                                                                    currentStatus === 'Notified' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                                                                        'bg-green-50 border-green-300 text-green-700'
                                                                }`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Notified">Notified</option>
                                                            <option value="Confirmed">Confirmed</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <Button
                                                            onClick={() => handleEventNotify(judge.name, judge.phone, itemIdx, item.event, item.date, item.time)}
                                                            size="sm"
                                                            className="gap-1 text-xs px-2 py-1"
                                                            disabled={!judge.phone}
                                                        >
                                                            <Send size={12} />
                                                            Notify
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
