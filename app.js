// RecipeBox - Buscador de recetas
(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // Base de datos de recetas
  const RECIPES = [
    { id: 1, name: 'Pasta Carbonara', emoji: '🍝', time: '20 min', diff: 'Media', tags: ['italiana', 'pasta'],
      ingredients: ['400g espaguetis', '200g panceta', '4 yemas', '100g parmesano', 'pimienta negra'],
      steps: ['Cocinar la pasta al dente', 'Freír la panceta crujiente', 'Meclar yemas con queso', 'Combinar todo sin fuego'] },
    { id: 2, name: 'Tacos al Pastor', emoji: '🌮', time: '45 min', diff: 'Alta', tags: ['mexicana', 'carne'],
      ingredients: ['1kg cerdo marinado', 'piña', 'cebolla', 'cilantro', 'tortillas', 'salsa verde'],
      steps: ['Marinar cerdo con achiote', 'Cocinar en trompo o sartén', 'Servir con piña y cebolla', 'Acompañar con salsa'] },
    { id: 3, name: 'Sushi Maki', emoji: '🍣', time: '60 min', diff: 'Alta', tags: ['japonesa', 'pescado'],
      ingredients: ['arroz de sushi', 'alga nori', 'salmón fresco', 'aguacate', 'vinagre de arroz'],
      steps: ['Cocinar y sazonar arroz', 'Extender sobre nori', 'Agregar relleno', 'Enrollar y cortar'] },
    { id: 4, name: 'Ensalada César', emoji: '🥗', time: '15 min', diff: 'Baja', tags: ['saludable', 'vegetariana'],
      ingredients: ['lechuga romana', 'crutones', 'parmesano', 'aderezo césar', 'pollo (opcional)'],
      steps: ['Lavar y cortar lechuga', 'Asar pollo en tiras', 'Mezclar con aderezo', 'Decorar con crutones'] },
    { id: 5, name: 'Ramen Tonkotsu', emoji: '🍜', time: '3h', diff: 'Alta', tags: ['japonesa', 'sopa'],
      ingredients: ['huesos de cerdo', 'fideos ramen', 'huevo', 'cebollín', 'nori', 'salsa de soya'],
      steps: ['Hervir huesos 2h', 'Preparar caldo', 'Cocinar fideos', 'Montar con toppings'] },
    { id: 6, name: 'Brownies de Chocolate', emoji: '🍫', time: '35 min', diff: 'Baja', tags: ['postre', 'dulce'],
      ingredients: ['200g chocolate negro', '150g mantequilla', '3 huevos', '150g azúcar', '100g harina'],
      steps: ['Derretir chocolate con mantequilla', 'Batir huevos con azúcar', 'Integrar todo', 'Hornear 25 min'] },
    { id: 7, name: 'Ceviche Peruano', emoji: '🐟', time: '30 min', diff: 'Media', tags: ['peruana', 'pescado'],
      ingredients: ['500g pescado blanco', 'limón', 'cebolla morada', 'cilantro', 'ají', 'maíz'],
      steps: ['Cortar pescado en cubos', 'Marinar con limón 15min', 'Agregar cebolla y ají', 'Servir con maíz'] },
    { id: 8, name: 'Pizza Margherita', emoji: '🍕', time: '40 min', diff: 'Media', tags: ['italiana', 'horno'],
      ingredients: ['masa de pizza', 'salsa de tomate', 'mozzarella', 'albahaca', 'aceite de oliva'],
      steps: ['Estirar la masa', 'Agregar salsa y queso', 'Hornear 20min a 220°', 'Finalizar con albahaca'] },
    { id: 9, name: 'Curry de Garbanzos', emoji: '🥘', time: '35 min', diff: 'Baja', tags: ['india', 'vegana'],
      ingredients: ['garbanzos cocidos', 'leche de coco', 'curry', 'tomate', 'espinaca', 'arroz'],
      steps: ['Sofreír especias', 'Agregar garbanzos y coco', 'Cocinar 20min', 'Servir con arroz'] },
    { id: 10, name: 'Pancakes Esponjosos', emoji: '🥞', time: '20 min', diff: 'Baja', tags: ['desayuno', 'dulce'],
      ingredients: ['200g harina', '2 huevos', '250ml leche', '50g mantequilla', 'miel', 'frutas'],
      steps: ['Mezclar ingredientes secos', 'Agregar huevos y leche', 'Cocinar en sartén', 'Servir con miel'] },
    { id: 11, name: 'Griego Gyros', emoji: '🥙', time: '50 min', diff: 'Media', tags: ['griega', 'carne'],
      ingredients: ['carne de cordero', 'pan pita', 'tzatziki', 'tomate', 'cebolla', 'papas'],
      steps: ['Marinar y asar carne', 'Preparar tzatziki', 'Calentar pita', 'Montar con vegetales'] },
    { id: 12, name: 'Tiramisú', emoji: '☕', time: '30 min', diff: 'Media', tags: ['postre', 'italiana'],
      ingredients: ['mascarpone', 'café expresso', 'vainillas', 'cacao', 'huevos', 'azúcar'],
      steps: ['Batir yemas con azúcar', 'Incorporar mascarpone', 'Montar capas', 'Refrigerar 4h'] },
  ];

  let favorites = [];
  try { favorites = JSON.parse(localStorage.getItem('recipebox_v1') || '[]'); } catch { favorites = []; }
  let activeTag = '';

  function save() { localStorage.setItem('recipebox_v1', JSON.stringify(favorites)); }
  const uid = () => Date.now().toString(36);

  // Render grid
  function renderRecipes() {
    const q = $('searchInput').value.toLowerCase().trim();
    let filtered = RECIPES.filter(r => {
      if (q && !r.name.toLowerCase().includes(q) && !r.tags.some(t => t.includes(q))) return false;
      if (activeTag && !r.tags.includes(activeTag)) return false;
      return true;
    });

    if (!filtered.length) {
      $('recipesGrid').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No se encontraron recetas</p>';
      return;
    }

    $('recipesGrid').innerHTML = filtered.map(r => `
      <div class="recipe-card" data-id="${r.id}">
        <div class="recipe-img">${r.emoji}</div>
        <div class="recipe-info">
          <div class="recipe-name">${r.name}</div>
          <div class="recipe-meta">
            <span>⏱ ${r.time}</span>
            <span>📊 ${r.diff}</span>
          </div>
          <div class="recipe-tags">${r.tags.map(t => `<span class="recipe-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');

    $('recipesGrid').querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', () => openRecipe(parseInt(card.dataset.id)));
    });
  }

  // Render favoritos
  function renderFavorites() {
    const favRecipes = RECIPES.filter(r => favorites.includes(r.id));
    if (!favRecipes.length) {
      $('favoritesGrid').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No hay favoritos aún</p>';
      return;
    }
    $('favoritesGrid').innerHTML = favRecipes.map(r => `
      <div class="recipe-card" data-id="${r.id}">
        <div class="recipe-img">${r.emoji}</div>
        <div class="recipe-info">
          <div class="recipe-name">${r.name}</div>
          <div class="recipe-meta">
            <span>⏱ ${r.time}</span>
            <span>📊 ${r.diff}</span>
          </div>
        </div>
      </div>
    `).join('');

    $('favoritesGrid').querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', () => openRecipe(parseInt(card.dataset.id)));
    });
  }

  // Modal
  function openRecipe(id) {
    const r = RECIPES.find(x => x.id === id);
    if (!r) return;
    const isFav = favorites.includes(r.id);
    $('recipeContent').innerHTML = `
      <button class="fav-btn ${isFav ? 'active' : ''}" id="toggleFav">❤️</button>
      <h2>${r.emoji} ${r.name}</h2>
      <div class="detail-meta">
        <span>⏱ ${r.time}</span>
        <span>📊 ${r.diff}</span>
        <span>🏷 ${r.tags.join(', ')}</span>
      </div>
      <h3>Ingredientes</h3>
      <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      <h3>Preparación</h3>
      <p>${r.steps.map((s, i) => `<strong>${i+1}.</strong> ${s}`).join('<br>')}</p>
    `;
    $('recipeModal').classList.remove('hidden');
    $('toggleFav').addEventListener('click', () => toggleFav(r.id));
  }

  function toggleFav(id) {
    const idx = favorites.indexOf(id);
    if (idx >= 0) favorites.splice(idx, 1);
    else favorites.push(id);
    save();
    renderFavorites();
    $('favCount').textContent = favorites.length;
    openRecipe(id); // refresh modal
  }

  // Tags
  function renderTags() {
    const tags = [...new Set(RECIPES.flatMap(r => r.tags))];
    $('tagFilters').innerHTML = `
      <span class="tag ${activeTag === '' ? 'active' : ''}" data-tag="">Todos</span>
      ${tags.map(t => `<span class="tag ${activeTag === t ? 'active' : ''}" data-tag="${t}">${t}</span>`).join('')}
    `;
    $('tagFilters').querySelectorAll('.tag').forEach(el => {
      el.addEventListener('click', () => {
        activeTag = el.dataset.tag;
        renderTags();
        renderRecipes();
      });
    });
  }

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      $('exploreView').classList.toggle('hidden', view !== 'explore');
      $('favoritesView').classList.toggle('hidden', view !== 'favorites');
      if (view === 'favorites') renderFavorites();
    });
  });

  // Eventos
  $('searchInput').addEventListener('input', renderRecipes);
  $('closeModal').addEventListener('click', () => $('recipeModal').classList.add('hidden'));
  $('recipeModal').addEventListener('click', (e) => {
    if (e.target.id === 'recipeModal') $('recipeModal').classList.add('hidden');
  });

  // Init
  renderTags();
  renderRecipes();
  $('favCount').textContent = favorites.length;
})();
