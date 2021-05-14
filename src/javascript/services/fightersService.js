import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = 'fighters.json';
      const apiResult = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    const endpoint = `details/fighter/${id}.json`;
    let fighterDetails;
    await callApi(endpoint,'GET')
      .then(response => fighterDetails = response);
    return fighterDetails;
  }
}

export const fighterService = new FighterService();
