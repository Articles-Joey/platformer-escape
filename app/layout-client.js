"use client";

import { Suspense } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import GlobalBody from "@articles-media/articles-dev-box/GlobalBody";
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import ToontownModeHandler from "@articles-media/articles-dev-box/ToontownModeHandler";
import HotkeyHandler from "@articles-media/articles-dev-box/HotkeyHandler";
import GlobalClientModals from "@/components/UI/GlobalClientModals";
import { useStore } from "@/hooks/useStore";

export default function LayoutClient() {
    return (
        <>
            <GlobalBody />
            <DarkModeHandler useStore={useStore} />
            <ToontownModeHandler useStore={useStore} />
            <Suspense>
                <HotkeyHandler useStore={useStore} useHotkeys={useHotkeys} />
                <GlobalClientModals />
            </Suspense>
        </>
    );
}
