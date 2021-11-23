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
     * Время самой долгого запуска торпеды.
     * @type {number}
     */
    maxLaunchTime = 0
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
     * Атаковать цели.
     */
    attack() {
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

            this.addAttackResult(target, defeated, time)
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
        return Math.round(distance / this.combatSystem.torpedo.speed)
    }

    /**
     * Успех запуска торпеды.
     * @returns {boolean}
     */
    fireTorpedo() {
        return Math.random() < this.combatSystem.torpedo.hitProbability
    }

    /**
     * Вычисения общего времени атаки.
     */
    calcAttackTime() {
        this.attackTime = this.combatSystem.torpedo.launchTime * this.targetsPositions.length + this.maxLaunchTime;
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