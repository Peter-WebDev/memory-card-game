'use client';
import type { Asset } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTime } from '@/lib/utils';
import Card from './Card';
import GameResultModal from './GameResultModal';
interface GameCard {
    id: number;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface GameBoardProps {
    onNewGame: number;
}

const shuffleArray = (array: Asset[]): Asset[] => {
    // Fisher-Yates shuffle algorithm (better than sort + random)
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};


// Function to fetch assets from API
const getAssets = async (): Promise<Asset[]> => {
    const response = await fetch('/api/assets');
    if (!response.ok) {
        throw new Error('Failed to fetch assets');
    }
    return response.json();
};

export default function GameBoard({ onNewGame }: GameBoardProps) {
    const { data: assets, isLoading, isError } = useQuery({
        queryKey: ['gameAssets'],
        queryFn: getAssets,
    });

    const [cards, setCards] = useState<GameCard[]>([]);
    const [attempts, setAttempts] = useState(0);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetGame = useCallback(() => {
        if (!assets || assets.length === 0) return;

        const selectedAssets = shuffleArray(assets).slice(0, 8);
        const gameCards: GameCard[] = shuffleArray([...selectedAssets, ...selectedAssets]).map((asset, index) => ({
            id: index,
            imageUrl: asset.imageUrl,
            isFlipped: false,
            isMatched: false,
        }));

        setCards(gameCards);
        setAttempts(0);
        setFlippedCards([]);
        setIsGameFinished(false);
        setTime(0);
        setIsTimerRunning(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [assets]);

    useEffect(() => {
        if (assets && assets.length > 0) {
            resetGame();
        }
    }, [assets, resetGame]);

    useEffect(() => {
        if (onNewGame > 0) {
            resetGame();
        }
    }, [onNewGame, resetGame]);

    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }

        if (isGameFinished && timerRef.current) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerRunning, isGameFinished]);


    const handleCardClick = (cardId: number) => {
        // Don't allow clicking if card is already flipped or matched
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        // Start the timer when the first card is flipped
        if (!isTimerRunning && attempts === 0 && flippedCards.length === 0) {
            setIsTimerRunning(true);
        }

        // Don't allow more than 2 cards to be flipped at once
        if (flippedCards.length >= 2) return;

        // Turn up the clicked card instantly
        setCards(prevCards =>
            prevCards.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c))
        );

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // If second card is flipped
        if (newFlippedCards.length === 2) {
            setAttempts(prev => prev + 1);

            const [firstCardId, secondCardId] = newFlippedCards;
            const firstCard = cards.find(c => c.id === firstCardId);
            const secondCard = cards.find(c => c.id === secondCardId);

            if (firstCard && secondCard && firstCard.imageUrl === secondCard.imageUrl) {
                // Match found - mark cards as matched
                setTimeout(() => {
                    setCards(prevCards => {
                        const nextCards = prevCards.map(c =>
                            c.id === firstCardId || c.id === secondCardId
                                ? { ...c, isMatched: true, isFlipped: true }
                                : c
                        );
                        if (nextCards.every(c => c.isMatched)) {
                            setIsGameFinished(true);
                        }
                        return nextCards;
                    });
                    setFlippedCards([]);
                });

            } else {
                // No match - flip back cards
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(c =>
                            c.id === firstCardId || c.id === secondCardId
                                ? { ...c, isFlipped: false }
                                : c
                        )
                    );
                    setFlippedCards([]);
                }, 1500);
            }
        };
    };

    if (isLoading) {
        // Skapa 16 skeleton cards
        const skeletonCards = Array.from({ length: 16 }, (_, index) => (
            <div
                key={`skeleton-${index}`}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gray-500 flex justify-center items-center"
            >
                <div className="w-6 h-6 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ));

        return (
            <div className="flex flex-col items-center lg:col-span-2">
                <div data-cy="game-board" className="grid grid-cols-4 gap-4">
                    {skeletonCards}
                </div>
                <div className="flex flex-row flex-wrap gap-4 justify-center items-center mt-4">
                    <div className="mt-4 text-lg font-medium">
                        Attempts: <span data-cy="attempts" className="ml-2">0</span>
                    </div>
                    <div className="mt-4 text-lg font-medium">
                        Time: <span data-cy="time" className="ml-2">00:00</span>
                    </div>
                </div>
            </div>
        );
    }
    if (isError) return <h2 className='text-3xl text-center mt-4'>Error loading game assets.</h2>;
    if (!assets || assets.length === 0) return <h2 className='text-3xl text-center mt-4'>No assets available.</h2>;

    const categoryId = assets[0]?.categoryId || '';

    return (
        <div className="flex flex-col items-center lg:col-span-2">
            <div data-cy="game-board" className="grid grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        data-cy={`card-${index}`}
                        data-asset-url={card.imageUrl}
                        imageUrl={card.imageUrl}
                        isFlipped={card.isFlipped}
                        isMatched={card.isMatched}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center mt-4">
                <div className="mt-4 text-lg font-medium">
                    Attempts: <span data-cy="attempts" className="ml-2">{attempts}</span>
                </div>
                <div className="mt-4 text-lg font-medium self-end">
                    Time: <span data-cy="time" className="ml-2">{formatTime(time)}</span>
                </div>
            </div>
            <GameResultModal
                isOpen={isGameFinished}
                onClose={() => setIsGameFinished(false)}
                dataCy={'win-modal'}
                categoryId={categoryId}
                attempts={attempts}
                time={time}
            />
        </div>
    );
}