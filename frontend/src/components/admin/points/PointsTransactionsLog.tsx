
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';
import { PointsTransaction } from '@/types/user';
import { format } from 'date-fns';

// Mock data
const mockTransactions: PointsTransaction[] = [
  {
    id: 'tx1',
    userId: 'user1',
    amount: 500,
    type: 'purchase',
    description: 'Purchase of 500 points package',
    createdAt: new Date(2023, 4, 10)
  },
  {
    id: 'tx2',
    userId: 'user2',
    amount: -200,
    type: 'course_purchase',
    description: 'Purchased "Introduction to Mathematics" course with points',
    createdAt: new Date(2023, 4, 12)
  },
  {
    id: 'tx3',
    userId: 'user3',
    amount: 100,
    type: 'referral',
    description: 'Referral bonus for new user signup',
    createdAt: new Date(2023, 4, 15)
  },
  {
    id: 'tx4',
    userId: 'user1',
    amount: 75,
    type: 'achievement',
    description: 'Completed "Perfect Quiz" achievement',
    createdAt: new Date(2023, 4, 18)
  },
  {
    id: 'tx5',
    userId: 'user4',
    amount: 1000,
    type: 'purchase',
    description: 'Purchase of 1000 points package',
    createdAt: new Date(2023, 4, 20)
  }
];

const PointsTransactionsLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);

  // Filter transactions based on search term and filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !transactionType || transaction.type === transactionType;
    
    // Filter by date range
    let matchesDate = true;
    if (dateRange === 'today') {
      const today = new Date();
      matchesDate = transaction.createdAt.toDateString() === today.toDateString();
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = transaction.createdAt >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = transaction.createdAt >= monthAgo;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const exportTransactions = () => {
    // In a real application, this would generate a CSV or Excel file
    alert('Transactions export functionality would go here');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select onValueChange={setTransactionType} value={transactionType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All types</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="course_purchase">Course Purchase</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="achievement">Achievement</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={setDateRange} value={dateRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={exportTransactions} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.userId}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-medium ${getAmountColor(transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} points
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PointsTransactionsLog;
