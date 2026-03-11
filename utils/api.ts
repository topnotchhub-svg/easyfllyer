import axios from 'axios';

export const fetchStoresData = async (postal: any) => {
  if (!postal) {
    throw new Error('Postal code not found');
  }
  const response = await axios.get(
    `https://tinynote.in/ofo/mbrandslist?postal=${postal}`,
  );
  return response.data;
};

export const toggleFavoriteApi = async (uniqID: any, storeId: any) => {
  const response = await axios.get(
    `https://tinynote.in/ofo/mMarkFav?uniqID=${uniqID}&other_id=${storeId}&type=store`,
  );
  return response.data;
};

export const fetchCategoriesData = async () => {
  const response = await axios.get('https://tinynote.in/ofo/mcategorylist');
  if (response.data.status === 'Success') {
    return response.data.data;
  }
  return {
    error: 'Failed to fetch categories',
  };
};

export const fetchFlyersData = async (uniqID: any) => {
  const response = await axios.get(
    `https://tinynote.in/ofo/mflyerslist?uniqID=${uniqID}`,
  );
  return response.data;
};

export const fetchSpecialEventsData = async (uniqID: any) => {
  const response = await axios.get(
    `https://tinynote.in/ofo/mspecialevents?uniqID=${uniqID}`,
  );
  return response.data;
};

export const fetchGiftCardsData = async (postal: any) => {
  const response = await axios.get(
    `https://tinynote.in/ofo/mcardlist?postal=${postal}`,
  );
  return response.data;
};

export const deleteAccount = async (uniqID: any) => {
  const response = await axios.get(
    `https://tinynote.in/ofo/mdeleteAccount?uniqID=${uniqID}`,
  );
  return response.data;
};
