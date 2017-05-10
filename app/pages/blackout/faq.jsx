import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { ExpandingItem, Container } from '../../components';
import { devices } from '../../styles';

const Wrapper = styled.div`
    paddingTop: 75px;
    paddingBottom: 75px;
    position: relative;
`;

const FaqItemWrapper = styled.div`
    position: relative;
    width: 100%;

    ${devices.tablet`
        width: 50%;
    `}

    ${devices.tablet`
        width: 33%;
    `}
`;

class BlackoutFaq extends React.Component {

    render(){
        console.log(this.props.theme)
        return (
            <Container>
                <Wrapper>
                    <FaqItemWrapper>
                        <ExpandingItem 
                            plusColor={this.props.theme.pink}
                            headerColor="white"
                            header="What happens at a hackathon?"
                            bodyColor={this.props.theme.pink}
                            body="Participants (“hackers”) spend 36 hours working in teams of 
                                    1 - 4 people to build or code projects (“hacks”) they’re 
                                    excited about. There are workshops, mentors, food, swag, and 
                                    buckets of coffee to guide you along the way. You bring your ideas, 
                                    and we give you everything you need to make them come to life."
                        />
                    </FaqItemWrapper>
                </Wrapper>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(BlackoutFaq);