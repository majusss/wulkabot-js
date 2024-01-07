const axios = require("axios");

const BASE_URL = "https://manager.wulkanowy.net.pl";
const WULKANOWY_HASH = "daeff1893f3c8128";

class WulkanowyBuild {
  constructor(data) {
    this.build_number = data.build_number;
    this.build_slug = data.build_slug;
    this.artifact_slug = data.artifact_slug;
  }

  get download_url() {
    return `${BASE_URL}/v1/download/app/${WULKANOWY_HASH}/build/${this.build_slug}/artifact/${this.artifact_slug}`;
  }
}

class WulkanowyManagerException extends Error {
  constructor(message) {
    super(message);
    this.name = "WulkanowyManagerException";
  }
}

class WulkanowyManager {
  constructor() {
    this.http = axios.create({ baseURL: BASE_URL });
  }

  async fetchBranchBuild(branch) {
    try {
      const response = await this.http.get(
        `/v1/build/app/${WULKANOWY_HASH}/branch/${branch}`,
      );
      const json = response.data;
      if (!json.success) {
        throw new WulkanowyManagerException(json.error);
      }
      return new WulkanowyBuild(json.data);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = WulkanowyManager;
