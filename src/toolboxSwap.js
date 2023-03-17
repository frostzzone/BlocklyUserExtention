import toolbox from './toolbox.js';
let tb = 0;
let tool = toolbox();

export const toolSwap = (workspace) => {
	if(tb == 0){tb++}else{tb=0};
	workspace.updateToolbox(tool[tb]);
	workspace.getFlyout().hide();
	return []
}