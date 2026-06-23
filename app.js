/* -------------------------------------------------------------
   IndusBrain AI - Unified Asset & Operations Brain
   Application Logic
------------------------------------------------------------- */

// Global App Namespace
const app = {
    state: {
        activeTab: 'dashboard',
        theme: 'dark',
        graph: {
            nodes: [],
            links: [],
            zoom: 1,
            pan: { x: 0, y: 0 },
            draggedNode: null,
            hoveredNode: null,
            selectedNode: null,
            filterType: 'all',
            simulationRunning: true
        },
        chatHistory: {
            desktop: [],
            mobile: []
        },
        activeAsset: 'PMP-101',
        activeSlide: 1,
        activePitchTab: 'slides'
    },

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    init() {
        this.initDOM();
        this.initTabs();
        this.initTheme();
        this.initLiveClock();
        this.initGraphData();
        this.initGraphCanvas();
        this.initIngestSimulation();
        this.initCopilot();
        this.initRCA();
        this.initCompliance();
        this.initSlides();

        // Render initially
        this.updateStats();
        this.renderTimeline('PMP-101');
        lucide.createIcons();
    },

    initDOM() {
        this.dom = {
            tabs: document.querySelectorAll('.nav-item'),
            sections: document.querySelectorAll('.view-section'),
            themeToggle: document.querySelector('.theme-toggle'),
            liveClock: document.getElementById('live-clock'),
            globalSearch: document.getElementById('global-search'),
            
            // Ingest
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            extractionConsole: document.getElementById('extraction-console'),
            
            // Graph
            graphCanvas: document.getElementById('graph-canvas'),
            graphSearch: document.getElementById('graph-search'),
            filterChips: document.querySelectorAll('.filter-chip'),
            zoomIn: document.getElementById('zoom-in'),
            zoomOut: document.getElementById('zoom-out'),
            zoomReset: document.getElementById('zoom-reset'),
            nodeDetailOverlay: document.getElementById('node-detail-overlay'),
            closeOverlayBtn: document.getElementById('close-overlay-btn'),
            overlayNodeTitle: document.getElementById('overlay-node-title'),
            overlayNodeType: document.getElementById('overlay-node-type'),
            overlayNodeMeta: document.getElementById('overlay-node-meta'),
            overlayRelationsList: document.getElementById('overlay-relations-list'),
            overlayRelationsCount: document.getElementById('overlay-relations-count'),
            overlayNodeIcon: document.getElementById('overlay-node-icon'),

            // Copilot
            copilotContainer: document.getElementById('copilot-container'),
            viewDesktopBtn: document.getElementById('view-desktop'),
            viewMobileBtn: document.getElementById('view-mobile'),
            desktopCopilot: document.getElementById('desktop-copilot'),
            mobileCopilot: document.getElementById('mobile-copilot'),
            desktopChatInput: document.getElementById('desktop-chat-input'),
            desktopSendBtn: document.getElementById('desktop-send-btn'),
            desktopChatMessages: document.getElementById('desktop-chat-messages'),
            mobileChatInput: document.getElementById('mobile-chat-input-text'),
            mobileSendBtn: document.getElementById('mobile-send-btn'),
            mobileChatMessages: document.getElementById('mobile-chat-messages'),
            quickQueryBtns: document.querySelectorAll('.quick-query-btn'),
            voiceInputBtn: document.getElementById('voice-input-btn'),
            scanQrBtn: document.getElementById('scan-qr-btn'),

            // Maintenance
            assetCards: document.querySelectorAll('.asset-profile-card'),
            diagTabs: document.querySelectorAll('.diag-tab'),
            diagTabContents: document.querySelectorAll('.diag-tab-content'),
            rcaIncidentSelect: document.getElementById('rca-incident-select'),
            btnGenerateRCA: document.getElementById('btn-generate-rca'),
            whysFlowContainer: document.getElementById('whys-flow-container'),
            fishboneCanvas: document.getElementById('fishbone-canvas'),
            rcaCapaList: document.getElementById('rca-capa-list'),
            valVibe: document.getElementById('val-vibe'),
            valTemp: document.getElementById('val-temp'),
            valFlow: document.getElementById('val-flow'),
            predictiveRec: document.getElementById('predictive-rec'),
            assetTimeline: document.getElementById('asset-timeline'),

            // Compliance
            evAsset: document.getElementById('ev-asset'),
            evReg: document.getElementById('ev-reg'),
            btnGenerateEvidence: document.getElementById('btn-generate-evidence'),
            evidenceResult: document.getElementById('evidence-result'),
            evidenceManifestList: document.getElementById('evidence-manifest-list'),
            btnDownloadEvidence: document.getElementById('btn-download-evidence'),

            // Pitch Deck
            pitchTabs: document.querySelectorAll('.pitch-tab'),
            pitchTabContents: document.querySelectorAll('.pitch-tab-content'),
            slidesViewport: document.getElementById('slides-viewport'),
            slideItems: document.querySelectorAll('.slide-item'),
            prevSlideBtn: document.getElementById('prev-slide'),
            nextSlideBtn: document.getElementById('next-slide'),
            slidesBullets: document.getElementById('slides-bullets')
        };
    },

    // -------------------------------------------------------------
    // General Handlers & Live clock
    // -------------------------------------------------------------
    initLiveClock() {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            this.dom.liveClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        };
        setInterval(updateClock, 1000);
        updateClock();
    },

    initTheme() {
        this.dom.themeToggle.addEventListener('click', () => {
            const body = document.body;
            const sunIcon = this.dom.themeToggle.querySelector('.sun-icon');
            const moonIcon = this.dom.themeToggle.querySelector('.moon-icon');
            
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                this.state.theme = 'light';
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                this.state.theme = 'dark';
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            }
        });
    },

    initTabs() {
        this.dom.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Global search triggers
        this.dom.globalSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = this.dom.globalSearch.value.trim();
                if (query) {
                    this.switchTab('copilot');
                    this.askCopilot(query, false);
                    this.dom.globalSearch.value = '';
                }
            }
        });
    },

    switchTab(tabName) {
        this.state.activeTab = tabName;
        
        // Update nav active classes
        this.dom.tabs.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update view viewport visibility
        this.dom.sections.forEach(sec => {
            if (sec.id === tabName) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });

        // Trigger size adjustment or render logic specific to tabs
        if (tabName === 'ingest-graph') {
            this.resizeGraphCanvas();
            this.state.graph.simulationRunning = true;
        } else {
            this.state.graph.simulationRunning = false;
        }

        if (tabName === 'maintenance') {
            const rcaActive = document.querySelector('.diag-tab.active').getAttribute('data-diag-tab') === 'rca';
            if (rcaActive) this.drawFishbone();
        }
    },

    // -------------------------------------------------------------
    // Mock Data Models
    // -------------------------------------------------------------
    initGraphData() {
        // Preset items
        this.state.graph.nodes = [
            // ASSETS (Cyan)
            { id: 'PMP-101', label: 'Feed Pump PMP-101', type: 'asset', health: 85, spec: 'Centrifugal / 185m³/h', location: 'Plant 3 - Pump House A', x: 200, y: 150, vx: 0, vy: 0 },
            { id: 'VLV-204', label: 'Control Valve VLV-204', type: 'asset', health: 68, spec: 'Pneumatic Actuator', location: 'Plant 3 - Gas Feedline B', x: 450, y: 120, vx: 0, vy: 0 },
            { id: 'BLR-302', label: 'Boiler BLR-302', type: 'asset', health: 94, spec: 'High-Pressure Steam / 45T', location: 'Plant 3 - Boiler Block C', x: 250, y: 350, vx: 0, vy: 0 },
            { id: 'T-104', label: 'Storage Tank T-104', type: 'asset', health: 99, spec: 'Class A Hydrocarbon / 5000KL', location: 'Plant Tank Farm East', x: 600, y: 320, vx: 0, vy: 0 },
            
            // DOCUMENTS (Purple)
            { id: 'SOP-PMP-101', label: 'SOP_FeedPump_v2.pdf', type: 'document', format: 'PDF Standard Procedure', created: '2024-04-12', x: 100, y: 80, vx: 0, vy: 0 },
            { id: 'OEM-VLV-204', label: 'Valve_OEM_Guide_v3.pdf', type: 'document', format: 'OEM Operation Handbook', created: '2022-09-18', x: 500, y: 50, vx: 0, vy: 0 },
            { id: 'SOP-BLR-302', label: 'SOP_Boiler_v4.pdf', type: 'document', format: 'Standard Operating Procedure', created: '2025-01-05', x: 150, y: 380, vx: 0, vy: 0 },
            { id: 'INS-T-104', label: 'Tank_Inspection_2025.xlsx', type: 'document', format: 'Excel Log Sheet', created: '2025-11-20', x: 620, y: 420, vx: 0, vy: 0 },
            { id: 'MAN-PMP-101', label: 'OEM_Pump_Manual_v1.pdf', type: 'document', format: 'OEM Technical Manual', created: '2020-03-10', x: 120, y: 220, vx: 0, vy: 0 },

            // REGULATORY CODES (Emerald)
            { id: 'OISD-189', label: 'OISD-STD-189 (Boiler Safety)', type: 'regulatory', scope: 'Steam Boiler Inspections', compliance: 'Clause 6.2 overridden', x: 380, y: 400, vx: 0, vy: 0 },
            { id: 'PESO-ACT', label: 'PESO Explosives Rules', type: 'regulatory', scope: 'Petroleum Storage Safety', compliance: 'Class A Storage zones', x: 720, y: 280, vx: 0, vy: 0 },
            { id: 'FACTORY-ACT', label: 'Indian Factory Act 1948', type: 'regulatory', scope: 'Occupational Hazards & Health', compliance: 'Section 35 lighting logs', x: 350, y: 250, vx: 0, vy: 0 },
            { id: 'OISD-105', label: 'OISD-STD-105 (Hot Work)', type: 'regulatory', scope: 'Work Permit Clearances', compliance: 'Gas safety tests', x: 550, y: 200, vx: 0, vy: 0 },

            // EVENTS / INCIDENTS (Orange)
            { id: 'JO-88321', label: 'Job Order #JO-88321', type: 'incident', description: 'PMP-101 Shaft Seal Leakage fix', resolved: '14 Days Ago', x: 280, y: 80, vx: 0, vy: 0 },
            { id: 'JO-82194', label: 'Job Order #JO-82194', type: 'incident', description: 'VLV-204 sticking risk check', resolved: 'Active', x: 380, y: 180, vx: 0, vy: 0 },
            { id: 'RCA-VLV-204', label: 'RCA_Valve_Sticking.md', type: 'incident', description: 'Root Cause on valve failure', resolved: 'Active Analysis', x: 580, y: 120, vx: 0, vy: 0 }
        ];

        this.state.graph.links = [
            { source: 'PMP-101', target: 'SOP-PMP-101', label: 'follows_procedure' },
            { source: 'PMP-101', target: 'MAN-PMP-101', label: 'OEM_reference' },
            { source: 'PMP-101', target: 'JO-88321', label: 'maintained_in' },
            { source: 'JO-88321', target: 'SOP-PMP-101', label: 'verified_via' },
            
            { source: 'VLV-204', target: 'OEM-VLV-204', label: 'OEM_reference' },
            { source: 'VLV-204', target: 'JO-82194', label: 'maintained_in' },
            { source: 'VLV-204', target: 'RCA-VLV-204', label: 'analyzed_in' },
            { source: 'RCA-VLV-204', target: 'OEM-VLV-204', label: 'cites' },
            { source: 'JO-82194', target: 'OISD-105', label: 'requires_permit' },

            { source: 'BLR-302', target: 'SOP-BLR-302', label: 'follows_procedure' },
            { source: 'BLR-302', target: 'OISD-189', label: 'governed_by' },
            { source: 'OISD-189', target: 'SOP-BLR-302', label: 'mandates_rules_in' },

            { source: 'T-104', target: 'INS-T-104', label: 'inspected_in' },
            { source: 'T-104', target: 'PESO-ACT', label: 'licensed_by' },
            { source: 'INS-T-104', target: 'PESO-ACT', label: 'proves_compliance' },
            
            { source: 'FACTORY-ACT', target: 'SOP-BLR-302', label: 'mandates_audit_in' },
            { source: 'FACTORY-ACT', target: 'SOP-PMP-101', label: 'mandates_safety_in' }
        ];

        this.state.originalNodesCount = this.state.graph.nodes.length;
        this.state.originalDocsCount = this.state.graph.nodes.filter(n => n.type === 'document').length;
    },

    // -------------------------------------------------------------
    // Force Directed Knowledge Graph Core (Canvas 2D)
    // -------------------------------------------------------------
    initGraphCanvas() {
        const canvas = this.dom.graphCanvas;
        const ctx = canvas.getContext('2d');
        
        this.resizeGraphCanvas();
        window.addEventListener('resize', () => {
            if (this.state.activeTab === 'ingest-graph') this.resizeGraphCanvas();
        });

        // Mouse Listeners
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - this.state.graph.pan.x) / this.state.graph.zoom;
            const mouseY = (e.clientY - rect.top - this.state.graph.pan.y) / this.state.graph.zoom;
            
            // Check if clicked a node
            const clickedNode = this.state.graph.nodes.find(node => {
                const dx = node.x - mouseX;
                const dy = node.y - mouseY;
                return Math.sqrt(dx*dx + dy*dy) < 22; // Node radius visual bounding box
            });

            if (clickedNode) {
                this.state.graph.draggedNode = clickedNode;
                this.state.graph.selectedNode = clickedNode;
                this.openNodeOverlay(clickedNode);
            } else {
                // Background click - initiate panning
                this.state.graph.dragStart = { x: e.clientX - this.state.graph.pan.x, y: e.clientY - this.state.graph.pan.y };
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - this.state.graph.pan.x) / this.state.graph.zoom;
            const mouseY = (e.clientY - rect.top - this.state.graph.pan.y) / this.state.graph.zoom;

            if (this.state.graph.draggedNode) {
                this.state.graph.draggedNode.x = mouseX;
                this.state.graph.draggedNode.y = mouseY;
            } else if (this.state.graph.dragStart) {
                this.state.graph.pan.x = e.clientX - this.state.graph.dragStart.x;
                this.state.graph.pan.y = e.clientY - this.state.graph.dragStart.y;
            } else {
                // Check if hovering a node
                const hover = this.state.graph.nodes.find(node => {
                    const dx = node.x - mouseX;
                    const dy = node.y - mouseY;
                    return Math.sqrt(dx*dx + dy*dy) < 18;
                });
                
                if (hover !== this.state.graph.hoveredNode) {
                    this.state.graph.hoveredNode = hover;
                    canvas.style.cursor = hover ? 'pointer' : (this.state.graph.dragStart ? 'grabbing' : 'grab');
                }
            }
        });

        window.addEventListener('mouseup', () => {
            this.state.graph.draggedNode = null;
            this.state.graph.dragStart = null;
        });

        // Wheel Zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
            const newZoom = Math.min(Math.max(this.state.graph.zoom * zoomFactor, 0.2), 3);

            // Zoom centered on cursor
            this.state.graph.pan.x = mouseX - (mouseX - this.state.graph.pan.x) * (newZoom / this.state.graph.zoom);
            this.state.graph.pan.y = mouseY - (mouseY - this.state.graph.pan.y) * (newZoom / this.state.graph.zoom);
            this.state.graph.zoom = newZoom;
        });

        // Zoom Toolbar controls
        this.dom.zoomIn.addEventListener('click', () => {
            this.state.graph.zoom = Math.min(this.state.graph.zoom * 1.2, 3);
        });
        this.dom.zoomOut.addEventListener('click', () => {
            this.state.graph.zoom = Math.max(this.state.graph.zoom * 0.8, 0.2);
        });
        this.dom.zoomReset.addEventListener('click', () => {
            this.state.graph.zoom = 1;
            this.state.graph.pan = { x: 0, y: 0 };
        });

        // Filter chips trigger
        this.dom.filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.dom.filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.state.graph.filterType = chip.getAttribute('data-type');
            });
        });

        // Graph search
        this.dom.graphSearch.addEventListener('input', () => {
            const val = this.dom.graphSearch.value.toLowerCase().trim();
            if (val) {
                const found = this.state.graph.nodes.find(n => n.id.toLowerCase().includes(val) || n.label.toLowerCase().includes(val));
                if (found) {
                    this.state.graph.selectedNode = found;
                    this.openNodeOverlay(found);
                    // Center pan on the node
                    this.state.graph.pan.x = canvas.width / 2 - found.x * this.state.graph.zoom;
                    this.state.graph.pan.y = canvas.height / 2 - found.y * this.state.graph.zoom;
                }
            }
        });

        this.dom.closeOverlayBtn.addEventListener('click', () => {
            this.dom.nodeDetailOverlay.classList.remove('open');
            this.state.graph.selectedNode = null;
        });

        // Start animation loop
        const loop = () => {
            if (this.state.graph.simulationRunning) {
                this.updatePhysics();
                this.drawGraph(ctx, canvas);
            }
            requestAnimationFrame(loop);
        };
        loop();
    },

    resizeGraphCanvas() {
        const canvas = this.dom.graphCanvas;
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    },

    focusGraphNode(nodeId) {
        this.switchTab('ingest-graph');
        const node = this.state.graph.nodes.find(n => n.id === nodeId);
        if (node) {
            this.state.graph.selectedNode = node;
            this.openNodeOverlay(node);
            setTimeout(() => {
                this.state.graph.pan.x = this.dom.graphCanvas.width / 2 - node.x * this.state.graph.zoom;
                this.state.graph.pan.y = this.dom.graphCanvas.height / 2 - node.y * this.state.graph.zoom;
            }, 100);
        }
    },

    // -------------------------------------------------------------
    // Canvas Physics Engine Layout Calculations
    // -------------------------------------------------------------
    updatePhysics() {
        const nodes = this.state.graph.nodes;
        const links = this.state.graph.links;
        const width = this.dom.graphCanvas.width;
        const height = this.dom.graphCanvas.height;

        const kSpring = 0.04;
        const lengthDefault = 120;
        const kRepel = 350;
        const kGravity = 0.015;
        const damping = 0.85;

        // 1. Repulsion between all nodes
        for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist === 0) dist = 0.1;
                
                // Repel force inversely proportional to distance squared
                const force = kRepel / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (n1 !== this.state.graph.draggedNode) {
                    n1.vx -= fx;
                    n1.vy -= fy;
                }
                if (n2 !== this.state.graph.draggedNode) {
                    n2.vx += fx;
                    n2.vy += fy;
                }
            }
        }

        // 2. Spring tension along link edges
        links.forEach(link => {
            let sNode = nodes.find(n => n.id === link.source);
            let tNode = nodes.find(n => n.id === link.target);
            if (!sNode || !tNode) return;

            const dx = tNode.x - sNode.x;
            const dy = tNode.y - sNode.y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 0.1;
            const delta = dist - lengthDefault;
            const force = kSpring * delta;
            
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (sNode !== this.state.graph.draggedNode) {
                sNode.vx += fx;
                sNode.vy += fy;
            }
            if (tNode !== this.state.graph.draggedNode) {
                tNode.vx -= fx;
                tNode.vy -= fy;
            }
        });

        // 3. Central gravity pulling nodes to viewport center
        const cx = width / 2;
        const cy = height / 2;
        nodes.forEach(node => {
            if (node === this.state.graph.draggedNode) return;
            const dx = cx - node.x;
            const dy = cy - node.y;
            node.vx += dx * kGravity;
            node.vy += dy * kGravity;
            
            // Apply velocities & damping
            node.x += node.vx;
            node.y += node.vy;
            node.vx *= damping;
            node.vy *= damping;

            // Keep nodes boundary constrained within canvas
            node.x = Math.max(40, Math.min(width - 40, node.x));
            node.y = Math.max(40, Math.min(height - 40, node.y));
        });
    },

    drawGraph(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(this.state.graph.pan.x, this.state.graph.pan.y);
        ctx.scale(this.state.graph.zoom, this.state.graph.zoom);

        const filter = this.state.graph.filterType;
        const selectedNode = this.state.graph.selectedNode;

        // 1. Draw Links
        this.state.graph.links.forEach(link => {
            const sNode = this.state.graph.nodes.find(n => n.id === link.source);
            const tNode = this.state.graph.nodes.find(n => n.id === link.target);
            if (!sNode || !tNode) return;

            // If a node type filter is active, fade links that aren't linked to filtered items
            let isVisible = true;
            if (filter !== 'all') {
                if (sNode.type !== filter && tNode.type !== filter) isVisible = false;
            }

            // Highlighting links connected to selected node
            let isHighlight = false;
            if (selectedNode) {
                if (sNode.id === selectedNode.id || tNode.id === selectedNode.id) {
                    isHighlight = true;
                }
            }

            ctx.beginPath();
            ctx.moveTo(sNode.x, sNode.y);
            ctx.lineTo(tNode.x, tNode.y);
            
            if (isHighlight) {
                ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
                ctx.shadowBlur = 4;
            } else {
                ctx.strokeStyle = isVisible ? 'rgba(51, 65, 85, 0.3)' : 'rgba(51, 65, 85, 0.08)';
                ctx.lineWidth = 1.2;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
        });

        // 2. Draw Nodes
        this.state.graph.nodes.forEach(node => {
            let isVisible = true;
            if (filter !== 'all' && node.type !== filter) isVisible = false;

            const isSelected = selectedNode && selectedNode.id === node.id;
            const isHovered = this.state.graph.hoveredNode && this.state.graph.hoveredNode.id === node.id;
            
            ctx.save();
            ctx.globalAlpha = isVisible ? 1.0 : 0.2;

            // Neon glows for hovered/selected nodes
            if (isHovered || isSelected) {
                ctx.shadowBlur = 12;
                if (node.type === 'asset') ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
                if (node.type === 'document') ctx.shadowColor = 'rgba(129, 140, 248, 0.8)';
                if (node.type === 'regulatory') ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
                if (node.type === 'incident') ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
            }

            // Outer node boundary ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, 16, 0, 2*Math.PI);
            if (node.type === 'asset') ctx.fillStyle = '#00f2fe';
            if (node.type === 'document') ctx.fillStyle = '#818cf8';
            if (node.type === 'regulatory') ctx.fillStyle = '#10b981';
            if (node.type === 'incident') ctx.fillStyle = '#f59e0b';
            ctx.fill();

            // Inner circle core
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 11, 0, 2*Math.PI);
            ctx.fillStyle = '#0b0f19';
            ctx.fill();

            // Node Labels text
            ctx.font = '500 9px Inter, sans-serif';
            ctx.fillStyle = isSelected ? '#00f2fe' : (this.state.theme === 'dark' ? '#f8fafc' : '#0f172a');
            ctx.textAlign = 'center';
            ctx.fillText(node.id, node.x, node.y + 28);

            ctx.restore();
        });

        ctx.restore();
    },

    // Node Detail Sidebar overlays
    openNodeOverlay(node) {
        this.dom.overlayNodeTitle.textContent = node.label || node.id;
        this.dom.overlayNodeType.textContent = node.type.toUpperCase();
        
        // Setup class lists
        this.dom.overlayNodeType.className = 'node-type-badge';
        this.dom.overlayNodeIcon.className = 'node-icon-wrapper';
        this.dom.overlayNodeType.classList.add(node.type);
        this.dom.overlayNodeIcon.classList.add(node.type);
        
        // Set icon inside node icon wrapper
        let iconMarkup = '<i data-lucide="cpu"></i>';
        if (node.type === 'document') iconMarkup = '<i data-lucide="file-text"></i>';
        if (node.type === 'regulatory') iconMarkup = '<i data-lucide="shield-check"></i>';
        if (node.type === 'incident') iconMarkup = '<i data-lucide="alert-triangle"></i>';
        this.dom.overlayNodeIcon.innerHTML = iconMarkup;

        // Custom metadata table depending on node type
        let metaHtml = '';
        if (node.type === 'asset') {
            metaHtml = `
                <tr><td>Equipment Tag</td><td>${node.id}</td></tr>
                <tr><td>Location</td><td>${node.location}</td></tr>
                <tr><td>Specifications</td><td>${node.spec}</td></tr>
                <tr><td>Health Index</td><td><strong class="neon-green">${node.health}%</strong></td></tr>
            `;
        } else if (node.type === 'document') {
            metaHtml = `
                <tr><td>Document Name</td><td>${node.label}</td></tr>
                <tr><td>Document Format</td><td>${node.format}</td></tr>
                <tr><td>Parsed On</td><td>${node.created}</td></tr>
                <tr><td>Status</td><td><span class="text-emerald">Integrated</span></td></tr>
            `;
        } else if (node.type === 'regulatory') {
            metaHtml = `
                <tr><td>Regulation</td><td>${node.id}</td></tr>
                <tr><td>Scope</td><td>${node.scope}</td></tr>
                <tr><td>Gap Check</td><td>${node.compliance}</td></tr>
            `;
        } else if (node.type === 'incident') {
            metaHtml = `
                <tr><td>Incident/Check</td><td>${node.id}</td></tr>
                <tr><td>Description</td><td>${node.description}</td></tr>
                <tr><td>Time Status</td><td>${node.resolved}</td></tr>
            `;
        }
        this.dom.overlayNodeMeta.innerHTML = metaHtml;

        // Find relations linked to this node
        const connections = this.state.graph.links.filter(link => link.source === node.id || link.target === node.id);
        this.dom.overlayRelationsCount.textContent = connections.length;
        
        let relHtml = '';
        connections.forEach(link => {
            const targetId = link.source === node.id ? link.target : link.source;
            const targetNode = this.state.graph.nodes.find(n => n.id === targetId);
            if (!targetNode) return;

            relHtml += `
                <div class="relation-item" onclick="app.focusGraphNode('${targetNode.id}')">
                    <span class="rel-tag rel-${targetNode.type}">${targetNode.type.toUpperCase()}</span>
                    <span class="name">${targetNode.label || targetNode.id}</span>
                    <span class="type-link">${link.label.replace('_', ' ')}</span>
                </div>
            `;
        });
        this.dom.overlayRelationsList.innerHTML = relHtml;
        this.dom.nodeDetailOverlay.classList.add('open');
        lucide.createIcons();
    },

    // -------------------------------------------------------------
    // Universal Document Ingest & OCR Pipeline
    // -------------------------------------------------------------
    initIngestSimulation() {
        const zone = this.dom.uploadZone;
        const fileInput = this.dom.fileInput;

        zone.addEventListener('click', () => fileInput.click());
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--cyan)';
        });
        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = 'var(--border-color)';
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--border-color)';
            if (e.dataTransfer.files.length > 0) {
                this.simulateIngest(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                this.simulateIngest(fileInput.files[0]);
            }
        });
    },

    simulateIngest(file) {
        const consoleEl = this.dom.extractionConsole;
        
        const appendConsole = (text, type = 'system') => {
            const line = document.createElement('div');
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            line.className = `console-line ${type}`;
            line.innerHTML = `<span class="timestamp">[${timeStr}]</span> ${text}`;
            consoleEl.appendChild(line);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        };

        appendConsole(`<strong>File uploaded:</strong> ${file.name} (${Math.round(file.size/1024)} KB)`, 'system');
        appendConsole(`Starting multi-modal parsing via LayoutLMv3 layout detector...`, 'process');

        // Step-by-step timed logs
        setTimeout(() => {
            appendConsole(`Detecting layout components: 2 P&ID diagrams, 1 calibration table found.`, 'process');
        }, 1200);

        setTimeout(() => {
            appendConsole(`Running PaddleOCR on table cells & equipment labels...`, 'process');
        }, 2200);

        setTimeout(() => {
            let extractedTag = 'VLV-204';
            let parsedType = 'Incident Record';
            
            // Customize response based on uploaded file name
            if (file.name.toLowerCase().includes('valve')) {
                extractedTag = 'VLV-204';
            } else if (file.name.toLowerCase().includes('boiler') || file.name.toLowerCase().includes('oisd')) {
                extractedTag = 'BLR-302';
            } else {
                extractedTag = 'T-104';
            }

            appendConsole(`OCR completed. NER Tag Extraction matched: <strong>${extractedTag}</strong>.`, 'success');
            appendConsole(`Linking standard guidelines to Knowledge Graph repositories...`, 'process');
        }, 3400);

        setTimeout(() => {
            // Add a new node to the live graph
            const newNodeId = `DOC-${Math.floor(Math.random()*1000)}`;
            const newNode = {
                id: newNodeId,
                label: file.name,
                type: 'document',
                format: 'Uploaded PDF Archive',
                created: new Date().toISOString().split('T')[0],
                x: 300 + Math.random()*100,
                y: 200 + Math.random()*100,
                vx: 0,
                vy: 0
            };

            // Link it to whatever tag we extracted
            let targetTag = 'VLV-204';
            if (file.name.toLowerCase().includes('boiler') || file.name.toLowerCase().includes('oisd')) targetTag = 'BLR-302';
            if (file.name.toLowerCase().includes('tank') || file.name.toLowerCase().includes('peso')) targetTag = 'T-104';

            this.state.graph.nodes.push(newNode);
            this.state.graph.links.push({
                source: newNodeId,
                target: targetTag,
                label: 'associated_specification'
            });

            this.updateStats();
            appendConsole(`Knowledge Graph successfully updated. Node <strong>${newNodeId}</strong> spawned and bound to <strong>${targetTag}</strong>!`, 'success');
        }, 4600);
    },

    updateStats() {
        const totalDocs = this.state.graph.nodes.filter(n => n.type === 'document').length;
        const totalNodes = this.state.graph.nodes.length;
        document.getElementById('count-docs').textContent = totalDocs.toLocaleString();
        document.getElementById('count-nodes').textContent = (totalNodes * 6).toLocaleString(); // Scale visually for plant size
    },

    // -------------------------------------------------------------
    // Expert Knowledge Copilot Chat Engine
    // -------------------------------------------------------------
    initCopilot() {
        const desktopSend = this.dom.desktopSendBtn;
        const desktopInput = this.dom.desktopChatInput;
        const mobileSend = this.dom.mobileSendBtn;
        const mobileInput = this.dom.mobileChatInput;

        // Desktop Chat send
        desktopSend.addEventListener('click', () => {
            const query = desktopInput.value.trim();
            if (query) {
                this.askCopilot(query, false);
                desktopInput.value = '';
            }
        });
        desktopInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = desktopInput.value.trim();
                if (query) {
                    this.askCopilot(query, false);
                    desktopInput.value = '';
                }
            }
        });

        // Mobile Chat send
        mobileSend.addEventListener('click', () => {
            const query = mobileInput.value.trim();
            if (query) {
                this.askCopilot(query, true);
                mobileInput.value = '';
            }
        });
        mobileInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = mobileInput.value.trim();
                if (query) {
                    this.askCopilot(query, true);
                    mobileInput.value = '';
                }
            }
        });

        // View Segment Toggle
        this.dom.viewDesktopBtn.addEventListener('click', () => {
            this.dom.viewDesktopBtn.classList.add('active');
            this.dom.viewMobileBtn.classList.remove('active');
            this.dom.desktopCopilot.classList.remove('hidden');
            this.dom.mobileCopilot.classList.add('hidden');
        });
        this.dom.viewMobileBtn.addEventListener('click', () => {
            this.dom.viewMobileBtn.classList.add('active');
            this.dom.viewDesktopBtn.classList.remove('active');
            this.dom.desktopCopilot.classList.add('hidden');
            this.dom.mobileCopilot.classList.remove('hidden');
        });

        // Quick suggested prompts
        this.dom.quickQueryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-query');
                this.askCopilot(q, false);
            });
        });

        // Voice/QR mobile buttons mock
        this.dom.voiceInputBtn.addEventListener('click', () => {
            this.askCopilot("Voice instruction: Read me safety instructions for PMP-101 motor replacement.", true);
        });
        this.dom.scanQrBtn.addEventListener('click', () => {
            this.askCopilot("Scanned QR Code for Control Valve VLV-204. Show current health assessment and active work specs.", true);
        });
    },

    askCopilot(query, isMobile = false) {
        const chatContainer = isMobile ? this.dom.mobileChatMessages : this.dom.desktopChatMessages;
        
        // 1. Render User message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `
            <div class="message-avatar"><i data-lucide="user"></i></div>
            <div class="message-bubble"><p>${query}</p></div>
        `;
        chatContainer.appendChild(userMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 2. Prep Assistant message (streaming simulation)
        const assistMsg = document.createElement('div');
        assistMsg.className = 'message assistant';
        assistMsg.innerHTML = `
            <div class="message-avatar"><i data-lucide="bot"></i></div>
            <div class="message-bubble">
                <p class="stream-text"></p>
            </div>
        `;
        chatContainer.appendChild(assistMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        lucide.createIcons();

        const streamTextEl = assistMsg.querySelector('.stream-text');

        // Compile response details depending on query
        let answerText = "";
        let citations = [];
        let confidence = 95;

        const lowQuery = query.toLowerCase();
        if (lowQuery.includes('pmp-101') && lowQuery.includes('start-up')) {
            answerText = `To safely start up **Feed Pump PMP-101**, follow these steps compiled from our mechanical SOP library:\n\n` +
                         `1. **Pre-start Checklist:** Confirm auxiliary lube system pressure is at least **1.8 bar**. Check coupling guard bolts.\n` +
                         `2. **Valves configuration:** Open suction valve slowly to 100% open. Keep discharge valve fully closed to prevent motor overload during starting cycle.\n` +
                         `3. **Priming:** Open venting valves until continuous product flow is observed (confirm zero gaseous pockets in impeller housing).\n` +
                         `4. **Initiate Motor:** Press start on electrical console. Monitor current draw spike; verify it stabilizes within **6 seconds**.\n` +
                         `5. **Post-start flow adjustment:** Slowly open discharge valve until line pressure matches operating design of **4.2 bar**.\n\n` +
                         `*Warning: Never run pump dry. If vibration rises above 4.5 mm/s, trip motor immediately.*`;
            citations = ['SOP_FeedPump_v2.pdf (Page 4)', 'OEM_Pump_Manual_v1.pdf (Section 3.2)'];
            confidence = 98;
        } else if (lowQuery.includes('oisd') && lowQuery.includes('hot work')) {
            answerText = `Under **OISD-STD-105 (Clause 6.4)** and **OISD-STD-189**, the following criteria apply to hot work permits on refinery storage tanks:\n\n` +
                         `1. **Gas Testing:** Mandatory LEL (Lower Explosive Limit) check before work start. LEL must be **0.0%**.\n` +
                         `2. **Clearance:** Clear all hydrocarbons and combustible assets in a **15-meter radius**.\n` +
                         `3. **Shielding:** Fire blankets and spark arresters must cover all drains, vents, and openings.\n` +
                         `4. **Safety Watch:** A dedicated, trained Fire Watch must stand by with a charged CO2 extinguisher for the entire duration.\n` +
                         `5. **Renewal:** Permits are shift-locked (valid for max 8 hours) and require fresh gas tests if work stops for >30 mins.`;
            citations = ['OISD-STD-105 (Section 6.4)', 'Factory_Safety_Code.pdf (Section 12)'];
            confidence = 94;
        } else if (lowQuery.includes('vlv-204') || lowQuery.includes('valve')) {
            answerText = `**Control Valve VLV-204** has an active anomaly record. Here is the operational analysis:\n\n` +
                         `- **Status:** Sticking risk flagged due to friction spikes in pneumatic actuator.\n` +
                         `- **Past Failure Pattern:** High similarity to incident #JO-82194 in 2025 where actuator diaphragm micro-ruptured due to dry feed gas supply.\n` +
                         `- **OEM Spec check:** OEM Manual Page 47 states pneumatic lines must hold clean, dry air at **5.5 bar**. Current pressure telemetry is **5.1 bar** (suggests slight supply drop).\n\n` +
                         `**Recommendation:** Instruct field crew to check compressor output lines and clean filter regulators immediately.`;
            citations = ['Valve_OEM_Guide_v3.pdf (Page 47)', 'RCA_Valve_Sticking.md (Section 2.1)'];
            confidence = 91;
        } else if (lowQuery.includes('torque') || lowQuery.includes('hex-902')) {
            answerText = `For the flange bolts on **Heat Exchanger HEX-902**:\n\n` +
                         `- Bolt spec: 1.25-inch alloy steel bolts.\n` +
                         `- Required Torque: **280 Nm (206 ft-lbs)** in a star pattern sequence.\n` +
                         `- Gasket material: Spiral wound metallic seal.\n\n` +
                         `**Crucial:** Apply thread lubricant and execute torque in 3 stages: 30% first pass, 60% second pass, and 100% final lock pass.`;
            citations = ['HEX_OEM_Book.pdf (Page 112)', 'Refinery_Bolt_Standards.xlsx'];
            confidence = 96;
        } else {
            // Generic response
            answerText = `I have scanned our unified database. Relating to your query on **"${query}"**:\n\n` +
                         `I found references in 3 document systems matching keywords. Operational guidelines advise checking current sensor readings for linked assets (PMP-101 or VLV-204) and matching with standard operating procedures to verify compliance.\n\n` +
                         `Would you like to run a dedicated Root Cause Analysis or inspect the regulatory gap audit page?`;
            citations = ['General_Plant_Index.pdf'];
            confidence = 85;
        }

        // Simulate Typing Speed
        let charIndex = 0;
        const speed = 12; // ms per char
        const typeWriter = () => {
            if (charIndex < answerText.length) {
                // Handle simple markdown linebreaks in typing
                const char = answerText.charAt(charIndex);
                if (char === '\n') {
                    streamTextEl.innerHTML += '<br>';
                } else {
                    streamTextEl.innerHTML += char;
                }
                charIndex++;
                chatContainer.scrollTop = chatContainer.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                // Done typing, append citations and confidence scores
                const citationBox = document.createElement('div');
                citationBox.className = 'copilot-citation';
                
                let citLinksHtml = '';
                citations.forEach(c => {
                    citLinksHtml += `<a href="#" class="cit-link" onclick="app.focusGraphNode('${c.split(' ')[0]}')"><i data-lucide="external-link" style="width:10px;height:10px;"></i> ${c}</a>`;
                });

                citationBox.innerHTML = `
                    <div class="citation-header"><i data-lucide="bookmark" style="width:12px;height:12px;"></i> Source References:</div>
                    <div class="citation-links">${citLinksHtml}</div>
                    <div class="confidence-score"><i data-lucide="check" style="width:12px;height:12px;"></i> Confidence Score: ${confidence}%</div>
                `;
                streamTextEl.parentElement.appendChild(citationBox);
                chatContainer.scrollTop = chatContainer.scrollHeight;
                lucide.createIcons();
            }
        };
        setTimeout(typeWriter, 400);
    },

    // -------------------------------------------------------------
    // Maintenance Timeline & RCA Wizard
    // -------------------------------------------------------------
    initRCA() {
        // Asset Selector profile cards click
        this.dom.assetCards.forEach(card => {
            card.addEventListener('click', () => {
                this.dom.assetCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const assetId = card.getAttribute('data-asset');
                this.state.activeAsset = assetId;
                
                this.updateAssetMetrics(assetId);
                this.renderTimeline(assetId);
            });
        });

        // Subtabs within Maintenance (Overview vs RCA)
        this.dom.diagTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.dom.diagTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const target = tab.getAttribute('data-diag-tab');
                this.dom.diagTabContents.forEach(content => {
                    if (content.id === `diag-${target}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });

                if (target === 'rca') {
                    this.triggerRCAAnalysis();
                }
            });
        });

        // Trigger Generate RCA button click
        this.dom.btnGenerateRCA.addEventListener('click', () => {
            this.triggerRCAAnalysis();
        });
    },

    updateAssetMetrics(assetId) {
        if (assetId === 'PMP-101') {
            this.dom.valVibe.textContent = '1.2 mm/s';
            this.dom.valTemp.textContent = '74.2 °C';
            this.dom.valFlow.textContent = '185 m³/h';
            this.dom.valVibe.className = 'value text-emerald';
            this.dom.valTemp.className = 'value text-orange';
            this.dom.predictiveRec.textContent = 'Vibration and bearing temperature correlations predict potential cavitation and bearing seal wear in the next 180 operating hours. Recommended action: schedule alignment verification and seal lubrication.';
        } else if (assetId === 'VLV-204') {
            this.dom.valVibe.textContent = 'N/A';
            this.dom.valTemp.textContent = '52.1 °C';
            this.dom.valFlow.textContent = '112 m³/h';
            this.dom.valTemp.className = 'value text-emerald';
            this.dom.valFlow.className = 'value text-red';
            this.dom.predictiveRec.textContent = 'Pressure drop across valve suggests friction sticking or positioner mismatch. Recommend scheduling stroke calibration and actuator diagnostic sweep.';
        } else if (assetId === 'BLR-302') {
            this.dom.valVibe.textContent = 'N/A';
            this.dom.valTemp.textContent = '585.0 °C';
            this.dom.valFlow.textContent = '42.5 T/h';
            this.dom.valTemp.className = 'value text-emerald';
            this.dom.valFlow.className = 'value text-emerald';
            this.dom.predictiveRec.textContent = 'Boiler parameters are stable. OISD test certifications are upcoming. Recommend pre-ordering testing seal kits.';
        }
    },

    renderTimeline(assetId) {
        let events = [];
        if (assetId === 'PMP-101') {
            events = [
                { date: '14 Days Ago', title: 'Job Order #JO-88321 Executed', desc: 'Shaft seal replaced by mechanical crew. High vibration alarm cleared.', status: 'active' },
                { date: '20 Days Ago', title: 'High Bearing Temperature Warning', desc: 'Bearing sensor registered 82°C. Safety check recommended.', status: 'warning' },
                { date: '3 Months Ago', title: 'Vibration Verification Logged', desc: 'Routine inspection showed normal values (0.8 mm/s).', status: 'normal' }
            ];
        } else if (assetId === 'VLV-204') {
            events = [
                { date: 'Active Check', title: 'Pneumatic Actuator Friction Alert', desc: 'Valve sticking index flagged at 24% friction coefficient.', status: 'warning' },
                { date: '1 Month Ago', title: 'Calibration Log Uploaded', desc: 'SOP compliance calibration package verified by supervisor.', status: 'normal' }
            ];
        } else {
            events = [
                { date: '12 Days Ago', title: 'OISD safety valve test overdue', desc: 'Regulatory gap alert spawned.', status: 'warning' },
                { date: '6 Months Ago', title: 'Hydrostatic Pressure Test Passed', desc: 'Certified by third-party inspector under Factory Act norms.', status: 'normal' }
            ];
        }

        let html = '';
        events.forEach(ev => {
            html += `
                <div class="timeline-event ${ev.status === 'warning' ? 'warning' : (ev.status === 'active' ? 'active' : '')}">
                    <span class="event-date">${ev.date}</span>
                    <strong class="event-title">${ev.title}</strong>
                    <span class="event-desc">${ev.desc}</span>
                </div>
            `;
        });
        this.dom.assetTimeline.innerHTML = html;
    },

    showRCA(assetId) {
        this.switchTab('maintenance');
        document.getElementById('rca-tab-btn').click();
        
        // Select correct dropdown value
        if (assetId === 'VLV-204') {
            this.dom.rcaIncidentSelect.value = 'vlv-stick';
        } else if (assetId === 'PMP-101') {
            this.dom.rcaIncidentSelect.value = 'pmp-leak';
        } else {
            this.dom.rcaIncidentSelect.value = 'blr-tube';
        }
        
        this.triggerRCAAnalysis();
    },

    triggerRCAAnalysis() {
        const incident = this.dom.rcaIncidentSelect.value;
        let whys = [];
        let capas = [];

        if (incident === 'pmp-leak') {
            whys = [
                "Shaft seal micro-cracked and leaked hydrocarbons.",
                "High axial shaft vibration wore down mechanical carbon seal face.",
                "Impeller cavitation induced unbalanced rotational forces on the shaft.",
                "Viscous petroleum feed rate increased while intake pressure dropped below 1.4 bar.",
                "Failure to cross-reference feed pump design limits in OEM Manual Page 22 during shift process changes."
            ];
            capas = [
                "Install automated suction-pressure trip interlock on PMP-101 control panel.",
                "Incorporate OEM flow-limit curves directly into real-time sensor dashboards.",
                "Revise shift handover checklist to mandate feed viscosity limits audits."
            ];
        } else if (incident === 'vlv-stick') {
            whys = [
                "Pneumatic positioner failed to respond to flow commands.",
                "Friction coefficient inside pneumatic actuator rose to 24% (sticking).",
                "Moisture accumulation inside the pneumatic diaphragm rusted the spring housing.",
                "Instrument air supply feed gas filter was saturated with liquid moisture.",
                "Scheduled quarterly filter-drain inspections were omitted due to maintenance logging gaps."
            ];
            capas = [
                "Replace VLV-204 actuator spring and execute stroke calibration.",
                "Update standard operating procedure to require weekly air-manifold drain verification.",
                "Integrate air dryer alarm telemetry directly into the Unified Operations Brain."
            ];
        } else {
            whys = [
                "Boiler superheater tube ruptured, forcing unplanned shutdown.",
                "Tube wall suffered rapid creep deformation and thinning.",
                "Local temperature exceeded design limit of 620°C for extended runs.",
                "Chemical scaling on the tube water-side restricted internal heat transfer.",
                "Demineralized water treatment plant suffered pH and silica control spikes last month."
            ];
            capas = [
                "Perform chemical acid-cleaning of boiler internals to clear scaling.",
                "Install high-temperature infrared sensor grid to detect local tube hotspots.",
                "Mandate daily laboratory reports uploads into regulatory compliance directory."
            ];
        }

        // Render 5 whys list
        let whysHtml = '';
        whys.forEach((why, idx) => {
            whysHtml += `
                <div class="why-step">
                    <span class="why-num">Why ${idx + 1}</span>
                    <span class="why-text">${why}</span>
                </div>
            `;
        });
        this.dom.whysFlowContainer.innerHTML = whysHtml;

        // Render CAPAs
        let capaHtml = '';
        capas.forEach(capa => {
            capaHtml += `<li>${capa}</li>`;
        });
        this.dom.rcaCapaList.innerHTML = capaHtml;

        // Redraw Ishikawa diagram
        this.drawFishbone();
    },

    // -------------------------------------------------------------
    // Canvas Fishbone (Ishikawa) Drawing
    // -------------------------------------------------------------
    drawFishbone() {
        const canvas = this.dom.fishboneCanvas;
        const ctx = canvas.getContext('2d');
        const incidentType = this.dom.rcaIncidentSelect.value;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Define Theme Colors
        const isDark = document.body.classList.contains('dark-theme');
        const strokeColor = isDark ? '#475569' : '#cbd5e1';
        const textColor = isDark ? '#f8fafc' : '#0f172a';
        const textMuted = isDark ? '#94a3b8' : '#64748b';
        const accentColor = '#00f2fe';

        let effectText = "PMP-101 Seal Leak";
        let causes = {
            man: ["Manual override", "No limit checks"],
            machine: ["Cavitation", "Seal wear"],
            method: ["SOP gap", "Friction spike"],
            material: ["High viscosity", "Pressure drop"]
        };

        if (incidentType === 'vlv-stick') {
            effectText = "VLV-204 Sticking";
            causes = {
                man: ["Omitted inspection", "No filter log"],
                machine: ["Dry air pressure", "Actuator rust"],
                method: ["Manual stroke bypass", "Calibration lag"],
                material: ["Moisture feed", "Worn diaphragm"]
            };
        } else if (incidentType === 'blr-tube') {
            effectText = "Boiler Creep";
            causes = {
                man: ["Log missing", "No pH follow"],
                machine: ["Hotspot scaling", "Temp peak"],
                method: ["Water feed shift", "No thermal sweep"],
                material: ["Silica build-up", "Scale layer"]
            };
        }

        // Draw Spine (center bone)
        ctx.beginPath();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.moveTo(30, 175);
        ctx.lineTo(600, 175);
        ctx.stroke();

        // Draw Head (Effect arrow)
        ctx.beginPath();
        ctx.fillStyle = accentColor;
        ctx.moveTo(600, 165);
        ctx.lineTo(625, 175);
        ctx.lineTo(600, 185);
        ctx.fill();

        // Effect Label Box
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = isDark ? '#131b2e' : '#f1f5f9';
        ctx.fillRect(625, 150, 130, 50);
        ctx.strokeRect(625, 150, 130, 50);
        
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillStyle = accentColor;
        ctx.textAlign = 'center';
        ctx.fillText(effectText, 690, 180);

        // Draw 4 Rib Bones (Diagonal lines)
        const ribCoords = [
            { label: "MANPOWER", startX: 180, endX: 250, startY: 60, endY: 175, causes: causes.man, textPos: 'top' },
            { label: "MACHINE", startX: 380, endX: 450, startY: 60, endY: 175, causes: causes.machine, textPos: 'top' },
            { label: "METHOD", startX: 180, endX: 250, startY: 290, endY: 175, causes: causes.method, textPos: 'bottom' },
            { label: "MATERIAL", startX: 380, endX: 450, startY: 290, endY: 175, causes: causes.material, textPos: 'bottom' }
        ];

        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;

        ribCoords.forEach(rib => {
            ctx.beginPath();
            ctx.moveTo(rib.startX, rib.startY);
            ctx.lineTo(rib.endX, rib.endY);
            ctx.stroke();

            // Label at rib head
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            if (rib.textPos === 'top') {
                ctx.fillText(rib.label, rib.startX, rib.startY - 10);
            } else {
                ctx.fillText(rib.label, rib.startX, rib.startY + 15);
            }

            // Draw horizontal causes branches off the rib
            ctx.font = '9px Inter, sans-serif';
            ctx.fillStyle = textMuted;
            
            rib.causes.forEach((cause, cIdx) => {
                // Interpolate a point along the diagonal rib
                const ratio = 0.35 + cIdx * 0.35;
                const bx = rib.startX + (rib.endX - rib.startX) * ratio;
                const by = rib.startY + (rib.endY - rib.startY) * ratio;
                
                // Draw branch line
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx - 40, by);
                ctx.stroke();

                // Text labels
                ctx.textAlign = 'right';
                ctx.fillText(cause, bx - 45, by + 3);
            });
        });
    },

    // -------------------------------------------------------------
    // Regulatory Compliance & Evidence Generator
    // -------------------------------------------------------------
    initCompliance() {
        this.dom.btnGenerateEvidence.addEventListener('click', () => {
            const asset = this.dom.evAsset.value;
            const reg = this.dom.evReg.value;

            this.dom.evidenceResult.classList.add('hidden');
            
            // Show compiling simulator
            this.dom.btnGenerateEvidence.innerHTML = '<i class="animate-spin" data-lucide="loader"></i> Compiling Evidence...';
            lucide.createIcons();

            setTimeout(() => {
                this.dom.btnGenerateEvidence.innerHTML = '<i data-lucide="package"></i> Generate Audit Evidence Package';
                this.dom.evidenceResult.classList.remove('hidden');

                // Generate Manifest list depending on parameters
                let files = [];
                if (asset === 'PMP-101') {
                    files = [
                        { name: 'SOP_FeedPump_v2.pdf', hash: 'sha256-a88b1...' },
                        { name: 'PMP-101_Calibration_2026.csv', hash: 'sha256-f84a1...' },
                        { name: 'Job_Order_JO-88321.xlsx', hash: 'sha256-3bb8c...' }
                    ];
                } else if (asset === 'BLR-302') {
                    files = [
                        { name: 'SOP_Boiler_v4.pdf', hash: 'sha256-55ea3...' },
                        { name: 'OISD-189_Boiler_Audit_Certificate.pdf', hash: 'sha256-8e2b9...' },
                        { name: 'Hydro_Test_Log_2025.csv', hash: 'sha256-ff73c...' }
                    ];
                } else {
                    files = [
                        { name: 'Valve_OEM_Guide_v3.pdf', hash: 'sha256-ee29a...' },
                        { name: 'Job_Order_JO-82194.xlsx', hash: 'sha256-9a2c3...' },
                        { name: 'RCA_Valve_Sticking.md', hash: 'sha256-11f8b...' }
                    ];
                }

                let listHtml = '';
                files.forEach(f => {
                    listHtml += `<li><i data-lucide="check-circle" class="text-emerald"></i> ${f.name} <span class="text-muted">(${f.hash})</span></li>`;
                });
                this.dom.evidenceManifestList.innerHTML = listHtml;
                lucide.createIcons();

                // Scroll down to display
                this.dom.evidenceResult.scrollIntoView({ behavior: 'smooth' });
            }, 1800);
        });

        this.dom.btnDownloadEvidence.addEventListener('click', () => {
            alert('Audit Evidence ZIP generated under certified plant SHA-256 manifest. Download initiated.');
        });
    },

    generateEvidence(asset, reg) {
        this.switchTab('compliance');
        this.dom.evAsset.value = asset;
        
        if (reg.includes('OISD')) this.dom.evReg.value = 'OISD';
        else if (reg.includes('PESO')) this.dom.evReg.value = 'PESO';
        else this.dom.evReg.value = 'Factory';

        this.dom.btnGenerateEvidence.click();
    },

    // -------------------------------------------------------------
    // Interactive Slides Presentation
    // -------------------------------------------------------------
    initSlides() {
        const slideItems = this.dom.slideItems;
        const totalSlides = slideItems.length;

        // Render bullet indicators
        let bulletHtml = '';
        for (let i = 1; i <= totalSlides; i++) {
            bulletHtml += `<span class="bullet ${i === 1 ? 'active' : ''}" data-to-slide="${i}"></span>`;
        }
        this.dom.slidesBullets.innerHTML = bulletHtml;

        const updateSlides = () => {
            slideItems.forEach(slide => {
                if (parseInt(slide.getAttribute('data-slide')) === this.state.activeSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update bullets
            const bullets = this.dom.slidesBullets.querySelectorAll('.bullet');
            bullets.forEach((bullet, idx) => {
                if (idx + 1 === this.state.activeSlide) {
                    bullet.classList.add('active');
                } else {
                    bullet.classList.remove('active');
                }
            });
        };

        this.dom.prevSlideBtn.addEventListener('click', () => {
            if (this.state.activeSlide > 1) {
                this.state.activeSlide--;
                updateSlides();
            }
        });

        this.dom.nextSlideBtn.addEventListener('click', () => {
            if (this.state.activeSlide < totalSlides) {
                this.state.activeSlide++;
                updateSlides();
            }
        });

        this.dom.slidesBullets.addEventListener('click', (e) => {
            if (e.target.classList.contains('bullet')) {
                this.state.activeSlide = parseInt(e.target.getAttribute('data-to-slide'));
                updateSlides();
            }
        });

        // Setup tabs between Slides and Architecture Diagram
        this.dom.pitchTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.dom.pitchTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const target = tab.getAttribute('data-pitch-tab');
                this.state.activePitchTab = target;

                this.dom.pitchTabContents.forEach(content => {
                    if (content.id === `pitch-${target}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
};

// Start App when loaded
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
