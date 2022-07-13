/**
 * Интерфейс боевой системы НПА.
 */
export default class CombatSystem{
    /**
     * Данные о вооружении.
     */
    static weaponry = {}

    /**
     * Название текущего способа атаки.
     */
    static currentAttackWay
    /**
     * Коэффициент минимального весасектора для решения об атаке.
     */
    static minTargetWeight

    /**
     * Получить данные о текущем вооружении для применения
     * @returns {*}
     */
    static getCurrentWeaponData(){
        return this.weaponry[this.currentAttackWay]
    }
}