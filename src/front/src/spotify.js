const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "fbbb7c8a525e45a8b1e47c28f83535b3";
const scopes = ["user-top-read", "user-read-email"];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&scope=${scopes.join(
  "%20"
)}&redirect_uri=http://localhost:3000`;
