import store from '../../../store';
import { PLAYER_ONE, PLAYER_TWO } from '../../../const';
import game from '../../../store/ducks/game';
import board from '../../../store/ducks/board';
import { flipX, flipY, rotate } from '../../../utils/Figure';

class StoreManager {
  engine = null;
  state = null;
  activeFigure = null;
  
  constructor(engine) {
    this.engine = engine;
  }

  init = () => {
    store.dispatch(game.actions.setInitPlayer(
      PLAYER_ONE,
      'Player 1',
      'blue',
      'a',
    ));
    store.dispatch(game.actions.setInitPlayer(
      PLAYER_TWO,
      'Player 2',
      'green',
      'b',
    ));
    this.storeUnsubscribe = store.subscribe(() => {
      this.handleStateChange(store.getState());
    });
  }

  handleStateChange = (state) => {
    this.state = state;
    const { activeFigure } = state.game;
    if (this.activeFigure !== activeFigure) {
      this.activeFigure = activeFigure;
    }
  }

  clearActiveFigure = () => {
    store.dispatch(game.actions.setActiveFigure(null));
  }

  flipXActiveFigure = () => {
    if (!this.activeFigure) {
      return;
    }
    const newFigure = flipX(this.activeFigure);
    store.dispatch(game.actions.setActiveFigure(newFigure));
  }

  flipYActiveFigure = () => {
    if (!this.activeFigure) {
      return;
    }
    const newFigure = flipY(this.activeFigure);
    store.dispatch(game.actions.setActiveFigure(newFigure));
  }

  rotateActiveFigure = () => {
    if (!this.activeFigure) {
      return;
    }
    const newFigure = rotate(this.activeFigure);
    store.dispatch(game.actions.setActiveFigure(newFigure));
  }

  activateNextPlayer = () => {
    const { turn } = store.getState().game;
    const nextPlayer = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    store.dispatch(game.actions.setTurn(nextPlayer));
  }

  placeOnBoard = (xPad, yPad) => {
    const state = store.getState();
    const { activeFigure } = state.game;
    store.dispatch(board.actions.placeFigure(activeFigure, xPad, yPad));
  }

  playerUseFigure = () => {
    const state = store.getState();
    const { turn, activeFigure } = state.game;

    if (!turn || !activeFigure) {
      return;
    }
    const figureId = activeFigure.id;
    store.dispatch(game.actions.useFigure(turn, figureId));
  }

  getCells = () => {
    const { cells } = store.getState().board;
    return cells;
  }

  getActiveFigure = () => {
    const { activeFigure } = store.getState().game;
    return activeFigure;
  }

  getActivePlayer = () => {
    const game = store.getState().game;
    const player = game[game.turn];
    return player;
  }

  getPlayers = () => {
    const game = store.getState().game;
    return [
      game[PLAYER_ONE],
      game[PLAYER_TWO],
    ];
  }
  
  destroy = () => {
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
    }
  }
}

export default StoreManager;
