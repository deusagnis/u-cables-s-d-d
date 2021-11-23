import Sector from "./Entities/Sector.js";
import DetectionSystem from "./Entities/DetectionSystem.js";
import Environment from "./Entities/Environment.js";
import NavigationSystem from "./Entities/NavigationSystem.js";
import CommunicationSystem from "./Entities/CommunicationSystem.js";
import CombatSystem from "./Entities/CombatSystem.js";
import AddCablesOnMap from "./AddCablesOnMap.js";
import UUV from "./Entities/UUV.js";
import UnderwaterCablesBehavior from "./UnderwaterCablesBehavior.js";

/**
 * Симуляция выполнения задачи поиска, обнаружения и уничтожения подводных кабелей группой НПА.
 */
export default class Simulate {
    /**
     * Настройки симуляции.
     * @type {{}}
     */
    settings = {}

    /**
     * Счётчик итераций
     * @type {number}
     */
    iterations = 0

    /**
     * Симулировать.
     * @returns {{cables: *[], trajectories: [][], attackLog: ([]|[]|*)[], cablesWeights: ([]|*)[], elapsedTime: (number|number|((label?: string) => void)|number|*)[]}}
     */
    simulate() {
        while (this.continueSimulation()) {
            for (let vehicle of Environment.vehicles) {
                vehicle.time++
                vehicle.main()
            }
            this.iterations++
        }
        return this.collectResults()
    }

    /**
     * Инициализировать системы для симуляции.
     */
    init() {
        this.initSector()
        this.initEnvironment()
        this.initNavigationSystem()
        this.initDetectionSystem()
        this.initCommunicationSystem()
        this.initCombatSystem()

        this.addVehicles()

        this.throwVehiclesIntoTheWater()
        this.provideLiftingPositions()
    }

    /**
     * Иницализировать параметры сектора.
     */
    initSector() {
        this.generateSectorRange()
    }

    /**
     * Выбрать основную дальность обнаружения.
     * @returns {number}
     */
    getMainDetectionRange() {
        return this.settings.detectionSystem.methods.magnetic.range
    }

    /**
     * Сгенерировать размер сектора.
     */
    generateSectorRange() {
        this.calculateSectorSize(this.getMainDetectionRange())
    }

    /**
     * Посчитать размер сектора.
     * @param mainRange
     */
    calculateSectorSize(mainRange) {
        Sector.size = Math.round(Math.sqrt(mainRange ** 2 - (mainRange * 0.20) ** 2) * 0.85 * 2)
    }

    /**
     * Инициализировать параметры среды.
     */
    initEnvironment() {
        this.applySettings(Environment, this.settings.environment)
        this.addCables()
    }

    /**
     * Добавить кабели на карту.
     */
    addCables() {
        const cables = new AddCablesOnMap()
        cables.environment = Environment
        cables.add()
    }

    /**
     * Применить настройки для объекта.
     * @param object
     * @param settings
     */
    applySettings(object, settings) {
        Object.assign(object, settings)
    }

    /**
     * Инициализировать систему навигации.
     */
    initNavigationSystem() {
        this.applySettings(NavigationSystem, this.settings.navigationSystem)
        this.generatePositionsRestrictions()
        this.setMaxSectorLvl()
    }

    /**
     * Сгененировать позиционные ограничения.
     */
    generatePositionsRestrictions() {
        NavigationSystem.positionRestrictions.x.min = 0
        NavigationSystem.positionRestrictions.x.max = this.settings.environment.area.width
        NavigationSystem.positionRestrictions.x.min = 0
        NavigationSystem.positionRestrictions.y.max = this.settings.environment.area.height
        NavigationSystem.positionRestrictions.z.min = this.settings.environment.area.maxDepth * -1
        NavigationSystem.positionRestrictions.z.max = 0
    }

    /**
     * Установить максимальный уровень секторов.
     */
    setMaxSectorLvl() {
        NavigationSystem.calcMaxSectorLevel()
    }

    /**
     * Инициализировать систему обнаружения.
     */
    initDetectionSystem() {
        this.applySettings(DetectionSystem, this.settings.detectionSystem)
    }

    /**
     * Инициализировать систему связи.
     */
    initCommunicationSystem() {
        this.applySettings(CommunicationSystem, this.settings.communicationSystem)
    }

