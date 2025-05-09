
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PointsProvider } from './contexts/PointsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Index';
import Courses from './pages/courses/CoursesPage';
import CourseView from './pages/courses/CourseViewPage';
import Categories from './pages/Index'; // Placeholder
import CategoryView from './pages/Index'; // Placeholder
import Teachers from './pages/Index'; // Placeholder
import TeacherView from './pages/teachers/TeacherProfilePage'; // Updated
import Register from './pages/auth/RegisterPage';
import Login from './pages/auth/LoginPage';
import Profile from './pages/user/ProfilePage';
import Settings from './pages/user/SettingsPage';
import DashboardStudent from './pages/student/StudentDashboardPage';
import DashboardTeacher from './pages/teacher/TeacherDashboardPage';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminAchievements from './pages/admin/AchievementsPage';
import AdminPoints from './pages/admin/PointsPage';
import AdminReviews from './pages/admin/AdminReviewsPage';
import AdminUsers from './pages/admin/UsersPage';
import AdminCourses from './pages/admin/CoursesPage';
import AdminTutoring from './pages/admin/AdminTutoringPage';
import AdminBlog from './pages/admin/BlogPage';
import AdminAnnouncements from './pages/admin/AnnouncementsPage';
import AdminSettings from './pages/admin/SettingsPage';
import AdminSubscriptions from './pages/admin/SubscriptionsPage';
import MyCourses from './pages/student/StudentCoursesPage';
import SavedCourses from './pages/student/SavedCoursesPage'; // New import
import MyAchievements from './pages/student/AchievementsPage';
import MyCertificates from './pages/student/CertificatesPage';
import MyPoints from './pages/user/PointsPage';
import Subscriptions from './pages/user/SubscriptionsPage';
import MyTutoring from './pages/student/StudentTutoringPage';
import MyCoursesManage from './pages/teacher/TeacherCoursesPage';
import MyStudents from './pages/teacher/TeacherStudentsPage';
import MyTutoringManage from './pages/teacher/TeacherTutoringPage';
import CourseForm from './pages/teacher/CourseBuilderPage';
import LessonForm from './pages/teacher/CourseBuilderPage'; // Placeholder
import LessonView from './pages/courses/CourseLessonPage';
import CalendarPage from './pages/calendar/CalendarPage';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from '@/components/ui/sonner';
import MessagingPage from './pages/messaging/MessagingPage';
import TutoringPage from './pages/tutoring/TutoringPage';
import ContactPage from './pages/contact/ContactPage';
import BlogPage from './pages/blog/BlogPage';
import AboutPage from './pages/about/AboutPage';
import FAQPage from './pages/resources/FAQPage';
import TestimonialsPage from './pages/resources/TestimonialsPage';
import HelpPage from './pages/resources/HelpPage';
import MaterialsPage from './pages/resources/MaterialsPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import CookiesPage from './pages/legal/CookiesPage';
import SitemapPage from './pages/resources/SitemapPage';
import CareersPage from './pages/careers/CareersPage';
import CartPage from './pages/cart/CartPage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import TeacherProfileEditPage from './pages/teacher/TeacherProfileEditPage';
import TeacherTutoringManagePage from './pages/teacher/TeacherTutoringManagePage';
import TutoringAnnouncementForm from './pages/teacher/TutoringAnnouncementForm';

// ScrollToTop component to handle scrolling to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PointsProvider>
          <NotificationProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:courseId" element={<CourseView />} />
                    <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/:categoryId" element={<CategoryView />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="teachers/:teacherId" element={<TeacherView />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="tutoring" element={<TutoringPage />} />
                    <Route path="tutoriat" element={<TutoringPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="cart" element={<CartPage />} />
                    
                    {/* Resource Routes */}
                    <Route path="resources/materials" element={<MaterialsPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="testimonials" element={<TestimonialsPage />} />
                    <Route path="help" element={<HelpPage />} />
                    <Route path="sitemap" element={<SitemapPage />} />
                    
                    {/* Legal and Company Routes */}
                    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="cookies" element={<CookiesPage />} />
                    <Route path="careers" element={<CareersPage />} />
                    
                    {/* Student Routes */}
                    <Route path="dashboard/student" element={<DashboardStudent />} />
                    <Route path="my-courses" element={<MyCourses />} />
                    <Route path="my-saved-courses" element={<SavedCourses />} /> {/* New route */}
                    <Route path="my-achievements" element={<MyAchievements />} />
                    <Route path="my-certificates" element={<MyCertificates />} />
                    <Route path="my-points" element={<MyPoints />} />
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="my-tutoring" element={<MyTutoring />} />
                    
                    {/* Teacher Routes */}
                    <Route path="dashboard/teacher" element={<DashboardTeacher />} />
                    <Route path="teacher/profile" element={<TeacherProfilePage />} /> {/* New route */}
                    <Route path="teacher/profile/edit" element={<TeacherProfileEditPage />} /> {/* New route */}
                    <Route path="my-courses/manage" element={<MyCoursesManage />} />
                    <Route path="my-students" element={<MyStudents />} />
                    <Route path="my-tutoring/manage" element={<TeacherTutoringManagePage />} /> {/* Updated route */}
                    <Route path="teacher/tutoring/create" element={<TutoringAnnouncementForm />} /> {/* New route */}
                    <Route path="teacher/tutoring/edit/:sessionId" element={<TutoringAnnouncementForm />} /> {/* New route */}
                    <Route path="my-courses/create" element={<CourseForm />} />
                    <Route path="my-courses/edit/:courseId" element={<CourseForm />} />
                    <Route path="my-courses/:courseId/lessons/create" element={<LessonForm />} />
                    <Route path="my-courses/:courseId/lessons/edit/:lessonId" element={<LessonForm />} />
                    
                    {/* Messaging Routes */}
                    <Route path="messaging" element={<MessagingPage />} />
                  </Route>
                  
                  {/* Auth Routes */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="tutoring" element={<AdminTutoring />} />
                    <Route path="achievements" element={<AdminAchievements />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="points" element={<AdminPoints />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="announcements" element={<AdminAnnouncements />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <Toaster />
                
              </BrowserRouter>
            </CartProvider>
          </NotificationProvider>
        </PointsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
