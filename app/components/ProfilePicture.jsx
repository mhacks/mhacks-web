import React from 'react';
// import styled from 'styled-components';

export default class ProfilePicture extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			counter: 0,
			profilePicture: this.props.avatars[0] || ''
		};

		this.handleImageError = this.handleImageError.bind(this);
	}

	handleImageError() {
		console.log('old avatar: ' + this.props.avatars[this.state.counter]);
		console.log('counter old: ' + this.state.counter);
		this.setState(prevState => {
			console.log('counter new: ' + (prevState.counter + 1));
			return { counter: prevState.counter + 1 };
		});
		this.setState(prevState => {
			console.log('new avatar: ' + this.props.avatars[prevState.counter]);
			return { profilePicture: this.props.avatars[prevState.counter] };
		});
	}

	render(){
        console.log(this.state.profilePicture)
		return (
			<img 
				onError={this.handleImageError}
				src={this.state.profilePicture} 
			/>
		)
	}
}