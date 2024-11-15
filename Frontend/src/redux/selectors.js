import { createSelector } from 'reselect';

const selectProducts = (state) => state.products.items;

export const selectFavoritedProducts = createSelector(
    [selectProducts],
    (products) => products.filter((product) => product.isFavorite)
  );
  