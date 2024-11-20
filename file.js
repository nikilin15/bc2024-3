const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program
    .requiredOption('-i, --input <path>', 'Шлях до вхідного файлу')
    .option('-o, --output <path>', 'Шлях до вихідного файлу')
    .option('-d, --display', 'Вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

const inputFilePath = path.resolve(options.input);
const outputFilePath = options.output ? path.resolve(options.output) : 'output.txt';


if (!options.input) {
    console.error('Please, specify input file');
    process.exit(1);
}


if (!fs.existsSync(inputFilePath)) {
    console.error('Cannot find input file');
    process.exit(1);
}


let result = '';

try {
    const inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));


    console.log('Прочитані дані:', inputData);


    if (!Array.isArray(inputData) || inputData.length === 0) {
        throw new Error('Дані про резерви відсутні або мають некоректний формат');
    }


    const minAsset = inputData.reduce((min, asset) =>
        asset.value < min.value ? asset : min,
        inputData[0]
    );


    if (!minAsset.txt || typeof minAsset.value === 'undefined') {
        throw new Error('Некоректний формат даних резервного активу');
    }

    result = `${minAsset.txt}:${minAsset.value}`;

    if (options.display) {
        console.log(result);
    }

    if (options.output) {
        fs.writeFileSync(outputFilePath, result);
        console.log(`Результат збережено у файл: ${outputFilePath}`);
    }
} catch (error) {
    console.error('Помилка при обробці даних:', error.message);
}
