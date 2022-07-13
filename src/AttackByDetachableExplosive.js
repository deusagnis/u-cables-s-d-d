import Attacker from "./Entities/Attacker.js";

/**
 * Атака с помощью откреплямых взрывных зарядов.
 */
export default class AttackByDetachableExplosive extends Attacker{
    /**
     * Интерфейс системы навигации.
     */
    navigationSystem
    /**
     * Интерфейс боевой системы.
     */
    combatSystem
    /**
     * Позиции для атаки.
     * @type {[]}
     */
    targetsPositions = []

    /**
     * Итоговое время затраченное на атаку.
     */
    attackTime = 0

    /**
     * Интерфейс объекта, ожидающего данных атаки.
     */
    attackInspector

    /**
     * Атаковать цели посредством откреплямых взрывных зарядов.
     */
    attack(){
        this.sortTargetsBySelfDistance()
        for(let target of this.targetsPositions){
            this.attackTarget(target)
        }
    }

    /**
     * Сортировать цели по отдалённости от текущей позиции.
     */
    sortTargetsBySelfDistance(){
        this.targetsPositions.sort((t1,t2)=>{
            const d1 = this.navigationSystem.constructor.calcDistance(this.navigationSystem.position,t1.sector.position)
            const d2 = this.navigationSystem.constructor.calcDistance(this.navigationSystem.position,t2.sector.position)
            return d1-d2
        })
    }

    /**
     * Произвести атаку цели.
     * @param target
     */
    attackTarget(target){
        let time = this.sailToTargetPosition(target.sector.position)
        const defeated = this.detachExplosive()
        time += this.calcDetachTime()
        this.provideAttackTime(time)
        this.attackInspector.addAttackResult(target, defeated, time)
    }

    /**
     * Переместиться в точку сбросу заряда.
     * @param position
     * @returns {number|*}
     */
    sailToTargetPosition(position){
        this.navigationSystem.targetPosition = position
        this.navigationSystem.moveToTarget()

        return this.navigationSystem.moveTime
    }

    /**
     * Сбросить взрывчатый зардяд.
     * @returns {boolean}
     */
    detachExplosive(){
        return Math.random() < this.combatSystem.getCurrentWeaponData().hitProbability
    }

    /**
     * Посчитать время сброса заряда.
     * @returns {number|*}
     */
    calcDetachTime(){
        return this.combatSystem.getCurrentWeaponData().launchTime
    }

    /**
     * Обеспечить значение общего времени, затраченного на всё атаку целей.
     * @param oneAttackTime
     */
    provideAttackTime(oneAttackTime){
        this.attackTime += oneAttackTime
    }
}