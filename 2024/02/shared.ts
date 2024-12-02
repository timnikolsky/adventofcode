/** Turns any negative number into -1 and any positive number into 1 */
export function normalize(n: number) {
	return n / Math.abs(n);
}

export function checkReportSafety(report: number[]) {
	// -1 if decreasing, 1 if increasing, zero as unknown initially
	let direction: number = 0;
	let isSafe = true;

	for (let i = 0; i < report.length - 1; i++) {
		const difference = report[i + 1] - report[i];
		// The direction of the report depends on the first pair of levels
		direction ||= normalize(difference);

		// Check rule 1: all levels follow the same direction
		if (normalize(difference) !== direction) {
			isSafe = false;
			continue;
		}

		// Check rule 2: difference should be at least one and at most three
		if (Math.abs(difference) < 1 || Math.abs(difference) > 3) {
			isSafe = false;
		}
	}

	return isSafe;
}
