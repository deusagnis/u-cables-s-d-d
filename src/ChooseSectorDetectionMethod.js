import Sector from "./Entities/Sector.js";

/**
 * Выбрать метод обследования для сектора.
 */
export default class ChooseSectorDetectionMethod {
    /**
     * Методы для выбора.
     */
    methods
    /**
     * Глубина сектора.
     */
    sectorDepth

    /**
     * Допустимые методы.
     * @type {[]}
     */
    filteredMethods = []

    /**
     * Выбрать метод.
     * @returns {*}
     */
    choose() {
        this.filterMethodsByDepth()
        this.sortFilteredMethods()

        return this.takeMethod()
    }

    /**
     * Отфильтровать методы с учётом глубины.
     */
    filterMethodsByDepth() {
        for (let name in this.methods) {
            if (this.methodAppropriate(this.methods[name])) {
                this.filteredMethods.push(Object.assign({name}, this.methods[name]))
            }
        }
    }

    /**
     * Метод подходит по глубине.
     * @param method
     * @returns {boolean}
     */
    methodAppropriate(method) {
        return method.range ** 2 > ((Sector.size / 2) ** 2 + this.sectorDepth ** 2)
    }

    /**
     * Отсортировать методы по точности.
     */
    sortFilteredMethods() {
        this.filteredMethods.sort((method1, method2) => {
            return method1.probability - method2.probability
        })
    }

    /**
     * Выбрать итоговый метод.
     * @returns {*}
     */
    takeMethod() {
        return this.filteredMethods.pop()
    }
}