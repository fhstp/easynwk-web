<template>
	<div>
		<ul>
			<li v-for="cur in contacts" :key="cur.id">
				<b>{{ cur.id }}</b> {{ cur.angle }}, {{ cur.distance }}
			</li>
			<button @click="addRandomContact()">Add contact</button>
		</ul>
		<svg width="600" height="600">
			<circle r="5" cx="23" cy="7" />
		</svg>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Contact {
	id: string;
	angle: number;
	distance: number;
}

@Component
export default class MapParent extends Vue {
	private ego: string;
	private contacts: Array<Contact>;

	constructor() {
		super();
		this.ego = "Alex";
		this.contacts = [
			{ id: "Max", angle: 30, distance: 20 },
			{ id: "Klaus", angle: 150, distance: 90 },
			{ id: "Julia", angle: 350, distance: 50 },
		];
	}

	addRandomContact() {
		this.contacts.push({
			id: "Neu",
			angle: Math.round(Math.random() * 360),
			distance: Math.round(Math.random() * 100),
		});
	}
}
</script>

<style>
ul {
	width: 200px;
}
svg {
	background: aliceblue;
	border: 1px solid red;
}
</style>
