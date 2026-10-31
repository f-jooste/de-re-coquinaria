-- The permanent seed: what makes `supabase db reset` useful, and what ticket 05's suite runs
-- against without a network call. Creation timestamps are copied verbatim from the JSON fixtures
-- src/data/recipes/*.json carried (newest-first ordering depends on them, and after this
-- milestone nothing else in the repository remembers what they were).

insert into categories (slug, name, sort_order, tile_bg) values
  ('drinks',           'Drinks',          0, '#D3E3E6'),
  ('breakfast',        'Breakfast',       1, '#F5E2AE'),
  ('lunch',            'Lunch',           2, '#DFE8CE'),
  ('dinner',           'Dinner',          3, '#F3D3C3'),
  ('desserts',         'Desserts',        4, '#EFD6DF'),
  ('snacks-and-sides', 'Snacks & sides',  5, '#E3DAEE');

insert into tags (slug, name) values
  ('mexican',    'Mexican'),
  ('chicken',    'Chicken'),
  ('weeknight',  'Weeknight'),
  ('vegetarian', 'Vegetarian'),
  ('quick',      'Quick'),
  ('make-ahead', 'Make Ahead'),
  ('citrus',     'Citrus'),
  ('sweet',      'Sweet'),
  ('yoghurt',    'Yoghurt'),
  ('fish',       'Fish');

insert into recipes
  (id, slug, title, ingredients, steps, prep_minutes, cook_minutes, servings, notes, hero_path,
   status, archived_at, created_at, updated_at)
values
  (
    '00000000-0000-0000-0000-000000000001', 'chicken-tinga-tacos', 'Chicken tinga tacos',
    array[
      'For the chicken:',
      '600 g boneless chicken thighs',
      '1 tsp salt',
      '2 bay leaves',
      'For the sauce:',
      '3 ripe tomatoes, quartered',
      '1 white onion, roughly chopped',
      '2 chipotles in adobo, plus 1 tbsp of the sauce',
      'To serve:',
      '12 small corn tortillas',
      'Coriander and lime wedges'
    ],
    array[
      'Simmer the chicken with the salt and bay leaves in just enough water to cover, about 20 minutes. Shred it and keep 1 cup of the broth.',
      'Blend the tomatoes, onion, chipotles and adobo sauce until smooth.',
      'Fry the sauce in a wide pan for 8 minutes until it darkens, then add the chicken and enough broth to loosen it. Cook 10 more minutes.',
      'Warm the tortillas, fill, and finish with coriander and a squeeze of lime.'
    ],
    15, 30, 4,
    'Use one chipotle for mild, three for properly spicy. The filling keeps for three days and gets better overnight.',
    null, 'published', null,
    '2026-01-05T12:00:00.000Z', '2026-01-05T12:00:00.000Z'
  ),
  (
    '00000000-0000-0000-0000-000000000002', 'chickpea-coconut-curry', 'Chickpea coconut curry',
    array[
      'For the base:',
      '2 tbsp neutral oil',
      '1 large onion, finely chopped',
      '3 garlic cloves, minced',
      '1 tbsp grated ginger',
      '2 tsp curry powder',
      '1 tsp ground cumin',
      '1 tsp ground coriander',
      '1/2 tsp ground turmeric',
      '1/4 tsp chilli flakes, or to taste',
      '2 tbsp curry paste (red or yellow)',
      'For the curry:',
      '400 g tin chopped tomatoes',
      '400 ml tin coconut milk',
      '2 x 400 g tins chickpeas, drained and rinsed',
      '1 tsp salt, or to taste',
      '1 tsp sugar',
      'To finish:',
      'A large handful of spinach or chopped coriander',
      'Steamed rice or warm flatbread, to serve',
      'Lime wedges, to serve'
    ],
    array[
      'Heat the oil in a large, heavy-based pot over medium heat. Add the onion and cook for 6-7 minutes, stirring occasionally, until soft and starting to turn golden.',
      'Add the garlic and ginger and cook for 1 minute more, until fragrant.',
      'Stir in the curry powder, cumin, coriander, turmeric and chilli flakes and cook for 30 seconds, just long enough to toast the spices without burning them.',
      'Add the curry paste and cook for another minute, stirring it into the onions.',
      'Pour in the chopped tomatoes and simmer for 5 minutes, scraping up anything stuck to the bottom of the pot.',
      'Add the coconut milk, chickpeas, salt and sugar. Stir well and bring to a gentle simmer.',
      'Cook uncovered for 15-20 minutes, stirring occasionally, until the sauce has thickened and coats the chickpeas.',
      'Taste and adjust the salt, sugar or chilli. The sauce should be rounded, not sharp from the tomatoes.',
      'Stir in the spinach or coriander in the last minute, just to wilt it through.',
      'Serve hot over rice or with flatbread, with lime wedges on the side.'
    ],
    15, 30, 4,
    'Keeps well for four days in the fridge and freezes for up to three months. The flavour deepens overnight.',
    null, 'published', null,
    '2026-03-01T19:00:00.000Z', '2026-03-01T19:00:00.000Z'
  ),
  (
    '00000000-0000-0000-0000-000000000003', 'crispy-paprika-chickpeas', 'Crispy paprika chickpeas',
    array[
      '2 x 400 g tins chickpeas, drained and rinsed',
      '2 tbsp olive oil',
      '1 tsp smoked paprika',
      '1/2 tsp garlic powder',
      '1/2 tsp salt',
      'A pinch of cayenne pepper (optional)'
    ],
    array[
      'Heat the oven to 200°C (fan 180°C).',
      'Pat the chickpeas completely dry with a clean tea towel. The drier they are, the crispier they get.',
      'Toss the chickpeas with the olive oil, smoked paprika, garlic powder, salt and cayenne until evenly coated.',
      'Spread them in a single layer on a baking tray.',
      'Roast for 25-30 minutes, shaking the tray halfway through, until deeply golden and crisp.',
      'Let them cool for a few minutes on the tray. They crisp up further as they cool. Serve warm or at room temperature.'
    ],
    5, 25, 4, null, null, 'published', null,
    '2026-02-20T14:00:00.000Z', '2026-02-20T14:00:00.000Z'
  ),
  (
    '00000000-0000-0000-0000-000000000004', 'lemon-posset', 'Lemon posset',
    array[
      '600 ml double cream',
      '150 g caster sugar',
      'Zest of 2 lemons',
      '100 ml fresh lemon juice (about 3 lemons)',
      'Berries or shortbread, to serve'
    ],
    array[
      'Put the cream, sugar and lemon zest in a wide saucepan and bring to a gentle boil over medium heat, stirring occasionally.',
      'Once boiling, simmer for exactly 3 minutes, stirring constantly so it doesn''t catch on the bottom of the pan.',
      'Take off the heat and stir in the lemon juice. The mixture will thicken slightly as it cools.',
      'Strain through a sieve into a jug to catch the zest, then pour into six small glasses or ramekins.',
      'Chill for at least 4 hours, ideally overnight, until fully set.',
      'Serve cold, topped with a few berries or with shortbread on the side.'
    ],
    15, 5, 6,
    'Sets fully in the fridge. Don''t be tempted to freeze it to speed things up, the texture goes grainy.',
    null, 'published', null,
    '2026-02-01T18:00:00.000Z', '2026-02-01T18:00:00.000Z'
  ),
  (
    '00000000-0000-0000-0000-000000000005', 'mango-lassi', 'Mango lassi',
    array[
      '2 ripe mangoes, peeled and chopped (or 2 cups frozen mango chunks)',
      '1 cup plain yoghurt',
      '1/2 cup cold milk',
      '2 tbsp honey, or to taste',
      '1/4 tsp ground cardamom',
      'A handful of ice cubes',
      'Chopped pistachios, to serve (optional)'
    ],
    array[
      'Combine the mango, yoghurt, milk, honey and cardamom in a blender.',
      'Blend until completely smooth, about 30 seconds.',
      'Taste and adjust the honey depending on how ripe the mango is.',
      'Add the ice and blend again until frothy and well chilled.',
      'Pour into glasses and top with pistachios if using.'
    ],
    5, null, 2,
    'Frozen mango skips the ice and blends up thicker, which is nice for a rushed breakfast.',
    null, 'published', null,
    '2026-01-20T08:30:00.000Z', '2026-01-20T08:30:00.000Z'
  ),
  (
    '00000000-0000-0000-0000-000000000006', 'miso-salmon', 'Miso salmon',
    array[
      '2 salmon fillets, skin on',
      '2 tbsp white miso paste',
      '1 tbsp mirin',
      '1 tbsp soy sauce',
      '1 tsp rice vinegar',
      '1 tsp neutral oil',
      'Steamed rice and greens, to serve'
    ],
    array[
      'Whisk the miso, mirin, soy sauce and rice vinegar together in a small bowl.',
      'Pat the salmon dry and coat both sides in the marinade. Leave for at least 10 minutes.',
      'Heat the oil in a non-stick pan over medium-high heat and sear the salmon skin-side down for 4 minutes.',
      'Flip and cook for 2-3 minutes more, brushing with any remaining marinade, until just cooked through.',
      'Serve immediately over rice with steamed greens.'
    ],
    null, null, null, null, null, 'published', null,
    '2026-02-10T09:00:00.000Z', '2026-02-10T09:00:00.000Z'
  );

insert into recipe_categories (recipe_id, category_slug) values
  ('00000000-0000-0000-0000-000000000001', 'dinner'),
  ('00000000-0000-0000-0000-000000000002', 'dinner'),
  ('00000000-0000-0000-0000-000000000002', 'lunch'),
  ('00000000-0000-0000-0000-000000000003', 'snacks-and-sides'),
  ('00000000-0000-0000-0000-000000000003', 'lunch'),
  ('00000000-0000-0000-0000-000000000004', 'desserts'),
  ('00000000-0000-0000-0000-000000000005', 'drinks'),
  ('00000000-0000-0000-0000-000000000005', 'breakfast'),
  ('00000000-0000-0000-0000-000000000006', 'dinner');

insert into recipe_tags (recipe_id, tag_slug) values
  ('00000000-0000-0000-0000-000000000001', 'mexican'),
  ('00000000-0000-0000-0000-000000000001', 'chicken'),
  ('00000000-0000-0000-0000-000000000001', 'weeknight'),
  ('00000000-0000-0000-0000-000000000002', 'vegetarian'),
  ('00000000-0000-0000-0000-000000000002', 'weeknight'),
  ('00000000-0000-0000-0000-000000000003', 'vegetarian'),
  ('00000000-0000-0000-0000-000000000003', 'quick'),
  ('00000000-0000-0000-0000-000000000004', 'make-ahead'),
  ('00000000-0000-0000-0000-000000000004', 'citrus'),
  ('00000000-0000-0000-0000-000000000005', 'sweet'),
  ('00000000-0000-0000-0000-000000000005', 'yoghurt'),
  ('00000000-0000-0000-0000-000000000006', 'fish'),
  ('00000000-0000-0000-0000-000000000006', 'weeknight'),
  ('00000000-0000-0000-0000-000000000006', 'quick');
