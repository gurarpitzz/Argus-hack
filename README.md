<div align="center">
  <h1 align="center">ARGUS (DFAP)</h1>
  <p align="center">
    <b>Physics-Grounded Intelligence Platform for SIM-Box, Mule Network Detection & Cross-Domain Cyber Fraud Analytics</b>
  </p>
  <p align="center">
    <i>Chandigarh Police Hackathon 2026 — Track 6 Submission</i>
  </p>
</div>

---

## Executive Overview

**ARGUS (Digital Forensics & Analytics Platform - DFAP)** is an advanced, physics-grounded cyber intelligence platform engineered for law enforcement agencies and telecom security analysts. By unifying **Telecom Telemetry (CDR/IPDR)**, **Financial Genomics (Bank/UPI Statements)**, and **Cross-Domain Threat Intelligence**, ARGUS resolves coordinated fraud syndicates, illegal SIM-box operations, and money-mule networks into court-ready actionable evidence.

Traditional detection engines look at isolated behavioral signals which cyber-syndicates easily spoof. ARGUS introduces a **Multi-Dimensional Reality Consensus Model**: verifying physical hardware signals (RF propagation, cell tower handshakes, IMEI physical anomalies) against logical transaction flows (UPI velocity, fan-out ratios, temporal dispersion).

---

## Key Architecture & Highlights

### 1. Carrier-Grade 12-Layer Fusion Pipeline
* **Raw Ingestion Engine**: Unifies heterogeneous data streams (CDR/IPDR logs, bank CSV/XLS, device telemetry, APK metadata).
* **Telecom Hardware Physics (S-Layers & L-Layers)**: Detects physical SIM-box clustering, VoIP bypass routing, cell tower azimuth anomalies, and suspicious device handshakes.
* **Financial Genomics (FINOME)**: Maps transactional DNA, UPI flow topologies, mule account dispersion velocities, and layered cash-out patterns.
* **Bayesian Consensus Engine**: Computes mathematical consistency across physical and financial domains to eliminate false positives.

### 2. Core Operational Modules
* **Honeypot Tactical Radar HUD**: Real-time national map visualization of telemetry feeds, cell tower signal strength, and live threat vectors across Indian states.
* **Deception Genome & Tower Heatmap**: Interactive geographic density mapping for illegal SIM-box arrays and localized signal triangulation.
* **Breach Nexus & Entity Resolution**: Interactive graph matching linking IMEIs, IMSIs, bank accounts, UPI IDs, and physical addresses into unified suspect clusters.
* **Twin Syndicate (APK Lab)**: Malicious Android package decompiler and behavior scanner powered by Google Gemini AI for malware analysis (SMS hijackers, banking overlay apps).
* **Autonomous Deception Oracle**: Predictive threat engine calculating risk entropy, attack trajectory branching, and proactive defense countermeasures.

---

## Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion)
* **Visualization & Graphics**: Three.js, D3.js, Canvas HUD, Lucide React Icons
* **AI & Intelligence Engine**: Google Gemini API (`@google/genai`), Custom Aether Telemetry Engine
* **Backend Runtime**: Node.js, Express, TSX, ESBuild

---

## Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/gurarpitzz/Argus-Hack-CP.git
   cd Argus-Hack-CP
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal) to view ARGUS in action.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## Project Structure

```
remix-argus/
├── src/
│   ├── components/            # UI components (Radar HUD, Entity Resolution, APK Lab, etc.)
│   ├── lib/
│   │   ├── aetherEngine.ts    # Synthetic telemetry, risk scoring & stream state engine
│   │   └── gemini.ts          # Gemini AI integration for APK analysis & threat insights
│   ├── App.tsx                # Master dashboard entry point & view switcher
│   └── index.css              # Global design system, glassmorphism & HUD styling
├── server.ts                  # Express server entry point
├── generate_datasets.py       # Data generation script for synthetic CDR/Bank telemetry
├── system_telemetry.csv       # Sample system telemetry dataset
├── attacker_logs.csv          # Sample honeypot attack logs
└── deception_responses.csv   # Dynamic deception engine responses
```

---

## Presentation & Track 6 Alignment
* **Track 6**: Chandigarh Police Hackathon 2026 — DFAP (Single Analytics Platform for CDR/IPDR, Bank Statements & Digital Footprints)
* **Team**: ARGUS
* **Lead Developer**: Gurarpit Singh (Vivekananda Institute of Professional Studies, GGSIPU Delhi)

---

## License
This project is developed for the Chandigarh Police Hackathon 2026. All rights reserved.
