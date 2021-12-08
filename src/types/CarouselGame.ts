export interface ICarouselGame {
  currentPlayer: string;
  carouselPosition: number;
  activeCard: number;
  seed: number;
  currentSpinCount: number;
  playerRoundCount?: { [key: string]: number };
  categoryIds: string[];
}

export interface IQuestion {
  //TODO: add categorie color
  category: string;
  name: string;
  catId: string;
  color: string; //not in db
}

export interface ICategory {
  color: string;
  name: string;
}

export const DEFAULT_QUESTION_COLOR = '#f00';
