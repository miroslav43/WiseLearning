
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Form schema for announcement creation/editing
const announcementFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  audience: z.enum(["all", "teachers", "students"], {
    required_error: "Please select an audience.",
  }),
  status: z.enum(["draft", "scheduled", "active"], {
    required_error: "Please select a status.",
  }),
  expiresAt: z.string().min(1, {
    message: "Expiration date is required.",
  }),
});

// Mock data for announcements
const mockAnnouncements = [
  {
    id: '1',
    title: 'New Courses Added',
    audience: 'all',
    status: 'active',
    createdAt: '10/05/2023',
    expiresAt: '10/06/2023'
  },
  {
    id: '2',
    title: 'Platform Maintenance',
    audience: 'all',
    status: 'scheduled',
    createdAt: '12/05/2023',
    expiresAt: '15/05/2023'
  },
  {
    id: '3',
    title: 'Important Update for Teachers',
    audience: 'teachers',
    status: 'active',
    createdAt: '05/05/2023',
    expiresAt: '20/05/2023'
  },
  {
    id: '4',
    title: 'Student Contest Announcement',
    audience: 'students',
    status: 'draft',
    createdAt: '08/05/2023',
    expiresAt: '30/05/2023'
  }
];

interface AnnouncementFormValues {
  title: string;
  content: string;
  audience: 'all' | 'teachers' | 'students';
  status: 'draft' | 'scheduled' | 'active';
  expiresAt: string;
}

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<(typeof mockAnnouncements)[0] | null>(null);
  const [viewContent, setViewContent] = useState<{ title: string, content: string } | null>(null);

  // Initialize the form
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      audience: "all",
      status: "draft",
      expiresAt: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (data: AnnouncementFormValues) => {
    if (selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => 
        prev.map(a => a.id === selectedAnnouncement.id ? {
          ...a,
          title: data.title,
          audience: data.audience,
          status: data.status,
          expiresAt: data.expiresAt
        } : a)
      );
      toast.success("Announcement updated successfully");
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Math.random().toString(36).substring(2, 9),
        title: data.title,
        audience: data.audience,
        status: data.status,
        createdAt: new Date().toLocaleDateString(),
        expiresAt: data.expiresAt
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast.success("Announcement created successfully");
    }
    form.reset();
    setOpen(false);
    setSelectedAnnouncement(null);
  };

  // Function to handle editing an announcement
  const handleEdit = (announcement: (typeof mockAnnouncements)[0]) => {
    setSelectedAnnouncement(announcement);
    form.reset({
      title: announcement.title,
      content: "", // This would come from the server in a real app
      audience: announcement.audience as AnnouncementFormValues['audience'],
      status: announcement.status as AnnouncementFormValues['status'],
      expiresAt: announcement.expiresAt,
    });
    setOpen(true);
  };

  // Function to handle viewing an announcement
  const handleView = (announcement: (typeof mockAnnouncements)[0]) => {
    setViewContent({
      title: announcement.title,
      content: "This is the content of the announcement. In a real application, this would be fetched from the server."
    });
    setViewOpen(true);
  };

  // Function to handle deleting an announcement
  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success("Announcement deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                setSelectedAnnouncement(null);
                form.reset({
                  title: "",
                  content: "",
                  audience: "all",
                  status: "draft",
                  expiresAt: "",
                });
              }}
            >
              <PlusCircle className="h-4 w-4" /> Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
              <DialogDescription>
                {selectedAnnouncement 
                  ? 'Make changes to the existing announcement.' 
                  : 'Add a new announcement to the platform.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Announcement title" {...field} />
                      </FormControl>
                      <FormDescription>
                        The title of your announcement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Announcement content" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The content of your announcement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="teachers">Teachers Only</SelectItem>
                            <SelectItem value="students">Students Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Who should see this announcement?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The current status of the announcement.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When this announcement should no longer be displayed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setOpen(false);
                      form.reset();
                      setSelectedAnnouncement(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedAnnouncement ? 'Save Changes' : 'Create Announcement'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Announcements</CardTitle>
          <CardDescription>
            Create, edit, and schedule platform announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {announcement.audience === 'all' 
                        ? 'All Users' 
                        : announcement.audience === 'teachers' 
                          ? 'Teachers Only' 
                          : 'Students Only'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      announcement.status === 'active' 
                        ? 'default' 
                        : announcement.status === 'scheduled' 
                          ? 'secondary' 
                          : 'outline'
                    }>
                      {announcement.status === 'active' 
                        ? 'Active' 
                        : announcement.status === 'scheduled' 
                          ? 'Scheduled' 
                          : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{announcement.createdAt}</TableCell>
                  <TableCell>{announcement.expiresAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(announcement)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(announcement)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500" 
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Announcement Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{viewContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">{viewContent?.content}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;
