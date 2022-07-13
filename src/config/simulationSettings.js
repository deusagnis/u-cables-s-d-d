/**
 * Настройки симуляции.
 */
export default {
    // Максимальное количество итераций.
    maxIterations: 1_000_000,
    // Количество АНПА в рое.
    swarmVolume: 3,
    // Интервал сброса АНПА.
    throwInterval: 7,
    // Состояние остановки АНПА.
    stopState: 'waitingForLifting',
    // Параметры среды.
    environment: {
        area: {
            // Ширина обследуемой зоны.
            width: 2000,
            // Длина обследуемой зоны.
            height: 1500,
            // Максимальная глубина обследуемой зоны.
            maxDepth: 300,
        },
        // Количество кабелей в обследуемой зоне.
        cables: {
            amount: 2,
            map: {}
        }
    },
    navigationSystem: {
        // Крейсерская скорость АНПА.
        vehicleMaxSpeed: 25,
    },
    detectionSystem: {
        // Состояния при которых обследование сектора зоны считается завершенным.
        completedInspectionStates: ['interrogationAboutCompletionInspection', 'waitingForSectorsAnalysis',
            'collectingSectorsData', 'sectorsDataAnalysis', 'decidingOnAttack',
            'attackingTargets', 'sailingToLiftingPoint', 'waitingForLifting'
        ],
        // Методы обнаружения подводных кабелей.
        methods: {
            // Акустический.
            acoustic: {
                // Дальность.
                range: 1500,
                // Вероятность успеха.
                probability: 0.8,
                // Время применения.
                analysisTime: 10
            },
            // Магнитный.
            magnetic: {
                range: 180,
                probability: 0.9,
                analysisTime: 7
            },
            // Лазерный.
            laser: {
                range: 80,
                probability: 0.95,
                analysisTime: 3
            }
        },
        // Основной применяемый метод обнаружения.
        mainDetectionMethod: 'magnetic'
    },
    combatSystem: {
        // Вооружение.
        weaponry:{
            // Торпеды.
            torpedo: {
                // Боезопас.
                ammunition: 2,
                // Дальность поражения.
                defeatRange: 1500,
                // Скорость.
                speed: 80,
                // Вероятность поражения.
                hitProbability: 0.99,
                // Время запуска.
                launchTime: 1
            },
            // Открепляемый взрывной заряд.
            detachableExplosive: {
                ammunition: 2,
                defeatRange: 0,
                speed: 3,
                hitProbability: 0.99,
                launchTime: 0
            }
        },
        // Метод уничтожения подводных кабелей.
        currentAttackWay: 'detachableExplosive',
        // Минимальный коэффициент, допускающий атаку обнаруженной цели.
        minTargetWeight: 2.0
    }
}