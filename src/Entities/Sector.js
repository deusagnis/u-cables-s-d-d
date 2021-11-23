/**
 * Сектор поиска.
 */
export default class Sector {
    /**
     * Позиция, характеризующая сектор.
     * @type {{x: number, y: number, z: number}}
     */
    position = {
        x: 0,
        y: 0,
        z: 0,
    }

    /**
     * Размер сектора (сторона квадрата).
     */
    static size

    /**
     * Создать сектор для позиции.
     * @param position
     * @returns {Sector}
     */
    static makeByPosition(position) {
        const sector = new Sector()

        sector.position = this.genSectorPosition(position)

        return sector
    }

    /**
     * Сгенерировать позицию сектора для заданной.
     * @param position
     * @returns {{x: number, y: number, z: number}}
     */
    static genSectorPosition(position) {
        let sectorsX = Math.ceil(position.x / this.size)
        let sectorsY = Math.ceil(position.y / this.size)

        return {
            x: Math.floor(sectorsX) === 0 ? Math.round(this.size / 2) : Math.round(sectorsX * this.size - this.size / 2),
            y: Math.floor(sectorsY) === 0 ? Math.round(this.size / 2) : Math.round(sectorsY * this.size - this.size / 2),
            z: 0
        }
    }

    /**
     * Сектор равен сектору.
     * @param sector
     * @returns {boolean}
     */
    equal(sector) {
        return (
            this.position.x === sector.position.x
            && this.position.y === sector.position.y
            && this.position.z === sector.position.z
        )
    }

    /**
     * Сгененировать секторы вокруг текущего.
     * @param lvl
     * @returns {*[]}
     */
    genSectorsAround(lvl = 1) {
        const zeroPosition = Object.assign({}, this.position)

        const sectors = []

        let x = zeroPosition.x + (lvl - 1) * this.constructor.size
        let y = zeroPosition.y

        const lastX = zeroPosition.x + lvl * this.constructor.size
        const lastY = zeroPosition.y - this.constructor.size

        let directionAccum = 0
        const turnRestrictions = {
            x: {
                max: zeroPosition.x + lvl * this.constructor.size,
                min: zeroPosition.x - lvl * this.constructor.size
            },
            y: {
                max: zeroPosition.y + lvl * this.constructor.size,
                min: zeroPosition.y - lvl * this.constructor.size
            }
        }
        while (x !== lastX || y !== lastY) {

            if (directionAccum % 4 === 0) {
                x += this.constructor.size
            }
            if (directionAccum % 4 === 1) {
                y += this.constructor.size
            }
            if (directionAccum % 4 === 2) {
                x -= this.constructor.size
            }
            if (directionAccum % 4 === 3) {
                y -= this.constructor.size
            }

            if (x === turnRestrictions.x.max && directionAccum % 4 === 0
                || x === turnRestrictions.x.min && directionAccum % 4 === 2
                || y === turnRestrictions.y.max && directionAccum % 4 === 1
                || y === turnRestrictions.y.min && directionAccum % 4 === 3
            ) {
                directionAccum++
            }

            sectors.push(this.constructor.makeByPosition({x, y}))
        }

        return sectors
    }

    /**
     * В заданном массиве есть равный сектор.
     * @param sectors
     * @returns {*}
     */
    inSectors(sectors) {
        return sectors.reduce((included, pendingSector) => {
            if (included) return included
            return this.equal(pendingSector)
        }, false)
    }

    /**
     * Сектор удовлетворяет координатным ограничениям.
     * @param positionRestrictions
     * @returns {boolean}
     */
    inside(positionRestrictions) {
        return (
            positionRestrictions.x.min !== false && this.position.x >= positionRestrictions.x.min
            && positionRestrictions.x.max !== false && this.position.x <= positionRestrictions.x.max

            && positionRestrictions.y.min !== false && this.position.y >= positionRestrictions.y.min
            && positionRestrictions.y.max !== false && this.position.y <= positionRestrictions.y.max
        )
    }

    /**
     * Привести к строке.
     * @returns {string}
     */
    toString() {
        return '(' + this.position.x + '; ' + this.position.y + ')'
    }

    /**
     * Определить позицию сектора по строковому представлению.
     * @param sectorString
     * @returns {{x: number, y: number, z: number}}
     */
    static positionByString(sectorString) {
        const coordinates = sectorString.slice(1, -1).split(';')

        return {
            x: Number(coordinates[0]),
            y: Number(coordinates[1]),
            z: 0
        }
    }
}