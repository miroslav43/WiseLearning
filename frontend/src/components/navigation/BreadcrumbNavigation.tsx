import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const routeNameMap: Record<string, string> = {
  "": "Acasă",
  courses: "Cursuri",
  about: "Despre",
  contact: "Contact",
  blog: "Blog",
  cart: "Coș",
  calendar: "Calendar",
  "my-points": "Punctele Mele",
  "my-achievements": "Realizările Mele",
  "my-certificates": "Certificatele Mele",
  subscriptions: "Abonamente",
  tutoring: "Tutoriat",
  faq: "Întrebări Frecvente",
  resources: "Resurse",
  testimonials: "Testimoniale",
  help: "Ajutor",
  "privacy-policy": "Politica de Confidențialitate",
  terms: "Termeni și Condiții",
  careers: "Cariere",
  profile: "Profil",
  settings: "Setări",
  dashboard: "Tablou de Bord",
  "my-courses": "Cursurile Mele",
  "my-assignments": "Temele Mele",
  "my-tutoring": "Tutoriatul Meu",
  teacher: "Profesor",
  student: "Student",
  admin: "Admin",
  login: "Autentificare",
  register: "Înregistrare",
};

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  // Don't show breadcrumbs on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.flatMap((segment, index) => {
            // Create the path to this segment
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const displayName = routeNameMap[segment] || segment;

            // If this is the last segment, render as current page, otherwise as a link
            return [
              <BreadcrumbSeparator key={`separator-${index}`} />,
              <BreadcrumbItem key={`item-${index}`}>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage className="max-w-[180px] truncate">
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path} className="max-w-[120px] truncate">
                      {displayName}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>,
            ];
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNavigation;
