import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../actions';
import { FieldTypes, ProfileFields } from '../constants/forms';
import Autocomplete from 'react-autocomplete';
const Majors = require('../../static/misc/majors.json');
const Universities = require('../../static/misc/universities.json');

import {
    PageContainer,
    FileUpload,
    Alert,
    LabeledInput,
    RoundedButton
} from '../components';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
    minHeight: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 0 50px;
`;

const Flexer = styled.div`
    display: flex;
    flexDirection: column;
`;

const InputContainer = styled.div`
    marginBottom: 30px;
`;

const ButtonGroup = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
`;

const SectionHeader = styled.h2`
    fontSize: 40px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 0;
    padding: 20px 0;
`;

const SubsectionHeader = styled.h3`
    fontSize: 22px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 26px 0 0 0;
`;

const FileUploadContainer = styled.div`
    marginTop: 10px;
`;

const AlertContainer = styled.div`
    marginTop: 30px;
`;

const Subhead = styled.p`
    margin: 20px 0 0 0;
    color: ${props => props.theme.secondary};
`;

const Link = styled.a`
    color: ${props => props.color};
    cursor: pointer;
`;

const autocompleteMenuStyle = {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'absolute',
    maxHeight:
        Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        ) /
            2 +
            'px',
    left: '20px',
    top: '45px',
    overflow: 'auto',
    zIndex: 101
};

const autocompleteWrapperStyle = {
    display: 'inherit',
    paddingLeft: '20px',
    width: '100%',
    position: 'relative'
};

