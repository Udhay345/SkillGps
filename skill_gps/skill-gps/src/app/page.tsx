"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { platformStats } from "@/lib/data";
import { Shield, Users, TrendingUp, BookOpen } from "lucide-react";

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "For Institutions", href: "#institutions" },
  { label: "Blog", href: "#blog" },
];

const FEATURES = [
  {
    title: "Skill DNA Analysis",
    desc: "Visualize your core competencies across 6 dimensions with clear data points.",
  },
  {
    title: "Career Simulation",
    desc: "Simulate your readiness score by adding projects, internships and achievements.",
  },
  {
    title: "Skill Gap Alerts",
    desc: "Receive actionable insights on missing skills with direct learning paths.",
  },
  {
    title: "Smart Roadmap",
    desc: "Semester-by-semester organized roadmap tailored to your specific goals.",
  },
  {
    title: "AI Career Mentor",
    desc: "Context-aware models that understand your professional profile and skill level.",
  },
  {
    title: "Resume Score",
    desc: "ATS-optimized scoring with section-by-section improvement suggestions.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Select Institution",
    desc: "Verify your position through your official college or university id.",
  },
  {
    step: "02",
    title: "Build Profile",
    desc: "Populate academic info, side projects and professional interests.",
  },
  {
    step: "03",
    title: "Algorithm Analyzes",
    desc: "Our models process your inputs to map strengths & identify optimal paths.",
  },
  {
    step: "04",
    title: "Navigate",
    desc: "Follow the precise roadmap provided to achieve your professional milestones.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    college: "VIT Vellore",
    role: "Software Engineer",
    quote: "Skill GPS pinpointed exactly what I lacked before placement season. Tracking the roadmap got me multiple offers.",
  },
  {
    name: "Rahul Mehta",
    college: "NIT Trichy",
    role: "AI Engineer",
    quote: "The simulation metric changed everything. Adding my side projects accurately reflected my readiness for ML roles.",
  },
  {
    name: "Divya S",
    college: "BITS Pilani",
    role: "Data Scientist",
    quote: "Having the AI review my GitHub repositories provided me the exact technical feedback I couldn't get from peers.",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targets = [42800, 180, 1200, 8500];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounters(targets.map((t) => Math.floor((t * step) / steps)));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ======================== NAVBAR ======================== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 5%",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(250,249,246,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-color)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <Image src={logo} alt="Skill GPS Logo" width={32} height={32} className="rounded-md" />
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.2rem", color: "var(--text-primary)" }}>
            Skill GPS
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hide-mobile">
          {NAV_LINKS.map((link) =>
            link.label === "For Institutions" ? (
              <Link
                key={link.label}
                href="/admin"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <Shield size={14} />
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/signin" className="btn-ghost">
            Sign In
          </Link>
          <Link href="/onboarding" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ======================== HERO ======================== */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 5% 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", marginTop: "40px" }}>
          {/* Badge */}
          <div style={{ marginBottom: 32 }}>
            <span className="badge">
              Career Development Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 32,
              color: "var(--text-primary)",
            }}
          >
            Navigate your career <br />
            <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>with precision.</span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: 640,
              margin: "0 auto 48px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Skill GPS analyzes your academic background and interests to identify knowledge gaps, generating personalized trajectory maps to reach your professional goals.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/onboarding" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              Start your journey
            </Link>
          </div>
        </div>

        {/* Clean minimal showcase */}
        <div style={{ position: "relative", marginTop: 40, width: "100%", maxWidth: 1000 }}>
          <div
            className="glass-card"
            style={{
              width: "100%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "var(--bg-secondary)",
              borderRadius: "24px"
            }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Platform Activity
            </div>
            <div style={{ display: "flex", gap: 60, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", color: "var(--text-primary)" }}>85%</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Technical Score Average</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", color: "var(--text-primary)" }}>48%</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Current Readiness</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", color: "var(--text-primary)" }}>{Math.floor(counters[0] / 1000)}k+</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Users Onboarded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== PLATFORM FEATURES ======================== */}
      <section id="features" style={{ padding: "120px 5%", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, marginBottom: 24 }}>
              Intelligent metrics.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
              A suite of analytical tools designed to give clarity and direction to your professional path.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: "40px",
                  cursor: "default",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.4rem", marginBottom: 16, color: "var(--text-primary)" }}>
                  {feat.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== WORKFLOW ======================== */}
      <section id="platform" style={{ padding: "120px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, marginBottom: 24 }}>
              The process.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 40 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ padding: "24px 0" }}>
                <div style={{ fontFamily: "var(--font-serif)", color: "var(--text-muted)", fontSize: "2rem", marginBottom: 16 }}>
                  {step.step}
                </div>
                <h3 style={{ fontWeight: 500, fontSize: "1.1rem", marginBottom: 12, color: "var(--text-primary)" }}>{step.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section style={{ padding: "120px 5%", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400 }}>
              Member stories.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: "40px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "var(--border-color)", lineHeight: 0.5, marginBottom: 24, marginTop: 10 }}>&quot;</div>
                <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 40, fontStyle: "italic" }}>
                  {t.quote}
                </p>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.95rem", color: "var(--text-primary)" }}>{t.name}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
                    {t.college} — {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== INSTITUTIONS ======================== */}
      <section id="institutions" style={{ padding: "120px 5%", background: "var(--bg-primary)", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 24 }}>
                <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Shield size={14} /> For Institutions
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: 24 }}>
                Empower your<br />
                <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>institution.</span>
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40 }}>
                Register your institution on Skill GPS to give your students access to AI-powered career analytics, skill gap tracking, and personalized roadmaps. As an admin, manage your entire student cohort from a single dashboard.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/admin" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Shield size={18} /> Access Admin Portal
                </Link>
                <a href="#features" className="btn-ghost" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                  Learn More
                </a>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { icon: <Users size={28} />, title: "Student Management", desc: "Add, monitor, and manage your entire student cohort from one dashboard.", color: "#3B82F6" },
                { icon: <TrendingUp size={28} />, title: "Career Analytics", desc: "Track career readiness scores and placement probability for each student.", color: "#A855F7" },
                { icon: <BookOpen size={28} />, title: "Academic Insights", desc: "Monitor CGPA trends, attendance, and skill gap progression over time.", color: "#39d353" },
                { icon: <Shield size={28} />, title: "Secure Portal", desc: "Role-based access with dedicated admin credentials and data privacy.", color: "#FF8C00" },
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{ padding: "28px", background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
                  <div style={{ color: item.color, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 8, color: "var(--text-primary)" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section style={{ padding: "120px 5%", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, marginBottom: 32 }}>
          Begin mapping your path.
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/onboarding" className="btn-primary" style={{ padding: "16px 40px", fontSize: "1.05rem", display: "inline-block" }}>
            Get Started as Student
          </Link>
          <Link href="/admin" className="btn-ghost" style={{ padding: "16px 40px", fontSize: "1.05rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Shield size={18} /> Institution Portal
          </Link>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "60px 5%", background: "var(--bg-primary)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image src={logo} alt="Skill GPS Logo" width={24} height={24} className="grayscale" />
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1rem", color: "var(--text-primary)" }}>
              Skill GPS
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} Skill GPS. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
