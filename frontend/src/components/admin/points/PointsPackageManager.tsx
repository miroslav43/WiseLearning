
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PointsPackage {
  id: string;
  name: string;
  points: number;
  price: number;
  isPopular?: boolean;
}

const PointsPackageManager: React.FC = () => {
  const [packages, setPackages] = useState<PointsPackage[]>([
    { id: '1', name: 'Starter', points: 100, price: 10 },
    { id: '2', name: 'Standard', points: 500, price: 45, isPopular: true },
    { id: '3', name: 'Premium', points: 1000, price: 80 }
  ]);
  
  const [currentPackage, setCurrentPackage] = useState<PointsPackage>({
    id: '',
    name: '',
    points: 0,
    price: 0
  });

  const handleEdit = (pkg: PointsPackage) => {
    setCurrentPackage(pkg);
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    toast.success('Package deleted successfully');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setCurrentPackage({
      ...currentPackage,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPackage.id) {
      // Update existing package
      setPackages(packages.map(p => 
        p.id === currentPackage.id ? currentPackage : p
      ));
      toast.success('Package updated successfully');
    } else {
      // Add new package
      const newPackage = {
        ...currentPackage,
        id: Date.now().toString()
      };
      setPackages([...packages, newPackage]);
      toast.success('Package created successfully');
    }
    
    // Reset form
    setCurrentPackage({
      id: '',
      name: '',
      points: 0,
      price: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Price (€)</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.points}</TableCell>
                <TableCell>€{pkg.price.toFixed(2)}</TableCell>
                <TableCell>{pkg.isPopular ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-4">
          {currentPackage.id ? 'Edit Package' : 'Add New Package'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                name="name"
                value={currentPackage.name}
                onChange={handleChange}
                placeholder="e.g., Starter Package"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Points Amount</Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={currentPackage.points || ''}
                onChange={handleChange}
                placeholder="e.g., 100"
                min={1}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={currentPackage.price || ''}
                onChange={handleChange}
                placeholder="e.g., 10.00"
                min={0}
                step={0.01}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <input
                id="isPopular"
                name="isPopular"
                type="checkbox"
                checked={currentPackage.isPopular || false}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="isPopular">Mark as Popular</Label>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setCurrentPackage({
                  id: '',
                  name: '',
                  points: 0,
                  price: 0
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {currentPackage.id ? 'Update' : 'Add'} Package
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointsPackageManager;
