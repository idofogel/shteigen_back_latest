import React,{ useState,useRef,useEffect } from 'react';
import saveToNodes from './save_to_nodes';
import server_url from './server_url';
/*modal that allows you to:
    1. update text of node
    2. add new connection/arch from node to node
    3.remove existing arch
*/
const Archmodal = (props) => {
    const [new_arch_text_open,setNewArchTextOpen] = useState(false);
    const [to_id,setToId] = useState(null);
    const [newcommsntsaved,setComment] = useState(false);
    const text_obj = useRef("");
    const arch_ref = useRef(0);
    console.log(props.source_node);
    var setting_node = [],archs_of_nodes={};
    var trew=0,trewq=0;
    for(trewq=0; trewq < props.nodes.length; trewq++){
        if(props.source_node !== props.nodes[trewq].id){
            setting_node.push(props.nodes[trewq]);
        } else {
            trew = trewq;
        }
    }
    trewq=0;
    for(trewq=0; trewq < props.archs.length; trewq++){
        if(props.archs[trewq].from === props.source_node){
            archs_of_nodes[props.archs[trewq].to] = true;
        } else {
            if(props.archs[trewq].to === props.source_node){
                archs_of_nodes[props.archs[trewq].from] = true;
            }
        }
    }
    useEffect(() => {
        for(var itera = 0; itera < props.nodes.length; itera++){
            if(props.nodes[itera].id === props.source_node){
                document.getElementById('name_val').value = props.nodes[itera].name;
            }
        }
      
        return () => {
          console.log("Component will unmount!");
        };
      }, [props.nodes,props.source_node]);







      const saveAComment = (new_path,activity_key_and_new_node) => {
        console.log('%csaveAComment','font-size:18px;color:red;');
    fetch(server_url+'/'+new_path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity_key_and_new_node)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        try {
          if(data[0].status === "success"){
            setComment(true);
          }
        } catch(e){}
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }





    const saveLongText = async (event) => {
        var n_nodes = [],didsaved = false;
        for(var itera = 0; itera < props.nodes.length;itera++){
            n_nodes.push(props.nodes[itera]);
            if(props.nodes[itera].id === props.source_node){
                if(event.currentTarget === null || event.currentTarget.parentElement.getElementsByTagName('textarea')[0] === null) return;
                var cur_text = event.currentTarget.parentElement.getElementsByTagName('textarea')[0].value;
                n_nodes[itera].txt = cur_text;
                n_nodes[itera].name = document.getElementById('name_val').value;
                          console.log('update_node in saveLongText archmodal 94');
          console.log(n_nodes[itera]);
                didsaved = await saveAComment('update_node',{'update_node':{id_num:n_nodes[itera].id,name:n_nodes[itera].name,placex:n_nodes[itera].placex,placey:n_nodes[itera].placey, module:props.mdl,txt:cur_text}});
            }
            
        }
        props.setKod(n_nodes);
        console.log('didsaved');
        console.log(didsaved);
    }
    const removeArch = (id_s) => {
        var archs_to_save = []
        
;        for(var rew=0;rew<props.archs.length;rew++){
            if(props.archs[rew].from !== id_s && props.archs[rew].to !== id_s){
                archs_to_save.push(props.archs[rew]);
            }
        }
        props.setarchs(archs_to_save);
    }
    const deleteNode = (event) => {
        var new_nodes = [];
        for(var rew=0;rew<props.nodes.length;rew++){
            console.log('rops.nodes[rew].id: '+props.nodes[rew].id+' cur node: '+props.source_node);
            if(props.nodes[rew].id!==props.source_node){
                const itm_to_rmv = props.nodes[rew];
                props.setKod((prevItems) => prevItems.filter(item => item !== itm_to_rmv));
                new_nodes.push(props.nodes[rew]);
            }
        }
        removeArch(props.source_node);
        props.setKod(new_nodes);

        
        fetch(server_url+'/add_remove', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nodestormv: [props.source_node],module:props.mdl
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log(response);
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
       
        props.cls_mdl();
    }
    const removeItem = (itemToRemove) => {
        props.setarchs((prevItems) => prevItems.filter(item => item !== itemToRemove));
    };
    const chooseNode = (itm_id) => {
        if(archs_of_nodes[itm_id]){
            //if arch already exists- erase it
            for(var iytr=0; iytr < props.archs.length; iytr++){
                if((props.archs[iytr].from === itm_id && props.archs[iytr].to === props.source_node) || (props.archs[iytr].to === itm_id && props.archs[iytr].from === props.source_node)){
                    removeItem(props.archs[iytr]);
                }
            }
        } else {
            // show input to write arch name
            setNewArchTextOpen(true);
            setToId(itm_id);
        }
    }
    /**
     * 
     * change name of node in database and the nodes state
     */
    const changeName = (event) => {
        if(event.keyCode === 13){
            var n_nodes = [];
            for(var itera = 0; itera < props.nodes.length;itera++){
                n_nodes.push(props.nodes[itera]);
                if(props.nodes[itera].id === props.source_node){
                    var cur_text = event.currentTarget.value;
                    n_nodes[itera].name = cur_text;
                    saveToNodes('update_node',{'update_node':{id_num:n_nodes[itera].id,name:n_nodes[itera].name,placex:n_nodes[itera].placex,placey:n_nodes[itera].placey, module:props.mdl,txt:n_nodes[itera].txt}});
                }
            }
            props.setKod(n_nodes);
        }
    }
    /**
     * 
     * a function that validates the id of the arch is unique
     */
    const findHighestArchId = (new_it_candidate) => {
        for(var iter_on_archs = 0;iter_on_archs < props.archs.length;iter_on_archs++){
            if(new_it_candidate<=props.archs[iter_on_archs].id)
                new_it_candidate = props.archs[iter_on_archs].id+1;
        }
        return new_it_candidate;
    }
    /**
     * a function that creates a new arch and a set of node + 2 arches
     */
    const createNewArch = (event) => {
        if(event.keyCode === 13){
            // var new_arch_id = props.archs.length+1;
            let new_new_id = (props.archs.length+1);
            new_new_id = findHighestArchId(new_new_id);
            props.setarchs((prevItems) => [...prevItems, {id:new_new_id,name:arch_ref.current.value,from:props.source_node,to:to_id}]);
            // props.savetonodes('add_remove',{'archestoadd':[{id:new_arch_id,name:arch_ref.current.value,from:props.source_node,to:to_id,module:props.mdl}]});
            saveToNodes('add_remove',{'archestoadd':[{id:new_new_id,name:arch_ref.current.value,from:props.source_node,to:to_id,module:props.mdl}]});
            //add connected node
            let srcnd = 0,trgtnd=0,ndtop=0,trgttxt = "",srctxt="",tottxt="",srcndx=0,trgtndx=0;
            for(var inds=0; inds < props.nodes.length; inds++){
                var cur_prop = props.nodes[inds];
                //identify the heighest point
                if(props.nodes[inds].id === props.source_node){
                    srcnd = cur_prop.placey;
                    srctxt = cur_prop.name;
                    srcndx = cur_prop.placex;
                }
                if(props.nodes[inds].id === to_id){
                    trgtnd = cur_prop.placey;
                    trgttxt = cur_prop.name;
                    trgtndx = cur_prop.placex;
                }
            }
            var rew = 0;
            if(srcndx >= trgtndx){
                rew = trgtndx+(srcndx - trgtndx)/2;
            } else {
                rew = srcndx+(trgtndx - srcndx)/2;
            }
            tottxt = srctxt+" "+arch_ref.current.value+" "+trgttxt;
            ndtop = srcnd >= trgtnd ? srcnd : trgtnd;
            var new_id = (props.nodes.length+1);
            //create a node
            props.setKod((prevItems) => [...prevItems, {id:new_id,name:tottxt,placex:rew,placey:(ndtop+200), module:props.mdl}]);
            //save the node
            saveToNodes('add_remove',{'nodestoadd':[{id:new_id,name:tottxt,placex:rew,placey:(ndtop+200), module:props.mdl}]});
            
            //create to additional archs 
            new_new_id++;
            new_new_id = findHighestArchId(new_new_id);
            props.setarchs((prevItems) => [...prevItems, {id:new_new_id,name:tottxt,from:props.source_node,to:new_id}]);
            
            //save the arch
            saveToNodes('add_remove',{'archestoadd':[{id:new_new_id,name:tottxt,from:props.source_node,to:new_id,module:props.mdl}]});
            new_new_id++;
            new_new_id = findHighestArchId(new_new_id);
            props.setarchs((prevItems) => [...prevItems, {id:new_new_id,name:tottxt,from:to_id,to:new_id}]);
            saveToNodes('add_remove',{'archestoadd':[{id:new_new_id,name:tottxt,from:to_id,to:new_id,module:props.mdl}]});
            setNewArchTextOpen(false);
        }
    }
    return (<div className="modal-background" >
        <div className="modal-itself" key={"modal-itself"}>
            <div className="arch-nodes" >
            {
                setting_node.map((itm, index) => (
                    <div key={itm.id_num} onClick={()=>{chooseNode(itm.id);}} className="connected-node" style={{backgroundColor: archs_of_nodes[itm.id] ? 'blue' : '#8ceaee'}}>{itm.name}</div>
                ))
            }
            </div>
            <textarea ref={text_obj} >{props.nodes[trew].txt}</textarea>
            <input id="name_val" type="text" placeholder="שם המושג" onKeyDown={changeName}></input>
            <button onClick={saveLongText} style={{right:'10px'}}>שמור</button>
            <button onClick={deleteNode} style={{right:'170px'}}>מחק</button>
            {new_arch_text_open && <div className='comment-success-cover'><input ref={arch_ref} placeholder='כתוב שם של קשת' type='text' onKeyDown={createNewArch} className='comment_input' /></div>}
            {newcommsntsaved && <div className='comment-success-cover'><div className='comment-saved'>comment saved</div><span onClick={() => {setComment(false);}} className='success-x'>X</span></div>}
                
            <span onClick={props.cls_mdl} className="x-modal">X</span>
        </div>
    </div>);
 }
 export default Archmodal;