import { formatTime } from "@/lib/utils";
import { GameResultWithCategory } from "../actions";

interface LeaderBoardProps {
    results: GameResultWithCategory[] | undefined;
    isLoading: boolean;
    isError: boolean;
}

export default function LeaderBoard({ results, isLoading, isError }: LeaderBoardProps) {

    return (
        <div data-cy="leaderboard" className="p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            {isLoading ? (
                <p className="text-center">Laddar...</p>
            ) : isError ? (
                <p className="text-center">Något gick fel</p>
            ) : results?.length === 0 ? (
                <p className="text-center">Inga resultat ännu</p>
            ) : (
                <div className="space-y-2">
                    {results?.map((result, index) => (
                        <div
                            key={result.id}
                            data-cy="leaderboard-item"
                            className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                            <div className="flex justify-between gap-2">
                                <span className="ml-2">#{index + 1}</span>
                                <span data-cy="leaderboard-name" className="font-medium">
                                    {result.name}
                                </span>
                            </div>
                            <div className="text-right text-sm">
                                <div data-cy="leaderboard-time">
                                    Time: {formatTime(result.time)}
                                </div>
                                <div data-cy="leaderboard-attempts" className="">
                                    Attempts: {result.attempts}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}