const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "9cf53a8f93444cadac7b3e6d990a9e6d";
const scopes = ["user-top-read"];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&scope=${scopes.join(
  "%20"
)}&redirect_uri=http://localhost:3000`;
