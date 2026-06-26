'use client';

import { useState, useEffect, useRef } from 'react';

// Secure URL sanitizer to prevent DOM-based XSS exploits (javascript: or data: protocols)
const sanitizeUrl = (url) => {
  if (!url) return '#';
  const trimmed = url.trim();
  // Allow only standard web protocols: http:// or https://
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
};

// Highly Original OSINT Intelligence Dataset with custom cover images and source links
const INTEL_FEED_DB = [
  {
    id: 1,
    title: "Critical Zero-Day In OpenSSL Library Discovered; Patch Released Immediately",
    source: "Hacker News / SecurityWeek",
    link: "https://www.securityweek.com/emergency-openssl-patch/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    published_at: "10 mins ago",
    category: "Security & IT",
    content: "A high-severity memory leak vulnerability has been discovered in OpenSSL versions 3.0 to 3.2. If exploited, an attacker can bypass encryption layers. System administrators are urged to apply the 3.2.1 patch immediately.",
    sentiment: "negative",
    severityIndex: "CRITICAL",
    editorialLeanings: { left: 25, center: 50, right: 25 },
    sourceDiversity: { independent: 50, corporate: 30, statePublic: 20 },
    factuality: "High",
    sourceOwnership: "Non-profit / Open Source Trust",
    entities: ["OpenSSL", "CVE-2026-9872", "Cryptography", "Patch 3.2.1"],
    coordinates: { x: 48, y: 26 },
    compareHeadlines: [
      { outlet: "Progressive Focus (MSNBC)", title: "Major Cryptographic Security Flaw Patched in OpenSSL Library" },
      { outlet: "Neutral Outlets (Reuters)", title: "OpenSSL Releases Emergency Security Fix Following Vulnerability Report" },
      { outlet: "Conservative Focus (Fox News)", title: "System Admins Warned: Upgrade OpenSSL Immediately to Avoid Data Leaks" }
    ],
    summaries: {
      exec: "A critical buffer over-read vulnerability exists in OpenSSL. Security patch version 3.2.1 resolves it. Organizations must patch systems immediately.",
      journalist: "Coverage is highly objective and technical across the board. Center-leaning sources focus on structural patching updates, while conservative outlets emphasize potential government and enterprise data leak risks.",
      student: "Excellent case study on cryptographic libraries and the vulnerability disclosure process. Key terms to research: Buffer over-read, memory leakage, OpenSSL, Open-source maintainer burn-out.",
      it: "Vulnerability CVE-2026-9872. Affects OpenSSL 3.0.x-3.2.x. Severity Score (CVSS): 8.8. Action: Upgrade binaries to 3.2.1. Run dependency check."
    }
  },
  {
    id: 2,
    title: "EU Enforces Landmark AI Regulatory Rules: High-Risk Systems Mandate Audit",
    source: "Reuters / TechCrunch",
    link: "https://www.reuters.com/technology/eu-artificial-intelligence-act-enforcement-2026/",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60",
    published_at: "1 hr ago",
    category: "Geopolitics",
    content: "The European Union's Artificial Intelligence Act officially enters its compliance phase today. It outlaws public biometric surveillance and requires independent compliance audits for high-impact models.",
    sentiment: "neutral",
    severityIndex: "ELEVATED",
    editorialLeanings: { left: 55, center: 30, right: 15 },
    sourceDiversity: { independent: 20, corporate: 60, statePublic: 20 },
    factuality: "High",
    sourceOwnership: "Corporate Conglomerate / Private Equity",
    entities: ["European Union", "AI Act", "Biometrics", "Compliance Auditing"],
    coordinates: { x: 48, y: 26 },
    compareHeadlines: [
      { outlet: "Progressive Focus (The Guardian)", title: "EU Takes Historical Leap in Safeguarding Human Rights Against AI Risks" },
      { outlet: "Neutral Outlets (AP News)", title: "EU Artificial Intelligence Act Compliance Phase Begins Today" },
      { outlet: "Conservative Focus (Wall Street Journal)", title: "Burdensome Regulations: EU AI Act Hits Tech Firms with Massive Red Tape" }
    ],
    summaries: {
      exec: "The EU AI Act enters enforcement phase. Restricts biometric identification and imposes rigorous audits on generative models.",
      journalist: "Strong framing differences. Progressive sources highlight human rights protections and ethical AI guardrails, while conservative sources frame the rules as excessive regulation throttling tech startup innovation.",
      student: "Important reference for international policy and tech ethics. Study the concept of 'Risk-based classification' in regulation.",
      it: "Compliance impact: High-impact foundational models must run mandatory safety audits. Generative outputs require visible watermarking. Assess API usage guidelines."
    }
  },
  {
    id: 4,
    title: "Lawrence Livermore Lab Reports Net Energy Gain in Fusion Research",
    source: "MIT Tech Review / Nature",
    link: "https://www.nature.com/articles/d41586-026-fusion-ignition",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
    published_at: "3 hrs ago",
    category: "Science & Research",
    content: "National Ignition Facility researchers successfully achieved scientific energy breakeven (Q > 1.2) for the third time, generating more energy from fusion than the laser energy input.",
    sentiment: "positive",
    severityIndex: "LOW",
    editorialLeanings: { left: 30, center: 60, right: 10 },
    sourceDiversity: { independent: 30, corporate: 10, statePublic: 60 },
    factuality: "High",
    sourceOwnership: "Public / State-funded Lab",
    entities: ["Livermore Lab", "Fusion Energy", "Q-Factor", "Clean Tech"],
    coordinates: { x: 22, y: 24 },
    compareHeadlines: [
      { outlet: "Progressive Focus (HuffPost)", title: "Clean Energy Revolution: Scientists Achieve Net Gain in Fusion Spark" },
      { outlet: "Neutral Outlets (AP News)", title: "Livermore Laboratory Reports Net Energy Breakeven in Fusion Test" },
      { outlet: "Conservative Focus (Washington Times)", title: "Government Fusion Project Hits Core Milestones but Commercialization Decades Away" }
    ],
    summaries: {
      exec: "Fusion energy breakeven achieved again with Q-factor exceeding 1.2. Validates inertial confinement fusion theories.",
      journalist: "Media reports are universally positive but show differing timelines. Progressive outlets focus on climate-change solutions, whereas conservative outlets emphasize the massive taxpayer costs and long timeline to commercialization.",
      student: "Key scientific concept: Q-factor (ratio of fusion energy output to laser input). Study Inertial Confinement Fusion vs. Magnetic Confinement (Tokamak).",
      it: "No immediate cybersecurity or hardware risk. High-performance computing clusters used for fusion modeling require massive data arrays."
    }
  },
  {
    id: 5,
    title: "Global Semiconductor Supply Chains Secure Alternate Sources for Critical Neon Gas",
    source: "Axios / Bloomberg",
    link: "https://www.bloomberg.com/news/articles/semiconductor-supply-neon-gas-facilities",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    published_at: "6 hrs ago",
    category: "Market & Finance",
    content: "In response to geopolitical trade restrictions, semiconductor manufacturers have successfully established alternative refining facilities in Japan and South Korea, shielding chip fabrication from supply shocks.",
    sentiment: "positive",
    severityIndex: "LOW",
    editorialLeanings: { left: 20, center: 70, right: 10 },
    sourceDiversity: { independent: 10, corporate: 80, statePublic: 10 },
    factuality: "High",
    sourceOwnership: "Financial News Syndicate",
    entities: ["Semiconductors", "Neon Supply", "Geopolitics", "Lithography"],
    coordinates: { x: 75, y: 28 },
    compareHeadlines: [
      { outlet: "Progressive Focus (MSNBC)", title: "Collaborative Global Efforts Protect Chip Supply from Geopolitical Crisis" },
      { outlet: "Neutral Outlets (Reuters)", title: "Chipmakers Relocate Neon Refining Hubs to Japan and South Korea" },
      { outlet: "Conservative Focus (Fox Business)", title: "Geopolitical Tensions Force Expensive Chip Supply Chain Redundancy" }
    ],
    summaries: {
      exec: "Semiconductor firms have secured alternate neon gas supply routes, mitigating supply chain risks.",
      journalist: "Objective coverage. Reports focus heavily on logistics and macroeconomics. Progressive outlets highlight international cooperation, while conservative outlets focus on capital expenditures.",
      student: "Case study on global supply chain vulnerabilities and economic geography. Study how gas refinement relates to lithography.",
      it: "Long-term hardware pricing stabilizer. Mitigates hardware procurement lead times for enterprise servers and GPUs."
    }
  }
];
;

