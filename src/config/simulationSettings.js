/**
 * Настройки симуляции.
 */
export default {
    maxIterations: 1_000_000,
    swarmVolume: 3,
    throwInterval: 7,
    stopState: 'waitingForLifting',
    environment: {
        area: {
            width: 3000,
            height: 1000,
            maxDepth: 300,
        },
        cables: {
            amount: 2,
            map: {}
        }
    },
    navigationSystem: {
        vehicleMaxSpeed: 25,
    },
    detectionSystem: {
        completedInspectionStates: ['interrogationAboutCompletionInspection', 'waitingForSectorsAnalysis',
            'collectingSectorsData', 'sectorsDataAnalysis', 'decidingOnAttack', 'attackingTargets', 'sailingToLiftingPoint', 'waitingForLifting'
        ],
        methods: {
            acoustic: {
                range: 1500,
                probability: 0.8,
                analysisTime: 30
            },
            magnetic: {
                range: 300,
                probability: 0.9,
                analysisTime: 20
            },
            laser: {
                range: 80,
                probability: 0.95,
                analysisTime: 10
            }
        }
    },
    combatSystem: {
        torpedo: {
            ammunition: 2,
            defeatRange: 1500,
            speed: 80,
            hitProbability: 0.99,
            launchTime: 1
        },
        minTargetWeight: 2.0
    }
}