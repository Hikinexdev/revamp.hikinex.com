"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { accountName } from "../lib/account-name";

type Role = "Employee" | "Manager" | "Admin";
type View = "Home" | "Apps" | "Announcements" | "Feed" | "Groups" | "People" | "Jobs" | "Team" | "Requests" | "Admin";
type Application = { id: string; name: string; description: string; icon: string; group: string; url: string };

const apps: Application[] = [
  { id: "mission-control", name: "Mission Control", description: "Work overview", icon: "M", group: "H!KINEX", url: "https://mission-control-hikinex.vercel.app" },
  { id: "timekeeper", name: "TimeKeeper", description: "Time tracking", icon: "T", group: "H!KINEX", url: "https://hikinex-timekeeper-web2.vercel.app" },
  { id: "lms", name: "LMS", description: "Learning center", icon: "L", group: "H!KINEX", url: "https://dfd-lms-ten.vercel.app/auth/sign-in?redirectTo=%2Fdashboard" },
  { id: "vaultwarden", name: "Vaultwarden", description: "Password manager", icon: "V", group: "IT", url: "https://vault.hikinex.com/#/login" },
  { id: "hiki-it-portal", name: "HIKI IT Portal", description: "Support requests", icon: "IT", group: "IT", url: "https://hikinex-it-app-production.up.railway.app" },
  { id: "hubspot", name: "HubSpot", description: "Sales and marketing", icon: "H", group: "Sales", url: "https://app.hubspot.com/login" },
  { id: "reet", name: "REET", description: "Agent performance dashboards", icon: "R", group: "H!KINEX", url: "https://reet-hikinex.vercel.app" },
  { id: "talentdirector", name: "TalentDirector", description: "Recruiting operations hub", icon: "TD", group: "Recruiting", url: "https://talentdirector.dogfooddevsecure.com" },
  { id: "invsync", name: "InvSync", description: "Invoice pipeline and billing", icon: "IS", group: "H!KINEX", url: "https://invsync-rho.vercel.app" },
  { id: "softwaretracker", name: "SoftwareTracker", description: "Software inventory and renewals", icon: "ST", group: "IT", url: "https://softwaretracker.vercel.app" },
  { id: "canva", name: "Canva", description: "Design workspace", icon: "C", group: "Marketing", url: "https://www.canva.com/login" },
  { id: "semrush", name: "Semrush", description: "SEO intelligence", icon: "S", group: "Marketing", url: "https://www.semrush.com/login/" },
  { id: "reqev-ats", name: "RegEv · ATS", description: "Applicant tracking and hiring", icon: "RA", group: "Recruiting", url: "https://app.reqev.com" },
  { id: "dfd-timekeeper", name: "DFD TimeKeeper", description: "DogFoodDev time tracking", icon: "DT", group: "DogFoodDev", url: "https://dfd-timekeeper.vercel.app" },
];

const employeeDefaults = ["mission-control", "timekeeper", "lms", "vaultwarden", "hiki-it-portal", "hubspot"];
const roleDefaults: Record<Role, string[]> = {
  Employee: employeeDefaults,
  Manager: [...employeeDefaults, "reet", "talentdirector"],
  Admin: [...employeeDefaults, "invsync", "softwaretracker"],
};

const sharedOptionalApps = ["canva", "semrush", "reqev-ats", "dfd-timekeeper"];
const roleCatalogApps: Record<Role, string[]> = {
  Employee: [...employeeDefaults, ...sharedOptionalApps],
  Manager: [...employeeDefaults, "reet", "talentdirector", ...sharedOptionalApps],
  Admin: [...employeeDefaults, "invsync", "softwaretracker", ...sharedOptionalApps],
};

const people = [
  ["Ava Mitchell", "Marketing Specialist", "AM", "Marketing"], ["Daniel Kim", "E-Discovery Manager", "DK", "E-Discovery"],
  ["Maya Patel", "Talent Partner", "MP", "Recruiting"], ["Noah Williams", "Sales Associate", "NW", "Sales"],
];

const roleCopy: Record<Role, { title: string; team: string }> = {
  Employee: { title: "Employee", team: "H!KINEX" },
  Manager: { title: "Manager", team: "H!KINEX" },
  Admin: { title: "Portal Administrator", team: "All departments" },
};

function Brand() { return <div className="brand"><span>H!</span>KINEX<small>EMPLOYEE HUB</small></div>; }

