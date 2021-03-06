﻿/* 
 * DAVID BELAIS 2010 DAVID@DISSENTGRAPHICS.COM
 * EXTENSIBLE : A javascript Framework for extending Flash.
 */
 
(function(dom){
	function Extensible(options){
		BridgeTalk.apply(this,[]);
		this._modules=[];
		this.warnings=true;
		this.log=undefined;
		for(var o in options){
			this[o]=options[o];
		}
		this.progressbar=undefined;
		this.dir=fl.scriptURI.replace(/\/[^\/]*?$/g,"");
		if(FLfile.exists(this.dir+'/.builders')){
			var xml=new XML(FLfile.read(this.dir+'/.builders'));
			var fileName=fl.scriptURI.split('/').pop();
			var scriptXML;
			try{
				scriptXML=xml.script.(@file==fileName);
			}catch(e){}
			if(scriptXML && scriptXML.length()){
				this.dev=true;
				this.builderURI=String(scriptXML[0].@builder);
			}			
		}
		return this;
	}
	Extensible.prototype={
		__proto__:BridgeTalk,
		extend:function(obj){
			for(var n in obj){
				if(obj.hasOwnProperty(n)){
					this[n]=obj[n];
				}
			}
		},
		load:function(mods,force){
			if(force){this._modules=[];}
			if(mods && mods.length){
				for(var i=0;i<mods.length;i++){
					if(force || this._modules.indexOf[mods[i]]<0){
						var file=this.dir+"/"+mods[i]+".jsfl";
						if(file!=fl.scriptURI && FLfile.exists(file)){
							try{
								fl.runScript(file);
								this.modules.push(mods[i]);
							}catch(e){
								this.warn("Problem loading "+mods[i]);
								break;
							}
						}
					}
				}
			}
			return this;
		},
		get doc(){
			try{
				return fl.getDocumentDOM();
			}catch(e){
				return null;	
			}
		},
		set doc(){},
		get timeline(){
			return new this.Timeline(this.doc.getTimeline());
		},
		set timeline(){},
		get timelines(){
			var timelines=new this.Array();
			var t=new this.Array(this.doc.timelines);
			for(var i=0;i<t.length;i++){
				timelines.push(new this.Timeline(t[i]));
			}
			return timelines;
		},
		set timelines(){},
		get frame(){
			return this.timeline.currentFrame;
		},
		set frame(){},
		get layer(){
			return this.timeline.currentLayer;
		},
		set layer(){},
		get lib(){
			return new this.Library(this.doc.library);
		},
		set lib(){},
		get sel(){
			return(new this.Selection(this.doc.selection));
		},
		set sel(s){
			var sel=this.sel;
			if(s.type!==extensible.Selection){
				s=new this.Selection(s);
			}
			var removeSel=s.length==0?sel:(sel.length==0?[]:sel.remove(s));
			var addSel=s.length==0?[]:(sel.length==0?s:s.remove(sel));
			for(i=0;i<removeSel.length;i++){
				try{
					removeSel[i].selected=false;
				}catch(e){
					this.warn('Error');
				}
			}
			for(i=0;i<addSel.length;i++){
				try{
					addSel[i].selected=true;
				}catch(e){
					this.warn('Error');
				}
			}
		},
		get viewMatrix(){
			return new this.Matrix(this.doc.viewMatrix);
		},
		set viewMatrix(){},
		get publishProfile(){
			return new XML(this.doc.exportPublishProfileString());
		},
		set publishProfile(s){},
		get includeHiddenLayers(){
			return this.publishProfile.PublishFlashProperties.InvisibleLayer.valueOf()==1;
		},
		set includeHiddenLayers(s){
			this.publishProfile.PublishFlashProperties.InvisibleLayer=s?1:0;			
		},
		get flashVersion(){
			return Number((/\d*\d/.exec(fl.version))[0]);		
		},
		set flashVersion(){
			return;
		},
		swfPanel:function(name){
			if(!name){
				return null;	
			}
			for(var i=0;i<fl.swfPanels.length;i++){
				if(fl.swfPanels[i].name==name){
					return fl.swfPanels[i];
				}
			}
			return null;
		},
		get modules(){
			return this._modules;
		},
		ping:function(){
			return true;
		},
		set modules(m){
			this.load(m);
		},
		startLog:function(options){
			this.log=new this.Log(options);
		},
		stopLog:function(){
			if(this.log){
				this.log.stop();
				delete this.log;
			}
		},
		warn:function(warning){
			var message='Warning: '+warning;
			if(this.warnings){
				fl.trace(message);
			}
			if(this.log){
				this.log.append(message);
			}
		},
		message:function(message){
			fl.trace(message);	
		}
	};
	dom.extensible=new Extensible({
		builderURI:(dom.extensible?dom.extensible.builderURI:undefined)
	});
})(this);
extensible.load(
	[
		'String',
		'Object',
		'Array',
		'Matrix',
		'Color',
		'HalfEdge',
		'Point',
		'Curve',
		'Vertex',
		'Edge',
		'Fill',
		'Stroke',
		'Contour',
		'Element',
		'Shape',
		'OvalObject',
		'RectangleObject',
		'Instance',
		'SymbolInstance',
		'BitmapInstance',
		'Text',
		'TLFText',
		'Frame',
		'Layer',
		'Timeline',
		'Selection',
		'LibraryItem',
		'BitmapItem',
		'FolderItem',
		'SymbolItem',
		'Library',
		'Clipboard',
		'Math',
		'Task',
		'SVG',
		'Log',
		'Que',
		'Timer',
		'Function'
	],
	true
);




