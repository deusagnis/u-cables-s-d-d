import Sector from "./Entities/Sector.js";

/**
 * Добавление кабелей на карту.
 */
export default class AddCablesOnMap {
    /**
     * Среда.
     */
    environment
    /**
     * Временная карта расположения кабелей.
     * @type {{}}
     */
    tempMap = {}

    /**
     * Добавить количество кабелей, указанное в среде.
     */
    add() {
        for (let i = 0; i < this.environment.cables.amount; i++) {
            this.generateCableOnMap()
            this.mergeTempMapWithEnvironment()
            this.resetTempMap()
        }
    }

    /**
     * Сгенерировать кабель.
     */
    generateCableOnMap() {
        const sector = this.genRandomBoundSector()
        this.addCableToSector(sector)
        const minBoundDist = Sector.size / 2
        const areaSide = this.detectAreaSideByPosition(sector.position)
        do {
            const xRand = Math.random()
            const yRand = Math.random()
            if (areaSide !== 0 && yRand < 0.5) {
                sector.position.y -= minBoundDist * 2
            }
            if (areaSide !== 2 && yRand > 0.5) {
                sector.position.y += minBoundDist * 2
            }
            if (areaSide !== 3 && xRand < 0.5) {
                sector.position.x -= minBoundDist * 2
            }
            if (areaSide !== 1 && xRand > 0.5) {
                sector.position.x += minBoundDist * 2
            }
            this.addCableToSector(sector)
        } while (Math.abs(sector.position.x) > minBoundDist
        && Math.abs(sector.position.x - this.environment.area.width) > minBoundDist
        && Math.abs(sector.position.y) > minBoundDist
        && Math.abs(sector.position.y - this.environment.area.height) > minBoundDist)
    }

    /**
     * Добавить данные о нахождении кабеля в заданном секторе.
     * @param sector
     */
    addCableToSector(sector) {
        const key = sector.toString()
        this.tempMap[key] = 1
    }

    /**
     * Определить ближайшую сторону зоны поиска к позиции.
     * @param position
     * @returns {*}
     */
    detectAreaSideByPosition(position) {
        const distances = [
            {
                dist: Math.abs(0 - position.y),
                side: 0
            },
            {
                dist: Math.abs(this.environment.area.width - position.x),
                side: 1
            },
            {
                dist: Math.abs(this.environment.area.height - position.y),
                side: 2
            },
            {
                dist: Math.abs(0 - position.x),
                side: 3
            },
        ]
        distances.sort((dist1, dist2) => (dist1.dist - dist2.dist))

        return distances.shift().side
    }

    /**
     * Сгенерировать случайную граничную позицию.
     * @returns {{x: number, y: number, z: number}}
     */
    genRandomBoundPosition() {
        const side = Math.random()
        const position = {x: 0, y: 0, z: 0}
        if (side < 0.25) {
            position.x = Math.random() * this.environment.area.width
        } else if (side < 0.5) {
            position.x = this.environment.area.width
            position.y = Math.random() * this.environment.area.height
        } else if (side < 0.75) {
            position.y = this.environment.area.height
            position.x = Math.random() * this.environment.area.width
        } else {
            position.y = Math.random() * this.environment.area.height
        }

        return position
    }

    /**
     * Сгененрировать случайный граничный сектор.
     * @returns {Sector}
     */
    genRandomBoundSector() {
        return Sector.makeByPosition(this.genRandomBoundPosition())
    }

    /**
     * Совместить временную карту расположения кабелей с данными среды.
     */
    mergeTempMapWithEnvironment() {
        for (let key in this.tempMap) {
            if (this.environment.cables.map[key] === undefined) {
                this.environment.cables.map[key] = 1
            } else {
                this.environment.cables.map[key]++
            }

        }
    }

    /**
     * Сбросить данные временной карты.
     */
    resetTempMap() {
        this.tempMap = {}
    }
}