import { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react'
import LayoutComponent from '@/components/LayoutComponent';
import EventLibrary from '@/libraries/EventLibrary';
import '@/styles/styles.scss'
import '@/styles/animations.scss'
import { AlertProvider, useAlertContext } from '@/contexts/AlertContext'
import RenderApiLibrary from '@/libraries/RenderApiLibrary';
import { ThemeProvider } from "@rodrigo-barraza/components-library";
import { useApplicationState } from "@/stores/ZustandStore";


function App({ Component, pageProps }: AppProps) {
    const { message } = useAlertContext();
    const [getRenderStatus, setRenderStatus] = useState(false);
    const { setIsRenderApiAvailable } = useApplicationState();

    async function getStatus() {
        const getStatus = await RenderApiLibrary.getStatus();
        if (getStatus.data) {
            setRenderStatus(true);
            setIsRenderApiAvailable(true);
        } else {
            setRenderStatus(false);
            setIsRenderApiAvailable(false);
        }
      }

    useEffect(() => {
        // Initialize session tracking
        const { isNew } = EventLibrary.init();

        // Record session type (new vs returning)
        if (isNew) {
            EventLibrary.postEventSessionNew(document.referrer, window.location.href);
        } else {
            EventLibrary.postEventSessionReturning(document.referrer, window.location.href);
        }

        // Record initial page view
        EventLibrary.postPageView(
            window.location.href,
            document.title,
            document.referrer || null,
        );

        getStatus();

        // Track navigation and link clicks
        document.addEventListener('click', (event: MouseEvent) => {
            event = event || window.event;
            const target = event.target as HTMLAnchorElement;
            if (target && target.nodeName === 'A') {
                if(target.href.includes('//development.rod.dev') ||
                target.href.includes('//rod.dev') ||
                target.href.includes('//localhost')) {
                    EventLibrary.postEventNavigationClick(target.href);
                } else {
                    EventLibrary.postEventLinkClick(target.href);
                }
            }
        }, false);

        // Session heartbeat — every 5 seconds
        const heartbeatInterval = setInterval(() => {
            EventLibrary.postSession(5000, screen.width, screen.height);
        }, 5000);

        return () => clearInterval(heartbeatInterval);
    }, [])

    return (
        <ThemeProvider>
            <LayoutComponent>
                <AlertProvider>
                    {message}
                    <Component {...pageProps} />
                </AlertProvider>
                {/* <Analytics /> */}
            </LayoutComponent>
        </ThemeProvider>
    )
}
export default App