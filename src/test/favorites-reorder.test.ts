import { describe, expect, it } from 'vitest'
import { applyFavoriteOrder } from '../hooks/useFavorites'
import type { FavoriteRoute } from '../types'

function fav(id: string, index: number): FavoriteRoute {
  return {
    id,
    index,
    originAbbr: id.slice(0, 4).toUpperCase(),
    originName: id,
    destinationAbbr: 'EMBR',
    destinationName: 'Embarcadero'
  }
}

describe('favorite reorder', () => {
  it('applies a new order and reindexes', () => {
    const current = [fav('a', 0), fav('b', 1), fav('c', 2)]
    const next = applyFavoriteOrder(current, ['c', 'a', 'b'])
    expect(next.map((item) => item.id)).toEqual(['c', 'a', 'b'])
    expect(next.map((item) => item.index)).toEqual([0, 1, 2])
  })

  it('ignores unknown ids and keeps omitted favorites at the end', () => {
    const current = [fav('a', 0), fav('b', 1), fav('c', 2)]
    const next = applyFavoriteOrder(current, ['b', 'missing', 'b'])
    expect(next.map((item) => item.id)).toEqual(['b', 'a', 'c'])
    expect(next.map((item) => item.index)).toEqual([0, 1, 2])
  })
})