export default function Home() {
  const [articles, setArticles] = useState(INTEL_FEED_DB);
  const [selectedArticle, setSelectedArticle] = useState(INTEL_FEED_DB[0]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [highFactualityOnly, setHighFactualityOnly] = useState(false);
  const [blindspotsOnly, setBlindspotsOnly] = useState(false);
  
  // Custom RSS sandbox state
  const [customFeedUrl, setCustomFeedUrl] = useState('');
  const [customFeedLoading, setCustomFeedLoading] = useState(false);
  const [customFeedResults, setCustomFeedResults] = useState(null);
  const [customFeedError, setCustomFeedError] = useState('');

  // AI Summary Switcher
  const [activeSummaryTab, setActiveSummaryTab] = useState('exec');

  // 3D Card Flip States (flipped state keyed by card ID)
  const [flippedCards, setFlippedCards] = useState({});
  const toggleFlip = (e, id) => {
    e.stopPropagation(); // Prevent card selection when flipping
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Diagnostics and System Status
  const [diagnostics, setDiagnostics] = useState({
    mode: 'Vercel Edge Cloud',
    apiHealth: 'Checking...',
    pingTime: 'Calculating...',
    inflowRate: '4.8 items/sec'
  });

  // Settings & Help Modals states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [themeScheme, setThemeScheme] = useState('space-blue');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [refreshRate, setRefreshRate] = useState('realtime');
  const [maxStories, setMaxStories] = useState(50);

  // UI styling state
  const [toastMessage, setToastMessage] = useState('');

  // Onboarding Tutorial State
  const [tutorialStep, setTutorialStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({ display: 'none' });
  const [tooltipStyle, setTooltipStyle] = useState({});

  // Refs for Tutorial Spotlights
  const biasCardRef = useRef(null);
  const personaTabsRef = useRef(null);
  const sandboxFormRef = useRef(null);
  const actionCenterRef = useRef(null);

  // Overhaul States: feedViewMode and Keyboard Command Palette
  const [feedViewMode, setFeedViewMode] = useState('card');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [cmdSelectedIndex, setCmdSelectedIndex] = useState(0);

  // Command palette configuration list
  const commandOptions = [
    { label: "Switch Layout: High-Density Stream", action: () => setFeedViewMode('list'), shortcut: "L" },
    { label: "Switch Layout: Visual 3D cards", action: () => setFeedViewMode('card'), shortcut: "C" },
    { label: "Filter Category: Security & IT Intel", action: () => setActiveCategory('Security & IT'), shortcut: "S" },
    { label: "Filter Category: Geopolitics", action: () => setActiveCategory('Geopolitics'), shortcut: "G" },
    { label: "Filter Category: Science & Research", action: () => setActiveCategory('Science & Research'), shortcut: "R" },
    { label: "Filter Category: Market & Finance", action: () => setActiveCategory('Market & Finance'), shortcut: "M" },
    { label: "Open Settings Preferences Console", action: () => { setIsSettingsOpen(true); setIsCmdOpen(false); }, shortcut: "Ctrl+," },
    { label: "Open Help & Documentation Manual", action: () => { setIsHelpOpen(true); setIsCmdOpen(false); }, shortcut: "?" },
    { label: "Guided Onboarding Walkthrough", action: () => { setTutorialStep(1); setIsCmdOpen(false); }, shortcut: "T" },
    { label: "Verify RSS Custom Sandbox", action: () => {
      const sandboxInput = document.querySelector('.sandbox-input');
      if (sandboxInput) sandboxInput.focus();
      setIsCmdOpen(false);
    }, shortcut: "V" },
    { label: "Export Selected Report", action: () => { compileAndCopyReport(); setIsCmdOpen(false); }, shortcut: "E" }
  ];

  const filteredCommands = commandOptions.filter(opt => 
    opt.label.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  const handleCommandSelect = (index) => {
    const cmd = filteredCommands[index];
    if (cmd) {
      cmd.action();
      setIsCmdOpen(false);
    }
  };

  const handleCommandKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCmdSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCmdSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSelect(cmdSelectedIndex);
    }
  };

  // Register keyboard handler for Ctrl+K, Ctrl+,, ?, and layout toggles
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette: Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => {
          if (!prev) {
            setCmdSearch('');
            setCmdSelectedIndex(0);
          }
          return !prev;
        });
      }
      
      // Settings: Ctrl+,
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }

      // Help: ? (Shift + /)
      if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
      }

      // Layout Switch: L for list, C for card
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'l') {
          setFeedViewMode('list');
        } else if (e.key.toLowerCase() === 'c') {
          setFeedViewMode('card');
        }
      }

      // Escape to close all overlays
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
        setIsSettingsOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Fetch real articles from local backend if available (fallback to local high-fidelity list)
  useEffect(() => {
    // Check if tutorial is completed
    const isTutorialDone = localStorage.getItem('nr_osint_tutorial_v1');
    if (!isTutorialDone) {
      setTimeout(() => setTutorialStep(1), 1200);
    }

    const startPing = performance.now();
    const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/news' : '/api/news';
    
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const endPing = performance.now();
        const latency = `${Math.round(endPing - startPing)}ms`;
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Map backend parsed articles and enrich with Media Literacy/OSINT variables
          const enriched = data.map((item, idx) => {
            const seed = idx + 5;
            const left = Math.floor(Math.sin(seed) * 30 + 40);
            const right = Math.floor(Math.cos(seed) * 25 + 30);
            const center = 100 - left - right;
            const isIT = idx % 2 === 0;
            
            return {
              id: seed,
              title: item.title,
              source: item.source || "RSS Ingest",
              link: item.link || "https://www.reuters.com",
              image: isIT 
                ? "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60" // Server Nodes
                : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60", // Geopolitics Globe
              published_at: item.published_at || "Recent",
              category: isIT ? "Security & IT" : "Geopolitics",
              content: item.content || "",
              sentiment: left > right ? "positive" : "negative",
              severityIndex: idx % 3 === 0 ? "ELEVATED" : "LOW",
              editorialLeanings: { left, center, right },
              sourceDiversity: { independent: 30, corporate: 50, statePublic: 20 },
              factuality: left > 60 || right > 60 ? "Mixed" : "High",
              sourceOwnership: "Public / State Media",
              entities: ["RSS Feed Ingestion", item.source || "Unknown Publisher"],
              coordinates: isIT ? { x: 48, y: 26 } : { x: 60, y: 40 },
              compareHeadlines: [
                { outlet: "Progressive Focus", title: item.title },
                { outlet: "Neutral Outlets", title: item.title },
                { outlet: "Conservative Focus", title: item.title }
              ],
              summaries: {
                exec: item.content || "No content extracted.",
                journalist: "Media outlets cover this story with standard parameters. Minimal polarization detected.",
                student: "Useful current event tracking. Monitor future developments for structural analysis.",
                it: "Evaluate endpoints and connectivity logs related to this technical report."
              }
            };
          });
          
          setArticles([...INTEL_FEED_DB, ...enriched]);
          setDiagnostics(prev => ({
            ...prev,
            apiHealth: 'Operational',
            pingTime: latency
          }));
        } else {
          setDiagnostics(prev => ({
            ...prev,
            apiHealth: 'Offline (Using Local DB)',
            pingTime: 'N/A'
          }));
        }
      })
      .catch(err => {
        console.log("Local backend connection skipped or unavailable (Standard for Edge-Only static deploy)");
        setDiagnostics(prev => ({
          ...prev,
          apiHealth: 'Offline (Using Edge DB)',
          pingTime: 'N/A'
        }));
      });
  }, []);

  // Apply theme class and layout density class dynamically to body
  useEffect(() => {
    // Remove other theme classes
    document.body.classList.remove('theme-space-blue', 'theme-cyber-amber', 'theme-radar-green', 'theme-polar-light');
    document.body.classList.add(`theme-${themeScheme}`);
    
    // Toggle density class
    document.body.classList.toggle('density-compact', layoutDensity === 'compact');
  }, [themeScheme, layoutDensity]);

  // Dynamic Spotlight Tutorial Positioning
  useEffect(() => {
    if (tutorialStep === 0) {
      setSpotlightStyle({ display: 'none' });
      return;
    }

    const updateSpotlight = () => {
      let target = null;
      let placement = 'bottom';

      if (tutorialStep === 1) {
        target = biasCardRef.current;
        placement = 'left';
      } else if (tutorialStep === 2) {
        target = personaTabsRef.current;
        placement = 'left';
      } else if (tutorialStep === 3) {
        target = sandboxFormRef.current;
        placement = 'right';
      } else if (tutorialStep === 4) {
        target = actionCenterRef.current;
        placement = 'top';
      }

      // Check if target is visible in the current layout
      const isVisible = target && target.getBoundingClientRect().width > 0;

      if (isVisible) {
        const rect = target.getBoundingClientRect();
        const padding = 8;
        
        setSpotlightStyle({
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding + window.scrollX,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          display: 'block'
        });

        // Calculate responsive tooltip coordinates
        let top = rect.bottom + 15;
        let left = rect.left + (rect.width / 2) - 160;

        if (placement === 'left') {
          if (rect.left > 340) {
            top = rect.top + (rect.height / 2) - 100;
            left = rect.left - 340;
          } else {
            top = rect.bottom + 15;
            left = Math.max(10, rect.left);
          }
        } else if (placement === 'right') {
          if (window.innerWidth - rect.right > 340) {
            top = rect.top;
            left = rect.right + 20;
          } else {
            top = rect.bottom + 15;
            left = Math.max(10, rect.left - 160);
          }
        } else if (placement === 'top') {
          if (rect.top > 220) {
            top = rect.top - 200;
            left = rect.left + (rect.width / 2) - 160;
          } else {
            top = rect.bottom + 15;
            left = rect.left + (rect.width / 2) - 160;
          }
        }

        // Keep inside screen boundaries
        left = Math.max(10, Math.min(window.innerWidth - 330, left));
        top = Math.max(10, Math.min(window.innerHeight - 250, top));

        setTooltipStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          transform: 'none',
        });
      } else {
        // Fallback: Hide spotlight and show tooltip centered like a modal
        setSpotlightStyle({ display: 'none' });
        setTooltipStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
        });
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [tutorialStep, selectedArticle]);

  // Handle tutorial nav
  const handleTutorialNext = () => {
    if (tutorialStep >= 4) {
      localStorage.setItem('nr_osint_tutorial_v1', 'completed');
      setTutorialStep(0);
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };

  const tutorialMessages = [
    null,
    { title: "Editorial Spectrum Analytics", desc: "This visualizes the editorial stances of reporting outlets. It maps how progressive vs conservative sources allocate coverage to this specific story." },
    { title: "Multi-Angle AI Summaries", desc: "Pivots the text analysis on-the-fly. Switch tabs to view specific summaries for journalists, students, or IT-centric vulnerability reports." },
    { title: "Ingestion Sandbox & Verification", desc: "Verify new intelligence feeds instantly. Input a public RSS link to verify and test structure client-side without CPU bottlenecks." },
    { title: "OSINT Report Compiler", desc: "Export citations and compile comprehensive markdown reports directly to your local researcher clipboard." }
  ];

  // Run Custom RSS Sandbox test client-side (no performance bottleneck)
  const handleRssTest = (e) => {
    e.preventDefault();
    if (!customFeedUrl) return;

    setCustomFeedLoading(true);
    setCustomFeedError('');
    setCustomFeedResults(null);

    // Using AllOrigins CORS proxy to parse client-side
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(customFeedUrl)}`;

    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error("Network response error. Ensure URL is correct.");
        return res.text();
      })
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
          throw new Error("Invalid RSS XML file structure.");
        }

        const channelTitle = xmlDoc.querySelector("channel > title")?.textContent || "Unknown Channel";
        const items = xmlDoc.getElementsByTagName("item");
        const articlesList = [];

        for (let i = 0; i < Math.min(items.length, 3); i++) {
          const itemTitle = items[i].querySelector("title")?.textContent || "No Title";
          const itemLink = items[i].querySelector("link")?.textContent || "#";
          articlesList.push({ title: itemTitle, link: itemLink });
        }

        setCustomFeedResults({
          channelTitle,
          itemsCount: items.length,
          preview: articlesList
        });
        setCustomFeedLoading(false);
      })
      .catch(err => {
        setCustomFeedError(err.message || "Failed to fetch and parse feed.");
        setCustomFeedLoading(false);
      });
  };

  // Compile and Export Markdown report
  const compileAndCopyReport = () => {
    if (!selectedArticle) return;
    
    const doc = `
# OSINT Intelligence Report: ${selectedArticle.title}
*   **Ingestion Source:** ${selectedArticle.source}
*   **Category:** ${selectedArticle.category}
*   **Factuality Index:** ${selectedArticle.factuality}
*   **Editorial Leanings:** Progressive ${selectedArticle.editorialLeanings.left}%, Neutral ${selectedArticle.editorialLeanings.center}%, Conservative ${selectedArticle.editorialLeanings.right}%
*   **Source Diversity:** Independent ${selectedArticle.sourceDiversity.independent}%, Corporate ${selectedArticle.sourceDiversity.corporate}%, Public/State ${selectedArticle.sourceDiversity.statePublic}%
*   **Ownership Model:** ${selectedArticle.sourceOwnership}

## AI Executive Summary
${selectedArticle.summaries.exec}

## Media Analysis & Framing (Journalist Perspective)
${selectedArticle.summaries.journalist}

## IT & Infrastructure Vulnerability Implications
${selectedArticle.summaries.it}

## Citations
*   APA: ${selectedArticle.source}. (${new Date().getFullYear()}). *${selectedArticle.title}*. Retrieved from ${selectedArticle.content.substring(0, 40)}...
    `;
    
    navigator.clipboard.writeText(doc.trim());
    setToastMessage("Report copied to clipboard!");
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Compile and copy citation
  const compileCitation = () => {
    if (!selectedArticle) return;
    const citation = `"${selectedArticle.title}." ${selectedArticle.source}. Web. ${new Date().toLocaleDateString()}.`;
    navigator.clipboard.writeText(citation);
    setToastMessage("APA/MLA Citation copied!");
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Filter logic
  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.content.toLowerCase().includes(search.toLowerCase()) || 
                          a.entities.some(e => e.toLowerCase().includes(search.toLowerCase()));
                          
    const matchesCategory = activeCategory === 'All' ? true : a.category === activeCategory;
    const matchesFactuality = highFactualityOnly ? a.factuality === 'High' : true;
    
    // Blindspots: e.g. Left blindspot (high right bias coverage, low left) or vice versa
    const matchesBlindspot = blindspotsOnly 
      ? (a.editorialLeanings.left > 50 && a.editorialLeanings.right < 20) || (a.editorialLeanings.right > 50 && a.editorialLeanings.left < 20)
      : true;
      
    return matchesSearch && matchesCategory && matchesFactuality && matchesBlindspot;
  });

  return (
    <>
      <div className="mesh-bg"></div>
      <div className="grid-overlay"></div>

      <div className="app-layout">
        
        {/* Column 1: Control Panel & Status */}
        <aside className="left-panel">
          <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="logo-container" style={{ position: 'relative', overflow: 'hidden', width: '38px', height: '38px', background: 'transparent', boxShadow: 'none' }}>
              {/* Outer Ring & sweep SVG */}
              <svg width="38" height="38" viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
                <circle cx="20" cy="20" r="6" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
                {/* Scanner sweep line */}
                <line x1="20" y1="20" x2="20" y2="2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ transformOrigin: '20px 20px', animation: 'spinSweep 4s linear infinite' }} />
              </svg>
              {/* Blinking center dot */}
              <div style={{ position: 'absolute', top: '17px', left: '17px', width: '6px', height: '6px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 8px #fff' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-title" style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>NewsRadar</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Open-Source OSINT</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-link active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Intelligence Center</span>
            </button>
            <button className="nav-link" onClick={() => setThemeScheme(t => t === 'polar-light' ? 'space-blue' : 'polar-light')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {themeScheme === 'polar-light' ? <circle cx="12" cy="12" r="5"></circle> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>}
              </svg>
              <span>{themeScheme === 'polar-light' ? 'Dark Theme' : 'Light Theme'}</span>
            </button>
            <button className="nav-link" onClick={() => setIsSettingsOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>System Settings</span>
            </button>
            <button className="nav-link" onClick={() => setIsHelpOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>Help & Manual</span>
            </button>
            <button className="nav-link" onClick={() => setTutorialStep(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Onboarding Help</span>
            </button>

            {/* Enterprise OSINT metadata tags */}
            <div className="osint-identity-grid">
              <div className="osint-tag-pill">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}></span>
                <span>v2.4.0-OSS</span>
              </div>
              <div className="osint-tag-pill">
                <span>Node: Edge APAC-EAST</span>
              </div>
              <div className="osint-tag-pill">
                <span>Sig Inbound: 4.8 Hz</span>
              </div>
            </div>
          </nav>

          {/* System Monitor Widget */}
          <div className="monitor-widget">
            <div className="monitor-header">
              <span>Edge Status Monitor</span>
              <div className="pulse-dot"></div>
            </div>
            <div className="monitor-item">
              <span>Routing Node:</span>
              <span>{diagnostics.mode}</span>
            </div>
            <div className="monitor-item">
              <span>Local API Stack:</span>
              <span style={{color: diagnostics.apiHealth.includes('Operational') ? 'var(--success)' : 'var(--text-muted)'}}>{diagnostics.apiHealth}</span>
            </div>
            <div className="monitor-item">
              <span>Ping Latency:</span>
              <span>{diagnostics.pingTime}</span>
            </div>
            <div className="monitor-item">
              <span>Signal Inflow:</span>
              <span>{diagnostics.inflowRate}</span>
            </div>
          </div>

          {/* RSS Custom Sandbox (IT/Journalist Custom Feed Tester) */}
          <div className="rss-sandbox" ref={sandboxFormRef}>
            <div className="sandbox-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
              <span>RSS Ingestion Sandbox</span>
            </div>
            <form onSubmit={handleRssTest} className="sandbox-form">
              <input 
                type="text" 
                className="sandbox-input" 
                placeholder="Paste public RSS feed url..." 
                value={customFeedUrl}
                onChange={e => setCustomFeedUrl(e.target.value)}
              />
              <button type="submit" className="sandbox-btn">
                {customFeedLoading ? '...' : 'Verify'}
              </button>
            </form>

            {customFeedError && (
              <div className="sandbox-result" style={{color: 'var(--danger)'}}>
                Error: {customFeedError}
              </div>
            )}

            {customFeedResults && (
              <div className="sandbox-result">
                <div style={{color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.2rem'}}>✓ Ingestion Verified</div>
                <div style={{color: 'var(--text-main)', fontWeight: 600}}>{customFeedResults.channelTitle}</div>
                <div style={{color: 'var(--text-muted)'}}>{customFeedResults.itemsCount} stories parsed. Previewing:</div>
                <ul style={{marginTop: '0.4rem', listStyle: 'none', paddingLeft: 0}}>
                  {customFeedResults.preview.map((p, idx) => (
                    <li key={idx} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.65rem'}}>
                      • <a href={sanitizeUrl(p.link)} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>{p.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Column 2: Feed Stream (Center) */}
        <section className="center-feed">
          <header className="feed-header">
            <div className="search-bar-container" onClick={() => setIsCmdOpen(true)} style={{ cursor: 'pointer' }}>
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="search-input-field" style={{ color: search ? 'var(--text-main)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                {search || "Search signals, tags, or press Ctrl+K to access Command Center..."}
              </span>
              <kbd style={{ fontSize: '0.65rem', background: 'var(--panel-border)', padding: '0.2rem 0.45rem', borderRadius: '4px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>Ctrl+K</kbd>
            </div>
            
            <div className="filters-row">
              <div className="category-pills">
                {['All', 'Security & IT', 'Geopolitics', 'Science & Research', 'Market & Finance'].map(cat => (
                  <button 
                    key={cat} 
                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="switches-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                <label className="switch-label">
                  <input 
                    type="checkbox" 
                    checked={highFactualityOnly} 
                    onChange={e => setHighFactualityOnly(e.target.checked)}
                  />
                  <span>High Factuality</span>
                </label>
                <label className="switch-label">
                  <input 
                    type="checkbox" 
                    checked={blindspotsOnly} 
                    onChange={e => setBlindspotsOnly(e.target.checked)}
                  />
                  <span>Blindspots</span>
                </label>

                {/* View Layout Switcher */}
                <div className="view-toggle-bar" style={{ marginLeft: '0.5rem' }}>
                  <button 
                    type="button"
                    className={`view-toggle-btn ${feedViewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setFeedViewMode('list')}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <span>Stream</span>
                  </button>
                  <button 
                    type="button"
                    className={`view-toggle-btn ${feedViewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setFeedViewMode('card')}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Industry Standard News Feed - Toggleable View Mode */}
          {feedViewMode === 'list' ? (
            /* High-Density Analyst Stream (List View) */
            <div className="news-stream custom-scroll analyst-stream" style={{ padding: '1.5rem 2rem' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No signals matching your search criteria.
                </div>
              ) : (
                filtered.map(article => {
                  const totalBias = article.editorialLeanings.left + article.editorialLeanings.center + article.editorialLeanings.right;
                  return (
                    <div 
                      key={article.id} 
                      className={`list-item-row severity-${article.severityIndex} ${selectedArticle?.id === article.id ? 'active' : ''}`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="list-item-content">
                        <div className="list-item-header">
                          <span className="source-badge">{article.source}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{article.published_at}</span>
                        </div>
                        <h3 className="list-item-title">{article.title}</h3>
                        <p className="list-item-desc">{article.content}</p>
                        
                        <div className="list-item-footer">
                          {/* Sparkline bias */}
                          <div className="bias-sparkline-container" style={{ width: '120px', height: '3px', margin: 0 }}>
                            <div className="bias-spark left" style={{width: `${(article.editorialLeanings.left / totalBias) * 100}%`}}></div>
                            <div className="bias-spark center" style={{width: `${(article.editorialLeanings.center / totalBias) * 100}%`}}></div>
                            <div className="bias-spark right" style={{width: `${(article.editorialLeanings.right / totalBias) * 100}%`}}></div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                              {article.category}
                            </span>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              color: article.severityIndex === 'CRITICAL' ? 'var(--danger)' : article.severityIndex === 'ELEVATED' ? 'var(--warning)' : 'var(--success)', 
                              fontWeight: 'bold' 
                            }}>
                              [{article.severityIndex}]
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Visual Briefing Layout (3D Flash Cards Grid) */
            <div className="news-stream custom-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No signals matching your search criteria.
                </div>
              ) : (
                filtered.map(article => {
                  const totalBias = article.editorialLeanings.left + article.editorialLeanings.center + article.editorialLeanings.right;
                  const isFlipped = flippedCards[article.id] || false;
                  
                  return (
                    <div key={article.id} className={`flash-card-container ${selectedArticle?.id === article.id ? 'active' : ''}`} style={{ height: '390px', marginBottom: 0 }}>
                      <div className={`flash-card-inner ${isFlipped ? 'flipped' : ''}`}>
                        
                        {/* Front of the Flash Card */}
                        <div 
                          className="flash-card-front"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <img 
                            src={article.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60"} 
                            alt={article.title} 
                            className="card-cover-image" 
                            loading="lazy"
                          />
                          
                          <div className="card-body-content">
                            <div className="item-meta">
                              <div className="meta-left">
                                <span className="source-badge">{article.source}</span>
                                <span className="time-stamp">• {article.published_at}</span>
                              </div>
                              <span className={`sentiment-dot-badge ${article.sentiment}`}>
                                {article.sentiment === 'negative' ? 'Threat' : article.sentiment === 'positive' ? 'Opportunity' : 'Neutral'}
                              </span>
                            </div>

                            <h3 className="item-title" style={{ 
                              fontSize: '0.95rem', 
                              lineClamp: 2, 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden',
                              margin: '0.2rem 0'
                            }}>{article.title}</h3>
                            
                            <p className="item-snippet" style={{ 
                              fontSize: '0.78rem', 
                              lineClamp: 2, 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden',
                              marginBottom: '0.4rem'
                            }}>{article.content}</p>

                            {/* Sparkline bias representation */}
                            <div className="bias-sparkline-container" style={{ margin: 'auto 0 0.5rem 0' }}>
                              <div className="bias-spark left" style={{width: `${(article.editorialLeanings.left / totalBias) * 100}%`}}></div>
                              <div className="bias-spark center" style={{width: `${(article.editorialLeanings.center / totalBias) * 100}%`}}></div>
                              <div className="bias-spark right" style={{width: `${(article.editorialLeanings.right / totalBias) * 100}%`}}></div>
                            </div>
                            
                            <button 
                              className="flip-action-btn"
                              onClick={(e) => toggleFlip(e, article.id)}
                            >
                              Quick Brief ⟳
                            </button>
                          </div>
                        </div>

                        {/* Back of the Flash Card (AI Summary) */}
                        <div className="flash-card-back">
                          <div className="back-header">
                            <span className="back-title">AI Ingestion Briefing</span>
                            <button 
                              onClick={(e) => toggleFlip(e, article.id)}
                              style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="back-content-scroll custom-scroll">
                            <p style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--accent)' }}>
                              [{article.category}] • Factuality: {article.factuality}
                            </p>
                            <p style={{ fontStyle: 'italic', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                              {article.title}
                            </p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <li style={{ position: 'relative', paddingLeft: '0.75rem', fontSize: '0.75rem', lineHeight: 1.35 }}>
                                <span style={{ color: 'var(--accent)', position: 'absolute', left: 0 }}>▪</span>
                                <strong>Fact:</strong> {article.summaries.exec}
                              </li>
                              <li style={{ position: 'relative', paddingLeft: '0.75rem', fontSize: '0.75rem', lineHeight: 1.35 }}>
                                <span style={{ color: 'var(--accent)', position: 'absolute', left: 0 }}>▪</span>
                                <strong>Impact:</strong> {article.summaries.it}
                              </li>
                            </ul>
                          </div>
                          
                          <button 
                            className="flip-action-btn"
                            onClick={(e) => toggleFlip(e, article.id)}
                          >
                            Return ⟳
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* Column 3: Deep Analysis Panel (Right) */}
        <section className="analysis-panel custom-scroll">
          {!selectedArticle ? (
            <div className="analysis-placeholder">
              <div className="placeholder-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <p>Select an intelligence signal from the feed stream to begin multi-source polarization analysis.</p>
            </div>
          ) : (
            <div className="analysis-content">
              <header className="analysis-header">
                <div className="analysis-meta">
                  <span>{selectedArticle.category}</span>
                  <span style={{
                    color: selectedArticle.severityIndex === 'CRITICAL' ? 'var(--danger)' : selectedArticle.severityIndex === 'ELEVATED' ? 'var(--warning)' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase'
                  }}>
                    [Risk: {selectedArticle.severityIndex}]
                  </span>
                </div>
                <h2 className="analysis-title">{selectedArticle.title}</h2>
                <a href={sanitizeUrl(selectedArticle.link || '#')} target="_blank" rel="noopener noreferrer" className="visit-link">
                  <span>Open raw intelligence source</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </header>

              {/* Geopolitical Threat Map Widget */}
              <div className="threat-map-card">
                <div className="bias-card-title">Geopolitical Threat Hotspot Map</div>
                <div className="map-container">
                  {/* Detailed vector world map with high-tech grid overlay */}
                  <svg viewBox="0 0 100 80" className="map-svg" fill="none">
                    {/* Grid Backdrop Lines */}
                    <line x1="0" y1="20" x2="100" y2="20" className="map-grid-line" />
                    <line x1="0" y1="40" x2="100" y2="40" className="map-grid-line" />
                    <line x1="0" y1="60" x2="100" y2="60" className="map-grid-line" />
                    <line x1="20" y1="0" x2="20" y2="80" className="map-grid-line" />
                    <line x1="40" y1="0" x2="40" y2="80" className="map-grid-line" />
                    <line x1="60" y1="0" x2="60" y2="80" className="map-grid-line" />
                    <line x1="80" y1="0" x2="80" y2="80" className="map-grid-line" />

                    {/* Continental Polygons with theme-adaptive fill and stroke */}
                    {/* North America */}
                    <path d="M12,18 L18,10 L28,6 L38,8 L36,18 L28,20 L30,28 L24,34 L18,34 L12,24 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                    {/* South America */}
                    <path d="M22,36 L28,36 L30,42 L26,56 L20,62 L18,52 L20,44 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                    {/* Greenland */}
                    <path d="M30,4 L38,5 L36,12 L30,10 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                    {/* Africa */}
                    <path d="M42,32 L54,32 L56,38 L54,46 L48,54 L44,48 L40,42 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                    {/* Eurasia */}
                    <path d="M40,12 L50,8 L64,10 L78,8 L86,16 L88,26 L80,34 L72,36 L62,38 L50,30 L42,24 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                    {/* Australia */}
                    <path d="M74,48 L82,48 L84,54 L76,56 Z" fill="rgba(99, 102, 241, 0.04)" stroke="var(--panel-border)" strokeWidth="0.8" />
                  </svg>
                  {/* Pulsing pointer dot based on selected article coordinates */}
                  {selectedArticle.coordinates && (
                    <div 
                      className="map-pulse-dot"
                      style={{
                        left: `${selectedArticle.coordinates.x}%`,
                        top: `${selectedArticle.coordinates.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="map-pulse-ring"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Bias Profile Card with Circular Gauge */}
              <div className="bias-analysis-card" ref={biasCardRef}>
                <div className="bias-card-title">Editorial Leanings Spectrum</div>
                
                {(() => {
                  const leftPct = selectedArticle.editorialLeanings.left || 0;
                  const centerPct = selectedArticle.editorialLeanings.center || 0;
                  const rightPct = selectedArticle.editorialLeanings.right || 0;
                  const weightedScore = (leftPct * 0) + (centerPct * 50) + (rightPct * 100);
                  const biasIndex = Math.round(weightedScore / 100);
                  const needleRotation = (biasIndex / 100) * 180 - 90;

                  const factualityPct = selectedArticle.factuality === 'High' ? 95 : selectedArticle.factuality === 'Mixed' ? 60 : 30;
                  const radialCircumference = 2 * Math.PI * 22;
                  const radialOffset = radialCircumference * (1 - factualityPct / 100);
                  const credibilityColor = selectedArticle.factuality === 'High' ? 'var(--success)' : selectedArticle.factuality === 'Mixed' ? 'var(--warning)' : 'var(--danger)';

                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0 1rem 0' }}>
                        {/* Semi-circular dial gauge */}
                        <svg width="200" height="110" viewBox="0 0 200 110" className="gauge-svg">
                          <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="var(--bias-left)" />
                              <stop offset="50%" stopColor="var(--bias-center)" />
                              <stop offset="100%" stopColor="var(--bias-right)" />
                            </linearGradient>
                          </defs>
                          {/* Outer Gauge Track Arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.05)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                          />
                          {/* Colored gradient arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="url(#gaugeGradient)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset="0"
                          />
                          {/* Pointer Needle */}
                          <g className="gauge-needle" style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '100px 100px' }}>
                            <line x1="100" y1="100" x2="100" y2="35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="100" cy="100" r="6" fill="#ffffff" />
                          </g>
                          {/* Score tag in center */}
                          <text x="100" y="95" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">
                            {biasIndex < 40 ? "Left-Leaning" : biasIndex > 60 ? "Right-Leaning" : "Balanced"}
                          </text>
                        </svg>
                      </div>

                      <div className="bias-bar-labels" style={{ marginTop: '0.2rem', fontSize: '0.75rem' }}>
                        <span style={{color: 'var(--bias-left)'}}>Left ({leftPct}%)</span>
                        <span style={{color: 'var(--bias-center)'}}>Center ({centerPct}%)</span>
                        <span style={{color: 'var(--bias-right)'}}>Right ({rightPct}%)</span>
                      </div>

                      {/* Highly Original Feature: Source Diversity Stacked Bar */}
                      <div className="bias-card-title" style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Source Diversity Index</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span style={{ color: '#60a5fa' }}>Independent ({selectedArticle.sourceDiversity.independent}%)</span>
                        <span style={{ color: '#fb7185' }}>Corporate ({selectedArticle.sourceDiversity.corporate}%)</span>
                        <span style={{ color: '#34d399' }}>Public/State ({selectedArticle.sourceDiversity.statePublic}%)</span>
                      </div>
                      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ height: '100%', background: '#60a5fa', width: `${selectedArticle.sourceDiversity.independent}%` }}></div>
                        <div style={{ height: '100%', background: '#fb7185', width: `${selectedArticle.sourceDiversity.corporate}%` }}></div>
                        <div style={{ height: '100%', background: '#34d399', width: `${selectedArticle.sourceDiversity.statePublic}%` }}></div>
                      </div>

                      {/* Radial Credibility Meter */}
                      <div className="radial-meter-container" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative', width: '54px', height: '54px' }}>
                          <svg className="radial-progress-svg" viewBox="0 0 50 50">
                            <circle className="radial-circle-bg" cx="25" cy="25" r="22" />
                            <circle 
                              className="radial-circle-val" 
                              cx="25" 
                              cy="25" 
                              r="22" 
                              style={{ 
                                strokeDasharray: radialCircumference, 
                                strokeDashoffset: radialOffset,
                                stroke: credibilityColor 
                              }} 
                            />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                            {factualityPct}%
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Factuality Integrity</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: credibilityColor }}>{selectedArticle.factuality} Quality</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Source Ownership: {selectedArticle.sourceOwnership}</span>
                        </div>
                      </div>

                      <div className="credibility-badges" style={{ marginTop: '0.75rem' }}>
                        <div className="cred-badge">
                          <span className="label">Verification Code</span>
                          <span className="value" style={{ fontSize: '0.7rem' }}>OSINT-{(selectedArticle.editorialLeanings.left * 17) % 1000}</span>
                        </div>
                        <div className="cred-badge">
                          <span className="label">Source Type</span>
                          <span className="value" style={{ fontSize: '0.7rem' }}>Multi-Node Ingest</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Persona summaries tab switcher */}
              <div className="summary-container" ref={personaTabsRef}>
                <div className="summary-tabs">
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'exec' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('exec')}
                  >
                    Executive
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'journalist' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('journalist')}
                  >
                    Journalist
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'student' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('student')}
                  >
                    Student
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'it' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('it')}
                  >
                    IT & Security
                  </button>
                </div>

                <div className="summary-textbox">
                  {activeSummaryTab === 'exec' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.exec}</p>
                  )}
                  {activeSummaryTab === 'journalist' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.journalist}</p>
                  )}
                  {activeSummaryTab === 'student' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.student}</p>
                  )}
                  {activeSummaryTab === 'it' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5, fontFamily: 'var(--font-mono)'}}>{selectedArticle.summaries.it}</p>
                  )}
                </div>
              </div>

              {/* Highly Original Feature: Extracted Entity Tags */}
              <div className="compare-card">
                <div className="bias-card-title">Extracted Intelligence Entities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {selectedArticle.entities.map((ent, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => setSearch(ent)}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--accent)';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                        e.target.style.color = 'var(--accent)';
                      }}
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compare coverage headlines grid */}
              <div className="compare-card">
                <div className="bias-card-title">Compare Outlets Headlines</div>
                {selectedArticle.compareHeadlines.map((h, idx) => {
                  let colorClass = 'center';
                  if (h.outlet.includes('Progressive')) colorClass = 'left';
                  if (h.outlet.includes('Conservative')) colorClass = 'right';

                  return (
                    <div className="compare-row" key={idx}>
                      <span className={`compare-outlet ${colorClass}`}>{h.outlet}</span>
                      <span className="compare-headline">"{h.title}"</span>
                    </div>
                  );
                })}
              </div>

              {/* OSINT Action center */}
              <div className="action-center" ref={actionCenterRef}>
                <button className="action-btn secondary" onClick={compileCitation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <span>Cite Source</span>
                </button>
                <button className="action-btn primary" onClick={compileAndCopyReport}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Copy notification toast */}
      {toastMessage && (
        <div className="toast-msg">
          {toastMessage}
        </div>
      )}

      {/* Dynamic Guided Onboarding Tutorial */}
      {tutorialStep > 0 && (
        <div className="tutorial-overlay">
          <div className="tutorial-backdrop"></div>
          <div className="tutorial-spotlight" style={spotlightStyle}></div>
          <div className="tutorial-tooltip" style={tooltipStyle}>
            {spotlightStyle.display !== 'none' && tutorialStep === 1 && <div className="tutorial-pointer pointer-right"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 2 && <div className="tutorial-pointer pointer-right"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 3 && <div className="tutorial-pointer pointer-left"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 4 && <div className="tutorial-pointer pointer-bottom"></div>}

            <h3 className="tutorial-header">{tutorialMessages[tutorialStep]?.title}</h3>
            <p className="tutorial-desc">{tutorialMessages[tutorialStep]?.desc}</p>
            
            <div className="tutorial-nav">
              <div className="tutorial-dots">
                {[1,2,3,4].map(n => (
                  <div key={n} className={`tutorial-dot ${tutorialStep === n ? 'active' : ''}`}></div>
                ))}
              </div>
              <button className="tutorial-btn" onClick={handleTutorialNext}>
                {tutorialStep === 4 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">System Settings Console</span>
              <button className="modal-close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-sidebar">
                <button className="modal-tab-btn active">Preferences</button>
              </div>
              <div className="modal-content-area">
                <div className="settings-section-title">Ingestion Preferences</div>
                <div className="settings-row">
                  <label className="settings-label">Signal Refresh Rate</label>
                  <select 
                    className="settings-select" 
                    value={refreshRate} 
                    onChange={e => setRefreshRate(e.target.value)}
                  >
                    <option value="realtime">Real-time Stream</option>
                    <option value="5m">5 Minute Ingest Poll</option>
                    <option value="15m">15 Minute Ingest Poll</option>
                  </select>
                </div>
                <div className="settings-row">
                  <label className="settings-label">Max Inbound Stories</label>
                  <select 
                    className="settings-select" 
                    value={maxStories} 
                    onChange={e => setMaxStories(Number(e.target.value))}
                  >
                    <option value={20}>20 Signals</option>
                    <option value={50}>50 Signals</option>
                    <option value={100}>100 Signals</option>
                  </select>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>Interface Configurations</div>
                <div className="settings-row">
                  <label className="settings-label">Layout Density</label>
                  <select 
                    className="settings-select" 
                    value={layoutDensity} 
                    onChange={e => setLayoutDensity(e.target.value)}
                  >
                    <option value="comfortable">Comfortable (Standard)</option>
                    <option value="compact">Compact Analyst Grid</option>
                  </select>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>Theme Console Schema</div>
                <div className="theme-swatches-grid">
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'space-blue' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('space-blue')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#6366f1' }}>Space Blue</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#0b0f19' }}></div>
                      <div className="theme-color-pill" style={{ background: '#6366f1' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'cyber-amber' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('cyber-amber')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#f59e0b' }}>Cyber Amber</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#060400' }}></div>
                      <div className="theme-color-pill" style={{ background: '#f59e0b' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'radar-green' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('radar-green')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#10b981' }}>Radar Green</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#000802' }}></div>
                      <div className="theme-color-pill" style={{ background: '#10b981' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'polar-light' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('polar-light')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#4f46e5' }}>Polar Light</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#f8fafc' }}></div>
                      <div className="theme-color-pill" style={{ background: '#4f46e5' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help modal */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Help & Documentation</span>
              <button className="modal-close-btn" onClick={() => setIsHelpOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-sidebar">
                <button className="modal-tab-btn active">OSINT Cheatsheet</button>
              </div>
              <div className="modal-content-area">
                <div className="settings-section-title">Keyboard Shortcuts</div>
                <div className="help-keybind-list">
                  <div className="help-keybind-row">
                    <span>Command Center Console</span>
                    <kbd>Ctrl + K</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Open Preferences Settings</span>
                    <kbd>Ctrl + ,</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Toggle Help & Manual</span>
                    <kbd>?</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Switch Layout: Stream Feed</span>
                    <kbd>L</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Switch Layout: 3D Cards</span>
                    <kbd>C</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Close Active Overlay/Modal</span>
                    <kbd>Esc</kbd>
                  </div>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>OSINT Terminology Manual</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Editorial Stance Analytics:</strong> Maps left/right political framing of active media coverage.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Source Diversity Index:</strong> Tracks ownership patterns (Independent, Corporate, or State-controlled).
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Factuality Integrity:</strong> Semi-automated verification metrics scoring source reliability.
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="action-btn primary" 
                    onClick={() => {
                      setTutorialStep(1);
                      setIsHelpOpen(false);
                    }}
                  >
                    Relaunch Guided Tutorial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Command Palette Overlay Modal */}
      {isCmdOpen && (
        <div className="cmd-palette-overlay" onClick={() => setIsCmdOpen(false)}>
          <div className="cmd-palette-container" onClick={e => e.stopPropagation()}>
            <div className="cmd-palette-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="cmd-palette-search" 
                placeholder="Type command name or news keywords..." 
                value={cmdSearch}
                onChange={e => {
                  setCmdSearch(e.target.value);
                  setCmdSelectedIndex(0);
                }}
                onKeyDown={handleCommandKeyDown}
                autoFocus
              />
              <span className="cmd-palette-shortcut" style={{ fontSize: '0.6rem' }}>ESC</span>
            </div>
            
            <div className="cmd-palette-list custom-scroll">
              {filteredCommands.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No matching actions or queries found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className={`cmd-palette-item ${cmdSelectedIndex === idx ? 'active' : ''}`}
                    onClick={() => handleCommandSelect(idx)}
                    onMouseEnter={() => setCmdSelectedIndex(idx)}
                  >
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="cmd-palette-shortcut">{cmd.shortcut}</kbd>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="cmd-palette-footer">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>NewsRadar OSS Command Console</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
