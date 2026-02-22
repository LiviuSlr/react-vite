import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ID, Permission, Role, Query } from "appwrite";
import { account, databases } from "../lib/appwrite";

const AuthContext = createContext(null);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROFILES_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Appwrite user
  const [profile, setProfile] = useState(null); // your db profile doc
  const [loading, setLoading] = useState(true);

  async function loadProfile(appwriteUserId) {
    const res = await databases.listDocuments(DB_ID, PROFILES_ID, [
      Query.equal("userId", appwriteUserId),
      Query.limit(1),
    ]);
    return res.documents?.[0] ?? null;
  }

  async function refresh() {
    setLoading(true);
    try {
        const u = await account.get();
        setUser(u);

        try {
        const p = await loadProfile(u.$id);
        setProfile(p);
        } catch {
        setProfile(null);
        }
    } catch {
        setUser(null);
        setProfile(null);
    } finally {
        setLoading(false);
  }
}

  // Email/password signup
  async function signup({ email, password, name, role, organization, lab, phone }) {
    try {
        await account.deleteSession("current");
    } catch {}

    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);

    const u = await account.get();
    setUser(u);

    const existing = await loadProfile(u.$id);
    if (!existing) {
        const doc = await databases.createDocument(
        DB_ID,
        PROFILES_ID,
        ID.unique(),
        { userId: u.$id, role, organization, lab, phone },
        [
            Permission.read(Role.user(u.$id)),
            Permission.update(Role.user(u.$id)),
            Permission.delete(Role.user(u.$id)),
        ]
        );
        setProfile(doc);
    } else {
        setProfile(existing);
    }
    }

  // Email/password login
  async function login(email, password) {
    // If there is already an active session (ex: Google), remove it first
    try {
        await account.deleteSession("current");
    } catch {
        // ignore if there is no session
    }

    // Some Appwrite SDKs use createEmailSession instead of createEmailPasswordSession
    await account.createEmailPasswordSession(email, password);

    await refresh();
    }

  function loginWithGoogle() {
    account.createOAuth2Session(
        "google",
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/login`
    );
    }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setProfile(null);
  }

  async function updateName(name) {
    await account.updateName(name);
    await refresh();
  }

  async function updateProfile(data) {
    if (!profile) return;
    const updated = await databases.updateDocument(DB_ID, PROFILES_ID, profile.$id, data);
    setProfile(updated);
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      updateName,
      updateProfile,
      refresh,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}