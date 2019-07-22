/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { FormattedMessage, injectIntl } from 'react-intl';
import API from 'AppData/api';
import ApplicationCreateForm from 'AppComponents/Shared/AppsAndKeys/ApplicationCreateForm';
import Alert from 'AppComponents/Shared/Alert';
import { ScopeValidation, resourceMethods, resourcePaths } from 'AppComponents/Shared/ScopeValidation';

/**
 *
 * @inheritdoc
 * @param {*} theme theme object
 */
const styles = theme => ({
    appBar: {
        position: 'relative',
        backgroundColor: theme.palette.background.appBar,
        color: theme.palette.getContrastText(theme.palette.background.appBar),
    },
    flex: {
        flex: 1,
    },
    button: {
        marginRight: theme.spacing.unit * 2,
    },
    buttonWrapper: {
        paddingLeft: theme.spacing.unit * 7,
    },
    createFormWrapper: {
        paddingLeft: theme.spacing.unit * 5,
    },
});
/**
 * @param {*} props properties
 * @returns {Component}
 */
function Transition(props) {
    return <Slide direction='up' {...props} />;
}
/**
 * Component used to handle application creation
 * @class NewApp
 * @extends {React.Component}
 * @param {any} value @inheritDoc
 */
class NewApp extends React.Component {
    /**
     * @param {*} props properties
     */
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            applicationRequest: {
                name: '',
                throttlingPolicy: '',
                description: '',
                tokenType: null,
                attributes: {},
            },
            isNameValid: true,
            throttlingPolicyList: [],
            allAppAttributes: null,
        };
    }

    /**
     * Get all the throttling Policies from backend and
     * update the state
     * @memberof NewApp
     */
    componentDidMount() {
        // Get all the tires to populate the drop down.
        const api = new API();
        const promiseTiers = api.getAllTiers('application');
        const promisedAttributes = api.getAllApplicationAttributes();
        Promise.all([promiseTiers, promisedAttributes])
            .then((response) => {
                const [tierResponse, allAttributes] = response;
                const { applicationRequest } = this.state;
                const throttlingPolicyList = tierResponse.body.list.map(item => item.name);
                const newRequest = { ...applicationRequest };
                if (throttlingPolicyList.length > 0) {
                    [newRequest.throttlingPolicy] = throttlingPolicyList;
                }
                const allAppAttributes = [];
                allAttributes.body.list.map(item => allAppAttributes.push(item));
                this.setState({ applicationRequest: newRequest, throttlingPolicyList, allAppAttributes });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
                const { status } = error;
                if (status === 404) {
                    // eslint-disable-next-line react/no-unused-state
                    this.setState({ notFound: true });
                }
            });
    }

    /**
     * Update keyRequest state
     * @param {Object} applicationRequest parameters requried for application
     * create request
     */
    updateApplicationRequest = (applicationRequest) => {
        this.setState({ applicationRequest });
    }

    /**
     * @param {object} name application attribute name
     * @returns {void}
     * @memberof EditApp
     */
    handleAttributesChange = name => (event) => {
        const { applicationRequest } = this.state;
        applicationRequest.attributes[name] = event.target.value;
        this.setState({ applicationRequest });
    };

    /**
     * @param {object} name application attribute name
     * @returns {void}
     * @memberof EditApp
     */
    isRequiredAttribute = (name) => {
        const { allAppAttributes } = this.state;
        if (allAppAttributes) {
            for (let i = 0; i < allAppAttributes.length; i++) {
                if (allAppAttributes[i].attribute === name) {
                    return allAppAttributes[i].required === 'true';
                }
            }
        }
        return false;
    };

    /**
     * Validate and send the application create
     * request to the backend
     * @memberof NewApp
     */
    saveApplication = () => {
        const { applicationRequest } = this.state;
        const { updateApps } = this.props;
        const api = new API();
        this.validateName(applicationRequest.name)
            .then(() => api.createApplication(applicationRequest))
            .then(() => {
                console.log('Application created successfully.');
                this.setState({ open: false });
                updateApps();
            })
            .catch((error) => {
                const { response } = error;
                if (response && response.body) {
                    const message = response.body.description || 'Error while creating the application';
                    Alert.error(message);
                } else {
                    Alert.error(error.message);
                }
                console.error('Error while creating the application');
            });
    };

    /**
     * @memberof NewApp
     */
    handleClose = () => {
        this.setState({ open: false });
    };

    /**
     * @memberof NewApp
     */
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    validateName = (value) => {
        if (!value || value.trim() === '') {
            this.setState({ isNameValid: false });
            return Promise.reject(new Error('Application name is required'));
        }
        this.setState({ isNameValid: true });
        return Promise.resolve(true);
    };

    /**
     * @inheritdoc
     * @memberof NewApp
     */
    render() {
        const {
            throttlingPolicyList, applicationRequest, isNameValid, open, allAppAttributes,
        } = this.state;
        const { classes } = this.props;
        return (
            <React.Fragment>
                <ScopeValidation resourcePath={resourcePaths.APPLICATIONS} resourceMethod={resourceMethods.POST}>
                    <Button
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        onClick={this.handleClickOpen}
                    >
                        <FormattedMessage
                            defaultMessage='ADD NEW APPLICATION'
                            id='Applications.Create.NewApp.add.new.application.button'
                        />
                    </Button>
                </ScopeValidation>
                <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color='inherit' onClick={this.handleClose} aria-label='Close'>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant='title' color='inherit' className={classes.flex}>
                                <FormattedMessage
                                    defaultMessage='Create New Application'
                                    id='Applications.Create.NewApp.create.new.application.title'
                                />
                            </Typography>
                            <Button color='inherit' onClick={this.handleClose}>
                                <FormattedMessage
                                    defaultMessage='Save'
                                    id='Applications.Create.NewApp.save.application'
                                />
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.createFormWrapper}>
                        <ApplicationCreateForm
                            throttlingPolicyList={throttlingPolicyList}
                            applicationRequest={applicationRequest}
                            updateApplicationRequest={this.updateApplicationRequest}
                            validateName={this.validateName}
                            isNameValid={isNameValid}
                            allAppAttributes={allAppAttributes}
                            handleAttributesChange={this.handleAttributesChange}
                            isRequiredAttribute={this.isRequiredAttribute}
                        />
                    </div>
                    <div className={classes.buttonWrapper}>
                        <Button variant='outlined' className={classes.button} onClick={this.handleClose}>
                            <FormattedMessage
                                defaultMessage='Cancel'
                                id='Applications.Create.NewApp.cancel'
                            />
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            onClick={this.saveApplication}
                        >
                            <FormattedMessage
                                defaultMessage='ADD NEW APPLICATION'
                                id='Applications.Create.NewApp.add.new.application.create'
                            />
                        </Button>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
}

NewApp.propTypes = {
    classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(NewApp);
