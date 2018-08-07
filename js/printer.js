/*
  Printer object used to convert different maze representation formats
  to a unified coordinate format which would be used for printing
*/
class Printer {

	constructor(width) {
		this.width = width;
		this.left = [];
		this.right = [];
		this.x = [];
		this.y = [];
		this.d = [];
	}

	addWall(left, right) {
		this.left.push(left);
		this.right.push(right);
	}

	addCell(x, y, d) {
		this.x.push(x);
		this.y.push(y);
		this.d.push(d);
	}

	removeCell() {
		this.x.pop();
		this.y.pop();
		this.d.pop();
	}

	/* Convert wall list to coordinates array */
	wallsToArray() {
		const x_coords_out = [];
		const y_coords_out = [];

		const left = this.left;
		const right = this.right;
		const w = this.width;

		for (let i = 0; i < left.length; i++) {
			let x = left[i] % w * 2;
			let y = ~~(left[i]/w) * 2; // left[i]/w<<1

			if (left[i] === right[i] - 1) {
				x_coords_out.push(x, x + 1, x + 2);
				y_coords_out.push(y, y, y);
			} else {
				x_coords_out.push(x, x, x);
				y_coords_out.push(y, y + 1, y + 2);
			}
		}

		return {
	    x : x_coords_out,
	    y : y_coords_out
	  };
	}

	/* Convert cell list to coordinates array */
	cellsToArray() {
		const xArray = this.x;
		const yArray = this.y;
		const dArray = this.d;

		const x_coords_out = [xArray[0] * 2];
		const y_coords_out = [xArray[0] * 2];

		/* First cell doesn't have a direction, so we skip */
		for (let i = 1; i < xArray.length; i++) {
			let x = xArray[i] * 2;
			let y = yArray[i] * 2;
			let dir = dArray[i];

			if (dir === Maze2D.NORTH) {
				x_coords_out.push(x);
				y_coords_out.push(y + 1);
			}
			else if (dir === Maze2D.EAST) {
				x_coords_out.push(x - 1);
				y_coords_out.push(y);
			}
			else if (dir === Maze2D.SOUTH) {
				x_coords_out.push(x);
				y_coords_out.push(y - 1);
			}
			else {
				x_coords_out.push(x + 1);
				y_coords_out.push(y);
			}

			x_coords_out.push(x);
			y_coords_out.push(y);
		}

		return {
	    x : x_coords_out,
	    y : y_coords_out
	  };
	}

	/* Debug */
	printCoords() {
		if (this.left) {
			console.log(this.left, this.right);
		} else {
			console.log(this.x, this.y, this.d);
		}
	}
}