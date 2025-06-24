import React,{ useEffect, useState, useContext, useMemo, useCallback } from 'react';
import ThemeContext from './ThemeContext';
import saveToNodes from './save_to_nodes';
import { Link } from "react-router-dom";
import serverurl from './server_url';
const Splash = (props) => {
    const [modules,setModules] = useState([]);
    const {theme,setTheme} = useContext(ThemeContext);
    const [theme_set,setThemeSet] = useState(false);
    const [showDeleteNotice,setShowDeleteNotice] = useState(false);
    const [module_to_erase,setModuleToErase] = useState(0);
    useEffect(() => {
        console.log('call nodes_of_module');
        fetch(serverurl+'/get_modules')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            var new_modules = [];
            for(var rew=0;rew<data.length;rew++){
                new_modules.push({caption:data[rew].caption,id_num:data[rew].id_num});
            }
            setModules(new_modules);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }, []);
      useEffect(() => {
        if(theme_set){
            document.getElementById('link').click();
        }
    }, [theme_set]);
      const openDelete = (event) =>{
        var tretheme = parseInt(event.currentTarget.getAttribute('indicati'));
        setShowDeleteNotice(true);
        document.getElementById('delete_notice').style.top = event.currentTarget.style.top;
        setModuleToErase(()=>{return tretheme;});
      }
      const deleteModule = () => {
        let itm_to_rmv;
        for(var iter_modules = 0;iter_modules< modules.length;iter_modules++){
          if(modules[iter_modules].id_num === module_to_erase)
            itm_to_rmv = modules[iter_modules];
        }
        
        setModules((prevItems) => prevItems.filter(item => item !== itm_to_rmv));
        setShowDeleteNotice(false);
        saveToNodes('rmv_module',{module:module_to_erase});
      }
      // const chooseModule = (event) => {
      //   // setTheme
      //   var tretheme = parseInt(event.currentTarget.getAttribute('indicati'));
      //   setThemeSet(true);
      //   setTheme(tretheme);
      //   localStorage.setItem('chosen_module',tretheme);
      //   console.log('theme: '+theme);
      //   if(tretheme === 1)
      //       document.getElementById('link').click();
      // }
          const chooseModule = useCallback((event) => {
                    // setTheme
                  var tretheme = parseInt(event.currentTarget.getAttribute('indicati'));
                  setThemeSet(true);
                  setTheme(tretheme);
                  localStorage.setItem('chosen_module',tretheme);
                  console.log('theme: '+theme);
                  if(tretheme === 1)
                      document.getElementById('link').click();
          }, [setTheme,theme]);
      const ModulesListMemoize = useMemo(()=>{
        return ( modules.map((item, index) => (
                <div className="modules_names" key={item.id_num} onContextMenu={(event)=>{event.preventDefault();event.stopPropagation();openDelete(event);}} onClick={chooseModule} indicati={item.id_num} style={{top: (index*20)+'px'}}> {item.caption}</div>
                  
              )));
    },[modules,chooseModule]);

      const changeModule = (event) => {
        if(event.keyCode === 13){
            var mods_length = modules.length+1;
            var module_name = event.currentTarget.value;
            if(modules.length > 0){
                setModules((prevItems) => [...prevItems, {caption:module_name,id_num:mods_length}]);
            } else {
                setModules([{caption:module_name,id_num:mods_length}]);
            }
            saveToNodes('save_module',{caption:module_name,id_num:mods_length});
            event.currentTarget.value = "";
        }
        
    }
    return (<div>
        
        <div className="wellcom" style={{top:'150px',left:'calc:(50% - 100px)',backgroundSize: '200px 100px',backgroundImage: `url(${require('./wellcome.png')})`}}></div>
        <div className="wellcom" style={{top:'250px',left:'calc(50%-100px)',backgroundSize: '200px 100px',backgroundImage: `url(${require('./shteigenomator.png')})`}}></div>
        <div className="choosemodule" style={{position:'absolute',top:'350px',left:'calc(50%-100px)'}}>אנא בחר מודול או צור אחד מחדש</div>
        
        <Link id="link" to="/change_hir"></Link>
        <input className="input_module" type="text" onKeyDown={changeModule} style={{left:'calc(50%-100px)'}} />
        <div className='module-modal'>
          <div id="delete_notice" onClick={(event)=>{event.preventDefault();event.stopPropagation();deleteModule();}} style={showDeleteNotice ? {position:'absolute'} : {display:'none'}}>delete</div>
        {  
          ModulesListMemoize
        }
        </div>
    </div>);
}
export default Splash;