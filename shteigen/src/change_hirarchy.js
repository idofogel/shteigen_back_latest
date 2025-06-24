import React,{ useRef,useState, useEffect, useContext,useCallback,useMemo } from 'react';
import NodeItems from './nodeitems';
import PresentedNodes from './present_notes';
import ArchGroups from './archgroup';
import ArchItems from './architems';
import Archmodal from './archmodal';
import saveToNodes from './save_to_nodes';
import ThemeContext from './ThemeContext';
import server_url from './server_url';

const MemHir = () => {
    const [nodes,setNodes] = useState(NodeItems);
    const [archs,setArches] = useState(ArchItems);
    const [open_modl,openModal] = useState(false);
    const [srcnd,setSourceNode] = useState(0);
    const [long_text,setLongText] = useState({});
    const fir_item = useRef(0);
    const sec_item = useRef(0);
    const [cncpt,setCncpt] = useState(false);
    const [scndcncpt,setScndscndCncpt] = useState(false);
    const inRef = useRef(0);
    const parRef = useRef(null);
    const {theme,setTheme} = useContext(ThemeContext);
    const NodesListMemoize = useMemo(()=>{
        return (nodes.map((item, index) => (
          <div key={item.id_num} onClick={() => {openMdl();setSourceNode((a)=> a=item.id);}} className="node-list-item" style={{marginTop:'3px'}}>{item.name}</div>
                )));
    },[nodes]);
    let maintheme = theme;//changed the context to const in order to keep theme context out of the dependencies list
    
    let chosen_module = localStorage.getItem('chosen_module');
    chosen_module = parseInt(chosen_module);
        if(chosen_module !== maintheme){
          maintheme = chosen_module;
          setTheme(maintheme);
        }
    useEffect(() => {
        console.log('call nodes_of_module');
        
        fetch(server_url+'/nodes_of_module?module='+maintheme)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            var new_nodes = [],new_archs = [];
            var tres=0;
            for(tres=0; tres < data['archs'].length; tres++){
              new_archs.push({name: data['archs'][tres].caption,id: data['archs'][tres].id_num,from: data['archs'][tres].from,to: data['archs'][tres].to,module:data['archs'][tres].module});
            }
            var p_heights = {};
            var change_const,push_node_right;
            tres=0;
            for(tres=0; tres < data['nodes'].length; tres++){
                var node_obj = data['nodes'][tres];
                var level_key = parseInt(node_obj.level/100)*100;
              if(p_heights[level_key] === undefined)
                p_heights[level_key] = 1;
              else
                p_heights[level_key]++;
            
              change_const = parseInt(Math.random()*10);
              push_node_right = (parseInt(node_obj.level/200) % 2 ===0) ? 100 : 0;
              new_nodes.push({name: node_obj.caption,id: node_obj.id_num,placey:(node_obj.level+(change_const*3)),placex:(p_heights[level_key]*200+push_node_right),module:node_obj.module,txt:node_obj.content});
            }
            console.log('new_nodes');
            console.log(new_nodes);
            console.log('new_archs');
            console.log(new_archs);

            setNodes(new_nodes);
            setArches(new_archs);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }, [maintheme]);
    const addItemToList = (event) => {
        if(event.keyCode === 13){
            var tres = 0;
            for(var ite=0; ite < nodes.length; ite++){
                if(nodes[ite].placex > tres)
                    tres = nodes[ite].placex;
            }
            var new_node = {id:(nodes.length+1),name:inRef.current.value,placex:(tres+200),placey:200, module:theme};
            if(nodes.length > 0){
              console.log('setNodes 1');
                setNodes((prevItems) => [...prevItems, new_node]);
            } else {
              console.log('setNodes 2');
                setNodes([new_node]);
            }
            saveToNodes('add_remove',{'nodestoadd':[new_node]});
            inRef.current.value = "";
        }
    }
    const toggleNodes = useCallback(() => {
      if(parRef.current === null) return;
        if((parRef.current.getElementsByTagName('div')[0].getBoundingClientRect().top - parRef.current.getBoundingClientRect().top) > 5)
            return;
        var pos_neg = 5;
            parRef.current.getElementsByTagName('div')[0].style.marginTop = (parseInt(parRef.current.getElementsByTagName('div')[0].style.marginTop.replace('px',''))+pos_neg)+'px';
        },[])
    const toggleNodesDown = useCallback(() => {
      if(parRef.current === null) return;
        var pos_neg = -5;
            parRef.current.getElementsByTagName('div')[0].style.marginTop = (parseInt(parRef.current.getElementsByTagName('div')[0].style.marginTop.replace('px',''))+pos_neg)+'px';
    },[])
    const openMdl = () => {
        openModal(true);
    }
    const changeLevelOfNode = (node_id,place_x,place_y) => {
      for(var itrya = 0; itrya<nodes.length; itrya++){
        let nde = nodes[itrya];
        if(nde.id === node_id){
          nde.placex = place_x;
          nodes[itrya].placex = place_x;
          nde.placey = place_y;
          nodes[itrya].placey = place_y;
          console.log('update_node in changeLevelOfNode change_hir 122');
          console.log(nde);
          saveToNodes('update_node',{'update_node':{id_num:nde.id,name:nde.name,placex:nde.placex,placey:nde.placey, module:nde.module,txt:nde.txt}});
          const updated = nodes.map(item =>
  item.id === node_id
    ? { ...item, placex: place_x, placey: place_y }
    : item
);
  setNodes(updated);
          break;
        }

      }
    }
    const closeMdl = () => {
        openModal(false);
    }
    const setConcept = () => {
      setCncpt(!cncpt);
    }
    const setSecondConcept = () => {
      setScndscndCncpt(!scndcncpt);
    }
    const setSecondItem = (idnum) => {
      sec_item.current = idnum;
    }
    const setArchesitem = (idnum) => {
      fir_item.current = idnum;
    }

    const recurseBFS = () => {
      //create a json of nodes - for each node get the path
      let nodes_paths = {};
      unColorArchs();
      if(fir_item.current === sec_item.current) return;
      let nodes_archs = {};
      nodes_paths[fir_item.current+""] = fir_item.current;
      // let visited = [];
      //mark all nodes and the nodes they are connected to
      for(var itr_archs = 0;itr_archs < archs.length;itr_archs++){
        if(nodes_archs[archs[itr_archs].from] === undefined){
          nodes_archs[archs[itr_archs].from] = [archs[itr_archs].to];
        } else {
          if(!nodes_archs[archs[itr_archs].from].includes(archs[itr_archs].to)){
            nodes_archs[archs[itr_archs].from].push(archs[itr_archs].to);
          }
        }
        if(nodes_archs[archs[itr_archs].to] === undefined){
          nodes_archs[archs[itr_archs].to] = [archs[itr_archs].from];
        } else {
          if(!nodes_archs[archs[itr_archs].to].includes(archs[itr_archs].from)){
            nodes_archs[archs[itr_archs].to].push(archs[itr_archs].from);
          }
        }
      } 
      //the path from the first node to every node
      nodes_paths[fir_item.current+""] = [fir_item.current];
      //all the nodes connected to the first node
      let next_nodes = nodes_archs[fir_item.current];
      //the parents for every node. one parent per node
      let node_parents = {};
      let chosen_nodes = {};
      chosen_nodes[fir_item.current] = true;
      if(next_nodes === undefined) return;
      //iterate over the first batch
      for(var iter_next_nodes=0;iter_next_nodes<next_nodes.length;iter_next_nodes++){
        node_parents[next_nodes[iter_next_nodes]] = fir_item.current;
      }
      
      
      //now that we have a json where every key is a node and its value is the array off the nodes attached to it:
      for(var itr = 0;itr < nodes.length;itr++){
        let next_next_nodex = [];
        for(iter_next_nodes=0;iter_next_nodes<next_nodes.length;iter_next_nodes++){
          if(chosen_nodes[next_nodes[iter_next_nodes]] === true) continue;
          chosen_nodes[next_nodes[iter_next_nodes]] = true;// prevent repeating to visited nodes
          // set the current Path
          nodes_paths[next_nodes[iter_next_nodes]] = [];
          //get the path of parent and add new node
          
          for(var iter_node_path = 0; iter_node_path < nodes_paths[node_parents[next_nodes[iter_next_nodes]]].length;iter_node_path++){
            nodes_paths[next_nodes[iter_next_nodes]].push(nodes_paths[node_parents[next_nodes[iter_next_nodes]]][iter_node_path]);
          }
          nodes_paths[next_nodes[iter_next_nodes]].push(next_nodes[iter_next_nodes]);
          for(var itr_nxt_nds = 0;itr_nxt_nds < nodes_archs[next_nodes[iter_next_nodes]].length;itr_nxt_nds++){
            if(chosen_nodes[nodes_archs[next_nodes[iter_next_nodes]][itr_nxt_nds]] !== true){
              if(node_parents[nodes_archs[next_nodes[iter_next_nodes]][itr_nxt_nds]] === undefined)
                node_parents[nodes_archs[next_nodes[iter_next_nodes]][itr_nxt_nds]] = next_nodes[iter_next_nodes];
            
              next_next_nodex.push(nodes_archs[next_nodes[iter_next_nodes]][itr_nxt_nds]);
            }
          }
          // nodes_paths.push();
          //first get the parents
        }
        next_nodes = next_next_nodex;

      }
      //find which path is relevant
      colorArchs(nodes_paths);
      setArches(archs);
      return;
    }
    const unColorArchs = () =>{
      for(var iter_over_archs = 0;iter_over_archs < archs.length;iter_over_archs++){
        archs[iter_over_archs].color = "";
      }
    }
    //a function that colors the archs of the path
    const colorArchs = (nodes_paths) =>{
      for(var key in nodes_paths){
        if(nodes_paths[key].includes(fir_item.current) && nodes_paths[key].includes(sec_item.current)){
          let startpainting = false;
          for(var iter_over_path = 0;iter_over_path< nodes_paths[key].length-1; iter_over_path++){
            if(nodes_paths[key][iter_over_path] === fir_item.current) startpainting = true;
            if(startpainting === true){
              for(var iter_over_archs = 0; iter_over_archs < archs.length; iter_over_archs++){
                if(((archs[iter_over_archs].from === nodes_paths[key][iter_over_path] && archs[iter_over_archs].to === nodes_paths[key][iter_over_path+1]) || (archs[iter_over_archs].to === nodes_paths[key][iter_over_path] && archs[iter_over_archs].from === nodes_paths[key][iter_over_path+1])) && startpainting === true){
                  archs[iter_over_archs].color = "red";
                  if(nodes_paths[key][iter_over_path] === sec_item.current || nodes_paths[key][iter_over_path+1] === sec_item.current) startpainting = false;
                }
              }
            }
            if(nodes_paths[key][iter_over_path] === sec_item.current) startpainting = false;
          }
        }
      }
    }

    const clearPath = () => {
      for(var iter_red=0;iter_red<archs.length;iter_red++){
        archs[iter_red].color = undefined;
      }
    }
    const startBFS = () => {
      clearPath();
      // var new_jsons = bFSRecurse([fir_item.current]);
      recurseBFS();
      setArches(archs);
    }
    
    return (<div className="App">
        <input ref={inRef} type='text' placeholder='הוסף מושג' onKeyDown={addItemToList}/>

        <PresentedNodes items={nodes} callgroup={openMdl} levelchanger={changeLevelOfNode} changeNodeId={setSourceNode} />
        <ArchGroups archs={archs} nodes={nodes} module={theme} setarchs={setArches}/>
       
        <div className="concept-headline">
            הוסף חיבור בין מושגים
        </div>
        
        <div onClick={toggleNodes} className="toggle-up"><span onClick={toggleNodes} style={{backgroundRepeat: 'no-repeat',left: '75px',backgroundPosition: 'center',backgroundSize: '21px 16px',zIndex: 2,position: 'absolute',width: '20px',height: '20px',backgroundImage: `url(${require('./arrow_up.png')})`}}></span></div>
        <div ref={parRef} className="node-list">
        {
            
           NodesListMemoize
            
            
        }
        {open_modl && <Archmodal long_text={long_text} set_long_text={setLongText} source_node={srcnd} cls_mdl={closeMdl} nodes={nodes} archs={archs} setarchs={setArches} setKod={setNodes} mdl={theme} />}
        </div>
        <div onClick={toggleNodesDown} className="toggle-down"><span onClick={toggleNodesDown} style={{backgroundRepeat: 'no-repeat',left: '75px',backgroundPosition: 'center',backgroundSize: '21px 16px',zIndex: 2,position: 'absolute',width: '20px',height: '20px',backgroundImage: `url(${require('./arrow_down.png')})`}}></span></div>
        <div className="choose-course">בחר מסלול ממושג למושג </div>
        <div onClick={setConcept} className="choose-course" style={{top:'254px'}}>מושג 1</div><div className="choose-source-fir" >
        { cncpt && nodes.map((item, index) => (
                <div key={item.id} onClick={() => {setArchesitem(item.id);setConcept();}} className="node-list-item" style={{marginTop:'3px'}}>{item.name}</div>
                ))
                }
        </div>
        <div onClick={setSecondConcept} className="choose-course" style={{top:'285px'}}>מושג 2</div><div className="choose-source-fir">{scndcncpt && 
        nodes.map((item, index) => (
          <div key={item.id_num} onClick={() => {setSecondItem(item.id);startBFS();setSecondConcept();}} className="node-list-item" style={{marginTop:'3px'}}>{item.name}</div>
          ))}
          </div>
    </div>);
}
export default MemHir;