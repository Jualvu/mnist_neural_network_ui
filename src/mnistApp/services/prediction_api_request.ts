import axios from 'axios';

export const sendImageToAPI = async (pixelArray: number[], model_to_use: string) => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/predict', {
      image_sample: pixelArray, // send image 28x28 data
      model_to_use: model_to_use // send model chosen to use
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // console.log('Prediction:', response.data);
    return response.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error?.response?.data || error.message);
    return null;
  }
};
