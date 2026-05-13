import EventApiLibrary from './EventApiLibrary';

import { generateUUID } from "@rodrigo-barraza/utilities-library";

// ─── Session & Visitor Management ──────────────────────────────────

const SESSION_KEY = 'sessions_session_id';
const VISITOR_KEY = 'sessions_visitor_id';

/** Get or create a persistent visitor ID (survives browser close via localStorage). */
function getVisitorId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = generateUUID();
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
}

/** Get or create a session ID (dies when tab/window closes via sessionStorage). */
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
        id = generateUUID();
        sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

/** Check if this is a returning session (sessionStorage already had an ID). */
function isReturningSession(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) !== null;
}

// ─── UTM Parameter Extraction ──────────────────────────────────────

function extractUtmParams(): Record<string, string> | null {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    for (const key of keys) {
        const value = params.get(key);
        if (value) {
            // Store without the utm_ prefix for cleaner data
            utm[key.replace('utm_', '')] = value;
        }
    }

    return Object.keys(utm).length > 0 ? utm : null;
}

// ─── Public API ────────────────────────────────────────────────────

const EventLibrary = {
    /**
     * Initialize session tracking. Call once on app mount.
     * Returns whether this is a new or returning session.
     */
    init: (): { isNew: boolean; sessionId: string; visitorId: string } => {
        const isNew = !isReturningSession();
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        return { isNew, sessionId, visitorId };
    },

    /**
     * Send a session heartbeat (call on interval, e.g. every 5s).
     */
    postSession: (duration: number, width: number, height: number) => {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const referrer = document.referrer || null;
        const utm = extractUtmParams();
        EventApiLibrary.postSession(sessionId, visitorId, duration, width, height, referrer, utm);
    },

    /**
     * Record a page view.
     */
    postPageView: (url: string, title: string, referrer: string | null) => {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        EventApiLibrary.postPageView(sessionId, visitorId, url, title, referrer);
    },

    /**
     * Record a new visit event.
     */
    postEventSessionNew: (referrer: string, url: string) => {
        EventLibrary.postEvent('session', 'new-visit', referrer, url);
    },

    /**
     * Record a returning visit event.
     */
    postEventSessionReturning: (referrer: string, url: string) => {
        EventLibrary.postEvent('session', 'returning-visit', referrer, url);
    },

    /**
     * Record a navigation click event.
     */
    postEventNavigationClick: (url: string) => {
        EventLibrary.postEvent('navigation', 'click', url, undefined);
    },

    /**
     * Record an external link click event.
     */
    postEventLinkClick: (url: string) => {
        EventLibrary.postEvent('link', 'click', url, undefined);
    },

    /**
     * Record an image fullscreen event.
     */
    postEventImageFullscreen: (imageName: string) => {
        EventLibrary.postEvent('image', 'fullscreen', imageName, undefined);
    },

    /**
     * Record a menu open event.
     */
    postEventMenuOpen: () => {
        EventLibrary.postEvent('menu', 'open', undefined, undefined);
    },

    /**
     * Record a menu close event.
     */
    postEventMenuClose: () => {
        EventLibrary.postEvent('menu', 'close', undefined, undefined);
    },

    /**
     * Generic event posting.
     */
    postEvent: (category: string, action: string, label?: string, value?: string) => {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        EventApiLibrary.postEvent(sessionId, visitorId, category, action, label, value);
    },
};

export default EventLibrary;