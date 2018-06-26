import axios from 'axios'

class ConfigSnapshotApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/configsnapshot`
  }

  async getForConfig(configId) {
    return await axios.get(this.endpoint, {
      params: {
        where: {
          config: configId,
        },
        sort: 'id DESC',
      },
    }).then(response => response.data)
  }

}

export default new ConfigSnapshotApi()