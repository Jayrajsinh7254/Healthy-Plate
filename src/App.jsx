import React, { useState, useEffect } from 'react';
// --- API KEYS ---
const USDA_API_KEY = "D0WYpIpDKSAWhX9OijB8DHed4jFaXIc2zpMf01bG"; // Replace with your actual key
const SPOONACULAR_API_KEY = "f796c8a30ef7484681b5f9070dbf5a7a";
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_KEY";

// --- LOCALSTORAGE HELPERS ---
const getUsers = () => JSON.parse(localStorage.getItem('hp_users') || '{}');
const saveUsers = (users) => localStorage.setItem('hp_users', JSON.stringify(users));
const getSession = () => JSON.parse(localStorage.getItem('hp_session') || 'null');
const saveSession = (session) => localStorage.setItem('hp_session', JSON.stringify(session));

// --- DATA ---
const FOOD_DATABASE = {
  Vegetables: [
    { name: 'Broccoli', emoji: '🥦', calories: 31, protein: 2.5, carbs: 6, fat: 0.4, fiber: 2.4, category: 'Vegetables', vitC: 89, calcium: 47, iron: 0.7, source: 'local' },
    { name: 'Spinach', emoji: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'Vegetables', vitC: 28, calcium: 99, iron: 2.7, source: 'local' },
    { name: 'Carrot', emoji: '🥕', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables', vitC: 5.9, calcium: 33, iron: 0.3, source: 'local' },
    { name: 'Tomato', emoji: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: 'Vegetables', vitC: 13, calcium: 10, iron: 0.3, source: 'local' },
    { name: 'Bell Pepper', emoji: '🫑', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, category: 'Vegetables', vitC: 127, calcium: 10, iron: 0.4, source: 'local' },
    { name: 'Cucumber', emoji: '🥒', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: 'Vegetables', vitC: 2.8, calcium: 16, iron: 0.3, source: 'local' },
    { name: 'Zucchini', emoji: '🥒', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, category: 'Vegetables', vitC: 17.9, calcium: 16, iron: 0.4, source: 'local' },
    { name: 'Kale', emoji: '🥬', calories: 33, protein: 2.9, carbs: 6, fat: 0.6, fiber: 1.3, category: 'Vegetables', vitC: 93, calcium: 254, iron: 1.6, source: 'local' },
    { name: 'Cauliflower', emoji: '🥦', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, category: 'Vegetables', vitC: 48, calcium: 22, iron: 0.4, source: 'local' },
    { name: 'Asparagus', emoji: '🌿', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, category: 'Vegetables', vitC: 5.6, calcium: 24, iron: 2.1, source: 'local' },
    { name: 'Eggplant', emoji: '🍆', calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, category: 'Vegetables', vitC: 2.2, calcium: 9, iron: 0.2, source: 'local' },
    { name: 'Brussels Sprouts', emoji: '🥬', calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8, category: 'Vegetables', vitC: 85, calcium: 42, iron: 1.4, source: 'local' },
    { name: 'Mushrooms', emoji: '🍄', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, category: 'Vegetables', vitC: 2.1, calcium: 3, iron: 0.5, source: 'local' },
    { name: 'Onion', emoji: '🧅', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, category: 'Vegetables', vitC: 7.4, calcium: 23, iron: 0.2, source: 'local' },
    { name: 'Garlic', emoji: '🧄', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, category: 'Vegetables', vitC: 31, calcium: 181, iron: 1.7, source: 'local' },
    { name: 'Celery', emoji: '🥬', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, category: 'Vegetables', vitC: 3.1, calcium: 40, iron: 0.2, source: 'local' },
    { name: 'Radish', emoji: '🌱', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6, category: 'Vegetables', vitC: 14.8, calcium: 25, iron: 0.3, source: 'local' },
    { name: 'Beets', emoji: '🟣', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables', vitC: 4.9, calcium: 16, iron: 0.8, source: 'local' },
    { name: 'Sweet Corn', emoji: '🌽', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2, category: 'Vegetables', vitC: 6.8, calcium: 2, iron: 0.5, source: 'local' },
    { name: 'Green Peas', emoji: '🫛', calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1, category: 'Vegetables', vitC: 40, calcium: 25, iron: 1.5, source: 'local' },
    { name: 'Cabbage', emoji: '🥬', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, category: 'Vegetables', vitC: 36.6, calcium: 40, iron: 0.5, source: 'local' },
    { name: 'Sweet Potato', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: 'Vegetables', vitC: 2.4, calcium: 30, iron: 0.6, source: 'local' },
    { name: 'Lettuce', emoji: '🥬', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, category: 'Vegetables', vitC: 9.2, calcium: 36, iron: 0.9, source: 'local' },
    { name: 'Bok Choy', emoji: '🥬', calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2, fiber: 1, category: 'Vegetables', vitC: 45, calcium: 105, iron: 0.8, source: 'local' },
    { name: 'Swiss Chard', emoji: '🥬', calories: 19, protein: 1.8, carbs: 3.7, fat: 0.2, fiber: 1.6, category: 'Vegetables', vitC: 30, calcium: 51, iron: 1.8, source: 'local' },
    { name: 'Edamame', emoji: '🫛', calories: 122, protein: 10.9, carbs: 9.9, fat: 5.2, fiber: 5.2, category: 'Vegetables', vitC: 6.1, calcium: 63, iron: 2.3, source: 'local' },
    { name: 'Artichoke', emoji: '🌿', calories: 47, protein: 3.3, carbs: 10.5, fat: 0.2, fiber: 5.4, category: 'Vegetables', vitC: 11.7, calcium: 44, iron: 1.3, source: 'local' },
    { name: 'Leek', emoji: '🧅', calories: 61, protein: 1.5, carbs: 14, fat: 0.3, fiber: 1.8, category: 'Vegetables', vitC: 12, calcium: 59, iron: 2.1, source: 'local' },
    { name: 'Fennel', emoji: '🌿', calories: 31, protein: 1.2, carbs: 7.3, fat: 0.2, fiber: 3.1, category: 'Vegetables', vitC: 12, calcium: 49, iron: 0.7, source: 'local' },
    { name: 'Turnip', emoji: '🟣', calories: 28, protein: 0.9, carbs: 6.4, fat: 0.1, fiber: 1.8, category: 'Vegetables', vitC: 21, calcium: 30, iron: 0.3, source: 'local' },
    { name: 'Arugula', emoji: '🥬', calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, category: 'Vegetables', vitC: 15, calcium: 160, iron: 1.5, source: 'local' },
    { name: 'Watercress', emoji: '🌿', calories: 11, protein: 2.3, carbs: 1.3, fat: 0.1, fiber: 0.5, category: 'Vegetables', vitC: 43, calcium: 120, iron: 0.2, source: 'local' },
    { name: 'Kohlrabi', emoji: '🥦', calories: 27, protein: 1.7, carbs: 6.2, fat: 0.1, fiber: 3.6, category: 'Vegetables', vitC: 62, calcium: 24, iron: 0.4, source: 'local' },
    { name: 'Pumpkin', emoji: '🎃', calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, category: 'Vegetables', vitC: 9, calcium: 21, iron: 0.8, source: 'local' },
  ],
  Fruits: [
    { name: 'Apple', emoji: '🍎', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, category: 'Fruits', vitC: 4.6, calcium: 6, iron: 0.1, source: 'local' },
    { name: 'Banana', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: 'Fruits', vitC: 8.7, calcium: 5, iron: 0.3, source: 'local' },
    { name: 'Strawberries', emoji: '🍓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, category: 'Fruits', vitC: 58, calcium: 16, iron: 0.4, source: 'local' },
    { name: 'Blueberries', emoji: '🫐', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, category: 'Fruits', vitC: 9.7, calcium: 6, iron: 0.3, source: 'local' },
    { name: 'Orange', emoji: '🍊', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, category: 'Fruits', vitC: 53, calcium: 40, iron: 0.1, source: 'local' },
    { name: 'Mango', emoji: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, category: 'Fruits', vitC: 36.4, calcium: 11, iron: 0.1, source: 'local' },
    { name: 'Grapes', emoji: '🍇', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, category: 'Fruits', vitC: 3.2, calcium: 10, iron: 0.3, source: 'local' },
    { name: 'Pineapple', emoji: '🍍', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, category: 'Fruits', vitC: 47.8, calcium: 13, iron: 0.3, source: 'local' },
    { name: 'Peach', emoji: '🍑', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, category: 'Fruits', vitC: 6.6, calcium: 6, iron: 0.3, source: 'local' },
    { name: 'Pear', emoji: '🍐', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, category: 'Fruits', vitC: 4.3, calcium: 9, iron: 0.2, source: 'local' },
    { name: 'Watermelon', emoji: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, category: 'Fruits', vitC: 8.1, calcium: 7, iron: 0.2, source: 'local' },
    { name: 'Kiwi', emoji: '🥝', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, category: 'Fruits', vitC: 92.7, calcium: 34, iron: 0.3, source: 'local' },
    { name: 'Lemon', emoji: '🍋', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, category: 'Fruits', vitC: 53, calcium: 26, iron: 0.6, source: 'local' },
    { name: 'Cherry', emoji: '🍒', calories: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 1.6, category: 'Fruits', vitC: 7, calcium: 13, iron: 0.4, source: 'local' },
    { name: 'Raspberry', emoji: '🍓', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5, category: 'Fruits', vitC: 26.2, calcium: 25, iron: 0.7, source: 'local' },
    { name: 'Pomegranate', emoji: '🔴', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, category: 'Fruits', vitC: 10.2, calcium: 10, iron: 0.3, source: 'local' },
    { name: 'Blackberry', emoji: '🫐', calories: 43, protein: 1.4, carbs: 10, fat: 0.5, fiber: 5.3, category: 'Fruits', vitC: 21, calcium: 29, iron: 0.6, source: 'local' },
    { name: 'Plum', emoji: '🟣', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, category: 'Fruits', vitC: 9.5, calcium: 6, iron: 0.2, source: 'local' },
    { name: 'Apricot', emoji: '🍑', calories: 48, protein: 1.4, carbs: 11, fat: 0.4, fiber: 2, category: 'Fruits', vitC: 10, calcium: 13, iron: 0.4, source: 'local' },
    { name: 'Grapefruit', emoji: '🍊', calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6, category: 'Fruits', vitC: 31.2, calcium: 22, iron: 0.1, source: 'local' },
    { name: 'Avocado', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, category: 'Fruits', vitC: 10, calcium: 12, iron: 0.6, source: 'local' },
    { name: 'Papaya', emoji: '🍈', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, category: 'Fruits', vitC: 60.9, calcium: 20, iron: 0.3, source: 'local' },
    { name: 'Cantaloupe', emoji: '🍈', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, category: 'Fruits', vitC: 36.7, calcium: 9, iron: 0.2, source: 'local' },
    { name: 'Fig', emoji: '🫐', calories: 74, protein: 0.8, carbs: 19, fat: 0.3, fiber: 2.9, category: 'Fruits', vitC: 2, calcium: 35, iron: 0.4, source: 'local' },
    { name: 'Dragon Fruit', emoji: '🍈', calories: 60, protein: 1.2, carbs: 13, fat: 0, fiber: 3, category: 'Fruits', vitC: 9, calcium: 8, iron: 0.7, source: 'local' },
    { name: 'Passion Fruit', emoji: '🟡', calories: 97, protein: 2.2, carbs: 23, fat: 0.7, fiber: 10.4, category: 'Fruits', vitC: 30, calcium: 12, iron: 1.6, source: 'local' },
    { name: 'Guava', emoji: '🍏', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, category: 'Fruits', vitC: 228, calcium: 18, iron: 0.3, source: 'local' },
    { name: 'Lime', emoji: '🍋', calories: 30, protein: 0.7, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Fruits', vitC: 29.1, calcium: 33, iron: 0.6, source: 'local' },
    { name: 'Cranberry', emoji: '🍒', calories: 46, protein: 0.4, carbs: 12, fat: 0.1, fiber: 4.6, category: 'Fruits', vitC: 13.3, calcium: 8, iron: 0.3, source: 'local' },
    { name: 'Lychee', emoji: '🍈', calories: 66, protein: 0.8, carbs: 17, fat: 0.4, fiber: 1.3, category: 'Fruits', vitC: 71.5, calcium: 5, iron: 0.3, source: 'local' },
    { name: 'Coconut', emoji: '🥥', calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, category: 'Fruits', vitC: 3.3, calcium: 14, iron: 2.4, source: 'local' },
    { name: 'Persimmon', emoji: '🟠', calories: 70, protein: 0.6, carbs: 19, fat: 0.2, fiber: 3.6, category: 'Fruits', vitC: 7.5, calcium: 8, iron: 0.2, source: 'local' },
    { name: 'Mulberry', emoji: '🍇', calories: 43, protein: 1.4, carbs: 10, fat: 0.4, fiber: 1.7, category: 'Fruits', vitC: 36.4, calcium: 39, iron: 1.8, source: 'local' },
    { name: 'Starfruit', emoji: '🍈', calories: 31, protein: 0.4, carbs: 7, fat: 0.3, fiber: 2.8, category: 'Fruits', vitC: 34.7, calcium: 3, iron: 0.2, source: 'local' },
    { name: 'Tangerine', emoji: '🍊', calories: 45, protein: 0.8, carbs: 11, fat: 0.2, fiber: 1.8, category: 'Fruits', vitC: 26.7, calcium: 37, iron: 0.1, source: 'local' },
    { name: 'Honeydew', emoji: '🍈', calories: 34, protein: 0.5, carbs: 8, fat: 0.2, fiber: 0.9, category: 'Fruits', vitC: 18.9, calcium: 7, iron: 0.2, source: 'local' },
    { name: 'Cactus Pear', emoji: '🌵', calories: 42, protein: 0.7, carbs: 10, fat: 0.2, fiber: 3.6, category: 'Fruits', vitC: 8.4, calcium: 22, iron: 0.3, source: 'local' },
    { name: 'Rambutan', emoji: '🍈', calories: 60, protein: 0.7, carbs: 15, fat: 0.3, fiber: 0.9, category: 'Fruits', vitC: 29, calcium: 13, iron: 0.2, source: 'local' },
    { name: 'Mangosteen', emoji: '🍈', calories: 73, protein: 0.4, carbs: 18, fat: 0.6, fiber: 1.8, category: 'Fruits', vitC: 4.7, calcium: 14, iron: 0.2, source: 'local' },
    { name: 'Sapodilla', emoji: '🍈', calories: 83, protein: 0.4, carbs: 21, fat: 0.2, fiber: 5.3, category: 'Fruits', vitC: 8.4, calcium: 21, iron: 0.2, source: 'local' },
    { name: 'Tamarind', emoji: '🍈', calories: 287, protein: 2.8, carbs: 75, fat: 0.2, fiber: 5.1, category: 'Fruits', vitC: 2.8, calcium: 74, iron: 2.8, source: 'local' },
    { name: 'Loquat', emoji: '🍈', calories: 48, protein: 0.4, carbs: 12, fat: 0.2, fiber: 1.7, category: 'Fruits', vitC: 42.2, calcium: 16, iron: 0.2, source: 'local' },
    { name: 'Jackfruit', emoji: '🍈', calories: 95, protein: 1.7, carbs: 25, fat: 0.6, fiber: 1.5, category: 'Fruits', vitC: 22.7, calcium: 27, iron: 0.2, source: 'local' },
    { name: 'Breadfruit', emoji: '🍈', calories: 103, protein: 1.1, carbs: 27, fat: 0.2, fiber: 5.3, category: 'Fruits', vitC: 19.6, calcium: 17, iron: 0.4, source: 'local' },
    { name: 'Durian', emoji: '🍈', calories: 147, protein: 1.5, carbs: 38, fat: 5, fiber: 3.8, category: 'Fruits', vitC: 24.3, calcium: 6, iron: 0.4, source: 'local' },
    { name: 'Feijoa', emoji: '🍈', calories: 55, protein: 0.6, carbs: 13, fat: 0.3, fiber: 1.9, category: 'Fruits', vitC: 18, calcium: 17, iron: 0.2, source: 'local' },
    { name: 'Goji Berry', emoji: '🍇', calories: 349, protein: 14, carbs: 68, fat: 0.8, fiber: 11, category: 'Fruits', vitC: 28.2, calcium: 25, iron: 6.7, source: 'local' },
    { name: 'Huckleberry', emoji: '🫐', calories: 43, protein: 0.5, carbs: 10, fat: 0.2, fiber: 2.4, category: 'Fruits', vitC: 14.7, calcium: 12, iron: 0.3, source: 'local' },
  ],
  Proteins: [
    { name: 'Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Proteins' },
    { name: 'Salmon', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'Proteins' },
    { name: 'Eggs', emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: 'Proteins' },
    { name: 'Tofu', emoji: '🫙', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'Proteins' },
    { name: 'Lentils', emoji: '🫘', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, category: 'Proteins' },
    { name: 'Black Beans', emoji: '🫘', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, category: 'Proteins' },
    { name: 'Tuna', emoji: '🐠', calories: 130, protein: 28, carbs: 0, fat: 0.6, fiber: 0, category: 'Proteins' },
    { name: 'Chickpeas', emoji: '🫘', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: 'Proteins' },
    { name: 'Turkey Breast', emoji: '🦃', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins' },
    { name: 'Shrimp', emoji: '🦐', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, category: 'Proteins' },
    { name: 'Beef Lean', emoji: '🥩', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: 'Proteins' },
    { name: 'Pork Tenderloin', emoji: '🥩', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, category: 'Proteins' },
    { name: 'Cod', emoji: '🐡', calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins' },
    { name: 'Pumpkin Seeds', emoji: '🌰', calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, category: 'Proteins' },
    { name: 'Walnuts', emoji: '🥜', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'Proteins' },
    { name: 'Chia Seeds', emoji: '🌱', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: 'Proteins' },
    { name: 'Peanut Butter', emoji: '🥜', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: 'Proteins' },
    { name: 'Tempeh', emoji: '🫙', calories: 192, protein: 19, carbs: 9, fat: 11, fiber: 0, category: 'Proteins' },
    { name: 'Almonds', emoji: '🥜', calories: 579, protein: 21, carbs: 22, fat: 49, fiber: 12.5, category: 'Proteins' },
    { name: 'Cashews', emoji: '🥜', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, category: 'Proteins' },
    { name: 'Pistachios', emoji: '🥜', calories: 562, protein: 20, carbs: 28, fat: 45, fiber: 10, category: 'Proteins' },
    // 🐟 Fish & Seafood
    { name: 'Tilapia', emoji: '🐡', calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, category: 'Proteins' },
    { name: 'Sardines', emoji: '🐟', calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, category: 'Proteins' },
    { name: 'Crab', emoji: '🦀', calories: 87, protein: 18, carbs: 0, fat: 1.1, fiber: 0, category: 'Proteins' },
    { name: 'Lobster', emoji: '🦞', calories: 89, protein: 19, carbs: 0, fat: 0.9, fiber: 0, category: 'Proteins' },
    { name: 'Scallops', emoji: '🦪', calories: 111, protein: 21, carbs: 5.4, fat: 0.8, fiber: 0, category: 'Proteins' },

    // 🥛 Dairy Proteins
    // { name: 'Greek Yogurt', emoji: '🥛', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, category: 'Proteins' },
    // { name: 'Cottage Cheese', emoji: '🧀', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: 'Proteins' },
    // { name: 'Mozzarella', emoji: '🧀', calories: 280, protein: 28, carbs: 2.2, fat: 17, fiber: 0, category: 'Proteins' },
    // { name: 'Whey Protein', emoji: '🥛', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, category: 'Proteins' },

    // 🌱 Plant Proteins
    { name: 'Edamame', emoji: '🫛', calories: 122, protein: 10.9, carbs: 9.9, fat: 5.2, fiber: 5.2, category: 'Proteins' },
    { name: 'Hemp Seeds', emoji: '🌱', calories: 553, protein: 31.6, carbs: 8.7, fat: 48.7, fiber: 4, category: 'Proteins' },
    { name: 'Peanuts', emoji: '🥜', calories: 567, protein: 25.8, carbs: 16, fat: 49, fiber: 8.5, category: 'Proteins' },
    { name: 'Seitan', emoji: '🫙', calories: 370, protein: 75, carbs: 14, fat: 1.9, fiber: 0.6, category: 'Proteins' },
    { name: 'Quinoa', emoji: '🌾', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, category: 'Proteins' },
    { name: 'Kidney Beans', emoji: '🫘', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, category: 'Proteins' },
    { name: 'Sunflower Seeds', emoji: '🌻', calories: 584, protein: 20.8, carbs: 20, fat: 51, fiber: 8.6, category: 'Proteins' },
    { name: 'Flaxseeds', emoji: '🌱', calories: 534, protein: 18.3, carbs: 29, fat: 42, fiber: 27, category: 'Proteins' },
  ],
  Grains: [
    { name: 'Brown Rice', emoji: '🍚', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, category: 'Grains', vitC: 0, calcium: 10, iron: 0.4, source: 'local' },
    { name: 'Quinoa', emoji: '🌾', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, category: 'Grains', vitC: 0, calcium: 17, iron: 1.5, source: 'local' },
    { name: 'Oats', emoji: '🥣', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, category: 'Grains', vitC: 0, calcium: 54, iron: 4.7, source: 'local' },
    { name: 'Whole Bread', emoji: '🍞', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, category: 'Grains', vitC: 0, calcium: 107, iron: 2.4, source: 'local' },
    { name: 'Whole Wheat Pasta', emoji: '🍝', calories: 124, protein: 5.3, carbs: 27, fat: 0.5, fiber: 2.8, category: 'Grains', vitC: 0, calcium: 10, iron: 1.2, source: 'local' },
    { name: 'Barley', emoji: '🌾', calories: 354, protein: 12, carbs: 73, fat: 2.3, fiber: 17, category: 'Grains', vitC: 0, calcium: 33, iron: 3.6, source: 'local' },
    { name: 'Bulgur', emoji: '🌾', calories: 342, protein: 12, carbs: 76, fat: 1.3, fiber: 18, category: 'Grains', vitC: 0, calcium: 35, iron: 2.5, source: 'local' },
    { name: 'Buckwheat', emoji: '🌾', calories: 343, protein: 13, carbs: 72, fat: 3.4, fiber: 10, category: 'Grains', vitC: 0, calcium: 18, iron: 2.2, source: 'local' },
    { name: 'Couscous', emoji: '🍚', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, category: 'Grains', vitC: 0, calcium: 8, iron: 0.4, source: 'local' },
    { name: 'Millet', emoji: '🌾', calories: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5, category: 'Grains', vitC: 0, calcium: 8, iron: 3, source: 'local' },
    { name: 'Farro', emoji: '🌾', calories: 362, protein: 13, carbs: 70, fat: 2.4, fiber: 11, category: 'Grains', vitC: 0, calcium: 40, iron: 3.2, source: 'local' },
    { name: 'Rye', emoji: '🌾', calories: 338, protein: 10, carbs: 76, fat: 1.6, fiber: 15, category: 'Grains', vitC: 0, calcium: 33, iron: 2.6, source: 'local' },
    { name: 'Wild Rice', emoji: '🍚', calories: 101, protein: 4, carbs: 21, fat: 0.3, fiber: 1.8, category: 'Grains', vitC: 0, calcium: 3, iron: 0.6, source: 'local' },
    { name: 'Amaranth', emoji: '🌾', calories: 371, protein: 14, carbs: 66, fat: 7, fiber: 7, category: 'Grains', vitC: 0, calcium: 159, iron: 7.6, source: 'local' },
    { name: 'Flaxseed', emoji: '🌱', calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, category: 'Grains', vitC: 0.6, calcium: 255, iron: 5.7, source: 'local' },
    // 🌾 Additional Healthy Grains
    { name: 'Sorghum', emoji: '🌾', calories: 329, protein: 10.6, carbs: 72, fat: 3.5, fiber: 6.3, category: 'Grains', vitC: 0, calcium: 28, iron: 4.4, source: 'local' },
    { name: 'Teff', emoji: '🌾', calories: 367, protein: 13.3, carbs: 73, fat: 2.4, fiber: 8, category: 'Grains', vitC: 0, calcium: 180, iron: 7.6, source: 'local' },
    { name: 'Spelt', emoji: '🌾', calories: 338, protein: 14.6, carbs: 70, fat: 2.4, fiber: 10.7, category: 'Grains', vitC: 0, calcium: 27, iron: 4.4, source: 'local' },
    { name: 'Kamut', emoji: '🌾', calories: 337, protein: 14.7, carbs: 70, fat: 2.2, fiber: 9.1, category: 'Grains', vitC: 0, calcium: 31, iron: 3.9, source: 'local' },
    { name: 'White Rice', emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'Grains', vitC: 0, calcium: 10, iron: 1.2, source: 'local' },
    { name: 'Corn Tortilla', emoji: '🫓', calories: 218, protein: 5.7, carbs: 46, fat: 3.1, fiber: 6.5, category: 'Grains', vitC: 0, calcium: 121, iron: 3.8, source: 'local' },
    { name: 'Sourdough Bread', emoji: '🍞', calories: 230, protein: 9, carbs: 45, fat: 1.8, fiber: 2, category: 'Grains', vitC: 0, calcium: 27, iron: 2.8, source: 'local' },
    { name: 'Rice Cakes', emoji: '🍘', calories: 387, protein: 8.2, carbs: 81, fat: 3, fiber: 1.9, category: 'Grains', vitC: 0, calcium: 6, iron: 0.9, source: 'local' },
    { name: 'Freekeh', emoji: '🌾', calories: 347, protein: 13, carbs: 72, fat: 2.7, fiber: 12.9, category: 'Grains', vitC: 0, calcium: 32, iron: 3.6, source: 'local' },
    { name: 'Hemp Seeds', emoji: '🌱', calories: 553, protein: 31.6, carbs: 8.7, fat: 48.7, fiber: 4, category: 'Grains', vitC: 0, calcium: 70, iron: 7.9, source: 'local' },
  ],
  Dairy: [
    { name: 'Greek Yogurt', emoji: '🫙', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, category: 'Dairy', vitC: 0, calcium: 110, iron: 0.1, source: 'local' },
    { name: 'Cheese', emoji: '🧀', calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, category: 'Dairy', vitC: 0, calcium: 721, iron: 0.7, source: 'local' },
    { name: 'Milk', emoji: '🥛', calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, category: 'Dairy', vitC: 0, calcium: 125, iron: 0, source: 'local' },
    { name: 'Cottage Cheese', emoji: '🧀', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: 'Dairy', vitC: 0, calcium: 83, iron: 0.1, source: 'local' },
    { name: 'Butter', emoji: '🧈', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, category: 'Dairy', vitC: 0, calcium: 24, iron: 0, source: 'local' },
    { name: 'Mozzarella', emoji: '🧀', calories: 280, protein: 28, carbs: 2.2, fat: 17, fiber: 0, category: 'Dairy', vitC: 0, calcium: 505, iron: 0.4, source: 'local' },
    { name: 'Cheddar', emoji: '🧀', calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, category: 'Dairy', vitC: 0, calcium: 720, iron: 0.7, source: 'local' },
    { name: 'Parmesan', emoji: '🧀', calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0, category: 'Dairy', vitC: 0, calcium: 1184, iron: 0.8, source: 'local' },
    { name: 'Kefir', emoji: '🥛', calories: 61, protein: 3.4, carbs: 4.7, fat: 3.3, fiber: 0, category: 'Dairy', vitC: 0, calcium: 130, iron: 0.1, source: 'local' },
    { name: 'Sour Cream', emoji: '🫙', calories: 193, protein: 2.4, carbs: 4.6, fat: 19, fiber: 0, category: 'Dairy', vitC: 0, calcium: 83, iron: 0.1, source: 'local' },
    { name: 'Heavy Cream', emoji: '🥛', calories: 340, protein: 2.8, carbs: 2.8, fat: 36, fiber: 0, category: 'Dairy', vitC: 0, calcium: 65, iron: 0, source: 'local' },
    { name: 'Ricotta', emoji: '🧀', calories: 174, protein: 11.3, carbs: 3, fat: 13, fiber: 0, category: 'Dairy', vitC: 0, calcium: 207, iron: 0.4, source: 'local' },
    { name: 'Cream Cheese', emoji: '🧀', calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0, category: 'Dairy', vitC: 0, calcium: 98, iron: 0.5, source: 'local' },
    { name: 'Whipped Cream', emoji: '🍦', calories: 257, protein: 1.9, carbs: 12.5, fat: 22, fiber: 0, category: 'Dairy', vitC: 0, calcium: 61, iron: 0, source: 'local' },
  ],
};

const CATEGORIES = Object.keys(FOOD_DATABASE);

const CATEGORY_COLORS = {
  Vegetables: 'green',
  Fruits: 'orange',
  Proteins: 'red',
  Grains: 'yellow',
  Dairy: 'blue',
};

const CATEGORY_HEX = {
  Vegetables: '#22c55e',
  Fruits: '#f97316',
  Proteins: '#ef4444',
  Grains: '#eab308',
  Dairy: '#3b82f6',
};

const IDEAL_RATIOS = {
  Vegetables: 0.35,
  Fruits: 0.15,
  Proteins: 0.25,
  Grains: 0.20,
  Dairy: 0.05,
};

const GET_GOAL_CONFIG = (goal) => {
  switch (goal) {
    case 'lose-weight': return { title: "🔥 Fat Loss Plan", color: "#ef4444" };
    case 'gain-muscle': return { title: "💪 Muscle Gain Plan", color: "#8b5cf6" };
    case 'maintain': return { title: "⚖️ Maintenance Plan", color: "#22c55e" };
    case 'improve-health': return { title: "🌿 Wellness Plan", color: "#10b981" };
    default: return { title: "🌿 Wellness Plan", color: "#10b981" };
  }
};

const TIPS_BY_GOAL = {
  'lose-weight': [
    "1. Eat in a 500 kcal deficit daily",
    'Focus on high-volume, low-calorie foods like leafy greens.',
    'Drink 500ml of water before every meal to increase satiety.',
    'Prioritize protein to prevent muscle loss during your deficit.',
    'Try consistent meal timing to regulate hunger hormones.',
    'Limit liquid calories (sodas, juices) entirely if possible.',
    'Use smaller plates to naturally control portion sizes.'
  ],
  'gain-muscle': [
    'Ensure you are in a consistent caloric surplus of 300+ kcal.',
    'Consume protein every 3-4 hours to maximize protein synthesis.',
    'Focus on compound lifts and progressive overload in training.',
    'Late night casein protein (cottage cheese) helps recovery.',
    'Don’t fear carbohydrates; they fuel your intense workouts.',
    'Track your strength gains as much as your weight gains.'
  ],
  'maintain': [
    'Find your "caloric sweet spot" where weight stays stable.',
    'Keep fiber high (25g+) for long-term metabolic health.',
    'Vary your protein sources (fish, poultry, legumes, eggs).',
    'Indulge mindfully – the 80/20 rule works best for maintenance.',
    'Monitor your energy levels during workouts for fuel adjustment.',
    'Keep taking your 7-day varied meal plan seriously.'
  ],
  'improve-health': [
    'Aim for 30 different plant-based foods per week.',
    'Prioritize whole, unprocessed foods over packaged goods.',
    'Improve gut health with fermented foods like yogurt or kimchi.',
    'Limit added sugars to less than 25g per day.',
    'Focus on quality sleep – it regulates your metabolism.',
    'Moderate healthy fats (avocado, nuts) are essential.'
  ]
};

const GET_CONDITION_ADVICE = (conditions) => {
  const mapping = {
    'Diabetes': 'Limit refined carbs. Focus on low-GI foods.',
    'Hypertension': 'Limit sodium <2300mg/day. Increase potassium.',
    'High Cholesterol': 'Reduce saturated fats. Increase omega-3s.',
    'Thyroid': 'Ensure adequate iodine. Avoid excess raw cruciferous veg.',
    'PCOD/PCOS': 'Low-GI diet. Reduce processed foods. Anti-inflammatory focus.'
  };
  return conditions.filter(c => mapping[c]).map(c => ({ condition: c, advice: mapping[c] }));
};

const MEALS_BY_GOAL = {
  'lose-weight': {
    'Monday': [
      { time: '08:00', label: 'Breakfast', food: 'Oatmeal with berries and flaxseeds', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Grilled chicken salad with light vinaigrette', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Baked cod with steamed broccoli and quinoa', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Greek yogurt or a small apple', p: 0.10 }
    ],
    'Tuesday': [
      { time: '08:00', label: 'Breakfast', food: 'Egg white omelet with spinach and peppers', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Turkey wrap with lots of veggies', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Lean beef stir-fry with zucchini noodles', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Handful of almonds', p: 0.10 }
    ],
    'Wednesday': [
      { time: '08:00', label: 'Breakfast', food: 'Chia pudding with almond milk', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Tuna salad (light mayo) with celery sticks', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Roasted turkey breast with asparagus', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Cottage cheese', p: 0.10 }
    ],
    'Thursday': [
      { time: '08:00', label: 'Breakfast', food: 'Whole grain toast with avocado', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Chickpea and cucumber salad', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Grilled salmon with sautéed kale', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Pear or berries', p: 0.10 }
    ],
    'Friday': [
      { time: '08:00', label: 'Breakfast', food: 'Protein smoothie with spinach', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Lentil soup with a side green salad', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Chicken skewers with bell peppers', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Rice cakes', p: 0.10 }
    ],
    'Saturday': [
      { time: '08:00', label: 'Breakfast', food: 'Scrambled eggs with smoked salmon', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Quinoa bowl with black beans', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Lemon herb shrimp with cauliflower rice', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Carrot sticks with hummus', p: 0.10 }
    ],
    'Sunday': [
      { time: '08:00', label: 'Breakfast', food: 'Greek yogurt parfait', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Roast chicken with green beans', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Stuffed bell peppers with ground turkey', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'One boiled egg', p: 0.10 }
    ]
  },
  'gain-muscle': {
    'Monday': [
      { time: '08:00', label: 'Breakfast', food: '4 Eggs, 2 Toast, 1 Banana', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Double chicken breast with 1.5 cup rice', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Steak with large sweet potato', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Protein shake + mass gainer', p: 0.15 }
    ],
    'Tuesday': [
      { time: '08:00', label: 'Breakfast', food: 'Oatmeal with protein powder & peanut butter', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Lean ground beef with pasta and marinara', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Grilled salmon with quinoa and asparagus', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Cottage cheese with almonds', p: 0.15 }
    ],
    'Wednesday': [
      { time: '08:00', label: 'Breakfast', food: 'Greek yogurt with granola and blueberries', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Turkey breast with sweet potato and broccoli', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Pork tenderloin with brown rice and green beans', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Casein shake with milk', p: 0.15 }
    ],
    'Thursday': [
      { time: '08:00', label: 'Breakfast', food: 'Egg white & spinach wrap with avocado', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Tuna pasta salad with peas', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Chicken thighs with roasted potatoes', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Peanut butter toast with honey', p: 0.15 }
    ],
    'Friday': [
      { time: '08:00', label: 'Breakfast', food: 'Pancakes with protein mix and maple syrup', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Sirloin steak with farro salad', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Cod fillets with mixed sautéed veggies', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Greek yogurt with walnuts', p: 0.15 }
    ],
    'Saturday': [
      { time: '08:00', label: 'Breakfast', food: 'Tofu scramble with whole grain toast', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'BBQ chicken bowl with corn and beans', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Lamb chops with roasted carrots', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Trail mix and beef jerky', p: 0.15 }
    ],
    'Sunday': [
      { time: '08:00', label: 'Breakfast', food: 'Breakfast burrito with steak and eggs', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Shrimp scampi with whole wheat linguine', p: 0.30 },
      { time: '19:00', label: 'Dinner', food: 'Turkey burgers with sweet potato fries', p: 0.30 },
      { time: '21:00', label: 'Snacks', food: 'Yogurt with mixed seeds', p: 0.15 }
    ]
  },
  'maintain': {
    'Monday': [
      { time: '08:00', label: 'Breakfast', food: 'Greek yogurt with fruit and honey', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Mixed grain bowl with chickpea and feta', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Baked snapper with roasted potatoes', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Handful of mixed nuts', p: 0.10 }
    ],
    'Tuesday': [
      { time: '08:00', label: 'Breakfast', food: 'Avocado toast with poached egg', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Turkey and swiss wrap', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Chicken Alfredo with broccoli', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Apple with peanut butter', p: 0.10 }
    ],
    'Wednesday': [
      { time: '08:00', label: 'Breakfast', food: 'Steel cut oats with apple slices', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Quinoa salad with roasted veggies', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Grilled chicken breast with couscous', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Hummus and carrots', p: 0.10 }
    ],
    'Thursday': [
      { time: '08:00', label: 'Breakfast', food: 'Smoothie bowl with seeds and coconut', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Beef and barley soup', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Stir-fry tofu with snap peas', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Low-fat string cheese', p: 0.10 }
    ],
    'Friday': [
      { time: '08:00', label: 'Breakfast', food: 'Buckwheat pancakes with berries', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Caprese salad with grilled chicken', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Pork loin with apples and cabbage', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Yogurt parfit', p: 0.10 }
    ],
    'Saturday': [
      { time: '08:00', label: 'Breakfast', food: 'Smoked salmon on whole grain bagel', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Tabbouleh salad with hummus', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Roasted turkey breast with green beans', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Fruit salad', p: 0.10 }
    ],
    'Sunday': [
      { time: '08:00', label: 'Breakfast', food: 'Whole grain waffles with fruit', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Nicoise salad with tuna', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Spaghetti squash with meatballs', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Dark chocolate square', p: 0.10 }
    ]
  },
  'improve-health': {
    'Monday': [
      { time: '08:00', label: 'Breakfast', food: 'Avocado toast on rye with eggs', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Lentil soup with hearty green salad', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Pan-seared salmon with asparagus', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Air-popped popcorn or berries', p: 0.10 }
    ],
    'Tuesday': [
      { time: '08:00', label: 'Breakfast', food: 'Mixed berry smoothie with chia', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Mediterranean tuna salad', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Baked chicken with sweet potato', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Walnuts and dried apricots', p: 0.10 }
    ],
    'Wednesday': [
      { time: '08:00', label: 'Breakfast', food: 'Steel cut oats with flaxseed', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Chickpea curry with brown rice', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Turkey meatballs with zucchini noodles', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Raw veggies with guacamole', p: 0.10 }
    ],
    'Thursday': [
      { time: '08:00', label: 'Breakfast', food: 'Yogurt with hemp hearts and fruit', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Black bean burger without bun', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Cod with lemon and steamed kale', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Celery with almond butter', p: 0.10 }
    ],
    'Friday': [
      { time: '08:00', label: 'Breakfast', food: 'Spinach and feta omelet', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Brown rice bowl with steamed tofu', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Roast chicken with colorful veggies', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Pumpkin seeds', p: 0.10 }
    ],
    'Saturday': [
      { time: '08:00', label: 'Breakfast', food: 'Kiwi and orange fruit salad', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Lentil salad with lemon tahini', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Salmon papillote with herbs', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Kefir or yogurt drink', p: 0.10 }
    ],
    'Sunday': [
      { time: '08:00', label: 'Breakfast', food: 'Buckwheat bowl with sliced banana', p: 0.25 },
      { time: '13:00', label: 'Lunch', food: 'Shrimp and veggie stir-fry', p: 0.35 },
      { time: '19:00', label: 'Dinner', food: 'Vegetable lasagna with whole wheat sheets', p: 0.30 },
      { time: '16:00', label: 'Snacks', food: 'Edamame beans', p: 0.10 }
    ]
  }
};

// --- DATA ---
const RECIPE_DATABASE = [
  {
    name: 'Roasted Broccoli & Tofu',
    emoji: '🥦',
    desc: 'Crispy roasted broccoli with marinated tofu cubes.',
    requires: ['Broccoli', 'Tofu'],
    tags: ['Vegetables', 'Proteins'],
    ytQuery: 'healthy roasted broccoli and tofu recipe'
  },
  {
    name: 'Salmon with Quinoa',
    emoji: '🐟',
    desc: 'Pan-seared salmon served over a fluffy bed of quinoa.',
    requires: ['Salmon', 'Quinoa'],
    tags: ['Proteins', 'Grains'],
    ytQuery: 'easy salmon quinoa bowl recipe'
  },
  {
    name: 'Berry Oatmeal Bowl',
    emoji: '🥣',
    desc: 'Hearty oats topped with fresh blueberries and strawberries.',
    requires: ['Oats', 'Blueberries', 'Strawberries'],
    tags: ['Grains', 'Fruits'],
    ytQuery: 'healthy berry oatmeal breakfast recipe'
  },
  {
    name: 'Chicken & Brown Rice',
    emoji: '🍗',
    desc: 'Simple grilled chicken breast with steamed brown rice.',
    requires: ['Chicken Breast', 'Brown Rice'],
    tags: ['Proteins', 'Grains'],
    ytQuery: 'chicken and brown rice meal prep'
  },
  {
    name: 'Greek Yogurt Parfait',
    emoji: '🍦',
    desc: 'Creamy Greek yogurt with sliced bananas and almonds.',
    requires: ['Greek Yogurt', 'Banana', 'Almonds'],
    tags: ['Dairy', 'Fruits'],
    ytQuery: 'high protein greek yogurt parfait recipe'
  },
  {
    name: 'Spinach & Egg Scramble',
    emoji: '🍳',
    desc: 'Quick scramble with fresh spinach and eggs.',
    requires: ['Spinach', 'Eggs'],
    tags: ['Vegetables', 'Proteins'],
    ytQuery: 'healthy spinach and eggs breakfast'
  },
  {
    name: 'Apple & Cheese Snacks',
    emoji: '🍎',
    desc: 'Crispy apple slices paired with sharp cheddar cheese.',
    requires: ['Apple', 'Cheese'],
    tags: ['Fruits', 'Dairy'],
    ytQuery: 'apple and cheese snack ideas'
  },
  {
    name: 'Chickpea Salad',
    emoji: '🥗',
    desc: 'Refreshing salad with chickpeas, cucumbers, and tomatoes.',
    requires: ['Chickpeas', 'Cucumber', 'Tomato'],
    tags: ['Proteins', 'Vegetables'],
    ytQuery: 'mediterranean chickpea salad recipe'
  },
  {
    name: 'Sweet Potato & Black Beans',
    emoji: '🍠',
    desc: 'Roasted sweet potatoes with seasoned black beans.',
    requires: ['Sweet Potato', 'Black Beans'],
    tags: ['Grains', 'Proteins'],
    ytQuery: 'sweet potato and black bean tacos'
  },
  {
    name: 'Whole Wheat Pasta Primavera',
    emoji: '🍝',
    desc: 'Pasta tossed with zucchini, bell peppers, and carrots.',
    requires: ['Whole Wheat Pasta', 'Zucchini', 'Bell Pepper', 'Carrot'],
    tags: ['Grains', 'Vegetables'],
    ytQuery: 'healthy whole wheat pasta primavera'
  },
  {
    name: 'Avocado Toast with Egg',
    emoji: '🥑',
    desc: 'Whole bread topped with mashed avocado and a fried egg.',
    requires: ['Whole Bread', 'Avocado', 'Eggs'],
    tags: ['Grains', 'Dairy', 'Proteins'],
    ytQuery: 'avocado toast with egg recipe'
  },
  {
    name: 'Mango & Kale Smoothie',
    emoji: '🥤',
    desc: 'Tropical green smoothie with kale, mango, and milk.',
    requires: ['Kale', 'Mango', 'Milk'],
    tags: ['Vegetables', 'Fruits', 'Dairy'],
    ytQuery: 'healthy kale mango smoothie'
  },
  {
    name: 'Chicken & Bell Pepper Stir-fry',
    emoji: '🥘',
    desc: 'Rapid stir-fry with chicken and colorful bell peppers.',
    requires: ['Chicken Breast', 'Bell Pepper'],
    tags: ['Proteins', 'Vegetables'],
    ytQuery: 'healthy chicken pepper stir fry'
  },
  {
    name: 'Lentil & Spinach Soup',
    emoji: '🍲',
    desc: 'Warm and filling soup with lentils and wilted spinach.',
    requires: ['Lentils', 'Spinach'],
    tags: ['Proteins', 'Vegetables'],
    ytQuery: 'easy red lentil and spinach soup'
  },
  {
    name: 'Tuna & Cucumber Bites',
    emoji: '🐟',
    desc: 'Tuna salad served on fresh cucumber slices.',
    requires: ['Tuna', 'Cucumber'],
    tags: ['Proteins', 'Vegetables'],
    ytQuery: 'tuna cucumber bites healthy snack'
  },
  {
    name: 'Cottage Cheese & Peaches',
    emoji: '🥣',
    desc: 'Rich cottage cheese topped with sweet peaches (or mango).',
    requires: ['Cottage Cheese', 'Mango'],
    tags: ['Dairy', 'Fruits'],
    ytQuery: 'cottage cheese and fruit healthy bowl'
  },
  {
    name: 'Apple & Almond Butter',
    emoji: '🍏',
    desc: 'Crisp apples dipped in creamy almond butter (almonds).',
    requires: ['Apple', 'Almonds'],
    tags: ['Fruits', 'Dairy'],
    ytQuery: 'apple and almond butter snack'
  },
  {
    name: 'Zucchini & Lentil Curry',
    emoji: '🍛',
    desc: 'Flavorful curry with zucchini and red lentils.',
    requires: ['Zucchini', 'Lentils'],
    tags: ['Vegetables', 'Proteins'],
    ytQuery: 'zucchini and lentil curry recipe'
  },
  {
    name: 'Strawberries & Cream',
    emoji: '🍓',
    desc: 'Sweet strawberries topped with cool Greek yogurt.',
    requires: ['Strawberries', 'Greek Yogurt'],
    tags: ['Fruits', 'Dairy'],
    ytQuery: 'healthy strawberry yogurt dessert'
  },
  {
    name: 'Grains & Greens Bowl',
    emoji: '🥗',
    desc: 'Quinoa, kale, and chickpeas with a light dressing.',
    requires: ['Quinoa', 'Kale', 'Chickpeas'],
    tags: ['Grains', 'Vegetables', 'Proteins'],
    ytQuery: 'healthy kale and quinoa bowl'
  }
];

const getScoreBadge = (score) => {
  if (score >= 90) return { label: 'Optimal', color: 'bg-forest' };
  if (score >= 70) return { label: 'Good', color: 'bg-emerald-500' };
  if (score >= 50) return { label: 'Fair', color: 'bg-amber-500' };
  return { label: 'Attention Needed', color: 'bg-red-500' };
};

// --- HELPERS ---
const calculateBalanceScore = (plateItems) => {
  if (plateItems.length === 0) return 0;

  const counts = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
  plateItems.forEach(item => {
    counts[item.category]++;
  });

  const total = plateItems.length;
  let totalSimilarity = 0;

  CATEGORIES.forEach(cat => {
    const actualRatio = counts[cat] / total;
    const idealRatio = IDEAL_RATIOS[cat];
    // Similarity = 1 - Math.abs(diff)
    const similarity = 1 - Math.abs(actualRatio - idealRatio);
    totalSimilarity += similarity;
  });
  return Math.round((totalSimilarity / CATEGORIES.length) * 100);
};

const calculateDiet = (user) => {
  const { weight, height, age, gender, activity, goal, diet } = user;

  // 1. Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'Male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  // 2. TDEE
  const multipliers = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'extreme-active': 1.9
  };
  const tdee = Math.round(bmr * (multipliers[activity] || 1.2));

  // 3. Target Calories
  let targetCal = tdee;
  if (goal === 'lose-weight') targetCal -= 500;
  if (goal === 'gain-muscle') targetCal += 300;

  // 4. BMI & Body Fat % (Deurenberg)
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  let bodyFat = (1.2 * bmi) + (0.23 * age) - (10.8 * (gender === 'Male' ? 1 : 0)) - 5.4;
  bodyFat = Math.max(5, bodyFat).toFixed(1);

  // 5. Lean Body Mass
  const leanMass = Math.round(weight * (1 - bodyFat / 100));

  // 6. Ideal Body Weight (Devine)
  let idealWeight;
  const heightInInches = height / 2.54;
  const baseInches = 60; // 5 feet
  const additionalHeight = Math.max(0, heightInInches - baseInches);
  if (gender === 'Male') {
    idealWeight = 50 + (2.3 * additionalHeight);
  } else {
    idealWeight = 45.5 + (2.3 * additionalHeight);
  }
  idealWeight = Math.max(40, idealWeight).toFixed(1);

  // 7. Smart Water Intake
  const activityBonus = (activity === 'active' || activity === 'very-active') ? 500 : (activity === 'moderate' ? 250 : 0);
  const water = (((weight * 35) + activityBonus) / 1000).toFixed(1);

  // 8. Daily Fiber Target
  const fiber = Math.round(14 * (targetCal / 1000));

  // 9. Goal Roadmap
  const weightToGoal = Math.abs(weight - idealWeight).toFixed(1);
  const weeksToGoal = goal === 'lose-weight' ? Math.round(weightToGoal / 0.5) : Math.round(weightToGoal * 2);

  // 10. Dynamic Macro Splits
  let pP = 30, cP = 40, fP = 30; // Default
  if (goal === 'lose-weight') { pP = 35; cP = 35; fP = 30; }
  if (goal === 'gain-muscle') { pP = 35; cP = 40; fP = 25; }
  if (diet === 'Keto') { pP = 25; cP = 5; fP = 70; }

  const protein = Math.round((targetCal * (pP / 100)) / 4);
  const carbs = Math.round((targetCal * (cP / 100)) / 4);
  const fat = Math.round((targetCal * (fP / 100)) / 9);

  // 11. Micronutrient RDA Targets
  const rda = {
    vitC: gender === 'Male' ? 90 : 75,
    calcium: age > 50 ? 1200 : 1000,
    iron: (gender === 'Female' && age < 50) ? 18 : 8,
    vitD: 600,
    potassium: 4700,
    magnesium: gender === 'Male' ? 420 : 320
  };

  return {
    bmr, tdee, targetCal, bmi, bodyFat, leanMass, idealWeight,
    water, fiber, weightToGoal, weeksToGoal,
    protein, carbs, fat, macroSplits: { pP, cP, fP }, rda
  };
};

const getRecipeSuggestions = (plateItems) => {
  if (plateItems.length === 0) return [];

  const plateFoodNames = plateItems.map(item => item.name);
  const plateCategories = plateItems.map(item => item.category);

  const suggestions = RECIPE_DATABASE.map(recipe => {
    const matchedIngrs = recipe.requires.filter(req => plateFoodNames.includes(req));
    const matchedTags = recipe.tags.filter(tag => plateCategories.includes(tag));

    const score = (matchedIngrs.length * 3) + matchedTags.length;
    const progress = matchedIngrs.length / recipe.requires.length;

    return {
      ...recipe,
      score,
      progress,
      matchedCount: matchedIngrs.length
    };
  });

  // Sort by score descending and take top 9
  return suggestions
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9);
};

const LoginScreen = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) return setError('Please fill all fields.');
    const users = getUsers();
    const user = users[email];
    if (!user) return setError('No account found. Please sign up.');
    if (user.password !== password) return setError('Incorrect password.');

    saveSession({ email });
    onLogin(user);
  };

  return (
    <div className="auth-bg">
      <div className="glass max-w-md w-full p-10 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-500">
        <div className="text-6xl mb-4 text-forest">🥗</div>
        <h1 className="text-4xl font-serif font-bold text-forest mb-2">HealthyPlate</h1>
        <p className="text-slate-500 italic mb-8">Your personal nutrition companion</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="name@example.com"
              className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none transition-all transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none transition-all transition-all"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-forest to-green-700 text-white rounded-2xl font-bold mt-4 shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Sign In
          </button>
        </div>

        <p className="mt-8 text-slate-500 text-sm">
          No account?
          <button onClick={() => onNavigate('signup')} className="ml-1 text-forest font-bold hover:underline">
            Sign Up Free
          </button>
        </p>
      </div>
    </div>
  );
};

const SignupWizard = ({ onSignup, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    age: '', gender: 'Male', weight: '', height: '',
    activity: 'sedentary', diet: 'Omnivore', allergies: ['None'], conditions: ['None'],
    goal: 'improve-health', meals: '3', water: '2'
  });
  const [error, setError] = useState('');

  const updateField = (f, v) => setFormData(p => ({ ...p, [f]: v }));
  const toggleArrayField = (f, v) => {
    setFormData(p => {
      let arr = [...p[f]];
      if (v === 'None') arr = ['None'];
      else {
        arr = arr.filter(x => x !== 'None');
        if (arr.includes(v)) arr = arr.filter(x => x !== v);
        else arr.push(v);
        if (arr.length === 0) arr = ['None'];
      }
      return { ...p, [f]: arr };
    });
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) return setError('Please fill all fields.');
      if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
      if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
      if (getUsers()[formData.email]) return setError('Email already taken.');
    }
    if (step === 2) {
      if (!formData.age || !formData.weight || !formData.height) return setError('Please fill all fields.');
    }
    setStep(s => s + 1);
  };

  const finalize = () => {
    const users = getUsers();
    users[formData.email] = { ...formData };
    saveUsers(users);
    saveSession({ email: formData.email });
    onSignup(formData);
  };

  const bmi = formData.weight && formData.height ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1) : 0;
  const getBMILabel = (b) => {
    if (b < 18.5) return { l: "Underweight", c: "blue", class: "bmi-underweight" };
    if (b < 25) return { l: "Normal", c: "green", class: "bmi-normal" };
    if (b < 30) return { l: "Overweight", c: "amber", class: "bmi-overweight" };
    return { l: "Obese", c: "red", class: "bmi-obese" };
  };
  const bmiLabel = getBMILabel(bmi);

  return (
    <div className="auth-bg">
      <div className="glass max-w-2xl w-full p-10 rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
        {/* Progress */}
        <div className="flex justify-between items-center mb-10 px-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-white text-green-600 ring-4 ring-green-100' : 'bg-white text-slate-300 ring-1 ring-slate-100'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-[10px] uppercase font-black tracking-widest ${step === s ? 'text-green-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Account' : s === 2 ? 'Personal' : s === 3 ? 'Health' : 'Goals'}
              </span>
            </div>
          ))}
          <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${(step - 1) / 3 * 100}%` }}></div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

        <div className="step-enter">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none" />
                <input type="email" placeholder="Email Address" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none" />
                <input type="password" placeholder="Password (min 6)" value={formData.password} onChange={e => updateField('password', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none" />
                <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-forest outline-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-left">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Age</label>
                  <input type="number" value={formData.age} onChange={e => updateField('age', e.target.value)} placeholder="Years" className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Gender</label>
                  <select value={formData.gender} onChange={e => updateField('gender', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Weight (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => updateField('weight', e.target.value)} placeholder="kg" className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Height (cm)</label>
                  <input type="number" value={formData.height} onChange={e => updateField('height', e.target.value)} placeholder="cm" className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none" />
                </div>
              </div>

              {formData.weight && formData.height && (
                <div className={`p-6 rounded-3xl border-2 border-dashed transition-all duration-500 flex justify-between items-center ${bmiLabel.class}`}>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">Your Health Status</div>
                    <div className="text-3xl font-serif font-bold">{bmiLabel.l}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black uppercase opacity-60">BMI Score</div>
                    <div className="text-3xl font-bold">{bmi}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-left">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Activity & Diet</h2>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Activity Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'sedentary', icon: '🛋', t: 'Sedentary', d: 'little/no exercise' },
                    { id: 'light', icon: '🚶', t: 'Lightly Active', d: '1–3 days/week' },
                    { id: 'moderate', icon: '🚴', t: 'Moderately Active', d: '3–5 days/week' },
                    { id: 'active', icon: '🏋️', t: 'Very Active', d: '6–7 days/week' },
                    { id: 'very-active', icon: '⚡', t: 'Athlete', d: 'twice daily' }
                  ].map(a => (
                    <button key={a.id} onClick={() => updateField('activity', a.id)} className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${formData.activity === a.id ? 'radio-card-selected' : 'border-slate-100 hover:border-slate-200'}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <div className="font-bold text-sm leading-tight">{a.t}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{a.d}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Diet Preference</label>
                <div className="flex flex-wrap gap-2">
                  {['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'].map(d => (
                    <button key={d} onClick={() => updateField('diet', d)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${formData.diet === d ? 'bg-green-500 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Allergies</label>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'None'].map(a => (
                      <button key={a} onClick={() => toggleArrayField('allergies', a)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.allergies.includes(a) ? 'bg-red-500 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {['Diabetes', 'Hypertension', 'High Cholesterol', 'Thyroid', 'PCOD/PCOS', 'None'].map(m => (
                      <button key={m} onClick={() => toggleArrayField('conditions', m)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.conditions.includes(m) ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 text-left">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Fitness Goals</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'lose-weight', icon: '🔥', t: 'Lose Weight', d: 'burn fat, deficit' },
                  { id: 'gain-muscle', icon: '💪', t: 'Gain Muscle', d: 'strength & size' },
                  { id: 'maintain', icon: '⚖️', t: 'Maintain', d: 'current weight' },
                  { id: 'improve-health', icon: '🌿', t: 'Wellness', d: 'general vitality' }
                ].map(g => (
                  <button key={g.id} onClick={() => updateField('goal', g.id)} className={`p-4 rounded-3xl border-2 text-left transition-all ${formData.goal === g.id ? 'radio-card-selected' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="font-bold text-sm leading-tight">{g.t}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{g.d}</div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Meals per Day</label>
                  <select value={formData.meals} onChange={e => updateField('meals', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none">
                    {['2', '3', '4', '5', '6'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Water (L)</label>
                  <select value={formData.water} onChange={e => updateField('water', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 outline-none">
                    {['1', '1.5', '2', '2.5', '3', '3.5', '4'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-50">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="px-8 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Back</button>
            ) : (
              <button onClick={() => onNavigate('login')} className="text-slate-500 text-sm font-bold hover:text-forest">Have an account? Login</button>
            )}
            <button
              onClick={step === 4 ? finalize : nextStep}
              className="px-8 py-3.5 bg-gradient-to-r from-forest to-green-700 text-white rounded-2xl font-bold shadow-lg shadow-forest/10 hover:shadow-forest/20 hover:-translate-y-0.5 transition-all"
            >
              {step === 4 ? '🚀 Create My Plan' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DietPlanScreen = ({ user, onBack, apiDietPlan, isGeneratingPlan, onRefreshPlan }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const plan = calculateDiet(user);
  const goalCfg = GET_GOAL_CONFIG(user.goal);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = MEALS_BY_GOAL[user.goal] || MEALS_BY_GOAL['improve-health'];
  const dailyMeals = meals[selectedDay] || meals['Monday'];
  const conditionAdvice = GET_CONDITION_ADVICE(user.conditions);
  const tips = TIPS_BY_GOAL[user.goal] || TIPS_BY_GOAL['improve-health'];

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 font-bold text-sm transition-all relative ${activeTab === id ? 'text-forest' : 'text-slate-400'}`}
    >
      {label}
      {activeTab === id && (
        <div className="absolute bottom-0 left-0 w-full h-1 rounded-t-full" style={{ backgroundColor: goalCfg.color }}></div>
      )}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-forest transition-colors">
          ← Back to Plate Builder
        </button>
        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          Mifflin-St Jeor Formula
        </span>
      </div>

      <div className="flex border-b border-slate-100 mb-8 overflow-x-auto">
        <TabButton id="overview" label="📊 Overview" />
        <TabButton id="plan" label="📅 7-Day Plan" />
        <TabButton id="metrics" label="🏋️ Body Metrics" />
        <TabButton id="micro" label="🧬 Micronutrients" />
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Body Analysis */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Body Analysis</h3>
              <div className="space-y-4">
                {[
                  { label: 'BMI', formula: 'Quetelet Index', value: plan.bmi, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Body Fat %', formula: 'Deurenberg Formula', value: plan.bodyFat + '%', color: 'bg-purple-50 text-purple-600' },
                  { label: 'Lean Mass', formula: 'LBM Calculation', value: plan.leanMass + ' kg', color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Ideal Weight', formula: 'Devine Formula', value: plan.idealWeight + ' kg', color: 'bg-amber-50 text-amber-600' },
                ].map(item => (
                  <div key={item.label} className={`flex justify-between items-center p-4 rounded-2xl ${item.color}`}>
                    <div>
                      <div className="font-black text-xs uppercase tracking-tighter opacity-70">{item.label}</div>
                      <div className="text-[10px] font-bold opacity-50">{item.formula}</div>
                    </div>
                    <div className="text-2xl font-black">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Roadmap */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ color: goalCfg.color }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Goal Roadmap</h3>
              <div className="text-center mb-8">
                <div className="text-sm font-bold text-slate-400 uppercase">Daily Target</div>
                <div className="text-6xl font-serif font-black" style={{ color: goalCfg.color }}>{plan.targetCal}</div>
                <div className="text-xs font-bold text-slate-400">calories per day</div>
              </div>

              {plan.weightToGoal > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Progress to Ideal Weight</span>
                    <span className="text-forest">~{plan.weeksToGoal} weeks</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-forest w-[15%] rounded-full"></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Protein', g: plan.protein, p: plan.macroSplits.pP, c: 'bg-red-500' },
                  { label: 'Carbs', g: plan.carbs, p: plan.macroSplits.cP, c: 'bg-yellow-500' },
                  { label: 'Fat', g: plan.fat, p: plan.macroSplits.fP, c: 'bg-blue-500' },
                ].map(m => (
                  <div key={m.label} className="text-center p-3 rounded-2xl bg-slate-50">
                    <div className="text-[10px] font-black uppercase text-slate-400">{m.label}</div>
                    <div className="font-bold text-slate-800">{m.g}g</div>
                    <div className={`h-1 w-8 mx-auto mt-1 rounded-full ${m.c}`}></div>
                    <div className="text-[10px] font-bold text-slate-500 mt-1">{m.p}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Advice */}
          {conditionAdvice.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionAdvice.map(a => (
                <div key={a.condition} className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                  <div className="text-3xl">⚕️</div>
                  <div>
                    <div className="font-black text-amber-800 uppercase text-xs tracking-widest mb-1">{a.condition} Adjustment</div>
                    <p className="text-sm font-bold text-amber-700 leading-relaxed">{a.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Expert Tips */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">💡</div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {days.map(d => {
              const hasData = apiDietPlan && apiDietPlan.week && apiDietPlan.week[d.toLowerCase()];
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedDay === d ? 'bg-forest text-white' : 'bg-white text-slate-500'} ${!hasData && apiDietPlan ? 'opacity-50' : ''}`}
                >
                  {d.substring(0, 3)}
                </button>
              );
            })}
          </div>

          {isGeneratingPlan ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-bold text-slate-500 animate-pulse">Generating your professional 7-day plan...</p>
            </div>
          ) : apiDietPlan ? (
            <div className="space-y-4">
              {(apiDietPlan.week[selectedDay.toLowerCase()]?.meals || []).map((m, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] bg-white shadow-md border border-slate-50 group hover:border-forest/20 transition-all">
                  <div className="w-32">
                    <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                      Meal {idx + 1}
                    </span>
                    <div className="text-xs font-bold text-slate-400 mt-2">{m.readyInMinutes} mins prep</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-800 group-hover:text-forest transition-colors">{m.title}</p>
                    <div className="text-[10px] font-black text-slate-400 uppercase mt-1">Servings: {m.servings}</div>
                  </div>
                  <a
                    href={m.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-forest/5 text-forest px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-forest hover:text-white transition-all"
                  >
                    View Recipe
                  </a>
                </div>
              ))}
              {!apiDietPlan.week[selectedDay.toLowerCase()] && (
                <div className="p-8 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                  No professional data for {selectedDay}. Defaulting to local suggestions.
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {dailyMeals.map((m, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] bg-white shadow-md border border-slate-50 group hover:border-forest/20 transition-all">
                    <div className="w-32">
                      <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase">{m.label}</span>
                      <div className="text-xs font-bold text-slate-400 mt-2">{m.time}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-slate-800 group-hover:text-forest transition-colors">{m.food}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center flex-wrap gap-4 w-full">
                  <div className="font-bold text-slate-500">Daily Target: <span className="text-slate-800">{plan.targetCal} kcal</span></div>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase">
                    <span>P: {plan.protein}g</span>
                    <span>C: {plan.carbs}g</span>
                    <span>F: {plan.fat}g</span>
                  </div>
                </div>
                {!isGeneratingPlan && (
                  <button
                    onClick={onRefreshPlan}
                    className="bg-forest text-white px-8 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-lg shadow-forest/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    🔄 Refresh Professional Plan
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
          {[
            { label: 'BMI', value: plan.bmi, desc: 'Your height-to-weight ratio.', badge: 'General Health' },
            { label: 'Body Fat %', value: plan.bodyFat + '%', desc: 'Estimated fat percentage.', badge: 'Deurenberg' },
            { label: 'Lean Mass', value: plan.leanMass + ' kg', desc: 'Weight excluding body fat.', badge: 'Muscle/Bone' },
            { label: 'Ideal Weight', value: plan.idealWeight + ' kg', desc: 'Based on your height/gender.', badge: 'Devine' },
            { label: 'BMR', value: plan.bmr + ' kcal', desc: 'Calories burned at rest.', badge: 'Metabolism' },
            { label: 'TDEE', value: plan.tdee + ' kcal', desc: 'Total daily energy used.', badge: 'Active Burn' },
            { label: 'Daily Water', value: plan.water + ' L', desc: 'Optimized hydration target.', badge: 'Smart Hub' },
            { label: 'Daily Fiber', value: plan.fiber + ' g', desc: 'For digestive/metabolic health.', badge: '14g/1000kcal' },
          ].map(m => (
            <div key={m.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.label}</div>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase">{m.badge}</span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-2">{m.value}</div>
              <p className="text-[10px] font-bold text-slate-400 leading-tight">{m.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'micro' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Vitamin C', emoji: '🍊', rda: plan.rda.vitC + ' mg', sources: 'Bell peppers, Broccoli, Oranges', benefit: 'Immunity & Skin' },
              { label: 'Calcium', emoji: '🥛', rda: plan.rda.calcium + ' mg', sources: 'Dairy, Kale, Almonds, Tofu', benefit: 'Bone Density' },
              { label: 'Iron', emoji: '🥩', rda: plan.rda.iron + ' mg', sources: 'Red meat, Spinach, Lentils', benefit: 'Energy & Blood Health' },
              { label: 'Vitamin D', emoji: '☀️', rda: plan.rda.vitD + ' IU', sources: 'Sunlight, Fatty fish, Eggs', benefit: 'Calcium absorption' },
              { label: 'Potassium', emoji: '🍌', rda: plan.rda.potassium + ' mg', sources: 'Bananas, Potatoes, Avocado', benefit: 'Heart & Muscles' },
              { label: 'Magnesium', emoji: '🥜', rda: plan.rda.magnesium + ' mg', sources: 'Nuts, Seeds, Dark chocolate', benefit: 'Sleep & Nerve health' },
            ].map(m => (
              <div key={m.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{m.emoji}</div>
                  <div>
                    <h4 className="font-bold text-slate-800">{m.label}</h4>
                    <div className="text-xs font-black text-forest">Target: {m.rda}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Top Sources</div>
                    <div className="text-xs font-bold text-slate-600">{m.sources}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-50 italic text-[10px] font-bold text-slate-400">
                    Benefit: {m.benefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl bg-blue-50 text-blue-700 text-xs font-bold text-center">
            ⚠️ Warning: Consult a registered dietitian for personalized planning. These are general RDA targets based on your profile.
          </div>
        </div>
      )}
    </div>
  );
};


const USDASearchPanel = ({ onAddFood, fetchUSDANutrition }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState('Vegetables');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await fetchUSDANutrition(query);
      setResult(data);
    } catch (e) {
      console.error("Search Error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 mb-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔬</span>
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-800">Search Real Food Data</h3>
          <p className="text-xs font-bold text-slate-400">Powered by USDA Database</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type any food (e.g. Avocado, Salmon...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-6 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-forest transition-all"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-forest border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-forest text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-forest/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {result === null && query && !loading && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
          No matches found in USDA or Local Database for "{query}".
        </div>
      )}

      {result && (
        <div className="p-6 rounded-3xl bg-green-50 border border-green-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-800">{result.name}</h4>
                <span className="bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">USDA ✓</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-tight max-w-sm">{result.usdaName}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase">Energy</div>
              <div className="text-2xl font-black text-forest">{Math.round(result.calories)} kcal</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Prot', value: result.protein + 'g' },
              { label: 'Carb', value: result.carbs + 'g' },
              { label: 'Fat', value: result.fat + 'g' },
              { label: 'Fiber', value: result.fiber + 'g' },
              { label: 'Vit C', value: result.vitC + 'mg' },
              { label: 'Calc', value: result.calcium + 'mg' },
              { label: 'Iron', value: result.iron + 'mg' },
              { label: 'Source', value: 'USDA' },
            ].map(n => (
              <div key={n.label} className="bg-white/50 p-2 rounded-xl text-center">
                <div className="text-[8px] font-black text-slate-400 uppercase">{n.label}</div>
                <div className="text-xs font-bold text-slate-700">{n.value === "0mg" ? "—" : n.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border-slate-200 rounded-xl font-bold text-sm px-4 py-2"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button
              onClick={() => {
                onAddFood({ ...result, category, emoji: '🔬', id: Date.now() });
                setResult(null);
                setQuery('');
              }}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              + Add to Plate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AccountSettings = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: isNaN(value) ? value : Number(value) }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">✕</button>
        <h2 className="text-2xl font-serif font-black text-slate-800 mb-6 flex items-center gap-3">
          <span className="text-3xl">⚙️</span> Account Settings
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Age</label>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Weight (kg)</label>
              <input name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Height (cm)</label>
              <input name="height" type="number" value={formData.height} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm">
              <option value="lose-weight">Lose Weight</option>
              <option value="gain-muscle">Gain Muscle</option>
              <option value="maintain">Maintain Health</option>
              <option value="improve-health">Improve Overall Health</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 ml-1">Activity Level</label>
            <select name="activity" value={formData.activity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-forest transition-all font-bold text-sm">
              <option value="sedentary">Sedentary (mostly sitting)</option>
              <option value="lightly-active">Lightly Active (1-2 days/week)</option>
              <option value="moderately-active">Moderately Active (3-5 days/week)</option>
              <option value="very-active">Very Active (6+ days/week)</option>
            </select>
          </div>

          <button
            onClick={() => onSave(formData)}
            className="w-full py-4 bg-forest text-white rounded-2xl font-black shadow-lg shadow-forest/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileDropdown = ({ user, onClose, setShowSettings }) => {
  const plan = calculateDiet(user);
  return (
    <div className="absolute top-20 right-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif font-bold text-xl text-slate-800">Your Profile</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
          <div className="text-3xl">👤</div>
          <div>
            <div className="font-bold text-slate-800">{user.fullName}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.goal.replace('-', ' ')}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Age', v: `${user.age}y` },
            { l: 'Weight', v: `${user.weight}kg` },
            { l: 'Height', v: `${user.height}cm` },
            { l: 'BMI', v: plan.bmi, c: plan.bmi < 18.5 ? 'text-blue-500' : plan.bmi < 25 ? 'text-green-500' : plan.bmi < 30 ? 'text-amber-500' : 'text-red-500' },
            { l: 'Activity', v: user.activity.split('-')[0], cap: true },
            { l: 'Diet', v: user.diet },
          ].map(i => (
            <div key={i.l} className="p-2.5 rounded-xl border border-slate-50 bg-white shadow-sm">
              <div className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{i.l}</div>
              <div className={`text-xs font-bold ${i.c || 'text-slate-700'} ${i.cap ? 'capitalize' : ''}`}>{i.v}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
          <div className="flex justify-between text-[10px] font-black text-green-600 uppercase mb-2">
            <span>Daily Targets</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <div>🔥 {plan.targetCal} kcal</div>
            <div>🍗 {plan.protein}g P</div>
          </div>
        </div>

        {user.allergies[0] !== 'None' && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold flex items-center gap-2">
            <span>⚠️</span> Allergies: {user.allergies.join(', ')}
          </div>
        )}

        <button
          onClick={() => { setShowSettings(true); onClose(); }}
          className="w-full py-3 mt-2 rounded-xl bg-forest/10 text-forest font-bold text-xs hover:bg-forest hover:text-white transition-all"
        >
          ⚙️ Edit Profile / Settings
        </button>
      </div>
    </div>
  );
};

const GoalCard = ({ user, onSeeFullPlan }) => {
  const plan = calculateDiet(user);
  const goalCfg = GET_GOAL_CONFIG(user.goal);

  return (
    <div className="p-6 rounded-[2.5rem] shadow-lg text-white mb-6 relative overflow-hidden group" style={{ background: `linear-gradient(135deg, ${goalCfg.color}, ${goalCfg.color}dd)` }}>
      <div className="relative z-10">
        <h3 className="font-serif font-bold text-lg mb-4">{goalCfg.title}</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Target kcal', v: plan.targetCal, i: '🔥' },
            { label: 'Protein', v: plan.protein + 'g', i: '🥩' },
            { label: 'Carbs', v: plan.carbs + 'g', i: '🌾' },
            { label: 'Water', v: plan.water + 'L', i: '💧' },
          ].map(c => (
            <div key={c.label} className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-[8px] font-black uppercase opacity-60 mb-0.5">{c.label}</div>
              <div className="text-sm font-bold flex items-center gap-1"><span>{c.i}</span> {c.v}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onSeeFullPlan}
          className="text-white bg-white/10 hover:bg-white/20 px-4 py-3 rounded-2xl text-xs font-bold transition-all w-full border border-white/20 backdrop-blur-sm"
        >
          View Full Diet Plan →
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [plateItems, setPlateItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecipePanel, setShowRecipePanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [realRecipes, setRealRecipes] = useState([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [apiDietPlan, setApiDietPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Restore session
  useEffect(() => {
    const session = getSession();
    if (session && session.email) {
      const users = getUsers();
      if (users[session.email]) {
        setUser(users[session.email]);
        setPage('app');
      }
    }
  }, []);

  // Sync plate items for current user
  useEffect(() => {
    if (user && page === 'app') {
      const saved = localStorage.getItem(`hp_plate_${user.email}`);
      setPlateItems(saved ? JSON.parse(saved) : []);
    }
  }, [user, page]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`hp_plate_${user.email}`, JSON.stringify(plateItems));
    }
  }, [plateItems, user]);

  useEffect(() => {
    const fetchApiRecipes = async () => {
      if (showRecipePanel && plateItems.length > 0) {
        setLoadingReal(true);
        const real = await fetchRealRecipes(plateItems.map(i => i.name));
        if (real && real.length > 0) {
          // Fetch YouTube metadata for the first few recipes
          const enriched = await Promise.all(real.map(async (r) => {
            const video = await fetchRecipeVideo(r.name);
            return { ...r, video };
          }));
          setRealRecipes(enriched);
        } else {
          setRealRecipes([]);
        }
        setLoadingReal(false);
      }
    };
    fetchApiRecipes();
  }, [showRecipePanel, plateItems.length]);

  const handleLogin = (u) => {
    setUser(u);
    setPage('app');
  };

  const handleLogout = () => {
    saveSession(null);
    setUser(null);
    setPage('login');
  };

  const addFood = (food) => {
    setPlateItems([...plateItems, { ...food, id: Date.now() + Math.random() }]);
  };

  const removeFood = (id) => {
    setPlateItems(plateItems.filter(item => item.id !== id));
  };

  const resetPlate = () => {
    if (confirm('Clear all items from your plate?')) {
      setPlateItems([]);
    }
  };

  const copySummary = () => {
    const totalCals = plateItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = plateItems.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = plateItems.reduce((sum, item) => sum + item.carbs, 0);
    const totalFat = plateItems.reduce((sum, item) => sum + item.fat, 0);
    const score = calculateBalanceScore(plateItems);

    const summaryText = `
      🥗 HealthyPlate Meal Summary (for ${user.fullName})
      ----------------------------
      Items: ${plateItems.map(i => `${i.emoji} ${i.name}`).join(', ')}

      Total Nutrition:
      - Calories: ${totalCals.toFixed(1)} kcal
      - Protein: ${totalProtein.toFixed(1)}g
      - Carbs: ${totalCarbs.toFixed(1)}g
      - Fat: ${totalFat.toFixed(1)}g

      Balance Score: ${score}%
      `.trim();

    navigator.clipboard.writeText(summaryText);
    alert('Summary copied to clipboard!');
  };

  const filteredFoods = FOOD_DATABASE[activeCategory].filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = plateItems.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat,
    fiber: acc.fiber + (item.fiber || 0),
    vitC: acc.vitC + (item.vitC || 0),
    calcium: acc.calcium + (item.calcium || 0),
    iron: acc.iron + (item.iron || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vitC: 0, calcium: 0, iron: 0 });

  const score = calculateBalanceScore(plateItems);
  const suggestions = getRecipeSuggestions(plateItems);
  const plan = user ? calculateDiet(user) : null;

  // --- API SERVICES ---

  const fetchUSDANutrition = async (query) => {
    // Attempt local search first for speed or demo
    const localMatch = Object.values(FOOD_DATABASE)
      .flat()
      .find(f => f.name.toLowerCase().includes(query.toLowerCase()));

    if (!USDA_API_KEY || USDA_API_KEY === "D0WYpIpDKSAWhX9OijB8DHed4jFaXIc2zpMf01bG") {
      return localMatch ? { ...localMatch, source: 'Local Fallback' } : null;
    }

    try {
      const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=1&api_key=${USDA_API_KEY}`);
      const data = await res.json();
      if (data.foods && data.foods[0]) {
        const f = data.foods[0];
        const getNutrient = (name) => {
          const n = f.foodNutrients.find(nut => nut.nutrientName.toLowerCase().includes(name.toLowerCase()));
          return n ? n.value : 0;
        };
        return {
          name: f.description,
          usdaName: f.description,
          calories: getNutrient('Energy'),
          protein: getNutrient('Protein'),
          carbs: getNutrient('Carbohydrate'),
          fat: getNutrient('Total lipid'),
          fiber: getNutrient('Fiber'),
          vitC: getNutrient('Vitamin C'),
          calcium: getNutrient('Calcium'),
          iron: getNutrient('Iron'),
          source: 'USDA'
        };
      }
    } catch (e) {
      console.error("USDA API Error", e);
    }

    // Final fallback to local if API fails
    return localMatch ? { ...localMatch, source: 'Local Fallback' } : null;
  };

  const fetchRealRecipes = async (ingredients) => {
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "f796c8a30ef7484681b5f9070dbf5a7a") return null;
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.slice(0, 5).join(',')}&number=9&ranking=1&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(r => ({
          id: r.id,
          name: r.title,
          image: r.image,
          usedCount: r.usedIngredientCount,
          missedCount: r.missedIngredientCount,
          usedIngredients: r.usedIngredients.map(i => i.name),
          missedIngredients: r.missedIngredients.map(i => i.name),
          progress: r.usedIngredientCount / (r.usedIngredientCount + r.missedIngredientCount)
        }));
      }
    } catch (e) { console.error("Spoonacular API Error", e); }
    return null;
  };

  const fetchRecipeVideo = async (recipeName) => {
    if (YOUTUBE_API_KEY === "YOUR_YOUTUBE_KEY") return null;
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(recipeName + " healthy recipe")}&type=video&maxResults=1&videoCategoryId=26&key=${YOUTUBE_API_KEY}`);
      const data = await res.json();
      if (data.items && data.items[0]) {
        const v = data.items[0];
        return {
          videoId: v.id.videoId,
          title: v.snippet.title.substring(0, 50),
          channel: v.snippet.channelTitle,
          thumbnail: v.snippet.thumbnails.medium.url
        };
      }
    } catch (e) { console.error("YouTube API Error", e); }
    return null;
  };

  const fetchProfessionalMealPlan = async (u) => {
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "f796c8a30ef7484681b5f9070dbf5a7a") {
      return;
    }

    setIsGeneratingPlan(true);
    const d = calculateDiet(u || user);
    const diet = u?.diet || user?.diet || '';

    try {
      const res = await fetch(`https://api.spoonacular.com/mealplanner/generate?timeFrame=week&targetCalories=${d.targetCal}&diet=${diet}&apiKey=${SPOONACULAR_API_KEY}`);
      const data = await res.json();
      if (data.week) {
        setApiDietPlan(data);
      }
    } catch (err) {
      console.error("Failed to fetch professional meal plan", err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  useEffect(() => {
    if (page === 'plan' && !apiDietPlan && user) {
      fetchProfessionalMealPlan(user);
    }
  }, [page, user, apiDietPlan]);

  if (page === 'login') return <LoginScreen onLogin={handleLogin} onNavigate={setPage} />;
  if (page === 'signup') return <SignupWizard onSignup={(u) => { handleLogin(u); fetchProfessionalMealPlan(u); }} onNavigate={setPage} />;
  if (page === 'plan') return <DietPlanScreen user={user} onBack={() => setPage('app')} apiDietPlan={apiDietPlan} isGeneratingPlan={isGeneratingPlan} onRefreshPlan={() => fetchProfessionalMealPlan(user)} />;

  // SVG Pie Chart Logic
  const getSlices = () => {
    if (plateItems.length === 0) return null;
    let currentAngle = 0;
    const total = plateItems.length;

    return plateItems.map((item, index) => {
      const sliceAngle = (1 / total) * 360;
      const startAngle = currentAngle;
      currentAngle += sliceAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (currentAngle - 90) * (Math.PI / 180);
      const x1 = 100 + 95 * Math.cos(startRad);
      const y1 = 100 + 95 * Math.sin(startRad);
      const x2 = 100 + 95 * Math.cos(endRad);
      const y2 = 100 + 95 * Math.sin(endRad);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const path = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const midRad = (startAngle + sliceAngle / 2 - 90) * (Math.PI / 180);
      const emojiX = 100 + 60 * Math.cos(midRad);
      const emojiY = 100 + 60 * Math.sin(midRad);

      return (
        <g key={item.id} className="plate-segment-transition group/segment">
          <path
            d={path}
            fill={CATEGORY_HEX[item.category]}
            fillOpacity="0.85"
            className="hover:fill-opacity-100 transition-all duration-300 cursor-pointer"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <text
            x={emojiX}
            y={emojiY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl pointer-events-none drop-shadow-sm group-hover/segment:scale-125 transition-transform"
          >
            {item.emoji}
          </text>
        </g>
      );
    });
  };

  const getGlobalYTQuery = () => {
    const ingredients = [...new Set(plateItems.map(i => i.name))].join('+');
    return `https://www.youtube.com/results?search_query=healthy+recipe+with+${ingredients}`;
  };



  const badge = getScoreBadge(score);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-forest/10 selection:text-forest overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="bg-white/70 backdrop-blur-2xl sticky top-0 z-40 px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-3xl bg-forest/10 p-2 rounded-2xl">🥗</div>
          <div>
            <h1 className="text-2xl font-serif font-black text-forest tracking-tight">HealthyPlate</h1>
            <div className="flex items-center gap-2">
              {/* <span className="text-[10px] font-black bg-forest text-white px-2 py-0.5 rounded uppercase tracking-tighter">Pro</span> */}
              {/* <span className="text-[10px] font-bold text-slate-400">v2.0 API-Enhanced</span> */}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setPage('plan')}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            📋 Diet Plan
          </button>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            👤 Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            Logout
          </button>

          <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

          {plateItems.length > 0 && (
            <button
              onClick={() => setShowRecipePanel(!showRecipePanel)}
              className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg relative"
            >
              🎬 Recipe Videos
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-red-600 shadow-sm animate-bounce">
                {suggestions.length}
              </span>
            </button>
          )}
          <button
            onClick={resetPlate}
            className="px-4 py-2 rounded-full backdrop-blur-md bg-white/30 border border-white/50 text-forest font-semibold hover:bg-white/50 transition-colors flex items-center gap-2"
          >
            🗑 Reset
          </button>
          <button
            onClick={copySummary}
            className="px-4 py-2 rounded-full bg-forest text-white font-semibold hover:bg-forest/90 transition-colors flex items-center gap-2 shadow-lg"
          >
            📋 Copy
          </button>
        </div>
      </header>

      {showProfile && <ProfileDropdown user={user} onClose={() => setShowProfile(false)} setShowSettings={setShowSettings} />}
      {showSettings && <AccountSettings user={user} onClose={() => setShowSettings(false)} onSave={(updated) => {
        const users = getUsers();
        users[user.email] = updated;
        saveUsers(users);
        setUser(updated);
        setShowSettings(false);
      }} />}

      {/* YouTube Recipe Panel */}
      {showRecipePanel && plateItems.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 px-4">
          <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-white to-red-500"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <span className="text-3xl text-red-500">🎬</span> Recipe Videos for Your Ingredients
                </h2>
                <p className="text-slate-400 mt-1">We found {realRecipes.length > 0 ? realRecipes.length : suggestions.length} recipes matching your plate! {realRecipes.length > 0 ? '(Live API Results)' : '(Local Database Hits)'}</p>
              </div>
              <button
                onClick={() => window.open(getGlobalYTQuery(), '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
              >
                🚀 Search All on YouTube
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingReal && [1, 2, 3].map(n => (
                <div key={n} className="bg-slate-800/50 p-5 rounded-2xl animate-pulse h-64 border border-slate-700"></div>
              ))}

              {!loadingReal && realRecipes.length > 0 && realRecipes.map(recipe => (
                <div key={recipe.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-red-500/50 transition-all group flex flex-col justify-between overflow-hidden">
                  <div className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    {recipe.video && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-red-600/90 text-white text-[8px] font-black px-2 py-1 rounded uppercase">
                        <span>Video Available</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-red-400 transition-colors line-clamp-1">{recipe.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.usedIngredients.slice(0, 3).map(ing => (
                      <span key={ing} className="bg-green-500/10 text-green-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase border border-green-500/20">{ing}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => window.open(recipe.video ? `https://www.youtube.com/watch?v=${recipe.video.videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.name + " recipe")}`, '_blank')}
                    className="mt-auto w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                    {recipe.video ? 'Watch Real Recipe' : 'Search Video'}
                  </button>
                </div>
              ))}

              {!loadingReal && realRecipes.length === 0 && suggestions.map(recipe => (
                <div key={recipe.name} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-red-500/50 transition-all group flex flex-col justify-between">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl">{recipe.emoji}</span>
                      {recipe.progress === 1 && (
                        <span className="bg-green-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-tighter shadow-sm">Perfect Match</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-red-400 transition-colors">{recipe.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{recipe.desc}</p>
                    <button
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.ytQuery)}`, '_blank')}
                      className="mt-auto w-full py-3 bg-red-600/10 text-red-500 border border-red-500/30 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                      Watch on YouTube
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRecipePanel(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

          {/* Left Column: Food Library */}
          <div className="lg:col-span-12 xl:col-span-8 order-2 xl:order-1" id="food-library">
            <USDASearchPanel onAddFood={addFood} fetchUSDANutrition={fetchUSDANutrition} />

            <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-3xl font-serif font-black text-slate-800">Food Library</h2>
                <div className="flex gap-2 p-2 bg-slate-50/50 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap border border-slate-100 relative mb-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSearchTerm('');
                      }}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-block ${activeCategory === cat ? 'bg-forest text-white shadow-md scale-105 z-10' : 'bg-white/50 text-slate-400 hover:text-forest'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative mb-8 group">
                <input
                  type="text"
                  placeholder="Filter local database..."
                  className="w-full pl-6 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-forest transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredFoods.map(food => (
                  <button
                    key={`${food.category}-${food.name}`}
                    onClick={() => addFood(food)}
                    className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-forest hover:shadow-xl hover:shadow-forest/5 transition-all group relative overflow-hidden text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{food.emoji}</span>
                      {food.source === 'USDA' && <span className="bg-green-600 text-white text-[6px] font-black px-1 rounded uppercase">USDA</span>}
                    </div>
                    <div className="font-bold text-slate-800 group-hover:text-forest transition-colors leading-tight mb-1">{food.name}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase">{food.calories} kcal</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Plate Builder */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8 order-1 xl:order-2" id="plate-section">
            <GoalCard user={user} onSeeFullPlan={() => setPage('plan')} />

            <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-50 relative">
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-6 flex justify-between items-center">
                Your Plate
                <span className="text-xs font-black text-forest bg-forest/5 px-2 py-1 rounded-lg">
                  {plateItems.filter(i => i.source === 'USDA').length} USDA verified
                </span>
              </h3>

              <div className="aspect-square w-full max-w-[340px] mx-auto mb-8 relative plate-segment-transition">
                <svg viewBox="0 0 200 200" className="drop-shadow-3xl filter saturate-150">
                  <defs>
                    <radialGradient id="plateGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f8fafc" />
                    </radialGradient>
                    <filter id="inner-shadow">
                      <feOffset dx="0" dy="1" />
                      <feGaussianBlur stdDeviation="1" result="offset-blur" />
                      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                      <feFlood floodColor="black" floodOpacity="0.05" result="color" />
                      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                      <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                  </defs>
                  <circle cx="100" cy="100" r="98" fill="url(#plateGradient)" stroke="#f1f5f9" strokeWidth="4" filter="url(#inner-shadow)" />
                  <circle cx="100" cy="100" r="95" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Decorative Guides */}
                  <line x1="100" y1="5" x2="100" y2="195" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="5" y1="100" x2="195" y2="100" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" />

                  {/* Dynamic Slices */}
                  {getSlices()}

                  <circle cx="100" cy="100" r="30" fill="#ffffff" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="100" cy="100" r="28" fill={plateItems.some(i => i.category === 'Dairy') ? "#3b82f6aa" : "#f1f5f9"} />
                  {plateItems.some(i => i.category === 'Dairy') && <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-xl">🥛</text>}
                </svg>
                {plateItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-center p-10">
                    <div className="text-slate-300 font-bold text-sm italic">Add food to start visualizing!</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {plateItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group animate-in zoom-in duration-300">
                    <span className="text-sm font-bold text-slate-700">{item.emoji} {item.name}</span>
                    <button onClick={() => removeFood(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Plate Summary</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Energy', val: totals.calories, target: plan.targetCal, color: totals.calories > plan.targetCal ? 'bg-red-500' : 'bg-forest', unit: 'kcal' },
                    { label: 'Protein', val: totals.protein, target: plan.protein, color: 'bg-red-400', unit: 'g' },
                    { label: 'Carbs', val: totals.carbs, target: plan.carbs, color: 'bg-yellow-400', unit: 'g' },
                    { label: 'Fiber', val: totals.fiber, target: plan.fiber, color: 'bg-emerald-400', unit: 'g' }
                  ].map(bar => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span className="text-slate-500">{bar.label}</span>
                        <span className="text-slate-800">{Math.round(bar.val)} / {bar.target}{bar.unit}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${bar.color}`} style={{ width: `${Math.min(100, (bar.val / bar.target) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50">
                  {[
                    { l: 'Vit C', v: totals.vitC, t: plan.rda.vitC },
                    { l: 'Calc', v: totals.calcium, t: plan.rda.calcium },
                    { l: 'Iron', v: totals.iron, t: plan.rda.iron },
                  ].map(m => (
                    <div key={m.l} className="text-center p-2 rounded-xl bg-blue-50/50">
                      <div className="text-[8px] font-black text-blue-400 uppercase">{m.l}</div>
                      <div className="text-[10px] font-black text-blue-600">{Math.round(m.v)}/{m.t}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-3xl bg-slate-900 shadow-xl relative overflow-hidden mt-6">
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Health Score</div>
                      <div className="text-2xl font-black text-white">{score}%</div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${badge.color} text-white`}>
                      {badge.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => document.getElementById('food-library')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:hidden bg-forest text-white py-4 rounded-2xl font-bold shadow-lg mt-4"
            >
              🥗 Add More Food
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-10 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2026 HealthyPlate • Free online healthy meal planner with personalized nutrition profiling</p>
        <p> <b>Powered by: </b><u><a href="https://www.devtechservicesindia.com/">Dev Tech Services India</a></u></p>
      </footer>
    </div>
  );
}