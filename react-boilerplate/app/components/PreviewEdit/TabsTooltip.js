import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { Input, Button } from 'style-store';

const buildContent = (count) => {
  let returns = '\n<!--tabs-->\n';
  for (let i = 1; i <= count; i += 1) {
    returns += `
<!--tab Tab${i}-->
content of Tab${i}
<!--endtab-->\n`;
  }
  returns += '\n<!--endtabs-->\n';
  return returns;
};

class TabsTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultState = {
      count: 2,
    };
    this.state = this.defaultState;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetState = () => this.setState(this.defaultState);
    this.handleSubmit = () =>
      this.props.handleSubmit(buildContent(this.state.count));
  }
  handleKeyPress(e) {
    if (e.nativeEvent.keyCode === 13) {
      this.handleSubmit();
    }
  }
  render() {
    return (
      <div>
        <Flex alignItems="center">
          <Box mr={1}>Tab Count:</Box>
          <Input
            value={this.state.count}
            style={{ border: '2px solid #5856b9' }}
            onChange={(e) => {
              this.setState({ count: parseInt(e.target.value, 10) || 0 });
            }}
          />
        </Flex>
        <Button
          w={1}
          p={1}
          my={1}
          style={{
            color: '#fcf4dc',
            backgroundColor: '#5856b9',
          }}
          onClick={this.handleSubmit}
          onKeyUp={this.handleKeyPress}
        >
          Confirm
        </Button>
      </div>
    );
  }
}

TabsTooltip.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default TabsTooltip;
