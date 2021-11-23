import Environment from "./Environment.js";
import DetectionSystem from "./DetectionSystem.js";

/**
 * Интерфейс системы связи.
 */
export default class CommunicationSystem {
    /**
     * Номера НПА соратников в группе.
     * @type {[]}
     */
    matesSerialNumbers = []

    /**
     * Опросить соратников о посещённых или забронированных секторах.
     * @returns {*[]}
     */
    interrogateVisitedOrBookedSectors() {
        const visitedOrBooked = []
        for (let vehicle of Environment.vehicles) {
            if (!this.matesSerialNumbers.includes(vehicle.serialNumber)) continue
            visitedOrBooked.push(...vehicle.behavior.periphery.navigationSystem.getVisitedAndTargetedSectors())
        }

        return visitedOrBooked
    }

    /**
     * Получить позиции НПА соратников.
     * @returns {*[]}
     */
    getMatesPositions() {
        const positions = []
        for (let vehicle of Environment.vehicles) {
            if (!this.matesSerialNumbers.includes(vehicle.serialNumber)) continue
            positions.push(vehicle.behavior.periphery.navigationSystem.position)
        }
        return positions
    }

    /**
     * Опросить НПА соратников о завершении обследования зоны поиска.
     * @returns {boolean}
     */
    interrogateAboutCompletionInspection() {
        for (let vehicle of Environment.vehicles) {
            if (!this.matesSerialNumbers.includes(vehicle.serialNumber)) continue
            if (!DetectionSystem.completedInspectionStates.includes(vehicle.state)) {
                return false
            }
        }

        return true
    }

    /**
     * Собрать общие данные обследования секторов.
     * @returns {{}}
     */
    collectSectorsInspectionData() {
        const commonDetectionMap = {}
        for (let vehicle of Environment.vehicles) {
            Object.assign(commonDetectionMap, vehicle.behavior.periphery.detectionSystem.detectionMap)
        }

        return commonDetectionMap
    }
}