const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program
    .requiredOption('-i, --input <path>', '���� �� �������� �����')
    .option('-o, --output <path>', '���� �� ��������� �����')
    .option('-d, --display', '������� ��������� � �������');

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


    console.log('�������� ���:', inputData);


    if (!Array.isArray(inputData) || inputData.length === 0) {
        throw new Error('��� ��� ������� ������ ��� ����� ����������� ������');
    }


    const minAsset = inputData.reduce((min, asset) =>
        asset.value < min.value ? asset : min,
        inputData[0]
    );


    if (!minAsset.txt || typeof minAsset.value === 'undefined') {
        throw new Error('����������� ������ ����� ���������� ������');
    }

    result = `${minAsset.txt}:${minAsset.value}`;

    if (options.display) {
        console.log(result);
    }

    if (options.output) {
        fs.writeFileSync(outputFilePath, result);
        console.log(`��������� ��������� � ����: ${outputFilePath}`);
    }
} catch (error) {
    console.error('������� ��� ������� �����:', error.message);
}
