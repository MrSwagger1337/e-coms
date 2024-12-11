"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FilterProps = {
  categories: string[];
  onFilterChange: (category: string) => void;
};

export function ProductFilter({ categories, onFilterChange }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterClick = (category: string) => {
    setActiveFilter(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === category
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => handleFilterClick(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}
