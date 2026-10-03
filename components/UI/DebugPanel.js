"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ReplayIcon from "@mui/icons-material/Replay";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import ArticlesButton from "./Button";

export default function DebugPanel() {
    const reloadScene = useStore((state) => state.reloadScene);
    const score = useGameStore((state) => state.score);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Typography sx={{ fontSize: "0.875em", color: "text.secondary" }}>Debug Controls</Typography>
                <Box sx={{ fontSize: "0.875em", border: 1, borderColor: "divider", p: "0.5rem" }}>Score: {score}</Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex" }}>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={() => reloadScene()} startIcon={<ReplayIcon />}>
                            Reload Game
                        </ArticlesButton>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={() => reloadScene()} startIcon={<ReplayIcon />}>
                            Reset Camera
                        </ArticlesButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
