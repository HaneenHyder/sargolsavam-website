const db = require('./src/db');

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

async function seedJudges() {
    console.log('🌱 Seeding Judges Data...');
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Clear existing data to avoid duplicates (optional, but good for idempotency)
        // Note: TRUNCATE CASCADE will clear assignments too
        const tablesExist = await client.query(`
            SELECT EXISTS (
               SELECT FROM information_schema.tables 
               WHERE  table_schema = 'public'
               AND    table_name   = 'judges'
            );
        `);

        if (tablesExist.rows[0].exists) {
            console.log('Clearing existing judges table...');
            await client.query('TRUNCATE TABLE judges CASCADE');
        } else {
            console.log('Judges table does not exist, skipping truncate.');
        }

        for (const judge of judgesSchedule) {
            // Insert judge
            const judgeRes = await client.query(
                'INSERT INTO judges (name, phone) VALUES ($1, $2) RETURNING id',
                [judge.name, judge.phone]
            );
            const judgeId = judgeRes.rows[0].id;

            // Insert assignments
            for (const item of judge.schedule) {
                await client.query(
                    'INSERT INTO judge_assignments (judge_id, date, time, stage, event_name, category) VALUES ($1, $2, $3, $4, $5, $6)',
                    [judgeId, item.date, item.time, item.stage, item.event, item.category]
                );
            }
        }

        await client.query('COMMIT');
        console.log(`✅ Seeded ${judgesSchedule.length} judges successfully!`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Failed to seed judges:', err);
        throw err;
    } finally {
        client.release();
        await db.pool.end(); // close pool to let script exit
    }
}

seedJudges();
