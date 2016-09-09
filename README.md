# feathersjs-redux-model

FeathersJS client that hooks into your Redux store

## Install

Install as an npm package directly from Github:

```bash
npm install --save codaisseur/feathersjs-redux-model
```

## Extend

Create your own model that extends from the included base model. Set up
defaults, findParams, and set the (singular) name for the resource in the
constructor (e.g. 'game' will use the 'games' service of your FeathersJS API).

```js
// models/GameModel.js

import BaseModel from 'feathersjs-redux-model/build/models/base-model'

class GameModel extends BaseModel {
  defaults() {
    return {
      cards: [],
      players: [],
      started: false,
      winner: null,
      turn: 0,
      createdAt: Date.now,
      updatedAt: Date.now
    };
  }

  findParams() {
    return {
      query: {
        $sort: { createdAt: -1 },
        $limit: 10
      }
    };
  }

  constructor(dispatch, onError) {
    super('game', dispatch, onError);
  }
}

const gameModel = new GameModel()

export default gameModel
```

## Setup

Set up the model by passing your store's `dispatch` on to it, and (if needed)
authenticate. Always run a `model.find()` during setup.

```js
// actions/setup-games.js

import model from '../models/game-model'

export const GAME_SETUP = 'GAME_SETUP'

export default function setupGames() {
  return dispatch => {
    model.dispatch = dispatch
    model.app.authenticate().then((response) => {
      model.find()
      dispatch(gameSetup())
    })
  }
}

export function gameSetup() {
  return {
    type: GAME_SETUP
  }
}
```

## Reduce

The model emits actions whenever the socket connection to the service receives
any of the following events:

  - created - A resource was created
  - updated - A resource was updated
  - destroyed - A resource was destroyed

A full update of the resources can be triggered manually, by calling
`model.find()`, like we do during setup.

Each of the events triggers an action dispatch to your Redux store. The type
of these events is generated based on the name of the model, and follows the
following pattern:

  - find() -> type: `GAMES_FETCHED`, payload `resources`
  - created -> type: `GAME_CREATED`, payload `resource` that was created
  - updated -> type: `GAME_UPDATED`, payload `resource` that was updated
  - destroyed -> type: `GAME_DESTROYED`, payload `resource` that was destroyed

In the example above we used the GameModel, so your events will look differently
if you have another name for your model and service, e.g. `CARDS_FETCHED` for
a `CardsModel` that hooks up to the `cards` service.

### Example Reducer

An example for a `games` reducer that acts on the default action types below:

```js
export default function updateGames(state = [], { type, payload }) {
  switch (type) {
    case 'GAMES_FETCHED' :
      return payload

    case 'GAME_CREATED' :
      return state.concat([payload])

    case 'GAME_UPDATED' :
      const current = payload
      return state.map((game) => {
        return (game._id === current._id) ? current : game
      })

    case 'GAME_REMOVED' :
      const removed = payload
      return state.filter((game) => (game._id !== current._id))

    default :
      return state
  }
}
```
