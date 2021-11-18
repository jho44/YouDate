const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "https://localhost:8000/";
const clientId = "e01ecada9ada4a76ace4e6ede7d55b76";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}`;