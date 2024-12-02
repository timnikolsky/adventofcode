import { reports } from './input';
import { checkReportSafety } from './shared';

let safeReportsCount = 0;

for (const report of reports) {
	let isSafe = checkReportSafety(report);
	if (isSafe) safeReportsCount++;
}

console.log(safeReportsCount);
