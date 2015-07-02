# Maze generator

Simple JavaScript maze generator app with step by step animation and different generation algorithms. Only standard mazes (containing no loops) can be generated.

[Click here for a demo](http://raf48.github.io/Maze/)

## Maze generation

Maze is generated using one of the following algorithms: "depth-first search", "Kruskal's" algorithm or "Prim's algorithm". Depth-first search is implemented with backtracking and recursion. Kruskal's algorithm is implemented with a disjoint-set data structure.

## Solving the maze

Maze solving is implemented with backtracking.

## Known bugs

Sometimes you will get "too much recursion" error when generating big mazes (size > 100) with depth-first search algorithm.
