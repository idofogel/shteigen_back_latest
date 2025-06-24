import React from 'react';
/**
 * a component that represents a node that appears on screen
 */
import RoundNode from './roundnode';
const PresentedNodes = (props) => {
    return (props.items.map((item, index) => (
        <RoundNode key={item.id_num} changeSource={props.changeNodeId} source_node={item.id} changeLevel={props.levelchanger} callMdl={props.callgroup} node_id={item.id} title={item.name} placex={item.placex} placey={item.placey} />
      ))
    );
}
export default PresentedNodes;