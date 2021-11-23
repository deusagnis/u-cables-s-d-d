import Sector from "./Entities/Sector.js";
import NavigationSystem from "./Entities/NavigationSystem.js";
import ColorGenerator from "./Entities/ColorGenerator.js";

/**
 * Объект для создания настроек графика по результатам симуляции.
 */
export default class TuneChart {
    /**
     * Результат симуляции.
     */
    simulationResult
    /**
     * Среда.
     */
    environment

    /**
     * Итоговый конфиг для графика.
     * @type {{data: {datasets: []}, options: {}}}
     */
    config = {
        data: {
            datasets: []
        },
        options: {}
    }

    /**
     * Создать конфиг для графика.
     */
    tune() {
        this.genConfig()
    }

    /**
     * Сгенерировать конфиг.
     */
    genConfig() {
        this.genData()
        this.genOptions()
    }

    /**
     * Сгененировать датасеты.
     */
    genData() {
        this.addTrajectories()
        this.addCables()
        this.addAttackCases()
    }

    /**
     * Сгененировать опции.
     */
    genOptions() {
        this.config.options = {
            scales: {
                x: {
                    type: 'linear',
                    min: NavigationSystem.positionRestrictions.x.min,
                    max: NavigationSystem.positionRestrictions.x.max,
                    ticks: {
                        stepSize: Sector.size
                    }
                },
                y: {
                    type: 'linear',
                    min: NavigationSystem.positionRestrictions.y.min,
                    max: NavigationSystem.positionRestrictions.y.max,
                    ticks: {
                        stepSize: Sector.size
                    }
                }
            }
        }
    }

    /**
     * Добавить данные траекторий.
     */
    addTrajectories() {
        this.config.data.datasets.push(...this.simulationResult.trajectories.map(
            (trajectory, serialNumber) => this.createTrajectoryDataset(serialNumber, trajectory))
        )
    }

    /**
     * Создать датасет траектории.
     * @param serialNumber
     * @param trajectory
     * @returns {{backgroundColor: string, borderColor: string, data, label: string, type: string}}
     */
    createTrajectoryDataset(serialNumber, trajectory) {
        return {
            type: 'line',
            label: this.genTrajectoryLabel(serialNumber),
            data: this.genTrajectoryData(trajectory),
            backgroundColor: this.genBackgroundColor(),
            borderColor: this.genBorderColor(),
        }
    }

    /**
     * Сгенерировать название для траектории.
     * @param serialNumber
     * @returns {string}
     */
    genTrajectoryLabel(serialNumber) {
        return 'Trajectory of UUV#' + serialNumber
    }

    /**
     * Сгенерировать данные траектории.
     * @param trajectory
     * @returns {*}
     */
    genTrajectoryData(trajectory) {
        return trajectory.map((position) => ({x: position.x, y: position.y}))
    }

    /**
     * Сгенерировать фоновый цвет для линий.
     * @returns {string}
     */
    genBackgroundColor() {
        return ColorGenerator.rgbToHex(...ColorGenerator.generateDarkColorRgb())
    }

    /**
     * Сгененировать цвет границ.
     * @returns {string}
     */
    genBorderColor() {
        const hex = ColorGenerator.rgbToHex(...ColorGenerator.generateLightColorRgb())
        if (Math.random() > 0.5) {
            return hex
        } else {
            return ColorGenerator.invertColor(hex)
        }
    }

    /**
     * Добавить данные кабелей.
     */
    addCables() {
        this.config.data.datasets.push(this.genCablesDataset())
    }

    /**
     * Сгененировать датасект кабеля.
     * @returns {{backgroundColor: string, data, borderWidth: number, label: string, type: string}}
     */
    genCablesDataset() {
        return {
            type: 'bubble',
            label: 'Cables',
            data: this.genCablesData(),
            // backgroundColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(35,182,64)',
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 6
        }
    }

