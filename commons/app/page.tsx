"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "Employee" | "Manager" | "Admin";
type View = "Home" | "Apps" | "Announcements" | "Feed" | "Groups" | "People" | "Jobs" | "Team" | "Requests" | "Admin";

const apps = [
  ["Mission Control", "Work overview", "M", "H!KINEX"], ["TimeKeeper", "Time tracking", "T", "H!KINEX"], ["LMS", "Learning center", "L", "H!KINEX"],
  ["Talent Director", "Recruiting platform", "TD", "Recruiting"], ["Vaultwarden", "Password manager", "V", "IT"], ["HIKI IT Portal", "Support requests", "IT", "IT"],
  ["HubSpot", "Sales and marketing", "H", "Sales"], ["Canva", "Design workspace", "C", "Marketing"], ["Semrush", "SEO intelligence", "S", "Marketing"],
  ["Relativity", "E-discovery workspace", "R", "E-Discovery"], ["Everlaw", "Legal review platform", "E", "E-Discovery"],
];

const people = [
  ["Ava Mitchell", "Marketing Specialist", "AM", "Marketing"], ["Daniel Kim", "E-Discovery Manager", "DK", "E-Discovery"],
  ["Maya Patel", "Talent Partner", "MP", "Recruiting"], ["Noah Williams", "Sales Associate", "NW", "Sales"],
];

const roleCopy: Record<Role, { user: string; title: string; team: string }> = {
  Employee: { user: "Mariana", title: "Marketing Specialist", team: "Marketing" },
  Manager: { user: "Alex", title: "Marketing Manager", team: "Marketing" },
  Admin: { user: "Jordan", title: "Portal Administrator", team: "All departments" },
};

function Brand() { return <div className="brand"><span>H!</span>KINEX<small>EMPLOYEE HUB</small></div>; }

function AppTile({ app, role, notify }: { app: string[]; role: Role; notify: (message: string) => void }) {
  const restricted = app[0] === "Talent Director" && role === "Employee";
  return <button className={`app-tile ${restricted ? "restricted" : ""}`} onClick={() => notify(restricted ? "Talent Director is restricted to Manager and Admin profiles." : `${app[0]} is an illustrative link. No external application opened.`)}>
    <span className="app-icon">{app[2]}</span><span><strong>{app[0]}</strong><small>{restricted ? "Manager/Admin only" : app[1]}</small></span><b>{restricted ? "Locked" : "Open →"}</b>
  </button>;
}

function HomeView({ role, notify, navigate }: { role: Role; notify: (message: string) => void; navigate: (view: View) => void }) {
  const profile = roleCopy[role];
  const visibleApps = apps.filter((app) => !(app[0] === "Talent Director" && role === "Employee")).slice(0, 6);
  return <>
    <section className="welcome"><div><p className="kicker">H!KINEX COMMONS · {role.toUpperCase()}</p><h1>Welcome, {profile.user}.<br /><em>Your people and work, together.</em></h1><p>{profile.title} · {profile.team} · 4 new community updates</p></div><div className="welcome-stats"><div><strong>{role === "Admin" ? "62" : role === "Manager" ? "8" : "6"}</strong><span>{role === "Admin" ? "Employees" : role === "Manager" ? "Team members" : "My apps"}</span></div><div><strong>{role === "Employee" ? "4" : "3"}</strong><span>New stories</span></div></div></section>
    <div className="home-grid"><section className="panel span-two"><div className="section-head"><div><p className="kicker">WORK</p><h2>My apps & tools</h2></div><button onClick={() => navigate("Apps")}>View directory →</button></div><div className="apps-grid">{visibleApps.map((app) => <AppTile key={app[0]} app={app} role={role} notify={notify} />)}<button className="request-card" onClick={() => navigate("Apps")}><span>＋</span><strong>Request an App</strong><small>Browse the approved directory</small></button></div></section>
      <section className="panel announcement"><p className="kicker">COMPANY UPDATE</p><span className="date">AUG 27</span><h2>H!KINEX Learning Week starts Monday</h2><p>Short daily sessions, practical tools and an open Q&A with department leads.</p><button onClick={() => navigate("Announcements")}>Read update →</button></section>
      <section className="panel feed-card"><div className="section-head"><div><p className="kicker">COMMUNITY</p><h2>From your feed</h2></div><span className="live">● LIVE</span></div><div className="feed-person"><span>AM</span><p><strong>Ava Mitchell</strong><small>Marketing · 18 min ago</small></p></div><p>Our new campaign checklist is ready. I added the final launch steps and owner notes.</p><div className="reactions"><button onClick={() => notify("Reaction added for this preview only.")}>👏 12</button><button onClick={() => notify("Comments are illustrative only.")}>3 comments</button></div></section>
      <section className="panel quick"><p className="kicker">QUICK ACTIONS</p><h2>{role === "Employee" ? "What do you need?" : "Items requiring attention"}</h2>{(role === "Employee" ? [["Request an application", "Apps"], ["Send kudos", "People"], ["Refer a candidate", "Jobs"]] : role === "Manager" ? [["Review 3 app requests", "Requests"], ["Open My Team", "Team"], ["Create a team poll", "Feed"]] : [["Review 5 access items", "Admin"], ["Publish an announcement", "Announcements"], ["Manage portal apps", "Apps"]]).map(([item, target]) => <button key={item} onClick={() => navigate(target as View)}>{item}<span>→</span></button>)}</section>
    </div>
  </>;
}

