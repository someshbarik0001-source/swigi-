import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Rohan Varma',
    email: 'rohan_varma@srmap.edu.in',
    phone: '+91 98480 91823',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    createdAt: '2024-01-15T10:00:00Z',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        street: 'Ganga Boys Hostel, Block 2, Room 412',
        city: 'SRM University AP, Neerukonda',
        state: 'Andhra Pradesh',
        zipCode: '522240',
        isDefault: true,
        landmark: 'Near Hostel Lift & Water Cooler',
      },
      {
        id: 'addr-2',
        label: 'Work',
        street: 'Student Activity Centre (SAC), Ground Floor Common Area',
        city: 'SRM AP Campus',
        state: 'Andhra Pradesh',
        zipCode: '522240',
        isDefault: false,
        landmark: 'Near Indoor Badminton Courts',
      },
    ],
    paymentMethods: [
      {
        id: 'pm-1',
        type: 'upi',
        title: 'Google Pay / PhonePe',
        details: 'rohan.srmap@oksbi',
        isDefault: true,
      },
      {
        id: 'pm-2',
        type: 'card',
        title: 'SBI Student RuPay Debit',
        details: '•••• 4192',
        isDefault: false,
      },
    ],
  },
  {
    id: 'user-admin',
    name: 'Dr. K. Srinivas (Campus Dining Ops)',
    email: 'dining_admin@srmap.edu.in',
    phone: '+91 94401 88990',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: '2023-11-01T08:00:00Z',
    savedAddresses: [
      {
        id: 'addr-admin-1',
        label: 'Work',
        street: 'Food Operations Dept, Administrative Block, 2nd Floor',
        city: 'SRM University AP, Amaravati',
        state: 'Andhra Pradesh',
        zipCode: '522240',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: 'pm-admin-1',
        type: 'card',
        title: 'Institutional HDFC Card',
        details: '•••• 8802',
        isDefault: true,
      },
    ],
  },
];
