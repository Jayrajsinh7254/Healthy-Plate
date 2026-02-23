import React, { useState, useEffect } from 'react';

// --- DATA ---
const FOOD_DATABASE = {
  Vegetables: [
    { name: 'Broccoli', emoji: '🥦', calories: 31, protein: 2.5, carbs: 6, fat: 0.4, fiber: 2.4, category: 'Vegetables' },
    { name: 'Spinach', emoji: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'Vegetables' },
    { name: 'Carrot', emoji: '🥕', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables' },
    { name: 'Tomato', emoji: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: 'Vegetables' },
    { name: 'Bell Pepper', emoji: '🫑', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, category: 'Vegetables' },
    { name: 'Cucumber', emoji: '🥒', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: 'Vegetables' },
    { name: 'Zucchini', emoji: '🥒', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, category: 'Vegetables' },
    { name: 'Kale', emoji: '🥬', calories: 33, protein: 2.9, carbs: 6, fat: 0.6, fiber: 1.3, category: 'Vegetables' },
    { name: 'Cauliflower', emoji: '🥦', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, category: 'Vegetables' },
    { name: 'Asparagus', emoji: '🎋', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, category: 'Vegetables' },
    { name: 'Eggplant', emoji: '🍆', calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, category: 'Vegetables' },
    { name: 'Brussels Sprouts', emoji: '🥬', calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8, category: 'Vegetables' },
    { name: 'Mushrooms', emoji: '🍄', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, category: 'Vegetables' },
    { name: 'Onion', emoji: '🧅', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, category: 'Vegetables' },
    { name: 'Garlic', emoji: '🧄', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, category: 'Vegetables' },
    { name: 'Celery', emoji: '🥬', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, category: 'Vegetables' },
    { name: 'Radish', emoji: '🥗', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6, category: 'Vegetables' },
    { name: 'Beets', emoji: '🍠', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables' },
    { name: 'Sweet Corn', emoji: '🌽', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2, category: 'Vegetables' },
    { name: 'Green Peas', emoji: '🫛', calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1, category: 'Vegetables' },
    { name: 'Cabbage', emoji: '🥬', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, category: 'Vegetables' },
  ],
  Fruits: [
    { name: 'Apple', emoji: '🍎', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, category: 'Fruits' },
    { name: 'Banana', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: 'Fruits' },
    { name: 'Strawberries', emoji: '🍓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, category: 'Fruits' },
    { name: 'Blueberries', emoji: '🫐', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, category: 'Fruits' },
    { name: 'Orange', emoji: '🍊', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, category: 'Fruits' },
    { name: 'Mango', emoji: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, category: 'Fruits' },
    { name: 'Grapes', emoji: '🍇', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, category: 'Fruits' },
    { name: 'Pineapple', emoji: '🍍', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, category: 'Fruits' },
    { name: 'Peach', emoji: '🍑', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, category: 'Fruits' },
    { name: 'Pear', emoji: '🍐', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, category: 'Fruits' },
    { name: 'Watermelon', emoji: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, category: 'Fruits' },
    { name: 'Kiwi', emoji: '🥝', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, category: 'Fruits' },
    { name: 'Lemon', emoji: '🍋', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, category: 'Fruits' },
    { name: 'Cherry', emoji: '🍒', calories: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 1.6, category: 'Fruits' },
    { name: 'Raspberry', emoji: '🫐', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5, category: 'Fruits' },
    { name: 'Pomegranate', emoji: '🍎', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, category: 'Fruits' },
    { name: 'Blackberry', emoji: '🫐', calories: 43, protein: 1.4, carbs: 10, fat: 0.5, fiber: 5.3, category: 'Fruits' },
    { name: 'Plum', emoji: '🍑', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, category: 'Fruits' },
    { name: 'Apricot', emoji: '🍑', calories: 48, protein: 1.4, carbs: 11, fat: 0.4, fiber: 2, category: 'Fruits' },
    { name: 'Grapefruit', emoji: '🍈', calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6, category: 'Fruits' },
  ],
  Proteins: [
    { name: 'Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Proteins' },
    { name: 'Salmon', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'Proteins' },
    { name: 'Eggs', emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: 'Proteins' },
    { name: 'Tofu', emoji: '🧊', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'Proteins' },
    { name: 'Lentils', emoji: '🍛', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, category: 'Proteins' },
    { name: 'Black Beans', emoji: '🫘', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, category: 'Proteins' },
    { name: 'Tuna', emoji: '🐟', calories: 130, protein: 28, carbs: 0, fat: 0.6, fiber: 0, category: 'Proteins' },
    { name: 'Chickpeas', emoji: '🥙', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: 'Proteins' },
    { name: 'Turkey Breast', emoji: '🦃', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins' },
    { name: 'Shrimp', emoji: '🦐', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, category: 'Proteins' },
    { name: 'Beef Lean', emoji: '🥩', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: 'Proteins' },
    { name: 'Pork Tenderloin', emoji: '🥩', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, category: 'Proteins' },
    { name: 'Cod', emoji: '🐟', calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, category: 'Proteins' },
    { name: 'Pumpkin Seeds', emoji: '🎃', calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, category: 'Proteins' },
    { name: 'Walnuts', emoji: '🥜', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'Proteins' },
    { name: 'Chia Seeds', emoji: '🌰', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: 'Proteins' },
    { name: 'Peanut Butter', emoji: '🥜', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: 'Proteins' },
    { name: 'Tempeh', emoji: '🧊', calories: 192, protein: 19, carbs: 9, fat: 11, fiber: 0, category: 'Proteins' },
  ],
  Grains: [
    { name: 'Brown Rice', emoji: '🍚', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, category: 'Grains' },
    { name: 'Quinoa', emoji: '🥣', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, category: 'Grains' },
    { name: 'Oats', emoji: '🥣', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, category: 'Grains' },
    { name: 'Whole Bread', emoji: '🍞', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, category: 'Grains' },
    { name: 'Sweet Potato', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: 'Grains' },
    { name: 'Whole Wheat Pasta', emoji: '🍝', calories: 124, protein: 5.3, carbs: 27, fat: 0.5, fiber: 2.8, category: 'Grains' },
    { name: 'Barley', emoji: '🌾', calories: 354, protein: 12, carbs: 73, fat: 2.3, fiber: 17, category: 'Grains' },
    { name: 'Bulgur', emoji: '🌾', calories: 342, protein: 12, carbs: 76, fat: 1.3, fiber: 18, category: 'Grains' },
    { name: 'Buckwheat', emoji: '🌾', calories: 343, protein: 13, carbs: 72, fat: 3.4, fiber: 10, category: 'Grains' },
    { name: 'Couscous', emoji: '🌾', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, category: 'Grains' },
    { name: 'Millet', emoji: '🌾', calories: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5, category: 'Grains' },
    { name: 'Farro', emoji: '🌾', calories: 362, protein: 13, carbs: 70, fat: 2.4, fiber: 11, category: 'Grains' },
    { name: 'Rye', emoji: '🌾', calories: 338, protein: 10, carbs: 76, fat: 1.6, fiber: 15, category: 'Grains' },
    { name: 'Wild Rice', emoji: '🍚', calories: 101, protein: 4, carbs: 21, fat: 0.3, fiber: 1.8, category: 'Grains' },
    { name: 'Amaranth', emoji: '🌾', calories: 371, protein: 14, carbs: 66, fat: 7, fiber: 7, category: 'Grains' },
  ],
  Dairy: [
    { name: 'Greek Yogurt', emoji: '🍦', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, category: 'Dairy' },
    { name: 'Cheese', emoji: '🧀', calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, category: 'Dairy' },
    { name: 'Milk', emoji: '🥛', calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, category: 'Dairy' },
    { name: 'Cottage Cheese', emoji: '🥣', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: 'Dairy' },
    { name: 'Almonds', emoji: '🥜', calories: 579, protein: 21, carbs: 22, fat: 49, fiber: 12.5, category: 'Dairy' },
    { name: 'Avocado', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, category: 'Dairy' },
    { name: 'Kefir', emoji: '🥛', calories: 41, protein: 3.3, carbs: 4.8, fat: 0.9, fiber: 0, category: 'Dairy' },
    { name: 'Ricotta', emoji: '🍦', calories: 174, protein: 11, carbs: 3, fat: 13, fiber: 0, category: 'Dairy' },
    { name: 'Parmesan', emoji: '🧀', calories: 431, protein: 38, carbs: 4, fat: 29, fiber: 0, category: 'Dairy' },
    { name: 'Olive Oil', emoji: '🫒', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'Dairy' },
    { name: 'Coconut Oil', emoji: '🥥', calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'Dairy' },
    { name: 'Flaxseed', emoji: '🌿', calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, category: 'Dairy' },
    { name: 'Cashews', emoji: '🥜', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, category: 'Dairy' },
    { name: 'Pistachios', emoji: '🥜', calories: 562, protein: 20, carbs: 28, fat: 45, fiber: 10, category: 'Dairy' },
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

const MAX_MACROS = {
  protein: 50,
  carbs: 130,
  fat: 65,
  fiber: 30,
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

// --- COMPONENTS ---

export default function App() {
  const [plateItems, setPlateItems] = useState(() => {
    const saved = localStorage.getItem('healthyPlate');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecipePanel, setShowRecipePanel] = useState(false);

  useEffect(() => {
    localStorage.setItem('healthyPlate', JSON.stringify(plateItems));
  }, [plateItems]);

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
    const totalFiber = plateItems.reduce((sum, item) => sum + item.fiber, 0);
    const score = calculateBalanceScore(plateItems);

    const summaryText = `
🥗 HealthyPlate Meal Summary
----------------------------
Items: ${plateItems.map(i => `${i.emoji} ${i.name}`).join(', ')}

Total Nutrition:
- Calories: ${totalCals.toFixed(1)} kcal
- Protein: ${totalProtein.toFixed(1)}g
- Carbs: ${totalCarbs.toFixed(1)}g
- Fat: ${totalFat.toFixed(1)}g
- Fiber: ${totalFiber.toFixed(1)}g

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
    fiber: acc.fiber + item.fiber,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const score = calculateBalanceScore(plateItems);
  const suggestions = getRecipeSuggestions(plateItems);

  const getScoreBadge = (s) => {
    if (s >= 80) return { label: 'Excellent!', color: 'bg-green-600' };
    if (s >= 60) return { label: 'Good', color: 'bg-lime-500' };
    if (s >= 40) return { label: 'Fair', color: 'bg-amber-500' };
    return { label: 'Needs Work', color: 'bg-red-500' };
  };
  const badge = getScoreBadge(score);

  // SVG Pie Chart Logic
  const getSlices = () => {
    if (plateItems.length === 0) return null;
    let currentAngle = 0;
    const total = plateItems.length;

    return plateItems.map((item, index) => {
      const sliceAngle = (1 / total) * 360;
      const startAngle = currentAngle;
      currentAngle += sliceAngle;

      // Calculate SVG path for slice
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (currentAngle - 90) * (Math.PI / 180);
      const x1 = 150 + 120 * Math.cos(startRad);
      const y1 = 150 + 120 * Math.sin(startRad);
      const x2 = 150 + 120 * Math.cos(endRad);
      const y2 = 150 + 120 * Math.sin(endRad);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const path = `M 150 150 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      // Emoji position (midpoint of slice)
      const midRad = (startAngle + sliceAngle / 2 - 90) * (Math.PI / 180);
      const emojiX = 150 + 75 * Math.cos(midRad);
      const emojiY = 150 + 75 * Math.sin(midRad);

      return (
        <g key={item.id} className="plate-segment-transition">
          <path
            d={path}
            fill={CATEGORY_HEX[item.category]}
            className="opacity-80 hover:opacity-100 transition-opacity duration-200"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x={emojiX}
            y={emojiY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl pointer-events-none"
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" role="application" aria-label="HealthyPlate Meal Planner">
      <a href="#ingredients-section" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-forest focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:z-50">Skip to ingredients</a>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4" role="banner">
        <h1 className="text-4xl font-serif font-bold text-forest">HealthyPlate</h1>
        <div className="flex flex-wrap justify-center gap-3">
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
            🗑 Reset Plate
          </button>
          <button
            onClick={copySummary}
            className="px-4 py-2 rounded-full bg-forest text-white font-semibold hover:bg-forest/90 transition-colors flex items-center gap-2 shadow-lg"
          >
            📋 Copy Summary
          </button>
        </div>
      </header>

      {/* YouTube Recipe Panel */}
      {showRecipePanel && plateItems.length > 0 && (
        <div className="mb-8 p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-white to-red-500"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <span className="text-3xl text-red-500">🎬</span> Recipe Videos for Your Ingredients
              </h2>
              <p className="text-slate-400 mt-1">We found {suggestions.length} recipes matching your plate ingredients!</p>
            </div>
            <button
              onClick={() => window.open(getGlobalYTQuery(), '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              🚀 Search All on YouTube
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map(recipe => (
              <div key={recipe.name} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-red-500/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-4xl">{recipe.emoji}</span>
                    {recipe.progress === 1 && (
                      <span className="bg-green-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-tighter shadow-sm">
                        Perfect Match
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-red-400 transition-colors">{recipe.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{recipe.desc}</p>

                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                      <span>Ingredients Match</span>
                      <span className={recipe.progress === 1 ? 'text-green-400' : 'text-amber-400'}>
                        {recipe.matchedCount}/{recipe.requires.length} matched
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${recipe.progress === 1 ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${recipe.progress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.ytQuery)}`, '_blank')}
                  className="w-full py-3 bg-red-600/10 text-red-500 border border-red-500/30 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-md group-hover:shadow-red-900/40"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                  Watch on YouTube
                </button>
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
      )}

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8" role="main">
        {/* Search Bar */}
        <section id="ingredients-section" className="lg:col-span-2 order-2 lg:order-1 relative" aria-label="Search for foods">
          <input
            type="text"
            placeholder="Search for foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-forest transition-all bg-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
        </section>

        {/* LEFT COLUMN: Food Selector */}
        <section className="space-y-8 order-3 lg:order-2" aria-label="Food selection">
          {/* Category Tabs */}
          <nav className="flex flex-wrap gap-2" aria-label="Food categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${activeCategory === cat
                  ? `bg-${CATEGORY_COLORS[cat]}-500 text-white shadow-md scale-105`
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                style={activeCategory === cat ? { backgroundColor: CATEGORY_HEX[cat] } : {}}
              >
                {cat === 'Vegetables' ? '🥦 ' : cat === 'Fruits' ? '🍎 ' : cat === 'Proteins' ? '🍗 ' : cat === 'Grains' ? '🌾 ' : '🥛 '}
                {cat}
              </button>
            ))}
          </nav>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" role="list" aria-label="Available foods">
            {filteredFoods.map(food => (
              <button
                key={food.name}
                onClick={() => addFood(food)}
                className="food-card-hover bg-white p-4 rounded-2xl shadow-sm text-left group relative border-2 border-transparent hover:border-slate-100"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{food.emoji}</div>
                <div className="font-bold text-slate-800 line-clamp-1">{food.name}</div>
                <div className="text-sm text-slate-500 mt-1">
                  {food.calories} kcal • {food.protein}g P
                </div>
                <div
                  className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `${CATEGORY_HEX[activeCategory]}20`, color: CATEGORY_HEX[activeCategory] }}
                >
                  + Add
                </div>
              </button>
            ))}
          </div>

          {/* Plate Items List (Chips) */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-slate-700">Plate Items</h3>
            <div className="flex flex-wrap gap-2">
              {plateItems.length === 0 ? (
                <p className="text-slate-400 italic">No items added yet</p>
              ) : (
                plateItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ backgroundColor: `${CATEGORY_HEX[item.category]}15`, color: CATEGORY_HEX[item.category] }}
                  >
                    <span>{item.emoji} {item.name}</span>
                    <button
                      onClick={() => removeFood(item.id)}
                      className="hover:scale-125 transition-transform ml-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* YouTube Hint Banner */}
            {plateItems.length > 0 && suggestions.length > 0 && (
              <button
                onClick={() => { setShowRecipePanel(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-center gap-3 hover:bg-amber-100 transition-all shadow-sm group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">🎬</span>
                {suggestions.length} recipe videos match your ingredients! Click to see YouTube tutorials →
              </button>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Plate & Stats */}
        <section className="space-y-6 order-1 lg:order-3" aria-label="Your plate and nutrition">
          {/* Your Plate Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg text-center relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-forest text-left">Your Plate</h2>
              {plateItems.length > 0 && (
                <div className={`${badge.color} text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm`}>
                  {badge.label} {score}%
                </div>
              )}
            </div>

            <div className="relative aspect-square max-w-[280px] mx-auto mb-6">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
                {/* Plate Rim */}
                <circle cx="150" cy="150" r="145" fill="#f1f5f9" />
                <circle cx="150" cy="150" r="130" fill="white" />

                {/* Plate Segments */}
                {plateItems.length === 0 ? (
                  <circle
                    cx="150"
                    cy="150"
                    r="120"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                ) : (
                  getSlices()
                )}

                {/* Empty State Text */}
                {plateItems.length === 0 && (
                  <text
                    x="150"
                    y="150"
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="text-sm font-medium"
                  >
                    Add foods to your plate
                  </text>
                )}
              </svg>
            </div>

            {/* Legend (Mini dots) */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {CATEGORIES.map(cat => (
                <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_HEX[cat] }}></div>
                  {cat}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile "Add Food" Button - only visible on mobile, after the plate */}
          <button
            onClick={() => document.getElementById('ingredients-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full md:hidden bg-forest text-white px-5 py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all border-2 border-forest/20 mt-4"
          >
            <span className="text-xl">🥗</span>
            <span className="font-bold">Add Ingredients</span>
          </button>

          {/* Nutrition Summary Card */}
          <section className="bg-white p-6 rounded-[2rem] shadow-lg space-y-4" aria-label="Nutrition summary">
            <div className="bg-gradient-to-br from-forest to-green-700 p-6 rounded-2xl text-white shadow-inner mb-6">
              <div className="text-sm opacity-80 font-medium mb-1">Total Calories</div>
              <div className="text-4xl font-serif font-bold">{Math.round(totals.calories)}</div>
              <div className="text-xs mt-1 font-medium opacity-70">kcal / your meal</div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Protein', key: 'protein', color: 'bg-red-500', max: MAX_MACROS.protein, unit: 'g' },
                { label: 'Carbs', key: 'carbs', color: 'bg-yellow-500', max: MAX_MACROS.carbs, unit: 'g' },
                { label: 'Fat', key: 'fat', color: 'bg-blue-500', max: MAX_MACROS.fat, unit: 'g' },
                { label: 'Fiber', key: 'fiber', color: 'bg-green-500', max: MAX_MACROS.fiber, unit: 'g' },
              ].map(macro => (
                <div key={macro.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <span>{macro.label}</span>
                    <span>{totals[macro.key].toFixed(1)}{macro.unit} / {macro.max}{macro.unit}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`${macro.color} h-full macro-bar-transition`}
                      style={{ width: `${Math.min((totals[macro.key] / macro.max) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ideal Plate Guide Card */}
          <div className="bg-forest p-6 rounded-[2rem] shadow-lg text-white">
            <h3 className="text-lg font-serif font-bold mb-4">Ideal Plate Guide</h3>
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: CATEGORY_HEX[cat] }}></div>
                    <span className="text-sm font-medium opacity-90">{cat}</span>
                  </div>
                  <span className="text-sm font-bold">{(IDEAL_RATIOS[cat] * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Attribution/Footer */}
      <footer className="mt-12 text-center text-slate-400 text-sm" role="contentinfo">
        <p>© 2026 HealthyPlate • Free online healthy meal planner with macro tracking and recipe suggestions</p><br />
        <p><b>Powered By:</b> <a href="https://www.devtechservicesindia.com/" target="_blank"><u>Dev Tech Services</u></a></p>
      </footer>
    </div>
  );
}