/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Configurations from 'Config';
import PropTypes from 'prop-types';
import ServiceCatalog from 'AppData/ServiceCatalog';
import Alert from 'AppComponents/Shared/Alert';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';

const useStyles = makeStyles((theme) => ({
    preview: {
        height: theme.spacing(18),
        marginBottom: theme.spacing(3),
    },
    contentPaneStyle: {
        marginTop: theme.spacing(10),
    },
    createButtonStyle: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    buttonStyle: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    root: {
        background: theme.palette.background.paper,
    },
    updateButtonStyle: {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
    },
    rootMain: {
        flexGrow: 1,
    },
    paper: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        margin: 'auto',
        width: '65%',
    },
    bodyStyle: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    contentTopBarStyle: {
        display: 'flex',
    },
    versionBarStyle: {
        marginTop: theme.spacing(1),
        display: 'flex',
    },
    topBarDetailsSectionStyle: {
        marginLeft: theme.spacing(5),
    },
    versionStyle: {
        marginLeft: theme.spacing(1),
    },
    itemStyle: {
        marginTop: theme.spacing(1),
    },
}));

/**
 * Service Catalog Overview Page
 *
 * @returns
 */
function Overview(props) {
    const classes = useStyles();
    const { match } = props;
    const serviceId = match.params.service_uuid;
    const intl = useIntl();
    const [service, setService] = useState(null);

    // Get Service Details
    const getService = () => {
        const promisedService = ServiceCatalog.getServiceById(serviceId);
        promisedService.then((data) => {
            setService(data);
        }).catch(() => {
            Alert.error(intl.formatMessage({
                defaultMessage: 'Error While Loading Service',
                id: 'ServiceCatalog.Listing.Overview.error.loading',
            }));
        }).finally(() => {
        });
    };

    useEffect(() => {
        getService();
    }, []);

    return (
        service && (
            <div className={classes.rootMain}>
                <Paper elevation={2} variant='elevation' className={classes.paper}>
                    <Grid container direction='row' spacing={10} className={classes.root}>
                        <Grid item md={2} />
                        <Grid item md={6} className={classes.contentPaneStyle}>
                            <div align='left' className={classes.contentTopBarStyle}>
                                <img
                                    className={classes.preview}
                                    src={Configurations.app.context + '/site/public/images/restAPIIcon.png'}
                                    alt='Type Rest API'
                                />
                                <div className={classes.topBarDetailsSectionStyle}>
                                    <Typography className={classes.heading} variant='h5'>
                                        <FormattedMessage
                                            id='ServiceCatalog.Listing.Overview.service.display.name'
                                            defaultMessage='{serviceDisplayName}'
                                            values={{ serviceDisplayName: service.displayName }}
                                        />
                                    </Typography>
                                    <div className={classes.versionBarStyle}>
                                        <LocalOfferOutlinedIcon />
                                        <Typography className={classes.versionStyle}>
                                            <FormattedMessage
                                                id='ServiceCatalog.Listing.Overview.service.version'
                                                defaultMessage='{serviceVersion}'
                                                values={{ serviceVersion: service.version }}
                                            />
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div align='left' className={classes.bodyStyle}>
                                <Grid container spacing={5}>
                                    <Grid item md={12}>
                                        <Typography>
                                            <FormattedMessage
                                                id='ServiceCatalog.Listing.Overview.service.description'
                                                defaultMessage='{description}'
                                                values={{ description: service.description }}
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography variant='h6'>
                                            <FormattedMessage
                                                id='ServiceCatalog.Listing.Overview.service.url.label'
                                                defaultMessage='Service URL :'
                                            />
                                        </Typography>
                                        <div className={classes.itemStyle}>
                                            <Typography>
                                                <FormattedMessage
                                                    id='ServiceCatalog.Listing.Overview.service.url'
                                                    defaultMessage='{serviceUrl}'
                                                    values={{ serviceUrl: service.serviceUrl }}
                                                />
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography variant='h6'>
                                            <FormattedMessage
                                                id='ServiceCatalog.Listing.Overview.service.definition.type.label'
                                                defaultMessage='Schema Type :'
                                            />
                                        </Typography>
                                        <div className={classes.itemStyle}>
                                            <Typography>
                                                <FormattedMessage
                                                    id='ServiceCatalog.Listing.Overview.service.definition.type'
                                                    defaultMessage='{definitionType}'
                                                    values={{ definitionType: service.definitionType }}
                                                />
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            {/* <div className={classes.buttonStyle}>
                                <Button color='primary'>
                                    <FormattedMessage
                                        id='ServiceCatalog.Listing.Edit.cancel.btn'
                                        defaultMessage='Cancel'
                                    />
                                </Button>
                                <Button
                                    variant='outlined'
                                    className={classes.updateButtonStyle}
                                >
                                    <FormattedMessage
                                        id='ServiceCatalog.Listing.Edit.update.btn'
                                        defaultMessage='Update'
                                    />
                                </Button>
                            </div> */}
                        </Grid>
                        <Grid item md={2} className={classes.contentPaneStyle}>
                            <div className={classes.createButtonStyle}>
                                <Button color='primary' variant='contained'>
                                    <Typography>
                                        <FormattedMessage
                                            id='ServiceCatalog.Listing.Overview.create.api'
                                            defaultMessage='Create API'
                                        />
                                    </Typography>
                                </Button>
                            </div>
                        </Grid>
                        <Grid item md={2} />
                    </Grid>
                </Paper>
            </div>
        )
    );
}

Overview.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.object,
    }).isRequired,
};

export default Overview;
