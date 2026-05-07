import Link from "next/link";

// import ROUTES from '@/components/constants/routes';
// import { useGameStore } from "../hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

// import ControllerPreview from "../../ControllerPreview";

import { useSocketStore } from "@/hooks/useSocketStore";
// import { useIceSlideStore } from "./hooks/useIceSlideStore";
// import { useEffect, useRef } from "react";
// import { useHotkeys } from "react-hotkeys-hook";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

import DebugPanel from "./DebugPanel";

export default function LeftPanelContent(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const touchControlsEnabled = false;

    const controllerState = {};

    const debug = useStore(state => state.debug);
    const sidebar = useStore(state => state.sidebar);
    const toggleSidebar = useStore(state => state.toggleSidebar);
    const toggleDarkMode = useStore(state => state.toggleDarkMode);
    const setShowSettingsModal = useStore(state => state.setShowSettingsModal);
    const reloadScene = useStore(state => state.reloadScene);

    const {
        score
    } = useGameStore(state => ({
        score: state.score,
    }));

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap mb-3">

                        <GameMenuPrimaryButtonGroup
                            useStore={useStore}
                            type="GameMenu"
                        />

                    </div>

                    <div className='flex-header'>
                        <div>Server: {server || "Local"}</div>
                        <div>Players: {1}</div>
                    </div>

                </div>
            </div>

            {/* Touch Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>

            {/* Debug Controls */}
            {debug &&
                <DebugPanel />
            }

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {/* {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>} */}

                </div>
            }

        </div>
    )

}