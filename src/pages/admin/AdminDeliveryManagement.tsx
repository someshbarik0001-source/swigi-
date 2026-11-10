import React, { useState } from 'react';
import { DeliveryPartner } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Bike, Star, Phone, Search, MapPin } from 'lucide-react';

const mockRiders: DeliveryPartner[] = [
  {
    id: 'rider-1',
    name: 'Naresh Kumar',
    phone: '+91 97004 22331',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    vehicleNumber: 'AP-07-EB-4120 (Campus E-Bike)',
    rating: 4.9,
    currentLocationName: 'Ganga & Krishna Hostels Zone',
    estimatedMinutes: 6,
  },
  {
    id: 'rider-2',
    name: 'Ravi Teja',
    phone: '+91 98492 77112',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    vehicleNumber: 'AP-07-CB-9081 (Campus Scooter)',
    rating: 5.0,
    currentLocationName: 'Yamuna & Kaveri Girls Hostels',
    estimatedMinutes: 8,
  },
  {
    id: 'rider-3',
    name: 'Sai Krishna',
    phone: '+91 94409 66123',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    vehicleNumber: 'AP-07-EV-1029 (Electric Bicycle)',
    rating: 4.95,
    currentLocationName: 'Academic Block 2 & SAC',
    estimatedMinutes: 10,
  },
  {
    id: 'rider-4',
    name: 'Suresh Babu',
    phone: '+91 91211 44556',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    vehicleNumber: 'AP-07-BK-3392 (Campus Shuttle)',
    rating: 4.8,
    currentLocationName: 'Gate 1 & Neerukonda Hub',
    estimatedMinutes: 5,
  },
];

export const AdminDeliveryManagement: React.FC = () => {
  const [riders] = useState<DeliveryPartner[]>(mockRiders);
  const [search, setSearch] = useState('');

  const filtered = riders.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.currentLocationName.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<DeliveryPartner>[] = [
    {
      header: 'Courier Partner',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.photo} alt={row.name} className="w-10 h-10 rounded-full object-cover border" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Vehicle & Plate',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Bike className="w-3.5 h-3.5 text-orange-500" />
          <span>{row.vehicleNumber}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Dispatch Zone',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.currentLocationName}</span>
        </div>
      ),
    },
    {
      header: 'Rating Score',
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{row.rating} ★</span>
        </div>
      ),
    },
    {
      header: 'Fleet Status',
      cell: () => (
        <Badge variant="success" size="sm">
          Active On-Duty
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Fleet Operations
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          Delivery Couriers & Riders
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor real-time courier availability, rating performance, and zone distribution.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search riders by name, plate, zone..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:block">
          Active Fleet: {filtered.length} Couriers
        </span>
      </div>

      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
};

