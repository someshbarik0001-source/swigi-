import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { User } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';
import { Search, Users, Shield } from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getAllUsers().then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<User>[] = [
    {
      header: 'Customer Info',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            }
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Role',
      cell: (row) => (
        <Badge variant={row.role === 'admin' ? 'warning' : 'primary'} size="sm">
          {row.role === 'admin' ? 'Administrator' : 'Customer'}
        </Badge>
      ),
    },
    {
      header: 'Saved Addresses',
      cell: (row) => <span className="font-semibold">{row.savedAddresses?.length || 0} locations</span>,
    },
    {
      header: 'Member Since',
      cell: (row) => <span className="text-slate-400">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          User Database
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          Registered Users & Diners
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          View member accounts, roles, verified addresses, and customer profiles.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or email..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:block">
          Total Users: {filtered.length}
        </span>
      </div>

      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        isLoading={loading}
        emptyMessage="No users found."
      />
    </div>
  );
};

