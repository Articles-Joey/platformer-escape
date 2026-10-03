"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import DebugPanel from "./DebugPanel";

export default function LeftPanelContent() {
    const server = useSearchParams().get("server");
    const debug = useStore((state) => state.debug);
    const touchControlsEnabled = useTouchControlsStore((state) => state.enabled);
    const setTouchControlsEnabled = useTouchControlsStore((state) => state.setEnabled);

    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: "1rem" }}>
                        <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>Server: {server || "Local"}</Box>
                        <Box>Players: {1}</Box>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Typography sx={{ fontSize: "0.875em", color: "text.secondary" }}>Touch Controls</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex" }}>
                            <ArticlesButton small sx={{ width: "50%" }} active={!touchControlsEnabled} onClick={() => setTouchControlsEnabled(false)} startIcon={<TouchAppIcon />}>
                                Off
                            </ArticlesButton>
                            <ArticlesButton small sx={{ width: "50%" }} active={touchControlsEnabled} onClick={() => setTouchControlsEnabled(true)} startIcon={<TouchAppIcon />}>
                                On
                            </ArticlesButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            {debug && <DebugPanel />}
        </Box>
    );
}
