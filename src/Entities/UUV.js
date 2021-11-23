/**
 * Необитаемый Подводный Аппарат.
 */
export default class UUV {
    /**
     * Текущая метка времени.
     * @type {number}
     */
    time = 0

    /**
     * Текущее состояние.
     * @type {string}
     */
    state = 'deflated'

    /**
     * Серийный номер.
     * @type {number}
     */
    serialNumber = 0

    /**
     * Время смены состояния.
     * @type {number}
     */
    changeStamp = 0

    /**
     * Объект управления поведением.
     */
    behavior

    /**
     * Метод действия.
     */
    main() {
        if (this.availableToProceed()) {
            this.proceed()
        }
    }

    /**
     * Продолжение действовать.
     */
    proceed() {
        const nextState = this.behavior.changeStateFrom(this.state)
        this.state = nextState.newState
        this.changeStamp = this.time + nextState.duration
    }

    /**
     * Допустимо ли продолжать действовать.
     * @returns {boolean}
     */
    availableToProceed() {
        return this.time >= this.changeStamp
    }
}