    /**
     * Сгененировать данные кабелей.
     * @returns {*}
     */
    genCablesData() {
        // const firstBorderPoint = (this.simulationResult.cables[0]!==undefined)
        //     ? this.genBorderCablePoint(this.simulationResult.cables[0].position)
        //     : false
        // const lastBorderPoint = (this.simulationResult.cables[this.simulationResult.cables.length-1]!==undefined)
        //     ? this.genBorderCablePoint(this.simulationResult.cables[this.simulationResult.cables.length-1].position)
        //     : false
        return this.simulationResult.cables.map((cableData) => ({
            x: cableData.position.x,
            y: cableData.position.y,
            r: cableData.cables * (Sector.size * 0.04)
        }))
        // if(firstBorderPoint!==false){
        //     cablesData.unshift(firstBorderPoint)
        // }
        // if(lastBorderPoint!==false){
        //     cablesData.push(lastBorderPoint)
        // }
        // return cablesData
    }

    // genBorderCablePoint(position){
    //     const points = [
    //         {
    //             dist: Math.abs(position.x-NavigationSystem.positionRestrictions.x.max),
    //             x: NavigationSystem.positionRestrictions.x.max,
    //             y: position.y
    //         },
    //         {
    //             dist: Math.abs(position.x-NavigationSystem.positionRestrictions.x.min),
    //             x: NavigationSystem.positionRestrictions.x.min,
    //             y: position.y
    //         },
    //         {
    //             dist: Math.abs(position.y-NavigationSystem.positionRestrictions.y.max),
    //             y: NavigationSystem.positionRestrictions.y.max,
    //             x: position.x
    //         },
    //         {
    //             dist: Math.abs(position.y-NavigationSystem.positionRestrictions.y.min),
    //             y: NavigationSystem.positionRestrictions.y.min,
    //             x: position.x
    //         }
    //     ]
    //     points.sort((point1,point2)=>(point1.dist-point2.dist))
    //     const min = points.shift()
    //     return {x: min.x,y: min.y}
    // }

    /**
     * Добавить данные об атаках.
     */
    addAttackCases() {
        for (let vehicleSerialNumber in this.simulationResult.attackLog) {
            const vehicleAttacks = this.simulationResult.attackLog[vehicleSerialNumber]
            this.genVehicleAttacksDatasets(vehicleSerialNumber, vehicleAttacks)
        }
    }

    /**
     * Сгененерировать датасеты атак.
     * @param vehicleSerialNumber
     * @param vehicleAttacks
     */
    genVehicleAttacksDatasets(vehicleSerialNumber, vehicleAttacks) {
        for (let attackNumber in vehicleAttacks) {
            const vehicleAttack = vehicleAttacks[attackNumber]
            this.genVehicleTargetsAttackDatasets(vehicleSerialNumber, attackNumber, vehicleAttack)
        }
    }

    /**
     * Сгененировать датасеты целей атаки.
     * @param vehicleSerialNumber
     * @param attackNumber
     * @param vehicleAttack
     */
    genVehicleTargetsAttackDatasets(vehicleSerialNumber, attackNumber, vehicleAttack) {
        this.config.data.datasets.push({
            type: 'bubble',
            label: this.genVehicleAttackLabel(vehicleSerialNumber, attackNumber),
            data: [
                // {
                //     x: vehicleAttack.attackPosition.x,
                //     y: vehicleAttack.attackPosition.y,
                // },
                {
                    x: vehicleAttack.targetPosition.x,
                    y: vehicleAttack.targetPosition.y,
                    r: (Sector.size * 0.08)
                }
            ],
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 6
        })
    }

    /**
     * Сгенерировать название для атаки.
     * @param serialNumber
     * @param attackNumber
     * @returns {string}
     */
    genVehicleAttackLabel(serialNumber, attackNumber) {
        return 'UUV#' + serialNumber + ' Attack#' + attackNumber
    }
}