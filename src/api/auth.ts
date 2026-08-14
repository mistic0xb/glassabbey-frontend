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
    console.log("challenge: ", challenge);

    // Sign challenge
    console.log("Requesting signature...");
    const signedEvent = await window.nostr!.signEvent({
        kind: 27235,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["challenge", challenge]],
        content: "Login to GlassAbbey",
    });
    console.log("Signed event received: ", signedEvent);

    // Fetch profile
    console.log("Starting fetchProfile...");
    const profile = await fetchProfile(pubkey);
    console.log("Finished fetchProfile: ", profile);

    // Verify with backend
    console.log("Calling /auth/verify...");
    await client.post(
        "/auth/verify",
        {
            pubkey,
            event: signedEvent,
            name: profile?.name ?? null,
            picture: profile?.picture ?? null,
        });
    console.log("after verify", pubkey, profile);

    return {
        pubkey,
        name: profile?.name ?? null,
        picture: profile?.picture ?? null,
    };
};

export async function logout() {
    await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
    })
}