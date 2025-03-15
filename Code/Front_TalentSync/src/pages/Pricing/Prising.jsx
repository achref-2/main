import React from 'react';
import { Coffee, Github } from "lucide-react";

const SupportSection = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <span className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400">
            <span className="text-2xl">$0</span>
          </span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">100% Free & Open Source</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Entretien AI is completely free and open source. We believe everyone deserves access to quality interview preparation tools.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Support Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <Coffee className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Support Our Work</h2>
          <p className="text-gray-400 mb-6">
            If you find our service valuable, consider buying us a coffee to help maintain and improve the platform.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center mx-auto">
            Buy us a coffee ❤️
          </button>
        </div>

        {/* Open Source Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <Github className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Open Source</h2>
          <p className="text-gray-400 mb-6">
            We are fully open source and free, feel free to check out our Github or donate to support the site.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center mx-auto">
            Buy us a coffee ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;