import {
	defineStore
} from 'pinia'

import * as Block from "blockly/core";
import {javascriptGenerator} from 'blockly/javascript';

let Blockly = Object.create(Block);
Blockly.JS = javascriptGenerator;

import toolbox from './toolbox.js';

export const data = defineStore('state', {
	state: () => {
		return {
			workspace: 0,
			currentTb: 0,
			extentions: [],
			toolboxExt: [],
			S4D: {
				type: {
					field_input: "field_input",
				},
				output: {
					All: null,
					String: "String",
					Boolean: "Boolean",
					Number: "Number",
					Array: "Array",
					Custom: (out)=>out,
					Multi: (out)=>{
						if(Array.isArray(out)) return out
					}
				},
				toolbox: {
					label: "label",
					block: "block",
					separator: "sep"
				}
			},
			register: (thing, extentions, S4D) => {
				let data,
					exist = false;
				try{
					data = thing.getInfo();
				} catch(err){
					data = {}
				}
				
				if(!data.id)throw new Error('No extention id specified');
				//console.log(extentions);
				for (let index = 0; index < extentions.length; ++index) {
					const item = extentions[index];
					if (item.id == data.id) exist = index;
				}
				if (exist||exist===0) {
					extentions[exist] = {
						id: data.id,
						data: thing
					}
				} else {
					extentions.push({
						id: data.id,
						data: thing
					})
				}
			}
		}
	},
	actions: {
		addExtention(thing) {
			this.register(thing, this.extentions, this.S4D)
		},
		registerToolbox(){
			let reelTb = [];
			let extentions = this.extentions;
			let S4D = this.S4D;
			let currentTb = this.currentTb;
			// get manage extention data
			for (let index = 0; index < extentions.length; ++index) {
				let toolbx = [];
				const item = extentions[index].data.getInfo();
				//console.log(item)
				// build toolbox data
				for (let j = 0; j < item.toolbox.length; ++j) {
					let it = item.toolbox[j];
					if(it.type == S4D.toolbox.label){
						toolbx.push(`<label text="${it.text||'no `text` specifed'}"></label>`)
					}
					if(it.type == S4D.toolbox.separator){
						toolbx.push(`<sep gap="${it.size||32}"></sep>`)
					}
					if(it.type == S4D.toolbox.block){
						if(!it.name)throw new Error(`Item \`${it}\` in toolbox has no name specified`)
						let dies = false;
						if(it.disabled === true || it.disabled === false){
							dies = it.disabled;
						}
						toolbx.push(`<block type="${it.name}" disabled="${dies}"></block>`)
					}
				}
				// register blocks
				for(let j = 0; j < item.blocks.length; ++j){
					let it = item.blocks[j]
					//console.log(it.block)
					let bloc = Object.create(it)
					//bloc.message0 = bloc.message
					let name = bloc.name
					let functionName = bloc.code
					delete bloc.code
					bloc = bloc.block
					bloc.message0 = bloc.message
					bloc.args0 = bloc.args || []
					//remove from object
					delete bloc.message
					delete bloc.args
					
					if(!name){
						delete extentions[index];
						throw new Error(`Block #\`${j+1} in extention \`${item.id}\` has no name specifed`)
					}
					if(!functionName){
						delete extentions[index];
						throw new Error(`Block #${j+1} in extention \`${item.id}\` has no function specifed`)
					}
					if(!bloc.message0){
						delete extentions[index];
						throw new Error(`Block #${j+1} in extention \`${item.id}\` has no message specifed`)
					}

Blockly.Blocks[name] = {
  init: function() {
    this.jsonInit(bloc);
  }
};
  console.log(Blockly.JS)
	eval(`Blockly$4.JS['${name}'] = extentions[index].data.${functionName}`)
				}
				let maxExtName = 20;
				let catName = item.category||item.id
				if (catName.length < 20) maxExtName = catName.length;
				
			reelTb.push(`<category name="${catName.substring(0, maxExtName)}" colour="${item.colour}">
		 ${toolbx.join('\n')}
		 </category>`)
				//toolbx = []
				}
			this.toolboxExt = reelTb;
			let tool = toolbox(reelTb);
			//console.log(currentTb)
			if(currentTb === 1){
				this.workspace.getFlyout().hide()
			}
			this.workspace.updateToolbox(tool[currentTb])
		}
	},
})