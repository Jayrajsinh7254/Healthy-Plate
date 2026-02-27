import React, { useState, useEffect, useCallback } from 'react';

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024, w };
}

// ─── API KEYS ─────────────────────────────────────────────────────────────────
const USDA_API_KEY = "D0WYpIpDKSAWhX9OijB8DHed4jFaXIc2zpMf01bG";
const SPOONACULAR_API_KEY = "f796c8a30ef7484681b5f9070dbf5a7a";
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_KEY";

// ─── LOCALSTORAGE HELPERS ────────────────────────────────────────────────────
const getUsers = () => { try { return JSON.parse(localStorage.getItem('hp_users') || '{}'); } catch { return {}; } };
const saveUsers = u => localStorage.setItem('hp_users', JSON.stringify(u));
const getSession = () => { try { return JSON.parse(localStorage.getItem('hp_session') || 'null'); } catch { return null; } };
const saveSession = s => localStorage.setItem('hp_session', s ? JSON.stringify(s) : 'null');

// ─── MEAT DETECTION ──────────────────────────────────────────────────────────
const MEAT_KEYWORDS = ['Chicken', 'Salmon', 'Tuna', 'Beef', 'Pork', 'Turkey', 'Shrimp', 'Cod', 'Tilapia', 'Sardines', 'Crab', 'Lobster', 'Scallops', 'Steak', 'Lamb', 'Bacon', 'Jerky', 'Sausage', 'Ham', 'Pepperoni', 'Salami', 'Mutton', 'Venison', 'Duck', 'Goose', 'Anchovies', 'Swordfish'];
const IS_NON_VEG = name => MEAT_KEYWORDS.some(m => name.toLowerCase().includes(m.toLowerCase()));

