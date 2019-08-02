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
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import { StarRate } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import Alert from '../../Shared/Alert';
import Api from '../../../data/api';


/**
 *
 *
 * @param {*} theme
 */
const styles = theme => ({
    starRate: {
        fontSize: 30,
        color: theme.custom.starColor,
    },
    noStarRate: {
        fontSize: 30,
        color: theme.palette.grey.A200,
    },
    removeRating: {
        fontSize: 20,
        color: 'black',
    },
    userRating: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});

/**
 *
 *
 * @class StarRatingBar
 * @extends {React.Component}
 */
class StarRatingBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: {
                avgRating: 0,
                userRating: 0,
                count: 0,
            },
        };
        this.getApiRating = this.getApiRating.bind(this);
        this.removeUserRating = this.removeUserRating.bind(this);
        this.doRate = this.doRate.bind(this);
    }

    /**
     *
     *
     * @memberof StarRatingBar
     */
    componentDidMount() {
        this.getApiRating();
    }

    /**
     *
     *
     * @memberof StarRatingBar
     */
    getApiRating() {
        const { apiId } = this.props;
        const api = new Api();
        // get api rating
        const promisedRating = api.getRatingFromUser(apiId, null);
        promisedRating.then((response) => {
            this.setState({
                rating: response.body,
            });
        });
    }

    /**
     *
     *
     * @param {*} rateIndex
     * @memberof StarRatingBar
     */
    doRate(rateIndex) {
        const { apiId } = this.props;
        const api = new Api();
        const ratingInfo = { rating: rateIndex };
        const promise = api.addRating(apiId, ratingInfo);
        promise
            .then(() => {
                this.getApiRating();
            })
            .catch((error) => {
                Alert.error('Error occured while adding ratings');
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
            });
    }

    /**
     *
     *
     * @memberof StarRatingBar
     */
    removeUserRating() {
        const { apiId } = this.props;
        const api = new Api();
        // remove user rating
        api.removeRatingOfUser(apiId, null)
            .then(() => this.getApiRating())
            .then((response) => {
                this.setState({
                    rating: response.body,
                });
            })
            .catch((error) => {
                Alert.error('Error occured while removing ratings');
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
            });
    }

    /**
     *
     *
     * @returns
     * @memberof StarRatingBar
     */
    render() {
        const { rating } = this.state;
        const {
            classes,
            isEditable,
            showSummary,
            theme,
        } = this.props;
        return (
            <React.Fragment>
                {showSummary ? (
                    <React.Fragment>
                        {rating.count > 0 ? (
                            <React.Fragment>
                                <StarRate className={classes.starRate} />
                                <div className={classes.ratingSummary}>
                                    <div className={classes.userRating}>
                                        <Typography variant='display1'>{rating.avgRating}</Typography>
                                        <Typography variant='caption'>/5.0</Typography>
                                    </div>
                                    <Typography variant='caption' gutterBottom align='left'>
                                        {rating.count}
                                        {' '}
                                        {rating.count === 1
                                            ? (
                                                <FormattedMessage
                                                    defaultMessage='user'
                                                    id='Apis.Listing.StarRatingBar.user'
                                                />
                                            )
                                            : (
                                                <FormattedMessage
                                                    defaultMessage='users'
                                                    id='Apis.Listing.StarRatingBar.users'
                                                />
                                            )
                                        }
                                    </Typography>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <StarRate
                                    className={classes.starRate}
                                    style={{ color: theme.palette.grey.A200 }}
                                />
                                <div className={classes.ratingSummary}>
                                    <Typography variant='caption' gutterBottom align='left'>
                                        <FormattedMessage
                                            defaultMessage='Not Rated'
                                            id='Apis.Listing.StarRatingBar.not.rated'
                                        />
                                    </Typography>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {isEditable ? (
                            <React.Fragment>
                                <div className={classes.userRating}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Link>
                                            <StarRate
                                                key={i}
                                                className={rating.userRating >= i ? classes.starRate : classes.noStarRate}
                                                onClick={() => this.doRate(i)}
                                            />
                                        </Link>
                                    ))}
                                    <Link>
                                        <Cancel className={classes.removeRating} onClick={() => this.removeUserRating()} />
                                    </Link>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <StarRate
                                        key={i}
                                        className={rating.avgRating >= (i - 0.5) ? classes.starRate : classes.noStarRate}
                                    />
                                ))}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

StarRatingBar.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
    isEditable: PropTypes.bool.isRequired,
    showSummary: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(StarRatingBar);
