"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";

type Concept = "command" | "workspace" | "focus" | "atlas" | "pulse" | "flow" | "horizon";
type Role = "Employee" | "Manager" | "Admin";
type Page = "Home" | "All Apps" | "Request Access" | "My Requests" | "Team Members" | "Team Access";
type TeamFilter = "All" | "Employee" | "Manager" | "Active";

const concepts: Record<Concept, { name: string; short: string; recommended?: boolean; best: string; navigation: string; advantage: string; tradeoff: string; questions: string[] }> = {
  command: { name: "Command Center", short: "Balanced control", recommended: true, best: "A practical evolution of the current portal", navigation: "Persistent sidebar", advantage: "Familiar structure with stronger hierarchy", tradeoff: "Still relies on a traditional application grid", questions: ["Does the hierarchy feel immediately clear?", "Can each role reach its main action quickly?", "Does this feel achievable without a full rebuild?"] },
  workspace: { name: "Clean Workspace", short: "Light and editorial", best: "Teams that prefer a calm, minimal interface", navigation: "Light sidebar and workspace panels", advantage: "Reduced visual weight and generous spacing", tradeoff: "Requires more structural change", questions: ["Does the lighter layout feel professional?", "Are quick actions prominent enough?", "Is the page too spacious for daily work?"] },
  focus: { name: "H!KINEX Focus", short: "Task-first", best: "Fast onboarding and everyday employee use", navigation: "Compact rail; mobile bottom bar", advantage: "Search and frequent tasks appear first", tradeoff: "Less room for department storytelling", questions: ["Can you find a tool in under ten seconds?", "Are the next actions obvious?", "Does the compact navigation remain understandable?"] },
  atlas: { name: "H!KINEX Atlas", short: "Department hub", best: "Organizations with many teams and applications", navigation: "Navy top navigation", advantage: "Departments become clear, scalable workspaces", tradeoff: "Adds one level before individual applications", questions: ["Do the department boundaries make sense?", "Can you predict what is inside each workspace?", "Would this scale as more teams are added?"] },
  pulse: { name: "H!KINEX Pulse", short: "Role operations", best: "Managers, administrators and a growing portal", navigation: "Compact dark sidebar", advantage: "Role health, actions and exceptions are visible", tradeoff: "More operational information on Home", questions: ["Are the status signals useful or distracting?", "Does each role see the right priorities?", "Are management actions safe and understandable?"] },
  flow: { name: "H!KINEX Flow", short: "Guided workday", best: "Employees who prefer a clear sequence of tasks", navigation: "Slim icon rail and guided action path", advantage: "Turns the portal into an easy daily checklist", tradeoff: "Shows fewer applications at the same time", questions: ["Does the guided sequence reduce uncertainty?", "Are today’s actions easy to scan?", "Would this help new employees learn the portal?"] },
  horizon: { name: "H!KINEX Horizon", short: "Personal homebase", best: "A friendly, flexible employee experience", navigation: "Branded header with modular work zones", advantage: "Balances people, tools and company resources", tradeoff: "The modular home requires content ownership", questions: ["Does this feel welcoming without becoming informal?", "Are the work zones easy to customize?", "Which modules should every role see first?"] },
};

const apps = [
  { name: "Mission Control", group: "H!KINEX", detail: "Work dashboard", mark: "M", recent: true },
  { name: "Timekeeper", group: "H!KINEX", detail: "Time tracking", mark: "T", recent: true },
  { name: "Vaultwarden", group: "IT", detail: "Password vault", mark: "V", recent: true },
  { name: "InvSync", group: "H!KINEX", detail: "Inventory sync", mark: "I", recent: false },
  { name: "REET", group: "H!KINEX", detail: "Internal tool", mark: "R", recent: false },
  { name: "HIKI IT Portal", group: "IT", detail: "IT support", mark: "H", recent: false },
  { name: "HR Desk", group: "H!KINEX", detail: "HR support", mark: "H", recent: false },
  { name: "Zoom", group: "H!KINEX", detail: "Meetings", mark: "Z", recent: true },
  { name: "LMS", group: "H!KINEX", detail: "Learning", mark: "L", recent: false },
  { name: "Semrush", group: "Marketing", detail: "SEO platform", mark: "S", recent: false },
  { name: "Canva", group: "Marketing", detail: "Design workspace", mark: "C", recent: false },
  { name: "HubSpot", group: "Marketing", detail: "CRM and marketing", mark: "H", recent: false },
  { name: "Screaming Frog", group: "Marketing", detail: "Website crawler · link disabled", mark: "F", recent: false, disabled: true },
  { name: "Talent Director", group: "Recruiting", detail: "Recruiting platform", mark: "TD", recent: false },
  { name: "Bullhorn", group: "Recruiting", detail: "Applicant tracking", mark: "B", recent: false },
  { name: "ZoomInfo", group: "Sales", detail: "Sales intelligence", mark: "Z", recent: false },
  { name: "Salesforce", group: "Sales", detail: "Customer relationship management", mark: "S", recent: false },
  { name: "Relativity", group: "E-Discovery", detail: "Legal review workspace", mark: "R", recent: false },
  { name: "Everlaw", group: "E-Discovery", detail: "E-discovery review platform", mark: "E", recent: false },
];

