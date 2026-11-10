import React, { useState, useEffect } from 'react';
import { foodService } from '../../services/foodService';
import { mockRestaurants } from '../../data/mockRestaurants';
import { mockCategories } from '../../data/mockCategories';
import { FoodItem } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Table, Column } from '../../components/common/Table';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Search, Utensils, Flame } from 'lucide-react';

export const AdminFoodManagement: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(140);
  const [originalPrice, setOriginalPrice] = useState(160);
  const [restaurantId, setRestaurantId] = useState(mockRestaurants[0].id);
  const [categoryId, setCategoryId] = useState(mockCategories[0].id);
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [calories, setCalories] = useState(650);

  const { success, error } = useToast();

  const loadFoods = () => {
    setLoading(true);
    foodService.getFoods().then((res) => {
      setFoods(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setName('');
    setDescription('Fresh campus dish made with fresh ingredients and authentic Indian spices.');
    setPrice(140);
    setOriginalPrice(160);
    setRestaurantId(mockRestaurants[0].id);
    setCategoryId(mockCategories[0].id);
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setIsVeg(true);
    setIsBestseller(true);
    setCalories(550);
    setIsModalOpen(true);
  };

  const openEditModal = (f: FoodItem) => {
    setEditingFood(f);
    setName(f.name);
    setDescription(f.description);
    setPrice(f.price);
    setOriginalPrice(f.originalPrice || f.price);
    setRestaurantId(f.restaurantId);
    setCategoryId(f.categoryId);
    setImage(f.image);
    setIsVeg(f.isVeg);
    setIsBestseller(!!f.isBestseller);
    setCalories(f.calories || 600);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rest = mockRestaurants.find((r) => r.id === restaurantId) || mockRestaurants[0];
    const cat = mockCategories.find((c) => c.id === categoryId) || mockCategories[0];

    try {
      if (editingFood) {
        await foodService.updateFood(editingFood.id, {
          name,
          description,
          price,
          originalPrice,
          restaurantId: rest.id,
          restaurantName: rest.name,
          categoryId: cat.id,
          categoryName: cat.name,
          image,
          isVeg,
          isBestseller,
          calories,
        });
        success(`"${name}" updated successfully!`);
      } else {
        await foodService.createFood({
          name,
          description,
          price,
          originalPrice,
          restaurantId: rest.id,
          restaurantName: rest.name,
          categoryId: cat.id,
          categoryName: cat.name,
          image,
          isVeg,
          isBestseller,
          calories,
          rating: 4.8,
          reviewsCount: 1,
          inStock: true,
        });
        success(`New dish "${name}" added to menu!`);
      }

      setIsModalOpen(false);
      loadFoods();
    } catch (err: any) {
      error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, foodName: string) => {
    if (!window.confirm(`Delete "${foodName}" from catalog?`)) return;
    await foodService.deleteFood(id);
    success(`"${foodName}" deleted`);
    loadFoods();
  };

  const filtered = foods.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || f.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const columns: Column<FoodItem>[] = [
    {
      header: 'Dish Item',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Badge variant={row.isVeg ? 'veg' : 'non-veg'} size="sm">
                {row.isVeg ? 'Veg' : 'Non-Veg'}
              </Badge>
              {row.isBestseller && (
                <Badge variant="warning" size="sm">
                  ★ Bestseller
                </Badge>
              )}
            </div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.restaurantName}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <Badge variant="neutral" size="sm">{row.categoryName}</Badge>,
    },
    {
      header: 'Price',
      cell: (row) => (
        <div className="font-extrabold text-slate-900 dark:text-white">
          {formatCurrency(row.price)}
          {row.originalPrice && (
            <span className="text-xs text-slate-400 line-through block font-normal">
              {formatCurrency(row.originalPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Calories & Reviews',
      cell: (row) => (
        <div className="text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {row.calories} kcal
          </span>
          <span className="text-[11px] text-slate-400">★ {row.rating} ({row.reviewsCount})</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Food"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Food"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Catalog Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Menu Items & Dishes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, update pricing, dietary tags, and photos across restaurant menus.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Menu Item
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes or restaurants..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        isLoading={loading}
        emptyMessage="No menu items found."
      />

      {/* ADD / EDIT FOOD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Edit Menu Item' : 'Add New Menu Item'}
        description="Provide ingredients, pricing, restaurant owner, and presentation photo."
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Sourdough Burrata Pizza"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assign to Restaurant
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              >
                {mockRestaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              >
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <Input
              label="Original Price (₹)"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
            />
            <Input
              label="Calories (kcal)"
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
            />
          </div>

          <Input
            label="Food Photo Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span>Is Pure Vegetarian</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>Tag as Bestseller ★</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingFood ? 'Save Changes' : 'Create Dish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

