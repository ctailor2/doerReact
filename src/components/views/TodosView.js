import React, {Component} from 'react';
import {connect} from 'react-redux';
import {loadTodosViewAction} from '../../actions/loadViewActions';
import Header from '../Header';
import App from '../App';
import Loader from '../views/Loader';

export class TodosView extends Component {
	componentDidMount() {
		this.props.loadTodosViewAction();
	}

	render() {
		return (<div>
			<Header />
			{this.renderView()}
		</div>);
	}

	renderView() {
		if(this.props.viewLoaded) {
			return (<App />);
		}
		return (<Loader />)
	}
}

export const mapStateToProps = (state) => {
	return {
		viewLoaded: state.loadView.todosViewLoaded
	};
}

export default connect(mapStateToProps, {
	loadTodosViewAction
})(TodosView);