function AppsView({ role, notify }: { role: Role; notify: (message: string) => void }) {
  const [search, setSearch] = useState(""); const [selected, setSelected] = useState("All");
  const groups = ["All", "H!KINEX", "Sales", "Recruiting", "Marketing", "E-Discovery", "IT"];
  const results = apps.filter((app) => (selected === "All" || app[3] === selected) && app[0].toLowerCase().includes(search.toLowerCase()));
  return <section><PageHead eyebrow="WORK" title="Apps & Tools" copy="A role-aware directory organized by department. Employees see assigned tools; Managers and Admins can review wider access." /><div className="directory-tools"><label>⌕ <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications" /></label><div>{groups.map((group) => <button className={selected === group ? "active" : ""} onClick={() => setSelected(group)} key={group}>{group}</button>)}</div></div><div className="directory-grid">{results.map((app) => <AppTile key={app[0]} app={app} role={role} notify={notify} />)}</div></section>;
}

function AnnouncementsView({ role, notify }: { role: Role; notify: (message: string) => void }) {
  const items = [["Pinned", "Learning Week starts Monday", "Company-wide", "AUG 27"], ["Product", "Mission Control release notes", "Product update", "AUG 25"], ["People", "Welcome our newest H!KINEX team members", "Company news", "AUG 22"]];
  return <section><PageHead eyebrow="COMPANY" title="Announcements" copy="Short, focused updates for the whole company or a selected department." />{role !== "Employee" && <button className="primary page-action" onClick={() => notify("Announcement composer opened in safe preview mode.")}>＋ Create announcement</button>}<div className="news-list">{items.map((item, i) => <article key={item[1]} className={i === 0 ? "pinned" : ""}><span>{item[3]}</span><div><p className="kicker">{item[0]} · {item[2]}</p><h2>{item[1]}</h2><p>Designed for a quick read with a clear audience, owner and link to the complete update.</p><button onClick={() => notify("Announcement opened for preview.")}>Open update →</button></div><aside><button onClick={() => notify("Reaction added for this preview only.")}>👏 24</button><button onClick={() => notify("Comments are illustrative only.")}>8 comments</button></aside></article>)}</div></section>;
}

function FeedView({ notify }: { notify: (message: string) => void }) {
  return <section><PageHead eyebrow="COMMUNITY" title="Company Feed" copy="Department posts, clubs, challenges and recognition in one reusable feed." /><div className="composer"><span>MY</span><button onClick={() => notify("Post composer opened. No post will be published.")}>Share an update, question or win...</button></div><div className="feed-layout"><div className="feed-stack">{[["Ava Mitchell", "Marketing", "Our launch checklist is ready for review.", "👏 12"], ["Daniel Kim", "Fitness Club", "Weekly challenge: share your best productivity tip.", "🎉 19"], ["Maya Patel", "Recruiting", "Kudos to Noah for supporting the hiring event!", "💚 28"]].map((post) => <article className="post" key={post[2]}><div className="feed-person"><span>{post[0].split(" ").map((n) => n[0]).join("")}</span><p><strong>{post[0]}</strong><small>{post[1]} · Today</small></p></div><p>{post[2]}</p><div className="reactions"><button onClick={() => notify("Reaction added for this preview only.")}>{post[3]}</button><button onClick={() => notify("Comments are illustrative only.")}>Comment</button><button onClick={() => notify("Share is disabled in this prototype.")}>Share</button></div></article>)}</div><aside className="challenge"><p className="kicker">WEEKLY CHALLENGE</p><h2>Share your favorite productivity tip</h2><p>Join 31 colleagues. Challenge closes Friday.</p><div><span style={{ width: "68%" }} /></div><button onClick={() => notify("Challenge participation is illustrative only.")}>Join challenge →</button></aside></div></section>;
}

