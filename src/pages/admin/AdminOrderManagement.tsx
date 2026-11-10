import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Pagination } from '../../components/common/Pagination';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Search, SlidersHorizontal, ArrowUpDown, Eye } from 'lucide-react';

export const AdminOrderManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.userName.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurantName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order Details',
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-orange-500 block">
            #{row.orderNumber}
          </span>
          <span className="text-[11px] text-slate-400">
            {formatDateTime(row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {row.userName}
          </span>
          <span className="text-[11px] text-slate-400">{row.userPhone}</span>
        </div>
      ),
    },
    {
      header: 'Restaurant & Items',
      cell: (row) => (
        <div className="max-w-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
            {row.restaurantName}
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">
            {row.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (row) => (
        <div className="font-extrabold text-slate-900 dark:text-white">
          {formatCurrency(row.total)}
          <span className="block text-[10px] text-slate-400 font-normal uppercase">
            {row.paymentMethod} • {row.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      header: 'Status & Update',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value as OrderStatus)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="on_the_way">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
    {
      header: 'Action',
      className: 'text-right',
      cell: (row) => (
        <Link to={`/track/${row.id}`}>
          <Button size="sm" variant="ghost">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Track
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Order Operations
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          Order Fulfillment Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor incoming customer tickets, update kitchen prep stages, and track courier dispatches.
        </p>
      </div>

      {/* Toolbar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search order #, customer, restaurant..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl border border-transparent outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="on_the_way">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <Table
        columns={columns}
        data={paginatedOrders}
        keyExtractor={(row) => row.id}
        emptyMessage="No orders found matching your search criteria."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

