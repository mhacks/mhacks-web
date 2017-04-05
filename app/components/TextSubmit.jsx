import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: block;
    position: relative;
    whiteSpace: no-wrap;
    minWidth: 350px;
`

const Input = styled.input`
    width: 250px;
    height: 40px;
    border: 3px solid #E6E6E6;
    borderTopLeftRadius: 8px;
    borderBottomLeftRadius: 8px;
    padding: 10px;
    fontSize: 16px;
` 

const Button = styled.button`
    width: 100px;
    height: 40px;
    top: -1px;
    left: -3px;
    position: relative;
    border: 3px solid #E6E6E6;
    borderTopRightRadius: 8px;
    borderBottomRightRadius: 8px;
    backgroundColor: #E6E6E6;
`

export default class TextSubmit extends React.Component {

    render() {
        return (
            <Container>
                <Input
                    type="text"
                    value={this.props.value}
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                />
                <Button onClick={this.props.onSubmit}>
                    {this.props.buttonText}
                </Button>
            </Container>
        )
    }
}