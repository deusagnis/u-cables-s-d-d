import FireTorpedoes from "./FireTorpedoes.js";
import AttackByDetachableExplosive from "./AttackByDetachableExplosive.js";

/**
 * Произвести атаку целей торпедами.
 */
export default class AttackTargets {

    /**
     * Интерфейс системы навигации.
     */
    navigationSystem
    /**
     * Интерфейс боевой системы.
     */
    combatSystem
    /**
     * Позиции для атаки.
     * @type {[]}
     */
    targetsPositions = []
    /**
     * Результат поражения целей.
     * @type {[]}
     */
    result = []

    /**
     * Итоговое время затраченное на атаку.
     */
    attackTime

    /**
     * Выполнение атаки цели в зависимости от выбранного способа атаки в боевой системе.
     */
    attack(){
        let attacker
        switch (this.combatSystem.currentAttackWay){
            case 'detachableExplosive':
                attacker = new AttackByDetachableExplosive()
                attacker.combatSystem = this.combatSystem
                attacker.navigationSystem = this.navigationSystem
                attacker.targetsPositions = this.targetsPositions
                attacker.attackInspector = this
                attacker.attack()
                break
            default:
                attacker = new FireTorpedoes()
                attacker.combatSystem = this.combatSystem
                attacker.navigationSystem = this.navigationSystem
                attacker.targetsPositions = this.targetsPositions
                attacker.attackInspector = this
                attacker.fire()
                break
        }
        this.attackTime = attacker.attackTime
    }

    /**
     * Добавление результата атаки.
     * @param targetData
     * @param defeated
     * @param time
     */
    addAttackResult(targetData, defeated, time) {
        this.result.push({
            targetPosition: targetData.sector.position,
            defeated,
            elapsedTime: time,
            attackPosition: this.navigationSystem.position
        })
    }
}