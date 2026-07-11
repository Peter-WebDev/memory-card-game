'use client';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GameResultWithCategory, getTopGameResults } from "../actions";
import { Button } from "../ui/button";
import CategoryPicker from "./CategoryPicker";
import GameBoard from "./GameBoard";
import LeaderBoard from "./LeaderBoard";

// Must match the API's DEFAULT_CATEGORY so the first load (and E2E) renders
// a board without requiring a category click.
const DEFAULT_CATEGORY = 'Food & Drink';

export default function MemoryGame() {
    const { data: results, isLoading, isError } = useQuery<GameResultWithCategory[]>({
        queryKey: ['topGameResults'],
        queryFn: getTopGameResults,
    });

    // Skapa en state för att trigga en omstart
    const [newGameTrigger, setNewGameTrigger] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const [isGameInProgress, setIsGameInProgress] = useState(false);

    const handleNewGame = () => {
        setNewGameTrigger(prev => prev + 1);
    };

    const handleSelectCategory = (name: string) => {
        setSelectedCategory(name);
        // Switching category fetches new assets and resets the board.
        setNewGameTrigger(prev => prev + 1);
    };

    return (
        <section className="grid place-items-center gap-4">
            <CategoryPicker
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                isGameInProgress={isGameInProgress}
            />
            <Button
                type="button"
                variant="primary"
                className="w-fit mx-auto mb-4"
                onClick={handleNewGame}
            >
                New Game
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                <GameBoard
                    onNewGame={newGameTrigger}
                    category={selectedCategory}
                    onProgressChange={setIsGameInProgress}
                />
                {isLoading && (
                    <div className="p-6 rounded-lg border">
                        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                        <p className="text-xl">Loading scores...</p>
                    </div>
                )}
                {isError && (
                    <div className="p-6 rounded-lg border">
                        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                        <p className="text-red-500 text-xl">Error loading leaderboard.</p>
                    </div>
                )}
                {results && (
                    <LeaderBoard results={results} isLoading={isLoading} isError={isError} />
                )}
            </div>
        </section>
    );
}