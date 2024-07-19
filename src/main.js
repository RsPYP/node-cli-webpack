const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const progress = require("cli-progress");
const { Command } = require("commander");
const winston = require("winston");

const commandOption = new Command();
commandOption
  .option(
    "-o, --output <type>",
    "output format (csv, json, console)",
    "console"
  )
  .parse(process.argv);
const outputFormat = commandOption.opts().output;

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp}[${level}]:${message}`
    )
  ),
});

function validateCsv(data, options) {
  try {
    const parsedData = parse(data, options);
    return { err: null, parsedData };
  } catch (err) {
    return { err, parsedData: null };
  }
}

function main() {
  console.log("Starting main function");
  const progressBar = new progress.SingleBar(
    {},
    progress.Presets.shades_classic
  );
  progressBar.start(2, 0);
  console.log("Reading input CSV file");
  const readFile = fs.readFileSync("./data/csv/inputData.csv");
  const { err, parsedData } = validateCsv(readFile, {
    columns: true,
    skip_empty_lines: true,
  });

  progressBar.update(1);

  if (err) {
    logger.error("csvの解析中にエラーが発生しました");
    console.log("Error parsing CSV: ", err);
    return;
  }

  console.log("Filtering data");
  console.log("Parsed Data: ", parsedData);  // フィルタリング前のデータを確認

  // フィルタリングの条件を修正
  const filteredData = parsedData.filter(
    (row) => parseInt(row["age"], 10) >= 45
  );

  console.log("Filtered Data: ", filteredData);  // フィルタリング後のデータを確認

  console.log("Output format: ", outputFormat);
  try {
    switch (outputFormat) {
      case "csv": {
        console.log("Writing CSV output");
        const csvData = stringify(filteredData, { header: true });
        console.log("CSV Data: ", csvData);  // デバッグ用
        fs.writeFileSync("./data/csv/over45Years.csv", csvData);
        console.log("CSV file written successfully");
        break;
      }
      case "json": {
        console.log("Writing JSON output");
        fs.writeFileSync(
          "./data/json/over45Years.json",
          JSON.stringify(filteredData, null, 2)
        );
        break;
      }
      case "console": {
        console.log("Outputting to console");
        console.info(filteredData);
        break;
      }
      default: {
        logger.error("エラー：不正なオプションです。");
        console.log("Invalid option");
        break;
      }
    }
  } catch (error) {
    console.log("Error writing file: ", error);
    logger.error("ファイル書き込み中にエラーが発生しました");
  }
  progressBar.update(2);
  progressBar.stop();
  console.log("Main function completed");
}

main();
