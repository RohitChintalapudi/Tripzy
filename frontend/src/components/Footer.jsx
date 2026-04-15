import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-12 bg-white text-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-sky-600 dark:text-sky-400">Flight Booking</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Your trusted partner for hassle-free flight bookings and travel experiences.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link to="/flights" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Flights</Link></li>
              <li><Link to="#" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Contact Us</h3>
            <div className="flex space-x-5">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/rohit-chintalapudi-5454ba36a/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-500 transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="https://www.instagram.com/royrohit19/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-500 transition-colors" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163zm0 2.163c-3.148 0-3.519.012-4.758.068-2.652.121-3.665 1.134-3.786 3.787-.056 1.24-.068 1.61-.068 4.757 0 3.149.012 3.52.068 4.758.121 2.651 1.134 3.664 3.786 3.787 1.239.056 1.61.068 4.758.068 3.148 0 3.519-.012 4.758-.068 2.653-.121 3.664-1.134 3.787-3.787.055-1.239.068-1.609.068-4.758 0-3.148-.013-3.519-.068-4.757-.123-2.653-1.135-3.665-3.787-3.787-1.24-.055-1.61-.068-4.758-.068zm0 4.081c-3.176 0-5.756 2.58-5.756 5.756 0 3.176 2.58 5.756 5.756 5.756 3.176 0 5.756-2.58 5.756-5.756 0-3.176-2.58-5.756-5.756-5.756zm0 9.349c-1.984 0-3.593-1.609-3.593-3.593 0-1.984 1.609-3.593 3.593-3.593 1.984 0 3.593 1.609 3.593 3.593 0 1.984-1.609 3.593-3.593 3.593zm5.034-9.351c-.604 0-1.096-.492-1.096-1.096 0-.604.492-1.096 1.096-1.096.604 0 1.096.492 1.096 1.096 0 .604-.492 1.096-1.096 1.096z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Email */}
              <a href="mailto:rohit_chintalapudi@srmap.edu.in" className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors" aria-label="Email">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                </svg>
              </a>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
               <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                 Made with love by <span className="text-pink-500 font-bold">Team Roy</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
