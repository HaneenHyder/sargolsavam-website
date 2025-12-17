'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5000/api/admin/import-candidates', {
                method: 'POST',
                body: formData // Content-Type header skipped for FormData to let browser set boundary
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Import Candidates</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Excel/CSV</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Input
                                type="file"
                                accept=".xlsx,.csv"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="max-w-xs mx-auto"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Upload a file with columns: chest_no, name, team_code, division, class, contact
                            </p>
                        </div>
                        <Button type="submit" disabled={!file || uploading}>
                            {uploading ? 'Importing...' : 'Start Import'}
                        </Button>
                    </form>

                    {result && (
                        <div className="mt-8 p-4 bg-gray-50 rounded border">
                            <h3 className="font-bold mb-2">Import Summary</h3>
                            <p>Added: {result.added}</p>
                            <p>Updated: {result.updated}</p>
                            {result.errors && result.errors.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-bold text-red-600">Errors ({result.errors.length})</h4>
                                    <ul className="text-sm text-red-500 list-disc list-inside max-h-40 overflow-y-auto">
                                        {result.errors.map((err: any, idx: number) => (
                                            <li key={idx}>
                                                Chest No {err.chest_no}: {err.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
