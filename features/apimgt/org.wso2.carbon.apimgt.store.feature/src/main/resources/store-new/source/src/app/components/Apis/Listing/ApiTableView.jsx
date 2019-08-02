import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { injectIntl, } from 'react-intl';
import ImageGenerator from './ImageGenerator';
import StarRatingBar from './StarRatingBar';
import API from '../../../data/api';

function LinkGenerator(props){
    return <Link to={"/apis/" + props.apiId}>{props.apiName}</Link>
}

class ApiTableView extends React.Component {
    constructor(props) {
        super(props);
    }

    getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTable: {
                root: {
                    backgroundColor: 'transparent',
                    marginLeft: 40,
                },
                paper: {
                    boxShadow: 'none',
                },
            },
            MUIDataTableBodyCell: {
                root: {
                    backgroundColor: 'transparent',
                },
            },
        },
    });

    render() {
        const { intl } = this.props;
        const columns = [
            {
                name: 'id',
                options: {
                    display: 'excluded',
                    filter: false,
                },
            },
            {
                name: 'image',
                label: intl.formatMessage({
                    id: 'Apis.Listing.ApiTableView.image',
                    defaultMessage: 'image'}),
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            const apiName = tableMeta.rowData[2];
                            return <ImageGenerator api={apiName} width={30} height={30} />;
                        }
                    },
                    sort: false,
                    filter: false,
                },
            },
            {
                name: 'name',
                label: intl.formatMessage({
                    id: 'Apis.Listing.ApiTableView.name',
                    defaultMessage: 'name'}),
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            const apiName = tableMeta.rowData[2];
                            const apiId = tableMeta.rowData[0];
                            return <LinkGenerator apiName={apiName} apiId={apiId} />;
                        }
                    },
                    sort: false,
                    filter: false,
                },
            },
            {
                name: 'version',
                label: intl.formatMessage({
                    id: 'Apis.Listing.ApiTableView.version',
                    defaultMessage: 'version'}),
            },
            {
                name: 'context',
                label: intl.formatMessage({
                    id: 'Apis.Listing.ApiTableView.context',
                    defaultMessage: 'context'}),
            },
            {
                name: 'rating',
                label: intl.formatMessage({
                    id: 'Apis.Listing.ApiTableView.rating',
                    defaultMessage: 'rating'}),
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            const apiId = tableMeta.rowData[0];
                            return <StarRatingBar apiId={apiId} isEditable={false} showSummary={false} />;
                        }
                    },
                },
            },
        ];

        const { apis } = this.props;

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable title='' data={apis} columns={columns} options={{ selectableRows: false }} />
            </MuiThemeProvider>
        );
    }
}

export default injectIntl(ApiTableView);
