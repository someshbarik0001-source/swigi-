import React, { useState } from 'react';
import { FoodItem, CartItemOptionChoice } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus } from 'lucide-react';

interface FoodOptionModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (food: FoodItem, selectedOptions: CartItemOptionChoice[], quantity: number) => void;
}

export const FoodOptionModal: React.FC<FoodOptionModalProps> = ({
  food,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, { name: string; price: number }>>({});
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  // Set default first choice for each option group if not chosen
  const activeChoices: CartItemOptionChoice[] = Object.entries(selectedChoices).map(
    ([groupName, choice]) => ({
      groupName,
      choiceName: choice.name,
      extraPrice: choice.price,
    })
  );

  const extraTotal = activeChoices.reduce((sum, c) => sum + c.extraPrice, 0);
  const unitPrice = food.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleSelectChoice = (groupName: string, choiceName: string, extraPrice: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [groupName]: { name: choiceName, price: extraPrice },
    }));
  };

  const handleConfirm = () => {
    onAddToCart(food, activeChoices, quantity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-5">
        {/* Header with image */}
        <div className="relative h-44 rounded-2xl overflow-hidden -mx-2 -mt-2">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={food.isVeg ? 'veg' : 'non-veg'} size="sm">
                {food.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </Badge>
              {food.isBestseller && (
                <Badge variant="warning" size="sm">
                  ★ Bestseller
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{food.name}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {food.description}
        </p>

        {/* Options Groups */}
        {food.options && food.options.length > 0 && (
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            {food.options.map((group) => {
              const currentSelected = selectedChoices[group.name]?.name || group.choices[0]?.name;

              return (
                <div key={group.name} className="pt-3 first:pt-0 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {group.name}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {group.choices.map((choice) => {
                      const isSelected = currentSelected === choice.name;
                      return (
                        <button
                          key={choice.name}
                          type="button"
                          onClick={() => handleSelectChoice(group.name, choice.name, choice.extraPrice)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{choice.name}</span>
                          <span className="text-xs opacity-80">
                            {choice.extraPrice > 0 ? `+${formatCurrency(choice.extraPrice)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quantity Controls & Add Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={handleConfirm} variant="primary" className="flex-1">
            Add to Cart • {formatCurrency(totalPrice)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

