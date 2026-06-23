# IndusBrain AI: Unified Asset & Operations Brain

**IndusBrain AI** is a premium, high-fidelity interactive prototype designed to address the critical knowledge fragmentation crisis in asset-intensive industries. Inspired by the 2024 McKinsey survey showing professionals waste 35% of their working hours searching for siloed details, this platform acts as a unified semantic brain connecting documents, specifications, regulations, and live telemetry.

---

## 🚀 The Industrial Problem Context
- **Siloed Systems:** Large plants typically operate across 7 to 12 disconnected document repositories (P&IDs, ERP, SAP, logs, emails, scans).
- **Downtime:** 18–22% of unplanned downtime in heavy industry is driven by maintenance decisions made without complete asset history or context.
- **The Knowledge Cliff:** 25% of experienced industrial operators are retiring this decade, taking undocumented operational experience with them.

---

## 🛠️ Feature Modules

### 1. Unified Operations Dashboard
- **Aggregate Metrics:** Monitors ingested document count, active knowledge graph nodes, safety compliance score, and unplanned downtime.
- **Critical Warning Stream:** Alerts operators to sticking valves, overdue safety certifications, and links details directly to SOPs or drawings.
- **Silo Coverage Meter:** Inspects integration percentages across historical data storage spaces.

### 2. Universal Ingestion & Interactive Knowledge Graph
- **Canvas Physics Simulation:** Built using a custom 2D force-directed physics engine. Nodes represent Assets, Docs, Regulations, and Events. Drag, hover, zoom, and click nodes to open relation-manifest sidebars.
- **OCR Tag Extraction:** Drop any document (PDF/Scan) to trigger a simulated multimodal OCR layout extraction (LayoutLMv3/PaddleOCR format) and watch it **automatically spawn new nodes and links in the live graph**!

### 3. Expert Knowledge Copilot (Desktop & Field Mobile)
- **RAG-Powered Chat:** Answers complex maintenance, operations, and compliance queries with clickable citations and confidence metrics.
- **Rugged Field Mobile View:** Toggle viewport to wrap the interface in a shockproof field tablet layout with voice command and barcode scanner mockups.

### 4. Maintenance Diagnostics & RCA Agent
- **Asset Profiles:** Check detailed telemetry logs for `PMP-101` (Pump), `VLV-204` (Valve), and `BLR-302` (Boiler).
- **RCA Diagram Generator:** Input logged incidents to compile a **5-Whys Chain** and render a graphic **Ishikawa (Fishbone) Diagram** detailing Manpower, Machine, Method, and Material causes alongside CAPA items.

### 5. Quality & Regulatory Compliance Intelligence
- **Regulatory Gap Auditor:** Flags active compliance breaches (OISD, PESO, Indian Factory Act 1948).
- **Evidence Package Compiler:** Aggregates SOPs, logs, and manuals into a verified audit bundle with SHA-256 checksums, ready to download.

### 6. Lessons Learned & Failure Intelligence
- **Failure Heatmap:** Interactive correlation matrix mapping component issues (shafts, tubes, seals) to physical variables (vibration, heat, viscosity).
- **Proactive Bulletins:** Automatically parses external safety databases to warn crews of scaling risk patterns.

---

## 💻 Technology Stack
- **Frontend:** Semantic HTML5, Vanilla CSS3 (custom variables, glassmorphic layout rules, CSS grids), ES6 Vanilla JS.
- **Vector Icons:** Lucide Icons (loaded via CDN).
- **Graph & Diagrams:** HTML5 Canvas API (custom force-directed rendering loops and Fishbone charts).
- **Development Server:** Python-based HTTP server.

---

## 🏃 Local Run Instructions

1. **Verify Python is installed:**
   ```bash
   python --version
   ```

2. **Start the local server:**
   Navigate to the project folder and run:
   ```bash
   python server.py
   ```

3. **View the application:**
   Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)
