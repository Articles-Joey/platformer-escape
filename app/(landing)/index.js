"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PaletteIcon from "@mui/icons-material/Palette";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GamepadKeyboard, PieMenu } from "@articles-media/articles-gamepad-helper";
import useUserDetails from "@articles-media/articles-dev-box/useUserDetails";
import useUserToken from "@articles-media/articles-dev-box/useUserToken";
import NicknameInput from "@articles-media/articles-dev-box/NicknameInput";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import SessionButton from "@articles-media/articles-dev-box/SessionButton";
import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";

const GameScoreboard = dynamic(() => import("@articles-media/articles-dev-box/GameScoreboard"), { ssr: false });
const Ad = dynamic(() => import("@articles-media/articles-dev-box/Ad"), { ssr: false });
const ReturnToLauncherButton = dynamic(() => import("@articles-media/articles-dev-box/ReturnToLauncherButton"), { ssr: false });

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const toontownMode = useStore((state) => state.toontownMode);
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const { data: userToken } = useUserToken(process.env.NEXT_PUBLIC_GAME_PORT || "3040");
    const { data: userDetails, isLoading: userDetailsLoading } = useUserDetails({ token: userToken });

    const pieOptions = [
        { label: "Settings", Icon: SettingsIcon, callback: () => useStore.getState().setShowSettingsModal(true) },
        { label: "Go Back", Icon: ArrowBackIcon, callback: () => window.history.back() },
        { label: "Credits", Icon: InfoIcon, callback: () => useStore.getState().setShowCreditsModal(true) },
        { label: "Info", Icon: InfoIcon, callback: () => useStore.getState().setShowInfoModal(true) },
        { label: "Game Launcher", Icon: SportsEsportsIcon, callback: () => { window.location.href = "https://games.articles.media"; } },
        { label: `${darkMode ? "Light" : "Dark"} Mode`, Icon: PaletteIcon, callback: () => useStore.getState().toggleDarkMode() },
    ];

    return (
        <Box
            className="platformer-escape-landing-page"
            sx={{
                position: "relative",
                isolation: "isolate",
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
                "& .server": { p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center" },
                "& .ad-wrap": {
                    mt: "1rem",
                    "@media (min-width: 992px)": { mt: 0, display: "block", position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" },
                },
            }}
        >
            <Suspense>
                <Box data-hide-in-screenshot-mode="true">
                    <GamepadKeyboard
                        disableToggle
                        active={nicknameKeyboard}
                        onFinish={(text) => {
                            useStore.getState().setNickname(text);
                            useStore.getState().setNicknameKeyboard(false);
                        }}
                        onCancel={() => useStore.getState().setNicknameKeyboard(false)}
                    />
                    <PieMenu
                        options={pieOptions.map(({ label, Icon, callback }) => ({
                            label: <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}><Icon fontSize="small" />{label}</Box>,
                            callback,
                        }))}
                        onFinish={(event) => event.callback?.()}
                    />
                </Box>
            </Suspense>
            <Box className="background-wrap" sx={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, "& img": { filter: "blur(2px)" } }}>
                {toontownMode ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_CDN}games/Platformer Escape/platformer-escape-thumbnail.webp`}
                        alt=""
                        fill
                        style={{ objectFit: "cover", objectPosition: "center", filter: "blur(10px)" }}
                    />
                ) : (
                    <Box component="img" src="/img/preview.webp" alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "blur(3px) !important", transform: "scale(1.05)" }} />
                )}
            </Box>
            <Box
                sx={{
                    width: "100%",
                    px: "0.75rem",
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    alignItems: "center",
                    "@media (min-width: 576px)": { maxWidth: "540px" },
                    "@media (min-width: 768px)": { maxWidth: "720px" },
                    "@media (min-width: 992px)": { maxWidth: "960px", flexDirection: "row" },
                    "@media (min-width: 1200px)": { maxWidth: "1140px" },
                    "@media (min-width: 1400px)": { maxWidth: "1320px" },
                }}
            >
                <Box sx={{ width: "20rem", maxWidth: "100%" }}>
                    <Box sx={{ position: "relative", mb: "1rem" }}>
                        <Box component="img" src={toontownMode ? "/img/toontown-icon.webp" : "/img/icon.webp"} alt="" width={200} sx={{ display: "block", mx: "auto", mb: 0, objectFit: "cover" }} />
                        <Typography
                            component="h1"
                            sx={{ mt: "-1rem", mb: "0.25rem", textAlign: "center", color: "#e7b826", fontSize: "4rem", lineHeight: 1.2, fontWeight: 500, WebkitTextStroke: "1px #000", textShadow: "2px 2px 0 #e7b826, -2px 2px 0 #e7b826, 2px -2px 0 #000, -2px -2px 0 #000" }}
                        >
                            Platformer Escape
                        </Typography>
                    </Box>
                    <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider", mb: "1rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: 1, borderColor: "divider" }}>
                            <NicknameInput useStore={useStore} />
                        </Box>
                        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            <ArticlesButton component={Link} href="/play" sx={{ width: "100%", my: "1rem" }} small startIcon={<PlayArrowIcon />}>
                                Play Single Player
                            </ArticlesButton>
                        </CardContent>
                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", p: 1, borderTop: 1, borderColor: "divider" }}>
                            <GameMenuPrimaryButtonGroup useStore={useStore} type="Landing" useRouter={useRouter} />
                        </Box>
                    </Card>
                    <SessionButton port={process.env.NEXT_PUBLIC_GAME_PORT} friendsButton />
                    <ReturnToLauncherButton />
                </Box>
                <GameScoreboard game={process.env.NEXT_PUBLIC_GAME_NAME} style="Default" darkMode={Boolean(darkMode)} />
                <Ad
                    style="Default"
                    section="Games"
                    section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                    darkMode={Boolean(darkMode)}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />
            </Box>
        </Box>
    );
}