    /**
     * Инициализировать боевую систему.
     */
    initCombatSystem() {
        this.applySettings(CombatSystem, this.settings.combatSystem)
    }

    /**
     * Добавить НПА на карту.
     */
    addVehicles() {
        for (let i = 0; i < this.settings.swarmVolume; i++) {
            Environment.vehicles.push(this.makeVehicle(i))
        }
    }

    /**
     * Создать НПА.
     * @param serialNumber
     * @returns {UUV}
     */
    makeVehicle(serialNumber) {
        const uuv = new UUV()
        uuv.serialNumber = serialNumber

        uuv.behavior = new UnderwaterCablesBehavior()
        uuv.behavior.uuvSerialNumber = serialNumber

        uuv.behavior.periphery = {
            navigationSystem: new NavigationSystem(),
            detectionSystem: new DetectionSystem(),
            communicationSystem: new CommunicationSystem(),
            combatSystem: new CombatSystem()
        }

        uuv.behavior.periphery.communicationSystem.matesSerialNumbers = this.genMatesSerialNumbers(serialNumber)

        return uuv
    }

    /**
     * Сбросить НПА на воду.
     */
    throwVehiclesIntoTheWater() {
        const x = 3
        let y = 0
        for (let vehicle of Environment.vehicles) {
            y += this.settings.throwInterval
            vehicle.behavior.periphery.navigationSystem.position.x = x
            vehicle.behavior.periphery.navigationSystem.position.y = y
            vehicle.behavior.periphery.navigationSystem.rememberPoint(vehicle.behavior.periphery.navigationSystem.position)
        }
    }

    /**
     * Установить позиции сброса в качестве позиций подъёма.
     */
    provideLiftingPositions() {
        for (let vehicle of Environment.vehicles) {
            Object.assign(vehicle.behavior.periphery.navigationSystem.liftingPoint, vehicle.behavior.periphery.navigationSystem.position)
        }
    }

    /**
     * Симуляцию можно продолжвать.
     * @returns {boolean}
     */
    continueSimulation() {
        if (this.iterations >= this.settings.maxIterations) return false
        for (let vehicle of Environment.vehicles) {
            if (vehicle.state !== this.settings.stopState) return true
        }
        return false
    }

    /**
     * Сгенерировать серийные номера союзников для НПА.
     * @param serialNumber
     * @returns {*[]}
     */
    genMatesSerialNumbers(serialNumber) {
        const matesNumbers = []
        for (let i = 0; i < this.settings.swarmVolume; i++) {
            if (i !== serialNumber) matesNumbers.push(i)
        }
        return matesNumbers
    }

    /**
     * Собрать результаты симуляции.
     * @returns {{cables: *[], trajectories: [][], attackLog: ([]|[]|*)[], cablesWeights: ([]|*)[], elapsedTime: (number|number|((label?: string) => void)|number|*)[]}}
     */
    collectResults() {
        return {
            trajectories: this.collectTrajectories(),
            cables: this.collectCables(),
            cablesWeights: this.collectCablesWeights(),
            attackLog: this.collectAttackLog(),
            elapsedTime: this.collectElapsedTime(),
        }
    }

    /**
     * Собрать траектории движения НПА.
     * @returns {[][]}
     */
    collectTrajectories() {
        return Environment.vehicles.map((vehicle) => vehicle.behavior.periphery.navigationSystem.fullTrajectory)
    }

    /**
     * Собрать данные нахождения кабелей.
     * @returns {*[]}
     */
    collectCables() {
        const cables = []
        for (let sectorString in Environment.cables.map) {
            cables.push({
                position: Sector.positionByString(sectorString),
                cables: Environment.cables.map[sectorString]
            })
        }
        return cables
    }

    /**
     * Собрать посчитанные весовые коэффициенты нахождения кабелей.
     * @returns {([]|*)[]}
     */
    collectCablesWeights() {
        return Environment.vehicles.map((vehicle) => vehicle.behavior.analysedDetectionData)
    }

    /**
     * Собрать данные об атаках.
     * @returns {([]|[]|*)[]}
     */
    collectAttackLog() {
        return Environment.vehicles.map((vehicle) => vehicle.behavior.attackResults)
    }

    /**
     * Собрать данные о затраченном времени.
     * @returns {(number|number|((label?: string) => void)|number|*)[]}
     */
    collectElapsedTime() {
        return Environment.vehicles.map((vehicle) => vehicle.time)
    }
}