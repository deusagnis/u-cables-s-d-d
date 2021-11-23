/**
 * Перемещение в забронированный сектор.
 */
export default class SailToBookedSector {
    /**
     * Интерфейс системы навигации.
     */
    navigationSystem
    /**
     * Забронированный сектор.
     */
    bookedSector

    /**
     * Время движения.
     */
    moveTime

    /**
     * Переместиться в забронированный сектор.
     * @returns {*}
     */
    sail() {
        this.setTargetPosition()
        this.sailToSector()

        return this.moveTime
    }

    /**
     * Задать позицию для перемещения.
     */
    setTargetPosition() {
        this.navigationSystem.targetPosition = this.bookedSector.position
    }

    /**
     * Переместиться в заданный сектор.
     */
    sailToSector() {
        this.navigationSystem.moveToTarget()
        this.moveTime = this.navigationSystem.moveTime
    }
}