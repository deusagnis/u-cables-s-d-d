/**
 * Интерфейс системы обнаружения.
 */
export default class DetectionSystem{
    /**
     * Состояния, подтверждающие завершение обследования зоны поиска.
     * @type {[]}
     */
    static completedInspectionStates = []
    /**
     * Данные методов обследования сектора.
     * @type {{}}
     */
    static methods = {}

    /**
     * Данные обследованных секторов.
     * @type {{}}
     */
    detectionMap = {}
    /**
     * Общие данные обследованных секторов.
     * @type {{}}
     */
    commonDetectionMap = {}

    /**
     * Добавить данные обследованного сектора.
     * @param sector
     * @param probability
     * @param methodName
     */
    addInspectionResult(sector,probability,methodName){
        this.detectionMap[sector.toString()] = {
            sector: sector,
            method: methodName,
            cableProbability: probability,
        }
    }
}