const owned = new Set(["Mission Control", "Timekeeper", "Vaultwarden", "InvSync", "REET", "HIKI IT Portal", "HR Desk", "Zoom", "LMS", "Semrush", "Canva", "HubSpot"]);

const people = [
  { name: "Ava Mitchell", email: "ava.mitchell@hikinex.com", role: "Employee", dept: "Marketing", apps: 8, status: "Active" },
  { name: "Daniel Kim", email: "daniel.kim@hikinex.com", role: "Manager", dept: "E-Discovery", apps: 11, status: "Active" },
  { name: "Maya Patel", email: "maya.patel@hikinex.com", role: "Employee", dept: "Marketing", apps: 6, status: "Active" },
  { name: "Noah Williams", email: "noah.williams@hikinex.com", role: "Employee", dept: "Sales", apps: 5, status: "Inactive" },
  { name: "Sophia Lee", email: "sophia.lee@hikinex.com", role: "Manager", dept: "Recruiting", apps: 9, status: "Active" },
];

const navByRole: Record<Role, Page[]> = {
  Employee: ["Home", "All Apps", "Request Access", "My Requests"],
  Manager: ["Home", "All Apps", "Team Members", "Request Access"],
  Admin: ["Home", "All Apps", "Team Access", "Request Access"],
};

