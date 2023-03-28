import * as Block from "blockly/core";
import {javascriptGenerator} from 'blockly/javascript';

let Blockly = Object.create(Block);
Blockly.JS = javascriptGenerator;

const FIELDS = ["color", "width"];
const TYPES = ["Colour", "Number"];
const COLOR = 60;
const TOOLTIP = "Example border object";
const HELPURL = "www.example.com";

Blockly.Blocks['border'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Border");
    this.setOutput(true, "Border");
    this.setColour(COLOR);
    this.setTooltip(TOOLTIP);
    this.setHelpUrl(HELPURL);
    this.jsonInit({"mutator": "border_mutator"});
    this.inputs_ = ["FALSE", "TRUE"];
  }
};

Blockly.Blocks['border_mutator'] = {
  init: function() {
    for (let i = 0; i < FIELDS.length; i++) {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(FIELDS[i])
        .appendField(new Blockly.FieldCheckbox(false), FIELDS[i]);
    }
    this.setColour(COLOR);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

const BORDER_MUTATOR_MIXIN = {
  connections_: Array(FIELDS.length).fill(null),

  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i] == "TRUE") {
        container.setAttribute(FIELDS[i], this.inputs_[i]);
      }
    }
    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = xmlElement.getAttribute(FIELDS[i].toLowerCase());
    }
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('border_mutator');
    for (let i = 0; i < this.inputs_.length; i++) {
      containerBlock.setFieldValue(this.inputs_[i], FIELDS[i]);
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Get check box values
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = containerBlock.getFieldValue(FIELDS[i]);
    }
    this.updateShape_();
    // Reconnect any child blocks
    for (let i = 0; i < FIELDS.length; i++) {
      if (this.getInput(FIELDS[i])) {
        Blockly.Mutator.reconnect(this.connections_[i], this, FIELDS[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    for (let i = 0; i < this.inputs_.length; i++) {
      var input = this.getInput(FIELDS[i]);
      if (input) {
        this.connections_[i] = input && input.connection.targetConnection;
      }
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function() {
    // Delete everything.
    FIELDS.forEach(element => {
        if (this.getInput(element)) {
            this.removeInput(element);
        }
    });
    // Rebuild block.
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i] == "TRUE") {
        this.appendValueInput(FIELDS[i])
          .setCheck(TYPES[i])
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(FIELDS[i]);
      }
    }
  }
};

Blockly.Extensions.registerMutator('border_mutator', BORDER_MUTATOR_MIXIN, null, [""]);