function AppTile({ app, assigned, protectedApp, directory = false, canEdit, pinned = false, onAdd, onRemove, onTogglePin }: { app: Application; assigned: boolean; protectedApp: boolean; directory?: boolean; canEdit: boolean; pinned?: boolean; onAdd: (app: Application) => void; onRemove: (app: Application) => void; onTogglePin?: (app: Application) => void }) {
  return <article className={`app-tile ${assigned ? "assigned" : ""} ${pinned ? "pinned-app" : ""}`}>
    <span className="app-icon">{app.icon}</span><span className="app-copy"><strong>{app.name}</strong><small>{app.description}</small></span>
    <div className="app-actions">
      {assigned && onTogglePin && <button className="pin-app" onClick={() => onTogglePin(app)} disabled={!canEdit} aria-pressed={pinned} aria-label={`${pinned ? "Unpin" : "Pin"} ${app.name} on the dashboard`} title={pinned ? "Unpin from dashboard" : "Pin to dashboard"}><svg viewBox="0 0 24 24" aria-hidden="true"><path className="pin-body" d="M8 3h8v8l2 3v3H6v-3l2-3V3Z" /><path className="pin-stem" d="M12 17v5" /></svg></button>}
      {assigned && <a href={app.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${app.name} in a new tab`}>Open ↗</a>}
      {directory && !assigned && <button onClick={() => onAdd(app)} disabled={!canEdit}>{canEdit ? "Add app" : "Sign in to add"}</button>}
      {directory && assigned && !protectedApp && <button className="remove-app" onClick={() => onRemove(app)} disabled={!canEdit}>{canEdit ? "Remove" : "Added"}</button>}
      {directory && protectedApp && <b>Role default</b>}
    </div>
  </article>;
}

function HomeView({ role, displayName, assignedIds, pinnedIds, canEdit, navigate, notify, onAdd, onRemove, onTogglePin }: { role: Role; displayName: string; assignedIds: Set<string>; pinnedIds: Set<string>; canEdit: boolean; navigate: (view: View) => void; notify: (message: string) => void; onAdd: (app: Application) => void; onRemove: (app: Application) => void; onTogglePin: (app: Application) => void }) {
  const profile = roleCopy[role];
  const visibleApps = apps.filter((app) => assignedIds.has(app.id) && pinnedIds.has(app.id));

  return <>
    <section className="welcome"><div><p className="kicker">H!KINEX COMMONS · {role.toUpperCase()}</p><h1>{displayName ? `Welcome, ${displayName}.` : "Welcome."}</h1><p>{profile.title} · {profile.team}</p>{!displayName && <p>To refresh your name, sign out and continue with Microsoft again.</p>}</div><div className="microsoft-shortcuts welcome-microsoft" aria-label="Microsoft apps"><a href="https://outlook.office.com/mail/" target="_blank" rel="noopener noreferrer" aria-label="Open Outlook"><span className="outlook-mark" aria-hidden="true">O</span><span>Outlook</span></a><a className="office-apps" href="https://www.microsoft365.com/apps" target="_blank" rel="noopener noreferrer" aria-label="Open all Microsoft 365 apps"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 2h4v4H2V2Zm6 0h4v4H8V2Zm6 0h4v4h-4V2ZM2 8h4v4H2V8Zm6 0h4v4H8V8Zm6 0h4v4h-4V8ZM2 14h4v4H2v-4Zm6 0h4v4H8v-4Zm6 0h4v4h-4v-4Z" /></svg></a></div></section>
    <div className="home-grid"><section className="panel span-two"><div className="section-head"><div><p className="kicker">WORK</p><h2>My pinned apps</h2><small className="section-hint">Only pinned apps appear here. Use the directory to pin another app.</small></div><button onClick={() => navigate("Apps")}>View directory →</button></div><div className="apps-grid">{visibleApps.map((app) => <AppTile key={app.id} app={app} assigned protectedApp={roleDefaults[role].includes(app.id)} pinned canEdit={canEdit} onAdd={onAdd} onRemove={onRemove} onTogglePin={onTogglePin} />)}{visibleApps.length === 0 && <div className="empty-pins"><strong>No pinned apps yet</strong><small>Open the directory and select the pin beside an app.</small></div>}<button className="request-card" onClick={() => navigate("Apps")}><span>＋</span><strong>Add or pin an App</strong><small>Browse the approved directory</small></button></div></section>
      <section className="panel announcement"><p className="kicker">COMPANY UPDATE</p><span className="date">AUG 27</span><h2>H!KINEX Learning Week starts Monday</h2><p>Short daily sessions, practical tools and an open Q&A with department leads.</p><button onClick={() => navigate("Announcements")}>Read update →</button></section>
      <section className="panel feed-card"><div className="section-head"><div><p className="kicker">COMMUNITY</p><h2>From your feed</h2></div><span className="live">● LIVE</span></div><div className="feed-person"><span>AM</span><p><strong>Ava Mitchell</strong><small>Marketing · 18 min ago</small></p></div><p>Our new campaign checklist is ready. I added the final launch steps and owner notes.</p><div className="reactions"><button onClick={() => notify("Reaction added for this preview only.")}>👏 12</button><button onClick={() => notify("Comments are illustrative only.")}>3 comments</button></div></section>
      <section className="panel quick"><p className="kicker">QUICK ACTIONS</p><h2>{role === "Employee" ? "What do you need?" : "Items requiring attention"}</h2>{(role === "Employee" ? [["Add an application", "Apps"], ["Send kudos", "People"], ["Refer a candidate", "Jobs"]] : role === "Manager" ? [["Add an application", "Apps"], ["Open My Team", "Team"], ["Create a team poll", "Feed"]] : [["Review team access", "Admin"], ["Publish an announcement", "Announcements"], ["Add an application", "Apps"]]).map(([item, target]) => <button key={item} onClick={() => navigate(target as View)}>{item}<span>→</span></button>)}</section>
    </div>
  </>;
}

function AppsView({ role, assignedIds, pinnedIds, canEdit, onAdd, onRemove, onTogglePin }: { role: Role; assignedIds: Set<string>; pinnedIds: Set<string>; canEdit: boolean; onAdd: (app: Application) => void; onRemove: (app: Application) => void; onTogglePin: (app: Application) => void }) {
  const [search, setSearch] = useState(""); const [selected, setSelected] = useState("All");
  const groups = ["All", "H!KINEX", "Sales", "Recruiting", "Marketing", "IT", "DogFoodDev"];
  const results = apps.filter((app) => roleCatalogApps[role].includes(app.id) && (selected === "All" || app.group === selected) && `${app.name} ${app.description}`.toLowerCase().includes(search.toLowerCase()));
  return <section><PageHead eyebrow="WORK" title="Add an App" copy={canEdit ? `Choose an application approved for the ${role} role. Assigned applications can be pinned to your dashboard.` : "Explore the approved directory in Review mode. Sign in to save applications to My Apps."} /><div className="directory-tools"><label>⌕ <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications" /></label><div>{groups.map((group) => <button className={selected === group ? "active" : ""} onClick={() => setSelected(group)} key={group}>{group}</button>)}</div></div><div className="directory-grid">{results.map((app) => <AppTile key={app.id} app={app} assigned={assignedIds.has(app.id)} protectedApp={roleDefaults[role].includes(app.id)} directory pinned={pinnedIds.has(app.id)} canEdit={canEdit} onAdd={onAdd} onRemove={onRemove} onTogglePin={onTogglePin} />)}</div>{results.length === 0 && <div className="empty-state"><strong>No applications found</strong><span>Try another name or department.</span></div>}</section>;
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
  const [role, setRole] = useState<Role>("Employee");
  const [view, setView] = useState<View>("Home");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [savedName, setSavedName] = useState<{ userId: string; name: unknown } | null>(null);
  const identity = session ? accountName(session.user, savedName) : null;
  const [authReady, setAuthReady] = useState(!supabase);
  const [profileReady, setProfileReady] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const canEdit = Boolean(session && supabase);
  const assignedIds = useMemo(() => new Set([...roleDefaults[role], ...addedIds]), [role, addedIds]);
  const pinnedIdSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const nav: View[] = role === "Employee" ? ["Announcements"] : [];
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
      if (event === "USER_UPDATED") return;
      setProfileReady(false);
      setAuthMessage("");
      if (!nextSession) { setAddedIds([]); setPinnedIds([]); setSavedName(null); }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session || !supabase) return;
    let current = true;
    Promise.all([
      supabase.from("profiles").select("role, display_name").eq("user_id", session.user.id).maybeSingle(),
      supabase.from("user_app_assignments").select("application_id").eq("user_id", session.user.id).eq("source", "self_added"),
    ]).then(([profileResult, assignmentResult]) => {
      if (!current) return;
      setSavedName({ userId: session.user.id, name: profileResult.data?.display_name });
      const storedRole = profileResult.data?.role;
      if (profileResult.error || (storedRole !== "employee" && storedRole !== "manager" && storedRole !== "admin")) {
        setAuthMessage("Your account does not have an assigned H!KINEX portal role. Please contact an administrator.");
        setProfileReady(true);
        return;
      }
      setRole((storedRole.charAt(0).toUpperCase() + storedRole.slice(1)) as Role);
      setView("Home");
      if (!assignmentResult.error) setAddedIds((assignmentResult.data ?? []).map((row) => row.application_id));
      const savedPins = session.user.user_metadata?.pinned_apps;
      setPinnedIds(Array.isArray(savedPins) ? savedPins.filter((id): id is string => typeof id === "string" && apps.some((app) => app.id === id)) : []);
      setProfileReady(true);
    });
    return () => { current = false; };
  }, [session]);
  const addApp = async (app: Application) => {
    if (!session || !supabase) return;
    if (assignedIds.has(app.id)) return;
    setAddedIds((current) => [...current, app.id]);
    const { error } = await supabase.from("user_app_assignments").upsert({ user_id: session.user.id, application_id: app.id, source: "self_added" }, { onConflict: "user_id,application_id" });
    if (error) { setAddedIds((current) => current.filter((id) => id !== app.id)); notify("We could not save that app. Your previous selection was restored."); return; }
    notify(`${app.name} was added to My Apps.`);
  };
  const removeApp = async (app: Application) => {
    if (!session || !supabase || roleDefaults[role].includes(app.id)) return;
    setAddedIds((current) => current.filter((id) => id !== app.id));
    const { error } = await supabase.from("user_app_assignments").delete().eq("user_id", session.user.id).eq("application_id", app.id).eq("source", "self_added");
    if (error) { setAddedIds((current) => [...new Set([...current, app.id])]); notify("We could not remove that app. Your previous selection was restored."); return; }
    notify(`${app.name} was removed from My Apps.`);
  };
  const togglePin = async (app: Application) => {
    if (!session || !supabase || !assignedIds.has(app.id)) return;
    const previous = pinnedIds;
    const next = previous.includes(app.id) ? previous.filter((id) => id !== app.id) : [...previous, app.id];
    setPinnedIds(next);
    const { error } = await supabase.auth.updateUser({ data: { pinned_apps: next } });
    if (error) {
      setPinnedIds(previous);
      notify("We could not save that dashboard change. Your previous pins were restored.");
      return;
    }
    notify(`${app.name} was ${next.includes(app.id) ? "pinned to" : "unpinned from"} your dashboard.`);
  };
  const signIn = async () => {
    if (!supabase) { setAuthMessage("Secure access is being finalized. Please try again shortly."); return; }
    if (!email || !password) { setAuthMessage("Enter your H!KINEX email and password."); return; }
    setAuthBusy(true);
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) { setAuthMessage("The email or password is incorrect, or this account is not active."); return; }
    setPassword("");
  };
  const signInWithMicrosoft = async () => {
    if (!supabase) { setAuthMessage("Microsoft organizational access is not available yet. Please try again shortly."); return; }
    setAuthBusy(true);
    setAuthMessage("");
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      // The profile scope supplies name claims in Microsoft's verified ID token.
      options: { scopes: "email profile", redirectTo, skipBrowserRedirect: true },
    });
    if (error) {
      setAuthBusy(false);
      setAuthMessage("Microsoft organizational sign-in could not start. Please contact IT if the problem continues.");
      return;
    }
    if (data.url) { window.location.assign(data.url); return; }
    setAuthBusy(false);
    setAuthMessage("Microsoft did not return a sign-in address. Please contact IT so the Azure provider settings can be checked.");
  };
  const signOut = () => {
    setSession(null);
    setSavedName(null);
    setAddedIds([]);
    setRole("Employee");
    setView("Home");
    setProfileReady(false);
    setAuthReady(true);
    setAuthBusy(false);
    setAuthMessage("");
    if (supabase) {
      void supabase.auth.signOut({ scope: "local" }).then(({ error }) => {
        if (error) setAuthMessage("You are signed out of the portal, but the remote session could not be closed.");
      });
    }
  };
  const labels: Record<View, string> = { Home: "Home", Apps: "Apps & Tools", Announcements: "Company Updates", Feed: "Company Feed", Groups: "Groups & Clubs", People: "People", Jobs: "Jobs & Referrals", Team: "My Team", Requests: "Access Requests", Admin: "Admin Console" };
  if (!authReady || (session && !profileReady)) return <main className="auth-page"><section className="auth-card"><Brand /><div className="auth-loading" aria-live="polite">Checking secure access…</div></section></main>;
  if (!session) return <main className="auth-page"><section className="auth-card"><Brand /><p className="kicker">SECURE EMPLOYEE ACCESS</p><h1>Welcome to H!KINEX Commons.</h1><p>Sign in with your assigned Employee, Manager, or Admin account. Your account role determines which portal and controls you can access.</p><button className="microsoft microsoft-primary" onClick={signInWithMicrosoft} disabled={authBusy || !isSupabaseConfigured}><span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>{authBusy ? "Connecting…" : "Continue with Microsoft"}</button><span className="or">or use your assigned portal credentials</span><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@hikinex.com" /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" onKeyDown={(event) => { if (event.key === "Enter") signIn(); }} /></label>{authMessage && <div className="auth-error" role="alert">{authMessage}</div>}<button className="primary" onClick={signIn} disabled={authBusy || !isSupabaseConfigured}>{authBusy ? "Signing in…" : isSupabaseConfigured ? "Sign in with email" : "Secure access is being connected"}</button><small>Access and roles are managed by H!KINEX.</small></section></main>;
  if (authMessage) return <main className="auth-page"><section className="auth-card"><Brand /><p className="kicker">ACCESS NOT ASSIGNED</p><h1>We couldn’t open your portal.</h1><p>{authMessage}</p><button className="primary" onClick={signOut}>Sign out</button></section></main>;
  const managementAllowed = (role === "Manager" && (view === "Team" || view === "Requests")) || (role === "Admin" && view === "Admin");
return <main className={`portal commons ${dark ? "dark" : ""}`}><aside className={menu ? "open" : ""}><button className="brand-home" onClick={() => { setView("Home"); setMenu(false); }} aria-label="Open dashboard"><Brand /></button><details className="profile-menu"><summary className="profile"><span>{identity?.initials}</span><div><strong>{identity?.fullName || "Your account"}</strong><small>{roleCopy[role].title}</small></div><b aria-hidden="true">⌄</b></summary><div className="account-menu"><button onClick={() => setDark((current) => !current)} aria-pressed={dark}><span aria-hidden="true">{dark ? "☀" : "◐"}</span><span><strong>{dark ? "Light mode" : "Dark mode"}</strong><small>Change portal appearance</small></span></button><button className="account-signout" onClick={signOut}><span aria-hidden="true">↪</span><span><strong>Sign out</strong><small>End this secure session</small></span></button></div></details><nav>{nav.map((item) => <button className={view === item ? "active" : ""} onClick={() => { setView(item); setMenu(false); }} key={item}><span>◫</span>{labels[item]}</button>)}</nav><footer><strong>H!KINEX Commons</strong><small>Secure session</small></footer></aside>{menu && <button className="overlay" aria-label="Close navigation" onClick={() => setMenu(false)} />}<section className="main"><header className="topbar"><button className="menu" onClick={() => setMenu(true)} aria-label="Open navigation">☰</button>{role !== "Employee" && <select aria-label="Department"><option>{role === "Admin" ? "All departments" : "Marketing"}</option><option>H!KINEX</option><option>Sales</option><option>Recruiting</option><option>Marketing</option><option>IT</option><option>DogFoodDev</option></select>}</header><div className="content">{view === "Home" && <HomeView role={role} displayName={identity?.greetingName ?? ""} assignedIds={assignedIds} pinnedIds={pinnedIdSet} canEdit={canEdit} navigate={setView} notify={notify} onAdd={addApp} onRemove={removeApp} onTogglePin={togglePin} />}{view === "Apps" && <AppsView role={role} assignedIds={assignedIds} pinnedIds={pinnedIdSet} canEdit={canEdit} onAdd={addApp} onRemove={removeApp} onTogglePin={togglePin} />}{view === "Announcements" && <AnnouncementsView role={role} notify={notify} />}{view === "Feed" && <FeedView notify={notify} />}{view === "Groups" && <GroupsView role={role} notify={notify} />}{view === "People" && <PeopleView notify={notify} />}{view === "Jobs" && <JobsView role={role} notify={notify} />}{managementAllowed && <ManagementView role={role} view={view} notify={notify} />}</div></section>{toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")} aria-label="Dismiss">×</button></div>}</main>;
}
