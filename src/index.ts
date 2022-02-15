import './styles/index.scss';
import { appCssClasses } from './scripts/config';
import { FixedMenu } from './scripts/utils/FixedMenu';

new FixedMenu(appCssClasses.FixedMenu.node);