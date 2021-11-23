/**
 * Обследование сектора.
 */
export default class InspectSector {
    /**
     * Обследуемый сектор.
     */
    sector
    /**
     * Метод способа обследования.
     */
    chooseDetectionMethodWay

    /**
     * Среда.
     */
    environment
    /**
     * Интерфейс системы навигации.
     */
    navigationSystem
    /**
     * Интерфейс системы обнаружения.
     */
    detectionSystem

    /**
     * Глубина сектора.
     */
    sectorDepth
    /**
     * Способ обследования.
     */
    detectionMethod

    /**
     * Результат обследования на наличие кабелей.
     * @type {{probability: number, time: number}}
     */
    result = {
        probability: 0,
        time: 0
    }

    /**
     * Обследовать сектор на наличие кабелей.
     * @returns {number}
     */
    inspect() {
        this.getSector()
        this.getSectorDepth()
        this.tuneDetectionMethodWay()
        this.chooseDetectionMethod()
        this.setAnalysisTime()
        this.imitateInspection()
        this.rememberResult()

        return this.result.time
    }

    /**
     * Определить текущий сектор.
     */
    getSector() {
        this.sector = this.navigationSystem.getCurrentSector()
    }

    /**
     * Определить глубину сектора.
     */
    getSectorDepth() {
        this.sectorDepth = this.environment.getPositionDepth(this.sector.position)
    }

    /**
     * Настроить способ выбора метода обнаружения.
     */
    tuneDetectionMethodWay() {
        this.chooseDetectionMethodWay.sectorDepth = this.sectorDepth
    }

    /**
     * Выбрать метод обнаружения.
     */
    chooseDetectionMethod() {
        this.detectionMethod = this.chooseDetectionMethodWay.choose()
    }

    /**
     * Установить время обследования.
     */
    setAnalysisTime() {
        this.result.time = this.detectionMethod.analysisTime
    }

    /**
     * Имитировать обследование.
     */
    imitateInspection() {
        if (this.environment.sectorHasCable(this.sector)) {
            this.result.probability = this.detectionMethod.probability
        } else {
            this.result.probability = 1 - this.detectionMethod.probability
        }
    }

    /**
     * Запомнить результат обследования.
     */
    rememberResult() {
        this.detectionSystem.addInspectionResult(this.sector, this.result.probability, this.detectionMethod.name)
    }

}