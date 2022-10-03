<template>
  <g v-for="mark in marks" :key="mark.d.id">
    <rect
      style="fill: white"
      class="toolhover"
      :markid="mark.d.id"
      :x="getXPos(mark)"
      :y="mark.y < 0 ? mark.y - 34.5 : mark.y - 30.5"
      :rx="2.5"
      :ry="2.5"
      :rect-anchor="mark.x < 0 ? 'end' : 'start'"
      :dx="mark.x < 0 ? -3 : 3"
      :dy="mark.y < 0 ? -15 : -11"
      :width="calcWidth(mark)"
      :height="30"
    ></rect>
    <text
      id="div_template"
      class="text"
      v-if="names && text"
      vector-effect="non-scaling-stroke"
      :x="mark.x"
      :y="mark.y"
      :text-anchor="mark.x < 0 ? 'end' : 'start'"
      :dx="mark.x < 0 ? -3 : 3"
      :dy="mark.y < 0 ? -1 : 4"
    >
      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="mark.y < 0 ? -25 : -20"
      >
        {{ mark.d.name }}
      </tspan>
      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="mark.y < 0 ? -20 : -15"
      >
        {{
          mark.d.role < maxWordLength
            ? mark.d.role
            : mark.d.role.substring(0, maxWordLength) + "..."
        }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="mark.y < 0 ? -15 : -10"
      >
        {{ mark.d.age }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="mark.y < 0 ? -10 : -5"
      >
        {{
          mark.d.note < maxWordLength
            ? mark.d.note
            : mark.d.note.substring(0, maxWordLength) + "..."
        }}
      </tspan>
    </text>
  </g>
</template>
<script>
export default {
  props: {
    marks: Array,
    text: Boolean,
    names: Boolean,
  },
  data() {
    return { maxWordLength: 20, offset: 2.5 };
  },
  methods: {
    getXPos(mark) {
      const width = this.calcWidth(mark) + this.offset;
      const pos = mark.x < 0 ? mark.x - width : mark.x + this.offset;
      return pos;
    },
    calcWidth(mark) {
      let width =
        mark.d.role.length < mark.d.name.length
          ? mark.d.name.length * this.offset
          : mark.d.role.length * this.offset;
      if (width > this.maxWordLength * this.offset)
        width = this.maxWordLength * this.offset;
      return width;
    },
  },
};
</script>
<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

text {
  font-family: $family-primary;
  font-size: 4px;
}

.toolhover {
  display: none;
}

.rect {
  fill: #0c2c78;
}

.toolhover-active {
  display: block;
  position: absolute;
}

.tooltip {
  overflow-wrap: break-word;
  white-space: pre-line;
  hyphens: none;
  width: 10px;
  display: flex;
  background-color: red;
  position: absolute;
}

.text {
  display: block;
  width: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.textbg {
  stroke: white;
  stroke-width: 3;
}
</style>
