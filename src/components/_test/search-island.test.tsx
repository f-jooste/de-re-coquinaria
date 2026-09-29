// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SearchIsland from '../SearchIsland';
import { makeRecipe } from '../../lib/testing/recipe-fixture';

afterEach(cleanup);

const RECIPES = [
  makeRecipe({ slug: 'chicken-tinga-tacos', title: 'Chicken tinga tacos', tags: ['mexican'] }),
  makeRecipe({ slug: 'miso-salmon', title: 'Miso salmon', ingredients: ['2 salmon fillets'] }),
];

describe('SearchIsland', () => {
  it('shows no results panel until the Visitor types', () => {
    render(<SearchIsland recipes={RECIPES} />);
    expect(screen.queryByRole('region', { name: 'Search results' })).toBeNull();
  });

  it('shows matching Recipes as the Visitor types, without a form submission', () => {
    render(<SearchIsland recipes={RECIPES} />);
    const input = screen.getByLabelText('Search recipes');
    expect(input.closest('form')).toBeNull();

    fireEvent.change(input, { target: { value: 'Chicken tinga' } });

    expect(screen.queryByText('Chicken tinga tacos')).not.toBeNull();
    expect(screen.queryByText('Miso salmon')).toBeNull();
  });

  it('shows which field each result matched on', () => {
    render(<SearchIsland recipes={RECIPES} />);
    const input = screen.getByLabelText('Search recipes');

    fireEvent.change(input, { target: { value: 'mexican' } });
    expect(screen.queryByText('Matched tag')).not.toBeNull();

    fireEvent.change(input, { target: { value: 'salmon fillets' } });
    expect(screen.queryByText('Matched ingredient')).not.toBeNull();

    fireEvent.change(input, { target: { value: 'Miso salmon' } });
    expect(screen.queryByText('Matched title')).not.toBeNull();
  });

  it('renders a calm empty state for a query matching nothing', () => {
    render(<SearchIsland recipes={RECIPES} />);
    const input = screen.getByLabelText('Search recipes');

    fireEvent.change(input, { target: { value: 'xylophone quantum' } });

    expect(screen.queryByText('Nothing matches that yet')).not.toBeNull();
    expect(screen.queryByRole('region', { name: 'Search results' })).toBeNull();
  });

  it('returns to the unsearched state once the query is cleared', () => {
    render(<SearchIsland recipes={RECIPES} />);
    const input = screen.getByLabelText('Search recipes');

    fireEvent.change(input, { target: { value: 'Chicken' } });
    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeNull();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('region', { name: 'Search results' })).toBeNull();
    expect(screen.queryByText('Nothing matches that yet')).toBeNull();
  });
});
