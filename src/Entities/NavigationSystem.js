import Sector from "./Sector.js";

/**
 * Интерфейс системы навигации.
 */
export default class NavigationSystem {
    /**
     * Максимальная скорость НПА.
     * @type {number}
     */
    static vehicleMaxSpeed = 25
    /**
     * Максимальная длина ряда соседних секоторов.
     */
    static maxSectorLvl

    /**
     * Ограничения по координатам.
     * @type {{x: {min: number, max: number}, y: {min: number, max: number}, z: {min: number, max: number}}}
     */
    static positionRestrictions = {
        x: {
            min: 0,
            max: 0,
        },
        y: {
            min: 0,
            max: 0,
        },
        z: {
            min: 0,
            max: 0,
        }
    }

    /**
     * Точка подъёма НПА.
     * @type {{x: number, y: number, z: number}}
     */
    liftingPoint = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    }

    /**
     * Посещённые сектора.
     * @type {[]}
     */
    visitedSectors = []

    /**
     * Позиция НПА.
     * @type {{x: number, y: number, z: number}}
     */
    position = {
        x: 0,
        y: 0,
        z: 0,
    }

    /**
     * Целевая позиуия движение.
     */
    targetPosition
    /**
     * Текущая траектория движения к целевой позиции.
     * @type {[]}
     */
    currentTrajectory = []
    /**
     * Длина текущей траектории.
     * @type {number}
     */
    trajectoryDistance = 0
    /**
     * Время движения к целевой позиции.
     * @type {number}
     */
    moveTime = 0

    /**
     * Список посещённых ключевых точек.
     * @type {[]}
     */
    fullTrajectory = []

    /**
     * Вычислить расстояние между точками.
     * @param pos1
     * @param pos2
     * @param flat
     * @returns {number}
     */
    static calcDistance(pos1, pos2, flat = false) {
        return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + ((flat) ? 0 : (pos1.z - pos2.z) ** 2))
    }

    /**
     * Вычислить макимальную длину ряда соседних секторов.
     */
    static calcMaxSectorLevel() {
        this.maxSectorLvl = Math.ceil(Math.max(
            (this.positionRestrictions.x.max - this.positionRestrictions.x.min) / Sector.size,
            (this.positionRestrictions.x.max - this.positionRestrictions.x.min) / Sector.size))
    }

    /**
     * Переместиться к целевой позиции.
     */
    moveToTarget() {
        if (this.invalidTargetPosition()) return
        this.generateTrajectoryTo()
        this.calcTrajectoryDistance()
        this.calcMoveTime()
        this.reachTargetPosition()
        this.rememberVisitedSector()
    }

    /**
     * Сгенерировать траекторию движения.
     */
    generateTrajectoryTo() {
        this.currentTrajectory = [
            this.position,
            Object.assign({}, this.position, {z: -2}),
            Object.assign({}, this.targetPosition, {z: -2}),
            this.targetPosition
        ]
    }

    /**
     * Вычислить расстояние текущей траектории.
     */
    calcTrajectoryDistance() {
        this.trajectoryDistance = this.currentTrajectory.reduce((distWithPrevPos, pos) => {
            if (distWithPrevPos.prev === false) {
                distWithPrevPos.prev = pos
                return distWithPrevPos
            }
            distWithPrevPos.dist += this.constructor.calcDistance(distWithPrevPos.prev, pos)
            return distWithPrevPos
        }, {dist: 0, prev: false}).dist
    }

    /**
     * Вычислить время движения.
     */
    calcMoveTime() {
        this.moveTime = Math.round(this.trajectoryDistance / this.constructor.vehicleMaxSpeed * 1.07)
    }

    /**
     * Сделать целевую позицию текущей.
     */
    reachTargetPosition() {
        this.position = this.targetPosition
    }

    /**
     * Целевая позиция не задана.
     * @returns {boolean}
     */
    invalidTargetPosition() {
        return !this.targetPosition
    }

    /**
     * Запомнить целевую позицию.
     */
    rememberVisitedSector() {
        this.rememberPoint(this.targetPosition)
        this.visitedSectors.push(Sector.makeByPosition(this.targetPosition))
    }

    /**
     * Определить текущий сектор.
     * @returns {Sector}
     */
    getCurrentSector() {
        return Sector.makeByPosition(this.position)
    }

    /**
     * Собрать посещённые и целевой сектора.
     * @returns {*[]}
     */
    getVisitedAndTargetedSectors() {
        if (!!this.targetPosition) {
            return [...this.visitedSectors, Sector.makeByPosition(this.targetPosition)]
        } else {
            return [...this.visitedSectors]
        }
    }

    /**
     * Запомнить точку.
     * @param position
     */
    rememberPoint(position) {
        this.fullTrajectory.push(position)
    }
}