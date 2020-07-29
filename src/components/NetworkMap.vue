<template>
	<svg width="800" height="800">
		<!-- transform coordinate system to be scale independent -->
		<g transform="translate(400, 400) scale(3.8,3.8)">
			<line class="axis" x1="0" y1="-100" x2="0" y2="100" />
			<line class="axis" x1="100" y1="0" x2="-100" y2="0" />
			<circle class="horizon" cx="0" cy="0" r="100" />
			<circle class="horizon" cx="0" cy="0" r="66.67" />
			<circle class="horizon" cx="0" cy="0" r="33.33" />

			<g v-for="mark in alteriMarks" :key="mark.d.id">
				<line x1="0" y1="0" :x2="mark.x" :y2="mark.y" />
				<circle :r="2" :cx="mark.x" :cy="mark.y" />
				<text
					:x="mark.x"
					:y="mark.y"
					:text-anchor="mark.x < 0 ? 'end' : 'start'"
					:dx="mark.x < 0 ? -3 : 3"
					:dy="mark.y < 0 ? -1 : 4"
				>
					{{ mark.d.name }}
				</text>
			</g>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Alter2 } from "@/data/Alter.ts";

interface AlteriMark {
	d: Alter2;
	x: number;
	y: number;
}

@Component
export default class NetworkMap extends Vue {
	// @Prop(Array) private alteri!: Array<Alter>;
	@Prop(Array) private alteri!: Array<Alter2>;

	constructor() {
		super();
	}

	// x(distance: number, angle: number): number {
	//     return distance * Math.cos(angle * Math.PI/180)
	// }

	get alteriMarks(): Array<AlteriMark> {
		console.log("in computed alteri marks");
		const buffer: Array<AlteriMark> = [];
		this.alteri.forEach((el) => {
			console.log("alter: " + el.name);
			buffer.push({
				d: el,
				x: el.distance * Math.cos((el.angle * Math.PI) / 180),
				y: -1 * el.distance * Math.sin((el.angle * Math.PI) / 180),
			});
		});
		// first draw marks further away from center to avoid overplotting
		return buffer.sort((a, b) => b.d.distance - a.d.distance);
	}
}
</script>

<style scoped>
text {
	font-size: 5px;
}
circle.horizon {
	fill: none;
	stroke: lightgray;
	stroke-width: 1;
}
line.axis {
	stroke: lightgray;
	stroke-width: 1;
}
line {
	stroke: lightgray;
	stroke-width: 0.5;
}
</style>