const roleIdentity: Record<Role, { user: string; subtitle: string; initials: string }> = {
  Employee: { user: "testemployee", subtitle: "Marketing", initials: "TE" },
  Manager: { user: "testmanager", subtitle: "Marketing team", initials: "TM" },
  Admin: { user: "testadmin", subtitle: "Portal administration", initials: "TA" },
};

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? "compact" : ""}`}><strong><i>H!</i>KINEX</strong><small>SOFTWARE HUB</small></div>;
}

function AppCard({ app, compact = false, onTry }: { app: (typeof apps)[number]; compact?: boolean; onTry: (message: string) => void }) {
  return <button className={`app-card ${compact ? "compact" : ""} ${app.disabled ? "disabled-app" : ""}`} onClick={() => onTry(app.disabled ? "Screaming Frog is intentionally disabled until its approved destination is confirmed." : `${app.name} is an illustrative prototype card—no external application was opened.`)} aria-label={`Preview ${app.name}`}><span className="app-mark">{app.mark}</span><span className="app-copy"><strong>{app.name}</strong><small>{app.detail}</small></span><span className="arrow" aria-hidden="true">↗</span></button>;
}

function RoleSummary({ role }: { role: Role }) {
  if (role === "Employee") return <div className="role-summary"><span>YOUR MANAGER</span><strong>testmanager</strong><small>Marketing team</small></div>;
  if (role === "Manager") return <div className="role-summary"><span>TEAM SNAPSHOT</span><strong>8 members</strong><small>1 access review needs attention</small></div>;
  return <div className="role-summary"><span>PORTAL HEALTH</span><strong>94% reviewed</strong><small>3 access exceptions</small></div>;
}

function StandardHome({ concept, role, query, onTry }: { concept: Concept; role: Role; query: string; onTry: (message: string) => void }) {
  const filtered = apps.filter((app) => app.name.toLowerCase().includes(query.toLowerCase()));
  const everyday = filtered.filter((app) => app.group === "H!KINEX").slice(0, 8);
  const marketing = filtered.filter((app) => app.group === "Marketing");
  const identity = roleIdentity[role];
  const isWorkspace = concept === "workspace";
  if (isWorkspace) return <div className="workspace-home"><section className="workspace-welcome"><p className="eyebrow">YOUR {role.toUpperCase()} WORKSPACE</p><h1>Welcome back, <span>{identity.user}</span></h1><p>{identity.subtitle} · Everything important, without the noise.</p></section><div className="workspace-columns"><section className="panel"><div className="section-head"><div><p className="eyebrow">QUICK ACCESS</p><h2>{role === "Employee" ? "Frequently used" : role === "Manager" ? "Team essentials" : "Admin essentials"}</h2></div><button className="text-button">Edit</button></div><div className="app-grid two">{everyday.slice(0, 4).map((app) => <AppCard key={app.name} app={app} compact onTry={onTry} />)}</div></section><section className="panel quick-actions"><p className="eyebrow">START HERE</p><h2>Quick actions</h2><button>{role === "Employee" ? "Request app access" : role === "Manager" ? "Review team access" : "Open Team Access"}<span>→</span></button><button>{role === "Employee" ? "View my requests" : "View exceptions"}<span>→</span></button><button>Contact IT support <span>→</span></button></section></div><section className="panel departments-list"><div className="section-head"><div><p className="eyebrow">DIRECTORY</p><h2>{role === "Employee" ? "Your departments" : "Managed workspaces"}</h2></div><span className="count">3 groups</span></div><button><strong>Marketing</strong><span>Design, SEO, outreach and web tools</span><b>{marketing.length} apps</b></button><button><strong>E-Discovery</strong><span>Internal systems and support tools</span><b>2 apps</b></button><button><strong>Everyday</strong><span>Company-wide tools</span><b>{everyday.length} apps</b></button></section></div>;
  return <div><section className="welcome-card"><div><p className="eyebrow">{role.toUpperCase()} HOME</p><h1>Good afternoon, <span>{identity.user}</span></h1><p>{identity.subtitle} · Thursday, August 27</p></div><RoleSummary role={role} /></section>{role !== "Employee" && <OperationalStrip role={role} />}<section className="content-section"><div className="section-head"><div><p className="eyebrow">ESSENTIALS</p><h2>{role === "Employee" ? "Everyday tools" : "Role essentials"}</h2></div><span className="count">{everyday.length} tools</span></div><div className="app-grid">{everyday.map((app) => <AppCard key={app.name} app={app} onTry={onTry} />)}</div></section><section className="content-section"><div className="section-head"><div><p className="eyebrow">YOUR ACCESS</p><h2>Departments</h2></div><div className="tabs"><button className="active">Marketing · {marketing.length}</button><button>E-Discovery · 2</button></div></div><div className="department-panel"><div><h3>Marketing</h3><p>Primary department</p></div><div className="app-grid three">{marketing.map((app) => <AppCard key={app.name} app={app} compact onTry={onTry} />)}</div></div></section></div>;
}

function OperationalStrip({ role }: { role: Role }) {
  const manager = [{ value: "8", label: "Team members" }, { value: "2", label: "Pending requests" }, { value: "1", label: "Access exception" }];
  const admin = [{ value: "124", label: "Active employees" }, { value: "17", label: "Managed apps" }, { value: "3", label: "Review exceptions" }];
  return <section className="metric-strip">{(role === "Admin" ? admin : manager).map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</section>;
}

function FocusHome({ role, query, onTry }: { role: Role; query: string; onTry: (message: string) => void }) {
  const identity = roleIdentity[role];
  const [focusQuery, setFocusQuery] = useState(query);
  const frequent = apps.filter((a) => a.recent && a.name.toLowerCase().includes(focusQuery.toLowerCase())).slice(0, 4);
  return <div className="focus-home"><section className="focus-hero"><p className="eyebrow">HELLO, {identity.user.toUpperCase()}</p><h1>What do you need today?</h1><p>Find a tool, complete a task or check your access in one place.</p><label className="focus-search"><span>⌕</span><input value={focusQuery} onChange={(event) => setFocusQuery(event.target.value)} placeholder="Search tools and actions" aria-label="Search tools and actions" /></label></section>{role !== "Employee" && <OperationalStrip role={role} />}<section className="focus-layout"><div><div className="section-head"><div><p className="eyebrow">PINNED FOR YOU</p><h2>{role === "Employee" ? "Frequently used" : "Your role essentials"}</h2></div><span className="count">4 shortcuts</span></div><div className="app-grid focus-grid">{frequent.map((app) => <AppCard key={app.name} app={app} onTry={onTry} />)}</div><div className="recent-row"><div><span className="mini-mark">T</span><p><strong>Timekeeper</strong><small>Opened 18 minutes ago</small></p></div><button onClick={() => onTry("Recent activity is illustrative only.")}>Open again →</button></div></div><aside className="focus-actions"><p className="eyebrow">QUICK ACTIONS</p><h2>Start here</h2><button><span>＋</span><p><strong>Request access</strong><small>Find an application</small></p><b>→</b></button><button><span>✓</span><p><strong>{role === "Employee" ? "My requests" : "Review requests"}</strong><small>{role === "Employee" ? "No pending items" : "2 need attention"}</small></p><b>→</b></button><button><span>?</span><p><strong>Get help</strong><small>Contact HIKI IT</small></p><b>→</b></button></aside></section></div>;
}

function AtlasHome({ role, query, onTry }: { role: Role; query: string; onTry: (message: string) => void }) {
  const identity = roleIdentity[role];
  const groups = [
    { name: "Everyday tools", detail: "Company-wide essentials for time, access, meetings and support", count: 9, tone: "aqua", picks: apps.filter((a) => a.group === "H!KINEX").slice(0, 3) },
    { name: "Marketing", detail: "SEO, design, outreach and customer relationship tools", count: 4, tone: "navy", picks: apps.filter((a) => a.group === "Marketing").slice(0, 3) },
    { name: "E-Discovery", detail: "Remote access, productivity and internal operating systems", count: 2, tone: "paper", picks: apps.filter((a) => a.group === "E-Discovery") },
  ];
  return <div className="atlas-home"><section className="atlas-intro"><p className="eyebrow">H!KINEX ATLAS · {role.toUpperCase()}</p><h1>Your work, mapped clearly.</h1><p>Welcome, {identity.user}. Browse by workspace or search across the full Software Hub.</p><div className="atlas-search"><span>⌕</span><span>{query || "Search every H!KINEX workspace"}</span><kbd>⌘ K</kbd></div></section>{role !== "Employee" && <OperationalStrip role={role} />}<section className="atlas-grid">{groups.map((group, index) => <article className={`atlas-card ${group.tone}`} key={group.name}><div className="atlas-number">0{index + 1}</div><div><p className="eyebrow">{group.count} APPLICATIONS</p><h2>{group.name}</h2><p>{group.detail}</p></div><div className="atlas-apps">{group.picks.map((app) => <button key={app.name} onClick={() => onTry(`${app.name} is illustrative—no external application was opened.`)}><span className="app-mark">{app.mark}</span><strong>{app.name}</strong></button>)}</div><button className="atlas-open">Explore workspace <span>→</span></button></article>)}</section></div>;
}

function PulseHome({ role, onTry }: { role: Role; onTry: (message: string) => void }) {
  const identity = roleIdentity[role];
  const employee = [{ value: "9", label: "Everyday tools", note: "All available" }, { value: "0", label: "Pending requests", note: "No action needed" }, { value: "4", label: "Recently used", note: "This week" }];
  const manager = [{ value: "8", label: "Team members", note: "All active" }, { value: "2", label: "Pending approvals", note: "Review today" }, { value: "1", label: "Access exception", note: "Needs attention" }];
  const admin = [{ value: "124", label: "Active employees", note: "+4 this month" }, { value: "17", label: "Managed apps", note: "1 link to confirm" }, { value: "94%", label: "Access reviewed", note: "3 exceptions" }];
  const metrics = role === "Employee" ? employee : role === "Manager" ? manager : admin;
  return <div className="pulse-home"><section className="pulse-heading"><div><p className="eyebrow">{role.toUpperCase()} OVERVIEW</p><h1>Good afternoon, {identity.user}</h1><p>{identity.subtitle} · Live-style signals using safe sample data</p></div><div className="pulse-health"><span className="live-dot" />Prototype status: healthy</div></section><section className="pulse-metrics">{metrics.map((metric, i) => <article key={metric.label} className={i === 2 ? "attention" : ""}><span>{i === 0 ? "↗" : i === 1 ? "◎" : "!"}</span><strong>{metric.value}</strong><p>{metric.label}</p><small>{metric.note}</small></article>)}</section><section className="pulse-layout"><div className="panel"><div className="section-head"><div><p className="eyebrow">PRIORITY QUEUE</p><h2>{role === "Employee" ? "Your next actions" : "Items needing review"}</h2></div><span className="count">Today</span></div><div className="queue"><button onClick={() => onTry("This safe prototype does not submit or approve access changes.")}><span className="priority high">HIGH</span><p><strong>{role === "Admin" ? "Confirm Screaming Frog destination" : role === "Manager" ? "Review two access requests" : "Explore available applications"}</strong><small>{role === "Admin" ? "Incorrect destination remains disabled" : "Safe prototype action"}</small></p><b>→</b></button><button onClick={() => onTry("Access review is illustrative only.")}><span className="priority normal">NORMAL</span><p><strong>{role === "Employee" ? "Review your current access" : "Complete monthly access review"}</strong><small>No changes will be saved</small></p><b>→</b></button></div></div><div className="panel pulse-activity"><p className="eyebrow">RECENT ACTIVITY</p><h2>Portal updates</h2><div><span className="live-dot" /><p><strong>Marketing access reviewed</strong><small>18 minutes ago</small></p></div><div><span className="live-dot muted" /><p><strong>New application added</strong><small>Yesterday</small></p></div><button>View activity history →</button></div></section></div>;
}

function FlowHome({ role, onTry }: { role: Role; onTry: (message: string) => void }) {
  const identity = roleIdentity[role];
  const steps = role === "Employee"
    ? [{ n: "01", title: "Start your day", text: "Open Timekeeper and Mission Control", action: "Open daily tools" }, { n: "02", title: "Continue your work", text: "Return to the tools you used recently", action: "View recent tools" }, { n: "03", title: "Get what you need", text: "Explore or request an additional application", action: "Browse applications" }]
    : role === "Manager"
      ? [{ n: "01", title: "Check your team", text: "Eight active members and one exception", action: "View team" }, { n: "02", title: "Review requests", text: "Two sample access requests need attention", action: "Review queue" }, { n: "03", title: "Complete the review", text: "Confirm this month’s access summary", action: "View summary" }]
      : [{ n: "01", title: "Check portal health", text: "Three sample exceptions are highlighted", action: "View exceptions" }, { n: "02", title: "Review employee access", text: "Filter by role, department or status", action: "Open Team Access" }, { n: "03", title: "Confirm app destinations", text: "Screaming Frog remains safely disabled", action: "Review directory" }];
  return <div className="flow-home"><section className="flow-intro"><div><p className="eyebrow">H!KINEX FLOW · {role.toUpperCase()}</p><h1>A clearer path through your workday.</h1><p>Welcome, {identity.user}. Follow the suggested path or jump directly to a familiar tool.</p></div><div className="flow-progress"><span>Today</span><strong>{role === "Employee" ? "1 of 3" : "2 of 3"}</strong><small>suggested steps reviewed</small></div></section><section className="flow-path">{steps.map((step, index) => <article key={step.n} className={index === 0 ? "current" : ""}><span>{step.n}</span><div><p className="eyebrow">{index === 0 ? "START HERE" : index === 1 ? "UP NEXT" : "WHEN NEEDED"}</p><h2>{step.title}</h2><p>{step.text}</p><button onClick={() => onTry(`${step.action} is illustrative in this safe prototype.`)}>{step.action} <b>→</b></button></div></article>)}</section><section className="flow-tools"><div><p className="eyebrow">QUICK LAUNCH</p><h2>Keep moving</h2></div><div>{apps.filter((app) => app.recent).map((app) => <AppCard key={app.name} app={app} compact onTry={onTry} />)}</div></section></div>;
}

function HorizonHome({ role, onTry }: { role: Role; onTry: (message: string) => void }) {
  const identity = roleIdentity[role];
  const featured = role === "Employee" ? apps.filter((app) => app.recent) : role === "Manager" ? apps.slice(0, 4) : apps.slice(3, 7);
  return <div className="horizon-home"><section className="horizon-hero"><div><p className="eyebrow">YOUR H!KINEX HOMEBASE</p><h1>Everything you need,<br /><span>in your orbit.</span></h1><p>Good afternoon, {identity.user}. Your tools, people and support are arranged around what matters to your role.</p><button onClick={() => onTry("The guided tour is illustrative only.")}>Take a quick tour <span>→</span></button></div><div className="horizon-orbit" aria-hidden="true"><span className="orbit-core">H!</span><i className="orbit-one">T</i><i className="orbit-two">Z</i><i className="orbit-three">V</i></div></section><section className="horizon-grid"><article className="horizon-module tools"><div className="section-head"><div><p className="eyebrow">YOUR SHORTCUTS</p><h2>{role === "Employee" ? "Pick up where you left off" : "Role essentials"}</h2></div><span className="count">4 tools</span></div><div className="app-grid two">{featured.map((app) => <AppCard key={app.name} app={app} compact onTry={onTry} />)}</div></article><article className="horizon-module people"><p className="eyebrow">PEOPLE</p><h2>{role === "Employee" ? "Your team is nearby" : role === "Manager" ? "Your team at a glance" : "Employee directory"}</h2><div className="horizon-avatars"><span>AM</span><span>DK</span><span>MP</span><b>+5</b></div><p>{role === "Employee" ? "Marketing team · 8 members" : "Sample directory · no messages are sent"}</p><button onClick={() => onTry("People actions are illustrative only.")}>View people →</button></article><article className="horizon-module support"><p className="eyebrow">SUPPORT</p><h2>Need a hand?</h2><p>Reach HIKI IT, HR Desk or the learning center from one calm place.</p><div><button onClick={() => onTry("HIKI IT is illustrative—no ticket was created.")}>HIKI IT</button><button onClick={() => onTry("HR Desk is illustrative—no message was sent.")}>HR Desk</button><button onClick={() => onTry("LMS is illustrative—no external app was opened.")}>LMS</button></div></article></section></div>;
}

function HomeView({ concept, role, query, onTry }: { concept: Concept; role: Role; query: string; onTry: (message: string) => void }) {
  if (concept === "focus") return <FocusHome role={role} query={query} onTry={onTry} />;
  if (concept === "atlas") return <AtlasHome role={role} query={query} onTry={onTry} />;
  if (concept === "pulse") return <PulseHome role={role} onTry={onTry} />;
  if (concept === "flow") return <FlowHome role={role} onTry={onTry} />;
  if (concept === "horizon") return <HorizonHome role={role} onTry={onTry} />;
  return <StandardHome concept={concept} role={role} query={query} onTry={onTry} />;
}

function AllApps({ query, onTry }: { query: string; onTry: (message: string) => void }) {
  const filtered = apps.filter((app) => `${app.name} ${app.group}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="panel page-panel"><p className="eyebrow">APPLICATION DIRECTORY</p><h1>All applications</h1><p className="lede">Browse approved tools by department. Search results update as you type; external destinations remain disabled in this prototype.</p><div className="result-line"><strong>{filtered.length}</strong> applications found</div><div className="app-grid three">{filtered.map((app) => <AppCard key={app.name} app={app} onTry={onTry} />)}</div></section>;
}

