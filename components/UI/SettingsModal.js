"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";

const controls = [
    { action: "Move Up", defaultKeyboardKey: "W" },
    { action: "Move Down", defaultKeyboardKey: "S" },
    { action: "Move Left", defaultKeyboardKey: "A" },
    { action: "Move Right", defaultKeyboardKey: "D" },
    { action: "Drop Insect", defaultKeyboardKey: "Space" },
    { action: "Stop Powerup", defaultKeyboardKey: "ArrowDown" },
    { emote: true, action: "Stick out Tongue", defaultKeyboardKey: "ArrowDown" },
    { emote: true, action: "Rotate Left", defaultKeyboardKey: "ArrowLeft" },
    { emote: true, action: "Rotate Right", defaultKeyboardKey: "ArrowRight" },
];

export default function SettingsModal({ show = true, setShow }) {
    const [tab, setTab] = useState("Controls");

    return (
        <ArticlesModal
            title="Game Settings"
            show={show}
            setShow={setShow}
            centered={false}
            contentSx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                    <ArticlesButton variant="outline-dark" onClick={() => setOpen(false)}>Close</ArticlesButton>
                    <ArticlesButton variant="outline-danger" onClick={() => setOpen(false)}>Reset</ArticlesButton>
                </Box>
            )}
        >
            <Box sx={{ p: "0.5rem" }}>
                {["Controls", "Audio", "Chat"].map((item) => (
                    <ArticlesButton key={item} active={tab === item} onClick={() => setTab(item)}>{item}</ArticlesButton>
                ))}
            </Box>
            <Divider />
            <Box sx={{ p: "0.5rem" }}>
                {tab === "Controls" && controls.map((control) => (
                    <Box key={control.action} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider", pb: "0.25rem", mb: "0.25rem" }}>
                        <Box>
                            <Box>{control.action}</Box>
                            {control.emote && <Chip label="Emote" size="small" />}
                        </Box>
                        <Box>
                            <Chip label={control.defaultKeyboardKey} size="small" sx={{ mr: "0.25rem" }} />
                            <ArticlesButton small>Change Key</ArticlesButton>
                        </Box>
                    </Box>
                ))}
                {tab === "Audio" && (
                    <>
                        <Typography id="game-volume-label">Game Volume</Typography>
                        <Slider aria-labelledby="game-volume-label" defaultValue={50} />
                        <Typography id="music-volume-label">Music Volume</Typography>
                        <Slider aria-labelledby="music-volume-label" defaultValue={50} />
                    </>
                )}
                {tab === "Chat" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {["Game chat panel", "Censor chat", "Game chat speech bubbles"].map((label) => (
                            <FormControlLabel key={label} control={<Switch />} label={label} />
                        ))}
                    </Box>
                )}
            </Box>
        </ArticlesModal>
    );
}
