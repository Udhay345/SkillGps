"use client";
import { useState, useEffect } from "react";
import { useStudent } from "@/lib/StudentContext";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { 
    FileText, Plus, Upload, CheckCircle, Clock, AlertCircle, 
    ChevronRight, ExternalLink, X, Award, ShieldCheck, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificationsPage() {
    const { student, setStudent } = useStudent();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [issuer, setIssuer] = useState("");
    const [date, setDate] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !student.id) return;

        setUploading(true);
        try {
            const fileId = crypto.randomUUID();
            const storageRef = ref(storage, `certificates/${student.id}/${fileId}_${file.name}`);
            
            // 1. Upload to Storage
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Prepare Certificate Object
            const newCert = {
                id: fileId,
                title,
                issuer,
                date,
                fileUrl: downloadURL,
                status: 'pending' as const,
                createdAt: new Date().toISOString()
            };

            // 3. Update Firestore
            const studentRef = doc(db, "students", student.id);
            await updateDoc(studentRef, {
                certificates: arrayUnion(newCert)
            });

            // 4. Update Local State
            setStudent({
                ...student,
                certificates: [...(student.certificates || []), newCert]
            });

            // Reset Form and State
            setIsUploadModalOpen(false);
            setFile(null);
            setTitle("");
            setIssuer("");
            setDate("");
            alert("Certificate uploaded successfully! Awaiting admin verification.");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>
                        My <span style={{ color: "var(--accent)" }}>Certifications</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                        Manage your professional credentials and track verification status.
                    </p>
                </div>
                <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    style={{ 
                        background: "var(--accent)", color: "white", border: "none", 
                        padding: "12px 24px", borderRadius: 12, display: "flex", 
                        alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500,
                        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)"
                    }}
                >
                    <Plus size={20} /> Upload New
                </button>
            </div>

            {/* Status Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
                {[
                    { label: "Total", count: student.certificates?.length || 0, color: "white", icon: <FileText size={20} /> },
                    { label: "Verified", count: student.certificates?.filter(c => c.status === 'verified').length || 0, color: "#39d353", icon: <CheckCircle size={20} /> },
                    { label: "Pending", count: student.certificates?.filter(c => c.status === 'pending').length || 0, color: "#FFD700", icon: <Clock size={20} /> },
                    { label: "Rejected", count: student.certificates?.filter(c => c.status === 'rejected').length || 0, color: "#ff4d4d", icon: <AlertCircle size={20} /> },
                ].map((stat, i) => (
                    <div key={i} style={{ 
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", 
                        padding: "20px", borderRadius: 20, display: "flex", alignItems: "center", gap: 16
                    }}>
                        <div style={{ color: stat.color }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)" }}>{stat.count}</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {!student.certificates || student.certificates.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", background: "rgba(255,255,255,0.01)", borderRadius: 24, border: "2px dashed rgba(255,255,255,0.05)" }}>
                        <Upload size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                        <p>No certificates uploaded yet. Add your first achievement!</p>
                    </div>
                ) : (
                    student.certificates.sort((a,b) => b.id.localeCompare(a.id)).map((cert) => (
                        <div key={cert.id} style={{ 
                            background: "rgba(20, 20, 25, 0.4)", border: "1px solid rgba(255,255,255,0.05)", 
                            padding: "24px", borderRadius: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
                            transition: "all 0.2s"
                        }} className="hover-scale">
                            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                <div style={{ 
                                    width: 50, height: 50, borderRadius: 12, background: "rgba(37, 99, 235, 0.1)", 
                                    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" 
                                }}>
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{cert.title}</h3>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", gap: 12 }}>
                                        <span>{cert.issuer}</span>
                                        <span style={{ opacity: 0.3 }}>|</span>
                                        <span>{cert.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ 
                                    display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600,
                                    padding: "6px 12px", borderRadius: 100,
                                    background: cert.status === 'verified' ? "rgba(57, 211, 83, 0.1)" : cert.status === 'pending' ? "rgba(255, 215, 0, 0.1)" : "rgba(255, 77, 77, 0.1)",
                                    color: cert.status === 'verified' ? "#39d353" : cert.status === 'pending' ? "#FFD700" : "#ff4d4d",
                                    border: `1px solid ${cert.status === 'verified' ? "rgba(57, 211, 83, 0.2)" : cert.status === 'pending' ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 77, 77, 0.2)"}`
                                }}>
                                    {cert.status === 'verified' ? <ShieldCheck size={14} /> : cert.status === 'pending' ? <Clock size={14} /> : <AlertCircle size={14} />}
                                    {cert.status.toUpperCase()}
                                </div>

                                <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none" }} className="hover-blue">
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)" }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", width: "100%", maxWidth: 500, borderRadius: 24, padding: 32, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)" }}>Upload Certificate</h2>
                                <button onClick={() => setIsUploadModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X /></button>
                            </div>

                            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 8 }}>Certificate Title</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px 16px", borderRadius: 12, outline: "none" }}
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 8 }}>Issuer</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. Amazon Web Services"
                                            value={issuer}
                                            onChange={(e) => setIssuer(e.target.value)}
                                            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px 16px", borderRadius: 12, outline: "none" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 8 }}>Date Issued</label>
                                        <input 
                                            required
                                            type="date" 
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px 16px", borderRadius: 12, outline: "none" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 8 }}>File (PDF, PNG, JPG)</label>
                                    <div style={{ position: "relative", height: 120, border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                        <input 
                                            required
                                            type="file" 
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                                        />
                                        <div style={{ textAlign: "center", pointerEvents: "none" }}>
                                            {file ? (
                                                <div style={{ color: "var(--accent)", fontWeight: 500 }}>{file.name}</div>
                                            ) : (
                                                <div style={{ color: "var(--text-muted)" }}>
                                                    <Upload size={24} style={{ marginBottom: 8, display: "block", margin: "0 auto" }} />
                                                    Click to Choose File
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={uploading}
                                    type="submit"
                                    style={{ 
                                        width: "100%", background: "var(--accent)", color: "white", 
                                        border: "none", padding: "14px", borderRadius: 12, 
                                        marginTop: 8, cursor: uploading ? "not-allowed" : "pointer",
                                        fontWeight: 600, display: "flex", alignItems: "center", 
                                        justifyContent: "center", gap: 10, opacity: uploading ? 0.7 : 1
                                    }}
                                >
                                    {uploading ? "Uploading..." : <><Upload size={18} /> Upload Certificate</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

