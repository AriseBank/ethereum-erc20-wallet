import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Divider, Grid, Dimmer, Loader} from 'semantic-ui-react';
import * as actionCreators from '../../actions/token';
import Account from '../../components/account/account';
import History from '../../components/history/history';
import FullScreenError from '../../components/error/fullscreen/full-screen';
import './wallet.css';

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletPage extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
        }).isRequired
    };

    componentDidMount() {
        const {actions, params} = this.props;
        const {address} = params;

        actions.loadAccount(address);
    };

    render() {
        const {error, isPending} = this.props.accountState;

        let walletView;

        if (isPending) {
            walletView = WalletPage.renderProgress();
        } else if (error) {
            walletView = this.renderError();
        } else {
            walletView = this.renderWallet();
        }

        return (
            <div>
                {walletView}
            </div>
        );
    };

    static renderProgress() {
        return (
            <Dimmer active inverted>
                <Loader size='huge'>Loading</Loader>
            </Dimmer>
        );
    };

    renderError() {
        const {error} = this.props.accountState;

        return (
            <FullScreenError
                payload={error}
            />
        );
    };

    renderWallet() {
        const {account} = this.props.accountState;
        const {history} = account;

        return (
            <Grid columns='equal'>
                <Grid.Column/>
                <Grid.Column width={14}>
                    <Account
                        account={account}
                    />

                    <Divider
                        horizontal
                        className='wallet_history_header'
                    >
                        Transaction History
                    </Divider>

                    <History
                        history={history}
                    />
                </Grid.Column>
                <Grid.Column/>
            </Grid>
        );
    };
}

function mapStateToProps(state) {
    return {
        accountState: state.account
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
}
