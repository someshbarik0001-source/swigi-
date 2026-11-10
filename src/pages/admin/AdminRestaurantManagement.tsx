import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Table, Column } from '../../components/common/Table';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Search, Store, Star } from 'lucide-react';

export const AdminRestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [cuisines, setCuisines] = useState('');
  const [deliveryTime, setDeliveryTime] = useState(25);
  const [deliveryFee, setDeliveryFee] = useState(1.99);
  const [minOrder, setMinOrder] = useState(15);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const { success, error } = useToast();

  const loadRestaurants = () => {
    setLoading(true);
    restaurantService.getRestaurants().then((res) => {
      setRestaurants(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const openAddModal = () => {
    setEditingRestaurant(null);
    setName('');
    setCuisines('Biryani & Pulao, North Indian');
    setDeliveryTime(15);
    setDeliveryFee(20);
    setMinOrder(99);
    setAddress('Gate 1, SRM AP Campus Road, Neerukonda');
    setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80');
    setBannerImage('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Restaurant) => {
    setEditingRestaurant(r);
    setName(r.name);
    setCuisines(r.cuisines.join(', '));
    setDeliveryTime(r.deliveryTime);
    setDeliveryFee(r.deliveryFee);
    setMinOrder(r.minOrder);
    setAddress(r.address);
    setImage(r.image);
    setBannerImage(r.bannerImage);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cuisineArray = cuisines.split(',').map((c) => c.trim()).filter(Boolean);

    try {
      if (editingRestaurant) {
        await restaurantService.updateRestaurant(editingRestaurant.id, {
          name,
          cuisines: cuisineArray,
          deliveryTime,
          deliveryFee,
          minOrder,
          address,
          image,
          bannerImage,
        });
        success(`"${name}" updated successfully!`);
      } else {
        await restaurantService.createRestaurant({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          cuisines: cuisineArray,
          deliveryTime,
          deliveryFee,
          minOrder,
          address,
          phone: '+1 (555) 234-5678',
          priceRange: '$$',
          isFeatured: true,
          isPromoted: false,
          isOpen: true,
          tags: ['Popular'],
          distanceKm: 2.1,
          rating: 4.8,
          reviewsCount: 1,
          image,
          bannerImage,
        });
        success(`New restaurant "${name}" created!`);
      }
      setIsModalOpen(false);
      loadRestaurants();
    } catch (err: any) {
      error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, restaurantName: string) => {
    if (!window.confirm(`Are you sure you want to delete restaurant "${restaurantName}"?`)) return;
    await restaurantService.deleteRestaurant(id);
    success(`"${restaurantName}" deleted`);
    loadRestaurants();
  };

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisines.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<Restaurant>[] = [
    {
      header: 'Restaurant',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
            <span className="text-[11px] text-slate-400 line-clamp-1">{row.cuisines.join(', ')}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating & Deliveries',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-bold text-amber-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {row.rating} ({row.reviewsCount}+)
          </span>
          <span className="text-[11px] text-slate-400">{row.deliveryTime} mins avg</span>
        </div>
      ),
    },
    {
      header: 'Order Rules',
      cell: (row) => (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span>Fee: {row.deliveryFee === 0 ? 'FREE' : formatCurrency(row.deliveryFee)}</span>
          <span className="block text-slate-400">Min Order: {formatCurrency(row.minOrder)}</span>
        </div>
      ),
    },
    {
      header: 'Area Zone & Status',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">{row.areaZone || 'Campus'}</span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.menuCollectionStatus || 'Active'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isOpen ? 'success' : 'danger'} size="sm">
          {row.isOpen ? 'Active / Open' : 'Closed'}
        </Badge>
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
            title="Edit Restaurant"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Restaurant"
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
            Partner Network
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Restaurant Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Onboard new partner kitchens, adjust menus, and manage delivery radiuses.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Restaurant
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants by name or cuisine..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:block">
          Total: {filtered.length} Kitchens
        </span>
      </div>

      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        isLoading={loading}
        emptyMessage="No restaurants found."
      />

      {/* ADD / EDIT RESTAURANT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
        description="Enter the partner eatery details, photos, and delivery fee thresholds."
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Bella Napoli Pizzeria"
          />

          <Input
            label="Cuisines (comma separated)"
            value={cuisines}
            onChange={(e) => setCuisines(e.target.value)}
            required
            placeholder="Italian, Pizza, Fast Food"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Delivery Time (Mins)"
              type="number"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(Number(e.target.value))}
              required
            />
            <Input
              label="Hostel Delivery Fee (₹)"
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value))}
              required
            />
            <Input
              label="Min Order (₹)"
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="123 Flavor Street, Downtown"
          />

          <Input
            label="Card Thumbnail Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <Input
            label="Hero Banner Image URL"
            value={bannerImage}
            onChange={(e) => setBannerImage(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingRestaurant ? 'Save Changes' : 'Create Restaurant'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

