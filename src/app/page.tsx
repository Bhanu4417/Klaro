import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { ProblemComparison } from "../components/landing/ProblemComparison";
import { HowItWorks } from "../components/landing/HowItWorks";
import { ComplianceAnalysis } from "../components/landing/ComplianceAnalysis";
import { EvidenceEngine } from "../components/landing/EvidenceEngine";
import { EnforcementDashboard } from "../components/landing/EnforcementDashboard";
import { ReportDossier } from "../components/landing/ReportDossier";
import { EcommerceSection } from "../components/landing/EcommerceSection";
import { FinalCta } from "../components/landing/FinalCta";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans selection:bg-[#94EC40] selection:text-[rgb(18,18,18)] overflow-x-hidden">
      {/* 1. Global Legal Metrology Navigation */}
      <Navbar />

      {/* 2. Hero Section: "Inspect smarter. Enforce faster." */}
      <Hero />

      {/* 3. The Problem: Manual vs AI Automated Inspection */}
      <ProblemComparison />

      {/* 4. How It Works: Capture -> Extract -> Validate -> Report */}
      <HowItWorks />

      {/* 5. Compliance Analysis: Interactive LMPC Rule 6 Verification */}
      <ComplianceAnalysis />

      {/* 6. Evidence Engine: Auditable Coordinates & Rule Citations */}
      <EvidenceEngine />

      {/* 7. Officer Enforcement Dashboard: Jurisdiction Analytics & Logs */}
      <EnforcementDashboard />

      {/* 8. Digital Inspection Report Dossier: Court-Ready Evidence */}
      <ReportDossier />

      {/* 9. E-Commerce & Marketplace Surveillance under Rule 6(10) */}
      <EcommerceSection />

      {/* 10. Final Call to Action */}
      <FinalCta />

      {/* 11. Minimal Footer */}
      <Footer />
    </div>
  );
}
