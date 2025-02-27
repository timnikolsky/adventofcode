package main

import (
	"embed"
	"fmt"
	"strings"
)

//go:embed input.txt
var input embed.FS

type coords struct {
	x, y uint16
}

func main() {
	text, err := input.ReadFile("input.txt")

	if err != nil {
		println("There was an error while reading input file", err.Error())
		panic(1)
	}

	pathsStrings := strings.Split(string(text), "\r\n")

	for _, pathString := range pathsStrings {
		pointStrings := strings.Split(pathString, " -> ")
		fmt.Println(pointStrings)
	}
}
