// primary module.exports
/**
 * deck(void): void 
 *
 * generates a new array of cards with the correct count.
 * When this function is called, the deck that is returned is shuffled
 * for randomness.
 */
function deck() {
	let cards = [];

	// sort our CARDLIST first for spicy
	// extra sorting
	const card_names = super_shuffle(Object.keys(CARDLIST));

	// loop through every card in CARDLIST
	for ( let i = 0; i < card_names.length; ++i ) {
		const card_def = CARDLIST[card_names[i]];


		// add .count cards to the deck
		for ( let j = 0; j < card_def.count; ++j ) {
			cards.push(card_names[i]);
		}
	}

	// make sure the deck is thoroughly shuffled
	return super_shuffle(cards);
}

// TODO: this method of sorting the deck randomly
// is not very good at distributing the cards.
// Implement a better and more cost-efficient sorting algorithm later.
function super_shuffle(cards) {
	cards.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random())
		.sort(() => .5 - Math.random());

	return cards;
}

const CARDLIST = {
	// color cards
	mommy: {
		count: 11,
		color: 'red',
		number: 1,
		type: 'color',
		points: 1,
		description: 'Your mother is short, plump, and kind of ugly.',
	},
	'el gato': {
		count: 11,
		color: 'orange',
		number: 2,
		type: 'color',
		points: 1,
		description: 'This cat looks fat.',
	},
	rum: {
		count: 11,
		color: 'yellow',
		number: 3,
		type: 'color',
		points: 1,
		description: '"But why is all the rum gone?"',
	},
	privacy: {
		count: 11,
		color: 'green',
		number: 4,
		type: 'color',
		points: 1,
		description: 'It is so hard to find a private spot on this stupid boat.',
	},
	'mr. bubbles': {
		count: 11,
		color: 'blue',
		number: 5,
		type: 'color',
		points: 1,
		description: `Just because we are sailors doesn't mean we have to smell like one.`,
	},
	'sexy mermaid': {
		count: 11,
		color: 'purple',
		number: 6,
		type: 'color',
		points: 1,
		description: `"I think we've been out to sea too long, Cap'n."`,
	},
	'cinnamon roll': {
		count: 11,
		color: 'pink',
		number: 7,
		type: 'color',
		points: 1,
		description: `If you squint really hard, these ship biscuits kind of look like a Cinnamon Roll.`,
	},
	// wild cards - acts like a normal color card, but can be used
	// in place of any.
	wild: {
		count: 7,
		color: 'rainbow',
		type: 'color',
		number: 0,
		points: 1,
		description: `I fell in love with a really fat mermaid once.`,
	},
	// black cards
	'dirty thief': {
		count: 5,
		color: 'red',
		type: 'black',
		blocked: 'mom',
		points: 1,
		description: `Steal 1 (one) card from an opponents island. (Card is yours)`,
	},
	'the big guns': {
		count: 4,
		color: 'orange',
		type: 'black',
		blocked: 'el gato',
		points: 1,
		description: `Destroy 1 (one) card on an opponent's island. (Destroyed card goes into discard pile)`,
	},
	'whiskey': {
		count: 4,
		color: 'yellow',
		type: 'black',
		blocked: 'rum',
		points: 1,
		description: 'Choose any 1 (one) card in Discard Pile to revive. (Card is yours)',
	},
	'captain': {
		count: 3,
		color: 'green',
		type: 'black',
		blocked: 'privacy',
		points: 1,
		description: `Force each of your opponents to give you 1 (one) Black Card from their hand unless they don't have any.`,
	},
	'the stinky kid': {
		count: 4,
		color: 'blue',
		type: 'black',
		blocked: 'mr. bubbles',
		points: 1,
		description: `Steal 2 (two) cards from an opponent's hand without looking. (Stolen cards are yours)`,
	},
	'shore leave': { 
		count: 5,
		color: 'purple',
		type: 'black',
		blocked: 'sexy mermaid',
		points: 1,
		description: `Draw the top 3 (three) cards from the Draw Pile. (You still draw at the end of your turn)`,
	},
	maggots: {
		count: 2,
		color: 'pink',
		type: 'black',
		blocked: 'cinnamon roll',
		points: 1,
		description: 'Demand 1 (one) specific card by name from an opponent. (If they have the card, it becomes yours)'
	},
	lookout: {
		count: 4,
		color: 'yellow',
		type: 'black',
		blocked: false, // this card is unblockable
		points: 1,
		description: 'Secretly view the top 4 (four) cards on the Draw Pile. Rearrange them and return them to the top of the pile.',
	},

	// color captain cards
	'color captain': { // card does nothing, but is worth 5 points
		count: 5,
		type: 'captain',
		points: 5,
		description: 'This card must be placed on your island during your turn.'
	},
};

// return the deck function to our game so that we can 
// always build a new deck whenever we need one.
module.exports = deck;
