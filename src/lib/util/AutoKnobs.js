import React from 'react';
import { each } from 'lodash';
import PropTypes from 'prop-types';
import { color, number, radios } from "@storybook/addon-knobs";

const AutoKnobs = ({ component: BaseComponent, ...props }) => {
  const knobProps = {};
  each(BaseComponent.knobConfig, ({ group, options, type: _type }, propName) => {
    let type = _type;
    if(!type) {
      if(BaseComponent.propTypes[propName] === PropTypes['number'] || BaseComponent.propTypes[propName] === PropTypes['number'].isRequired) {
        type = 'number';
      }
      if(BaseComponent.propTypes[propName] === PropTypes['string'] || BaseComponent.propTypes[propName] === PropTypes['string'].isRequired) {
        type = 'string';
      }
    }
    if(type === 'color') {
      knobProps[propName] = color(propName, BaseComponent.defaultProps[propName], group);
    } else if(type === 'number') {
      knobProps[propName] = number(propName, BaseComponent.defaultProps[propName], options, group);
    } else if(type === 'radios') {
      knobProps[propName] = radios(propName, options, BaseComponent.defaultProps[propName], group);
    }
  });

  return <BaseComponent {...props} {...knobProps} />;
};

export default AutoKnobs;
