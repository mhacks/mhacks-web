import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';
import PropTypes from 'prop-types';
import { MHForm } from '../../components';
import { OrderedSet } from 'immutable';
import { NotificationStack } from 'react-notification';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
`;

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

/* Page Component */
class ModelForm extends React.Component {
    constructor() {
        super();

        this.state = {
            notifications: OrderedSet()
        };

        this.onSubmit = this.onSubmit.bind(this);
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

    static getDerivedStateFromProps(nextProps) {
        if (
            nextProps.adminState &&
            nextProps.adminState.form &&
            nextProps.adminState.form.form &&
            nextProps.adminState.document
        ) {
            for (var i in nextProps.adminState.document) {
                if (i in nextProps.adminState.form.form) {
                    nextProps.adminState.form.form[i].default =
                        nextProps.adminState.document[i];
                }
            }
        }

        return {
            adminState: nextProps.adminState
        };
    }

    componentDidMount() {
        this.props.dispatch(AdminThunks.loadForm(this.props.model));
        this.props.dispatch(
            AdminThunks.loadDocument(this.props.model, this.props.id)
        );
    }

    onSubmit(formData, files) {
        this.props.dispatch(
            AdminThunks.updateModel(
                this.props.model,
                this.props.id,
                formData,
                files
            )
        );

        this.addNotification(this.props.model + ' Saved!', 'save');
    }

    render() {
        if (
            !this.state.adminState ||
            !this.state.adminState.form ||
            (!this.state.adminState.form.form &&
                !this.state.adminState.document)
        ) {
            return null;
        }

        let title = '';
        let showId = true;
        if (this.props.id === 'create') {
            title = 'Creating ' + this.props.model.slice(0, -1);
            showId = false;
        } else {
            title = 'Updating ' + this.props.model.slice(0, -1);
        }

        return (
            <PagePulled>
                <FormContainer>
                    <h2>
                        {title}
                        <br />
                        {showId ? this.props.id : null}
                    </h2>
                    <MHForm
                        schema={this.state.adminState.form.form}
                        FieldTypes={this.state.adminState.form.FieldTypes}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                        validate={false}
                    />
                    <NotificationStack
                        notifications={this.state.notifications.toArray()}
                        onDismiss={notification =>
                            this.setState({
                                notifications: this.state.notifications.delete(
                                    notification
                                )
                            })
                        }
                    />
                </FormContainer>
            </PagePulled>
        );
    }
}

ModelForm.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
};

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        adminState: state.adminState
    };
}

export default connect(mapStateToProps)(ModelForm);
