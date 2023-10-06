const express = require('express');
const session = require('express-session');
const bcrypt  = require('bcrypt');
const app = express();

// Game server and state variables
const version = 0.1;

// TOOD: eventually replace USERS with on-disk data storage
const USERS   = {};   // registered users
const PLAYERS = {}; // logged-in players

const colorCaptainsGame = require('./games/color-captains/index');

const GAMES   = {
	'Color Captains': '/color-captains',
	'Global Thermonuclear War': '/global-thermonuclear-war',
};

app.get('/global-thermonuclear-war', (_req, res) => {
	res.redirect('https://nuclearsecrecy.com/nukemap/?&kt=5000&lat=41.8699304&lng=-87.6363659&hob_psi=5&hob_ft=17519&casualties=1&fallout=1&ff=50&psi=20,5,1&zm=9.251187246738718');
});

app.use(session({
	key: 'card-game-server',
	secret: 'card-game-server', 
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false },
}));

app.use((req, _res, next) => {
	console.log(`Request for ${req.url}, [user: ${req.session.username}]`);

	next();
});

// enable our color-captains game
app.use('/color-captains', colorCaptainsGame);

// normal route to `/`.
// TODO: respond with a list of options so that the API can be
// self-describing.
// TODO: This also needs to be a heartbeat for the game server so that
// we can notify players when they have been invited to a game.
app.get('/', (_req, res) => {
	res.json({
		success: 'Card Game Server!',
		error: false,
		'card-game-server': version,
		invites: [],
	});
});

/**
 * GET /list - Display a list of all games available on this server.
 */
app.get('/list', (req, res) => {
	return res.json({
		success: 'Games Available',
		error: false,
		games: GAMES,
	});
});

/**
 * GET /players - Display a list of active players connected to the server.
 */
app.get('/players', (req, res) => {
	res.json({
		success: 'Player list',
		error: false,
		players: PLAYERS,
	});
});

/**
 * POST /login - This route allows us to log in to the server and mark
 * ourselves as being in a lobby.
 *
 * @param username
 * @param password
 *
 * TODO: until we develop a game client, it will be much easier
 * to test these routes with normal HTTP GET requests. Switch this back
 * to app.post when we have a client or a test suite.
 */
app.get('/login', (req, res) => {
	const username = req.query.username?.trim();
	const password = req.query.password?.trim();

	if ( ! username || ! password ) {
		return res.json({
			success: false,
			error: `The username ${username} does not exist.`,
			options: {
				'/signup': 'Create a new account.',
				'/login' : 'Log in to your account.',
			}
		});
	}

	if ( ! (username in USERS) ) {
		// TODO: this kind of error message is a light security vulnerability.
		// It provides an attacker with too much information.
		return res.json({
			success: false,
			error: `The username ${username} does not exist.`,
			options: {
				'/signup': 'Create a new account.',
			}
		});
	}

	console.log(USERS);

	bcrypt.compare(password, USERS[username].__passhash, (_err, result) => {
		console.error(_err);
		if ( result ) {
			PLAYERS[username] = 'lobby';

			// TODO:
			// USERS[username].lobby will be null if they were not in a game.
			// If it has a value in it, in the future we'll want to reconnect
			// them to that game so that they can resume playing if the game is
			// still active.
			if ( USERS[username] ) {
				console.log(`TODO: ${username} was in a lobby.`);
			}

			req.session.username = username;

			return res.json({
				success: 'You are logged in!',
				error: false,
				username: username,
				options: {
					'/logout'  : 'Log out from the game server.',
					'/list'    : 'See a list of all available games.',
					'/players' : 'See a list of all players that are online.',
				},
			});
		} else {
			return res.json({
				success: false,
				error: `Username or password did not match.`,
				options: {
					'/signup': 'Create a new account.',
					'/login' : 'Log in to your account.',
				},
			});
		}
	});
});

/**
 * POST /logout - Log the current user out of their session.
 *
 * TODO: change back to post once we have the server finalized
 */
app.get('/logout', (req, res) => {
	if ( ! req.session.username ) {
		return res.json({
			success: false,
			error: 'You are not logged in.',
			options: {
				'/signup': 'Create a new account.',
				'/login' : 'Log in to your account.',
			}
		});
	}

	// unset game/lobby state
	if ( USERS[req.session.username].lobby ) {
		// TODO: we need to make sure we have a method to notify any
		// active game that we're in that our player has intentionally
		// logged off. 
		console.log(`WARNING: The user ${req.session.username} has just rage-quit.`);
	}

	delete PLAYERS[req.session.username]; 
	req.session.destroy(() => {
		return res.json({
			success: `You are logged out!`,
			error: false,
		});
	});
});

/**
 * POST /signup - This route allows us to create an account to play
 * on the game server.
 *
 * @param username
 * @param password
 */
app.get('/signup', (req, res) => {
	// get the username
	const username = req.query.username?.trim();
	
	// get the password
	const password = req.query.password?.trim();
	
	// check our required fields
	if ( ! username || ! password ) {
		return res.json({
			success: false,
			error: `The username ${username} does not exist.`,
			options: {
				'/signup': 'Create a new account.',
				'/login' : 'Log in to your account.',
			}
		});
	}

	// check to see if the user exists
	// TODO: We aren't quite ready for a database yet, so we can use
	// a simple JSON file to store username + hashed passwords first.
	if ( username in USERS ) {
		return res.json({
			success: false,
			error: `User ${username} already exists. If this is your account, log in.`,
			options: {
				'/login' : 'Log in to your account.',
			},
		});
	}

	// create an account if it doesn't exist
	bcrypt.genSalt(10, (_err, salt) => {
		bcrypt.hash(password, salt, function(_err, hash) {
			USERS[username] = {
				__passhash: hash,
				lobby: null, // if the player is in a game or lobby
			};

			// log the user in
			req.session.username = username;

			// store a reference to this user being on the game server
			PLAYERS[username] = 'lobby'; 

			res.json({
				success: `Welcome to the card-game-server, ${username}! You are logged in!`,
				error: false,
				username: username,
				options: {
					'/logout'  : 'Log out from the game server.',
					'/list'    : 'See a list of all available games.',
					'/players' : 'See a list of all players that are online.',
				},
			});
		});
	})	
});



app.listen(5000, () => {
	console.log('Server running on port 5000');
});
