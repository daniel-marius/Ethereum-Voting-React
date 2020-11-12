import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';

import initEthers from '../ethereum/ethers';
import Layout from './Layout';

class AddCandidate extends React.Component {

  state = {
    contract: null,
    value: '',
    errorMessage: '',
    loading: false
  };

  async componentDidMount() {
    const { electionContract } = await initEthers();
    this.setState({ contract: electionContract });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });
    try {
      const tx = await this.state.contract.addCandidate(this.state.value.toString());
      const receipt = await tx.wait();
      console.log(receipt);
      this.props.history.push('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit} error={ !!this.state.errorMessage }>
          <Form.Field>
            <label>Candidate Name</label>
            <Input
              value={ this.state.value }
              onChange={ event => this.setState({ value: event.target.value }) }
              label="Name"
              labelPosition="right"
            />
          </Form.Field>
          <Message error header="Error!" content={ this.state.errorMessage } />
          <Button primary loading={ this.state.loading }>Add Candidate</Button>
        </Form>
      </Layout>
    );
  }

}

export default AddCandidate;
