'use strict';

import React from 'react';
import { connect } from 'react-redux';
import ListForm from '../list-form';
import * as util from '../../lib/util';
import * as listActions from '../../actions/list-actions';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.listFetch();
  }

  render() {
    return (
      <div className='dashboard'>
        <h2>recipe list app</h2>
        <ListForm 
          onComplete={this.props.listCreate}
          buttonText='create list' />
        
        {this.props.lists.map( list =>
          <div key={list._id}>
            <p>{list.title}</p>
            <button onClick={() => this.props.listDestroy(list)}>X</button>
          </div> 
          )}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  listCreate: list => dispatch(listActions.listCreateRequest(list)), 
  listDestroy: list => dispatch(listActions.listDestroyRequest(list)), 
  listFetch: () => dispatch(listActions.listFetchRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);