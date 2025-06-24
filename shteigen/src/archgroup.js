import React from 'react';
import {useState} from 'react';
import ArchItem from './architem';
import saveToNodes from './save_to_nodes';
import Updatearchmodal from './updatearchmodal';
/* container of archs*/
const ArchGroup = (props) => {
  const [archmodal,openArchModal] = useState(false);
  const [arch_to_update,setArchToUpdate] = useState(0);
  var arch_items = props.archs;
  var node_items = props.nodes;
    const archToNode = (from,to,md) => {
      console.log('archToNode archToNode archToNode');
        var from_node,to_node;
        for(var iter_nodes=0; iter_nodes<node_items.length; iter_nodes++){
          var tred = node_items[iter_nodes];
          if(tred.id === from){from_node = tred;}
          if(tred.id === to){to_node = tred;}
        }

        if(from_node === undefined || to_node === undefined)
          return 0;
        switch (md){
            case 1: 
                return from_node.placex;
            case 2:
                return from_node.placey;
            case 3: 
                return to_node.placex;
            case 4: 
                return to_node.placey;
            default:
              return 0;
        }
    }

    const openTheArchModal = (arch_it_to_update) =>{
      openArchModal(true);
      setArchToUpdate(arch_it_to_update);
    }
    const changeArchName = (event) =>{
       if(event.keyCode === 13){
         saveToNodes('/update_arch',{'id_num':arch_to_update,'name_to_update':event.currentTarget.value,'module':props.module});
         for(var iter_over_archs = 0; iter_over_archs < props.archs.length;iter_over_archs++){
          if(props.archs[iter_over_archs].id === arch_to_update){
            console.log('changing arch number '+arch_to_update);
            console.log('new value '+event.currentTarget.value);
            props.archs[iter_over_archs].name = event.currentTarget.value;
          }
         }
        props.setarchs(props.archs);
        event.currentTarget.value = "";
        openArchModal(false);
        }
       
    }
    const deleteArch = () =>{
        for(var iter_on_archs = 0;iter_on_archs < props.archs.length;iter_on_archs++){
          if(props.archs[iter_on_archs].id === arch_to_update){
            let arch_to_delete = props.archs[iter_on_archs];
            props.setarchs((prevItems) => prevItems.filter(item => item !== arch_to_delete));
          }
        }
      openArchModal(false);
      saveToNodes('/delete_arch',{'id_num':arch_to_update,'module':props.module});
    }
    return (<>
    {archmodal && <Updatearchmodal deleteArch={deleteArch} setarchs={props.setarchs} archs={props.archs} changeArchName={changeArchName} openArchModal={openArchModal} arch_to_update={arch_to_update} />}
    {arch_items.map((itm, indx) => (
        <ArchItem style={{cursor:'pointer'}} id_num={itm.id} key={itm.id} openthearchmodal={openTheArchModal} title={itm.name} colorize={itm.color} placex={archToNode(itm.from,itm.to,1)} placey={archToNode(itm.from,itm.to,2)} toplacex={archToNode(itm.from,itm.to,3)} toplacey={archToNode(itm.from,itm.to,4)} />
      ))
    }
    </>);
}
export default ArchGroup;