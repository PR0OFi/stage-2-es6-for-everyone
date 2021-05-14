import {showModal} from './modal';
import {createFighterImage} from '../fighterPreview';

export function showWinnerModal(fighter) {
  const fighterImage = createFighterImage(fighter);

  const onClose = () => {
    location.reload()
  }

  const showModalArgument = {
    title: fighter.name,
    bodyElement: fighterImage,
    onClose
  };
  showModal(showModalArgument);
}
