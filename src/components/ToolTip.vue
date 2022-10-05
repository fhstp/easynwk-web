<template>
  <g v-for="mark in marks" :key="mark.d.id">
    <rect
      style="fill: white"
      class="toolhover"
      :markid="mark.d.id"
      :x="getXPos(mark)"
      :y="getYPos(mark)"
      :rx="2.5"
      :ry="2.5"
      :rect-anchor="mark.x < 0 ? 'end' : 'start'"
      :dx="mark.x < 0 ? -3 : 3"
      :dy="mark.y < 0 ? -15 : -11"
      :width="calcWidth(mark)"
      :height="calcHeight(mark)"
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
        class="toolhover name"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('name', mark)"
      >
        {{
          mark.d.name.length < maxWordLength
            ? mark.d.name
            : mark.d.name.substring(0, maxWordLength + 1) + "..."
        }}
      </tspan>
      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('role', mark)"
      >
        {{
          mark.d.role.length < maxWordLength
            ? "Rolle: " + mark.d.role
            : "Rolle: " + mark.d.role.substring(0, maxWordLength + 1) + "..."
        }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('gender', mark)"
        v-if="mark.d.currentGender != 'nicht festgelegt'"
      >
        {{
          mark.d.human
            ? "Geschlecht: " + mark.d.currentGender
            : "Kategorie: " + mark.d.currentGender
        }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('age', mark)"
        v-if="mark.d.age.length > 0"
      >
        {{ "Alter: " + mark.d.age }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('note1', mark)"
        v-if="mark.d.note.length > 0"
      >
        {{
          mark.d.note.length < maxWordLength
            ? "Notiz: " + mark.d.note
            : "Notiz: " + mark.d.note.substring(0, maxWordLength + 1) + "-"
        }}
      </tspan>

      <tspan
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x"
        :y="mark.y"
        :dx="mark.x < 0 ? -4 : 4"
        :dy="getTextYPos('note2', mark)"
      >
        {{
          mark.d.note.substring(maxWordLength + 1, maxWordLength * 2) + "..."
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
    return { maxWordLength: 20, offset: 2.5, defaultHeight: 15 };
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
      if (width > this.maxWordLength * this.offset || mark.d.note.length > 0)
        width = this.maxWordLength * this.offset;
      return width;
    },
    getTextYPos(attribute, mark) {
      const attributesNotNull = {
        note2: mark.d.note.length > this.maxWordLength,
        note1: mark.d.note.length > 0,
        age: mark.d.age.length > 0,
        gender: mark.d.currentGender != "nicht festgelegt",
        role: true,
        name: true,
      };
      let startPosition = mark.y < 0 ? -5 : 0;
      for (const attr in attributesNotNull) {
        if (attributesNotNull[attr]) {
          startPosition -= 5;
          if (attr == attribute) {
            return startPosition;
          }
        }
      }
      return startPosition;
    },
    calcHeight(mark) {
      let heightText = this.getTextYPos(null, mark) * -1;
      if (heightText < this.defaultHeight) {
        return this.defaultHeight;
      }
      //heightText -= this.defaultHeight;
      return heightText + 5;
    },
    getYPos(mark) {
      //mark.y < 0 ? mark.y - 34.5 : mark.y - 30.5
      const defaultPos = mark.y < 0 ? mark.y - 4.5 : mark.y;
      console.log(
        mark.d.currentGender != undefined ||
          mark.d.currentGender != "nicht festgelegt"
      );
      return defaultPos - this.calcHeight(mark);
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

.name {
  font-weight: bold;
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
