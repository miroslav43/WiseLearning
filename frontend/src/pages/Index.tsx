import CourseCard from "@/components/courses/CourseCard";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Course } from "@/types/course";
import { apiClient } from "@/utils/apiClient";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch featured courses
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const params = { featured: "true", limit: "6" };
        const coursesData = await apiClient.get<Course[]>("/courses", params);
        setFeaturedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCourses();

    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
      offset: 100,
    });

    // Refresh AOS when window is resized
    window.addEventListener("resize", () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener("resize", () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-r from-brand-50 to-brand-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-800/20 to-transparent"></div>
        <div className="container max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6" data-aos="fade-right">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Învață și Excelează la{" "}
                <span className="text-brand-800">Bacalaureat</span>
              </h1>
              <p className="text-lg text-gray-700">
                Cea mai completă platformă educațională cu cursuri video, teste
                și exerciții personalizate pentru nota maximă la examen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brand-800 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Explorează cursuri
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-brand-800 text-brand-800 hover:bg-brand-50"
                  >
                    Înregistrare gratuită
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                  <span className="text-gray-700">Profesori cu experiență</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                  <span className="text-gray-700">Materiale actualizate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                  <span className="text-gray-700">Învățare interactivă</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                  <span className="text-gray-700">Acces nelimitat</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2" data-aos="fade-left" data-aos-delay="200">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                  alt="Elevi care învață"
                  className="w-full rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-800/80 to-transparent p-6">
                  <p className="text-white font-medium">
                    Peste 15,000 de elevi ne-au ales deja
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <BookOpen className="h-12 w-12 text-brand-600 mb-4" />
              <span className="text-3xl font-bold text-gray-900">120+</span>
              <span className="text-gray-600 mt-2">Cursuri disponibile</span>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <GraduationCap className="h-12 w-12 text-brand-600 mb-4" />
              <span className="text-3xl font-bold text-gray-900">98%</span>
              <span className="text-gray-600 mt-2">Rată de promovare</span>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Users className="h-12 w-12 text-brand-600 mb-4" />
              <span className="text-3xl font-bold text-gray-900">15,000+</span>
              <span className="text-gray-600 mt-2">Elevi înscriși</span>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Star className="h-12 w-12 text-brand-600 mb-4" />
              <span className="text-3xl font-bold text-gray-900">4.8/5</span>
              <span className="text-gray-600 mt-2">Rating mediu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
            data-aos="fade-up"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Cursuri populare
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Cele mai apreciate cursuri pentru pregătirea examenului de
                Bacalaureat
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 flex items-center text-brand-800 hover:text-brand-700 font-medium"
            >
              <span>Vezi toate cursurile</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {isLoading ? (
                  // Display loading skeletons while fetching data
                  Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem
                      key={`skeleton-${index}`}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 h-[380px] animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-5 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : featuredCourses.length > 0 ? (
                  // Display actual courses when loaded
                  featuredCourses.map((course, index) => (
                    <CarouselItem
                      key={course.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div data-aos="zoom-in" data-aos-delay={100 + index * 50}>
                        <CourseCard course={course} />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  // Display message when no courses found
                  <CarouselItem className="pl-4 w-full">
                    <div className="text-center p-8 rounded-lg border bg-white">
                      <p className="text-gray-600">
                        Nu s-au găsit cursuri disponibile momentan.
                      </p>
                      <Link to="/courses">
                        <Button variant="outline" className="mt-4">
                          Explorează toate cursurile
                        </Button>
                      </Link>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-8">
                <CarouselPrevious className="relative inset-0 translate-y-0 mx-0" />
                <CarouselNext className="relative inset-0 translate-y-0 mx-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900">
              Cum funcționează
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Procesul simplu de învățare pe platforma noastră educațională
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative" data-aos="fade-right" data-aos-delay="0">
              <div className="bg-brand-50 p-8 rounded-xl flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-6 shadow-md">
                  <span className="text-2xl font-bold text-brand-800">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Alege cursurile
                </h3>
                <p className="text-gray-600">
                  Explorează catalogul nostru și alege cursurile care se
                  potrivesc nevoilor tale de învățare pentru Bacalaureat.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="h-8 w-8 text-brand-300" />
              </div>
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-brand-50 p-8 rounded-xl flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-6 shadow-md">
                  <span className="text-2xl font-bold text-brand-800">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Învață în ritmul tău
                </h3>
                <p className="text-gray-600">
                  Urmărește videoclipurile, rezolvă teste și exersează cu
                  materialele interactive disponibile oricând.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="h-8 w-8 text-brand-300" />
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="400">
              <div className="bg-brand-50 p-8 rounded-xl flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-6 shadow-md">
                  <span className="text-2xl font-bold text-brand-800">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Obține rezultate
                </h3>
                <p className="text-gray-600">
                  Monitorizează-ți progresul, primește feedback personalizat și
                  pregătește-te pentru succes la Bacalaureat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900">
              Ce spun elevii despre noi
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Experiențele reale ale elevilor care au obținut note mari la
              Bacalaureat cu ajutorul nostru
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div data-aos="zoom-in" data-aos-delay="100">
                    <TestimonialCard
                      name="Alexandra Ionescu"
                      role="Elevă, Promoția 2024"
                      content="Datorită acestei platforme am reușit să înțeleg mult mai bine matematica. Videoclipurile sunt clare și testele m-au ajutat să-mi verific cunoștințele."
                      rating={5}
                      image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div data-aos="zoom-in" data-aos-delay="150">
                    <TestimonialCard
                      name="Mihai Popescu"
                      role="Student, Admis la Politehnică"
                      content="Am obținut 9.80 la informatică datorită cursurilor de aici. Explicațiile sunt mult mai clare decât cele din școală și exercițiile sunt exact ce aveam nevoie."
                      rating={5}
                      image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div data-aos="zoom-in" data-aos-delay="200">
                    <TestimonialCard
                      name="Elena Dumitrescu"
                      role="Elevă, Nota 9.50 la Bacalaureat"
                      content="Recomand tuturor această platformă! Profesorii explică foarte bine și materialele sunt actualizate conform programei. M-a ajutat enorm la pregătirea pentru Bac."
                      rating={4}
                      image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div data-aos="zoom-in" data-aos-delay="250">
                    <TestimonialCard
                      name="Andrei Mihai"
                      role="Elev, Nota 10 la Bacalaureat"
                      content="WiseLearning a fost secretul meu pentru nota maximă la Bac. Sistemul de învățare este foarte bine structurat, iar sprijinul oferit de profesori este excelent."
                      rating={5}
                      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-8">
                <CarouselPrevious className="relative inset-0 translate-y-0 mx-0" />
                <CarouselNext className="relative inset-0 translate-y-0 mx-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop"
                alt="Echipa WiseLearning"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div
              className="md:w-1/2 space-y-6"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Despre Companie
              </h2>
              <p className="text-gray-700">
                WiseLearning SRL este o companie educațională din România
                dedicată îmbunătățirii experienței de învățare pentru elevii
                care se pregătesc pentru examenele de Bacalaureat.
              </p>
              <p className="text-gray-700">
                Cu o echipă de profesori experimentați și pasionați, ne
                concentrăm pe crearea de materiale educaționale de calitate,
                interactive și personalizate pentru nevoile fiecărui elev.
              </p>
              <div className="pt-4">
                <Link to="/about">
                  <Button
                    variant="outline"
                    className="border-brand-800 text-brand-800 hover:bg-brand-50"
                  >
                    Află mai multe despre noi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-800 to-brand-900 text-white">
        <div
          className="container max-w-6xl mx-auto px-4 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Începe călătoria spre succes la Bacalaureat
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Alătură-te miilor de elevi care își transformă visele în realitate
            cu ajutorul platformei noastre educaționale premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto font-medium"
              >
                Explorează cursuri
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-brand-800 hover:bg-gray-100 w-full sm:w-auto font-medium"
              >
                Înregistrează-te gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-brand-800 text-white p-3 rounded-full shadow-lg hover:bg-brand-700 transition-colors z-50"
        aria-label="Înapoi sus"
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-delay="300"
        data-aos-anchor-placement="top-bottom"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default HomePage;