class Profile extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
            university: userData.university || '',
            major: userData.major || '',
            avatars: userData.avatars || [],
            isResumeUploaded: userData.isResumeUploaded || false,
            notifications: OrderedSet()
        };

        for (const key of Object.keys(ProfileFields)) {
            if (
                ProfileFields[key] === FieldTypes.TEXT ||
                ProfileFields[key] === FieldTypes.LINK
            ) {
                this.state[key] = userData[key] || '';
            } else if (ProfileFields[key] === FieldTypes.SELECT) {
                this.state[key] = userData[key] || 'unselected';
            } else if (ProfileFields[key] === FieldTypes.DATE) {
                this.state[key] = userData[key]
                    ? new Date(userData[key]).toISOString().split('T')[0]
                    : '';
            }
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onClickRequestEmailVerification = this.onClickRequestEmailVerification.bind(
            this
        );
        this.handleSortItems = this.handleSortItems.bind(this);
        this.handleItemShouldRender = this.handleItemShouldRender.bind(this);
        this.handleRenderMenu = this.handleRenderMenu.bind(this);
    }

    addNotification(message, key, action) {
        return this.setState({
            notifications: this.state.notifications.add({
                message,
                key,
                action: action || 'Dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(key);
                },
                dismissAfter: 5000
            })
        });
    }

    removeNotification(key) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        });
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.user;
        const nextUserData = nextProps.userState.data.user;

        if (nextProps.userState.fetching) {
            return;
        }

        var updateData = {};
        for (var i in userData) {
            if (i in nextUserData && nextUserData[i] !== userData[i]) {
                if (i === 'birthday') {
                    nextUserData[i] = nextUserData.birthday
                        ? new Date(nextUserData.birthday)
                              .toISOString()
                              .split('T')[0]
                        : '';
                }

                updateData[i] = nextUserData[i];
            }
        }

        if (!('isResumeUploaded' in updateData)) {
            updateData.isResumeUploaded = false;
        }

        this.setState(updateData);
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleFileUpload(file) {
        this.setState({
            resume: file
        });
    }

    handleSortItems(a, b, value) {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const valueLower = value.toLowerCase();
        const queryPosA = aLower.indexOf(valueLower);
        const queryPosB = bLower.indexOf(valueLower);
        if (queryPosA !== queryPosB) {
            return queryPosA - queryPosB;
        }
        return aLower < bLower ? -1 : 1;
    }

    handleItemShouldRender(current, value) {
        return current.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }

    handleRenderMenu(items, value, style) {
        return (
            <div
                style={{ ...style, ...autocompleteMenuStyle }}
                children={
                    value.length > 2 ? items : 'Start typing for autocomplete'
                }
            />
        );
    }

    onSubmit(e) {
        e.preventDefault();

        var profile = {};
        var files = {};

        const inputBirthday = new Date(this.state.birthday).getTime();

        profile.birthday = inputBirthday;
        profile.major = this.state.major;
        profile.university = this.state.university;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        for (const key of Object.keys(ProfileFields)) {
            if (
                ProfileFields[key] === FieldTypes.TEXT ||
                ProfileFields[key] === FieldTypes.LINK ||
                ProfileFields[key] === FieldTypes.SELECT
            ) {
                profile[key] = this.state[key];
            } else if (ProfileFields[key] === FieldTypes.DATE) {
                profile[key] = new Date(this.state[key]).getTime();
            }
        }

        this.props.dispatch(ProfileThunks.updateProfile(profile, files));

        this.addNotification('Profile Saved!', 'save');
    }

    onClickRequestEmailVerification(e) {
        e.preventDefault();

        var email = this.props.userState.data.user.email;

        this.props.dispatch(ProfileThunks.sendVerificationEmail(email));
    }

    render() {
        const userData = this.props.userState.data;

        return (
            <PageContainer>
                {userData.status === 'unread' ? <p>yay</p> : <p>aww</p>}
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        {userData.isEmailVerified
                            ? 'Profile'
                            : 'Unverified Email'}
                    </SectionHeader>
                    {userData.isEmailVerified
                        ? <form onSubmit={this.onSubmit}>
                              {this.props.userState.error
                                  ? <AlertContainer>
                                        <Alert
                                            message={
                                                this.props.userState.message
                                            }
                                        />
                                    </AlertContainer>
                                  : null}
                              {userData.isApplicationSubmitted
                                  ? <AlertContainer>
                                        <Alert
                                            message={
                                                'Your application is submitted but you can still make changes on the application page to update it! Thanks for applying to MHacks X'
                                            }
                                            style={{
                                                backgroundColor: '#01FF70',
                                                color: '#3D9970'
                                            }}
                                        />
                                    </AlertContainer>
                                  : null}
                              <Subhead>
                                  Update your profile with some info about
                                  yourself. This will be automatically
                                  populated into your application and persist
                                  through hackathons!
                              </Subhead>
                              <Flexer>
                                  <InputContainer>
                                      <SubsectionHeader
                                          color={this.props.theme.primary}
                                      >
                                          General
                                      </SubsectionHeader>
                                      <LabeledInput label="Name">
                                          <input
                                              id="name"
                                              type="text"
                                              name="name"
                                              placeholder="Hack mcHacker"
                                              value={this.state.name}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="University">
                                          <Autocomplete
                                              getItemValue={item => item}
                                              items={Universities}
                                              shouldItemRender={
                                                  this.handleItemShouldRender
                                              }
                                              renderItem={(
                                                  item,
                                                  isHighlighted
                                              ) =>
                                                  <div
                                                      style={{
                                                          background: isHighlighted
                                                              ? 'lightgray'
                                                              : 'white'
                                                      }}
                                                  >
                                                      {item}
                                                  </div>}
                                              inputProps={{
                                                  placeholder:
                                                      'e.g. University of Michigan',
                                                  name: 'university',
                                                  id: 'university'
                                              }}
                                              sortItems={this.handleSortItems}
                                              value={this.state.university}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                              onSelect={e => {
                                                  var fakeEvent = {
                                                      target: {
                                                          name: 'university',
                                                          value: e
                                                      }
                                                  };

                                                  this.handleAttributeChange(
                                                      fakeEvent
                                                  );
                                              }}
                                              menuStyle={autocompleteMenuStyle}
                                              wrapperStyle={
                                                  autocompleteWrapperStyle
                                              }
                                              renderMenu={this.handleRenderMenu}
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="Major">
                                          <Autocomplete
                                              getItemValue={item => item}
                                              items={Majors}
                                              shouldItemRender={
                                                  this.handleItemShouldRender
                                              }
                                              renderItem={(
                                                  item,
                                                  isHighlighted
                                              ) =>
                                                  <div
                                                      style={{
                                                          background: isHighlighted
                                                              ? 'lightgray'
                                                              : 'white'
                                                      }}
                                                  >
                                                      {item}
                                                  </div>}
                                              inputProps={{
                                                  placeholder:
                                                      'e.g. Underwater Basket Weaving',
                                                  name: 'major',
                                                  id: 'major'
                                              }}
                                              sortItems={this.handleSortItems}
                                              value={this.state.major}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                              onSelect={e => {
                                                  var fakeEvent = {
                                                      target: {
                                                          name: 'major',
                                                          value: e
                                                      }
                                                  };

                                                  this.handleAttributeChange(
                                                      fakeEvent
                                                  );
                                              }}
                                              menuStyle={autocompleteMenuStyle}
                                              wrapperStyle={
                                                  autocompleteWrapperStyle
                                              }
                                          />
                                      </LabeledInput>
                                      <FileUploadContainer>
                                          <FileUpload
                                              defaultColor={
                                                  userData.user.isResumeUploaded
                                                      ? this.props.theme.success
                                                      : this.props.theme.primary
                                              }
                                              hoverColor={
                                                  this.props.theme.secondary
                                              }
                                              activeColor={
                                                  this.props.theme.success
                                              }
                                              onFileSelect={
                                                  this.handleFileUpload
                                              }
                                              defaultText={
                                                  userData.user.isResumeUploaded
                                                      ? 'Resume Uploaded'
                                                      : null
                                              }
                                          />
                                      </FileUploadContainer>
                                      <SubsectionHeader
                                          color={this.props.theme.primary}
                                      >
                                          Links
                                      </SubsectionHeader>
                                      <LabeledInput label="GitHub">
                                          <input
                                              id="github"
                                              type="text"
                                              name="github"
                                              placeholder="https://github.com/"
                                              value={this.state.github}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="LinkedIn">
                                          <input
                                              id="linkedin"
                                              type="text"
                                              name="linkedin"
                                              placeholder="https://www.linkedin.com/in/"
                                              value={this.state.linkedin}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="DevPost">
                                          <input
                                              id="devpost"
                                              type="text"
                                              name="devpost"
                                              placeholder="https://devpost.com/"
                                              value={this.state.devpost}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="Portfolio">
                                          <input
                                              id="portfolio"
                                              type="text"
                                              name="portfolio"
                                              placeholder="https://"
                                              value={this.state.portfolio}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <SubsectionHeader
                                          color={this.props.theme.primary}
                                      >
                                          Private
                                      </SubsectionHeader>
                                      <LabeledInput label="Date of Birth">
                                          <input
                                              id="birthday"
                                              type="date"
                                              name="birthday"
                                              placeholder="mm/dd/yyyy"
                                              value={this.state.birthday}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          />
                                      </LabeledInput>
                                      <LabeledInput label="T-Shirt Size">
                                          <select
                                              name="tshirt"
                                              value={this.state.tshirt}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          >
                                              <option value="unselected">Select</option>
                                              <option value="xs">XS</option>
                                              <option value="s">S</option>
                                              <option value="m">M</option>
                                              <option value="l">L</option>
                                              <option value="xl">XL</option>
                                              <option value="2xl">2XL</option>
                                              <option value="3xl">3XL</option>
                                          </select>
                                      </LabeledInput>
                                      <LabeledInput label="Race">
                                          <select
                                              name="race"
                                              value={this.state.race}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          >
                                              <option value="unselected">Select</option>
                                              <option value="white">White</option>
                                              <option value="black">Black</option>
                                              <option value="am-indian-alaskan">
                                                  American Indian or Alaskan
                                                  Native
                                              </option>
                                              <option value="asian">
                                                  Asian or Pacific Islander
                                              </option>
                                              <option value="hispanic">Hispanic</option>
                                              <option value="other">Other</option>
                                              <option value="prefer-not">
                                                  Prefer not to answer
                                              </option>
                                          </select>
                                      </LabeledInput>
                                      <LabeledInput label="Sex">
                                          <select
                                              name="sex"
                                              value={this.state.sex}
                                              onChange={
                                                  this.handleAttributeChange
                                              }
                                          >
                                              <option value="unselected">Select</option>
                                              <option value="male">Male</option>
                                              <option value="female">
                                                  Female
                                              </option>
                                              <option value="non-binary">
                                                  Other
                                              </option>
                                              <option value="prefer-not">
                                                  Prefer not to answer
                                              </option>
                                          </select>
                                      </LabeledInput>
                                  </InputContainer>
                                  <ButtonGroup>
                                      <RoundedButton
                                          type="submit"
                                          color={this.props.theme.primary}
                                      >
                                          Save
                                      </RoundedButton>
                                  </ButtonGroup>
                              </Flexer>
                          </form>
                        : <p>
                              You should have received a verification email at{' '}
                              {userData.email}. If not, you can
                              request another one{' '}
                              <Link
                                  onClick={this.onClickRequestEmailVerification}
                                  color={this.props.theme.highlight}
                              >
                                  here
                              </Link>. After you verify your email you can
                              continue setting up your profile!
                          </p>}
                </FormContainer>
                <NotificationStack
                    notifications={this.state.notifications.toArray()}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.delete(
                                notification
                            )
                        })}
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Profile);
