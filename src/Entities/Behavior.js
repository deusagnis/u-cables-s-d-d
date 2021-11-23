/**
 * Управление поведением объекта
 */
export default class Behavior {

    /**
     * Выполняет действие, следующее за состоянием. Возвращает новое состояние и его длительность.
     * @param state
     * @returns {{duration: number, newState}}
     */
    changeStateFrom(state) {
        return {
            newState: state,
            duration: 0
        }
    }
}