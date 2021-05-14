import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {

  firstFighter.max_health = firstFighter.health;
  secondFighter.max_health = secondFighter.health;

  firstFighter.dodging = false;
  secondFighter.dodging = false;

  firstFighter.critCombination = {};
  secondFighter.critCombination = {};

  firstFighter.canCrit = true;
  secondFighter.canCrit = true;

  fillCriticalHitCombination(controls.PlayerOneCriticalHitCombination, firstFighter.critCombination);
  fillCriticalHitCombination(controls.PlayerTwoCriticalHitCombination, secondFighter.critCombination);

  window.onkeyup = (event) => {
    const pressedKey = getControlsKeyName(event.key);

    if (controls.PlayerOneBlock == pressedKey)
      firstFighter.dodging = false;
    if (controls.PlayerTwoBlock == pressedKey)
      secondFighter.dodging = false;

    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[0], pressedKey, firstFighter, false);
    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[1], pressedKey, firstFighter, false);
    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[2], pressedKey, firstFighter, false);

    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[0], pressedKey, secondFighter, false);
    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[1], pressedKey, secondFighter, false);
    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[2], pressedKey, secondFighter, false);
  };

  window.onkeydown = (event) => {

    const pressedKey = getControlsKeyName(event.key);

    if (controls.PlayerOneBlock == getControlsKeyName(event.key))
      firstFighter.dodging = true;
    if (controls.PlayerTwoBlock == getControlsKeyName(event.key))
      secondFighter.dodging = true;

    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[0], pressedKey, firstFighter, true);
    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[1], pressedKey, firstFighter, true);
    determineWhetherPressed(controls.PlayerOneCriticalHitCombination[2], pressedKey, firstFighter, true);

    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[0], pressedKey, secondFighter, true);
    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[1], pressedKey, secondFighter, true);
    determineWhetherPressed(controls.PlayerTwoCriticalHitCombination[2], pressedKey, secondFighter, true);

    checkWhetherCriticalHitCombination(firstFighter, secondFighter, false);
    checkWhetherCriticalHitCombination(secondFighter, firstFighter, true);
  }

  document.addEventListener('keypress', event => {
    const pressedKey = getControlsKeyName(event.key);
    switch (pressedKey) {
      case controls.PlayerOneAttack:
        if (!firstFighter.dodging && !secondFighter.dodging)
          attack(firstFighter, secondFighter, false);
        break;
      case controls.PlayerTwoAttack:
        if (!secondFighter.dodging && !firstFighter.dodging)
          attack(secondFighter, firstFighter, true)
        break;
    }
  });

  return new Promise((resolve) => {
    waitForResolvedFight(resolve, firstFighter, secondFighter);
  });
}

export function getDamage(attacker, defender) {
  let damage = getHitPower(attacker) - getBlockPower(defender);
  return damage < 0 ? 0 : damage;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}

const checkWhetherCriticalHitCombination = (attacker, defender, defenderOnLeft) => {

  let isCritting = true;
  Object.values(attacker.critCombination)
    .forEach(isPressed => isCritting = isCritting && isPressed);

  if (isCritting && attacker.canCrit)
    performCriticalStrike(attacker, defender, defenderOnLeft);
}

const performCriticalStrike = (attacker, defender, defenderOnLeft) => {
  let damage = attacker.attack * 2;
  defender.health -= damage;
  attacker.canCrit = false;

  changeHealthBar(defender, defenderOnLeft);

  setTimeout(() =>
    attacker.canCrit = true, 10000);
}

const determineWhetherPressed = (expectedKey, key, fighter, isPressedCurrently) => {
  if (expectedKey == key)
    fighter.critCombination[expectedKey] = isPressedCurrently;
}

const fillCriticalHitCombination = (keyArray, critCombination) => {
  return keyArray.forEach(key => critCombination[key] = false);
}

const waitForResolvedFight = (resolve, firstFighter, secondFighter) => {
  if (firstFighter.health > 0 && secondFighter.health > 0)
    setTimeout(waitForResolvedFight.bind(this, resolve, firstFighter, secondFighter), 30);
  else if (firstFighter.health < 0)
    resolve(secondFighter);
  else if (secondFighter.health < 0)
    resolve(firstFighter);
}

const getControlsKeyName = (eventKeyName) => {
  return 'Key' + eventKeyName.toUpperCase();
}

const attack = (attacker, defender, defenderOnLeft) => {

  const damage = getDamage(attacker,defender);
  defender.health -= damage;

  changeHealthBar(defender, defenderOnLeft);
}

const changeHealthBar = (defender, defenderOnLeft) => {
  let defenderHealthBar;
  if (defenderOnLeft)
    defenderHealthBar = document.getElementById('left-fighter-indicator');
  else
    defenderHealthBar = document.getElementById('right-fighter-indicator');

  const defenderHealthPercentage =
    Math.floor((defender.health / defender.max_health) * 100);

  defenderHealthBar.style.width = defenderHealthPercentage + '%';
}