function RequestView({ role }: { role: Role }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <section className="panel page-panel"><p className="eyebrow">ACCESS</p><h1>Request an application</h1><p className="lede">Tools you already have are clearly labeled, preventing duplicate requests. The prototype never submits a request.</p><div className="request-list">{apps.filter((a) => a.group !== "H!KINEX").map((app) => { const has = owned.has(app.name); const roleRestricted = app.name === "Talent Director" && role !== "Admin"; return <button key={app.name} disabled={has || app.disabled || roleRestricted} className={selected === app.name ? "selected" : ""} onClick={() => setSelected(app.name)}><span className="app-mark">{app.mark}</span><span><strong>{app.name}</strong><small>{app.group} · {app.detail}</small></span><b>{app.disabled ? "Destination disabled" : roleRestricted ? "Admin managed" : has ? "Already available" : selected === app.name ? "Selected" : "Select"}</b></button>; })}</div>{selected && <div className="safe-action"><span><strong>{selected}</strong> selected for demonstration. Nothing will be submitted.</span><button onClick={() => setSelected(null)}>Clear selection</button></div>}</section>;
}

function RequestsView() { return <section className="panel page-panel"><p className="eyebrow">ACCESS HISTORY</p><h1>My requests</h1><div className="empty-state"><span>✓</span><h2>You’re all caught up</h2><p>No access requests are currently pending.</p><button>Browse available applications</button></div></section>; }

