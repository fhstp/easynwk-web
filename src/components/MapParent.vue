<template>
	<div>
		<ul>
			<li v-for="cur in alteri" :key="cur.id">
				<b>{{ cur.name }}</b> {{ cur.angle }}, {{ cur.distance }}
			</li>
			<button @click="addRandomContact()">Add contact</button>
		</ul>
        <NetworkMap v-bind:alteri=alteri @map-click=mapclick />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NetworkMap from "@/components/NetworkMap.vue";

import { Alter2 } from '@/data/Alter.ts';

@Component({
  components: {
    NetworkMap
  }
})
export default class MapParent extends Vue {
	private ego: string;
	private alteri: Array<Alter2>;

	constructor() {
		super();
		this.ego = "Alex";
		this.alteri = [
            new Alter2("Max", 30, 20),
			new Alter2("Klaus", 150, 90),
			new Alter2("Julia", 350, 50)
		];
	}

	addRandomContact() {
		this.alteri.push(
            new Alter2("Neu",
			Math.round(Math.random() * 360),
            Math.round(Math.random() * 100)
        ));
	}

	mapclick(coords: number[]) {
		console.log("map click in parent comp: " + coords);
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
