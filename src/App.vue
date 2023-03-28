<script setup>
import { data } from './store.js';
import toolbox from './toolbox.js';
const state = data();
	
let tb = state.currentTb;
let tool = toolbox();
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Main Vue component that includes the Blockly component.
 * @author dcoodien@google.com (Dylan Coodien)
 */

const ChangeTB = () => {
	tool = toolbox(state.toolboxExt);
	if(state.currentTb == 0){state.currentTb++}else{state.currentTb=0};
	state.workspace.updateToolbox(tool[state.currentTb])
	state.workspace.getFlyout().hide()
}

import * as Block from "blockly/core";
import {javascriptGenerator} from 'blockly/javascript';
	
let Blockly = Object.create(Block);
Blockly.JS = javascriptGenerator;

import { ScrollBlockDragger, ScrollMetricsManager} from '@blockly/plugin-scroll-options';
	
import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import NavBarComponent from "./components/NavBar/NavBar.vue";
import "./blocks/stocks";
import "./blocks/test";

//import "./blocks/fakeBlock";

Blockly.Blocks["swapTB"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Empty block to swap Toolbox");
    this.setColour(230);
		ChangeTB();
  }
};

//import BlocklyJS from "blockly/javascript";

const foo = ref();
const code = ref();
const options = {
  media: "media/",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
	plugins: {
      // These are both required.
      'blockDragger': ScrollBlockDragger,
      'metricsManager': ScrollMetricsManager,
    },
	move: {
    wheel: true, // Required for wheel scroll to work.
  },
  toolbox: tool[tb],
};
	
const showCode = () => (code.value = Blockly.JS.workspaceToCode(foo.value.workspace));
</script>

<template>
  <div id="app">
		<NavBarComponent id="navbar"></NavBarComponent>
    <BlocklyComponent id="blockly2" :options="options" ref="foo"></BlocklyComponent>
    <p id="code">
      <button v-on:click="showCode()">Show JavaScript</button>
			<button v-on:click="ChangeTB()">Change TB</button>
      <pre v-html="code"></pre>
    </p>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}

#code {
  position: absolute;
  right: 0;
  background-color: beige;
	position: absolute;
  width: 25%;
  height: calc(100% - 56px);
}

#blockly2 {
  position: absolute;
  width: 75%;
  height: calc(100% - 56px);
}
</style>
