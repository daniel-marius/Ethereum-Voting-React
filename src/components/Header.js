import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import initEthers from '../ethereum/ethers';

class Header extends React.Component {
	state = {
		electionName: ''
	};

	async componentDidMount() {
		const { electionContract } = await initEthers();
		const electionName = await electionContract.getElectionName();
		this.setState({ electionName });
	}

	renderHeader = () => {
		return (
			<Menu style={{ marginTop: '10px' }}>
				<Link to="/" className="item">
					<p>{ this.state.electionName ? "Election: " + this.state.electionName : "Election" }</p>
				</Link>
				<Menu.Menu position="right">
				<Link to="/candidates/new" className="item">
					Add Candidates
				</Link>
				<Link to="/candidates/new" className="item">
					+
				</Link>
				</Menu.Menu>
			</Menu>
		);
	};

	render() {
		return (
				this.renderHeader()
		);
	}
};

export default Header;
