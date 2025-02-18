A little project made with love.

Web App that connects with Spotify's API to allow the user to create, change and order playlists from their account.

The published page is not yet accessible to everyone, as the Spotify app is still in development mode. However, you can run the code locally by adding your own Spotify app token to the clientId constant at the requestAuthorization function in ./src/app/api/spotify/spotify-authorization.tsx and at the fetchSpotifyTocken function in ./src/app/api/spotify/call-api.tsx. To check how to do this: https://developer.spotify.com/documentation/web-api/concepts/apps

Don't forget to add http://localhost:3000 and http://localhost:3000/workspace as Redirect URIs in your app.
