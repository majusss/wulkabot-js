const axios = require("axios");

class GitHub {
  constructor() {
    this.http = axios.create({
      baseURL: "https://api.github.com/",
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    this.colors = this.http
      .get(
        "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
      )
      .then((res) => res.data);
  }

  async fetchRepo(owner, repo) {
    if (!owner || !repo) return {};
    const response = await this.http.get(`/repos/${owner}/${repo}`);
    return response.data;
  }

  async fetchOpenPulls(owner, repo) {
    const response = await this.http.get(`/repos/${owner}/${repo}/pulls`, {
      params: {
        state: "open",
        sort: "updated",
        direction: "desc",
        per_page: 25,
      },
    });
    return response.data;
  }

  async fetchIssue(owner, repo, issueNumber) {
    const response = await this.http.get(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
    );
    return response.data;
  }

  async fetchLatestRelease(owner, repo) {
    const response = await this.http.get(
      `/repos/${owner}/${repo}/releases/latest`,
    );
    return response.data;
  }
}

module.exports = GitHub;