function TeamMembers() { return <section className="panel page-panel"><p className="eyebrow">MANAGER VIEW</p><h1>Team members</h1><p className="lede">A useful empty state remains intentional even before the reporting structure is connected.</p><div className="empty-state compact-empty"><span>◎</span><h2>No additional team assigned</h2><p>Team members will appear here after the reporting structure is connected.</p><button>Review access guidance</button></div></section>; }

function TeamAccess({ query }: { query: string }) {
  const [expanded, setExpanded] = useState<string | null>(people[0].email);
  const [filter, setFilter] = useState<TeamFilter>("All");
  const visible = people.filter((p) => `${p.name} ${p.email} ${p.dept}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || filter === "Active" ? filter === "All" || p.status === "Active" : p.role === filter));
  return <section className="panel page-panel"><p className="eyebrow">ADMIN CONTROL</p><h1>Team Access</h1><p className="lede">Scan people quickly, filter the directory and reveal detailed controls only when needed.</p><div className="filter-row">{(["All", "Employee", "Manager", "Active"] as TeamFilter[]).map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? "All roles" : item === "Active" ? "Active only" : `${item}s`}</button>)}<span>{visible.length} people</span></div><div className="people-list">{visible.map((person) => <div className="person" key={person.email}><button className="person-summary" onClick={() => setExpanded(expanded === person.email ? null : person.email)} aria-expanded={expanded === person.email}><span className="avatar">{person.name.split(" ").map((n) => n[0]).join("")}</span><span><strong>{person.name}</strong><small>{person.email}</small></span><span className="meta"><b>{person.dept}</b><small>{person.role}</small></span><span className={`status ${person.status.toLowerCase()}`}>{person.status}</span><span className="chevron">{expanded === person.email ? "−" : "+"}</span></button>{expanded === person.email && <div className="person-detail"><div><small>APPLICATION ACCESS</small><strong>{person.apps} assigned tools</strong></div><div><small>LAST REVIEW</small><strong>August 12, 2026</strong></div><button className="secondary">Review access</button><button className="danger" onClick={() => alert("Prototype only: deactivation is disabled and no status changed.")}>Deactivate…</button></div>}</div>)}</div>{visible.length === 0 && <div className="inline-empty">No people match this search and filter.</div>}</section>;
}

function ConceptGuide({ concept, onClose }: { concept: Concept; onClose: () => void }) {
  const info = concepts[concept];
  return <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close concept guide" onClick={onClose} /><aside className="drawer guide-drawer" role="dialog" aria-modal="true" aria-labelledby="guide-title"><div className="drawer-head"><div><p className="eyebrow">CONCEPT GUIDE</p><h2 id="guide-title">{info.name}</h2></div><button onClick={onClose} aria-label="Close concept guide">×</button></div><p className="guide-intro">{info.short}. Use this panel to structure the feedback conversation.</p><dl><div><dt>Best for</dt><dd>{info.best}</dd></div><div><dt>Navigation</dt><dd>{info.navigation}</dd></div><div><dt>Main advantage</dt><dd>{info.advantage}</dd></div><div><dt>Primary tradeoff</dt><dd>{info.tradeoff}</dd></div></dl><h3>Questions for reviewers</h3><ol>{info.questions.map((question) => <li key={question}>{question}</li>)}</ol><div className="guide-tip"><strong>Suggested feedback format</strong><span>What feels clear → what feels difficult → what you would change.</span></div></aside></div>;
}

export default function Home() {
  const [concept, setConcept] = useState<Concept>("command");
  const [role, setRole] = useState<Role>("Employee");
  const [page, setPage] = useState<Page>("Home");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [guide, setGuide] = useState(false);
  const [toast, setToast] = useState("");
  const nav = navByRole[role];
  const currentPage = useMemo(() => nav.includes(page) ? page : "Home", [nav, page]);
  const identity = roleIdentity[role];
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const routePageAction = (event: MouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest("button");
    if (!button || button.disabled) return;
    const label = button.textContent?.replace(/\s+/g, " ").trim().toLowerCase() || "";
    if (/view directory|browse applications|browse available|explore workspace|review directory/.test(label)) setPage("All Apps");
    else if (/request app access|request access/.test(label)) setPage("Request Access");
    else if (/view my requests/.test(label)) setPage("My Requests");
    else if (/open team access|view exceptions|view summary/.test(label) && role === "Admin") setPage("Team Access");
    else if (/review team access|view team|view people/.test(label) && role === "Manager") setPage("Team Members");
  };
  const chooseRole = (next: Role) => { setRole(next); setPage("Home"); setMenuOpen(false); setQuery(""); };
  const chooseConcept = (next: Concept) => { setConcept(next); setPage("Home"); setQuery(""); setDark(next === "pulse" || next === "command" || next === "flow"); window.history.replaceState({}, "", `?concept=${next}`); };
  useEffect(() => { const requested = new URLSearchParams(window.location.search).get("concept") as Concept | null; if (requested && requested in concepts) { setConcept(requested); setDark(requested === "pulse" || requested === "command" || requested === "flow"); } }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setNotifications(false); setGuide(false); setMenuOpen(false); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return <main className={`prototype concept-${concept} ${dark ? "dark" : "light"}`}>
    <header className="review-bar"><div className="review-identity"><span className="review-mark">H!K</span><div><strong>Portal concept review</strong><small>Seven interactive directions · Safe sample data</small></div></div><div className="concept-switch" aria-label="Choose layout concept">{(Object.keys(concepts) as Concept[]).map((key, index) => <button key={key} className={concept === key ? "active" : ""} onClick={() => chooseConcept(key)}><span>0{index + 1}</span>{concepts[key].name}{concepts[key].recommended && <em>Recommended</em>}</button>)}</div><div className="review-actions"><button className="guide-button" onClick={() => setGuide(true)}>Concept guide</button><select aria-label="Preview role" value={role} onChange={(e) => chooseRole(e.target.value as Role)}><option>Employee</option><option>Manager</option><option>Admin</option></select><button className="theme" onClick={() => setDark(!dark)} aria-label="Toggle light and dark theme">{dark ? "☀" : "☾"}</button></div></header>
    <div className="mobile-product-bar"><button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">☰</button><Brand compact /><button onClick={() => setNotifications(true)} aria-label="Open notifications">●</button></div>
    {concept === "atlas" && <div className="atlas-nav"><Brand /><nav>{nav.map((item) => <button key={item} className={currentPage === item ? "active" : ""} onClick={() => setPage(item)}>{item}</button>)}</nav><button onClick={() => setGuide(true)}>About this concept</button></div>}
    <div className="portal-shell"><aside className={menuOpen ? "open" : ""}><Brand /><nav>{nav.map((item) => <button key={item} className={currentPage === item ? "active" : ""} onClick={() => { setPage(item); setMenuOpen(false); }}><span>{item === "Home" ? "⌂" : item === "All Apps" ? "◫" : item.includes("Request") ? "+" : item.includes("Team") ? "◎" : "•"}</span><b>{item}</b></button>)}</nav><div className="aside-bottom"><button onClick={() => setNotifications(true)}>Notifications <span className="badge">2</span></button><div><span className="avatar small">{identity.initials}</span><span><strong>{identity.user}</strong><small>{role.toUpperCase()}</small></span></div></div></aside>{menuOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}<section className="portal-main"><div className="topbar"><label><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={currentPage === "Team Access" ? "Search people" : "Search applications"} aria-label="Search" />{query && <button onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label><button className="notification" onClick={() => setNotifications(true)} aria-label="Open notifications">●<span>2</span></button><div className="role-label"><small>PREVIEWING AS</small><strong>{role}</strong></div></div><div className="page-content" onClickCapture={routePageAction}>{currentPage === "Home" && <HomeView concept={concept} role={role} query={query} onTry={showToast} />}{currentPage === "All Apps" && <AllApps query={query} onTry={showToast} />}{currentPage === "Request Access" && <RequestView role={role} />}{currentPage === "My Requests" && <RequestsView />}{currentPage === "Team Members" && <TeamMembers />}{currentPage === "Team Access" && <TeamAccess query={query} />}</div></section></div>
    {concept === "focus" && <nav className="focus-bottom-nav">{nav.slice(0, 4).map((item) => <button key={item} className={currentPage === item ? "active" : ""} onClick={() => setPage(item)}><span>{item === "Home" ? "⌂" : item === "All Apps" ? "◫" : item.includes("Request") ? "+" : "•"}</span><small>{item.replace(" Access", "")}</small></button>)}</nav>}
    {notifications && <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close notifications" onClick={() => setNotifications(false)} /><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="notifications-title"><div className="drawer-head"><div><p className="eyebrow">UPDATES</p><h2 id="notifications-title">Notifications</h2></div><button onClick={() => setNotifications(false)} aria-label="Close notifications">×</button></div><article><span>✓</span><div><strong>Access review complete</strong><p>Your Marketing tools were reviewed today.</p><small>18 minutes ago</small></div></article><article><span>→</span><div><strong>Seven concepts are ready</strong><p>Use the comparison switcher to explore each direction.</p><small>Today</small></div></article><button className="mark-read" onClick={() => showToast("Notifications marked as read for this preview only.")}>Mark all as read</button></aside></div>}
    {guide && <ConceptGuide concept={concept} onClose={() => setGuide(false)} />}
    {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")} aria-label="Dismiss message">×</button></div>}
    <footer className="prototype-note"><strong>H!KINEX design prototype</strong><span>Illustrative only. No real requests, access changes, credentials or external destinations are active.</span></footer>
  </main>;
}
