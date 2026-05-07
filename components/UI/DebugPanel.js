import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import ArticlesButton from "./Button";

export default function DebugPanel() {

    const reloadScene = useStore((state) => state.reloadScene);

    const score = useGameStore((state) => state.score);
    const setScore = useGameStore((state) => state.setScore);

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="small text-muted">Debug Controls</div>

                <div className="small border p-2">
                    <div>Score: {score}</div>
                </div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => reloadScene()}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => reloadScene()}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                </div>

            </div>
        </div>
    )

}