function GroupsView({ role, notify }: { role: Role; notify: (message: string) => void }) {
  const groups = [["Marketing", "Team group", "28 members"], ["H!KINEX", "Company-wide", "62 members"], ["Gaming Club", "Interest club", "19 members"], ["Fitness", "Interest club", "31 members"], ["Creative Club", "Interest club", "24 members"], ["Book Club", "Interest club", "17 members"]];
  return <section><PageHead eyebrow="COMMUNITY" title="Groups & Clubs" copy="Department spaces are assigned by access. Interest clubs are optional and join-based." />{role === "Admin" && <button className="primary page-action" onClick={() => notify("Create Group is an Admin-only prototype action.")}>＋ Create group or club</button>}<div className="group-grid">{groups.map((group, i) => <article key={group[0]}><div className={`group-art art-${i}`}>{group[0].slice(0, 1)}</div><p className="kicker">{group[1]}</p><h2>{group[0]}</h2><span>{group[2]}</span><button onClick={() => notify(`${group[0]} opened in preview mode.`)}>{i < 2 ? "Open group" : "Join club"} →</button></article>)}</div></section>;
}

function PeopleView({ notify }: { notify: (message: string) => void }) {
  return <section><PageHead eyebrow="PEOPLE & CULTURE" title="People of H!KINEX" copy="Profiles connect roles, departments, achievements, clubs and peer recognition." /><div className="people-grid">{people.map((person, i) => <article key={person[0]}><span className={`person-avatar person-${i}`}>{person[2]}</span><h2>{person[0]}</h2><p>{person[1]}</p><small>{person[3]}</small><div><b>{i + 2} badges</b><b>{8 + i * 3} kudos</b></div><button onClick={() => notify(`Kudos to ${person[0]} is illustrative only.`)}>Send kudos →</button></article>)}</div></section>;
}

function JobsView({ role, notify }: { role: Role; notify: (message: string) => void }) {
  return <section><PageHead eyebrow="COMPANY" title="Jobs & Referrals" copy="Current openings plus transparent referral tracking, so submissions never disappear into a black box." />{role === "Admin" && <button className="primary page-action" onClick={() => notify("New opening is an Admin-only prototype action.")}>＋ Post opening</button>}<div className="jobs-layout"><div className="job-list">{[["Senior Account Executive", "Sales · Remote"], ["Talent Sourcer", "Recruiting · Hybrid"], ["Product Support Specialist", "IT · Remote"]].map((job) => <article key={job[0]}><div><p className="kicker">OPEN ROLE</p><h2>{job[0]}</h2><span>{job[1]}</span></div><button onClick={() => notify("Referral form opened in safe preview mode.")}>Refer someone →</button></article>)}</div><aside className="referral"><p className="kicker">MY REFERRALS</p><h2>Referral status</h2><div><span className="done">✓</span><p><strong>Submitted</strong><small>August 12</small></p></div><div><span className="current">2</span><p><strong>In review</strong><small>Talent team reviewing</small></p></div><div><span>3</span><p><strong>Interviewing</strong><small>Next step</small></p></div></aside></div></section>;
}

function ManagementView({ role, view, notify }: { role: Role; view: View; notify: (message: string) => void }) {
  const admin = role === "Admin";
  const title = view === "Team" ? "My Team" : view === "Requests" ? "Access Requests" : "Admin Control Center";
  return <section><PageHead eyebrow={admin ? "ADMIN" : "MANAGER"} title={title} copy={admin ? "Company-wide control of employees, applications, departments and community moderation." : "Manage only your own team, their assigned departments and incoming app requests."} /><div className="management-stats"><article><strong>{admin ? 62 : 8}</strong><span>{admin ? "Employees" : "Team members"}</span></article><article><strong>{admin ? 5 : 3}</strong><span>Open requests</span></article><article><strong>{admin ? 94 : 100}%</strong><span>Access reviewed</span></article></div><div className="management-list">{people.slice(0, admin ? 4 : 3).map((person, i) => <article key={person[0]}><span className={`person-avatar person-${i}`}>{person[2]}</span><div><h2>{person[0]}</h2><p>{person[1]} · {person[3]}</p></div><b>{5 + i} apps</b><button onClick={() => notify(`Access review for ${person[0]} is illustrative only.`)}>Review access</button></article>)}</div></section>;
}

