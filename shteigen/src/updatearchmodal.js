import { useEffect } from 'react';
/**
 * 
 * a modal that updates or deletes an arch
 */
const Updatearchmodal = (props) =>{
    useEffect(() => {
        for(var itera = 0; itera < props.archs.length; itera++){
            if(props.archs[itera].id === props.arch_to_update){
                document.getElementsByClassName('arch-input')[0].value = props.archs[itera].name;
            }
        }
        return () => {
          console.log("Component will unmount!");
        };
      }, [props.archs,props.arch_to_update]);
    return (<div className='modal-background'><div className="modal-itself"><input className="arch-input" onKeyDown={(event)=>{props.changeArchName(event)}} placeholder="arch name" type="text" /><span onClick={() => {props.openArchModal(false);}} className='success-x'>X</span><button style={{bottom:'23px'}} onClick={props.deleteArch} className="delete-arch">delete</button></div></div>);
}
export default Updatearchmodal;