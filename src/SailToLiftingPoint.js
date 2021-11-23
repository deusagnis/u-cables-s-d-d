/**
 * Перемещение в точку подъёма.
 */
export default class SailToLiftingPoint {
    /**
     * Интерфейс системы навигации.
     */
    navigationSystem

    /**
     * Время движения.
     * @type {number}
     */
    moveTime = 0

    /**
     * Переместиться в точку подъёма.
     */
    sail() {
        this.setTargetPosition()
        this.sailToPoint()
    }

    /**
     * Установить позицию для движения.
     */
    setTargetPosition() {
        this.navigationSystem.targetPosition = this.navigationSystem.liftingPoint
    }

    /**
     * Переместиться заданную точку.
     */
    sailToPoint() {
        this.navigationSystem.moveToTarget()
        this.moveTime = this.navigationSystem.moveTime
    }
}