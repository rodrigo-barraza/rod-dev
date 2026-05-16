import { useState } from 'react';
import GuestApiLibrary from '@/libraries/GuestApiLibrary';
import type { Guest } from '@/types/types';

/**
 * Custom hook for guest data management.
 * Eliminates the duplicate getGuest + guestData pattern across renders/likes/generate pages.
 */
export default function useGuest(initialGuest: Guest = {}) {
    const [guestData, setGuestData] = useState<Guest>(initialGuest);

    async function refreshGuest() {
        const result = await GuestApiLibrary.getGuest();
        if (result.data) {
            setGuestData(result.data);
        }
    }

    return { guestData, setGuestData, refreshGuest };
}
