const fs = require('fs');
const path = require('path');

const CONFIG = {
    outputDir: path.join(__dirname, 'output'),
    frameworks: ['express', 'express-cluster', 'bandit', 'cowboy', 'mist', 'ewe', 'go'],
    concurrencyLevels: [1, 2, 4, 6, 8, 12, 16],
    tests: {
        'GET /': (framework, concurrency) => `${framework}-${concurrency}.txt`,
        'GET /user/:id': (framework, concurrency) => `${framework}-${concurrency}-user.txt`,
        'POST /user': (framework, concurrency) => `${framework}-${concurrency}-post.txt`
    },
    csvOutputFilename: 'benchmark_results_final.csv'
};

function parseReqPerSecFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/finished in [\d.]+s, ([\d,]+\.\d+) req\/s/);

        if (match && match[1]) {
            const reqPerSecString = match[1].replace(/,/g, '');
            return parseFloat(reqPerSecString);
        }
    } catch (error) {
        console.error(`Error reading or parsing ${filePath}: ${error.message}`);
    }
    return null;
}

function gatherBenchmarkData() {
    const allResults = {};

    console.log('Processing benchmark data...\n');

    for (const framework of CONFIG.frameworks) {
        const frameworkDir = path.join(CONFIG.outputDir, framework);
        allResults[framework] = {};

        console.log(`[Framework: ${framework}]`);

        if (!fs.existsSync(frameworkDir)) {
            console.warn(`  -> Directory not found. Skipping.`);
            continue;
        }

        for (const testName in CONFIG.tests) {
            allResults[framework][testName] = {};

            for (const concurrency of CONFIG.concurrencyLevels) {
                const getFilename = CONFIG.tests[testName];
                const filename = getFilename(framework, concurrency);
                const filePath = path.join(frameworkDir, filename);

                if (fs.existsSync(filePath)) {
                    const reqPerSec = parseReqPerSecFromFile(filePath);
                    if (reqPerSec !== null) {
                        allResults[framework][testName][concurrency] = reqPerSec;
                    }
                }
            }
        }
    }
    return allResults;
}

function formatDataAsCSV(data) {
    const header = ['Framework', ...CONFIG.concurrencyLevels].join(',');
    const sections = [];

    for (const testName in CONFIG.tests) {
        const testSection = [];
        testSection.push(`\n${testName}`);
        testSection.push(header);

        for (const framework of CONFIG.frameworks) {
            const rowData = [framework];
            for (const concurrency of CONFIG.concurrencyLevels) {
                const result = data[framework]?.[testName]?.[concurrency] || '';
                rowData.push(result);
            }
            testSection.push(rowData.join(','));
        }
        sections.push(testSection.join('\n'));
    }

    return sections.join('\n');
}

function main() {
    const allBenchmarkData = gatherBenchmarkData();
    const csvContent = formatDataAsCSV(allBenchmarkData);

    try {
        fs.writeFileSync(CONFIG.csvOutputFilename, csvContent);
        console.log(`\nResults successfully written to ${CONFIG.csvOutputFilename}`);
    } catch (error) {
        console.error(`\nFailed to write results to file: ${error.message}`);
        return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK RESULTS (CSV FORMAT)');
    console.log('='.repeat(80));
    console.log(csvContent);
}

main();