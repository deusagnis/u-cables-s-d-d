/**
 * Генератор цветов
 */
export default class ColorGenerator {
    /**
     * Содать случайные компоненты RGB тёмного цвета.
     * @returns {number[]}
     */
    static generateDarkColorRgb() {
        const red = Math.floor(Math.random() * 256 / 2);
        const green = Math.floor(Math.random() * 256 / 2);
        const blue = Math.floor(Math.random() * 256 / 2);
        return [red, green, blue]
    }

    /**
     * Содать случайные компоненты RGB светлого цвета.
     * @returns {number[]}
     */
    static generateLightColorRgb() {
        const red = Math.floor((1 + Math.random()) * 256 / 2);
        const green = Math.floor((1 + Math.random()) * 256 / 2);
        const blue = Math.floor((1 + Math.random()) * 256 / 2);
        return [red, green, blue]
    }

    /**
     * Создаёт 16ричное представление цветовой компоненты.
     * @param c
     * @returns {string|string}
     */
    static componentToHex(c) {
        let hex = Number(c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    /**
     * Создаёт HEX код цвета по компонентам RGB.
     * @param r
     * @param g
     * @param b
     * @returns {string}
     */
    static rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /**
     * Создаёт инвертированный цвет по заданному цветовому коду.
     * @param hex
     * @returns {string}
     */
    static invertColor(hex) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        return this.rgbToHex(r, g, b)
    }
}