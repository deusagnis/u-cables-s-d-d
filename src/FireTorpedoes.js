import Attacker from "./Entities/Attacker.js";

/**
 * Атака целей с помощью торпед.
 */
export default class FireTorpedoes extends Attacker{
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
     * Время самой долгого запуска торпеды.
     * @type {number}
     */
    maxLaunchTime = 0

    /**
     * Итоговое время затраченное на атаку.
     */
    attackTime

    /**
     * Интерфейс объекта, ожидающего данных атаки.
     */
    attackInspector

    /**
     * Атаковать цели.
     */
    fire() {
        this.launchTorpedoes()
        this.calcAttackTime()
    }

    /**
     * Запустить торпеды.
     */
    launchTorpedoes() {
        for (let target of this.targetsPositions) {
            const time = this.calcTorpedoAttackTime(target.sector.position)
            if (time > this.maxLaunchTime) this.maxLaunchTime = time
            const defeated = this.fireTorpedo()

            this.attackInspector.addAttackResult(target, defeated, time)
        }
    }

    /**
     * Посчитать время торпедной атаки для заданной цели.
     * @param targetPosition
     * @returns {number}
     */
    calcTorpedoAttackTime(targetPosition) {
        const distance = this.navigationSystem.constructor.calcDistance(
            this.navigationSystem.position,
            targetPosition
        )
        return Math.round(distance / this.combatSystem.getCurrentWeaponData().speed)
    }

    /**
     * Успех запуска торпеды.
     * @returns {boolean}
     */
    fireTorpedo() {
        return Math.random() < this.combatSystem.getCurrentWeaponData().hitProbability
    }

    /**
     * Вычисения общего времени атаки.
     */
    calcAttackTime() {
        this.attackTime = this.combatSystem.getCurrentWeaponData().launchTime * this.targetsPositions.length + this.maxLaunchTime;
    }
}