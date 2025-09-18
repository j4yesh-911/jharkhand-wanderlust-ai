import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Calendar, User, Phone, MapPin, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Form validation schema
const bookingSchema = z.object({
  sourceStation: z.string().min(2, 'Source station is required'),
  destinationStation: z.string().min(2, 'Destination station is required'),
  travelDate: z.date({
    required_error: 'Travel date is required',
  }).refine((date) => date > new Date(), {
    message: 'Travel date must be in the future',
  }),
  travelClass: z.enum(['SL', '3A', '2A', '1A'], {
    required_error: 'Please select a travel class',
  }),
  passengerName: z.string().min(2, 'Passenger name is required'),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 5 && num <= 120;
  }, 'Age must be between 5 and 120'),
  gender: z.enum(['M', 'F', 'T'], {
    required_error: 'Please select gender',
  }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface TicketBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
}

// Common railway stations in Jharkhand
const jharkhandStations = [
  'Ranchi',
  'Dhanbad',
  'Bokaro Steel City',
  'Jamshedpur',
  'Deoghar',
  'Hazaribagh',
  'Giridih',
  'Chaibasa',
  'Dumka',
  'Godda',
  'Sahebganj',
  'Pakur',
  'Ramgarh Cantt',
  'Koderma',
  'Madhupur',
];

const travelClasses = [
  { value: 'SL', label: 'Sleeper (SL)', description: 'Budget option with basic amenities' },
  { value: '3A', label: 'AC 3 Tier (3A)', description: 'Air-conditioned with 3-tier berths' },
  { value: '2A', label: 'AC 2 Tier (2A)', description: 'Premium AC with 2-tier berths' },
  { value: '1A', label: 'AC First Class (1A)', description: 'Luxury travel with private cabins' },
];

export const TicketBookingForm = ({ isOpen, onClose, destinationName }: TicketBookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      destinationStation: destinationName,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create IRCTC deep link with pre-filled data
      const irctcParams = new URLSearchParams({
        fromStn: data.sourceStation,
        toStn: data.destinationStation,
        doj: format(data.travelDate, 'dd-MM-yyyy'),
        cls: data.travelClass,
        pnm: data.passengerName,
        age: data.age,
        gndr: data.gender,
        mobile: data.mobileNumber,
      });

      // IRCTC booking URL with parameters
      const irctcUrl = `https://www.irctc.co.in/nget/train-search?${irctcParams.toString()}`;

      toast({
        title: 'Redirecting to IRCTC',
        description: 'You will be redirected to IRCTC website to complete your booking.',
      });

      // Small delay for user to see the toast
      setTimeout(() => {
        window.open(irctcUrl, '_blank');
        onClose();
        form.reset();
      }, 1500);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-nature">
                      <Train className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-playfair text-foreground">
                      Book Train Ticket
                    </DialogTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <Card className="p-4 bg-gradient-to-r from-water-primary/10 to-forest-primary/10 border-0">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-water-primary" />
                    <span className="text-sm font-medium">Destination:</span>
                    <Badge variant="secondary" className="bg-forest-primary text-white">
                      {destinationName}
                    </Badge>
                  </div>
                </Card>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                  {/* Journey Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-water-primary" />
                      Journey Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sourceStation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Station</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source station" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jharkhandStations.map((station) => (
                                  <SelectItem key={station} value={station}>
                                    {station}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destinationStation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To Station</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination station" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jharkhandStations.map((station) => (
                                  <SelectItem key={station} value={station}>
                                    {station}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="travelDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Travel Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date <= new Date()}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="travelClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Travel Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {travelClasses.map((cls) => (
                                  <SelectItem key={cls.value} value={cls.value}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{cls.label}</span>
                                      <span className="text-xs text-muted-foreground">{cls.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Passenger Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <User className="w-5 h-5 mr-2 text-sunset-primary" />
                      Passenger Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="passengerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passenger name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter 10-digit mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter age" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                                <SelectItem value="T">Transgender</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 btn-nature"
                      disabled={isSubmitting}
                    >
                      <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Train className="w-4 h-4" />
                        <span>{isSubmitting ? 'Booking...' : 'Book on IRCTC'}</span>
                      </motion.div>
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <Card className="p-4 bg-muted/50 border-0">
                    <p className="text-xs text-muted-foreground text-center">
                      You will be redirected to the official IRCTC website to complete your booking. 
                      Please ensure you have an active IRCTC account and valid payment method.
                    </p>
                  </Card>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};