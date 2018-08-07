# Maze generator

Simple JavaScript maze generator with step by step animation and different generation algorithms. Only standard mazes (containing no loops) can be generated.

[Click here for a demo](http://raf48.github.io/Maze/)

## Maze generation algorithms

Maze is generated using one of the following algorithms:
* Depth-first search
* Kruskal's
* Prim's
* Random traversal
* Eller's

Note: Random traversal is implemented as same as Prim's only without a heap.

## Solving maze

Maze solving is implemented with backtracking. Only generated mazes can be solved, Duh!

## Limitations

You may generate mazes up till 999x999. Generating mazes above 100x100 may freeze your browser. Some algorithms (especially Kruskal's) take longer time to compute, depending on your hardware. E.g. generating 500x500 Kruskal's maze on Intel i5-3350P CPU @ 3.10 GHz takes around 120 sec!
