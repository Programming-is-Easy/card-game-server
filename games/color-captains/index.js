const express = require('express');
const router  = express.Router();
const Hashids = require('hashids/cjs');
// try to generate 4-length lobby codes
const hashids = new Hashids('', 4); 

// deck is our function to generate a new shuffled deck.
const deck = require('./cards');

// TODO: import a list of all cards that are available
// in this game. We probably want to store this in a subfolder to keep the game
// list tidy.
//
// :thinking:... Maybe each 'game' is packaged as self-contained within a folder.
// /games/color-captains/index.js vs /games/color-captains.js
// Think about this.

// Game state variables
// TODO: we may want to store game state to disk in the future
const ACTIVE  = {};
const PLAYERS = {}; // user/game map

/**
 * Middleware function to ensure that the user is logged in.
 */
router.use((req, res, next) => {
	if ( ! req.session.username ) {
		return res.json({
			success: false,
			error: 'You must be logged in to play this game.',
			options: {
				'/signup': 'Create a new account.',
				'/login' : 'Log in to your account.',
			},
		});

	}

	next();
});

/**
 * GET /deck - simple test function to verify that we are
 * getting nicely randomized decks whenever we call this.
 */
router.get('/deck', (req, res) => {
	res.json(deck());
});

/**
 * Default route for /color-captains.
 *
 * Provides a list of options if the player is not in a lobby.
 *
 * If the player is in a lobby, this will act as a heartbeat ping
 * to see current game state.
 */
router.get('/', (req, res) => {
	const game_id = req.query.game_id;

	if ( game_id ) {
		// TODO: write heartbeat code to tell the player if it is their turn
		// or some action is being taken against them.
	} else {
		return res.json({
			success: 'Color Captains - The Game!',
			error: false,
			description: `Color Captains is an homage to Rainbow Pirates. 2-5 players.`,
			options: {
				// TODO: can a player see a list of lobbies inside this game?
				'/new': 'Start a new game and invite your friends.',
				'/join': 'Join a game with an invite code.',
			},
		});
	}

	return res.json({
		error: 'Unreachable',
	});
});

/**
 * POST /new - Start a new game of Color Captains
 */
router.get('/new', (req, res) => {
	if ( req.session.username in PLAYERS ) {
		const game_path = `/join/${PLAYERS[req.session.username]}`;
		const json_output = {
			success: false,
			error: 'You are currently in a game.',
			options: {
			},
		};
		json_output[options][game_path] = 'Rejoin the game you are in.';
		return res.json(json_output);
	}

	const lobby_id = hashids.encode(Object.keys(ACTIVE).length);

	const game_lobby = {
		id: lobby_id,
		owner: req.session.username,
		status: 'waiting',
		lobby: [req.session.username], 
		ready: [],
		created: new Date(),
	};

	ACTIVE[lobby_id] = game_lobby;

	req.session.game = game_lobby;
	
	return res.json({
		success: `You have created a new Color Captains game. Your lobby id is "${lobby_id}".`,
		error: false,
		options: {
			'/invite': 'Invite an active player to this game.',
			'/leave': 'Leave this game lobby.',
			'/ready': 'Mark yourself as ready.',
		},
	});
});

module.exports = router;
