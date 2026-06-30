'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface Category {
  id: string;
  name: string;
}

const getCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  // True while a game is in progress, so switching prompts for confirmation.
  isGameInProgress: boolean;
}

export default function CategoryPicker({
  selectedCategory,
  onSelectCategory,
  isGameInProgress,
}: CategoryPickerProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Holds the category awaiting confirmation when a game is in progress.
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const handleClick = (name: string) => {
    if (name === selectedCategory) return;
    if (isGameInProgress) {
      setPendingCategory(name);
    } else {
      onSelectCategory(name);
    }
  };

  const confirmSwitch = () => {
    if (pendingCategory) {
      onSelectCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div data-cy="category-picker" className="flex flex-row flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          dataCy={`category-${category.name}`}
          variant={category.name === selectedCategory ? 'active' : 'primary'}
          onClick={() => handleClick(category.name)}
          aria-pressed={category.name === selectedCategory}
        >
          {category.name}
        </Button>
      ))}

      <Dialog open={pendingCategory !== null} onOpenChange={() => setPendingCategory(null)}>
        <DialogContent data-cy="category-switch-modal">
          <DialogHeader>
            <DialogTitle>Switch category?</DialogTitle>
            <DialogDescription>
              You have a game in progress. Switching to{' '}
              <strong>{pendingCategory}</strong> will start a new game and
              discard your current progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 justify-end mt-4">
            <Button
              dataCy="category-switch-cancel"
              variant="secondary"
              onClick={() => setPendingCategory(null)}
            >
              Cancel
            </Button>
            <Button
              dataCy="category-switch-confirm"
              variant="primary"
              onClick={confirmSwitch}
            >
              Switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