function PageHead({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <header className="page-head"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></header>; }

export default function Portal() {
  const [role, setRole] = useState<Role>("Employee"); const [view, setView] = useState<View>("Home"); const [menu, setMenu] = useState(false); const [login, setLogin] = useState(false); const [toast, setToast] = useState("");
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const nav = useMemo(() => { const base: View[] = ["Home", "Feed", "Groups", "Announcements", "People", "Apps", "Jobs"]; if (role === "Manager") base.push("Team", "Requests"); if (role === "Admin") base.push("Team", "Requests", "Admin"); return base; }, [role]);
  useEffect(() => { if (!nav.includes(view)) setView("Home"); }, [nav, view]);
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setLogin(false); setMenu(false); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  const labels: Record<View, string> = { Home: "Home", Apps: "Apps & Tools", Announcements: "Announcements", Feed: "Company Feed", Groups: "Groups & Clubs", People: "People", Jobs: "Jobs & Referrals", Team: "My Team", Requests: "Access Requests", Admin: "Admin Console" };
  return <main className="portal commons"><aside className={menu ? "open" : ""}><Brand /><div className="profile"><span>{roleCopy[role].user.slice(0, 1)}{roleCopy[role].title.slice(0, 1)}</span><div><strong>{roleCopy[role].user}</strong><small>{roleCopy[role].title}</small></div></div><nav>{nav.map((item, i) => <button className={view === item ? "active" : ""} onClick={() => { setView(item); setMenu(false); }} key={item}><span>{["⌂", "≋", "◎", "◫", "◉", "▦", "◇", "♙", "✓", "⚙"][i]}</span>{labels[item]}{item === "Requests" && <b>3</b>}</button>)}</nav><footer><strong>H!KINEX Commons</strong><small>Community-first concept · Safe prototype</small></footer></aside>{menu && <button className="overlay" aria-label="Close navigation" onClick={() => setMenu(false)} />}<section className="main"><header className="topbar"><button className="menu" onClick={() => setMenu(true)} aria-label="Open navigation">☰</button><label className="global-search">⌕ <input placeholder="Search people, posts and tools" aria-label="Search the Employee Hub" onFocus={() => setView("People")} /></label><div className="role-switch" aria-label="Preview role">{(["Employee", "Manager", "Admin"] as Role[]).map((item) => <button className={role === item ? "active" : ""} onClick={() => { setRole(item); setView("Home"); }} key={item}>{item}</button>)}</div>{role !== "Employee" && <select aria-label="Department"><option>{role === "Admin" ? "All departments" : "Marketing"}</option><option>H!KINEX</option><option>Sales</option><option>Recruiting</option><option>Marketing</option><option>E-Discovery</option><option>IT</option></select>}<button className="login-preview" onClick={() => setLogin(true)}>Preview login</button></header><div className="content">{view === "Home" && <HomeView role={role} notify={notify} navigate={setView} />}{view === "Apps" && <AppsView role={role} notify={notify} />}{view === "Announcements" && <AnnouncementsView role={role} notify={notify} />}{view === "Feed" && <FeedView notify={notify} />}{view === "Groups" && <GroupsView role={role} notify={notify} />}{view === "People" && <PeopleView notify={notify} />}{view === "Jobs" && <JobsView role={role} notify={notify} />}{(view === "Team" || view === "Requests" || view === "Admin") && <ManagementView role={role} view={view} notify={notify} />}</div></section>
    {login && <div className="modal-layer"><button className="modal-scrim" aria-label="Close login preview" onClick={() => setLogin(false)} /><section className="login-modal" role="dialog" aria-modal="true" aria-label="Login preview"><button className="close" onClick={() => setLogin(false)} aria-label="Close">×</button><Brand /><p className="kicker">SECURE EMPLOYEE ACCESS</p><h2>Welcome to your H!KINEX Hub.</h2><div className="login-tabs"><button className="active">Sign In</button><button onClick={() => notify("Create Account remains an open policy decision.")}>Create Account</button></div><label>Email<input type="email" placeholder="name@hikinex.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label><button className="primary" onClick={() => notify("Demo only: no credentials were transmitted.")}>Continue</button><span className="or">or</span><button className="microsoft" onClick={() => notify("Microsoft SSO is illustrative only.")}><i /><i /><i /><i />Continue with Microsoft</button><small>No credentials are collected in this prototype.</small></section></div>}
    {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")} aria-label="Dismiss">×</button></div>}
  </main>;
}
