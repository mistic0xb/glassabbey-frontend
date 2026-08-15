import { fetchProfile } from "#/lib/nostr/fetchProfile"
import { getPublicKey, hasNostrExtension } from "#/lib/nostr/nostrAuth"
import client from "./client"

// Fetcher for session verification
export const fetchSession = async (): Promise<UserProfile | null> => {
    try {
        const { data } = await client.get('/auth/me');
        return data
    } catch (error) {
        return null
    }
}

export async function fetchAuthChallenge(): Promise<string> {
    const { data } = await client.get("/auth/challenge");
    return data.challenge;
};

export async function loginWithNostr(): Promise<UserProfile> {
    if (!hasNostrExtension()) {
        throw new Error("no_extension");
    }

    const pubkey = await getPublicKey();

    if (!pubkey) {
        throw new Error("rejected");
    }

    // Fetch challenge
    const challenge = await fetchAuthChallenge();

    // Sign challenge
    const signedEvent = await window.nostr!.signEvent({
        kind: 27235,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["challenge", challenge]],
        content: "Login to GlassAbbey",
    });

    // Fetch profile
    const profile = await fetchProfile(pubkey);

    // Verify with backend
    await client.post(
        "/auth/verify",
        {
            pubkey,
            event: signedEvent,
            name: profile?.name ?? null,
            picture: profile?.picture ?? null,
        });

    return {
        pubkey,
        name: profile?.name ?? null,
        picture: profile?.picture ?? null,
    };
};

export async function logout() {
    await client.post('/auth/logout');
}