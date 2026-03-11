import axios from 'axios';

// export const fetchFlyersData = async (
//   uniqID: string,
//   page: number,
//   setLoading: any,
//   setRefreshing: any,
// ) => {
//   setLoading(true);
//   try {
//     const response = await axios.get(
//       `https://tinynote.in/ofo/mflyerslist?uniqID=${uniqID}&page=${page}`,
//     );
//     if (response.data?.status === 'Success') {
//       return {
//         newFlyers: response.data.data,
//         hasMoreData: response.data.data.length > 0,
//       };
//     }
//   } catch (error) {
//     console.error('Error fetching flyers:', error);
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
//   return {newFlyers: [], hasMoreData: false};
// };

export const fetchFlyersData = async (
  uniqID: string,
  page: number,
  setLoading: any,
  setRefreshing: any,
) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `https://tinynote.in/ofo/mflyerslist?uniqID=${uniqID}&page=${page}`,
    );
    if (response.data?.status === 'Success') {
      const data = response.data.data;
      const normalizedData = Array.isArray(data) ? data : [data]; // Normalize to an array
      return {
        newFlyers: normalizedData,
        hasMoreData: normalizedData.length > 0,
      };
    }
  } catch (error) {
    console.error('Error fetching flyers:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
  return {newFlyers: [], hasMoreData: false};
};

export const toggleFavorite = async (
  id: any,
  favorites: Set<any>,
  setFavorites: any,
  uniqID: string,
) => {
  const isFavorite = favorites.has(id);
  const updatedFavorites = new Set(favorites);

  if (isFavorite) {
    updatedFavorites.delete(id);
  } else {
    updatedFavorites.add(id);
  }

  setFavorites(updatedFavorites);

  try {
    const endpoint = `https://tinynote.in/ofo/mMarkFav?uniqID=${uniqID}&other_id=${id}&type=brand`;
    const response = await axios.get(endpoint);
    if (!response.data?.status) {
      throw new Error('Failed to toggle favorite');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);

    // Rollback favorites if API fails
    const rollbackFavorites = new Set(favorites);
    if (isFavorite) {
      rollbackFavorites.add(id);
    } else {
      rollbackFavorites.delete(id);
    }
    setFavorites(rollbackFavorites);
  }
};
