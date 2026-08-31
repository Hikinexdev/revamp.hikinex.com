type NameFields = Record<string, unknown>;
type Account = {
  id: string;
  email?: string;
  user_metadata?: NameFields;
  identities?: { provider: string; identity_data?: NameFields }[];
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

// Names are presentation only. Authorization must continue to use profiles.role.
export function accountName(user: Account, saved?: { userId: string; name: unknown } | null) {
  const metadata = user.user_metadata ?? {};
  const microsoft = user.identities?.find((identity) => identity.provider === "azure")?.identity_data ?? {};
  const sources = [microsoft, metadata];
  const email = user.email?.toLowerCase() ?? "";
  const username = email.split("@")[0];
  function usable(value: unknown, fromProvider = false): string {
    const name = text(value);
    if (!name || name.includes("@")) return "";
    // Old profiles were populated with email prefixes. Never present those as names.
    if (!fromProvider && name.toLowerCase() === username) return "";
    return name;
  }
  let fullName = "";
  let givenName = "";
  for (const fields of sources) {
    const given = usable(fields.given_name, true) || usable(fields.first_name, true);
    const candidate = [
      usable(fields.full_name), usable(fields.name), usable(fields.display_name),
      given ? [given, text(fields.family_name)].filter(Boolean).join(" ") : "",
    ].find(Boolean);
    if (candidate) { fullName = candidate; givenName = given; break; }
  }
  if (!fullName && saved?.userId === user.id) fullName = usable(saved.name);
  const testAccountNames: Record<string, string> = {
    "testemployee@hikinex.com": "Test Employee",
    "testmanager@hikinex.com": "Test Manager",
    "testadmin@hikinex.com": "Test Admin",
  };
  if (!fullName && testAccountNames[email]) fullName = testAccountNames[email];
  const greetingName = givenName || fullName.split(" ")[0];
  const testGreeting = testAccountNames[email];
  const initials = fullName ? fullName.split(" ").slice(0, 2).map((part) => Array.from(part)[0]).join("").toUpperCase() : "•";
  return { fullName, greetingName: testGreeting || greetingName, initials };
}
