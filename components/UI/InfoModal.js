"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";

export default function InfoModal({ show = true, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            title="Game Info"
            show={show && showModal}
            setShow={(visible) => {
                setShow(visible);
                setShowModal(true);
            }}
            contentSx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <>
                    <Box />
                    <ArticlesButton
                        ref={(el) => { elementsRef.current[0] = el; }}
                        variant="outline-dark"
                        onClick={() => setOpen(false)}
                        startIcon={<Box component="img" src={B.src} className="controller-only" alt="" sx={{ width: 24 }} />}
                    >
                        Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{ position: "relative", aspectRatio: "16 / 9", "& img": { width: "100%", height: "100%", objectFit: "cover" } }}>
                <Box component="img" src="/img/preview.webp" alt="Platformer Escape preview" />
            </Box>
            <Box sx={{ p: "1rem" }}>R3F web platformer game.</Box>
        </ArticlesModal>
    );
}
