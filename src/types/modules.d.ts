// Ambient module declarations for untyped npm packages.
// These will be replaced with proper types once those packages complete their own TS migrations.

declare module '@rodrigo-barraza/components-library' {
    import type { ComponentType, ReactNode } from 'react';

    export interface ThemeProviderProps {
        children?: ReactNode;
    }

    export const ThemeProvider: ComponentType<ThemeProviderProps>;
}

declare module '@rodrigo-barraza/utilities-library' {
    export function generateUUID(): string;
}

