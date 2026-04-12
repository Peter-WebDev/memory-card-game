'use client';
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useTransition } from "react";
import { addGameResult } from "../actions";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
interface GameResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    'dataCy': string;
    time: number;
    attempts: number;
    categoryId: string;
}

export default function GameResultModal({ isOpen, onClose, time, attempts, categoryId, dataCy }: GameResultModalProps) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        startTransition(() => {
            addGameResult(formData).then((result) => {
                console.log(result);
                if (result.success) {
                    queryClient.invalidateQueries({ queryKey: ['topGameResults'] });
                    onClose();
                }
            });
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent data-cy={dataCy}>
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription>You won the game! Enter your name to save your score</DialogDescription>
                    </DialogHeader>
                    <div data-cy="score-display" className="py-4">
                        <p>Time: <span data-cy="time-final">{time}</span></p>
                        <p>Flips: <span data-cy="attempts-final">{attempts}</span></p>
                    </div>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <input type="hidden" name="time" value={time} />
                        <input type="hidden" name="attempts" value={attempts} />
                        <input type="hidden" name="categoryId" value={categoryId} />
                        <div className="grid gap-4 py-4">
                            <Label htmlFor="name">Name</Label>
                            <input data-cy="player-name-input" required type="text" id="name" name="name" className="block w-full rounded-md border-0 p-4 shadow-sm ring-1 ring-inset" />
                        </div>
                        <Button dataCy={'submit-button'} type="submit" variant="primary" disabled={isPending}>
                            {isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}