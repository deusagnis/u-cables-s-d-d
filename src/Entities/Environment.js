/**
 * Интерфейс окружающей среды.
 */
export default class Environment {
    /**
     * Данные зоны поиска.
     * @type {{maxDepth: number, width: number, height: number}}
     */
    static area = {
        width: 0,
        height: 0,
        maxDepth: 300,
    }

    /**
     * Данные о размещении кабелей.
     * @type {{amount: number, map: {}}}
     */
    static cables = {
        amount: 2,
        map: {}
    }

    /**
     * Данные об НПА в зоне поиска.
     * @type {[]}
     */
    static vehicles = []

    /**
     * Получить глубину по заданным координатам.
     * @param position
     * @returns {number}
     */
    static getPositionDepth(position) {
        const x = position.x / this.area.width * 4
        const y = position.y / this.area.height * 4
        const himmelblau = (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2

        return Math.round(himmelblau % ((this.area.maxDepth-3>=1) ? (this.area.maxDepth-3) : 1) + 3)
    }

    /**
     * Присустствует ли кабель в секторе.
     * @param sector
     * @returns {boolean}
     */
    static sectorHasCable(sector) {
        return !!this.cables.map[sector.toString()]
    }
}