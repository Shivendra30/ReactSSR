import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAdmins } from "../actions/index.js";
import requireAuth from "../components/hocs/requireAuth";
import { Helmet } from "react-helmet";

class AdminsListPage extends Component {
  componentDidMount() {
    this.props.fetchAdmins();
  }
  head() {
    return (
      <Helmet>
        <title>{`${this.props.admins.length} Admins Loaded`}</title>
        <meta property="og:title" content="Users App" />
      </Helmet>
    );
  }

  renderAdmins() {
    return this.props.admins.map(admin => <li key={admin.id}>{admin.name}</li>);
  }

  render() {
    return (
      <div>
        {this.head()}
        <h3>Protected List of Admins</h3>
        <ul>{this.renderAdmins()}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  admins: state.admins
});

export default {
  component: connect(mapStateToProps, { fetchAdmins })(
    requireAuth(AdminsListPage)
  ),
  loadData: ({ dispatch }) => dispatch(fetchAdmins())
};
