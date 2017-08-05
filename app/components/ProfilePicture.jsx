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

	handleImageError(url) {
		// var http = new XMLHttpRequest();
		// http.open('HEAD', url, false);
		// http.send();

		// if (http.status == 404) {
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
			// this.handleImageError(this.props.profilePicture)
		// }
	}

	render(){
		return (
			<img 
				onError={() => {this.handleImageError(this.props.profilePicture)}}
				src={this.state.profilePicture} 
			/>
		)
	}
}