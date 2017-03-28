import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'

class Navigator extends React.Component {

	render () {
		return (
			<ThemeProvider theme={this.props.theme}>
				{this.props.children}
			</ThemeProvider>
		)
	}
}

function select(state){
	return {
		theme: state.theme.data
	}
}

export default connect(select)(Navigator)
