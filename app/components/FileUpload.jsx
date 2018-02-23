import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const Container = styled.div`
    display: block;
    text-align: center;
    font-size: 14px;
`;

const SelectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    border: 3px solid ${props => props.defaultColor};
    position: relative;

    &:hover {
        border: 3px solid ${props => props.hoverColor};
        transition: all 0.2s ease-in-out;

        .upload-button {
            background-color: ${props => props.hoverColor};
            color: white;
            transition: all 0.2s ease-in-out;
        }
    }
`;

const Button = styled.div`
    order: 1;
    background-color: ${props => props.backgroundColor};
    color: white;
    padding: 12px 10px;

    ${devices.small`
        padding: 12px 20px;
    `};
`;

const FileName = styled.div`
    order: 2;
    flex-grow: 1;
    padding: 12px;
`;

const Input = styled.input`
    z-index: 100;
    cursor: pointer;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
`;

class FileUpload extends React.Component {
    constructor() {
        super();

        this.state = {
            fileSelected: false,
            fileName: ''
        };

        this.onFileSelect = this.onFileSelect.bind(this);
    }

    onFileSelect(e) {
        const file = e.target.files[0];

        this.setState({
            fileSelected: true,
            fileName: file.name
        });

        this.props.onFileSelect(file);
    }

    render() {
        const { defaultColor, hoverColor, activeColor } = this.props;

        return (
            <Container>
                <SelectionContainer
                    defaultColor={
                        this.state.fileSelected ? activeColor : defaultColor
                    }
                    hoverColor={hoverColor}
                >
                    <Button
                        className="upload-button"
                        backgroundColor={
                            this.state.fileSelected ? activeColor : defaultColor
                        }
                    >
                        Upload {this.props.fileTitle}
                    </Button>
                    <FileName>
                        {this.state.fileSelected
                            ? this.state.fileName
                            : this.props.defaultText || 'No file chosen...'}
                    </FileName>
                    <Input
                        type="file"
                        name="chooseFile"
                        onChange={this.onFileSelect}
                    />
                </SelectionContainer>
            </Container>
        );
    }
}

export default FileUpload;
