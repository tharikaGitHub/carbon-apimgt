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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import API from '../../../data/api';

/**
 * @param {*} theme theme details
 * @returns {Object}
 */
const styles = theme => ({
    FormControl: {
        padding: theme.spacing.unit * 2,
        width: '100%',
    },
    FormControlOdd: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
    quotaHelp: {
        position: 'relative',
    },
});
/**
 *
 *
 * @class ApplicationCreate
 * @extends {Component}
 */
class ApplicationCreate extends Component {
    /**
     * @param {Object} props props passed from above
     */
    constructor(props) {
        super(props);
        this.state = {
            quota: 'Unlimited',
            tiers: [],
            description: null,
            name: null,
            appAttributes: {},
            allAppAttributes: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAttributesChange = this.handleAttributesChange.bind(this);
    }

    /**
     *
     *
     * @memberof ApplicationCreate
     */
    componentDidMount() {
        // Get all the tires to populate the drop down.
        const api = new API();
        const promisedTiers = api.getAllTiers('application');
        const promisedAttributes = api.getAllApplicationAttributes();
        Promise.all([promisedTiers, promisedAttributes])
            .then((response) => {
                const [tierResponse, allAttributes] = response;
                const tiers = [];
                tierResponse.body.list.map(item => tiers.push(item.name));
                const allAppAttributes = [];
                allAttributes.body.map(item => allAppAttributes.push(item));
                if (tiers.length > 0) {
                    this.setState({ quota: tiers[0] });
                }
                this.setState({ tiers, allAppAttributes });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
                const { status } = error;
                if (status === 404) {
                    console.log('Error retrieving data for application creation');
                }
            });
    }

    /**
     * @param {object} name state key
     * @returns {void}
     * @memberof ApplicationCreate
     */
    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    /**
     * @param {object} name application attribute name
     * @returns {void}
     * @memberof ApplicationCreate
     */
    handleAttributesChange = name => (event) => {
        const { appAttributes } = this.state;
        appAttributes[name] = event.target.value;
        this.setState({ appAttributes });
    };

    /**
     *
     *
     * @returns {promise}
     * @memberof ApplicationCreate
     */
    handleSubmit() {
        const {
            name, quota, description, appAttributes,
        } = this.state;
        if (!name) {
            return Promise.reject(new Error('Application name is required'));
        } else {
            const applicationData = {
                name,
                throttlingPolicy: quota,
                description,
                attributes: appAttributes,
            };
            const newApi = new API();
            return newApi.createApplication(applicationData);
        }
    }

    /**
     *
     *
     * @returns {Component}
     * @memberof ApplicationCreate
     */
    render() {
        const { classes } = this.props;
        const {
            tiers, quota, allAppAttributes,
        } = this.state;
        return (
            <form className={classes.container} noValidate autoComplete='off'>
                <Grid container spacing={24} className={classes.root}>
                    <Grid item xs={12} md={6}>
                        <FormControl margin='normal' className={classes.FormControl}>
                            <TextField
                                required
                                label='Application Name'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText='Enter a name to identify the Application. You will be able to pick this
                                application when subscribing to APIs '
                                fullWidth
                                name='name'
                                onChange={this.handleChange('name')}
                                placeholder='My Mobile Application'
                                autoFocus
                                className={classes.inputText}
                            />
                        </FormControl>
                        {tiers && (
                            <FormControl margin='normal' className={classes.FormControlOdd}>
                                <InputLabel htmlFor='quota-helper' className={classes.quotaHelp}>
                                    Per Token Quota
                                </InputLabel>
                                <Select
                                    value={quota}
                                    onChange={this.handleChange('quota')}
                                    input={<Input name='quota' id='quota-helper' />}
                                >
                                    {tiers.map(tier => (
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
                        {allAppAttributes && (
                            Object.entries(allAppAttributes).map(item => (
                                item[1].Hidden === false ? (
                                    <FormControl
                                        margin='normal'
                                        className={classes.FormControl}
                                        key={item[1].Attribute}
                                    >
                                        <TextField
                                            required={item[1].Required}
                                            label={item[1].Attribute}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            helperText={item[1].Description}
                                            fullWidth
                                            name={item[1].Attribute}
                                            onChange={this.handleAttributesChange(item[1].Attribute)}
                                            placeholder={'Enter ' + item[1].Attribute}
                                            className={classes.inputText}
                                        />
                                    </FormControl>
                                ) : (null)))
                        )}
                    </Grid>
                </Grid>
            </form>
        );
    }
}

ApplicationCreate.propTypes = {
    classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ApplicationCreate);
