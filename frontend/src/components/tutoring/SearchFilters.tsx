
import React from 'react';
import { Search, Filter, ArrowUpAZ, ArrowDownAZ, DollarSign, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { TutoringLocationType } from '@/types/tutoring';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
  locationFilter: TutoringLocationType | 'all';
  setLocationFilter: (value: TutoringLocationType | 'all') => void;
  priceSort: 'asc' | 'desc' | 'none';
  setPriceSort: (value: 'asc' | 'desc' | 'none') => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  uniqueSubjects: string[];
  resetFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  locationFilter,
  setLocationFilter,
  priceSort,
  setPriceSort,
  priceRange,
  setPriceRange,
  uniqueSubjects,
  resetFilters
}) => {
  // Convert active filters to badges for mobile view
  const activeFilters = [];
  
  if (subjectFilter !== 'all') {
    activeFilters.push({
      label: `Materie: ${subjectFilter}`,
      clear: () => setSubjectFilter('all')
    });
  }
  
  if (locationFilter !== 'all') {
    const locationLabels = {
      online: 'Online',
      offline: 'În persoană',
      both: 'Ambele'
    };
    activeFilters.push({
      label: `Locație: ${locationLabels[locationFilter as keyof typeof locationLabels]}`,
      clear: () => setLocationFilter('all')
    });
  }
  
  if (priceSort !== 'none') {
    activeFilters.push({
      label: `Preț: ${priceSort === 'asc' ? 'Crescător' : 'Descrescător'}`,
      clear: () => setPriceSort('none')
    });
  }
  
  if (priceRange[0] > 0 || priceRange[1] < 200) {
    activeFilters.push({
      label: `Preț: ${priceRange[0]}-${priceRange[1]} RON`,
      clear: () => setPriceRange([0, 200])
    });
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input - Always visible */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Caută după subiect sau profesor..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Materie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate materiile</SelectItem>
              {uniqueSubjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={locationFilter} onValueChange={value => setLocationFilter(value as TutoringLocationType | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Locație" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tipurile</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">În persoană</SelectItem>
              <SelectItem value="both">Ambele</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Button + Desktop Sort */}
        <div className="flex gap-2">
          {/* Mobile Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden flex-1">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Filter className="h-4 w-4" />
                Filtrează
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtre</SheetTitle>
                <SheetDescription>
                  Ajustează filtrele pentru a găsi sesiunea potrivită
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Materie</label>
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate materiile</SelectItem>
                      {uniqueSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tip de sesiune</label>
                  <Select value={locationFilter} onValueChange={value => setLocationFilter(value as TutoringLocationType | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege tipul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate tipurile</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">În persoană</SelectItem>
                      <SelectItem value="both">Ambele</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sortare după preț</label>
                  <Select value={priceSort} onValueChange={value => setPriceSort(value as 'asc' | 'desc' | 'none')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sortează" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Fără sortare</SelectItem>
                      <SelectItem value="asc">Preț crescător</SelectItem>
                      <SelectItem value="desc">Preț descrescător</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Interval de preț</label>
                    <span className="text-sm text-muted-foreground">
                      {priceRange[0]} - {priceRange[1]} RON
                    </span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mt-6"
                  />
                </div>
              </div>
              
              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                  Resetează
                </Button>
                <Button className="w-full sm:w-auto bg-[#13361C] hover:bg-[#13361C]/90">
                  Aplică filtrele
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Sort Dropdown */}
          <div className="hidden md:block w-full">
            <Select 
              value={priceSort} 
              onValueChange={value => setPriceSort(value as 'asc' | 'desc' | 'none')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sortează" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără sortare</SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpAZ className="h-4 w-4" />
                    <span>Preț crescător</span>
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Preț descrescător</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort on Mobile */}
          <div className="md:hidden flex-1">
            <Select 
              value={priceSort} 
              onValueChange={value => setPriceSort(value as 'asc' | 'desc' | 'none')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sortează" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără sortare</SelectItem>
                <SelectItem value="asc">Preț crescător</SelectItem>
                <SelectItem value="desc">Preț descrescător</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Desktop Price Range Slider */}
      <div className="hidden md:block space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Interval de preț
          </label>
          <span className="text-sm text-muted-foreground">
            {priceRange[0]} - {priceRange[1]} RON
          </span>
        </div>
        <Slider
          defaultValue={priceRange}
          min={0}
          max={200}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mt-2"
        />
      </div>
      
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="flex items-center gap-1 py-1 pr-1 pl-3"
            >
              {filter.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full hover:bg-gray-200"
                onClick={filter.clear}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground text-xs"
            onClick={resetFilters}
          >
            Resetează toate
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
