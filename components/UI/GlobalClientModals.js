"use client";

import DevBoxGlobalClientModals from "@articles-media/articles-dev-box/GlobalClientModals";
import packageInfo from "@/package.json";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

export default function GlobalClientModals() {
    return (
        <DevBoxGlobalClientModals
            useStore={useStore}
            useAudioStore={useAudioStore}
            useTouchControlsStore={useTouchControlsStore}
            useSocketStore={useSocketStore}
            packageInfo={{ ...packageInfo, description: "R3F web platformer game." }}
            settingsModalConfig={{
                tabs: {
                    Graphics: { darkMode: true, landingAnimation: true },
                    Audio: {
                        sliders: Object.keys(useAudioStore.getState().audioSettings)
                            .filter((key) => key !== "enabled")
                            .map((key) => ({
                                key,
                                label: key.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                            })),
                    },
                    Controls: { touchControls: true },
                    Multiplayer: { serverUrl: true },
                    Other: { toontownMode: true },
                },
            }}
            infoModalConfig={{ previewImage: "/img/preview.webp" }}
        />
    );
}
