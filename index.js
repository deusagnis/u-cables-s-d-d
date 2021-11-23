import Simulate from "./src/Simulate.js";
import TuneChart from "./src/TuneChart.js";
import Environment from "./src/Entities/Environment.js";
import simulationSettings from "./src/config/simulationSettings.js";

// Создаём симуляцию
const simulate = new Simulate()
// Задаём настройки
simulate.settings = simulationSettings
// Настраиваем симуляцию
simulate.init()
// Симулируем выполнение задачи и сохраняем результаты
const result = simulate.simulate()
console.log(result)
document.getElementById('elapsedTime').innerText = (Math.max(...result.elapsedTime)/60).toFixed(2)

// Создаём объект для настройки графиков
const tuner = new TuneChart()
// Настраиваем его
tuner.environment = Environment
tuner.simulationResult = result

// Создаём настройки для графика
tuner.tune()

// Создаём график с данными симуляции
const myChart = new Chart(
    document.getElementById('myChart'),
    tuner.config
);


