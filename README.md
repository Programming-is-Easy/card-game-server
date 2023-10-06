# card-game-server
A multiplayer card-game-server written in NodeJS.

### Games 
- Color Captains (Rainbow Pirates homage)
 - https://www.sweetbrosgames.com/rainbow-pirates
 - Rules: https://www.sweetbrosgames.com/_files/ugd/f30bc3_b81258e476c94b3fa0f036d839ddfe75.pdf

## Game Server
Responsible for letting players connect, create an account, log in, list all
available games, and see what players are online.

### Game Server Routes
- POST /signup?username=:username&password=:password
- POST /login?username=:username&password=:password
- GET /list
- GET /players

## Game Code
Code that lives inside the `/games` folder and contain all of the logic necessary
for a single game.

