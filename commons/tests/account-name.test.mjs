import assert from "node:assert/strict";
import test from "node:test";
import { accountName } from "../lib/account-name.ts";

const user = (metadata = {}) => ({ id: "test-one", email: "jsantos@example.test", user_metadata: metadata });

test("Microsoft name replaces a stale email-prefix profile", () => {
  const result = accountName(user({ full_name: "Julia Santos", given_name: "Julia" }), { userId: "test-one", name: "jsantos" });
  assert.deepEqual(result, { fullName: "Julia Santos", greetingName: "Julia", initials: "JS" });
});

test("Azure identity name takes precedence over stale metadata", () => {
  const account = { ...user({ name: "Old Name", given_name: "Old" }), identities: [{ provider: "azure", identity_data: { name: "Julia Santos" } }] };
  assert.equal(accountName(account).fullName, "Julia Santos");
  assert.equal(accountName(account).greetingName, "Julia");
});

test("supports given and family names, accents, and compound first names", () => {
  const result = accountName(user({ given_name: "María José", family_name: "García" }));
  assert.equal(result.fullName, "María José García");
  assert.equal(result.greetingName, "María José");
});

test("never uses an email or its saved prefix as a name", () => {
  for (const name of ["jsantos", " JSANTOS ", "jsantos@example.test", "", null, 17]) {
    assert.equal(accountName(user({ full_name: name }), { userId: "test-one", name }).fullName, "");
  }
});

test("allows a real single-word given name even when it matches the email prefix", () => {
  assert.equal(accountName({ ...user({ given_name: "Julia" }), email: "julia@example.test" }).greetingName, "Julia");
});

test("uses a saved real name only for the same account", () => {
  assert.equal(accountName(user(), { userId: "test-one", name: "Julia Santos" }).greetingName, "Julia");
  assert.equal(accountName(user(), { userId: "other-account", name: "Previous Person" }).fullName, "");
});

test("handles missing metadata and malformed name fields without guessing", () => {
  assert.equal(accountName({ id: "test-two" }).fullName, "");
  assert.equal(accountName(user({ full_name: {}, name: ["Wrong"], display_name: "  " })).fullName, "");
});

test("labels the three non-Microsoft test accounts without treating usernames as names", () => {
  for (const [email, name] of [
    ["testemployee@hikinex.com", "Test Employee"],
    ["testmanager@hikinex.com", "Test Manager"],
    ["testadmin@hikinex.com", "Test Admin"],
  ]) {
    const result = accountName({ id: email, email }, { userId: email, name: email.split("@")[0] });
    assert.equal(result.fullName, name);
    assert.equal(result.greetingName, name);
  }
});
