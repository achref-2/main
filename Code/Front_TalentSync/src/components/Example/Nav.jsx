import React,{ useState,useEffect } from "react";
import { Moon, Sun, ArrowRight } from 'lucide-react';
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export const Nav = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigation = [
		{ name: 'Pricing', href: '#' },
		{ name: 'Blog', href: '#' },
		{ name: 'About', href: '#' },
		
	  ]
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle('dark');
    };
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
      <a href="#" className="-m-1.5 pr-3">
          <span className="sr-only">Your Company</span>
          <img
            alt=""
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="h-8 w-auto"
          />
        </a>
        <div className="flex items-center">
          <span className="text-2xl font-bold">TalentSync</span>
        </div>
        
      <div className="flex lg:flex-1">
        
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100">
            {item.name}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="/login" className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100">
          Log in <span aria-hidden="true">&rarr;</span>
        </a>

  </div>
   <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
      </div>
    </div>
  </nav>
  );
};
