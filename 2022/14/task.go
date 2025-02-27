package main

import (
	"bytes"
	"embed"
	"flag"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"
)

//go:embed input.txt
var input embed.FS

type coordValue int16

type point struct {
	x, y coordValue
}

type fixedPoint struct {
	isSand bool
	point
}

type bounds struct {
	minX coordValue
	maxX coordValue
	minY coordValue
	maxY coordValue
}

type symbols struct {
	air        string
	fallingBit string
	sand       string
	rock       string
}

func main() {
	timer := time.Now()

	renderTicks := flag.String("render", "off", "render mode (off/result/fix/tick)")
	taskPart := flag.Int("part", 1, "task part (1/2)")
	pretty := flag.Bool("pretty", false, "use colored background instead of ascii symbols in output")
	numerateLines := flag.Bool("lines", false, "numerate lines in output")
	flag.Parse()

	text, err := input.ReadFile("input.txt")

	if err != nil {
		fmt.Println("There was an error while reading input file", err.Error())
		return
	}

	paths := parsePaths(string(text))
	fixedPoints := getFixedPoints(paths)
	fallingBit := point{500, 0}
	fixedSandCount := 0
	bounds := getBounds(paths)

	for {
		xDeltas := [3]coordValue{0, -1, 1}
		couldFall := false
		for _, xDelta := range xDeltas {
			if slices.IndexFunc(
				fixedPoints,
				func(p fixedPoint) bool {
					return p.x == fallingBit.x+xDelta && p.y == fallingBit.y+1
				},
			) == -1 {
				fallingBit.y++
				fallingBit.x += xDelta
				couldFall = true
				break
			}
		}

		if !couldFall || *taskPart == 2 && fallingBit.y == bounds.maxY-1 {
			if *renderTicks == "fix" {
				render(fallingBit, fixedPoints, bounds, *pretty, *numerateLines)
			}

			// Make bounds wider if needed
			if fallingBit.x == bounds.minX {
				bounds.minX--
			}
			if fallingBit.x == bounds.maxX {
				bounds.maxX++
			}

			fixedPoints = append(fixedPoints, fixedPoint{
				point: point{
					x: fallingBit.x,
					y: fallingBit.y,
				},
				isSand: true,
			})
			fixedSandCount++

			if *taskPart == 2 && fallingBit.y == 0 {
				if *renderTicks != "off" {
					render(fallingBit, fixedPoints, bounds, *pretty, *numerateLines)
				}
				fmt.Println("Total bits:", fixedSandCount)
				fmt.Println("Total time (including rendering):", time.Since(timer).String())
				return
			}

			fallingBit.x = 500
			fallingBit.y = 0
		}

		if *taskPart == 1 && fallingBit.y == bounds.maxY {
			if *renderTicks != "off" {
				render(fallingBit, fixedPoints, bounds, *pretty, *numerateLines)
			}
			fmt.Println("Total bits:", fixedSandCount)
			fmt.Println("Total time (including rendering):", time.Since(timer).String())
			return
		}

		if *renderTicks == "tick" {
			render(fallingBit, fixedPoints, bounds, *pretty, *numerateLines)
		}
	}
}

func render(fallingBit point, fixedPoints []fixedPoint, bounds bounds, pretty bool, lines bool) {
	var s symbols

	if pretty {
		s = symbols{
			air:        " ",
			fallingBit: "\x1b[103m \x1b[49m",
			sand:       "\x1b[43m \x1b[49m",
			rock:       "\x1b[47m \x1b[49m",
		}
	} else {
		s = symbols{
			air:        " ",
			fallingBit: ".",
			sand:       "o",
			rock:       "#",
		}
	}

	var output bytes.Buffer

	for y := bounds.minY; y <= bounds.maxY; y++ {
		for x := bounds.minX; x <= bounds.maxX; x++ {
			if y == bounds.maxY {
				output.WriteString(s.rock)
				continue
			}

			if x == fallingBit.x && y == fallingBit.y {
				output.WriteString(s.fallingBit)
				continue
			}

			fixedPointIndex := slices.IndexFunc(
				fixedPoints,
				func(p fixedPoint) bool {
					return p.x == x && p.y == y
				},
			)
			if fixedPointIndex == -1 {
				output.WriteString(s.air)
				continue
			}
			fixedPoint := fixedPoints[fixedPointIndex]

			if fixedPoint.isSand {
				output.WriteString(s.sand)
			} else {
				output.WriteString(s.rock)
			}
		}

		if lines {
			output.WriteString("  " + strconv.Itoa(int(y)))
		}
		output.WriteString("\n")
	}

	fmt.Println(output.String())
}

func parsePaths(inputString string) [][]point {
	paths := make([][]point, 0)
	pathsStrings := strings.Split(string(inputString), "\n")

	for i, pathString := range pathsStrings {
		paths = append(paths, make([]point, 0))
		pointStrings := strings.Split(pathString, " -> ")
		for _, pointString := range pointStrings {
			coords := strings.Split(pointString, ",")
			x, _ := strconv.Atoi(coords[0])
			y, _ := strconv.Atoi(coords[1])
			paths[i] = append(paths[i], point{
				x: coordValue(x),
				y: coordValue(y),
			})
		}
	}

	return paths
}

func getFixedPoints(paths [][]point) []fixedPoint {
	fixedPoints := make([]fixedPoint, 0)

	for _, path := range paths {
		for i := 0; i < len(path)-1; i++ {
			pointA := path[i]
			pointB := path[i+1]

			// Vertical line
			if pointA.x == pointB.x {
				var higherPoint, lowerPoint point
				if pointA.y < pointB.y {
					higherPoint = pointA
					lowerPoint = pointB
				} else {
					higherPoint = pointB
					lowerPoint = pointA
				}

				for y := higherPoint.y; y <= lowerPoint.y; y++ {
					if slices.IndexFunc(
						fixedPoints,
						func(p fixedPoint) bool {
							return p.y == y && p.x == pointA.x
						},
					) == -1 {
						fixedPoints = append(fixedPoints, fixedPoint{
							point: point{
								x: pointA.x,
								y: y,
							},
							isSand: false,
						})
					}
				}
			}

			// Horizontal line
			if pointA.y == pointB.y {
				var leftPoint, rightPoint point
				if pointA.x < pointB.x {
					leftPoint = pointA
					rightPoint = pointB
				} else {
					leftPoint = pointB
					rightPoint = pointA
				}

				for x := leftPoint.x; x <= rightPoint.x; x++ {
					if slices.IndexFunc(
						fixedPoints,
						func(p fixedPoint) bool {
							return p.x == x && p.y == pointA.y
						},
					) == -1 {
						fixedPoints = append(fixedPoints, fixedPoint{
							point: point{
								x: x,
								y: pointA.y,
							},
							isSand: false,
						})
					}
				}
			}
		}
	}

	return fixedPoints
}

func getBounds(paths [][]point) bounds {
	var minX, maxX, minY, maxY coordValue
	minX, minY = 32000, 0
	maxX, maxY = 0, 0

	for _, path := range paths {
		for _, point := range path {
			if point.x < minX {
				minX = point.x
			}
			if point.x > maxX {
				maxX = point.x
			}
			if point.y < minY {
				minY = point.y
			}
			if point.y > maxY {
				maxY = point.y
			}
		}
	}

	return bounds{minX - 1, maxX + 1, minY, maxY + 2}
}
