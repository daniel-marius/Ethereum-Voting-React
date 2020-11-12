import React from 'react';
import { Button, Card, Image, Message } from 'semantic-ui-react';

import initEthers from '../ethereum/ethers';
import Layout from '../components/Layout';

class MiddlePage extends React.Component {
  state = {
    electionContract: null,
    candidatesElection: [],
    contractOwnerAddress: '',
    currentWalletAddress: '',
    voters: {},
    accountAddresses: []
  };

  async componentDidMount() {
    const { signerAddress, electionContract } = await initEthers();
    this.setState({ electionContract });
    const numCandidates = await electionContract.getNumCandidates();
    const candidatesElection = await Promise.all(
      Array
      .from({ length: parseInt(numCandidates.toString()) })
      .map((element, index) => {
        return electionContract.candidates(index);
      })
    );
    this.setState({ contractOwnerAddress: await electionContract.getOwner() });
    this.setState({ currentWalletAddress: signerAddress });
    this.setState({ candidatesElection });
    this.setState({ voters: await electionContract.voters(signerAddress) });
    this.setState({ accountAddresses:
      [
        ...this.state.accountAddresses,
        '0x16D1e38262885BA62314eE46E6cA3B85016eEEef',
        '0xBA935367b14e8dd987252a5aa61B603dF65010b4',
        '0x9CcC0184ec47598E5F187233f327eC90120F8014',
        '0x435802906b053e466023303BBe8A749F3A2986D6',
        '0x6aCA9cafb6E1F33D76936fDe35e08a3c8fe7Df7F'
      ]
    });
    this.state.accountAddresses = this.state.accountAddresses.filter(address => address !== this.state.contractOwnerAddress )
    this.setState({ accountAddresses: [...this.state.accountAddresses] });
  }

  authorization = async (address) => {
    const { electionContract } = this.state;
    await electionContract.authorizeVoter(address);
  }

  finishElection = async () => {
    const { electionContract } = this.state;
    await electionContract.endElection();
  }

  renderCandidates = () => {
    const { electionContract, candidatesElection, currentWalletAddress, voters } = this.state;

    if (candidatesElection.length === 0) {
      return (
        <Message
          header='Loading...'
        />
      );
    }

    const winner = Math.max(...candidatesElection.map(candidate => candidate.voteCount));

    const items = candidatesElection.map((candidate, index) => {
        return (
          <Card key={index} style={{ width: 'calc(100% - 760px)' }}>
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
              />
              <Card.Header>Candidate {index}</Card.Header>
              <Card.Meta>Name: {candidate[0].toString()}</Card.Meta>
              <Card.Description>
                <p>Number of votes: {candidate[1].toString()}</p>
                {(Number(winner) === Number(candidate[1].toString())) ? <p>Winner!</p> : <p></p>}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              { (voters[1] === false) ? <Button basic color='green' onClick={() => electionContract.vote(parseInt(index))}>Vote</Button> : <p>{currentWalletAddress} already voted!</p> }
              { (voters[0] === false) ? <p>{currentWalletAddress} requires vote authorization!</p> : <p></p>}
            </Card.Content>
          </Card>
        );
      });

    return items;
  };

  renderAddress = (address) => {
    const { contractOwnerAddress, currentWalletAddress } = this.state;

    if (address === '') {
      return (
        <Message
          header='Loading...'
        />
      );
    }

    return (
        <Card style={{ width: 'calc(100% - 760px)' }}>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
          <Card.Content>
            <Card.Header>{ (address === contractOwnerAddress) ? <p>Contract Owner Address</p> : <p>Current Wallet Address</p> }</Card.Header>
            <Card.Meta>
              { (address === contractOwnerAddress) ? contractOwnerAddress : currentWalletAddress }
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className='ui one buttons'>
              { (address === contractOwnerAddress) ? <Button basic color='red' onClick={this.finishElection}>End Election</Button> : <Button basic color='green' onClick={() => this.authorization(contractOwnerAddress)}>Vote Authorization</Button> }
            </div>
          </Card.Content>
        </Card>
    );
  };

  renderAccountAddresses(addressList) {
    const { voters } = this.state;

    if (addressList.length === 0) {
      return (
        <Message
          header='Loading...'
        />
      );
    }

    const items = addressList.map((address, index) => {
      return (
        <Card key={index} style={{ width: 'calc(100% - 760px)' }}>
          <Card.Content>
            <Card.Header>Account {index}</Card.Header>
            <Card.Meta>Address { address }</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            { (voters[0] === false) ? <p>Cannot delegate vote rights!</p> : <Button basic color='green' onClick={() => this.authorization(address)}>Vote Authorization</Button> }
          </Card.Content>
        </Card>
      );
    });

    return items;
  }

  render() {
    const { contractOwnerAddress, accountAddresses } = this.state;
    return (
      <Layout>
        <div>
          { this.renderCandidates() }
        </div>
        <br />
        <div>
          { this.renderAddress(contractOwnerAddress) }
        </div>
        <br />
        <div>
          { this.renderAccountAddresses(accountAddresses) }
        </div>
      </Layout>
    );
  }
};

export default MiddlePage;
