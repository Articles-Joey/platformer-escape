"use client"
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import classNames from 'classnames';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import { useHotkeys } from 'react-hotkeys-hook';
const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function GamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const sceneKey = useStore(state => state.sceneKey)
    const menuOpen = useStore(state => state.menuOpen)
    const sidebar = useStore(state => state.sidebar)
    const { isFullscreen } = useFullscreen();

    useHotkeys('R', () => {
        useStore.getState().reloadScene();
    }, []);

    useEffect(() => {

        if (server && socket.connected) {
            socket.emit('join-room', `game:cannon-room-${server}`, {
                game_id: server,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',

            });
        }

        // return function cleanup() {
        //     socket.emit('leave-room', 'game:glass-ceiling-landing')
        // };

    }, [server, socket.connected]);


    return (

        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': menuOpen,
                    'fullscreen': isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{
                position: 'relative',
                display: 'flex',
                '& .background': {
                    position: 'fixed', inset: 0, height: '100%', width: '100%', zIndex: 0, overflow: 'hidden',
                    '& img': { filter: 'blur(2px) brightness(0.80)', transform: 'scale(1.05)' },
                },
                '& .container': { position: 'relative', zIndex: 1 },
                '& .debug-info, & .game-info': { height: '100vh', width: '300px', flexShrink: 0, '& .MuiCard-root': { height: '100%' } },
                '& .game': { p: '0.5rem 1rem', display: 'flex', justifyContent: 'center' },
                '& .game-panel': { width: '100%' },
            }}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <Box className='canvas-wrap' sx={{
                position: 'relative', width: '100vw', height: '100vh',
                '& canvas': { position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 },
            }}>

                <GameCanvas
                    key={sceneKey}
                />

            </Box>

        </Box>
    );
}
