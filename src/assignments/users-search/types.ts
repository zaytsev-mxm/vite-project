export type GitHubUser = {
  login: string;
  id: number;
  url: string;
  html_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  score: number;
};

export type SearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
};
