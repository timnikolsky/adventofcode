import { reports } from './input';
import { checkReportSafety, normalize } from './shared';

let safeReportsCount = 0;

for (const report of reports) {
	let isSafe = checkReportSafety(report);

	for (let i = 0; i < report.length; i++) {
		// Duplicate a report array so we don't modify the original one
		const shortenedReport = [...report];
		shortenedReport.splice(i, 1);
		let isShortenedSafe = checkReportSafety(shortenedReport);
		if (isShortenedSafe) {
			isSafe = true;
		}
	}

	if (isSafe) {
		safeReportsCount++;
	}
}

console.log(safeReportsCount);
