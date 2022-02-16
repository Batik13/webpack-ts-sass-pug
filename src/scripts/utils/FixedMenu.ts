import { appCssClasses } from '../config';

interface IFixedMenu {
  _initEvents: () => void;
  _initNodes: (selector: string) => void;
}

interface Config {
  startPosition: number;
  modifierName: string
}

export class FixedMenu implements IFixedMenu {
  config: Config = {
    startPosition: 50,
    modifierName: appCssClasses.FixedMenu.modifierName,
  }
  node: HTMLElement | null;

  constructor(private selector: string) {
    this._initNodes(selector);
    this._initEvents();
  }

  _initNodes(selector: string) {
    this.node = document.querySelector(`.${selector}`);
  }

  _initEvents() {
    if (this.node) {
      window.addEventListener('scroll', this._scrolled);
    }
  }

  _scrolled = () => {
    if (this.node) {
      if (this.config.startPosition >= window.scrollY) {
        this.node.classList.remove(this.config.modifierName);
      } else {
        this.node.classList.add(this.config.modifierName);
      }
    }
  }
}