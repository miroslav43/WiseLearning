
import { Course } from './course';

export interface CartItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  pointsPrice: number;  // Field for points pricing
  image: string;
  teacherName: string;
  subject: string;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalPointsPrice: number;  // Field for total points pricing
}
