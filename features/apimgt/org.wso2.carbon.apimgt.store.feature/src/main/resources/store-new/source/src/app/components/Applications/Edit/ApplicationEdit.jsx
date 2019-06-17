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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Application from '../../../data/Application';
import API from '../../../data/api';
import Alert from '../../Shared/Alert';
import ResourceNotFound from '../../Base/Errors/ResourceNotFound';
/**
 *
 *
 * @param {*} theme
 */
const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 3,
    },
    appBar: {
        position: 'relative',
        backgroundColor: theme.palette.background.appBar,
        color: theme.palette.getContrastText(theme.palette.background.appBar),
    },
    titleBar: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: theme.palette.text.secondary,
        marginBottom: 20,
    },
    buttonLeft: {
        alignSelf: 'flex-start',
        display: 'flex',
    },
    title: {
        display: 'inline-block',
        marginLeft: 20,
    },
    buttonsWrapper: {
        marginTop: 40,
    },
    inputText: {
        marginTop: 20,
    },
    buttonAlignment: {
        marginLeft: 20,
    },
    buttonRight: {
        textDecoration: 'none',
        color: 'white',
    },
    button: {
        marginRight: theme.spacing.unit * 2,
    },
    FormControl: {
        width: '100%',
    },
    FormControlOdd: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    createFormWrapper: {
        paddingLeft: theme.spacing.unit * 5,
    },
    quotaHelp: {
        position: 'relative',
    },
});

/**
 *
 *
 * @param {*} props
 * @returns
 */
function Transition(props) {
    return <Slide direction='up' {...props} />;
}

/**
 *
 *
 * @class ApplicationEdit
 * @extends {Component}
 */
class ApplicationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            open: true,
            quota: 'Unlimited',
            description: null,
            id: null,
            tiers: [],
            notFound: false,
            lifeCycleStatus: null,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     *
     *
     * @memberof ApplicationEdit
     */
    componentDidMount() {
        const api = new API();
        const promisedApplication = Application.get(this.props.match.params.application_id);
        const promisedTiers = api.getAllTiers('application');
        Promise.all([promisedApplication, promisedTiers])
            .then((response) => {
                const [application, tierResponse] = response;
                this.setState({
                    quota: application.throttlingPolicy,
                    name: application.name,
                    description: application.description,
                    id: application.id,
                    lifeCycleStatus: application.lifeCycleStatus,
                });
                const tiers = [];
                tierResponse.body.list.map(item => tiers.push(item.name));
                this.setState({ tiers });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
                const { status } = error;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
            });
    }

    /**
     *
     *
     * @memberof ApplicationEdit
     */
    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    /**
     *
     *
     * @memberof ApplicationEdit
     */
    handleClose = () => {
        this.setState({ open: false });
    };

    /**
     *
     *
     * @memberof ApplicationEdit
     */
    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.name) {
            Alert.error('Application name is required');
        } else {
            const updated_application = {
                id: this.state.id,
                name: this.state.name,
                throttlingTier: this.state.quota,
                description: this.state.description,
                lifeCycleStatus: this.state.lifeCycleStatus,
            };
            const api = new API();
            const promised_update = api.updateApplication(updated_application, null);
            promised_update
                .then((response) => {
                    const appId = response.body.applicationId;
                    const redirectUrl = '/applications/' + appId;
                    this.props.history.push(redirectUrl);
                    console.log('Application updated successfully.');
                })
                .catch((error) => {
                    Alert.error('Error while updating application');
                    console.log('Error while updating application ' + error);
                });
        }
    };

    /**
     *
     *
     * @returns
     * @memberof ApplicationEdit
     */
    render() {
        const { classes } = this.props;
        const {
            name, tiers, notFound, id, quota, description,
        } = this.state;
        if (notFound) {
            return <ResourceNotFound />;
        }
        return (
            <React.Fragment>
                <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <Link to='/applications' className={classes.buttonRight}>
                                <IconButton color='inherit' onClick={this.handleClose} aria-label='Close'>
                                    <CloseIcon />
                                </IconButton>
                            </Link>
                            <Typography variant='title' color='inherit' className={classes.flex}>
                                Edit Application
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.createFormWrapper}>
                        <form className={classes.container} noValidate autoComplete='off'>
                            <Grid container spacing={24} className={classes.root}>
                                <Grid item xs={12} md={6}>
                                    <FormControl margin='normal' className={classes.FormControl}>
                                        <TextField
                                            required
                                            label='Application Name'
                                            value={this.state.name}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            helperText='Enter a name to identify the Application. You will be able to pick this application when subscribing to APIs '
                                            fullWidth
                                            name='name'
                                            onChange={this.handleChange('name')}
                                            placeholder='My Mobile Application'
                                            autoFocus
                                            className={classes.inputText}
                                        />
                                    </FormControl>
                                    {this.state.tiers && (
                                        <FormControl margin='normal' className={classes.FormControlOdd}>
                                            <InputLabel htmlFor='quota-helper' className={classes.quotaHelp}>
                                                Per Token Quota
                                            </InputLabel>
                                            <Select
                                                value={this.state.quota}
                                                onChange={this.handleChange('quota')}
                                                input={<Input name='quota' id='quota-helper' />}
                                            >
                                                {this.state.tiers.map(tier => (
                                                    <MenuItem key={tier} value={tier}>
                                                        {tier}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <Typography variant='caption'>
                                                Assign API request quota per access token. Allocated quota will be shared among all
                                                the subscribed APIs of the application.
                                            </Typography>
                                        </FormControl>
                                    )}
                                    <FormControl margin='normal' className={classes.FormControl}>
                                        <TextField
                                            label='Application Description'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={description}
                                            helperText='Describe the application'
                                            fullWidth
                                            multiline
                                            rowsMax='4'
                                            name='description'
                                            onChange={this.handleChange('description')}
                                            placeholder='This application is grouping apis for my mobile application'
                                            className={classes.inputText}
                                        />
                                    </FormControl>
                                    <div className={classes.buttonsWrapper}>
                                        <Link to='/applications' className={classes.buttonRight}>
                                            <Button variant='outlined' className={classes.button}>
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button variant='contained' className={classes.button} color='primary' onClick={this.handleSubmit}>
                                            UPDATE APPLICATION
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
}
ApplicationEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationEdit);
