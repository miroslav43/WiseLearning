
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/64cea3cc-5444-467a-8015-f7a47b9e647d.png" 
                alt="WiseLearning Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-brand-800">WiseLearning</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Platforma educațională pentru învățare continuă și dezvoltare personală.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-800">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-800">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-800">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-800">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Cursuri</h3>
            <ul className="space-y-2">
              <li><Link to="/courses/mathematics" className="text-gray-600 hover:text-brand-800 text-sm">Matematică</Link></li>
              <li><Link to="/courses/romanian" className="text-gray-600 hover:text-brand-800 text-sm">Limba Română</Link></li>
              <li><Link to="/courses/history" className="text-gray-600 hover:text-brand-800 text-sm">Istorie</Link></li>
              <li><Link to="/courses/biology" className="text-gray-600 hover:text-brand-800 text-sm">Biologie</Link></li>
              <li><Link to="/courses/computer-science" className="text-gray-600 hover:text-brand-800 text-sm">Informatică</Link></li>
              <li><Link to="/courses" className="text-gray-600 hover:text-brand-800 text-sm">Vezi toate cursurile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resurse</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-800 text-sm">Blog</Link></li>
              <li><Link to="/resources/materials" className="text-gray-600 hover:text-brand-800 text-sm">Materiale gratuite</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-800 text-sm">Întrebări frecvente</Link></li>
              <li><Link to="/testimonials" className="text-gray-600 hover:text-brand-800 text-sm">Testimoniale</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-brand-800 text-sm">Ajutor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Despre Companie</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-800 text-sm">Despre noi</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-brand-800 text-sm">Politica de confidențialitate</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-800 text-sm">Termeni și condiții</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-800 text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-800 text-sm">Cariere</Link></li>
            </ul>
            <div className="mt-4 text-gray-600 text-sm">
              <p>Wiselearning SRL</p>
              <p>CUI: 50321210</p>
              <p>Nr. Reg. Com.: J35/2618/2024</p>
              <p>Adresa: Timisoara, Str. Metalurgiei, Nr. 2, Etaj 2, Ap. 48, Jud. Timis</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} WiseLearning. Toate drepturile rezervate.
          </p>
          <div className="mt-4 sm:mt-0">
            <ul className="flex space-x-4">
              <li><Link to="/privacy-policy" className="text-gray-500 hover:text-brand-800 text-sm">Confidențialitate</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-brand-800 text-sm">Termeni</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-brand-800 text-sm">Cookies</Link></li>
              <li><Link to="/sitemap" className="text-gray-500 hover:text-brand-800 text-sm">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
