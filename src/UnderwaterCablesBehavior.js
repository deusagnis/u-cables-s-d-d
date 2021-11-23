import Behavior from "./Entities/Behavior.js";
import BookSector from "./BookSector.js";
import InspectSector from "./InspectSector.js";
import ChooseSectorDetectionMethod from "./ChooseSectorDetectionMethod.js";
import Environment from "./Entities/Environment.js";
import DetectionSystem from "./Entities/DetectionSystem.js";
import SailToBookedSector from "./SailToBookedSector.js";
import AnalyseCommonDetectionMap from "./AnalyseCommonDetectionMap.js";
import DecideToAttack from "./DecideToAttack.js";
import AttackTargets from "./AttackTargets.js";
import SailToLiftingPoint from "./SailToLiftingPoint.js";
import CombatSystem from "./Entities/CombatSystem.js";

/**
 * Объект поведения для задачи поиска, обнаружения и уничтожения подводных кабелей.
 */
export default class UnderwaterCablesBehavior extends Behavior {
    /**
     * Серийный номер НПА.
     */
    uuvSerialNumber
    /**
     * Набор перифирийных систем.
     * @type {{}}
     */
    periphery = {}

    /**
     * Забронированный сектор.
     * @type {boolean}
     */
    bookedSector = false
    /**
     * Флаг завершения обследования секторов.
     * @type {boolean}
     */
    allVehiclesCompletedInspection = false

    /**
     * Данные обследования секторов.
     * @type {[]}
     */
    analysedDetectionData = []
    /**
     * Целевые позиции для атаки.
     * @type {[]}
     */
    targetsPositions = []
    /**
     * Результаты атаки.
     * @type {[]}
     */
    attackResults = []

    /**
     * Управление состояниями.
     * @param state
     * @returns {{duration: number, newState: string}|{duration, newState: string}}
     */
    changeStateFrom(state) {
        switch (state) {
            case 'deflated':
            case 'sectorInspecting':
                return this.bookSector()
            case 'sectorBooking':
                if (this.bookedSector !== false) {
                    return this.sailToBookedSector()
                } else {
                    return this.interrogateAboutCompletionInspection()
                }
            case 'sailingToSector':
                return this.inspectSector()
            case 'interrogationAboutCompletionInspection':
                if (this.allVehiclesCompletedInspection) {
                    return this.collectSectorsData()
                } else {
                    return this.waitForSectorsAnalysis()
                }
            case 'waitingForSectorsAnalysis':
                return this.interrogateAboutCompletionInspection()
            case 'collectingSectorsData':
                return this.analyzeSectorsData()
            case 'sectorsDataAnalysis':
                return this.decideToAttack()
            case 'decidingOnAttack':
                if (this.needAttack()) {
                    return this.attackTargets()
                } else {
                    return this.sailToLiftingPoint()
                }
            case 'attackingTargets':
                return this.sailToLiftingPoint()
            case 'sailingToLiftingPoint':
                return this.waitForLifting()
            case 'waitingForLifting':
                return this.waitForLifting()
        }
    }

    /**
     * Забронировать сектор для обследования.
     * @returns {{duration: number, newState: string}}
     */
    bookSector() {
        const booking = new BookSector()
        booking.navigationSystem = this.periphery.navigationSystem
        booking.communicationSystem = this.periphery.communicationSystem

        this.bookedSector = booking.book()

        return {
            newState: 'sectorBooking',
            duration: 1
        }
    }

    /**
     * Направиться в забронированный сектор.
     * @returns {{duration, newState: string}}
     */
    sailToBookedSector() {
        const sailing = new SailToBookedSector()
        sailing.navigationSystem = this.periphery.navigationSystem
        sailing.bookedSector = this.bookedSector

        sailing.sail()

        return {
            newState: 'sailingToSector',
            duration: sailing.moveTime
        }
    }

    /**
     * Опросить союзные НПА о завершении обследования секторов.
     * @returns {{duration: number, newState: string}}
     */
    interrogateAboutCompletionInspection() {
        this.allVehiclesCompletedInspection = this.periphery.communicationSystem.interrogateAboutCompletionInspection()

        return {
            newState: 'interrogationAboutCompletionInspection',
            duration: 1
        }
    }


    /**
     * Обследовать сектор.
     * @returns {{duration: number, newState: string}}
     */
    inspectSector() {
        const inspection = new InspectSector()
        inspection.environment = Environment
        inspection.navigationSystem = this.periphery.navigationSystem
        inspection.detectionSystem = this.periphery.detectionSystem

        inspection.chooseDetectionMethodWay = new ChooseSectorDetectionMethod()
        inspection.chooseDetectionMethodWay.methods = DetectionSystem.methods

        const duration = inspection.inspect()

        return {
            newState: 'sectorInspecting',
            duration: duration
        }
    }

    /**
     * Собрать данные обследования секторов.
     * @returns {{duration: number, newState: string}}
     */
    collectSectorsData() {
        this.periphery.detectionSystem.commonDetectionMap = this.periphery.communicationSystem.collectSectorsInspectionData()

        return {
            newState: 'collectingSectorsData',
            duration: 1
        }
    }

    /**
     * Ожидать завершения обследования секторов.
     * @returns {{duration: number, newState: string}}
     */
    waitForSectorsAnalysis() {
        return {
            newState: 'waitingForSectorsAnalysis',
            duration: 5
        }
    }

    /**
     * Проанализировать данные обследования секторов.
     * @returns {{duration: number, newState: string}}
     */
    analyzeSectorsData() {
        const analysing = new AnalyseCommonDetectionMap()
        analysing.commonMap = this.periphery.detectionSystem.commonDetectionMap

        analysing.analyse()

        this.analysedDetectionData = analysing.sortedDetectionData

        return {
            newState: 'sectorsDataAnalysis',
            duration: 1
        }
    }

    /**
     * Принять решение об атаке секторов.
     * @returns {{duration: number, newState: string}}
     */
    decideToAttack() {
        const deciding = new DecideToAttack()
        deciding.uuvIndex = this.uuvSerialNumber
        deciding.combatSystem = CombatSystem
        deciding.detectionData = this.analysedDetectionData

        deciding.decide()

        this.targetsPositions = deciding.targetsPositions

        return {
            newState: 'decidingOnAttack',
            duration: 1
        }
    }

    /**
     * Необходимость атаки.
     * @returns {boolean}
     */
    needAttack() {
        return !!this.targetsPositions.length
    }

    /**
     * Атаковать цели.
     * @returns {{duration, newState: string}}
     */
    attackTargets() {
        const attacking = new AttackTargets()
        attacking.navigationSystem = this.periphery.navigationSystem
        attacking.combatSystem = CombatSystem
        attacking.targetsPositions = this.targetsPositions

        attacking.attack()

        this.attackResults = attacking.result

        return {
            newState: 'attackingTargets',
            duration: attacking.attackTime
        }
    }

    /**
     * Направиться в точку подъёма.
     * @returns {{duration: number, newState: string}}
     */
    sailToLiftingPoint() {
        const sailing = new SailToLiftingPoint()
        sailing.navigationSystem = this.periphery.navigationSystem

        sailing.sail()

        return {
            newState: 'sailingToLiftingPoint',
            duration: sailing.moveTime
        }
    }

    /**
     * Ожидать подъёма.
     * @returns {{duration: number, newState: string}}
     */
    waitForLifting() {
        return {
            newState: 'waitingForLifting',
            duration: 10
        }
    }

}