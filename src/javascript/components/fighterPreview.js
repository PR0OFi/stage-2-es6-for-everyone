import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  if (fighter !== undefined) {
    fighterElement.appendChild(createFighterImage(fighter));

    const description = createElement({
      tagName: 'div'
    });
    description.style = 'display: flex';

    fighterElement.appendChild(description);
    for (const [statName, statValue] of Object.entries(fighter)) {
      if (statName != 'source' && statName != '_id')
        description.appendChild(createStatDescriptionParagraph(statName, statValue));
    }
  }

  return fighterElement;
}

const createStatDescriptionParagraph = (statName, statValue) => {
  const descriptionElement = createElement({
    tagName: 'p'
  });
  descriptionElement.innerHTML = `${statName}: ${statValue};`;
  descriptionElement.style = 'color: white; text-transform: capitalize; margin: 0 0';
  return descriptionElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