// ─── FOOD DATABASE ────────────────────────────────────────────────────────────
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
    { name: 'Beets', emoji: '🟣', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables', vitC: 4.9, calcium: 16, iron: 0.8, source: 'local' },
    { name: 'Sweet Corn', emoji: '🌽', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2, category: 'Vegetables', vitC: 6.8, calcium: 2, iron: 0.5, source: 'local' },
    { name: 'Green Peas', emoji: '🫛', calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1, category: 'Vegetables', vitC: 40, calcium: 25, iron: 1.5, source: 'local' },
    { name: 'Cabbage', emoji: '🥬', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, category: 'Vegetables', vitC: 36.6, calcium: 40, iron: 0.5, source: 'local' },
    { name: 'Sweet Potato', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: 'Vegetables', vitC: 2.4, calcium: 30, iron: 0.6, source: 'local' },
    { name: 'Lettuce', emoji: '🥬', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, category: 'Vegetables', vitC: 9.2, calcium: 36, iron: 0.9, source: 'local' },
    { name: 'Edamame', emoji: '🫛', calories: 122, protein: 10.9, carbs: 9.9, fat: 5.2, fiber: 5.2, category: 'Vegetables', vitC: 6.1, calcium: 63, iron: 2.3, source: 'local' },
    { name: 'Artichoke', emoji: '🌿', calories: 47, protein: 3.3, carbs: 10.5, fat: 0.2, fiber: 5.4, category: 'Vegetables', vitC: 11.7, calcium: 44, iron: 1.3, source: 'local' },
    { name: 'Pumpkin', emoji: '🎃', calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, category: 'Vegetables', vitC: 9, calcium: 21, iron: 0.8, source: 'local' },
    { name: 'Bok Choy', emoji: '🥬', calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2, fiber: 1, category: 'Vegetables', vitC: 45, calcium: 105, iron: 0.8, source: 'local' },
    { name: 'Swiss Chard', emoji: '🥬', calories: 19, protein: 1.8, carbs: 3.7, fat: 0.2, fiber: 1.6, category: 'Vegetables', vitC: 30, calcium: 51, iron: 1.8, source: 'local' },
    { name: 'Leek', emoji: '🧅', calories: 61, protein: 1.5, carbs: 14, fat: 0.3, fiber: 1.8, category: 'Vegetables', vitC: 12, calcium: 59, iron: 2.1, source: 'local' },
    { name: 'Radish', emoji: '🌱', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6, category: 'Vegetables', vitC: 14.8, calcium: 25, iron: 0.3, source: 'local' },
    { name: 'Arugula', emoji: '🥬', calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, category: 'Vegetables', vitC: 15, calcium: 160, iron: 1.5, source: 'local' },
    { name: 'Fennel', emoji: '🌿', calories: 31, protein: 1.2, carbs: 7.3, fat: 0.2, fiber: 3.1, category: 'Vegetables', vitC: 12, calcium: 49, iron: 0.7, source: 'local' },
    { name: 'Turnip', emoji: '🟣', calories: 28, protein: 0.9, carbs: 6.4, fat: 0.1, fiber: 1.8, category: 'Vegetables', vitC: 21, calcium: 30, iron: 0.3, source: 'local' },
    { name: 'Watercress', emoji: '🌿', calories: 11, protein: 2.3, carbs: 1.3, fat: 0.1, fiber: 0.5, category: 'Vegetables', vitC: 43, calcium: 120, iron: 0.2, source: 'local' },
    { name: 'Kohlrabi', emoji: '🥦', calories: 27, protein: 1.7, carbs: 6.2, fat: 0.1, fiber: 3.6, category: 'Vegetables', vitC: 62, calcium: 24, iron: 0.4, source: 'local' },
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
    { name: 'Watermelon', emoji: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, category: 'Fruits', vitC: 8.1, calcium: 7, iron: 0.2, source: 'local' },
    { name: 'Kiwi', emoji: '🥝', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, category: 'Fruits', vitC: 92.7, calcium: 34, iron: 0.3, source: 'local' },
    { name: 'Avocado', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, category: 'Fruits', vitC: 10, calcium: 12, iron: 0.6, source: 'local' },
    { name: 'Papaya', emoji: '🍈', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, category: 'Fruits', vitC: 60.9, calcium: 20, iron: 0.3, source: 'local' },
    { name: 'Cherry', emoji: '🍒', calories: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 1.6, category: 'Fruits', vitC: 7, calcium: 13, iron: 0.4, source: 'local' },
    { name: 'Peach', emoji: '🍑', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, category: 'Fruits', vitC: 6.6, calcium: 6, iron: 0.3, source: 'local' },
    { name: 'Pear', emoji: '🍐', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, category: 'Fruits', vitC: 4.3, calcium: 9, iron: 0.2, source: 'local' },
    { name: 'Raspberry', emoji: '🍓', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5, category: 'Fruits', vitC: 26.2, calcium: 25, iron: 0.7, source: 'local' },
    { name: 'Pomegranate', emoji: '🔴', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, category: 'Fruits', vitC: 10.2, calcium: 10, iron: 0.3, source: 'local' },
    { name: 'Blackberry', emoji: '🫐', calories: 43, protein: 1.4, carbs: 10, fat: 0.5, fiber: 5.3, category: 'Fruits', vitC: 21, calcium: 29, iron: 0.6, source: 'local' },
    { name: 'Plum', emoji: '🟣', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, category: 'Fruits', vitC: 9.5, calcium: 6, iron: 0.2, source: 'local' },
    { name: 'Apricot', emoji: '🍑', calories: 48, protein: 1.4, carbs: 11, fat: 0.4, fiber: 2, category: 'Fruits', vitC: 10, calcium: 13, iron: 0.4, source: 'local' },
    { name: 'Grapefruit', emoji: '🍊', calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6, category: 'Fruits', vitC: 31.2, calcium: 22, iron: 0.1, source: 'local' },
    { name: 'Lemon', emoji: '🍋', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, category: 'Fruits', vitC: 53, calcium: 26, iron: 0.6, source: 'local' },
    { name: 'Lime', emoji: '🍋', calories: 30, protein: 0.7, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Fruits', vitC: 29.1, calcium: 33, iron: 0.6, source: 'local' },
    { name: 'Guava', emoji: '🍏', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, category: 'Fruits', vitC: 228, calcium: 18, iron: 0.3, source: 'local' },
    { name: 'Coconut', emoji: '🥥', calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, category: 'Fruits', vitC: 3.3, calcium: 14, iron: 2.4, source: 'local' },
    { name: 'Dragon Fruit', emoji: '🍈', calories: 60, protein: 1.2, carbs: 13, fat: 0, fiber: 3, category: 'Fruits', vitC: 9, calcium: 8, iron: 0.7, source: 'local' },
    { name: 'Passion Fruit', emoji: '🟡', calories: 97, protein: 2.2, carbs: 23, fat: 0.7, fiber: 10.4, category: 'Fruits', vitC: 30, calcium: 12, iron: 1.6, source: 'local' },
    { name: 'Lychee', emoji: '🍈', calories: 66, protein: 0.8, carbs: 17, fat: 0.4, fiber: 1.3, category: 'Fruits', vitC: 71.5, calcium: 5, iron: 0.3, source: 'local' },
    { name: 'Cantaloupe', emoji: '🍈', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, category: 'Fruits', vitC: 36.7, calcium: 9, iron: 0.2, source: 'local' },
    { name: 'Fig', emoji: '🫐', calories: 74, protein: 0.8, carbs: 19, fat: 0.3, fiber: 2.9, category: 'Fruits', vitC: 2, calcium: 35, iron: 0.4, source: 'local' },
    { name: 'Jackfruit', emoji: '🍈', calories: 95, protein: 1.7, carbs: 25, fat: 0.6, fiber: 1.5, category: 'Fruits', vitC: 22.7, calcium: 27, iron: 0.2, source: 'local' },
    { name: 'Persimmon', emoji: '🟠', calories: 70, protein: 0.6, carbs: 19, fat: 0.2, fiber: 3.6, category: 'Fruits', vitC: 7.5, calcium: 8, iron: 0.2, source: 'local' },
    { name: 'Tangerine', emoji: '🍊', calories: 45, protein: 0.8, carbs: 11, fat: 0.2, fiber: 1.8, category: 'Fruits', vitC: 26.7, calcium: 37, iron: 0.1, source: 'local' },
    { name: 'Honeydew', emoji: '🍈', calories: 34, protein: 0.5, carbs: 8, fat: 0.2, fiber: 0.9, category: 'Fruits', vitC: 18.9, calcium: 7, iron: 0.2, source: 'local' },
  ],
  Proteins: [
    { name: 'Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Proteins', vitC: 0, calcium: 15, iron: 1.1, source: 'local' },
    { name: 'Salmon', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'Proteins', vitC: 0, calcium: 13, iron: 0.8, source: 'local' },
    { name: 'Eggs', emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: 'Proteins', vitC: 0, calcium: 56, iron: 1.8, source: 'local' },
    { name: 'Tofu', emoji: '🫙', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'Proteins', vitC: 0.1, calcium: 350, iron: 5.4, source: 'local' },
    { name: 'Lentils', emoji: '🫘', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, category: 'Proteins', vitC: 4.4, calcium: 38, iron: 6.6, source: 'local' },
    { name: 'Black Beans', emoji: '🫘', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, category: 'Proteins', vitC: 0, calcium: 46, iron: 3.6, source: 'local' },
    { name: 'Tuna', emoji: '🐠', calories: 130, protein: 28, carbs: 0, fat: 0.6, fiber: 0, category: 'Proteins', vitC: 0, calcium: 16, iron: 1.3, source: 'local' },
    { name: 'Chickpeas', emoji: '🫘', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: 'Proteins', vitC: 2.5, calcium: 80, iron: 4.7, source: 'local' },
    { name: 'Turkey Breast', emoji: '🦃', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins', vitC: 0, calcium: 15, iron: 1.2, source: 'local' },
    { name: 'Shrimp', emoji: '🦐', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, category: 'Proteins', vitC: 0, calcium: 70, iron: 3, source: 'local' },
    { name: 'Beef Lean', emoji: '🥩', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: 'Proteins', vitC: 0, calcium: 18, iron: 2.7, source: 'local' },
    { name: 'Pork Tenderloin', emoji: '🥩', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, category: 'Proteins', vitC: 0, calcium: 19, iron: 1.0, source: 'local' },
    { name: 'Cod', emoji: '🐡', calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins', vitC: 0, calcium: 16, iron: 0.4, source: 'local' },
    { name: 'Tilapia', emoji: '🐡', calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, category: 'Proteins', vitC: 0, calcium: 14, iron: 0.6, source: 'local' },
    { name: 'Sardines', emoji: '🐟', calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, category: 'Proteins', vitC: 0, calcium: 382, iron: 2.9, source: 'local' },
    { name: 'Almonds', emoji: '🥜', calories: 579, protein: 21, carbs: 22, fat: 49, fiber: 12.5, category: 'Proteins', vitC: 0, calcium: 264, iron: 3.7, source: 'local' },
    { name: 'Walnuts', emoji: '🥜', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'Proteins', vitC: 1.3, calcium: 98, iron: 2.9, source: 'local' },
    { name: 'Chia Seeds', emoji: '🌱', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: 'Proteins', vitC: 1.6, calcium: 631, iron: 7.7, source: 'local' },
    { name: 'Pumpkin Seeds', emoji: '🌰', calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, category: 'Proteins', vitC: 0, calcium: 46, iron: 8.8, source: 'local' },
    { name: 'Hemp Seeds', emoji: '🌱', calories: 553, protein: 31.6, carbs: 8.7, fat: 48.7, fiber: 4, category: 'Proteins', vitC: 0, calcium: 70, iron: 7.9, source: 'local' },
    { name: 'Peanut Butter', emoji: '🥜', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: 'Proteins', vitC: 0, calcium: 49, iron: 1.9, source: 'local' },
    { name: 'Tempeh', emoji: '🫙', calories: 192, protein: 19, carbs: 9, fat: 11, fiber: 0, category: 'Proteins', vitC: 0, calcium: 111, iron: 2.7, source: 'local' },
    { name: 'Edamame', emoji: '🫛', calories: 122, protein: 10.9, carbs: 9.9, fat: 5.2, fiber: 5.2, category: 'Proteins', vitC: 6.1, calcium: 63, iron: 2.3, source: 'local' },
    { name: 'Kidney Beans', emoji: '🫘', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, category: 'Proteins', vitC: 0, calcium: 43, iron: 2.9, source: 'local' },
    { name: 'Quinoa', emoji: '🌾', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, category: 'Proteins', vitC: 0, calcium: 17, iron: 1.5, source: 'local' },
    { name: 'Seitan', emoji: '🫙', calories: 370, protein: 75, carbs: 14, fat: 1.9, fiber: 0.6, category: 'Proteins', vitC: 0, calcium: 42, iron: 3.8, source: 'local' },
    { name: 'Cashews', emoji: '🥜', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, category: 'Proteins', vitC: 0.5, calcium: 37, iron: 6.7, source: 'local' },
    { name: 'Pistachios', emoji: '🥜', calories: 562, protein: 20, carbs: 28, fat: 45, fiber: 10, category: 'Proteins', vitC: 5.6, calcium: 105, iron: 4.0, source: 'local' },
    { name: 'Sunflower Seeds', emoji: '🌻', calories: 584, protein: 20.8, carbs: 20, fat: 51, fiber: 8.6, category: 'Proteins', vitC: 1.4, calcium: 78, iron: 5.3, source: 'local' },
    { name: 'Flaxseeds', emoji: '🌱', calories: 534, protein: 18.3, carbs: 29, fat: 42, fiber: 27, category: 'Proteins', vitC: 0.6, calcium: 255, iron: 5.7, source: 'local' },
    { name: 'Crab', emoji: '🦀', calories: 87, protein: 18, carbs: 0, fat: 1.1, fiber: 0, category: 'Proteins', vitC: 0, calcium: 89, iron: 0.7, source: 'local' },
    { name: 'Lobster', emoji: '🦞', calories: 89, protein: 19, carbs: 0, fat: 0.9, fiber: 0, category: 'Proteins', vitC: 0, calcium: 96, iron: 0.4, source: 'local' },
    { name: 'Scallops', emoji: '🦪', calories: 111, protein: 21, carbs: 5.4, fat: 0.8, fiber: 0, category: 'Proteins', vitC: 0, calcium: 24, iron: 0.5, source: 'local' },
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
    { name: 'Wild Rice', emoji: '🍚', calories: 101, protein: 4, carbs: 21, fat: 0.3, fiber: 1.8, category: 'Grains', vitC: 0, calcium: 3, iron: 0.6, source: 'local' },
    { name: 'Amaranth', emoji: '🌾', calories: 371, protein: 14, carbs: 66, fat: 7, fiber: 7, category: 'Grains', vitC: 0, calcium: 159, iron: 7.6, source: 'local' },
    { name: 'White Rice', emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'Grains', vitC: 0, calcium: 10, iron: 1.2, source: 'local' },
    { name: 'Corn Tortilla', emoji: '🫓', calories: 218, protein: 5.7, carbs: 46, fat: 3.1, fiber: 6.5, category: 'Grains', vitC: 0, calcium: 121, iron: 3.8, source: 'local' },
    { name: 'Sourdough Bread', emoji: '🍞', calories: 230, protein: 9, carbs: 45, fat: 1.8, fiber: 2, category: 'Grains', vitC: 0, calcium: 27, iron: 2.8, source: 'local' },
    { name: 'Rye', emoji: '🌾', calories: 338, protein: 10, carbs: 76, fat: 1.6, fiber: 15, category: 'Grains', vitC: 0, calcium: 33, iron: 2.6, source: 'local' },
    { name: 'Sorghum', emoji: '🌾', calories: 329, protein: 10.6, carbs: 72, fat: 3.5, fiber: 6.3, category: 'Grains', vitC: 0, calcium: 28, iron: 4.4, source: 'local' },
    { name: 'Teff', emoji: '🌾', calories: 367, protein: 13.3, carbs: 73, fat: 2.4, fiber: 8, category: 'Grains', vitC: 0, calcium: 180, iron: 7.6, source: 'local' },
    { name: 'Spelt', emoji: '🌾', calories: 338, protein: 14.6, carbs: 70, fat: 2.4, fiber: 10.7, category: 'Grains', vitC: 0, calcium: 27, iron: 4.4, source: 'local' },
    { name: 'Freekeh', emoji: '🌾', calories: 347, protein: 13, carbs: 72, fat: 2.7, fiber: 12.9, category: 'Grains', vitC: 0, calcium: 32, iron: 3.6, source: 'local' },
    { name: 'Rice Cakes', emoji: '🍘', calories: 387, protein: 8.2, carbs: 81, fat: 3, fiber: 1.9, category: 'Grains', vitC: 0, calcium: 6, iron: 0.9, source: 'local' },
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
    { name: 'Ricotta', emoji: '🧀', calories: 174, protein: 11.3, carbs: 3, fat: 13, fiber: 0, category: 'Dairy', vitC: 0, calcium: 207, iron: 0.4, source: 'local' },
    { name: 'Cream Cheese', emoji: '🧀', calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0, category: 'Dairy', vitC: 0, calcium: 98, iron: 0.5, source: 'local' },
    { name: 'Heavy Cream', emoji: '🥛', calories: 340, protein: 2.8, carbs: 2.8, fat: 36, fiber: 0, category: 'Dairy', vitC: 0, calcium: 65, iron: 0, source: 'local' },
  ],
};

const CATEGORIES = Object.keys(FOOD_DATABASE);

// ─── CATEGORY COLORS ─────────────────────────────────────────────────────────
const CAT = {
  Vegetables: { bg: '#22c55e', light: '#dcfce7', border: '#16a34a', hex: '#22c55e' },
  Fruits: { bg: '#f97316', light: '#ffedd5', border: '#ea580c', hex: '#f97316' },
  Proteins: { bg: '#ef4444', light: '#fee2e2', border: '#dc2626', hex: '#ef4444' },
  Grains: { bg: '#eab308', light: '#fef9c3', border: '#ca8a04', hex: '#eab308' },
  Dairy: { bg: '#3b82f6', light: '#dbeafe', border: '#2563eb', hex: '#3b82f6' },
};

const IDEAL = { Vegetables: 35, Fruits: 15, Proteins: 25, Grains: 20, Dairy: 5 };

// ─── GOAL CONFIG ──────────────────────────────────────────────────────────────
const GOAL_CFG = {
  'lose-weight': { title: '🔥 Fat Loss Plan', color: '#ef4444' },
  'gain-muscle': { title: '💪 Muscle Gain Plan', color: '#8b5cf6' },
  'maintain': { title: '⚖️ Maintenance Plan', color: '#22c55e' },
  'improve-health': { title: '🌿 Wellness Plan', color: '#10b981' },
};

// ─── TIPS ─────────────────────────────────────────────────────────────────────
const TIPS_BY_GOAL = {
  'lose-weight': ['Eat in a 500 kcal deficit daily', 'Focus on high-volume, low-calorie foods like leafy greens', 'Drink 500ml of water before every meal to increase satiety', 'Prioritize protein to prevent muscle loss during your deficit', 'Try consistent meal timing to regulate hunger hormones', 'Limit liquid calories (sodas, juices) entirely if possible'],
  'gain-muscle': ['Ensure you are in a consistent caloric surplus of 300+ kcal', 'Consume protein every 3-4 hours to maximize protein synthesis', 'Focus on compound lifts and progressive overload in training', 'Late night casein protein (cottage cheese) helps recovery', 'Don\'t fear carbohydrates; they fuel your intense workouts', 'Track your strength gains as much as your weight gains'],
  'maintain': ['Find your "caloric sweet spot" where weight stays stable', 'Keep fiber high (25g+) for long-term metabolic health', 'Vary your protein sources (fish, poultry, legumes, eggs)', 'Indulge mindfully – the 80/20 rule works best for maintenance', 'Monitor your energy levels during workouts for fuel adjustment', 'Keep taking your 7-day varied meal plan seriously'],
  'improve-health': ['Aim for 30 different plant-based foods per week', 'Prioritize whole, unprocessed foods over packaged goods', 'Improve gut health with fermented foods like yogurt or kimchi', 'Limit added sugars to less than 25g per day', 'Focus on quality sleep – it regulates your metabolism', 'Moderate healthy fats (avocado, nuts) are essential'],
};

const CONDITION_ADVICE = {
  'Diabetes': 'Limit refined carbs. Focus on low-GI foods like oats, legumes, sweet potato.',
  'Hypertension': 'Limit sodium <2300mg/day. Increase potassium-rich foods.',
  'High Cholesterol': 'Reduce saturated fats. Increase omega-3s and soluble fiber.',
  'Thyroid': 'Ensure adequate iodine and selenium. Avoid excess raw cruciferous veg.',
  'PCOD/PCOS': 'Low-GI diet. Reduce processed foods. Anti-inflammatory focus.',
};

// ─── WEEKLY MEALS ─────────────────────────────────────────────────────────────
const MEALS_BY_GOAL = {
  'lose-weight': {
    Monday: [{ time: '08:00', label: 'Breakfast', food: 'Oatmeal with berries and flaxseeds', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Grilled chicken salad with light vinaigrette', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Baked cod with steamed broccoli and quinoa', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Greek yogurt or a small apple', p: 0.10 }],
    Tuesday: [{ time: '08:00', label: 'Breakfast', food: 'Egg white omelet with spinach and peppers', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Turkey wrap with lots of veggies', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Lean beef stir-fry with zucchini noodles', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Handful of almonds', p: 0.10 }],
    Wednesday: [{ time: '08:00', label: 'Breakfast', food: 'Chia pudding with almond milk', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Tuna salad (light mayo) with celery sticks', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Roasted turkey breast with asparagus', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Cottage cheese', p: 0.10 }],
    Thursday: [{ time: '08:00', label: 'Breakfast', food: 'Whole grain toast with avocado', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Chickpea and cucumber salad', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Grilled salmon with sautéed kale', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Pear or berries', p: 0.10 }],
    Friday: [{ time: '08:00', label: 'Breakfast', food: 'Protein smoothie with spinach', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Lentil soup with a side green salad', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Chicken skewers with bell peppers', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Rice cakes', p: 0.10 }],
    Saturday: [{ time: '08:00', label: 'Breakfast', food: 'Scrambled eggs with smoked salmon', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Quinoa bowl with black beans', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Lemon herb shrimp with cauliflower rice', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Carrot sticks with hummus', p: 0.10 }],
    Sunday: [{ time: '08:00', label: 'Breakfast', food: 'Greek yogurt parfait', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Roast chicken with green beans', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Stuffed bell peppers with ground turkey', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'One boiled egg', p: 0.10 }],
  },
  'gain-muscle': {
    Monday: [{ time: '08:00', label: 'Breakfast', food: '4 Eggs, 2 Toast, 1 Banana', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Double chicken breast with 1.5 cup rice', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Steak with large sweet potato', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Protein shake + mass gainer', p: 0.15 }],
    Tuesday: [{ time: '08:00', label: 'Breakfast', food: 'Oatmeal with protein powder & peanut butter', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Lean ground beef with pasta and marinara', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Grilled salmon with quinoa and asparagus', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Cottage cheese with almonds', p: 0.15 }],
    Wednesday: [{ time: '08:00', label: 'Breakfast', food: 'Greek yogurt with granola and blueberries', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Turkey breast with sweet potato and broccoli', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Pork tenderloin with brown rice and green beans', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Casein shake with milk', p: 0.15 }],
    Thursday: [{ time: '08:00', label: 'Breakfast', food: 'Egg white & spinach wrap with avocado', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Tuna pasta salad with peas', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Chicken thighs with roasted potatoes', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Peanut butter toast with honey', p: 0.15 }],
    Friday: [{ time: '08:00', label: 'Breakfast', food: 'Pancakes with protein mix and maple syrup', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Sirloin steak with farro salad', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Cod fillets with mixed sautéed veggies', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Greek yogurt with walnuts', p: 0.15 }],
    Saturday: [{ time: '08:00', label: 'Breakfast', food: 'Tofu scramble with whole grain toast', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'BBQ chicken bowl with corn and beans', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Lamb chops with roasted carrots', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Trail mix and beef jerky', p: 0.15 }],
    Sunday: [{ time: '08:00', label: 'Breakfast', food: 'Breakfast burrito with steak and eggs', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Shrimp scampi with whole wheat linguine', p: 0.30 }, { time: '19:00', label: 'Dinner', food: 'Turkey burgers with sweet potato fries', p: 0.30 }, { time: '21:00', label: 'Snacks', food: 'Yogurt with mixed seeds', p: 0.15 }],
  },
  'maintain': {
    Monday: [{ time: '08:00', label: 'Breakfast', food: 'Greek yogurt with fruit and honey', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Mixed grain bowl with chickpea and feta', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Baked snapper with roasted potatoes', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Handful of mixed nuts', p: 0.10 }],
    Tuesday: [{ time: '08:00', label: 'Breakfast', food: 'Avocado toast with poached egg', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Turkey and swiss wrap', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Chicken Alfredo with broccoli', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Apple with peanut butter', p: 0.10 }],
    Wednesday: [{ time: '08:00', label: 'Breakfast', food: 'Steel cut oats with apple slices', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Quinoa salad with roasted veggies', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Grilled chicken breast with couscous', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Hummus and carrots', p: 0.10 }],
    Thursday: [{ time: '08:00', label: 'Breakfast', food: 'Smoothie bowl with seeds and coconut', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Beef and barley soup', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Stir-fry tofu with snap peas', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Low-fat string cheese', p: 0.10 }],
    Friday: [{ time: '08:00', label: 'Breakfast', food: 'Buckwheat pancakes with berries', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Caprese salad with grilled chicken', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Pork loin with apples and cabbage', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Yogurt parfait', p: 0.10 }],
    Saturday: [{ time: '08:00', label: 'Breakfast', food: 'Smoked salmon on whole grain bagel', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Tabbouleh salad with hummus', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Roasted turkey breast with green beans', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Fruit salad', p: 0.10 }],
    Sunday: [{ time: '08:00', label: 'Breakfast', food: 'Whole grain waffles with fruit', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Nicoise salad with tuna', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Spaghetti squash with meatballs', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Dark chocolate square', p: 0.10 }],
  },
  'improve-health': {
    Monday: [{ time: '08:00', label: 'Breakfast', food: 'Avocado toast on rye with eggs', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Lentil soup with hearty green salad', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Pan-seared salmon with asparagus', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Air-popped popcorn or berries', p: 0.10 }],
    Tuesday: [{ time: '08:00', label: 'Breakfast', food: 'Mixed berry smoothie with chia', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Mediterranean tuna salad', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Baked chicken with sweet potato', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Walnuts and dried apricots', p: 0.10 }],
    Wednesday: [{ time: '08:00', label: 'Breakfast', food: 'Steel cut oats with flaxseed', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Chickpea curry with brown rice', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Turkey meatballs with zucchini noodles', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Raw veggies with guacamole', p: 0.10 }],
    Thursday: [{ time: '08:00', label: 'Breakfast', food: 'Yogurt with hemp hearts and fruit', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Black bean burger without bun', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Cod with lemon and steamed kale', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Celery with almond butter', p: 0.10 }],
    Friday: [{ time: '08:00', label: 'Breakfast', food: 'Spinach and feta omelet', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Brown rice bowl with steamed tofu', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Roast chicken with colorful veggies', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Pumpkin seeds', p: 0.10 }],
    Saturday: [{ time: '08:00', label: 'Breakfast', food: 'Kiwi and orange fruit salad', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Lentil salad with lemon tahini', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Salmon papillote with herbs', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Kefir or yogurt drink', p: 0.10 }],
    Sunday: [{ time: '08:00', label: 'Breakfast', food: 'Buckwheat bowl with sliced banana', p: 0.25 }, { time: '13:00', label: 'Lunch', food: 'Shrimp and veggie stir-fry', p: 0.35 }, { time: '19:00', label: 'Dinner', food: 'Vegetable lasagna with whole wheat sheets', p: 0.30 }, { time: '16:00', label: 'Snacks', food: 'Edamame beans', p: 0.10 }],
  },
};

// ─── RECIPE DATABASE ─────────────────────────────────────────────────────────
const RECIPE_DATABASE = [
  { name: 'Roasted Broccoli & Tofu', emoji: '🥦', desc: 'Crispy roasted broccoli with marinated tofu cubes.', requires: ['Broccoli', 'Tofu'], tags: ['Vegetables', 'Proteins'], ytQuery: 'healthy roasted broccoli and tofu recipe' },
  { name: 'Salmon with Quinoa', emoji: '🐟', desc: 'Pan-seared salmon served over a fluffy bed of quinoa.', requires: ['Salmon', 'Quinoa'], tags: ['Proteins', 'Grains'], ytQuery: 'easy salmon quinoa bowl recipe' },
  { name: 'Berry Oatmeal Bowl', emoji: '🥣', desc: 'Hearty oats topped with fresh blueberries and strawberries.', requires: ['Oats', 'Blueberries', 'Strawberries'], tags: ['Grains', 'Fruits'], ytQuery: 'healthy berry oatmeal breakfast recipe' },
  { name: 'Chicken & Brown Rice', emoji: '🍗', desc: 'Simple grilled chicken breast with steamed brown rice.', requires: ['Chicken Breast', 'Brown Rice'], tags: ['Proteins', 'Grains'], ytQuery: 'chicken and brown rice meal prep' },
  { name: 'Greek Yogurt Parfait', emoji: '🍦', desc: 'Creamy Greek yogurt with sliced bananas and almonds.', requires: ['Greek Yogurt', 'Banana', 'Almonds'], tags: ['Dairy', 'Fruits'], ytQuery: 'high protein greek yogurt parfait recipe' },
  { name: 'Spinach & Egg Scramble', emoji: '🍳', desc: 'Quick scramble with fresh spinach and eggs.', requires: ['Spinach', 'Eggs'], tags: ['Vegetables', 'Proteins'], ytQuery: 'healthy spinach and eggs breakfast' },
  { name: 'Apple & Cheese Snacks', emoji: '🍎', desc: 'Crispy apple slices paired with sharp cheddar cheese.', requires: ['Apple', 'Cheese'], tags: ['Fruits', 'Dairy'], ytQuery: 'apple and cheese snack ideas' },
  { name: 'Chickpea Salad', emoji: '🥗', desc: 'Refreshing salad with chickpeas, cucumbers, and tomatoes.', requires: ['Chickpeas', 'Cucumber', 'Tomato'], tags: ['Proteins', 'Vegetables'], ytQuery: 'mediterranean chickpea salad recipe' },
  { name: 'Sweet Potato & Black Beans', emoji: '🍠', desc: 'Roasted sweet potatoes with seasoned black beans.', requires: ['Sweet Potato', 'Black Beans'], tags: ['Grains', 'Proteins'], ytQuery: 'sweet potato and black bean tacos' },
  { name: 'Whole Wheat Pasta Primavera', emoji: '🍝', desc: 'Pasta tossed with zucchini, bell peppers, and carrots.', requires: ['Whole Wheat Pasta', 'Zucchini', 'Bell Pepper', 'Carrot'], tags: ['Grains', 'Vegetables'], ytQuery: 'healthy whole wheat pasta primavera' },
  { name: 'Avocado Toast with Egg', emoji: '🥑', desc: 'Whole bread topped with mashed avocado and a fried egg.', requires: ['Whole Bread', 'Avocado', 'Eggs'], tags: ['Grains', 'Dairy', 'Proteins'], ytQuery: 'avocado toast with egg recipe' },
  { name: 'Mango & Kale Smoothie', emoji: '🥤', desc: 'Tropical green smoothie with kale, mango, and milk.', requires: ['Kale', 'Mango', 'Milk'], tags: ['Vegetables', 'Fruits', 'Dairy'], ytQuery: 'healthy kale mango smoothie' },
  { name: 'Chicken & Bell Pepper Stir-fry', emoji: '🥘', desc: 'Rapid stir-fry with chicken and colorful bell peppers.', requires: ['Chicken Breast', 'Bell Pepper'], tags: ['Proteins', 'Vegetables'], ytQuery: 'healthy chicken pepper stir fry' },
  { name: 'Lentil & Spinach Soup', emoji: '🍲', desc: 'Warm and filling soup with lentils and wilted spinach.', requires: ['Lentils', 'Spinach'], tags: ['Proteins', 'Vegetables'], ytQuery: 'easy red lentil and spinach soup' },
  { name: 'Tuna & Cucumber Bites', emoji: '🐟', desc: 'Tuna salad served on fresh cucumber slices.', requires: ['Tuna', 'Cucumber'], tags: ['Proteins', 'Vegetables'], ytQuery: 'tuna cucumber bites healthy snack' },
  { name: 'Cottage Cheese & Peaches', emoji: '🥣', desc: 'Rich cottage cheese topped with sweet peaches (or mango).', requires: ['Cottage Cheese', 'Mango'], tags: ['Dairy', 'Fruits'], ytQuery: 'cottage cheese and fruit healthy bowl' },
  { name: 'Apple & Almond Butter', emoji: '🍏', desc: 'Crisp apples dipped in creamy almond butter.', requires: ['Apple', 'Almonds'], tags: ['Fruits', 'Dairy'], ytQuery: 'apple and almond butter snack' },
  { name: 'Zucchini & Lentil Curry', emoji: '🍛', desc: 'Flavorful curry with zucchini and red lentils.', requires: ['Zucchini', 'Lentils'], tags: ['Vegetables', 'Proteins'], ytQuery: 'zucchini and lentil curry recipe' },
  { name: 'Strawberries & Cream', emoji: '🍓', desc: 'Sweet strawberries topped with cool Greek yogurt.', requires: ['Strawberries', 'Greek Yogurt'], tags: ['Fruits', 'Dairy'], ytQuery: 'healthy strawberry yogurt dessert' },
  { name: 'Grains & Greens Bowl', emoji: '🥗', desc: 'Quinoa, kale, and chickpeas with a light dressing.', requires: ['Quinoa', 'Kale', 'Chickpeas'], tags: ['Grains', 'Vegetables', 'Proteins'], ytQuery: 'healthy kale and quinoa bowl' },
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  card: { background: '#fff', borderRadius: 28, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0fdf4' },
  inp: { width: '100%', padding: '12px 16px', borderRadius: 14, border: 'none', outline: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', color: '#1e293b', boxSizing: 'border-box', boxShadow: 'inset 0 0 0 1.5px #e2e8f0', transition: 'box-shadow 0.2s' },
  lbl: { fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px' },
  btnG: { width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#166534,#15803d)', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'Georgia,serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,101,52,0.3)', transition: 'all 0.2s' },
  pill: (active, color = '#166534') => ({ padding: '7px 14px', borderRadius: 99, border: `1.5px solid ${active ? color : '#e2e8f0'}`, background: active ? color + '18' : '#fff', color: active ? color : '#475569', fontWeight: active ? 700 : 500, fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.2s' }),
};

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────
function calcDiet(user) {
  const w = Number(user.weight) || 70, h = Number(user.height) || 170, age = Number(user.age) || 30;
  const gender = user.gender, activity = user.activity, goal = user.goal, diet = user.diet;
  let bmr = gender === 'Male' ? (10 * w) + (6.25 * h) - (5 * age) + 5 : (10 * w) + (6.25 * h) - (5 * age) - 161;
  const mults = { sedentary: 1.2, 'lightly-active': 1.375, 'moderately-active': 1.55, 'very-active': 1.725, 'extreme-active': 1.9, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = Math.round(bmr * (mults[activity] || 1.2));
  let targetCal = tdee;
  if (goal === 'lose-weight') targetCal -= 500;
  if (goal === 'gain-muscle') targetCal += 300;
  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  let bodyFat = (1.2 * parseFloat(bmi)) + (0.23 * age) - (10.8 * (gender === 'Male' ? 1 : 0)) - 5.4;
  bodyFat = Math.max(5, bodyFat).toFixed(1);
  const leanMass = Math.round(w * (1 - parseFloat(bodyFat) / 100));
  const heightIn = h / 2.54, base = 60, extra = Math.max(0, heightIn - base);
  let idealWeight = gender === 'Male' ? 50 + (2.3 * extra) : 45.5 + (2.3 * extra);
  idealWeight = Math.max(40, idealWeight).toFixed(1);
  const actBonus = (activity === 'active' || activity === 'very-active') ? 500 : (activity === 'moderate' ? 250 : 0);
  const water = (((w * 35) + actBonus) / 1000).toFixed(1);
  const fiber = Math.round(14 * (targetCal / 1000));
  const weightToGoal = Math.abs(w - parseFloat(idealWeight)).toFixed(1);
  const weeksToGoal = goal === 'lose-weight' ? Math.round(weightToGoal / 0.5) : Math.round(weightToGoal * 2);
  let pP = 30, cP = 40, fP = 30;
  if (goal === 'lose-weight') { pP = 35; cP = 35; fP = 30; }
  if (goal === 'gain-muscle') { pP = 35; cP = 40; fP = 25; }
  if (diet === 'Keto') { pP = 25; cP = 5; fP = 70; }
  const protein = Math.round((targetCal * (pP / 100)) / 4);
  const carbs = Math.round((targetCal * (cP / 100)) / 4);
  const fat = Math.round((targetCal * (fP / 100)) / 9);
  const rda = { vitC: gender === 'Male' ? 90 : 75, calcium: age > 50 ? 1200 : 1000, iron: (gender === 'Female' && age < 50) ? 18 : 8, vitD: 600, potassium: 4700, magnesium: gender === 'Male' ? 420 : 320 };
  return { bmr: Math.round(bmr), tdee, targetCal, bmi, bodyFat, leanMass, idealWeight, water, fiber, weightToGoal, weeksToGoal, protein, carbs, fat, macroSplits: { pP, cP, fP }, rda };
}

function calcBalance(items) {
  if (!items.length) return 0;
  const counts = CATEGORIES.reduce((a, c) => ({ ...a, [c]: 0 }), {});
  items.forEach(i => counts[i.category]++);
  const total = items.length;
  const sim = CATEGORIES.reduce((a, c) => a + (1 - Math.abs((counts[c] / total) - (IDEAL[c] / 100))), 0);
  return Math.round((sim / CATEGORIES.length) * 100);
}

function getRecipeSuggestions(items) {
  if (!items.length) return [];
  const names = items.map(i => i.name);
  const cats = items.map(i => i.category);
  return RECIPE_DATABASE.map(r => {
    const matched = r.requires.filter(req => names.includes(req));
    const tagMatched = r.tags.filter(t => cats.includes(t));
    const score = (matched.length * 3) + tagMatched.length;
    return { ...r, score, progress: matched.length / r.requires.length, matchedCount: matched.length };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 9);
}

function vegetarianize(name, diet) {
  if (diet !== 'Vegetarian') return name;
  const swaps = { Chicken: 'Tofu', Salmon: 'Tempeh', Tuna: 'Chickpea', Beef: 'Seitan', Pork: 'Grilled Paneer', Turkey: 'Lentils', Shrimp: 'Trumpet Mushrooms', Steak: 'Portobello Mushroom', Lamb: 'Roasted Chickpeas', Bacon: 'Tempeh Bacon' };
  let n = name;
  Object.keys(swaps).forEach(m => { n = n.replace(new RegExp(m, 'gi'), swaps[m]); });
  return n;
}

// ─── ROTATING PERKS BANNER ───────────────────────────────────────────────────
const PERKS = [
  { emoji: '🔥', bold: 'Burn fat smarter.', sub: 'Get your exact daily calorie target — calculated from YOUR body, not a generic 2000.' },
  { emoji: '💪', bold: 'Build muscle the right way.', sub: 'Personalized protein goals based on your weight, goal & activity level.' },
  { emoji: '🧬', bold: 'Know your body inside out.', sub: 'BMI, body fat %, lean mass, ideal weight — all calculated just for you.' },
  { emoji: '📅', bold: 'Never wonder what to eat.', sub: 'Get a full 7-day personalized meal plan tailored to your fitness goal.' },
  { emoji: '⚕️', bold: 'Diet that respects your health.', sub: 'We adjust your plan for diabetes, PCOS, hypertension & more conditions.' },
  { emoji: '🎯', bold: 'Track progress, not just calories.', sub: 'See micronutrients, macros & plate balance score in real time.' },
];

function GuestBanner({ onLogin, onSignup }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const { isMobile } = useBreakpoint();
  useEffect(() => {
    const t = setInterval(() => { setVis(false); setTimeout(() => { setIdx(i => (i + 1) % PERKS.length); setVis(true); }, 400); }, 3500);
    return () => clearInterval(t);
  }, []);
  if (dismissed) return null;
  const p = PERKS[idx];
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(22,101,52,0.22)', marginBottom: 20 }}>
      <div style={{ background: 'linear-gradient(135deg,#064e3b 0%,#166534 40%,#15803d 70%,#16a34a 100%)', padding: isMobile ? '18px 16px' : '22px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 99, width: 24, height: 24, color: '#bbf7d0', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif' }}>✕</button>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 14 : 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '3px 11px', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ color: '#bbf7d0', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>PERSONALIZED NUTRITION · FREE</span>
            </div>
            <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.4s ease', minHeight: isMobile ? 48 : 54 }}>
              <div style={{ fontSize: isMobile ? 18 : 22, marginBottom: 4 }}><span style={{ marginRight: 8 }}>{p.emoji}</span><span style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 14 : 17 }}>{p.bold}</span></div>
              <div style={{ color: '#bbf7d0', fontSize: isMobile ? 11 : 12, lineHeight: 1.5 }}>{p.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
              {PERKS.map((_, i) => <div key={i} onClick={() => { setIdx(i); setVis(true); }} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 99, background: i === idx ? '#4ade80' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
            </div>
          </div>
          <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            {!isMobile && <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {[['🏋️', 'Goal-based\ncalories'], ['📊', 'Body fat\n& BMI'], ['🍽', '7-day\nmeal plan'], ['🧬', 'Micro-\nnutrients']].map(([e, l]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px 10px', textAlign: 'center', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontSize: 16 }}>{e}</div>
                  <div style={{ fontSize: 9, color: '#bbf7d0', marginTop: 2, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{l}</div>
                </div>
              ))}
            </div>}
            <div style={{ display: 'flex', gap: 8, width: isMobile ? '100%' : 'auto' }}>
              <button onClick={onSignup} style={{ flex: isMobile ? 1 : 'none', padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#064e3b', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>🚀 Get My Free Plan</button>
              <button onClick={onLogin} style={{ flex: isMobile ? 1 : 'none', padding: '10px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Login →</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>No credit card · No email spam · Free forever</div>
          </div>
        </div>
      </div>
      <div style={{ background: 'rgba(6,78,59,0.95)', padding: isMobile ? '8px 14px' : '8px 24px', display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 3 }}>{['🥦', '🍗', '🍎', '🌾', '🥛'].map((e, i) => <span key={i} style={{ fontSize: 14 }}>{e}</span>)}</div>
        {(isMobile ? ['✓ USDA verified data', '✓ 100% free, no ads'] : ['✓ Mifflin-St Jeor (most accurate BMR)', '✓ USDA verified food data', '✓ Personalized for your health conditions', '✓ 100% free, no ads']).map(t => <span key={t} style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 600 }}>{t}</span>)}
      </div>
    </div>
  );
}

// ─── PLATE VISUALIZER ─────────────────────────────────────────────────────────
function PlateViz({ items }) {
  if (!items.length) return (
    <div style={{ width: 260, height: 260, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg width={260} height={260} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={95} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={3} />
        <circle cx={100} cy={100} r={93} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: 20 }}>Add food to visualize your plate!</div>
    </div>
  );
  let angle = -90;
  const slices = items.map((item) => {
    const slice = (1 / items.length) * 360;
    const start = angle; angle += slice;
    const startRad = start * (Math.PI / 180), endRad = angle * (Math.PI / 180);
    const x1 = 100 + 95 * Math.cos(startRad), y1 = 100 + 95 * Math.sin(startRad);
    const x2 = 100 + 95 * Math.cos(endRad), y2 = 100 + 95 * Math.sin(endRad);
    const large = slice > 180 ? 1 : 0;
    const path = `M 100 100 L ${x1} ${y1} A 95 95 0 ${large} 1 ${x2} ${y2} Z`;
    const midRad = (start + slice / 2) * (Math.PI / 180);
    const ex = 100 + 60 * Math.cos(midRad), ey = 100 + 60 * Math.sin(midRad);
    return { path, color: CAT[item.category]?.bg || '#94a3b8', emoji: item.emoji, ex, ey };
  });
  return (
    <div style={{ width: 260, height: 260, margin: '0 auto' }}>
      <svg width={260} height={260} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.13))' }}>
        <circle cx={100} cy={100} r={98} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={3} />
        {slices.map((sl, i) => (
          <g key={i}>
            <path d={sl.path} fill={sl.color} stroke="#fff" strokeWidth={1.5} opacity={0.88} style={{ transition: 'all 0.4s ease' }} />
            <text x={sl.ex} y={sl.ey} textAnchor="middle" dominantBaseline="middle" fontSize={18}>{sl.emoji}</text>
          </g>
        ))}
        <circle cx={100} cy={100} r={28} fill="#fff" stroke="#f1f5f9" strokeWidth={3} />
      </svg>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onGoSignup, onBack }) {
  const { isMobile } = useBreakpoint();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = () => {
    if (!f.email || !f.password) return setErr('Please fill all fields.');
    const users = getUsers(), user = users[f.email.toLowerCase()];
    if (!user) return setErr('No account found. Please sign up.');
    if (user.password !== f.password) return setErr('Incorrect password.');
    saveSession({ email: f.email.toLowerCase() }); onLogin(user);
  };
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 14 : 20, fontFamily: 'Georgia,serif' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: 12, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>← Back to Plate Builder</button>}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52 }}>🥗</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#166534', margin: '8px 0 4px', fontFamily: 'Georgia,serif' }}>HealthyPlate</h1>
          <p style={{ color: '#64748b', margin: 0, fontStyle: 'italic', fontSize: 13 }}>Your personal nutrition companion</p>
        </div>
        <div style={{ ...S.card, padding: isMobile ? 20 : 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 22, fontFamily: 'Georgia,serif' }}>Welcome back 👋</h2>
          {err && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', color: '#b91c1c', fontSize: 12, marginBottom: 14 }}>{err}</div>}
          <label style={S.lbl}>Email Address</label>
          <input style={{ ...S.inp, marginBottom: 14 }} type="email" placeholder="name@example.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          <label style={S.lbl}>Password</label>
          <input style={{ ...S.inp, marginBottom: 20 }} type="password" placeholder="••••••••" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          <button style={S.btnG} onClick={submit}>Sign In →</button>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#64748b' }}>No account? <span onClick={onGoSignup} style={{ color: '#166534', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Sign Up Free</span></p>
          {onBack && <p style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: '#94a3b8' }}>or <span onClick={onBack} style={{ cursor: 'pointer', textDecoration: 'underline' }}>continue as guest</span></p>}
        </div>
      </div>
    </div>
  );
}

// ─── SIGNUP WIZARD ─────────────────────────────────────────────────────────────
const STEPS = ['Account', 'Personal', 'Health', 'Goals'];
function SignupPage({ onSignup, onGoLogin, onBack }) {
  const { isMobile } = useBreakpoint();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', age: '', gender: 'Male', weight: '', height: '', activity: 'sedentary', diet: 'Omnivore', allergies: ['None'], conditions: ['None'], goal: 'improve-health', meals: '3', water: '2' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? (f[k].filter(x => x !== v).length ? f[k].filter(x => x !== v) : ['None']) : (v === 'None' ? ['None'] : [...f[k].filter(x => x !== 'None'), v]) }));
  const validate = () => {
    if (step === 0) { if (!form.fullName || !form.email || !form.password || !form.confirmPassword) return 'Fill all fields.'; if (form.password.length < 6) return 'Password min 6 chars.'; if (form.password !== form.confirmPassword) return 'Passwords don\'t match.'; if (getUsers()[form.email.toLowerCase()]) return 'Email already registered.'; }
    if (step === 1) { if (!form.age || !form.weight || !form.height) return 'Fill all fields.'; }
    if (step === 2 && !form.activity) return 'Select activity level.';
    if (step === 3 && !form.goal) return 'Select a goal.';
    return '';
  };
  const next = () => { const e = validate(); if (e) return setErr(e); setErr(''); if (step < 3) return setStep(s => s + 1); const users = getUsers(); const user = { ...form, email: form.email.toLowerCase(), createdAt: new Date().toISOString() }; users[user.email] = user; saveUsers(users); saveSession({ email: user.email }); onSignup(user); };
  const bmiVal = form.weight && form.height ? (Number(form.weight) / ((Number(form.height) / 100) ** 2)).toFixed(1) : null;
  const bmiLabel = !bmiVal ? '' : bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal weight' : bmiVal < 30 ? 'Overweight' : 'Obese';
  const bmiColor = !bmiVal ? '#94a3b8' : bmiVal < 18.5 ? '#3b82f6' : bmiVal < 25 ? '#22c55e' : bmiVal < 30 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 14 : 20, fontFamily: 'Georgia,serif' }}>
      <div style={{ width: '100%', maxWidth: 560, paddingBottom: 40 }}>
        {onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: 12, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>← Back to Plate Builder</button>}
        <div style={{ textAlign: 'center', marginBottom: 20 }}><div style={{ fontSize: 40 }}>🥗</div><h1 style={{ fontSize: 22, fontWeight: 700, color: '#166534', margin: '6px 0 0', fontFamily: 'Georgia,serif' }}>Create Your Health Profile</h1></div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, padding: '0 8px' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < step ? '#22c55e' : i === step ? 'linear-gradient(135deg,#166534,#15803d)' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: 700, boxShadow: i === step ? '0 2px 10px rgba(22,101,52,0.4)' : 'none', transition: 'all 0.3s' }}>{i < step ? '✓' : i + 1}</div>
                <div style={{ fontSize: 9, color: i <= step ? '#166534' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? '#22c55e' : '#e2e8f0', margin: '0 4px', marginBottom: 14, transition: 'all 0.5s' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ ...S.card, padding: isMobile ? 18 : 28 }}>
          {err && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '9px 12px', color: '#b91c1c', fontSize: 12, marginBottom: 14 }}>{err}</div>}
          {step === 0 && (
            <div>
              <h3 style={{ margin: '0 0 18px', color: '#166534', fontSize: 16, fontFamily: 'Georgia,serif' }}>👤 Account Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}><label style={S.lbl}>Full Name</label><input style={S.inp} placeholder="Your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={S.lbl}>Email</label><input style={S.inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div><label style={S.lbl}>Password</label><input style={S.inp} type="password" placeholder="Min. 6 chars" value={form.password} onChange={e => set('password', e.target.value)} /></div>
                <div><label style={S.lbl}>Confirm Password</label><input style={S.inp} type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} /></div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 style={{ margin: '0 0 18px', color: '#166534', fontSize: 16, fontFamily: 'Georgia,serif' }}>📏 Personal Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div><label style={S.lbl}>Age</label><input style={S.inp} type="number" placeholder="25" value={form.age} onChange={e => set('age', e.target.value)} /></div>
                <div><label style={S.lbl}>Gender</label><select style={S.inp} value={form.gender} onChange={e => set('gender', e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label style={S.lbl}>Weight (kg)</label><input style={S.inp} type="number" placeholder="70" value={form.weight} onChange={e => set('weight', e.target.value)} /></div>
                <div><label style={S.lbl}>Height (cm)</label><input style={S.inp} type="number" placeholder="170" value={form.height} onChange={e => set('height', e.target.value)} /></div>
              </div>
              {bmiVal && (
                <div style={{ padding: '14px 18px', background: bmiColor + '14', border: `1.5px solid ${bmiColor}44`, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Your BMI</div><div style={{ fontSize: 26, fontWeight: 700, color: bmiColor, fontFamily: 'Georgia,serif' }}>{bmiVal}</div></div>
                  <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700, color: bmiColor, fontSize: 16 }}>{bmiLabel}</div><div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Estimated BF: {Math.max(5, (1.2 * bmiVal) + (0.23 * (form.age || 25)) - (10.8 * (form.gender === 'Male' ? 1 : 0)) - 5.4).toFixed(1)}%</div></div>
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 style={{ margin: '0 0 14px', color: '#166534', fontSize: 16, fontFamily: 'Georgia,serif' }}>🏃 Activity & Diet</h3>
              <label style={S.lbl}>Activity Level</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                {[{ v: 'sedentary', l: '🛋 Sedentary', d: 'Little/no exercise, desk job' }, { v: 'lightly-active', l: '🚶 Lightly Active', d: '1–3 days/week' }, { v: 'moderately-active', l: '🚴 Moderately Active', d: '3–5 days/week' }, { v: 'very-active', l: '🏋️ Very Active', d: '6–7 days/week' }, { v: 'extreme-active', l: '⚡ Athlete', d: 'Twice daily / physical job' }].map(o => (
                  <div key={o.v} onClick={() => set('activity', o.v)} style={{ padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${form.activity === o.v ? '#166534' : '#e2e8f0'}`, background: form.activity === o.v ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: form.activity === o.v ? '#166534' : '#1e293b' }}>{o.l}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{o.d}</div>
                  </div>
                ))}
              </div>
              <label style={S.lbl}>Diet Preference</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'].map(d => <button key={d} onClick={() => set('diet', d)} style={S.pill(form.diet === d)}>{d}</button>)}
              </div>
              <label style={S.lbl}>Allergies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'None'].map(a => <button key={a} onClick={() => toggle('allergies', a)} style={S.pill(form.allergies.includes(a), '#ef4444')}>{a}</button>)}
              </div>
              <label style={S.lbl}>Medical Conditions</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Diabetes', 'Hypertension', 'High Cholesterol', 'Thyroid', 'PCOD/PCOS', 'None'].map(c => <button key={c} onClick={() => toggle('conditions', c)} style={S.pill(form.conditions.includes(c), '#f59e0b')}>{c}</button>)}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 style={{ margin: '0 0 14px', color: '#166534', fontSize: 16, fontFamily: 'Georgia,serif' }}>🎯 Fitness Goal</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[{ v: 'lose-weight', l: '🔥 Lose Weight', d: 'Burn fat, calorie deficit' }, { v: 'gain-muscle', l: '💪 Gain Muscle', d: 'Build strength & size' }, { v: 'maintain', l: '⚖️ Maintain', d: 'Stay at current weight' }, { v: 'improve-health', l: '🌿 Wellness', d: 'General health & vitality' }].map(g => (
                  <div key={g.v} onClick={() => set('goal', g.v)} style={{ padding: 14, borderRadius: 14, border: `2px solid ${form.goal === g.v ? '#166534' : '#e2e8f0'}`, background: form.goal === g.v ? '#f0fdf4' : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 22, marginBottom: 3 }}>{g.l.split(' ')[0]}</div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: form.goal === g.v ? '#166534' : '#1e293b' }}>{g.l.slice(3)}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{g.d}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={S.lbl}>Meals per Day</label><select style={S.inp} value={form.meals} onChange={e => set('meals', e.target.value)}>{['2', '3', '4', '5', '6'].map(n => <option key={n} value={n}>{n} meals</option>)}</select></div>
                <div><label style={S.lbl}>Daily Water (L)</label><select style={S.inp} value={form.water} onChange={e => set('water', e.target.value)}>{['1', '1.5', '2', '2.5', '3', '3.5', '4'].map(n => <option key={n} value={n}>{n}L</option>)}</select></div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {step > 0 ? <button onClick={() => { setErr(''); setStep(s => s - 1); }} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #d1fae5', background: '#fff', color: '#166534', fontSize: 13, fontWeight: 700, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>← Back</button>
              : <button onClick={onGoLogin} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>Have account? Login</button>}
            <button onClick={next} style={{ ...S.btnG, flex: 2, margin: 0 }}>{step === 3 ? '🚀 Create My Plan' : 'Continue →'}</button>
          </div>
          {onBack && <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#94a3b8' }}>or <span onClick={onBack} style={{ cursor: 'pointer', textDecoration: 'underline' }}>continue as guest</span></p>}
        </div>
      </div>
    </div>
  );
}

// ─── USDA SEARCH PANEL ────────────────────────────────────────────────────────
function USDASearchPanel({ onAddFood, onSearch }) {
  const { isMobile } = useBreakpoint();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState('Vegetables');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const data = await onSearch(query);
    setResult(data);
    setSearching(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 28, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0fdf4', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🔬</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', fontFamily: 'Georgia,serif' }}>Search Real Food Data</div>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Powered by USDA Database</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Type any food (e.g. Avocado, Salmon...)" style={{ flex: 1, padding: '11px 16px', borderRadius: 12, border: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', outline: 'none', boxShadow: 'inset 0 0 0 1.5px #e2e8f0' }} />
        <button onClick={handleSearch} disabled={searching} style={{ padding: '11px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#166534,#15803d)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', opacity: searching ? 0.7 : 1 }}>{searching ? '…' : '🔍 Search'}</button>
      </div>
      {result && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{result.name}</div>
                <span style={{ background: '#16a34a', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>USDA ✓</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{result.usdaName || result.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Energy</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#166534' }}>{Math.round(result.calories)} kcal</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6, marginBottom: 12 }}>
            {[['Protein', result.protein + 'g'], ['Carbs', result.carbs + 'g'], ['Fat', result.fat + 'g'], ['Fiber', (result.fiber || 0) + 'g'], ['Vit C', (result.vitC || 0) + 'mg'], ['Calcium', (result.calcium || 0) + 'mg'], ['Iron', (result.iron || 0) + 'mg'], ['Source', result.source || 'USDA']].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #d1fae5', background: '#fff', fontSize: 12, fontFamily: 'Georgia,serif', outline: 'none' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => { onAddFood({ ...result, category, emoji: '🔬', id: Date.now() }); setResult(null); setQuery(''); }} style={{ flex: 1, padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1e293b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>+ Add to Plate</button>
          </div>
        </div>
      )}
      {result === null && query && !searching && (
        <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 10, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No matches found for "{query}"</div>
      )}
    </div>
  );
}

// ─── ACCOUNT SETTINGS MODAL ───────────────────────────────────────────────────
function AccountSettingsModal({ user, onSave, onClose }) {
  const { isMobile } = useBreakpoint();
  const [f, setF] = useState({ ...user });
  const ch = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: 28, padding: 32, maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'Georgia,serif' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#166534', marginTop: 0, marginBottom: 24 }}>⚙️ Account Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          {[['fullName', 'Full Name', 'text'], ['age', 'Age', 'number'], ['weight', 'Weight (kg)', 'number'], ['height', 'Height (cm)', 'number']].map(([k, l, t]) => (
            <div key={k} style={{ gridColumn: k === 'fullName' ? '1/-1' : 'auto' }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{l}</label>
              <input type={t} value={f[k] || ''} onChange={e => ch(k, e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', outline: 'none', boxShadow: 'inset 0 0 0 1.5px #e2e8f0', boxSizing: 'border-box' }} />
            </div>
          ))}
          {[['gender', 'Gender', ['Male', 'Female', 'Other']], ['goal', 'Goal', ['lose-weight', 'gain-muscle', 'maintain', 'improve-health']], ['activity', 'Activity', ['sedentary', 'lightly-active', 'moderately-active', 'very-active']]].map(([k, l, opts]) => (
            <div key={k} style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{l}</label>
              <select value={f[k] || ''} onChange={e => ch(k, e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', outline: 'none', boxShadow: 'inset 0 0 0 1.5px #e2e8f0' }}>
                {opts.map(o => <option key={o} value={o}>{o.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={() => onSave(f)} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#166534,#15803d)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', marginTop: 20, boxShadow: '0 4px 16px rgba(22,101,52,0.3)' }}>💾 Save Changes</button>
      </div>
    </div>
  );
}

// ─── DIET PLAN PAGE ───────────────────────────────────────────────────────────
function DietPlanPage({ user, onBack, apiDietPlan, isGeneratingPlan, onRefreshPlan }) {
  const { isMobile } = useBreakpoint();
  const [tab, setTab] = useState('overview');
  const [day, setDay] = useState('Monday');
  const plan = calcDiet(user);
  const goalCfg = GOAL_CFG[user.goal] || GOAL_CFG['improve-health'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = (MEALS_BY_GOAL[user.goal] || MEALS_BY_GOAL['improve-health'])[day] || [];
  const tips = TIPS_BY_GOAL[user.goal] || TIPS_BY_GOAL['improve-health'];
  const conditions = (user.conditions || []).filter(c => CONDITION_ADVICE[c]);
  const veg = n => vegetarianize(n, user.diet);

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ padding: isMobile ? '10px 12px' : '12px 18px', background: 'none', border: 'none', fontWeight: 700, fontSize: isMobile ? 11 : 13, fontFamily: 'Georgia,serif', cursor: 'pointer', color: tab === id ? '#166534' : '#94a3b8', borderBottom: tab === id ? `2.5px solid ${goalCfg.color}` : '2.5px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5,#f0f9ff)', fontFamily: 'Georgia,serif', paddingBottom: 60 }}>
      <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', padding: '14px 22px', boxShadow: '0 4px 24px rgba(22,101,52,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <button onClick={onBack} style={{ color: '#bbf7d0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Georgia,serif' }}>← Back to Plate Builder</button>
          <span style={{ fontSize: 24 }}>🥗</span>
          <span style={{ color: '#bbf7d0', fontSize: 10, fontWeight: 600 }}>Mifflin-St Jeor Formula</span>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '14px 12px' : '20px 14px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 24, overflowX: 'auto' }}>
          <TabBtn id="overview" label="📊 Overview" />
          <TabBtn id="plan" label="📅 7-Day Plan" />
          <TabBtn id="metrics" label="🏋️ Body Metrics" />
          <TabBtn id="micro" label="🧬 Micronutrients" />
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 14 : 20 }}>
              <div style={{ ...S.card }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' }}>Body Analysis</h3>
                {[['BMI', 'Quetelet Index', plan.bmi, '#3b82f6'], ['Body Fat %', 'Deurenberg Formula', plan.bodyFat + '%', '#8b5cf6'], ['Lean Mass', 'LBM Calculation', plan.leanMass + 'kg', '#22c55e'], ['Ideal Weight', 'Devine Formula', plan.idealWeight + 'kg', '#f59e0b']].map(([l, f, v, c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: c + '14', border: `1px solid ${c}22`, marginBottom: 10 }}>
                    <div><div style={{ fontSize: 10, fontWeight: 700, color: c, textTransform: 'uppercase' }}>{l}</div><div style={{ fontSize: 9, color: '#94a3b8' }}>{f}</div></div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' }}>Goal Roadmap</h3>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Daily Target</div>
                  <div style={{ fontSize: 52, fontWeight: 700, color: goalCfg.color, fontFamily: 'Georgia,serif' }}>{plan.targetCal}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>calories per day</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 8 }}>
                  {[['Protein', plan.protein + 'g', plan.macroSplits.pP + '%', '#ef4444'], ['Carbs', plan.carbs + 'g', plan.macroSplits.cP + '%', '#eab308'], ['Fat', plan.fat + 'g', plan.macroSplits.fP + '%', '#3b82f6']].map(([l, g, p, c]) => (
                    <div key={l} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 12, background: '#f8fafc' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{g}</div>
                      <div style={{ height: 3, background: c, borderRadius: 99, margin: '4px 8px' }} />
                      <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {conditions.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {conditions.map(c => <div key={c} style={{ padding: '14px 16px', borderRadius: 16, background: '#fffbeb', border: '1px solid #fcd34d', display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 24 }}>⚕️</span>
                <div><div style={{ fontSize: 10, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', marginBottom: 4 }}>{c} Adjustment</div><div style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>{CONDITION_ADVICE[c]}</div></div>
              </div>)}
            </div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {tips.map((t, i) => <div key={i} style={{ ...S.card, padding: 16 }}><div style={{ fontSize: 20, marginBottom: 8 }}>💡</div><div style={{ fontSize: 12, color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>{t}</div></div>)}
            </div>
          </div>
        )}

        {tab === 'plan' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {days.map(d => <button key={d} onClick={() => setDay(d)} style={{ padding: '8px 16px', borderRadius: 99, border: 'none', background: day === d ? '#166534' : '#fff', color: day === d ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia,serif', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>{d.slice(0, 3)}</button>)}
            </div>
            {isGeneratingPlan ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #166534', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b', fontWeight: 700 }}>Generating your professional 7-day plan...</p>
              </div>
            ) : apiDietPlan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(apiDietPlan.week[day.toLowerCase()]?.meals || []).map((m, idx) => (
                  <div key={idx} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                    <div style={{ minWidth: 90 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 4 }}>Meal {idx + 1}</div>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{m.readyInMinutes} mins prep</div>
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{m.title}</div>
                    <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 14px', borderRadius: 10, background: '#f0fdf4', color: '#166534', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>View Recipe</a>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {meals.map((m, i) => (
                    <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                      <div style={{ minWidth: 90 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{m.time}</div>
                      </div>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{veg(m.food)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '14px 18px', background: '#f0fdf4', borderRadius: 14, border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Daily Target: {plan.targetCal} kcal</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                    <span>P: {plan.protein}g</span><span>C: {plan.carbs}g</span><span>F: {plan.fat}g</span>
                  </div>
                  {onRefreshPlan && <button onClick={onRefreshPlan} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#166534', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>🔄 Refresh Professional Plan</button>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'metrics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {[['BMI', plan.bmi, 'Height-to-weight ratio', 'General Health'], ['Body Fat %', plan.bodyFat + '%', 'Estimated fat %', 'Deurenberg'], ['Lean Mass', plan.leanMass + 'kg', 'Weight excl. fat', 'Muscle/Bone'], ['Ideal Weight', plan.idealWeight + 'kg', 'Based on height/gender', 'Devine'], ['BMR', plan.bmr + ' kcal', 'Calories burned at rest', 'Mifflin-St Jeor'], ['TDEE', plan.tdee + ' kcal', 'Total daily energy', 'Active Burn'], ['Daily Water', plan.water + 'L', 'Optimized hydration', 'Smart calc'], ['Fiber', plan.fiber + 'g', 'Digestive health', '14g/1000kcal']].map(([l, v, d, b]) => (
              <div key={l} style={{ ...S.card, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{b}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{d}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'micro' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 16 }}>
              {[['Vitamin C', '🍊', plan.rda.vitC + 'mg', 'Bell peppers, Broccoli, Oranges', 'Immunity & Skin'], ['Calcium', '🥛', plan.rda.calcium + 'mg', 'Dairy, Kale, Almonds, Tofu', 'Bone Density'], ['Iron', '🥩', plan.rda.iron + 'mg', 'Red meat, Spinach, Lentils', 'Energy & Blood'], ['Vitamin D', '☀️', plan.rda.vitD + ' IU', 'Sunlight, Fatty fish, Eggs', 'Calcium absorption'], ['Potassium', '🍌', plan.rda.potassium + 'mg', 'Bananas, Potatoes, Avocado', 'Heart & Muscles'], ['Magnesium', '🥜', plan.rda.magnesium + 'mg', 'Nuts, Seeds, Dark chocolate', 'Sleep & Nerves']].map(([l, e, t, s, b]) => (
                <div key={l} style={{ ...S.card, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>{e}</span>
                    <div><div style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{l}</div><div style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>Target: {t}</div></div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Top Sources</div>
                  <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginBottom: 8 }}>{s}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }}>Benefit: {b}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, fontSize: 12, color: '#1d4ed8', fontWeight: 600, textAlign: 'center' }}>⚠️ Consult a registered dietitian for personalized planning. These are general RDA targets based on your profile.</div>
          </div>
        )}
      </div>
      <footer style={{ marginTop: 40, padding: '24px', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 12 }}>
        <div>© 2026 HealthyPlate • Free online healthy meal planner with personalized nutrition profiling</div>
        <div style={{ marginTop: 4 }}><b>Powered by: </b><a href="https://www.devtechservicesindia.com/" style={{ color: '#166534', textDecoration: 'underline' }}>Dev Tech Services India</a></div>
      </footer>
    </div>
  );
}

// ─── MAIN APP (LOGGED IN) ─────────────────────────────────────────────────────
function PlateBuilderApp({ user, setUser, onLogout, onViewPlan, apiDietPlan, isGeneratingPlan, onRefreshPlan }) {
  const { isMobile } = useBreakpoint();
  const KEY = `hp_plate_${user.email}`;
  const [plate, setPlate] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } });
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecipes, setShowRecipes] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [realRecipes, setRealRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(plate)); }, [plate]);

  const plan = calcDiet(user);
  const goalCfg = GOAL_CFG[user.goal] || GOAL_CFG['improve-health'];

  const add = f => setPlate(p => [...p, { ...f, id: Date.now() + Math.random() }]);
  const remove = id => setPlate(p => p.filter(f => f.id !== id));
  const reset = () => { if (window.confirm('Clear all items?')) setPlate([]); };

  const filteredFoods = (FOOD_DATABASE[activeCategory] || []).filter(f => {
    const match = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (user.diet === 'Vegetarian') return match && !IS_NON_VEG(f.name);
    return match;
  });

  const totals = plate.reduce((a, f) => ({
    calories: a.calories + f.calories, protein: a.protein + f.protein, carbs: a.carbs + f.carbs,
    fat: a.fat + f.fat, fiber: a.fiber + (f.fiber || 0), vitC: a.vitC + (f.vitC || 0),
    calcium: a.calcium + (f.calcium || 0), iron: a.iron + (f.iron || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vitC: 0, calcium: 0, iron: 0 });

  const score = calcBalance(plate);
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#84cc16' : score >= 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';
  const suggestions = getRecipeSuggestions(plate);
  const usdaCount = plate.filter(f => f.source === 'USDA').length;

  const fetchUSDANutrition = async (query) => {
    const localMatch = Object.values(FOOD_DATABASE).flat().find(f => f.name.toLowerCase().includes(query.toLowerCase()));
    if (!USDA_API_KEY || USDA_API_KEY === 'YOUR_USDA_KEY') return localMatch ? { ...localMatch, source: 'Local' } : null;
    try {
      const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=1&api_key=${USDA_API_KEY}`);
      const data = await res.json();
      if (!data.foods?.length) return localMatch ? { ...localMatch, source: 'Local Fallback' } : null;
      const f = data.foods[0];
      if (user.diet === 'Vegetarian' && IS_NON_VEG(f.description)) return localMatch && !IS_NON_VEG(localMatch.name) ? { ...localMatch, source: 'Local Fallback' } : null;
      const get = n => f.foodNutrients?.find(nu => nu.nutrientName?.toLowerCase().includes(n.toLowerCase()))?.value || 0;
      return { name: f.description, usdaName: f.description, calories: get('Energy'), protein: Math.round(get('Protein') * 10) / 10, carbs: Math.round(get('Carbohydrate') * 10) / 10, fat: Math.round(get('Total lipid') * 10) / 10, fiber: Math.round(get('Fiber') * 10) / 10, vitC: Math.round(get('Vitamin C') * 10) / 10, calcium: Math.round(get('Calcium') * 10) / 10, iron: Math.round(get('Iron') * 10) / 10, source: 'USDA' };
    } catch (e) { return localMatch ? { ...localMatch, source: 'Local Fallback' } : null; }
  };

  const fetchRealRecipes = async (ingredients) => {
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'YOUR_SPOONACULAR_KEY') return null;
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.slice(0, 5).join(',')}&number=9&ranking=1&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`);
      const data = await res.json();
      if (Array.isArray(data)) return data.map(r => ({ id: r.id, name: r.title, image: r.image, usedIngredients: r.usedIngredients.map(i => i.name), missedIngredients: r.missedIngredients.map(i => i.name), progress: r.usedIngredientCount / (r.usedIngredientCount + r.missedIngredientCount) }));
    } catch (e) { }
    return null;
  };

  useEffect(() => {
    if (showRecipes && plate.length > 0) {
      setLoadingRecipes(true);
      fetchRealRecipes(plate.map(i => i.name)).then(r => { if (r?.length) setRealRecipes(r); else setRealRecipes([]); setLoadingRecipes(false); });
    }
  }, [showRecipes, plate.length]);

  const copyPlate = () => {
    const text = `🥗 HealthyPlate Summary (${user.fullName})\nItems: ${plate.map(i => `${i.emoji} ${i.name}`).join(', ')}\nCalories: ${Math.round(totals.calories)} kcal | Protein: ${Math.round(totals.protein)}g | Carbs: ${Math.round(totals.carbs)}g\nBalance Score: ${score}%`;
    navigator.clipboard.writeText(text); alert('Summary copied!');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5,#f0f9ff)', fontFamily: 'Georgia,serif', paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', padding: '13px 22px', boxShadow: '0 4px 24px rgba(22,101,52,0.3)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>🥗</span>
            <div>
              <div style={{ color: '#fff', fontSize: isMobile ? 15 : 17, fontWeight: 700 }}>HealthyPlate</div>
              <div style={{ color: '#bbf7d0', fontSize: 10, fontStyle: 'italic' }}>Hi, {user.fullName?.split(' ')[0]}! 👋{!isMobile && ` · ${plan.targetCal} kcal goal`}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={onViewPlan} style={{ padding: '8px 14px', borderRadius: 9, border: 'none', background: '#fff', color: '#166534', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>📋 Diet Plan</button>
            {plate.length > 0 && <button onClick={() => setShowRecipes(v => !v)} style={{ padding: '8px 14px', borderRadius: 9, border: 'none', background: showRecipes ? '#fef08a' : '#fff9c4', color: '#b45309', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', position: 'relative' }}>🎬 Recipes <span style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', borderRadius: 99, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{suggestions.length}</span></button>}
            <button onClick={() => setShowProfile(v => !v)} style={{ padding: '8px 12px', borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>👤</button>
            <button onClick={reset} style={{ padding: '8px 12px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fca5a5', fontSize: 12, cursor: 'pointer' }}>🗑</button>
            <button onClick={copyPlate} style={{ padding: '8px 12px', borderRadius: 9, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>📋</button>
            <button onClick={onLogout} style={{ padding: '8px 12px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#bbf7d0', fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Logout</button>
          </div>
        </div>
      </div>

      {/* PROFILE DROPDOWN */}
      {showProfile && (
        <div style={{ position: 'absolute', top: 66, right: 14, width: 310, background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', zIndex: 100, fontFamily: 'Georgia,serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#166534' }}>Your Profile</div>
            <button onClick={() => setShowProfile(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 16 }}>✕</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8fafc', borderRadius: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 32 }}>👤</span>
            <div><div style={{ fontWeight: 700, color: '#1e293b' }}>{user.fullName}</div><div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{user.goal?.replace(/-/g, ' ')}</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[['Age', `${user.age}y`], ['Weight', `${user.weight}kg`], ['Height', `${user.height}cm`], ['BMI', plan.bmi], ['Activity', user.activity?.split('-')[0]], ['Diet', user.diet]].map(([l, v]) => (
              <div key={l} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', textTransform: 'capitalize' }}>{v}</div>
              </div>
            ))}
          </div>
          {(user.allergies || []).filter(a => a !== 'None').length > 0 && <div style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: 10, fontSize: 11, color: '#b91c1c', fontWeight: 600, marginBottom: 10 }}>⚠️ Allergies: {user.allergies.filter(a => a !== 'None').join(', ')}</div>}
          <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#166534', marginBottom: 6 }}>Daily Targets</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: '#1e293b', fontWeight: 600 }}>
              <div>🔥 {plan.targetCal} kcal</div><div>🥩 {plan.protein}g protein</div>
            </div>
          </div>
          <button onClick={() => { setShowSettings(true); setShowProfile(false); }} style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: '#f0fdf4', color: '#166534', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>⚙️ Edit Profile & Settings</button>
        </div>
      )}

      {showSettings && <AccountSettingsModal user={user} onClose={() => setShowSettings(false)} onSave={updated => { const users = getUsers(); users[user.email] = updated; saveUsers(users); setUser(updated); setShowSettings(false); }} />}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '14px 12px' : '20px 14px' }}>
        {/* RECIPE PANEL */}
        {showRecipes && plate.length > 0 && (
          <div style={{ background: '#0f172a', borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#ef4444,#fff,#ef4444)' }} />
            <button onClick={() => setShowRecipes(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>✕</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif' }}>🎬 Recipe Videos for Your Ingredients</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Found {realRecipes.length > 0 ? realRecipes.length : suggestions.length} recipes matching your plate</div>
              </div>
              <button onClick={() => window.open(`https://www.youtube.com/results?search_query=healthy+recipe+with+${plate.map(i => i.name).join('+')}`, '_blank')} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>🚀 Search All on YouTube</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {loadingRecipes ? [1, 2, 3].map(n => <div key={n} style={{ height: 220, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />) :
                realRecipes.length > 0 ? realRecipes.map(r => (
                  <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                    {r.image && <img src={r.image} alt={r.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />}
                    <div style={{ padding: 14 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 8, fontFamily: 'Georgia,serif' }}>{r.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                        {r.usedIngredients.slice(0, 3).map(i => <span key={i} style={{ fontSize: 9, background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{i}</span>)}
                      </div>
                      <button onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(r.name + ' recipe')}`, '_blank')} style={{ width: '100%', padding: '8px', borderRadius: 9, border: 'none', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>▶ Watch on YouTube</button>
                    </div>
                  </div>
                )) : suggestions.map(r => (
                  <div key={r.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 36 }}>{r.emoji}</span>
                      {r.progress === 1 && <span style={{ fontSize: 9, background: '#22c55e', color: '#fff', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>Perfect Match</span>}
                    </div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 6, fontFamily: 'Georgia,serif' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, flex: 1 }}>{r.desc}</div>
                    <button onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(r.ytQuery)}`, '_blank')} style={{ width: '100%', padding: '9px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>▶ Watch on YouTube</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: isMobile ? 16 : 20 }}>
          {/* LEFT: Food Library */}
          <div>
            <USDASearchPanel onAddFood={add} onSearch={fetchUSDANutrition} />
            <div style={{ ...S.card, marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0, fontFamily: 'Georgia,serif' }}>Food Library</h2>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setSearchTerm(''); }} style={{ padding: '8px 14px', borderRadius: 99, border: `1.5px solid ${activeCategory === cat ? CAT[cat].border : '#e2e8f0'}`, background: activeCategory === cat ? CAT[cat].bg : '#fff', color: activeCategory === cat ? '#fff' : '#475569', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.2s', boxShadow: activeCategory === cat ? `0 2px 8px ${CAT[cat].bg}66` : 'none' }}>{cat}</button>
                ))}
              </div>
              <input placeholder="🔍 Filter foods..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', outline: 'none', boxShadow: 'inset 0 0 0 1.5px #e2e8f0', marginBottom: 16, boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, maxHeight: isMobile ? 400 : 560, overflowY: 'auto', paddingRight: 4, paddingTop: 10 }}>
                {filteredFoods.map(food => (
                  <button key={`${food.category}-${food.name}`} onClick={() => add(food)} style={{ padding: '14px 12px', borderRadius: 16, border: `1.5px solid ${CAT[activeCategory].border}44`, background: '#fff', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s', fontFamily: 'Georgia,serif' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = CAT[activeCategory].border; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = `${CAT[activeCategory].border}44`; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 24 }}>{food.emoji}</span>
                      {food.source === 'USDA' && <span style={{ fontSize: 7, background: '#22c55e', color: '#fff', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>USDA</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 3 }}>{food.name}</div>
                    <div style={{ fontSize: 10, color: CAT[activeCategory].bg, fontWeight: 700 }}>{food.calories} kcal</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{food.protein}g P · {food.carbs}g C</div>
                    <div style={{ marginTop: 6, fontSize: 9, background: CAT[activeCategory].light, color: CAT[activeCategory].border, padding: '2px 7px', borderRadius: 4, display: 'inline-block', fontWeight: 700 }}>+ Add</div>
                  </button>
                ))}
              </div>
            </div>

            {plate.length > 0 && <div style={{ ...S.card, marginTop: 16, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>🍽 On Your Plate ({plate.length} items) {usdaCount > 0 && <span style={{ fontSize: 10, color: '#22c55e' }}>· {usdaCount} USDA verified</span>}</div>
                <button onClick={reset} style={{ background: 'none', border: '1px solid #fca5a5', borderRadius: 6, padding: '3px 8px', color: '#ef4444', fontSize: 10, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Clear All</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                {plate.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: CAT[item.category]?.light || '#f1f5f9', border: `1.5px solid ${CAT[item.category]?.border || '#e2e8f0'}55` }}>
                    <span style={{ fontSize: 14 }}>{item.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                    {item.source === 'USDA' && <span style={{ fontSize: 8, background: '#22c55e', color: '#fff', borderRadius: 99, padding: '1px 4px', fontWeight: 700 }}>USDA</span>}
                    <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: 12, padding: 12, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#166534', marginBottom: 8 }}>🧬 Micronutrients from Plate</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                  {[['Vit C', Math.round(totals.vitC) + 'mg', plan.rda.vitC + 'mg'], ['Calcium', Math.round(totals.calcium) + 'mg', plan.rda.calcium + 'mg'], ['Iron', totals.iron.toFixed(1) + 'mg', plan.rda.iron + 'mg'], ['Fiber', totals.fiber.toFixed(1) + 'g', plan.fiber + 'g']].map(([l, v, t]) => (
                    <div key={l} style={{ background: '#fff', borderRadius: 8, padding: '7px', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#166534' }}>{v}</div>
                      <div style={{ fontSize: 8, color: '#94a3b8' }}>{l} / {t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>}
          </div>

          {/* RIGHT: Plate Builder Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Goal Card */}
            <div style={{ background: `linear-gradient(135deg,${goalCfg.color},${goalCfg.color}cc)`, borderRadius: 20, padding: '16px 18px', color: '#fff', boxShadow: `0 4px 20px ${goalCfg.color}44` }}>
              <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 700, marginBottom: 4 }}>YOUR GOAL · Mifflin-St Jeor</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{goalCfg.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[['🔥', plan.targetCal + ' kcal', 'Target'], ['🥩', plan.protein + 'g', 'Protein'], ['🌾', plan.carbs + 'g', 'Carbs'], ['💧', plan.water + 'L', 'Water']].map(([e, v, l]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 10, padding: '8px 10px' }}>
                    <div style={{ fontSize: 9, opacity: 0.7 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{e} {v}</div>
                  </div>
                ))}
              </div>
              <button onClick={onViewPlan} style={{ width: '100%', padding: '9px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Full Plan + Body Metrics →</button>
            </div>

            {/* Plate Viz */}
            <div style={{ ...S.card, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#166534', margin: 0 }}>Your Plate</h2>
                {plate.length > 0 && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: scoreColor + '22', border: `1.5px solid ${scoreColor}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: scoreColor }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor }}>{scoreLabel} {score}%</span>
                </div>}
              </div>
              <PlateViz items={plate} />
              {plate.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10, justifyContent: 'center' }}>
                {CATEGORIES.filter(c => plate.some(p => p.category === c)).map(cat => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: CAT[cat].bg }} />
                    <span style={{ color: '#64748b' }}>{cat}</span>
                  </div>
                ))}
              </div>}
            </div>

            {/* Nutrition vs Goal */}
            <div style={{ ...S.card, padding: 18 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 12, marginTop: 0 }}>Nutrition vs Your Goal</h2>
              <div style={{ textAlign: 'center', padding: '12px', marginBottom: 12, background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: 14 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: '#166534' }}>{Math.round(totals.calories)}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>/ {plan.targetCal} kcal · {Math.round((totals.calories / plan.targetCal) * 100)}%</div>
                <div style={{ height: 5, background: '#d1fae5', borderRadius: 99, marginTop: 8 }}>
                  <div style={{ height: 5, borderRadius: 99, background: totals.calories > plan.targetCal ? '#ef4444' : '#22c55e', width: `${Math.min((totals.calories / plan.targetCal) * 100, 100)}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
              {[['Protein', totals.protein, plan.protein, '#ef4444'], ['Carbs', totals.carbs, plan.carbs, '#eab308'], ['Fat', totals.fat, plan.fat, '#3b82f6'], ['Fiber', totals.fiber, plan.fiber, '#22c55e']].map(([l, v, max, col]) => (
                <div key={l} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{Math.round(v)}g / {max}g</span>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ height: 5, borderRadius: 99, background: col, width: `${Math.min((v / max) * 100, 100)}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Ideal Guide */}
            <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 18, padding: '16px 18px', boxShadow: '0 4px 20px rgba(22,101,52,0.3)' }}>
              <h3 style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>🎯 Ideal Plate Guide</h3>
              {Object.entries(IDEAL).map(([cat, pct]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#bbf7d0', fontSize: 11 }}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 2, background: CAT[cat].bg, marginRight: 6 }} />
                    {cat}
                  </span>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 40, padding: '24px', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 12 }}>
        <div>© 2026 HealthyPlate • Free online healthy meal planner with personalized nutrition profiling</div>
        <div style={{ marginTop: 4 }}><b>Powered by: </b><a href="https://www.devtechservicesindia.com/" style={{ color: '#166534', textDecoration: 'underline' }}>Dev Tech Services India</a></div>
      </footer>
    </div>
  );
}

// ─── GUEST PLATE BUILDER ──────────────────────────────────────────────────────
function GuestPlateBuilder({ onLogin, onSignup }) {
  const { isMobile } = useBreakpoint();
  const [plate, setPlate] = useState([]);
  const [tab, setTab] = useState('Vegetables');
  const [search, setSearch] = useState('');
  const [teaser, setTeaser] = useState(false);

  const add = f => {
    setPlate(p => [...p, { ...f, category: tab, id: Date.now() + Math.random() }]);
    if (plate.length === 2) setTeaser(true);
  };
  const remove = id => setPlate(p => p.filter(f => f.id !== id));
  const totals = plate.reduce((a, f) => ({ calories: a.calories + f.calories, protein: a.protein + f.protein, carbs: a.carbs + f.carbs, fat: a.fat + f.fat, fiber: a.fiber + (f.fiber || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const score = calcBalance(plate);
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#84cc16' : score >= 40 ? '#f59e0b' : '#ef4444';
  const filtered = (FOOD_DATABASE[tab] || []).filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5,#f0f9ff)', fontFamily: 'Georgia,serif', paddingBottom: 60 }}>
      <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', padding: '13px 22px', boxShadow: '0 4px 24px rgba(22,101,52,0.3)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>🥗</span>
            <div>
              <div style={{ color: '#fff', fontSize: isMobile ? 15 : 17, fontWeight: 700 }}>HealthyPlate <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: 99, marginLeft: 4 }}>Guest Mode</span></div>
              {!isMobile && <div style={{ color: '#bbf7d0', fontSize: 10, fontStyle: 'italic' }}>Explore the food library · Login for your personal diet plan</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onSignup} style={{ padding: isMobile ? '8px 12px' : '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#064e3b', fontSize: isMobile ? 11 : 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{isMobile ? '🚀 Join Free' : '🚀 Get Free Plan'}</button>
            <button onClick={onLogin} style={{ padding: isMobile ? '8px 10px' : '9px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: isMobile ? 11 : 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Login</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 14px' }}>
        <GuestBanner onLogin={onLogin} onSignup={onSignup} />

        {teaser && plate.length >= 3 && (
          <div style={{ background: 'linear-gradient(135deg,#fef3c7,#fffbeb)', border: '1.5px solid #fcd34d', borderRadius: 16, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 28 }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Great plate! Want to know if this matches YOUR calorie goal?</div>
              <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>You've added {plate.length} foods ({Math.round(totals.calories)} kcal). Login to see if this fits your personalized plan.</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onSignup} style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Get My Plan →</button>
              <button onClick={() => setTeaser(false)} style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid #fcd34d', background: 'transparent', color: '#b45309', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>✕</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: isMobile ? 16 : 20 }}>
          <div>
            <div style={{ ...S.card }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => <button key={cat} onClick={() => { setTab(cat); setSearch(''); }} style={{ padding: '8px 14px', borderRadius: 99, border: `1.5px solid ${tab === cat ? CAT[cat].border : '#e2e8f0'}`, background: tab === cat ? CAT[cat].bg : '#fff', color: tab === cat ? '#fff' : '#475569', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.2s' }}>{cat}</button>)}
              </div>
              <input placeholder="🔍 Search foods..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: 'none', background: '#f8fafc', fontSize: 13, fontFamily: 'Georgia,serif', outline: 'none', boxShadow: 'inset 0 0 0 1.5px #e2e8f0', marginBottom: 16, boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, maxHeight: isMobile ? 380 : 500, overflowY: 'auto' }}>
                {filtered.map(food => (
                  <button key={food.name} onClick={() => add(food)} style={{ padding: '14px 12px', borderRadius: 16, border: `1.5px solid ${CAT[tab].border}44`, background: '#fff', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s', fontFamily: 'Georgia,serif' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = CAT[tab].border; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = `${CAT[tab].border}44`; }}>
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{food.emoji}</span>
                    <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 3 }}>{food.name}</div>
                    <div style={{ fontSize: 10, color: CAT[tab].bg, fontWeight: 700 }}>{food.calories} kcal</div>
                    <div style={{ marginTop: 6, fontSize: 9, background: CAT[tab].light, color: CAT[tab].border, padding: '2px 7px', borderRadius: 4, display: 'inline-block', fontWeight: 700 }}>+ Add</div>
                  </button>
                ))}
              </div>
            </div>
            {plate.length > 0 && <div style={{ ...S.card, marginTop: 16, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', marginBottom: 10 }}>🍽 On Your Plate ({plate.length} items)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {plate.map(item => <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: CAT[item.category]?.light || '#f1f5f9', border: `1.5px solid ${CAT[item.category]?.border || '#e2e8f0'}55` }}>
                  <span style={{ fontSize: 14 }}>{item.emoji}</span><span style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, padding: 0 }}>✕</button>
                </div>)}
              </div>
            </div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(22,101,52,0.2)' }}>
              <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', padding: '16px 18px', color: '#fff' }}>
                <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 700 }}>YOUR PERSONALIZED GOAL</div>
                <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 10px' }}>🔒 Unlock Your Diet Plan</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['🔥', '???? kcal'], ['🥩', '???g protein'], ['🌾', '???g carbs'], ['💧', '??L water']].map(([e, v]) => (
                    <div key={v} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', fontSize: 11, filter: 'blur(3px)' }}>{e} <b>{v}</b></div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#064e3b', padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6ee7b7', marginBottom: 12 }}>Sign up to reveal your personalized:<br />BMI · Body Fat % · Calorie Target · 7-Day Plan</div>
                <button onClick={onSignup} style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#064e3b', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>🚀 Get My Free Plan</button>
              </div>
            </div>

            <div style={{ ...S.card, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#166534', margin: 0 }}>Your Plate</h2>
                {plate.length > 0 && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: scoreColor + '22', border: `1.5px solid ${scoreColor}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: scoreColor }} /><span style={{ fontSize: 9, fontWeight: 700, color: scoreColor }}>{score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work'} {score}%</span>
                </div>}
              </div>
              <PlateViz items={plate} />
            </div>

            <div style={{ ...S.card, padding: 18 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 12, marginTop: 0 }}>Basic Nutrition</h2>
              <div style={{ textAlign: 'center', padding: '12px', marginBottom: 12, background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: 14 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: '#166534' }}>{Math.round(totals.calories)}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>kcal on plate</div>
              </div>
              {[['Protein', totals.protein, 50, '#ef4444'], ['Carbs', totals.carbs, 130, '#eab308'], ['Fat', totals.fat, 65, '#3b82f6'], ['Fiber', totals.fiber, 25, '#22c55e']].map(([l, v, max, col]) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{Math.round(v)}g</span>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ height: 5, borderRadius: 99, background: col, width: `${Math.min((v / max) * 100, 100)}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
              <div onClick={onSignup} style={{ marginTop: 12, padding: '10px 14px', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: 12, border: '1.5px dashed #86efac', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#166534', fontWeight: 700 }}>🔒 See vs YOUR personal targets</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Login to compare against your exact goals →</div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 18, padding: '16px 18px' }}>
              <h3 style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>🎯 Ideal Plate Guide</h3>
              {Object.entries(IDEAL).map(([cat, pct]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#bbf7d0', fontSize: 11 }}><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 2, background: CAT[cat].bg, marginRight: 6 }} />{cat}</span>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 40, padding: '24px', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 12 }}>
        <div>© 2026 HealthyPlate • Free online healthy meal planner with personalized nutrition profiling</div>
        <div style={{ marginTop: 4 }}><b>Powered by: </b><a href="https://www.devtechservicesindia.com/" style={{ color: '#166534', textDecoration: 'underline' }}>Dev Tech Services India</a></div>
      </footer>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('guest');
  const [user, setUser] = useState(null);
  const [apiDietPlan, setApiDietPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s?.email) { const u = getUsers()[s.email]; if (u) { setUser(u); setPage('app'); } }
  }, []);

  const fetchProfessionalMealPlan = async (u) => {
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'YOUR_SPOONACULAR_KEY') return;
    setIsGeneratingPlan(true);
    const d = calcDiet(u || user);
    const diet = u?.diet || user?.diet || '';
    try {
      const res = await fetch(`https://api.spoonacular.com/mealplanner/generate?timeFrame=week&targetCalories=${d.targetCal}&diet=${diet}&apiKey=${SPOONACULAR_API_KEY}`);
      const data = await res.json();
      if (data.week) setApiDietPlan(data);
    } catch (err) { console.error('Failed to fetch professional meal plan', err); }
    finally { setIsGeneratingPlan(false); }
  };

  useEffect(() => {
    if (page === 'plan' && !apiDietPlan && user) fetchProfessionalMealPlan(user);
  }, [page, user, apiDietPlan]);

  const handleLogin = u => { setUser(u); setPage('app'); };
  const handleLogout = () => { saveSession(null); setUser(null); setPage('guest'); };

  if (page === 'login') return <LoginPage onLogin={handleLogin} onGoSignup={() => setPage('signup')} onBack={() => setPage('guest')} />;
  if (page === 'signup') return <SignupPage onSignup={u => { handleLogin(u); fetchProfessionalMealPlan(u); }} onGoLogin={() => setPage('login')} onBack={() => setPage('guest')} />;
  if (page === 'plan' && user) return <DietPlanPage user={user} onBack={() => setPage('app')} apiDietPlan={apiDietPlan} isGeneratingPlan={isGeneratingPlan} onRefreshPlan={() => fetchProfessionalMealPlan(user)} />;
  if (page === 'app' && user) return <PlateBuilderApp user={user} setUser={setUser} onLogout={handleLogout} onViewPlan={() => setPage('plan')} apiDietPlan={apiDietPlan} isGeneratingPlan={isGeneratingPlan} onRefreshPlan={() => fetchProfessionalMealPlan(user)} />;
  return <GuestPlateBuilder onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />;
}