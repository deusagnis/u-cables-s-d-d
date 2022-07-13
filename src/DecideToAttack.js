/**
 * Решить о совершении атаки.
 */
export default class DecideToAttack {
    /**
     * Индекс НПА.
     */
    uuvIndex
    /**
     * Интерфейс боевой системы.
     */
    combatSystem
    /**
     * Данные обследования секторов.
     */
    detectionData

    /**
     * Данные целевых секторов.
     * @type {[]}
     */
    targetSectorsData = []
    /**
     * Позиции для атаки.
     * @type {[]}
     */
    targetsPositions = []

    /**
     * Принять решение об атаке секторов.
     */
    decide() {
        this.chooseTargetSectors()
        this.chooseTargetsPositions()
    }

    /**
     * Выбрать целевые сектора.
     */
    chooseTargetSectors() {
        const startOffset = -1 * (this.uuvIndex + 1) * this.combatSystem.getCurrentWeaponData().ammunition
        const endOffset = startOffset + this.combatSystem.getCurrentWeaponData().ammunition

        this.targetSectorsData = this.detectionData.slice(startOffset, (endOffset >= 0) ? undefined : endOffset)
    }

    /**
     * Выбрать подходящие для атаки позиции.
     */
    chooseTargetsPositions() {
        this.targetsPositions = this.targetSectorsData.filter((sector) => sector.targetWeight >= this.combatSystem.minTargetWeight)
    }
}