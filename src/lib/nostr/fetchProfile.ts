import type { UserProfile } from "#/types/api";
import { DEFAULT_RELAYS, getPool } from "./pool";

// Fetch user profile (kind 0)
export async function fetchProfile(pubkey: string): Promise<UserProfile | null> {
    const pool = getPool();

    try {
        // pool.get queries relays and returns the newest matching event
        const event = await pool.get(DEFAULT_RELAYS, {
            kinds: [0],
            authors: [pubkey],
        });

        if (!event) return null;

        const profileData = JSON.parse(event.content);

        return {
            pubkey,
            name: profileData.name ?? profileData.display_name ?? null,
            picture: profileData.picture ?? null,
            about: profileData.about ?? null,
        };
    } catch (err) {
        console.error("Failed to fetch or parse profile:", err);
        return null;
    }
}