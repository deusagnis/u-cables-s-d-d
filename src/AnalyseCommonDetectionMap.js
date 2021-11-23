/**
 * Проанализировать данные обследования секторов.
 */
export default class AnalyseCommonDetectionMap {
    /**
     * Данные обследованных секторов.
     */
    commonMap

    /**
     * Отстортированные данные анализа.
     */
    sortedDetectionData

    /**
     * Проанализировать.
     */
    analyse() {
        this.weighDetectionMap()
        this.createSortedDetectionData()
    }

    /**
     * Посчитать веса секторов.
     */
    weighDetectionMap() {
        for (let key in this.commonMap) {
            const detectionData = this.commonMap[key]
            detectionData.targetWeight = detectionData.cableProbability
            const sectorsAround = detectionData.sector.genSectorsAround(1)
            for (const sectorAround of sectorsAround) {
                const detectionDataAround = this.commonMap[sectorAround.toString()]
                if (detectionDataAround === undefined) continue
                detectionData.targetWeight += detectionDataAround.cableProbability
            }
            if(detectionData.cableProbability<0.5){
                detectionData.targetWeight /= 1.5
            }
        }
    }

    /**
     * Создать сортированные данные обследования секторов.
     */
    createSortedDetectionData() {
        this.sortedDetectionData = Object.values(this.commonMap)
        this.sortedDetectionData.sort((sectorData1, sectorData2) => sectorData1.targetWeight - sectorData2.targetWeight)
    }
}