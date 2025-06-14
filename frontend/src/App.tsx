import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PointsProvider } from "./contexts/PointsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TutoringProvider } from "./contexts/TutoringContext";

// Pages
import AdminLayout from "./components/layout/AdminLayout";
import MainLayout from "./components/layout/MainLayout";
import AboutPage from "./pages/about/AboutPage";
import AdminAchievements from "./pages/admin/AchievementsPage";
import AdminReviews from "./pages/admin/AdminReviewsPage";
import AdminTutoring from "./pages/admin/AdminTutoringPage";
import AdminAnnouncements from "./pages/admin/AnnouncementsPage";
import AdminBlog from "./pages/admin/BlogPage";
import AdminCourses from "./pages/admin/CoursesPage";
import AdminDashboard from "./pages/admin/DashboardPage";
import AdminPoints from "./pages/admin/PointsPage";
import AdminSettings from "./pages/admin/SettingsPage";
import AdminSubscriptions from "./pages/admin/SubscriptionsPage";
import AdminUsers from "./pages/admin/UsersPage";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import BlogPage from "./pages/blog/BlogPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import CareersPage from "./pages/careers/CareersPage";
import CartPage from "./pages/cart/CartPage";
import ContactPage from "./pages/contact/ContactPage";
import LessonView from "./pages/courses/CourseLessonPage";
import Courses from "./pages/courses/CoursesPage";
import CourseView from "./pages/courses/CourseViewPage";
import {
  default as Categories,
  default as CategoryView,
  default as Home,
  default as Teachers,
} from "./pages/Index";
import CookiesPage from "./pages/legal/CookiesPage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsPage from "./pages/legal/TermsPage";
import MessagingPage from "./pages/messaging/MessagingPage";
import NotFound from "./pages/NotFound";
import FAQPage from "./pages/resources/FAQPage";
import HelpPage from "./pages/resources/HelpPage";
import MaterialsPage from "./pages/resources/MaterialsPage";
import SitemapPage from "./pages/resources/SitemapPage";
import TestimonialsPage from "./pages/resources/TestimonialsPage";
import MyAchievements from "./pages/student/AchievementsPage";
import MyCertificates from "./pages/student/CertificatesPage";
import SavedCourses from "./pages/student/SavedCoursesPage";
import MyCourses from "./pages/student/StudentCoursesPage";
import DashboardStudent from "./pages/student/StudentDashboardPage";
import MyTutoring from "./pages/student/StudentTutoringPage";
import {
  default as CourseForm,
  default as LessonForm,
} from "./pages/teacher/CourseBuilderPage";
import MyCoursesManage from "./pages/teacher/TeacherCoursesPage";
import DashboardTeacher from "./pages/teacher/TeacherDashboardPage";
import TeacherProfileEditPage from "./pages/teacher/TeacherProfileEditPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import TeacherReviewsPage from "./pages/teacher/TeacherReviewsPage";
import MyStudents from "./pages/teacher/TeacherStudentsPage";
import TeacherTutoringManagePage from "./pages/teacher/TeacherTutoringManagePage";
import TutoringAnnouncementForm from "./pages/teacher/TutoringAnnouncementForm";
import TeacherView from "./pages/teachers/TeacherProfilePage";
import TutoringPage from "./pages/tutoring/TutoringPage";
import MyPoints from "./pages/user/PointsPage";
import Profile from "./pages/user/ProfilePage";
import Settings from "./pages/user/SettingsPage";
import Subscriptions from "./pages/user/SubscriptionsPage";

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
              <TutoringProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Home />} />
                      <Route path="courses" element={<Courses />} />
                      <Route
                        path="courses/:courseId"
                        element={<CourseView />}
                      />
                      <Route
                        path="courses/:courseId/lessons/:lessonId"
                        element={<LessonView />}
                      />
                      <Route path="categories" element={<Categories />} />
                      <Route
                        path="categories/:categoryId"
                        element={<CategoryView />}
                      />
                      <Route path="teachers" element={<Teachers />} />
                      <Route
                        path="teachers/:teacherId"
                        element={<TeacherView />}
                      />
                      <Route path="tutoring" element={<TutoringPage />} />
                      <Route path="tutoriat" element={<TutoringPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="blog" element={<BlogPage />} />

                      {/* Resource Routes */}
                      <Route
                        path="resources/materials"
                        element={<MaterialsPage />}
                      />
                      <Route path="faq" element={<FAQPage />} />
                      <Route
                        path="testimonials"
                        element={<TestimonialsPage />}
                      />
                      <Route path="help" element={<HelpPage />} />
                      <Route path="sitemap" element={<SitemapPage />} />

                      {/* Legal and Company Routes */}
                      <Route
                        path="privacy-policy"
                        element={<PrivacyPolicyPage />}
                      />
                      <Route path="terms" element={<TermsPage />} />
                      <Route path="cookies" element={<CookiesPage />} />
                      <Route path="careers" element={<CareersPage />} />

                      {/* Protected Routes for All Authenticated Users */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="messaging" element={<MessagingPage />} />
                        <Route path="my-points" element={<MyPoints />} />
                        <Route
                          path="subscriptions"
                          element={<Subscriptions />}
                        />
                      </Route>

                      {/* Student Protected Routes */}
                      <Route
                        element={<ProtectedRoute allowedRoles={["student"]} />}
                      >
                        <Route
                          path="dashboard/student"
                          element={<DashboardStudent />}
                        />
                        <Route path="my-courses" element={<MyCourses />} />
                        <Route
                          path="my-saved-courses"
                          element={<SavedCourses />}
                        />
                        <Route
                          path="my-achievements"
                          element={<MyAchievements />}
                        />
                        <Route
                          path="my-certificates"
                          element={<MyCertificates />}
                        />
                        <Route path="my-tutoring" element={<MyTutoring />} />
                      </Route>

                      {/* Teacher Protected Routes */}
                      <Route
                        element={<ProtectedRoute allowedRoles={["teacher"]} />}
                      >
                        <Route
                          path="dashboard/teacher"
                          element={<DashboardTeacher />}
                        />
                        <Route
                          path="teacher/profile"
                          element={<TeacherProfilePage />}
                        />
                        <Route
                          path="teacher/profile/edit"
                          element={<TeacherProfileEditPage />}
                        />
                        <Route
                          path="my-courses/manage"
                          element={<MyCoursesManage />}
                        />
                        <Route path="my-students" element={<MyStudents />} />
                        <Route
                          path="my-tutoring/manage"
                          element={<TeacherTutoringManagePage />}
                        />
                        <Route
                          path="teacher/tutoring/create"
                          element={<TutoringAnnouncementForm />}
                        />
                        <Route
                          path="teacher/tutoring/edit/:sessionId"
                          element={<TutoringAnnouncementForm />}
                        />
                        <Route
                          path="teacher/reviews"
                          element={<TeacherReviewsPage />}
                        />
                        <Route
                          path="my-courses/create"
                          element={<CourseForm />}
                        />
                        <Route
                          path="my-courses/edit/:courseId"
                          element={<CourseForm />}
                        />
                        <Route
                          path="my-courses/:courseId/lessons/create"
                          element={<LessonForm />}
                        />
                        <Route
                          path="my-courses/:courseId/lessons/edit/:lessonId"
                          element={<LessonForm />}
                        />
                      </Route>
                    </Route>

                    {/* Auth Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route
                        element={<ProtectedRoute allowedRoles={["admin"]} />}
                      >
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="courses" element={<AdminCourses />} />
                        <Route path="tutoring" element={<AdminTutoring />} />
                        <Route
                          path="achievements"
                          element={<AdminAchievements />}
                        />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="points" element={<AdminPoints />} />
                        <Route
                          path="subscriptions"
                          element={<AdminSubscriptions />}
                        />
                        <Route path="blog" element={<AdminBlog />} />
                        <Route
                          path="announcements"
                          element={<AdminAnnouncements />}
                        />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  <Toaster />
                </BrowserRouter>
              </TutoringProvider>
            </CartProvider>
          </NotificationProvider>
        </PointsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
