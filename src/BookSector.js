import Sector from "./Entities/Sector.js";
import NavigationSystem from "./Entities/NavigationSystem.js";

/**
 * Бронирование сектора для обследования.
 */
export default class BookSector {
    /**
     * Интерфейс системы навигации.
     */
    navigationSystem
    /**
     * Интерфейс системы связи.
     */
    communicationSystem

    /**
     * Позиции НПА соратников.
     */
    matesPositions
    /**
     * Секторы, забронированные или посещённый союзными НПА.
     * @type {[]}
     */
    matesVisitedOrBookedSectors = []
    /**
     * Текущий уровень выбора сектора.
     * @type {number}
     */
    currentSectorLvl = 1
    /**
     * Вычисленные доступные сектора.
     * @type {[]}
     */
    availableSectors = []
    /**
     * Сортированная выборка позиций для бронирования.
     * @type {[]}
     */
    rangeOfPositionsForBooking = []

    /**
     * Забронированный сектор.
     */
    bookedSector

    /**
     * Забронировать сектор.
     * @returns {boolean|boolean|*}
     */
    book() {
        if (this.sectorLevelExceeded()) {
            return false
        }

        this.getVisitedOrBookedSectors()
        this.getMatesPositions()

        this.generateAvailableSectors()
        if (this.notFoundAvailableSectors()) {
            this.upSearchSectorsLvl()
            return this.book()
        }

        this.generateAvailableToBookingPositionsRange()
        this.takeSectorForBookingByPositions()
        this.pointBookedSectorPosition()

        return this.bookedSector
    }

    /**
     * Уровень выбоа секторов превышен.
     * @returns {boolean}
     */
    sectorLevelExceeded() {
        return this.currentSectorLvl > this.navigationSystem.constructor.maxSectorLvl
    }

    /**
     * Получить посещённые или забронированные секторы.
     */
    getVisitedOrBookedSectors() {
        this.matesVisitedOrBookedSectors = this.communicationSystem.interrogateVisitedOrBookedSectors()
    }

    /**
     * Получить позиции НПА соратников.
     */
    getMatesPositions() {
        this.matesPositions = this.communicationSystem.getMatesPositions()
    }

    /**
     * Сгенерировать доступные сектора.
     */
    generateAvailableSectors() {
        const sectorsAround = this.getSectorsAround()
        const unavailableSectors = this.getUnavailableSectors()
        this.availableSectors = this.filterSectors(sectorsAround, unavailableSectors)
    }

    /**
     * Сгенерировать секторы вокруг текущей позиции.
     * @returns {*[]}
     */
    getSectorsAround() {
        return Sector.makeByPosition(this.navigationSystem.position).genSectorsAround(this.currentSectorLvl)
    }

    /**
     * Выбрать недоступные секторы.
     * @returns {*[]}
     */
    getUnavailableSectors() {
        return [...this.navigationSystem.visitedSectors, ...this.matesVisitedOrBookedSectors]
    }

    /**
     * Отфильровать секторы.
     * @param sectors
     * @param unavailableSectors
     * @returns {*}
     */
    filterSectors(sectors, unavailableSectors) {
        return sectors.filter((sector) => this.sectorIsAvailable(sector, unavailableSectors))
    }

    /**
     * Сектор доступен для бронирования.
     * @param sector
     * @param unavailableSectors
     * @returns {boolean}
     */
    sectorIsAvailable(sector, unavailableSectors) {
        return sector.inside(this.navigationSystem.constructor.positionRestrictions)
            && !sector.inSectors(unavailableSectors)
    }

    /**
     * Не найдено доступных секторов.
     * @returns {boolean}
     */
    notFoundAvailableSectors() {
        return !this.availableSectors.length
    }

    /**
     * Повысить уровень поиска секторов вокруг.
     */
    upSearchSectorsLvl() {
        this.currentSectorLvl++
    }

    /**
     * Сгенерировать доступные для бронирования позиции.
     */
    generateAvailableToBookingPositionsRange() {
        const positionsDistances = this.genPositionsDistances()

        this.normalizePositionsDistances(positionsDistances)
        this.sortPositionDistances(positionsDistances)

        if (positionsDistances.length) {
            this.rangeOfPositionsForBooking = positionsDistances.map((dSector) => ({x: dSector.x, y: dSector.y, z: 0}))
        } else {
            this.rangeOfPositionsForBooking = []
        }
    }

    /**
     * Сгененировать характеристические расстояния позиций.
     * @returns {any[]}
     */
    genPositionsDistances() {
        return this.availableSectors.map((sector) => Object.assign({
            swarmDistance: this.calcSectorMatesCommonDistance(sector, this.matesPositions),
            selfDistance: NavigationSystem.calcDistance(this.navigationSystem.position, sector.position, true)
        }, sector.position))
    }

    /**
     * Посчитать суммурной расстояние от сектора до союзных НПА.
     * @param sector
     * @param matesPositions
     * @returns {*}
     */
    calcSectorMatesCommonDistance(sector, matesPositions) {
        return matesPositions.reduce((dist, point) => dist + NavigationSystem.calcDistance(sector.position, point, true), 0)
    }

    /**
     * Нормализовать характеристические расстояния позиций.
     * @param positionsDistances
     */
    normalizePositionsDistances(positionsDistances) {
        const normDistance = positionsDistances.reduce((normData, sector) => {
            if (sector.swarmDistance > normData.swarmMax) normData.swarmMax = sector.swarmDistance
            if (sector.selfDistance < normData.selfMin) normData.selfMin = sector.selfDistance
            return normData
        }, {swarmMax: 0, selfMin: 9999999999})
        positionsDistances.map((sector) => {
            sector.normedSwarmDistance = (normDistance.swarmMax - sector.swarmDistance) / normDistance.swarmMax
            sector.normedSelfDistance = (sector.selfDistance - normDistance.selfMin) / sector.selfDistance
        });
    }

    /**
     * Сортировать позиции.
     * @param positionsDistances
     */
    sortPositionDistances(positionsDistances) {
        positionsDistances.sort((dSector1, dSector2) => {
            return (dSector1.normedSwarmDistance + dSector1.normedSelfDistance) - (dSector2.normedSwarmDistance + dSector2.normedSelfDistance)
        })
    }

    /**
     * Указать позцию выбранного сектора в качестве целевой для системы навигации.
     */
    pointBookedSectorPosition() {
        this.navigationSystem.targetPosition = this.bookedSector.position
    }

    /**
     * Выбрать сектор в качестве бронированного.
     */
    takeSectorForBookingByPositions() {
        const position = this.rangeOfPositionsForBooking.shift()

        this.bookedSector = Sector.makeByPosition(position)
    }
}