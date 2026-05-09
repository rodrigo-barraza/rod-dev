import ApiConstants from '@/constants/ApiConstants';

const PROJECT_ID = 'rod-dev-client';

const EventApiLibrary = {
    /**
     * Send a session heartbeat to sessions-service.
     * Creates the session on first call, accumulates duration on subsequent calls.
     */
    async postSession(
        sessionId: string,
        visitorId: string,
        duration: number,
        width: number,
        height: number,
        referrer: string | null,
        utm: Record<string, string> | null,
    ): Promise<void> {
        try {
            await fetch(`${ApiConstants.SESSIONS_API}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    sessionId,
                    visitorId,
                    projectId: PROJECT_ID,
                    duration,
                    width,
                    height,
                    referrer,
                    utm,
                }),
                keepalive: true,
            });
        } catch {
            // Silently fail — analytics should never break the app
        }
    },

    /**
     * Record a page view navigation.
     */
    async postPageView(
        sessionId: string,
        visitorId: string,
        url: string,
        title: string,
        referrer: string | null,
    ): Promise<void> {
        try {
            await fetch(`${ApiConstants.SESSIONS_API}/pageviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    sessionId,
                    visitorId,
                    projectId: PROJECT_ID,
                    url,
                    title,
                    referrer,
                }),
                keepalive: true,
            });
        } catch {
            // Silently fail
        }
    },

    /**
     * Record a custom interaction event (click, scroll, media, etc.)
     */
    async postEvent(
        sessionId: string,
        visitorId: string,
        category: string,
        action: string,
        label?: string,
        value?: string,
    ): Promise<void> {
        try {
            await fetch(`${ApiConstants.SESSIONS_API}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    sessionId,
                    visitorId,
                    projectId: PROJECT_ID,
                    category,
                    action,
                    label: label || null,
                    value: value || null,
                }),
                keepalive: true,
            });
        } catch {
            // Silently fail
        }
    },
};

export default EventApiLibrary;
